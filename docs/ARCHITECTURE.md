# Architecture Overview

Microservices approach with 3 main backends and 1 frontend:

- GIS_Server: domain discovery, GIS data curation per district; exposes internal APIs for Web_Server.
- Data_Processor: extracts structured JSON from textual sources (articles, reports, PDFs) to fuel APIs.
- Web_Server: public API that aggregates from GIS_Server and Data_Processor and serves FE.
- Web_Client: Next.js frontend (current app in `ie402/`).

## Data domains
- Infrastructure, Population, Traffic, Land, Environment.

## Data flow
1. Sources collected by GIS team (district-level).
2. Data_Processor normalizes and transforms into JSON schemas.
3. GIS_Server enriches, indexes, and serves internal endpoints.
4. Web_Server exposes public REST endpoints to FE.
5. Web_Client consumes APIs to visualize and explore.

## Tech (suggested)
- GIS_Server: Python FastAPI or Node.js (Express) + spatial libs; PostGIS or JSON storage.
- Data_Processor: Python pipelines; spaCy/regex; output JSON.
- Web_Server: Node.js (Express/Fastify) + OpenAPI.
- Web_Client: Next.js (already present in `ie402/`).

## API boundary
- Internal APIs: GIS_Server <-> Web_Server.
- Public APIs: exposed by Web_Server only.

See `docs/API_SPEC.md` for routes and models (placeholder).
