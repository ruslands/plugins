---
name: bitrix-skills
description: This skill should be used when the user asks to "integrate Bitrix24", "build a Bitrix24 telephony app", "publish an app in the Bitrix24 Marketplace", "use the Bitrix API", "automate Bitrix tasks", or "connect a CRM workflow to Bitrix".
---

# Bitrix Skills

Use this skill for Bitrix24 integration work. For telephony, OAuth, events, and Marketplace publication, treat [references/bitrix24-aiva-telephony-docs.md](references/bitrix24-aiva-telephony-docs.md) as the primary routing map.

## Focus

- Find existing Bitrix adapters, tokens, event handlers, and endpoint conventions in the project
- Match the task to the correct Bitrix24 surface before writing code
- Prefer official `apidocs.bitrix24.ru` pages and use `apidocs.bitrix24.com` only as an English mirror or fallback
- Distinguish between webhook, local app, and Marketplace app early
- Flag required scopes, app-only methods, event subscriptions, and moderation constraints

## Routing

For an Aiva-style incoming calls integration, route the work like this:

1. Product shape and publication
- If the task is about a Marketplace-ready SaaS app or support for many client portals, open the Marketplace docs first.
- For telephony publication, always read the telephony publication requirements before implementation.
- Use this route when the request mentions install flow, moderation, sandbox, vendor cabinet, pricing, or app code.

2. Authorization and scopes
- If the task mentions install, callback, tokens, refresh, or permissions, open the OAuth and scopes docs first.
- If the integration is a mass-market app, prefer OAuth 2.0 docs over webhook docs.
- If the integration is a one-portal automation, webhook docs may be enough; call out when that approach is incompatible with telephony Marketplace scenarios.

3. Call lifecycle
- Start with the telephony overview page, then open the exact method pages for the lifecycle you need.
- For inbound calls, the normal order is `telephony.externalLine.add` -> `telephony.externalCall.register` -> optional `telephony.externalCall.searchCrmEntities` / `telephony.externalCall.show` -> `telephony.externalCall.finish` -> `telephony.externalCall.attachRecord` -> optional `telephony.call.attachTranscription`.
- Remember that `telephony.externalCall.register` and `telephony.externalCall.finish` work only in application context.

4. Events and CRM-triggered routing
- If the task mentions click2call, callback forms, outbound initiation, or subscriptions, open the telephony events overview first.
- Use `event.bind` for application subscriptions.
- `OnExternalCallStart` is available only through an application.
- `OnExternalCallBackStart` can be received through an application or an outgoing webhook.

5. Embedded UI
- If the task includes a Bitrix24 iframe settings page or other embedded frontend, open the UI example and `BX24.getAuth`.
- If the integration is backend-only, use the no-UI server-side example as the closer reference.

6. Operations and maintenance
- If the task mentions rate limits, event delivery problems, moderation feedback, or API drift, open limits, support, and changelog docs.

## Working Approach

1. Inspect the repository for Bitrix clients, auth storage, webhook handlers, and install flow.
2. Decide whether the requested behavior belongs to webhook, local app, or Marketplace app.
3. Open the exact docs from [references/bitrix24-aiva-telephony-docs.md](references/bitrix24-aiva-telephony-docs.md) before proposing endpoints, event names, or payloads.
4. Implement the smallest change that matches the current service structure.
5. Note follow-up verification for scopes, public handler reachability, sandbox portals, or Marketplace moderation.

## High-Signal Checks

- Confirm whether the solution must support many client portals. If yes, route to a mass-market app with OAuth 2.0.
- Confirm whether the method works only in application context.
- Confirm whether the task needs only `telephony` or also `crm`.
- Confirm whether the event handler is reachable from outside and can be tested from Bitrix24.
- Use the canonical telephony events URL with `index.html`; do not rely on the bare directory path.

## Reference

- Detailed docs map: [references/bitrix24-aiva-telephony-docs.md](references/bitrix24-aiva-telephony-docs.md)
