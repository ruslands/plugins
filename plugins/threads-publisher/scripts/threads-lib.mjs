#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
export const PLUGIN_DIR = resolve(__dirname, "..");
const DEFAULT_ENV_PATHS = [resolve(PLUGIN_DIR, ".env.local"), resolve(PLUGIN_DIR, ".env")];
const DEFAULT_STATE_PATH = resolve(PLUGIN_DIR, "state", "account.json");
const DEFAULT_DRAFTS_PATH = resolve(PLUGIN_DIR, "drafts", "posts.md");

export class ThreadsCliError extends Error {
  constructor(message, details = null) {
    super(message);
    this.name = "ThreadsCliError";
    this.details = details;
  }
}

export function json(value) {
  return JSON.stringify(value, null, 2);
}

export function trimToNull(value) {
  if (value == null) {
    return null;
  }
  const normalized = String(value).trim();
  return normalized ? normalized : null;
}

function normalizePath(value, fallback) {
  const raw = trimToNull(value);
  if (!raw) {
    return fallback;
  }
  return isAbsolute(raw) ? raw : resolve(PLUGIN_DIR, raw);
}

export function calculateExpiresAt(expiresInSeconds) {
  const seconds = Number(expiresInSeconds);
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return null;
  }
  return new Date(Date.now() + (seconds * 1000)).toISOString();
}

export async function loadDotenv(paths = DEFAULT_ENV_PATHS) {
  const values = {};
  for (const path of paths) {
    try {
      const raw = await readFile(path, "utf8");
      for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
          continue;
        }
        const index = trimmed.indexOf("=");
        const key = trimmed.slice(0, index).trim();
        let value = trimmed.slice(index + 1).trim();
        if (
          value.length >= 2 &&
          ((value.startsWith("\"") && value.endsWith("\"")) ||
            (value.startsWith("'") && value.endsWith("'")))
        ) {
          value = value.slice(1, -1);
        }
        values[key] = value;
      }
    } catch (error) {
      if (!(error && error.code === "ENOENT")) {
        throw error;
      }
    }
  }
  return values;
}

export async function readJsonIfExists(path) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return null;
    }
    if (error instanceof SyntaxError) {
      throw new ThreadsCliError(`Invalid JSON: ${path}`);
    }
    throw error;
  }
}

export async function writeJson(path, payload) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${json(payload)}\n`, "utf8");
}

export async function loadConfig() {
  const envPaths = [
    normalizePath(process.env.THREADS_ENV_FILE, null),
    ...DEFAULT_ENV_PATHS,
  ].filter(Boolean);
  const envFile = await loadDotenv(envPaths);
  const statePath = normalizePath(
    process.env.THREADS_STATE_FILE ?? envFile.THREADS_STATE_FILE,
    DEFAULT_STATE_PATH,
  );
  const state = (await readJsonIfExists(statePath)) ?? {};
  const merged = {
    ...state,
    ...envFile,
    ...process.env,
  };

  return {
    appId: trimToNull(merged.THREADS_APP_ID ?? merged.app_id),
    appSecret: trimToNull(merged.THREADS_APP_SECRET ?? merged.app_secret),
    redirectUri: trimToNull(merged.THREADS_REDIRECT_URI ?? merged.redirect_uri),
    accessToken: trimToNull(merged.THREADS_ACCESS_TOKEN ?? merged.access_token),
    userId: trimToNull(merged.THREADS_USER_ID ?? merged.user_id),
    apiBase: trimToNull(merged.THREADS_API_BASE ?? merged.api_base) ?? "https://graph.threads.net/v1.0",
    oauthBase: trimToNull(merged.THREADS_OAUTH_BASE ?? merged.oauth_base) ?? "https://graph.threads.net",
    draftsFile: normalizePath(merged.THREADS_DRAFTS_FILE ?? merged.drafts_file, DEFAULT_DRAFTS_PATH),
    statePath,
    state,
  };
}

export function requireConfig(config, fields) {
  const missing = fields.filter((field) => !config[field]);
  if (missing.length > 0) {
    throw new ThreadsCliError(`Missing required config values: ${missing.join(", ")}`);
  }
}

function buildUrl(base, path, params = {}) {
  const url = new URL(path, base.endsWith("/") ? base : `${base}/`);
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        url.searchParams.append(key, String(item));
      }
      continue;
    }
    url.searchParams.set(key, String(value));
  }
  return url;
}

async function parseResponse(response) {
  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    if (payload && typeof payload === "object" && payload.error) {
      throw new ThreadsCliError(
        `HTTP ${response.status}: ${payload.error.message ?? "Threads API error"}`,
        payload,
      );
    }
    if (payload && typeof payload === "object" && payload.error_message) {
      throw new ThreadsCliError(`HTTP ${response.status}: ${payload.error_message}`, payload);
    }
    throw new ThreadsCliError(`HTTP ${response.status}: ${typeof payload === "string" ? payload : response.statusText}`);
  }

  if (payload && typeof payload === "object" && payload.error) {
    throw new ThreadsCliError(payload.error.message ?? "Threads API error", payload);
  }

  return payload;
}

export async function apiGet(config, path, params = {}) {
  const url = buildUrl(config.apiBase, path, params);
  const response = await fetch(url, { method: "GET" });
  return parseResponse(response);
}

export async function apiPostForm(config, path, params = {}) {
  const url = buildUrl(config.apiBase, path);
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") {
      continue;
    }
    if (Array.isArray(value)) {
      body.set(key, value.join(","));
      continue;
    }
    body.set(key, String(value));
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  return parseResponse(response);
}

export async function oauthGet(config, path, params = {}) {
  const url = buildUrl(config.oauthBase, path, params);
  const response = await fetch(url, { method: "GET" });
  return parseResponse(response);
}

export async function oauthPostForm(config, path, params = {}) {
  const url = buildUrl(config.oauthBase, path);
  const body = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") {
      continue;
    }
    body.set(key, String(value));
  }
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  return parseResponse(response);
}

export async function saveState(config, patch) {
  const current = (await readJsonIfExists(config.statePath)) ?? {};
  const merged = {
    ...current,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await writeJson(config.statePath, merged);
  return merged;
}

export async function readTextFile(path) {
  return readFile(path, "utf8");
}

export function resolvePluginPath(input) {
  if (!input) {
    return null;
  }
  return isAbsolute(input) ? input : resolve(PLUGIN_DIR, input);
}

export function parseCsv(value) {
  const normalized = trimToNull(value);
  if (!normalized) {
    return [];
  }
  return normalized
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function utf8Bytes(text) {
  return Buffer.byteLength(text ?? "", "utf8");
}

export async function loadDrafts(draftsPath) {
  const raw = await readTextFile(draftsPath);
  const tableDrafts = loadTableDrafts(raw);
  if (tableDrafts.length > 0) {
    return tableDrafts;
  }

  const drafts = [];
  let current = null;

  for (const line of raw.split(/\r?\n/)) {
    const match = /^(#{2,6})\s+(.+?)\s*$/.exec(line);
    if (match) {
      if (current) {
        current.body = current.lines.join("\n").trim();
        delete current.lines;
        drafts.push(current);
      }
      current = {
        level: match[1].length,
        title: match[2].trim(),
        lines: [],
      };
      continue;
    }

    if (current) {
      current.lines.push(line);
    }
  }

  if (current) {
    current.body = current.lines.join("\n").trim();
    delete current.lines;
    drafts.push(current);
  }

  return drafts.filter((draft) => draft.body);
}

function splitMarkdownTableRow(line) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) {
    return null;
  }

  const cells = [];
  let current = "";
  let escaped = false;
  for (const char of trimmed.slice(1, -1)) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      current += char;
      escaped = true;
      continue;
    }
    if (char === "|") {
      cells.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }
  cells.push(current.trim());
  return cells;
}

function isMarkdownSeparatorRow(cells) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell.trim()));
}

function normalizeTablePostText(value) {
  return value
    .replace(/<br\s*\/?>/giu, "\n")
    .replace(/&nbsp;/giu, " ")
    .trim();
}

function isUnpublishedDate(value) {
  const normalized = String(value ?? "").trim();
  return !normalized || normalized === "-";
}

function loadTableDrafts(raw) {
  const lines = raw.split(/\r?\n/);
  let header = null;
  let textIndex = -1;
  let dateIndex = -1;
  let rowsStarted = false;
  let tableRowNumber = 0;
  const drafts = [];

  for (const line of lines) {
    const cells = splitMarkdownTableRow(line);
    if (!cells) {
      if (rowsStarted) {
        break;
      }
      continue;
    }

    if (!header) {
      const candidateTextIndex = cells.findIndex((cell) => cell.trim() === "Текст");
      const candidateDateIndex = cells.findIndex((cell) => cell.trim() === "Дата публикации");
      if (candidateTextIndex === -1 || candidateDateIndex === -1) {
        continue;
      }

      header = cells;
      textIndex = candidateTextIndex;
      dateIndex = candidateDateIndex;
      continue;
    }

    if (isMarkdownSeparatorRow(cells)) {
      rowsStarted = true;
      continue;
    }

    rowsStarted = true;
    tableRowNumber += 1;
    const text = normalizeTablePostText(cells[textIndex] ?? "");
    if (!text || !isUnpublishedDate(cells[dateIndex])) {
      continue;
    }

    drafts.push({
      level: 0,
      title: `post-${String(tableRowNumber).padStart(3, "0")}`,
      body: text,
      source: "table",
    });
  }

  return drafts;
}

export async function waitForContainer(config, containerId, { intervalMs = 5000, timeoutMs = 180000 } = {}) {
  const startedAt = Date.now();

  while (true) {
    const payload = await apiGet(config, `/${containerId}`, {
      fields: "id,status,error_message",
      access_token: config.accessToken,
    });

    const status = payload?.status ?? "UNKNOWN";
    if (status === "FINISHED" || status === "PUBLISHED") {
      return payload;
    }

    if (status === "ERROR" || status === "EXPIRED") {
      throw new ThreadsCliError(
        `Container ${containerId} is not publishable: ${status}${payload?.error_message ? ` (${payload.error_message})` : ""}`,
        payload,
      );
    }

    if (Date.now() - startedAt > timeoutMs) {
      throw new ThreadsCliError(`Timed out waiting for container ${containerId} to become publishable`);
    }

    await new Promise((resolvePromise) => setTimeout(resolvePromise, intervalMs));
  }
}

export function printAndExit(value) {
  console.log(typeof value === "string" ? value : json(value));
}

export function handleCliError(error) {
  if (error instanceof ThreadsCliError) {
    console.error(error.message);
    if (error.details) {
      console.error(json(error.details));
    }
    process.exit(1);
  }

  console.error(error);
  process.exit(1);
}
