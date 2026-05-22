---
name: yandex-ai-studio
description: This skill should be used when the user asks to "use Yandex AI Studio", "build with Yandex models", "integrate Yandex AI", or "check Yandex AI Studio docs".
---

# Yandex AI Studio

Use this skill for Yandex AI Studio platform tasks, model integration work, and implementation guidance tied to official documentation.

## Focus

- Map the user task to the correct Yandex AI Studio capability before coding
- Inspect the repository for current AI provider abstractions and config patterns
- Prefer concrete doc-backed implementation details over guesses
- Surface required credentials, endpoints, or environment configuration early

## Working Approach

1. Inspect the codebase for current AI integrations and model configuration.
2. Identify whether the task concerns model calls, platform setup, or a migration.
3. Check the official Yandex AI Studio docs before proposing API usage.
4. Implement changes in the smallest way that matches the current codebase.
5. Mention follow-up validation for auth, endpoints, and request formats.

## Reference

- Yandex AI Studio docs: https://aistudio.yandex.ru/docs/en/
