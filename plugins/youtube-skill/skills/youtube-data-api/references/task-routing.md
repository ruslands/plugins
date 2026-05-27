# Task Routing for YouTube Data API v3

Derived from:

- https://developers.google.com/youtube/v3/getting-started
- https://developers.google.com/youtube/v3/docs
- https://developers.google.com/youtube/v3/docs/playlistImages

Use this file to map a product request to the right API surface quickly.

| User intent | Primary method(s) | Auth | Notes |
| --- | --- | --- | --- |
| Read channel metadata | `channels.list` | API key or OAuth | use OAuth if owner-only fields are required |
| Get a channel's uploads | `channels.list` -> `playlistItems.list` | API key or OAuth | cheaper and more deterministic than search |
| Read playlist metadata | `playlists.list` | API key or OAuth | good for titles, descriptions, ownership, status |
| Read videos in a playlist | `playlistItems.list` | API key or OAuth | follow with `videos.list` for richer video details |
| Read exact video details | `videos.list` | API key or OAuth | prefer this after discovery instead of overusing search |
| Search for videos/channels/playlists | `search.list` | API key or OAuth | high quota cost; use only for discovery |
| Create or update a playlist | `playlists.insert`, `playlists.update`, `playlists.delete` | OAuth | owner action |
| Add or remove an item from a playlist | `playlistItems.insert`, `playlistItems.update`, `playlistItems.delete` | OAuth | owner action |
| Read comment threads | `commentThreads.list` | API key or OAuth | top-level thread view |
| Read replies for a thread | `comments.list` | API key or OAuth | use when thread preview is insufficient |
| Create a top-level comment | `commentThreads.insert` | OAuth | top-level only |
| Reply to a comment | `comments.insert` | OAuth | reply flow |
| Moderate a comment | `comments.setModerationStatus` | OAuth | channel/video owner auth required |
| Read caption tracks | `captions.list` | OAuth in owner flows | metadata only; no file body |
| Download caption content | `captions.download` | OAuth | actual subtitle file retrieval |
| Upload or replace captions | `captions.insert`, `captions.update`, `captions.delete` | OAuth | video-owner flow |
| Upload a video | `videos.insert` | OAuth | expensive; budget quota explicitly |
| Update video metadata/status | `videos.update` | OAuth | validate category, title, privacy, localization fields |
| Delete a video | `videos.delete` | OAuth | owner action |
| Rate a video or read my rating | `videos.rate`, `videos.getRating` | OAuth | authenticated user action |
| Report abuse | `videoAbuseReportReasons.list` -> `videos.reportAbuse` | OAuth | use reason list before submit |
| Set video thumbnail | `thumbnails.set` | OAuth | separate from playlist thumbnails |
| Set channel banner | `channelBanners.insert` -> `channels.update` | OAuth | staged banner workflow |
| Manage playlist thumbnail | `playlistImages.list`, `insert`, `update`, `delete` | OAuth | playlist artwork, not video thumbnail |
| Manage channel watermark | `watermarks.set`, `watermarks.unset` | OAuth | playback overlay |
| Read supported languages | `i18nLanguages.list` | API key or OAuth | good for `hl` choices |
| Read supported regions | `i18nRegions.list` | API key or OAuth | good for `regionCode` choices |
| Read valid video categories | `videoCategories.list` | API key or OAuth | use before setting `snippet.categoryId` |
| Read channel members or levels | `members.list`, `membershipsLevels.list` | OAuth | creator-owner access |

## Quota-aware alternatives

- If the user knows a video ID, use `videos.list`, not `search.list`.
- If the user knows a channel ID and wants uploads, use `channels.list` plus `playlistItems.list`, not `search.list`.
- If search is unavoidable, keep it as the discovery step and switch to resource-specific reads immediately afterward.

