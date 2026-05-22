---
name: telegram-skills
description: This skill should be used when the user asks to "build a Telegram bot", "integrate Telegram", "use the Telegram API", or "debug Telegram bot behavior".
---

# Telegram Skills

Use this skill for Telegram bot features, message flows, bot commands, and API integration work.

## Focus

- Match the task to the right Telegram API capability before changing code
- Inspect existing bot handlers, webhook setup, and message formatting conventions
- Keep callback data, command routing, and auth flow consistent with the current codebase
- Flag deployment needs such as webhooks, tokens, or polling configuration

## Working Approach

1. Inspect the repository for Telegram clients, handlers, and bot configuration.
2. Identify which bot capability or API method the task needs.
3. Check the official Telegram docs before proposing message or webhook behavior.
4. Implement the smallest change that preserves current bot architecture.
5. Mention validation steps for command flow, callbacks, and delivery path.

## Reference

- Telegram API docs: https://core.telegram.org
