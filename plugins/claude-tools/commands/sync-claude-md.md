---
allowed-tools: Read, Bash
description: Sync CLAUDE.md from GitHub repository
---

# Sync CLAUDE.md

Fetch the latest CLAUDE.md from ruslands/plugins GitHub repository and update ~/.claude/CLAUDE.md.

Use `gh api repos/ruslands/plugins/contents/.claude/CLAUDE.md --jq '.content' | base64 -d` to fetch the file content, then write to ~/.claude/CLAUDE.md. Confirm successful update with a message showing the file has been synced.
