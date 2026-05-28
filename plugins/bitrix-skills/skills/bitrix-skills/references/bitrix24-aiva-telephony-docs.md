# Bitrix24 Aiva Telephony Docs Map

Verified against the official Bitrix24 docs on 2026-05-28.

## Canonical URL Rules

- Prefer Russian docs on `https://apidocs.bitrix24.ru/`.
- Use `https://apidocs.bitrix24.com/` only as an English mirror or fallback.
- For the telephony events overview, use the canonical page URL with `index.html`:
  `https://apidocs.bitrix24.ru/api-reference/telephony/events/index.html`

## Fast Routing

| If the task is about | Open first | Then open | Why |
| --- | --- | --- | --- |
| Publishing Aiva as a Marketplace app | Mass-market apps overview | Technological partnership -> How to add an app -> Publication requirements -> Telephony requirements | Defines the app model, vendor setup, moderation flow, and telephony checklist |
| Install flow, OAuth callback, token storage | REST authorization | OAuth simple flow -> OAuth auto-renewal -> Scopes | Defines how a tenant app gets and refreshes access |
| Building the incoming call flow | Telephony overview | `externalLine.add` -> `externalCall.register` -> `externalCall.finish` -> `attachRecord` -> `attachTranscription` | Covers the full external telephony lifecycle |
| Finding the CRM owner before routing a call | `telephony.externalCall.searchCrmEntities` | `telephony.externalCall.show` | Lets the integration find CRM entities and show the card to the right user |
| Click2call from CRM | Telephony events overview | `ONEXTERNALCALLSTART` -> `event.bind` -> handler testing | Defines how Bitrix24 asks the app to start an outbound call |
| Callback from CRM form | Telephony events overview | `ONEXTERNALCALLBACKSTART` -> `event.bind` -> handler testing | Defines the callback scenario and payload |
| Embedded settings page inside Bitrix24 | Server-side local app with UI | `BX24.getAuth` | Best reference for iframe UI and auth data on the frontend |
| Backend-only reference implementation | Server-side local app without UI | REST authorization | Best reference when all settings live outside Bitrix24 |
| Limits, support, and API drift | REST API limits | Support -> What's new | Helps debug throttling, moderation issues, and doc/API changes |

## 1. Start and Publish the App

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| Overview of mass-market applications | What a mass-market Bitrix24 app is, how it differs from local integrations, and why OAuth 2.0 is required | First read for any multi-tenant or Marketplace app | https://apidocs.bitrix24.ru/market/ |
| Technological partnership | How to get partner status and access the vendor cabinet | Before planning publication in the Marketplace | https://apidocs.bitrix24.ru/market/technology-partnership.html |
| How to add an app | How to create the app card, code, region, pricing, and technical settings | When creating the actual app record such as `aiva.telephony` | https://apidocs.bitrix24.ru/market/preparing-to-publish/how-to-add-app.html |
| Publication process for solutions in the Marketplace | General publication, install, uninstall, reinstall, and moderation requirements | Use as the pre-submission checklist | https://apidocs.bitrix24.ru/market/preparing-to-publish/publication-requirements.html |
| Integrate your telephony or contact center with Bitrix24 | Telephony-specific Marketplace requirements, required scenarios, and moderator checks | Mandatory reading before implementing or submitting a telephony app | https://apidocs.bitrix24.ru/market/preparing-to-publish/requirements-telephony.html |

## 2. Authorization and Access

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| REST authorization | Webhooks, local apps, mass-market apps, and OAuth 2.0 options | First auth page to decide the correct integration model | https://apidocs.bitrix24.ru/settings/how-to-call-rest-api/authorization.html |
| Simplified OAuth 2.0 flow | Practical install and token acquisition flow | Use for install and callback implementation | https://apidocs.bitrix24.ru/settings/oauth/simple-way.html |
| Automatic OAuth 2.0 token renewal | How to refresh access tokens by refresh token | Use for long-lived tenant integrations | https://apidocs.bitrix24.ru/settings/oauth/auto-renewal.html |
| Available scopes | Full list of REST scopes | Use when choosing `telephony`, optional `crm`, and any extra rights | https://apidocs.bitrix24.ru/api-reference/scopes/permissions.html |

## 3. Telephony Hubs and Core Methods

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| Telephony: overview of methods | Main hub for external telephony, SIP, widgets, lifecycle, and limits | Start here before reading individual telephony methods | https://apidocs.bitrix24.ru/api-reference/telephony/index.html |
| `telephony.externalCall.register` | Registers the external call in Bitrix24 | Main entry point for inbound calls and the start of the call lifecycle | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-register.html |
| `telephony.externalCall.finish` | Completes the call and stores result data in stats and CRM | Use when the conversation ends | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-finish.html |
| `telephony.externalCall.attachRecord` | Attaches a recording to a completed call | Use after `finish` when the recording is available | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-attach-record.html |
| `telephony.call.attachTranscription` | Attaches a transcript to the call | Use when Aiva provides speech-to-text | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-call-attach-transcription.html |
| `telephony.externalCall.searchCrmEntities` | Finds CRM entities by phone number | Use before routing the call to the right manager or CRM card | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-search-crm-entities.html |
| `telephony.externalCall.show` | Opens the call card for a specific user | Use when the app must show the call to the chosen manager | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-show.html |
| `telephony.externalLine.add` | Registers an external line | Use when the integration needs to expose Aiva or customer lines inside Bitrix24 | https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-line-add.html |

## 4. Telephony Events and CRM-Initiated Call Flows

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| Telephony events overview | How telephony events are delivered and which events exist | First read for click2call, callback, and event subscriptions | https://apidocs.bitrix24.ru/api-reference/telephony/events/index.html |
| `ONEXTERNALCALLSTART` | Event fired when a user clicks a phone number in CRM to start an outbound call | Use for click2call | https://apidocs.bitrix24.ru/api-reference/telephony/events/on-external-call-start.html |
| `ONEXTERNALCALLBACKSTART` | Event fired when a callback request is created from a CRM form | Use for callback forms and auto-callback flows | https://apidocs.bitrix24.ru/api-reference/telephony/events/on-external-call-back-start.html |
| `event.bind` | Registers an event handler | Use to subscribe the application to telephony events | https://apidocs.bitrix24.ru/api-reference/events/event-bind.html |
| `events` | Returns the list of available events | Use when debugging portal capabilities or scope availability | https://apidocs.bitrix24.ru/api-reference/events/events.html |
| How to test your handler for Bitrix24 event processing | Testing guide for event handlers | Use to validate install flow, event delivery, and signature handling | https://apidocs.bitrix24.ru/api-reference/events/test-handler.html |

## 5. Examples and Integration Structure

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| Server-side local app with UI | Example of a server-side app with a Bitrix24 UI page | Use as a reference for embedded settings pages inside Bitrix24 | https://apidocs.bitrix24.ru/local-integrations/serverside-local-app-with-ui.html |
| Server-side local app without UI | Example of a server-side app without a Bitrix24 UI page | Use as a backend-only reference when settings live in Aiva | https://apidocs.bitrix24.ru/local-integrations/serverside-local-app-with-no-ui.html |
| `BX24.getAuth` | JS SDK function for obtaining current OAuth data in the iframe app | Use when the frontend inside Bitrix24 needs auth data | https://apidocs.bitrix24.ru/sdk/bx24-js-sdk/system-functions/bx24-get-auth.html |

## 6. Limits, Support, and Changelog

| Page | What it covers | When to open | Canonical URL |
| --- | --- | --- | --- |
| REST API limits | Request rate and platform limits | Use for outbound campaigns, bursty event processing, and retry design | https://apidocs.bitrix24.ru/limits.html |
| Support and community for developers | Official support channels and community entry points | Use when moderation feedback or undocumented behavior blocks work | https://apidocs.bitrix24.ru/support.html |
| What's new | Changelog for docs and API | Use to watch for telephony or Marketplace changes over time | https://apidocs.bitrix24.ru/whats-new.html |

## Minimal Start Set for Aiva

1. https://apidocs.bitrix24.ru/market/
2. https://apidocs.bitrix24.ru/market/technology-partnership.html
3. https://apidocs.bitrix24.ru/market/preparing-to-publish/how-to-add-app.html
4. https://apidocs.bitrix24.ru/market/preparing-to-publish/requirements-telephony.html
5. https://apidocs.bitrix24.ru/settings/how-to-call-rest-api/authorization.html
6. https://apidocs.bitrix24.ru/api-reference/scopes/permissions.html
7. https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-register.html
8. https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-finish.html
9. https://apidocs.bitrix24.ru/api-reference/telephony/telephony-external-call-attach-record.html
10. https://apidocs.bitrix24.ru/api-reference/telephony/events/on-external-call-start.html
11. https://apidocs.bitrix24.ru/api-reference/telephony/events/on-external-call-back-start.html
12. https://apidocs.bitrix24.ru/api-reference/events/event-bind.html

## Important Implementation Notes from the Docs

- `telephony.externalCall.register` and `telephony.externalCall.finish` work only in application context.
- For `telephony.externalCall.register`, pass a unique `EXTERNAL_CALL_ID` for each physical call to avoid receiving an existing `CALL_ID` on repeated registration within 30 minutes.
- `telephony.externalCall.attachRecord` should be called after `telephony.externalCall.finish`, once the recording is ready.
- `telephony.call.attachTranscription` is for completed calls.
- `OnExternalCallStart` is available only via an application and `event.bind`.
- `OnExternalCallBackStart` can be received through an application or an outgoing webhook.
- Event handlers must be reachable from outside Bitrix24.
