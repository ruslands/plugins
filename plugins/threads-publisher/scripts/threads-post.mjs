#!/usr/bin/env node

import { parseArgs } from "node:util";
import {
  apiGet,
  apiPostForm,
  handleCliError,
  loadConfig,
  loadDrafts,
  parseCsv,
  printAndExit,
  readTextFile,
  requireConfig,
  resolvePluginPath,
  ThreadsCliError,
  utf8Bytes,
  waitForContainer
} from "./threads-lib.mjs";

function printHelp() {
  console.log(`Usage:
  threads-post.mjs list-drafts [--drafts-file ./drafts/posts.md]
  threads-post.mjs split --draft <TITLE>
  threads-post.mjs publish --draft <TITLE>
  threads-post.mjs publish --text <TEXT>
  threads-post.mjs publish --text-file <FILE>
  threads-post.mjs publish --text <TEXT> --image-url <PUBLIC_URL>

Options for publish:
  --draft <TITLE>
  --drafts-file <FILE>
  --text <TEXT>
  --text-file <FILE>
  --image-url <PUBLIC_URL>
  --video-url <PUBLIC_URL>
  --link-attachment <PUBLIC_URL>
  --topic-tag <TAG>
  --reply-control <VALUE>
  --reply-to-id <POST_ID>
  --quote-post-id <POST_ID>
  --alt-text <TEXT>
  --country-codes <US,AE,...>
  --limit <NUMBER>
  --interval-sec <NUMBER>
  --timeout-sec <NUMBER>
  --skip-limit-check
  --dry-run`);
}

function splitLongUnit(text, limit) {
  const sentences = text.split(/(?<=[.!?])\s+/u).map((item) => item.trim()).filter(Boolean);
  if (sentences.length > 1) {
    return mergeUnits(sentences, limit, " ");
  }

  const words = text.split(/\s+/u).map((item) => item.trim()).filter(Boolean);
  return mergeUnits(words, limit, " ");
}

function mergeUnits(units, limit, separator) {
  const chunks = [];
  let current = "";

  for (const unit of units) {
    if (!current) {
      if (utf8Bytes(unit) <= limit) {
        current = unit;
        continue;
      }

      const parts = [];
      let piece = "";
      for (const char of Array.from(unit)) {
        const candidate = piece + char;
        if (utf8Bytes(candidate) > limit) {
          parts.push(piece);
          piece = char;
        } else {
          piece = candidate;
        }
      }
      if (piece) {
        parts.push(piece);
      }
      chunks.push(...parts);
      continue;
    }

    const candidate = `${current}${separator}${unit}`;
    if (utf8Bytes(candidate) <= limit) {
      current = candidate;
      continue;
    }

    chunks.push(current);
    if (utf8Bytes(unit) <= limit) {
      current = unit;
      continue;
    }

    chunks.push(...splitLongUnit(unit, limit));
    current = "";
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function splitTextForThreads(text, limit) {
  const paragraphs = text.split(/\n\s*\n/u).map((item) => item.trim()).filter(Boolean);

  const expanded = [];
  for (const paragraph of paragraphs) {
    if (utf8Bytes(paragraph) <= limit) {
      expanded.push(paragraph);
      continue;
    }
    expanded.push(...splitLongUnit(paragraph, limit));
  }

  return mergeUnits(expanded, limit, "\n\n");
}

function resolveTextInputs(values) {
  const inputs = [values.draft, values.text, values["text-file"]].filter(Boolean);
  if (inputs.length > 1) {
    throw new ThreadsCliError("Use only one of --draft, --text, or --text-file.");
  }
}

async function resolveDraftText(config, values) {
  if (!values.draft) {
    return null;
  }
  const draftsFile = resolvePluginPath(values["drafts-file"]) ?? config.draftsFile;
  const drafts = await loadDrafts(draftsFile);
  const draft = drafts.find((entry) => entry.title === values.draft);
  if (!draft) {
    throw new ThreadsCliError(`Draft not found: ${values.draft}`);
  }
  return draft.body;
}

async function resolvePostText(config, values) {
  resolveTextInputs(values);

  if (values.text) {
    return values.text.trim();
  }

  if (values["text-file"]) {
    const filePath = resolvePluginPath(values["text-file"]);
    return (await readTextFile(filePath)).trim();
  }

  const draftText = await resolveDraftText(config, values);
  if (draftText) {
    return draftText;
  }

  return "";
}

async function maybeCheckLimit(config) {
  const limitPayload = await apiGet(config, `/${config.userId}/threads_publishing_limit`, {
    access_token: config.accessToken,
    fields: "quota_usage,config"
  });

  const limitData = Array.isArray(limitPayload?.data) ? limitPayload.data[0] : null;
  if (!limitData) {
    return limitPayload;
  }

  const usage = Number(limitData.quota_usage ?? 0);
  const total = Number(limitData.config?.quota_total ?? 250);
  if (Number.isFinite(usage) && Number.isFinite(total) && usage >= total) {
    throw new ThreadsCliError(`Publishing limit reached: ${usage}/${total} posts in the last 24 hours.`, limitPayload);
  }

  return limitPayload;
}

async function listDrafts(config, values) {
  const draftsFile = resolvePluginPath(values["drafts-file"]) ?? config.draftsFile;
  const drafts = await loadDrafts(draftsFile);
  printAndExit(
    drafts.map((draft) => ({
      title: draft.title,
      utf8_bytes: utf8Bytes(draft.body),
      preview: draft.body.split(/\r?\n/)[0]
    }))
  );
}

async function publish(config, values) {
  const imageUrl = values["image-url"];
  const videoUrl = values["video-url"];
  if (imageUrl && videoUrl) {
    throw new ThreadsCliError("Use either --image-url or --video-url, not both.");
  }

  const text = await resolvePostText(config, values);
  const mediaType = imageUrl ? "IMAGE" : videoUrl ? "VIDEO" : "TEXT";

  if (mediaType === "TEXT" && !text) {
    throw new ThreadsCliError("Text posts require content. Use --text, --text-file, or --draft.");
  }

  const textBytes = utf8Bytes(text);
  if (text && textBytes > 500) {
    throw new ThreadsCliError(`Text exceeds Threads limit: ${textBytes} UTF-8 bytes (max 500). Use the split command to prepare a publishable chunk.`);
  }

  const createPayload = {
    media_type: mediaType,
    text: text || undefined,
    image_url: imageUrl || undefined,
    video_url: videoUrl || undefined,
    link_attachment: values["link-attachment"] || undefined,
    topic_tag: values["topic-tag"] || undefined,
    reply_control: values["reply-control"] || undefined,
    reply_to_id: values["reply-to-id"] || undefined,
    quote_post_id: values["quote-post-id"] || undefined,
    alt_text: values["alt-text"] || undefined,
    allowlisted_country_codes: parseCsv(values["country-codes"])
  };

  if (values["dry-run"]) {
    printAndExit({
      dry_run: true,
      create_payload: createPayload,
      text_utf8_bytes: textBytes
    });
    return;
  }

  requireConfig(config, ["accessToken", "userId"]);

  if (!values["skip-limit-check"]) {
    await maybeCheckLimit(config);
  }

  const container = await apiPostForm(config, `/${config.userId}/threads`, {
    ...createPayload,
    access_token: config.accessToken
  });

  if (!container?.id) {
    throw new ThreadsCliError("Threads API did not return a media container id.", container);
  }

  if (mediaType !== "TEXT") {
    await waitForContainer(config, container.id, {
      intervalMs: Number(values["interval-sec"] ?? 5) * 1000,
      timeoutMs: Number(values["timeout-sec"] ?? 180) * 1000
    });
  }

  const published = await apiPostForm(config, `/${config.userId}/threads_publish`, {
    creation_id: container.id,
    access_token: config.accessToken
  });

  let details = null;
  if (published?.id) {
    try {
      details = await apiGet(config, `/${published.id}`, {
        access_token: config.accessToken,
        fields: "id,media_type,text,timestamp,permalink,shortcode"
      });
    } catch (error) {
      details = {
        warning: "Published successfully, but immediate details fetch failed.",
        message: error instanceof Error ? error.message : String(error)
      };
    }
  }

  printAndExit({
    container_id: container.id,
    media_id: published?.id ?? null,
    text_utf8_bytes: textBytes,
    media_type: mediaType,
    details
  });
}

async function splitCommand(config, values) {
  const text = await resolvePostText(config, values);
  if (!text) {
    throw new ThreadsCliError("Split requires content. Use --draft, --text, or --text-file.");
  }

  const limit = values.limit ? Number(values.limit) : 500;
  if (!Number.isFinite(limit) || limit < 50) {
    throw new ThreadsCliError("--limit must be a number of at least 50.");
  }

  const chunks = splitTextForThreads(text, limit).map((chunk, index) => ({
    index: index + 1,
    utf8_bytes: utf8Bytes(chunk),
    text: chunk
  }));

  printAndExit({
    chunk_count: chunks.length,
    limit,
    chunks
  });
}

async function main() {
  const config = await loadConfig();
  const [command] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      draft: { type: "string" },
      "drafts-file": { type: "string" },
      text: { type: "string" },
      "text-file": { type: "string" },
      "image-url": { type: "string" },
      "video-url": { type: "string" },
      "link-attachment": { type: "string" },
      "topic-tag": { type: "string" },
      "reply-control": { type: "string" },
      "reply-to-id": { type: "string" },
      "quote-post-id": { type: "string" },
      "alt-text": { type: "string" },
      "country-codes": { type: "string" },
      limit: { type: "string" },
      "interval-sec": { type: "string" },
      "timeout-sec": { type: "string" },
      "skip-limit-check": { type: "boolean" },
      "dry-run": { type: "boolean" }
    },
    allowPositionals: true
  });

  if (command === "list-drafts") {
    await listDrafts(config, values);
    return;
  }

  if (command === "split") {
    await splitCommand(config, values);
    return;
  }

  if (command === "publish") {
    await publish(config, values);
    return;
  }

  throw new ThreadsCliError(`Unknown command: ${command}`);
}

main().catch(handleCliError);
