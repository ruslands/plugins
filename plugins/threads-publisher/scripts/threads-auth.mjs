#!/usr/bin/env node

import { parseArgs } from "node:util";
import {
  calculateExpiresAt,
  handleCliError,
  json,
  loadConfig,
  oauthGet,
  oauthPostForm,
  printAndExit,
  requireConfig,
  saveState,
  ThreadsCliError,
} from "./threads-lib.mjs";

function printHelp() {
  console.log(`Usage:
  threads-auth.mjs auth-url [--scope threads_basic,threads_content_publish] [--state any]
  threads-auth.mjs exchange-code --code <AUTH_CODE>
  threads-auth.mjs exchange-long-lived [--access-token <SHORT_LIVED_TOKEN>]
  threads-auth.mjs refresh [--access-token <LONG_LIVED_TOKEN>]`);
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
      code: { type: "string" },
      scope: { type: "string" },
      state: { type: "string" },
      "access-token": { type: "string" }
    },
    allowPositionals: true
  });

  if (command === "auth-url") {
    requireConfig(config, ["appId", "redirectUri"]);
    const url = new URL("/oauth/authorize", "https://threads.net");
    url.searchParams.set("client_id", config.appId);
    url.searchParams.set("redirect_uri", config.redirectUri);
    url.searchParams.set("scope", values.scope ?? "threads_basic,threads_content_publish");
    url.searchParams.set("response_type", "code");
    if (values.state) {
      url.searchParams.set("state", values.state);
    }
    printAndExit(url.toString());
    return;
  }

  if (command === "exchange-code") {
    requireConfig(config, ["appId", "appSecret", "redirectUri"]);
    if (!values.code) {
      throw new ThreadsCliError("Missing required option: --code");
    }

    const payload = await oauthPostForm(config, "/oauth/access_token", {
      client_id: config.appId,
      client_secret: config.appSecret,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
      code: values.code
    });

    const state = await saveState(config, {
      access_token: payload.access_token,
      user_id: payload.user_id ? String(payload.user_id) : config.userId,
      token_kind: "short_lived",
      token_type: payload.token_type ?? "bearer",
      expires_in: 3600,
      expires_at: calculateExpiresAt(3600)
    });

    printAndExit({
      message: "Short-lived token saved.",
      state_path: config.statePath,
      user_id: state.user_id,
      expires_at: state.expires_at
    });
    return;
  }

  if (command === "exchange-long-lived") {
    requireConfig(config, ["appSecret"]);
    const accessToken = values["access-token"] ?? config.accessToken;
    if (!accessToken) {
      throw new ThreadsCliError("Missing short-lived access token. Set THREADS_ACCESS_TOKEN or use --access-token.");
    }

    const payload = await oauthGet(config, "/access_token", {
      grant_type: "th_exchange_token",
      client_secret: config.appSecret,
      access_token: accessToken
    });

    const state = await saveState(config, {
      access_token: payload.access_token,
      user_id: config.userId,
      token_kind: "long_lived",
      token_type: payload.token_type ?? "bearer",
      expires_in: payload.expires_in,
      expires_at: calculateExpiresAt(payload.expires_in)
    });

    printAndExit({
      message: "Long-lived token saved.",
      state_path: config.statePath,
      expires_at: state.expires_at
    });
    return;
  }

  if (command === "refresh") {
    const accessToken = values["access-token"] ?? config.accessToken;
    if (!accessToken) {
      throw new ThreadsCliError("Missing long-lived access token. Set THREADS_ACCESS_TOKEN or use --access-token.");
    }

    const payload = await oauthGet(config, "/refresh_access_token", {
      grant_type: "th_refresh_token",
      access_token: accessToken
    });

    const state = await saveState(config, {
      access_token: payload.access_token,
      user_id: config.userId,
      token_kind: "long_lived",
      token_type: payload.token_type ?? "bearer",
      expires_in: payload.expires_in,
      expires_at: calculateExpiresAt(payload.expires_in)
    });

    printAndExit({
      message: "Long-lived token refreshed.",
      state_path: config.statePath,
      expires_at: state.expires_at
    });
    return;
  }

  throw new ThreadsCliError(`Unknown command: ${command}\n${json({ supported_commands: ["auth-url", "exchange-code", "exchange-long-lived", "refresh"] })}`);
}

main().catch(handleCliError);
