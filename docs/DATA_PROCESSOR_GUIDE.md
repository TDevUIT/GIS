# Data Processor Guide

## Scope
- Convert textual sources into structured JSON per domain and district.

## Deliverables (week 1)
- Define JSON schemas per domain/district in `services/Data_Processor/schemas/*.json` (placeholders ok).
- Implement a simple pipeline: input/plaintext -> output/json (regex-based first).
- Save outputs under `services/Data_Processor/data/processed/`.

## Tips
- Start deterministic (regex, rule-based), then iterate.
- Keep provenance: source URL, date, extraction notes.

## Folder
- `services/Data_Processor/`
  - `README.md`
  - `data/raw/`, `data/processed/`
  - `schemas/` (JSON schema drafts)
