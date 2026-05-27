---
name: youtube-data-api
description: This skill should be used when the user asks to "integrate YouTube Data API", "work with the YouTube API", "fetch channel videos", "read playlist items", "search YouTube", "upload a YouTube video", "manage captions", "moderate YouTube comments", or build, review, or fix code that calls YouTube Data API v3.
---

# YouTube Data API v3

Use this skill for implementation work against YouTube Data API v3. It is based on the official overview and API reference and is organized so you can route a task to the correct resource, auth model, and response shape quickly.

## What this skill covers

- Public reads with API key access
- Private reads and all writes with OAuth 2.0
- Resource selection across channels, videos, playlists, comments, captions, thumbnails, memberships, and search
- Quota-aware request design
- Partial responses using `part` and `fields`
- Error triage using the official errors reference

## Start here

1. Identify whether the user needs public data, private user data, or a write operation.
2. Choose the primary resource and method from [references/api-reference-map.md](references/api-reference-map.md).
3. Choose auth:
   - API key for public read-only flows
   - OAuth 2.0 for insert, update, delete, uploads, moderation, rating, abuse reporting, or private user data
4. Estimate quota cost before designing loops or bulk jobs:
   - most reads usually cost `1`
   - writes usually cost `50`
   - `search.list` costs `100`
   - `videos.insert` costs `100`
5. Minimize the payload:
   - `part` is required for requests that retrieve or return a resource
   - `fields` narrows the nested response further
6. Only then implement the request flow, pagination, persistence, or UI integration.

## Core rules

### Auth rules

- Every request needs either `key` or OAuth 2.0 credentials.
- All insert, update, and delete requests require OAuth 2.0.
- Any request for authenticated-user private data requires OAuth 2.0.
- Some `list` calls can be public or authorized; authorized requests may return extra private metadata for the authenticated owner.

### Response-shaping rules

- Always choose the smallest useful `part` set.
- Add `fields` when you only need a few nested properties.
- Prefer a two-step flow over requesting huge payloads:
  - example: `search.list` to discover IDs, then `videos.list` for details
  - example: `channels.list` to get the uploads playlist, then `playlistItems.list` to enumerate uploads

### Quota rules

- Invalid requests still consume quota.
- Avoid `search.list` when you already know a channel ID, playlist ID, or video ID.
- Avoid wide polling loops unless the user explicitly needs them.
- When reading many videos, batch IDs into a single `videos.list` where possible instead of one request per video.

## Task routing

- Need channel profile, branding, uploads playlist, or channel settings:
  read `channels`
- Need the videos inside a playlist or a channel uploads feed:
  read `playlistItems`
- Need playlist metadata:
  read `playlists`
- Need direct video metadata, status, statistics, or upload/update/delete:
  read `videos`
- Need public discovery by keyword or topic:
  read `search`
- Need comments:
  use `commentThreads` for top-level threads and `comments` for replies/moderation details
- Need captions or subtitle files:
  use `captions`
- Need channel art or video thumbnails:
  use `channelBanners`, `thumbnails`, `watermarks`, or `playlistImages`
- Need memberships:
  use `members` and `membershipsLevels`
- Need localization helpers:
  use `i18nLanguages`, `i18nRegions`, and `videoCategories`

## Documentation map

### Getting Started page

Use [references/getting-started.md](references/getting-started.md) for a section-by-section map of:

- prerequisites and credential setup
- resource model and supported operations
- quota behavior and cost examples
- partial resources via `part`
- nested field filtering via `fields`

### API Reference page

Use [references/api-reference-map.md](references/api-reference-map.md) for a section-by-section map of:

- request requirements
- every resource family and its methods
- which resources are read-only versus writable
- special methods like `captions.download`, `videos.rate`, `videos.reportAbuse`, `thumbnails.set`, and `watermarks.set`

### Practical implementation routing

Use [references/task-routing.md](references/task-routing.md) when you need a fast mapping from user intent to:

- resource
- method
- auth model
- quota-sensitive alternatives

### Errors

Use [references/error-troubleshooting.md](references/error-troubleshooting.md) when implementation fails with:

- `400 badRequest`
- `403 forbidden`
- `404 notFound`
- method-specific validation failures

## Recommended workflow

1. Translate the user request into one concrete API job.
2. Pick the narrowest resource that owns that job.
3. Confirm whether the job is public-read, private-read, or write.
4. Design the minimal `part` set.
5. Add `fields` if the response still contains excess nested data.
6. Check whether a cheaper flow exists than `search.list`.
7. Implement pagination and retries only if the task needs them.
8. If an error occurs, map the failing method to the official error list before guessing.

## Common patterns

### Get a channel's latest uploads

1. Call `channels.list` with the channel ID and the part that exposes uploads playlist details.
2. Read the uploads playlist ID from the response.
3. Call `playlistItems.list` on that playlist.
4. If you need richer video metadata, follow with `videos.list` on the collected video IDs.

This is usually better than searching the channel by keyword because it is deterministic and cheaper than `search.list`.

### Search first, enrich second

1. Use `search.list` only to discover IDs.
2. Use `videos.list`, `channels.list`, or `playlists.list` to retrieve the real resource details you need.

### Comment handling

- Use `commentThreads.list` to retrieve top-level discussion threads.
- Use `comments.list` if you need complete replies for a thread.
- Use `commentThreads.insert` for new top-level comments.
- Use `comments.insert` for replies.
- Use `comments.setModerationStatus` for moderation flows.

### Media and branding updates

- Channel banner:
  `channelBanners.insert` first, then `channels.update`
- Video thumbnail:
  `thumbnails.set`
- Playlist thumbnail:
  `playlistImages.insert` or `playlistImages.update`
- Watermark overlay:
  `watermarks.set` and `watermarks.unset`

## Scope guardrails

- Do not confuse YouTube Data API resource work with frontend embed/player work unless the user explicitly needs both.
- Do not assume public API key access is enough for owner-only fields.
- Do not request broad `part` sets like `snippet,contentDetails,statistics,status,player,topicDetails` unless the task truly needs them.
- Do not build high-volume search crawlers without quota discussion first.

## Output expectations

When using this skill, produce implementation guidance or code that clearly states:

- chosen resource and method
- auth model
- selected `part`
- selected `fields` if used
- quota-sensitive tradeoffs
- any method-specific constraints from the docs

