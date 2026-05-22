---
name: yandex-direct
description: This skill should be used when the user asks about "Yandex Direct", "Яндекс Директ", "директ", "РСЯ", "YAN", campaign audits, bid management, ad moderation, reporting, or Yandex Direct setup and optimization.
---

# Yandex Direct

Use this skill for Yandex Direct campaign management, account audits, optimization, and detailed product documentation lookup.

## Scope

- Audit Yandex Direct accounts and campaigns
- Review bidding, keywords, negatives, budgets, and creative quality
- Explain platform behavior using the bundled local documentation
- Ground recommendations in Russian-market benchmarks and Yandex-specific moderation rules

## Working Approach

1. Identify whether the task is operational work, troubleshooting, or documentation lookup.
2. For audits and optimization, load the relevant files from `references/` and `scripts/`.
3. For product questions, search the bundled `docs/` tree first and read the most relevant articles.
4. Cite the local source path when summarizing specific Yandex Direct behavior.
5. Answer in Russian when the user writes in Russian; otherwise match the user's language.

## Bundled References

- `references/yandex-audit.md` for audit checks
- `references/scoring-system.md` for weighted audit scoring
- `references/benchmarks.md` for market CTR, CPC, and CVR baselines
- `references/bidding-strategies.md` for strategy selection
- `references/compliance.md` for moderation and compliance rules
- `references/image-specs.md` for creative specs

## Bundled Scripts

- `scripts/yd-api.sh` for generic API v5 calls
- `scripts/yd-report.sh` for reports
- `scripts/yd-audit.sh` for audit collection

## Bundled Documentation

The `docs/` directory contains the local Yandex Direct documentation set. Search it directly for detailed answers:

```bash
rg -n "ретаргетинг|autotargeting|strategy" docs
```

Key areas include:

- `docs/alternative-interfaces/`
- `docs/campaigns/`
- `docs/efficiency/`
- `docs/feeds/`
- `docs/impression-criteria/`
- `docs/keywords/`
- `docs/moderation/`
- `docs/payments/`
- `docs/statistics/`
- `docs/strategies/`
- `docs/telegram-ads/`
- `docs/troubleshooting/`
- `docs/unified-performance-campaign/`
