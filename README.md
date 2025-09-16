# IE402 - Microservices Monorepo Skeleton

Repository: https://github.com/TDevUIT/IE402

This repository hosts a monorepo for an urban GIS project of Ho Chi Minh City (HCMC) using a microservices approach:

- GIS_Server: data discovery, curation, and GIS aggregation for districts (e.g., Q1, Binh Thanh, Q10, Thu Duc).
- Data_Processor: transforms unstructured text sources into structured JSON for APIs.
- Web_Server: provides REST APIs for FE by aggregating data from GIS_Server and Data_Processor.
- Web_Client: frontend client app.

Note: The existing Next.js app in `ie402/` is currently used as the Web Client. The FE team can continue development there.

## Team assignments
- GIS_Server: Hương Giang, Quyền, V. Linh — collect and evaluate district data sources (infrastructure, population, traffic, land, environment). Pick top 3 districts with best quality.
- Web_Server: Lâm, Tài, Tân — define and implement APIs, integrate with GIS_Server and Data_Processor.
- Web_Client: Thái, Thắng — implement a simple UI (start from a reference UI on the web), consume APIs from Web_Server.

## Priorities (this week)
1) Study GIS fundamentals, shortlist data sources, mark usable sections.
2) BE team to draft diagrams and API specs.
3) FE to pick a simple UI reference for a quick prototype.

## Structure
- docs/: shared documentation (architecture, guides, tasks, data sources, intros)
- services/
  - GIS_Server/: GIS data discovery and aggregation
  - Data_Processor/: text -> JSON pipelines
  - Web_Server/: REST API surface and aggregation
- clients/
  - Web_Client/: Readme and guidance (actual FE lives in `ie402/`)
- diagrams/: placeholders for architecture and data flow
- ie402/: existing Next.js app (FE)

## Getting started
- Read `docs/ARCHITECTURE.md` for the big picture.
- Teams: follow your respective guides in `docs/` and your service directory.
- Editor setup: see `.editorconfig` and `.vscode/` for workspace consistency.

## Repo conventions
- One PR per feature/task, reference TASKS.md item IDs.
- Use conventional commits (feat, fix, docs, chore, refactor, test).
- Keep credentials out of the repo. Use `.env` locally; never commit secrets.

## Guidelines
- API conventions: see `docs/API_CONVENTIONS.md`.
- Pull Request guidelines: see `docs/PR_GUIDE.md`.
- Branching conventions: see `docs/BRANCHING_GUIDE.md`.

## Licensing
TBD.
