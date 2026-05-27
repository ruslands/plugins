---
name: slop-detector
description: This skill should be used when the user asks to "detect AI writing", "review thesis prose", "find formulaic academic filler", "diagnose generic rhetorical scaffolding", or rewrite academic text that sounds templated or low-information.
---

# Slop Detector

Detect prose that reads like lightly edited LLM output or generic pseudo-academic writing.

## What This Skill Does

This skill is for diagnosis first, revision second.

Use it to:

- identify likely AI-style signals in a passage
- distinguish real academic style from empty academic-sounding prose
- explain why a sentence or paragraph reads as formulaic
- suggest direct rewrites that preserve the author's meaning

## Detection Targets

Flag text when multiple signals cluster together:

1. **Generic academic filler.** Vague importance language, inflated diction, empty transitions, or pseudo-formal phrases.
2. **Template rhetoric.** Repeated `not X but Y`, question-answer staging, mirrored sentence frames, or thesis-by-announcement phrasing.
3. **Low information density.** Sentences that sound polished but do not name a mechanism, actor, scope, example, or consequence.
4. **Rhythmic uniformity.** Paragraphs that repeat the same sentence length, transition structure, or claim-evidence-wrap-up pattern.
5. **Over-signposted prose.** Sentences that spend more time announcing the point than making it.

Do not treat one suspicious word as proof. The skill works on accumulation and patterning, not single-token policing.

## Workflow

1. Read one paragraph at a time.
2. Mark suspicious phrases and structural repetitions.
3. Classify each issue as lexical, structural, rhetorical, or evidentiary.
4. Ask whether the sentence says anything specific enough to be checked, supported, or disputed.
5. Report the smallest rewrite that removes the slop without flattening a valid argument.

## How to Report Findings

For each issue, provide:

- the quoted phrase or sentence
- the signal type
- why it reads as AI-style or generic
- whether the problem is weak wording, weak logic, or both
- a concise rewrite

When reviewing longer passages, prioritize repeated patterns over isolated wording.

## Threshold Rules

- One flagged phrase is a note.
- Two or three clustered signals in one paragraph is a likely issue.
- Repeated structure across a section is a style problem worth revising systematically.

## Academic Guardrails

- Do not remove necessary hedging when uncertainty is real.
- Do not simplify legitimate technical terms just because they sound formal.
- Do not rewrite valid theoretical distinctions into casual prose.
- Focus on emptiness, repetition, and rhetorical staging, not on punishing all academic diction.

## Reference Files

- For lexical cues and filler patterns, see [references/phrases.md](references/phrases.md).
- For structural and rhetorical patterns, see [references/structures.md](references/structures.md).
- For concrete before/after revisions, see [references/examples.md](references/examples.md).

## Quick Checks

Before delivering a review or rewrite:

- Does the sentence make a specific claim or only sound important?
- Could the same sentence fit almost any topic with a few nouns swapped?
- Is the paragraph repeating a familiar AI rhythm?
- Is the transition doing analytical work, or only announcing movement?
- Does the rewrite preserve legitimate nuance while removing the template?
