#!/usr/bin/env node

import { parseArgs } from "node:util";
import {
  apiGet,
  handleCliError,
  loadConfig,
  printAndExit,
  requireConfig,
  ThreadsCliError
} from "./threads-lib.mjs";

function printHelp() {
  console.log(`Usage:
  threads-user.mjs debug-token
  threads-user.mjs me
  threads-user.mjs limit
  threads-user.mjs list-posts [--limit 10] [--fields id,text,timestamp,permalink]`);
}

async function main() {
  const config = await loadConfig();
  const [command] = process.argv.slice(2);

  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  requireConfig(config, ["accessToken"]);

  const { values } = parseArgs({
    args: process.argv.slice(3),
    options: {
      limit: { type: "string" },
      fields: { type: "string" }
    },
    allowPositionals: true
  });

  if (command === "debug-token") {
    const payload = await apiGet(config, "/debug_token", {
      access_token: config.accessToken,
      input_token: config.accessToken
    });
    printAndExit(payload);
    return;
  }

  requireConfig(config, ["userId"]);

  if (command === "me") {
    const payload = await apiGet(config, `/${config.userId}`, {
      access_token: config.accessToken,
      fields: "id,username,name,threads_profile_picture_url,threads_biography,is_verified"
    });
    printAndExit(payload);
    return;
  }

  if (command === "limit") {
    const payload = await apiGet(config, `/${config.userId}/threads_publishing_limit`, {
      access_token: config.accessToken,
      fields: "quota_usage,config"
    });
    printAndExit(payload);
    return;
  }

  if (command === "list-posts") {
    const limit = values.limit ? Number(values.limit) : 10;
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
      throw new ThreadsCliError("--limit must be a number from 1 to 100");
    }

    const payload = await apiGet(config, `/${config.userId}/threads`, {
      access_token: config.accessToken,
      limit,
      fields: values.fields ?? "id,media_type,text,timestamp,permalink,shortcode"
    });
    printAndExit(payload);
    return;
  }

  throw new ThreadsCliError(`Unknown command: ${command}`);
}

main().catch(handleCliError);
