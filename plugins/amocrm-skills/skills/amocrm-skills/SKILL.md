---
name: amocrm-skills
description: This skill should be used when the user asks to "integrate AmoCRM", "work with AmoCRM site visits", "build an AmoCRM digital pipeline", or "debug an AmoCRM CRM workflow".
---

# AmoCRM Skills

Use this skill when the task involves AmoCRM integrations, especially digital pipeline triggers and site visit events.

## Focus

- Identify which AmoCRM workflow or event should drive the integration
- Use existing project patterns before introducing new CRM abstractions
- Align payloads, field mappings, and event handling with AmoCRM docs
- Call out missing credentials, webhooks, or required custom fields early

## Working Approach

1. Inspect the codebase for existing CRM clients, webhook handlers, and integration settings.
2. Map the user task to the relevant AmoCRM event or pipeline stage.
3. Check the official documentation before proposing request formats or flow behavior.
4. Implement the smallest change that matches the current codebase structure.
5. Mention follow-up validation steps for webhooks, auth, and field mapping.

## Reference

- AmoCRM digital pipeline site visit docs: https://www.amocrm.ru/developers/content/digital_pipeline/site_visit
