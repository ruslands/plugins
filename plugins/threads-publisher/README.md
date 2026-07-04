# Threads Publisher

Threads publishing plugin for Claude Code, Codex CLI, Gemini CLI, and Cursor.

## What it includes

- OAuth helper for auth URL, code exchange, long-lived token exchange, and refresh
- Token debug helper to extract `user_id` and scopes
- Profile, post list, and publishing-limit inspection
- Draft listing and text splitting for the 500 UTF-8 byte Threads text limit
- Text and media post publishing using the official Threads Graph API

## Local setup

1. Copy `.env.example` to `.env.local`
2. Fill in the Threads app values and token values
3. Use the bundled scripts in `scripts/`

You can also point the plugin at an external env file:

```bash
THREADS_ENV_FILE=/absolute/path/to/.env.local node scripts/threads-post.mjs list-drafts
```

Drafts can be stored either as markdown sections (`## Draft title`) or as a markdown table with columns `Текст` and `Дата публикации`. Table rows with an empty date or `-` are treated as unpublished drafts and get stable ids like `post-005`.

## Commands

```bash
node scripts/threads-auth.mjs auth-url
node scripts/threads-auth.mjs exchange-code --code '<CODE>'
node scripts/threads-auth.mjs exchange-long-lived
node scripts/threads-auth.mjs refresh
```

```bash
node scripts/threads-user.mjs debug-token
node scripts/threads-user.mjs me
node scripts/threads-user.mjs limit
node scripts/threads-user.mjs list-posts --limit 10
```

```bash
node scripts/threads-post.mjs list-drafts
node scripts/threads-post.mjs list-drafts --drafts-file /absolute/path/to/posts.md
node scripts/threads-post.mjs split --draft 'Launch note'
node scripts/threads-post.mjs publish --draft 'Launch note'
node scripts/threads-post.mjs publish --text 'Hello from Threads'
node scripts/threads-post.mjs publish --text 'Post with image' --image-url 'https://example.com/image.png'
```
