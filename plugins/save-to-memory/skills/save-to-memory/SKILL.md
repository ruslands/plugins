---
name: save-to-memory
description: This skill should be used when the user asks to "save this to memory", "persist facts from this task", "store durable knowledge", or "update memory after finishing work".
---

# Save To Memory

Use this skill after completing work when the result contains durable facts worth preserving.

## What To Save

- Stable project facts, not temporary debugging notes
- Concrete entities such as services, configs, modules, or integrations
- Atomic observations that remain useful after the current session ends

## Working Approach

1. Extract durable facts from the completed work.
2. Build a JSON object with `entities`, `relations`, and `observations`.
3. Create missing entities only.
4. Add active-voice relations and atomic observations.
5. Open the touched nodes and summarize what changed in memory.

## Output Shape

```json
{
  "entities": [{ "name": "", "entityType": "", "observations": [] }],
  "relations": [{ "from": "", "to": "", "relationType": "" }],
  "observations": [{ "entityName": "", "contents": [] }]
}
```
