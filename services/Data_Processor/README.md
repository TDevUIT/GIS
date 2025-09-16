# Data_Processor

Purpose: Convert unstructured text into structured JSON aligned to agreed schemas.

## Responsibilities
- Define JSON schemas per domain and district in `schemas/`.
- Implement deterministic extraction first (regex/rules), keep provenance.
- Export JSON for Web_Server and GIS_Server.

## Structure
- `data/raw/` — input text files or snippets
- `data/processed/` — output JSON files
- `schemas/` — JSON schema drafts for each domain

## Run (placeholder)
- Recommended: Python (pydantic for validation), or Node.js if preferred.
