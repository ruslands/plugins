---
name: agent-readiness-audit
description: This skill should be used when the user asks to "scan my site for agent readiness", "run an isitagentready audit", "use Agent Browser to check my site", "improve my site for AI agents", "fix robots.txt and agent discovery", or "turn an agent-readiness report into code changes" for a local web repo.
---

# Agent Readiness Audit

Use Agent Browser to open `isitagentready.com`, submit a public site URL, extract the rendered report and fix instructions, turn the failing checks into concrete repo edits, rerun the browser scan, and report what still needs manual infrastructure work.

Primary workflow is browser-driven. Only use the bundled helper script when the user explicitly asks for the raw API response or when you need to compare the browser result to the underlying JSON.

## Inputs

You need:

- The public site URL to scan
- The local repo that controls that site, app, docs, or infrastructure

If the user gives only a repo and no public URL, stop and ask for the deployed URL. If the URL points to a third-party site that this repo does not control, produce the report but do not edit code.

## Step 1: Run the scan in Agent Browser

Verify `agent-browser` is available before starting. If it is not installed or not working, stop and tell the user this plugin requires the `agent-browser` plugin or CLI.

Open the scanner and submit the site URL:

```bash
agent-browser open https://isitagentready.com
agent-browser find placeholder "https://example.com" fill "<site-url>"
agent-browser find role button click --name "Scan"
agent-browser wait --text "Scan another site"
agent-browser snapshot -i
```

Refs change after each page update. Re-snapshot before using `@eN` references again.

## Step 2: Extract the browser response

First collect the visible results summary:

```bash
cat <<'EOF' | agent-browser eval --stdin
(() => JSON.stringify({
  timestamp: document.querySelector('#results-timestamp')?.innerText?.trim() || '',
  scoreCard: document.querySelector('#score-card-container')?.innerText?.trim() || '',
  checks: document.querySelector('#check-categories')?.innerText?.trim() || ''
}, null, 2))()
EOF
```

Then open the remediation sheet and extract the full instructions that the site generated:

```bash
agent-browser find text "Improve the score" click
agent-browser wait --text "How to improve your score"
cat <<'EOF' | agent-browser eval --stdin
(() => document.querySelector('#fix-sheet-prompt')?.innerText?.trim() || '')()
EOF
```

If the site layout changes and those selectors stop working, fall back to:

1. `agent-browser snapshot -i`
2. locate the visible results controls again
3. use `agent-browser get text @eN` or another `eval --stdin` extraction against the new DOM shape

Optional raw API helper for debugging or comparison only:

```bash
python3 plugins/agent-readiness-skills/scripts/scan_agent_readiness.py <site-url> --output /tmp/agent-readiness-report.json
```

If the plugin is installed standalone and the current directory is the plugin root:

```bash
python3 scripts/scan_agent_readiness.py <site-url> --output /tmp/agent-readiness-report.json
```

## Step 3: Triage before editing

Treat the scan as an implementation queue, not a final answer.

Prioritize in this order:

1. `nextLevel.requirements` from the report
2. Failing checks with direct repo ownership
3. Neutral checks that are easy wins and clearly applicable
4. Infrastructure-only items that must be documented for manual follow-up

Before editing, locate the site surfaces that own the failing checks from the browser report:

- Static assets: `public/`, `static/`, `dist/`, `app/`, `src/`
- Server and middleware: `nginx`, `Caddyfile`, Express/Fastify routes, Next middleware, edge functions
- Discovery docs: `.well-known/`, API docs, `auth.md`, machine-readable metadata
- Build and deployment config: infra, hosting config, CI publish steps, sitemap generators

If the repo does not obviously own a failing surface, say so and leave it in follow-up rather than guessing.

## Step 4: Map checks to code changes

Use these mappings as the default implementation plan:

- `robotsTxt`
  Create or patch `robots.txt`, include at minimum a valid default policy and a `Sitemap:` directive when a sitemap exists.
- `sitemap`
  Add a generated or static sitemap, then reference it from `robots.txt`.
- `linkHeaders`
  Add homepage `Link` response headers that advertise machine-usable resources such as API catalogs, docs, or discovery endpoints.
- `markdownNegotiation`
  Add a markdown representation or content-negotiated markdown response for agent-readable content when the site is content-heavy.
- `robotsTxtAiRules` and `contentSignals`
  Extend `robots.txt` with explicit AI crawler handling only when the product policy is clear. Do not invent legal or policy text.
- `apiCatalog`
  Add `/.well-known/api-catalog` or equivalent machine-readable API entrypoint when the repo exposes APIs.
- `oauthDiscovery` and `oauthProtectedResource`
  Add well-known OAuth metadata only if the site actually owns auth or protected APIs.
- `authMd`
  Add `auth.md` when agents need authentication instructions for API use.
- `mcpServerCard`
  Add MCP server-card files only when the product actually exposes an MCP server.
- `agentSkills`
  Publish an Agent Skills index only when there are real callable skills or workflows to expose.
- `webMcp`
  Add WebMCP registrations only for apps that intentionally expose browser-callable tools.
- `dnsAid`
  Prefer infra-as-code updates if this repo owns DNS. Otherwise leave a manual DNS follow-up with the exact record family from the report evidence.
- `x402`, `mpp`, `ucp`, `acp`
  Only implement commerce protocol work for actual commerce surfaces. Otherwise leave neutral findings alone.

Do not cargo-cult every standard into every site. Only implement checks that fit the product and architecture.

## Step 5: Edit loop

For each chosen fix:

1. Read the owning file and nearby config.
2. Make the narrowest change that satisfies the failing check.
3. Keep machine-readable endpoints real, valid, and discoverable.
4. If the browser remediation text references a spec, endpoint, or discovery file, use it to shape the implementation.
5. If a fix requires deployment or DNS outside the repo, add a concrete follow-up note instead of pretending it is complete.

When multiple easy wins exist, start with the ones that usually move readiness fastest:

- `robots.txt`
- `sitemap.xml`
- homepage `Link` headers
- simple `.well-known/*` discovery files

## Step 6: Re-scan in Agent Browser

After edits, rerun the same Agent Browser scan against the same URL. Do not skip the browser step and assume the code change was enough.

Compare:

- readiness level before vs after
- checks that moved from `fail` to `pass`
- checks still failing because of deployment lag, DNS, or unsupported product scope

If the local code is fixed but the public site has not deployed yet, say that explicitly and do not treat the scan as a regression.

## Output

Deliver:

1. The initial scan summary
2. The code changes made
3. The rerun browser result and score movement
4. A short manual follow-up list for non-repo work

## Pairs naturally with

- `agent-browser` - when you need to inspect the public site or browser-exposed discovery behavior
- `github-dev` - to commit the resulting readiness fixes cleanly
