---
name: memory-sync
description: This skill should be used when the user asks to "update memory from the repo", "sync durable knowledge", "persist project facts", or "scan changes for memory".
---

# Memory Sync

Use this skill to turn durable repository changes into structured memory updates.

## What To Capture

- New or changed modules, endpoints, migrations, and configuration
- New conventions or rules documented in ADRs, READMEs, or other docs
- Breaking changes and required environment variable names

## Working Approach

1. Read the project map and identify key folders, docs, and configs.
2. Inspect recent durable changes in docs, migrations, endpoints, and dependency files.
3. Extract stable facts into a JSON object with `entities`, `relations`, and `observations`.
4. Persist only durable knowledge through the available memory tools.
5. Summarize which entities were touched after the update completes.

## Output Shape

```json
{
  "entities": [{ "name": "", "entityType": "", "observations": [] }],
  "relations": [{ "from": "", "to": "", "relationType": "" }],
  "observations": [{ "entityName": "", "contents": [] }]
}
```
