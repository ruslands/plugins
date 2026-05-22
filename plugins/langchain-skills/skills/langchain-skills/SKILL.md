---
name: langchain-skills
description: This skill should be used when the user asks to "build with LangChain", "create a LangChain agent", "integrate LangChain with WhatsApp", or "review a LangChain RAG workflow".
---

# LangChain Skills

Use this skill when the task involves LangChain application architecture, provider integrations, or WhatsApp-based agent flows.

## Focus

- Match the task to the right LangChain building blocks before writing code
- Reuse the codebase's existing LLM, embedding, retriever, and tool abstractions
- Prefer concrete chains, tools, and state flow over vague agent scaffolding
- Check provider-specific integration docs before choosing packages or APIs

## Working Approach

1. Inspect the repository for current LangChain packages, providers, and agent patterns.
2. Determine whether the task is about retrieval, tool use, messaging, or orchestration.
3. Check the official integration docs before proposing package imports or usage.
4. Implement the narrowest change that fits the current architecture.
5. Mention any follow-up validation for prompts, tracing, or external provider credentials.

## References

- LangChain WhatsApp provider integrations: https://docs.langchain.com/oss/python/integrations/providers/whatsapp
- Example repo to consider: https://github.com/worldbank/WhatsApp-RAG-Example
