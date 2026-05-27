# YouTube Data API Reference Map

Source:

- https://developers.google.com/youtube/v3/docs
- https://developers.google.com/youtube/v3/docs/playlistImages

This file maps the API reference overview into actionable sections.

## Call the API

The reference page's request rules are the first gate:

- every request needs either an API key or OAuth 2.0 token
- every insert, update, and delete requires OAuth 2.0
- any request for authenticated-user private data requires OAuth 2.0
- some read methods can return extra owner-only data when authorized

Use this section first whenever auth is ambiguous.

## Resource map

| Resource | What it represents | Methods in the docs | Use it for |
| --- | --- | --- | --- |
| `activities` | Actions taken by a channel or user on YouTube | `list` | activity feeds and recent public/user actions |
| `captions` | Caption tracks attached to a single video | `list`, `insert`, `update`, `download`, `delete` | subtitle inventory, upload, replacement, download |
| `channelBanners` | Uploaded banner image URL used in channel branding | `insert` | upload banner art before `channels.update` |
| `channels` | YouTube channel metadata and branding settings | `list`, `update` | channel profile reads, branding updates, uploads playlist discovery |
| `channelSections` | Featured shelves/sections on a channel page | `list`, `insert`, `update`, `delete` | browse-view featured sections |
| `comments` | A single comment or reply | `list`, `insert`, `update`, `setModerationStatus`, `delete` | replies, edits, moderation status |
| `commentThreads` | Top-level comment plus replies preview | `list`, `insert` | thread reads and top-level comment creation |
| `i18nLanguages` | Supported YouTube UI languages | `list` | language selectors and localization support |
| `i18nRegions` | Supported content regions/locales | `list` | region selectors and region-aware calls |
| `members` | Members of a creator channel | `list` | member listing for the authenticated owner |
| `membershipsLevels` | Pricing/benefit levels for creator memberships | `list` | membership tier inspection |
| `playlistImages` | Thumbnail image attached to a playlist | `list`, `insert`, `update`, `delete` | playlist thumbnail management |
| `playlistItems` | Resources contained in a playlist | `list`, `insert`, `update`, `delete` | playlist membership, uploads playlist traversal |
| `playlists` | Playlist metadata | `list`, `insert`, `update`, `delete` | create and manage playlists |
| `search` | Search results that point to videos, channels, or playlists | `list` | discovery by keyword or filters |
| `subscriptions` | A user's channel subscriptions | `list`, `insert`, `delete` | read or modify subscriptions |
| `thumbnails` | Video thumbnail uploads | `set` | set a video's thumbnail image |
| `videoAbuseReportReasons` | Allowed reasons for abuse reports | `list` | populate abuse-report reason choices |
| `videoCategories` | Video categories by region | `list` | validate or choose category IDs |
| `videos` | Video metadata and write actions | `list`, `insert`, `update`, `rate`, `getRating`, `reportAbuse`, `delete` | video reads, upload, update, delete, rating, abuse reporting |
| `watermarks` | Channel watermark overlays | `set`, `unset` | watermark image management |

## Specialized sections worth remembering

### `captions`

- `list` only returns caption-track metadata.
- To get the actual caption file, use `captions.download`.
- `update` can change draft state, replace the file, or both.

### `channelBanners`

- This is a staged flow.
- Upload the binary image with `channelBanners.insert`.
- Then pass the returned URL into `channels.update` via `brandingSettings.image.bannerExternalUrl`.

### `channelSections`

- Sections are only visible when the channel uses browse view.
- The overview notes a maximum of `10` shelves per channel.

### `commentThreads` versus `comments`

- `commentThreads` is for top-level thread reads and top-level comment creation.
- Replies are still `comment` resources.
- If you need all replies for a thread, use `comments.list`.

### `playlistItems`

- This resource is the normal way to enumerate playlist contents.
- The docs explicitly note that a channel's uploaded videos are also exposed as a playlist.

### `playlistImages`

- This resource has its own reference page.
- Use it when the task is specifically about playlist thumbnails rather than video thumbnails or channel art.

### `search`

- `search.list` is discovery-oriented and expensive relative to most reads.
- Use it to find IDs, then switch to the specific owner resource for detailed reads.

### `videos`

- The docs group many important flows here:
  - public/private metadata reads
  - upload
  - update
  - delete
  - rating
  - rating lookup
  - abuse reporting

### `watermarks`

- This resource is specifically about the overlay shown during playback on a channel's videos.

## Non-resource sections on the reference page

### Standard Query Parameters

- The reference page links to the standard Google API system parameters documentation.
- Consult that only when you need cross-Google query parameters, not for basic YouTube resource design.

### Errors

- The reference page links to a dedicated errors reference plus global-domain errors.
- Use [error-troubleshooting.md](error-troubleshooting.md) before guessing at method-specific failures.

