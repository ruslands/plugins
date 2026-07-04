---
name: threads-publisher
description: This skill should be used when the user asks to "publish to Threads", "post to Threads", "use the Threads API", "get a Threads access token", or "find my Threads user id".
---

# Threads Publisher

Use this skill for Threads publishing work through the official Threads Graph API.

## Focus

- Use the bundled scripts in this plugin before inventing ad hoc curl flows
- Keep auth, token exchange, and publish requests aligned with official Threads API behavior
- Verify whether the task needs only `threads_basic` and `threads_content_publish` or also additional permissions
- Catch the 500 UTF-8 byte text limit before attempting to publish

## Bundled Files

- `scripts/threads-auth.mjs`
- `scripts/threads-user.mjs`
- `scripts/threads-post.mjs`
- `.env.example`
- `drafts/posts.md`

## Working Approach

1. Read `.env.local` or ask the user for the missing Threads app values.
2. For auth and tokens:
   - use `threads-auth.mjs auth-url`
   - use `threads-auth.mjs exchange-code`
   - use `threads-auth.mjs exchange-long-lived`
   - use `threads-auth.mjs refresh`
3. For user inspection:
   - use `threads-user.mjs debug-token` to extract `user_id`
   - use `threads-user.mjs me` and `limit` for profile and quota checks
4. For publishing:
   - use `threads-post.mjs list-drafts`
   - use `threads-post.mjs split` for long drafts
   - use `threads-post.mjs publish` for text, image, or video posts
5. Do not paste app secrets or long-lived tokens into tracked files.

## Notes

- Threads publishing still requires a Meta app and a user access token even for a single self-managed account.
- `user_id` can be returned by the code exchange response or by `debug-token`.
- Image and video publishing require public URLs.

## Reference

- Threads docs: https://developers.facebook.com/documentation/threads
- Access tokens: https://developers.facebook.com/documentation/threads/get-started/get-access-tokens-and-permissions
- Long-lived tokens: https://developers.facebook.com/documentation/threads/get-started/long-lived-tokens
