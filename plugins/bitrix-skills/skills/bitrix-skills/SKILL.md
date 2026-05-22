---
name: bitrix-skills
description: This skill should be used when the user asks to "integrate Bitrix24", "use the Bitrix API", "automate Bitrix tasks", or "connect a CRM workflow to Bitrix".
---

# Bitrix Skills

Use this skill for Bitrix24 API work involving CRM records, tasks, projects, and platform integrations.

## Focus

- Find existing Bitrix adapters, tokens, and endpoint conventions in the project
- Match requested behavior to the correct Bitrix24 API surface
- Keep payload structures and auth handling aligned with current code patterns
- Flag required webhooks, app scopes, or portal-specific configuration

## Working Approach

1. Inspect the repository for Bitrix services, API wrappers, and config.
2. Confirm which Bitrix entity or workflow the task affects.
3. Check the official docs before defining endpoints or request payloads.
4. Implement the change using the existing service structure.
5. Note any verification needed for sandbox portals, webhooks, or permissions.

## Reference

- Bitrix24 API and integrations docs: https://www.bitrix24.eu/tools/tasks_and_projects/api-and-integrations.php
