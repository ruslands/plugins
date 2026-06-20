#!/usr/bin/env python3
"""Scan a site with isitagentready.com and print a concise report."""

from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.parse
import urllib.request
from collections.abc import Iterator
from pathlib import Path

API_URL = "https://isitagentready.com/api/scan"


def normalize_url(raw_url: str) -> str:
    raw_url = raw_url.strip()
    if "://" not in raw_url:
        raw_url = f"https://{raw_url}"

    parsed = urllib.parse.urlparse(raw_url)
    if not parsed.scheme or not parsed.netloc:
        raise ValueError(f"Invalid URL: {raw_url}")
    return raw_url


def fetch_report(url: str, timeout: float) -> dict:
    payload = json.dumps({"url": url}).encode("utf-8")
    request = urllib.request.Request(
        API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(body)
        except json.JSONDecodeError:
            parsed = {"error": body or exc.reason}
        raise RuntimeError(
            f"Scan failed with HTTP {exc.code}: {parsed.get('error', exc.reason)}"
        ) from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Scan request failed: {exc.reason}") from exc


def iter_checks(report: dict) -> Iterator[tuple[str, str, dict]]:
    for category_name, category in report.get("checks", {}).items():
        if not isinstance(category, dict):
            continue
        for check_name, check in category.items():
            if isinstance(check, dict):
                yield category_name, check_name, check


def build_summary(report: dict) -> str:
    counts = {"pass": 0, "fail": 0, "neutral": 0}
    grouped: dict[str, list[str]] = {}

    for category_name, check_name, check in iter_checks(report):
        status = check.get("status", "unknown")
        counts[status] = counts.get(status, 0) + 1
        if status in {"fail", "neutral"}:
            grouped.setdefault(category_name, []).append(
                f"- `{check_name}` [{status}]: {check.get('message', 'No message')}"
            )

    lines = [
        f"# Agent Readiness Report for {report.get('url', 'unknown')}",
        "",
        f"- Scanned at: {report.get('scannedAt', 'unknown')}",
        f"- Level: {report.get('level', '?')} ({report.get('levelName', 'Unknown')})",
        (
            "- Check counts:"
            f" {counts.get('pass', 0)} pass,"
            f" {counts.get('fail', 0)} fail,"
            f" {counts.get('neutral', 0)} neutral"
        ),
    ]

    if grouped:
        lines.extend(["", "## Findings"])
        for category_name, entries in grouped.items():
            lines.extend(["", f"### {category_name}"])
            lines.extend(entries)

    next_level = report.get("nextLevel") or {}
    requirements = next_level.get("requirements") or []
    if requirements:
        lines.extend(
            [
                "",
                f"## Next Level: {next_level.get('target', '?')} ({next_level.get('name', 'Unknown')})",
            ]
        )
        for requirement in requirements:
            lines.append(
                f"- `{requirement.get('check', 'unknown')}`: {requirement.get('prompt', requirement.get('description', ''))}"
            )
            skill_url = requirement.get("skillUrl")
            if skill_url:
                lines.append(f"  Skill: {skill_url}")
            spec_urls = requirement.get("specUrls") or []
            if spec_urls:
                lines.append("  Specs: " + ", ".join(spec_urls))

    return "\n".join(lines) + "\n"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Scan a site with isitagentready.com and print a concise report."
    )
    parser.add_argument("url", help="Website URL to scan")
    parser.add_argument(
        "--json",
        action="store_true",
        help="Print the raw JSON response instead of the summary report",
    )
    parser.add_argument(
        "--output",
        help="Optional path to save the raw JSON response",
    )
    parser.add_argument(
        "--timeout",
        type=float,
        default=90.0,
        help="HTTP timeout in seconds (default: 90)",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        url = normalize_url(args.url)
        report = fetch_report(url, timeout=args.timeout)
    except (RuntimeError, ValueError) as exc:
        print(str(exc), file=sys.stderr)
        return 1

    if args.output:
        output_path = Path(args.output)
        output_path.write_text(json.dumps(report, indent=2) + "\n")

    if args.json:
        print(json.dumps(report, indent=2))
    else:
        print(build_summary(report), end="")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
