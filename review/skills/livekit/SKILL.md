---
name: livekit
description: LiveKit development skill for Codex. Use for LiveKit Python SDK, LiveKit Agents, realtime voice/video rooms, participants, tracks, SIP telephony, recording, streaming, and egress. Do not use for generic Python, generic WebRTC, generic LLM, or non-LiveKit audio tasks.
---

# LiveKit

## Purpose

Use this skill when implementing, debugging, reviewing, or designing code that depends on LiveKit.

This is a LiveKit-only skill. Keep the task grounded in LiveKit APIs, repositories, and architecture.

## Authoritative sources

Use these repositories as the primary references:

- https://github.com/livekit/python-sdks
- https://github.com/livekit/agents
- https://github.com/livekit/egress

Prefer repository examples, README files, package docs, and source code over assumptions.

## Trigger this skill when the task involves

- LiveKit rooms
- LiveKit participants
- LiveKit tracks
- LiveKit data packets
- LiveKit Python SDK
- LiveKit API clients
- LiveKit access tokens
- LiveKit Agents
- Realtime voice AI agents
- Agent sessions
- STT, TTS, LLM, VAD, or turn-taking inside LiveKit Agents
- LiveKit SIP
- Inbound or outbound telephony through LiveKit
- SIP trunks, dispatch rules, or phone-number routing
- LiveKit Egress
- Recording rooms, tracks, audio, video, or composites
- Streaming room media to external services
- Exporting recordings to S3, GCS, local files, or other storage
- Debugging LiveKit connection, media, latency, room lifecycle, or agent lifecycle issues

## Do not trigger this skill when the task involves

- Generic Python code unrelated to LiveKit
- Generic frontend work without LiveKit room or media logic
- Generic WebRTC not using LiveKit
- Generic OpenAI, Anthropic, or LLM integration without LiveKit Agents
- Generic speech-to-text or text-to-speech without LiveKit
- Generic SIP or telecom work without LiveKit SIP
- Generic Docker, Kubernetes, CI/CD, or cloud deployment unless LiveKit is the central component
- Audio theory, DSP, sample rates, or codecs unless tied to LiveKit implementation

## Instructions for Codex

When this skill is active:

1. First identify the LiveKit area involved:
   - Python SDK
   - Agents
   - Egress
   - SIP
   - Server API
   - Room connection
   - Track publishing or subscription
   - Recording or streaming

2. Inspect the relevant repository or local code before changing APIs.

3. Do not invent LiveKit imports, classes, methods, or configuration fields.

4. Prefer minimal, idiomatic LiveKit code.

5. Preserve async patterns used by LiveKit libraries.

6. Separate responsibilities clearly:
   - Server code creates tokens, rooms, SIP resources, and egress jobs.
   - Client code connects to rooms and publishes or subscribes to tracks.
   - Agent code joins rooms and manages realtime AI behavior.
   - Egress code records, streams, or exports media.

7. For production changes, check:
   - API key and secret handling
   - token TTL
   - participant identity
   - room cleanup
   - reconnect behavior
   - graceful shutdown
   - logging
   - error handling
   - recording persistence
   - transcript persistence
   - observability

8. For debugging tasks, look for:
   - room connection state
   - participant identity mismatch
   - token grants
   - missing permissions
   - wrong LiveKit URL
   - incorrect SIP dispatch rule
   - track not published
   - track not subscribed
   - agent not joining the expected room
   - egress job failure or unsupported output configuration

## Output expectations

When answering:

- Explain which LiveKit component is involved.
- Provide concrete code or patch steps when possible.
- Mention relevant files or APIs.
- Call out risky assumptions.
- Keep the answer focused on LiveKit.
