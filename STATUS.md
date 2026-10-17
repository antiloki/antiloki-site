# STATUS — antiloki-site (2026-10-17)

## What this is
Public marketing site for **antiloki.com** (static).

## Context
## Shared context (Dan / anti family)
- Stack rule: **Rust + Tauri + SQLite** in product code. TypeScript only where clearly better (Tauri FE, Cloudflare Workers, Remotion offline assets).
- Heavy jobs (cargo/tauri builds, E2E, ffmpeg) go through **jobq** on the shared box. Stop if free disk is under 10 GB.
- No GitHub Actions (no CI credits). Build/test/release locally; `gh release create` for uploads.
- Merge once local tests pass; Dan does not review PRs. Never force-push. Never delete without Dan's yes.
- Products are named **anti + the problem** (antiHunt, antiDrive, antiBot, antiQA, Antiloki…). Public copy: local, one-time or free, private. Never mention Linear in public copy.


## Done
- Landing with engraved hero art; compare table (Cursor, Claude Code, antiloki); mobile card layout for compare table; film section cleanup.

## Missing / next
- Keep copy aligned with product truth from core/FE; no invented benchmarks.

## Build & run
Static site — open locally or deploy via the repo’s GitHub Pages settings. No product Rust build here.
