# GIS_Server

Purpose: Discover, collect, evaluate, and serve district-level GIS-related data for HCMC.

## Responsibilities
- Track sources for districts (Q1, Binh Thanh, Q10, Thu Duc, ...).
- Maintain internal endpoints for Web_Server consumption.
- Store curated JSON per domain: infrastructure, population, traffic, land, environment.

## Getting Started
- Place links and notes in `docs/DATA_SOURCES.md`.
- Coordinate JSON schema with `services/Data_Processor/schemas/`.
- Draft internal endpoints (e.g., `/internal/districts`, `/internal/districts/{id}/infrastructure`).

## Structure
- `data/` — raw and processed data store (add subfolders as needed)

## Run (placeholder)
- Language/stack TBD by team.
- Recommend FastAPI (Python) or Node.js.
