# Web_Server (NestJS)

Purpose: Public API for FE, aggregating from GIS_Server and Data_Processor.

## Responsibilities
- Expose REST endpoints for FE consumption only.
- Map internal data models to public response DTOs.
- Document APIs via Swagger (NestJS decorators) per `docs/API_CONVENTIONS.md`.

## Design (no project setup yet)
- Modules: `HealthModule`, `DistrictsModule`.
- Controllers: `HealthController`, `DistrictsController`.
- Services: `DistrictsService` (integration with GIS/Data_Processor).
- Swagger UI mounted at `/docs` in runtime (when implemented).

## Sample routes (draft)
- GET `/v1/health`
- GET `/v1/districts`
- GET `/v1/districts/:id/infrastructure`
- GET `/v1/districts/:id/traffic`
- GET `/v1/districts/:id/environment`

Refer to `docs/WEB_SERVER_GUIDE.md` and `docs/API_CONVENTIONS.md` for details.
