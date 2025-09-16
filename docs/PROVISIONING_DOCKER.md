# Provisioning with Docker

This guide describes how we provision local/dev environments using Docker and Docker Compose for all services.

## Prerequisites
- Docker Desktop (Windows/Mac) or Docker Engine (Linux)
- Docker Compose v2 (bundled with Docker Desktop)

## Services (planned)
- Web_Server (NestJS): exposes REST API for FE
- GIS_Server: internal data provider
- Data_Processor: text->JSON extractor pipeline
- Web_Client (Next.js in `ie402/`): frontend

At this stage, backend projects are not scaffolded yet. We provide a placeholder `docker-compose.yml` to verify network and env wiring.

## Folder layout
- `provision/`
  - `docker-compose.yml` — compose file with placeholder services
  - `.env.example` — sample environment variables

## Usage
1) Copy environment file
```
cp provision/.env.example provision/.env
```
2) Start the stack (placeholders)
```
docker compose -f provision/docker-compose.yml --env-file provision/.env up -d
```
3) Stop and remove containers
```
docker compose -f provision/docker-compose.yml --env-file provision/.env down
```

## Next steps when services are ready
- Replace placeholder `image` and `command` in `provision/docker-compose.yml` with real service builds:
```
  web_server:
    build:
      context: ../services/Web_Server
      dockerfile: Dockerfile
    ports:
      - "${WEB_SERVER_PORT}:4000"
    env_file:
      - ./web_server.env # optional per-service env
    depends_on: [gis_server, data_processor]
```
- Create Dockerfile for each service (examples):
  - NestJS (multi-stage): install deps -> build -> run `node dist/main.js`
  - Python (Data_Processor): pin requirements.txt and expose a small API/worker if needed
- Mount volumes only when necessary; prefer immutable images for CI/CD reproducibility.

## Networking
- All services are attached to the `ie402_net` user-defined bridge network (see compose).
- Default host ports (edit in `.env`):
  - Web Server: `${WEB_SERVER_PORT}`
  - Web Client: `${WEB_CLIENT_PORT}`

## Logs & troubleshooting
- View logs
```
docker compose -f provision/docker-compose.yml logs -f
```
- Inspect network
```
docker network ls
docker network inspect ie402_net
```
- Common issues: port conflicts (change in `.env`), outdated images (use `--pull always` or `docker compose build --no-cache`).
