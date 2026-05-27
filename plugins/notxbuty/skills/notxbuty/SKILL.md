---
name: notxbuty
description: This skill should be used when the user asks to "find not X but Y patterns", "detect formulaic contrast templates", "review thesis prose for staged reversals", or rewrite repeated rhetorical reversals into direct analytical prose.
---

# Not X But Y

Detect and revise the `not X but Y` family of AI-style contrast patterns.

## When to Use This Skill

Use this skill when prose contains repeated contrast moves such as:

- `not X but Y`
- `X is not A. It is B.`
- `less X, more Y`
- `the point is not X, but Y`
- `not merely X, but Y`

This skill is for detection first. The goal is to identify when a contrast is doing rhetorical theater instead of analytical work.

## What Counts As a Problem

Flag the pattern when one or more of these are true:

1. The sentence creates drama by negating an obvious or weak alternative before stating the real point.
2. The contrast compresses a more nuanced claim into a false either/or.
3. The sentence could say `Y` directly with no loss of meaning.
4. The same contrast frame appears multiple times in a section.
5. The reversal sounds polished but does not sharpen the argument.

Do not flag every contrast automatically. Some contrasts are analytically necessary. The task is to distinguish useful conceptual distinction from templated rhetorical staging.

## Detection Workflow

1. Scan for explicit negation-plus-reversal patterns.
2. Check whether `X` is a real alternative or only a setup.
3. Ask whether `Y` could be stated directly.
4. Check whether the contrast hides a more qualified claim such as "both matter, but Y matters more in this case."
5. If the pattern repeats across a paragraph or chapter, mark it as a style tic rather than a one-off sentence issue.

## How to Report Findings

For each flagged sentence, give:

- the sentence or clause
- the pattern type
- why it reads as formulaic
- whether the issue is rhetorical, logical, or both
- a direct rewrite that preserves the intended meaning

## Rewrite Rules

1. If `Y` stands on its own, state `Y` directly.
2. If both sides matter, replace the binary contrast with a qualified comparison.
3. If the contrast names a real conceptual distinction, keep it but remove the staged phrasing.
4. Preserve disciplinary nuance. Do not flatten a valid theoretical distinction just to avoid the pattern.

## Reference Files

- For common templates and detection cues, see [references/patterns.md](references/patterns.md).
- For before/after revisions, see [references/examples.md](references/examples.md).

## Quick Checks

Before delivering a revision or review:

- Is `X` a real claim that needs rejection, or just a setup line?
- Could the sentence start with `Y` and lose nothing?
- Does the contrast create a false binary?
- Does the paragraph repeat the same reversal rhythm?
- Does the rewrite preserve the analytical distinction, if there is one?
