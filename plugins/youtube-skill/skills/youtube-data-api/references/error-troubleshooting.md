# Error Troubleshooting for YouTube Data API v3

Source:

- https://developers.google.com/youtube/v3/docs/errors

Use this file when a request fails and you need a fast path from HTTP error to likely fix.

## First checks

1. Confirm the failing method exactly, not just the resource family.
2. Confirm whether the request should be API-key based or OAuth-based.
3. Re-check required parameters, request body shape, and ownership assumptions.
4. Re-check whether the requested ID really exists and belongs to the expected owner.

## Error families

### `400 badRequest`

Usually means:

- invalid parameter combinations
- missing required media body for upload
- invalid metadata values
- unsupported enum-like values

Examples called out by the official errors reference:

- `invalidCategoryId`
- `invalidTitle`
- `invalidDescription`
- `invalidPublishAt`
- `invalidTags`
- `invalidVideoMetadata`
- `mediaBodyRequired`
- `emailNotVerified`
- `invalidRating`
- `invalidAbuseReason`

What to do:

- compare the request body against the target method's required fields
- validate IDs such as category IDs using lookup methods like `videoCategories.list`
- check whether the operation expects media upload bytes in addition to metadata

### `403 forbidden`

Usually means:

- wrong auth model
- missing owner privileges
- trying to access owner-only parts
- trying to set a property the account is not allowed to change

Examples from the official errors reference:

- `playlistItemsNotAccessible`
- `forbiddenPrivacySetting`
- `forbiddenLicenseSetting`
- `forbiddenEmbedSetting`
- `videoRatingDisabled`
- generic `forbidden` on owner-only reads or writes

What to do:

- confirm OAuth is being used where required
- confirm the authenticated account owns the channel, playlist, or video in question
- confirm the request is not asking for owner-only parts on someone else's resource

### `404 notFound`

Usually means:

- wrong ID
- deleted resource
- resource exists but not under the expected parent/owner context

Examples from the official errors reference:

- `videoNotFound`
- `playlistNotFound`

What to do:

- re-check the exact `id`, `videoId`, or `playlistId`
- verify that discovery results were not mixed between videos, playlists, and channels

### rate and abuse-report edge cases

The official errors reference also calls out:

- `rateLimitExceeded` for `videos.reportAbuse`
- `videoPurchaseRequired` and `emailNotVerified` for `videos.rate`

What to do:

- slow down user-driven loops for abuse reporting
- do not assume every authenticated account can rate every video

## Method-specific reminders

### `videos.list`

- owner-only parts such as `fileDetails`, `processingDetails`, and `suggestions` are restricted to the video's owner
- `myRating` also requires proper authorization

### `videos.update`

- the docs explicitly call out validation around:
  - category
  - title
  - description
  - privacy
  - localization/default language

### `playlistItems.list`

- `playlistItemsNotAccessible` usually means the caller is not allowed to read that playlist as requested

### `videos.insert`

- missing binary media causes `mediaBodyRequired`
- exceeding upload allowances can cause `uploadLimitExceeded`

## Practical debugging order

1. Verify auth model.
2. Verify ownership assumptions.
3. Verify the exact ID and resource type.
4. Verify required request body fields.
5. Verify whether the requested `part` set contains owner-only data.
6. Only then debug client-library or transport details.

