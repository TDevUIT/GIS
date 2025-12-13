# IE402 - Urban GIS Microservices System

Repository: https://github.com/TDevUIT/IE402

This repository hosts a monorepo for an urban GIS project of Ho Chi Minh City (HCMC), designed with a **Hybrid Microservices / Modular Monolith** architecture.

## System Architecture

The system is composed of specialized services orchestrated via Docker Compose:

### Core Services
- **Web_Server** (NestJS): Acts as the main API Gateway and Modular Monolith. It handles:
  - Authentication & Authorization (Auth)
  - User Management
  - Business Logic (Traffic, Accidents, Air Quality, etc.)
  - Aggregation of data from other services.
- **GIS_Server**: Specialized service for handling Spatial Data and communicating with PostGIS.
- **Web_Client** (Next.js): The end-user frontend application.

### Worker Services
Independent Node.js services communicating asynchronously via RabbitMQ:
- **processing-service**: Transforms unstructured text sources into structured JSON.
- **scraper-service**: Collects data from external sources.
- **simulation-server**: Handles heavy simulation tasks.

### Infrastructure
- **Message Broker**: RabbitMQ (inter-service communication).
- **Caching**: Redis Stack.
- **Databases**:
  - Postgres (Main application data).
  - PostGIS (Spatial/Map data).

## Technology Stack

### Frontend (`/clients`)
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript, React 19
- **Styling**: Tailwind CSS v4
- **Maps**: Leaflet, React-Leaflet
- **State Management**: Zustand, React Query

### Backend (`/services`)
- **Framework**: [NestJS](https://nestjs.com/) (Web_Server)
- **Runtime**: Node.js (v20+)
- **ORM**: Prisma
- **Communication**: REST API (Client-Gateway), RabbitMQ (Service-Service)

## Project Structure

```text
.
├── clients/                 # Frontend Application (Next.js 15)
├── services/                # Backend Services
│   ├── GIS_Server/          # GIS Data Service
│   ├── Web_Server/          # Main API Gateway (NestJS)
│   ├── processing-service/  # Data Processing Worker
│   ├── scraper-service/     # Data Collection Worker
│   └── simulation-server/   # Simulation Worker
├── provision/               # Docker Compose & Infrastructure Config
├── docs/                    # Documentation
└── diagrams/                # Architecture diagrams
```

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v20+ recommended for local dev)

### Running the System
The entire system is containerized. To start all services:

1. Navigate to the provision directory:
   ```bash
   cd provision
   ```
2. Start the services:
   ```bash
   docker-compose up -d
   ```

### Ports
- **Client**: http://localhost:3000
- **Web Server API**: http://localhost:3002
- **GIS Server**: http://localhost:3001 (internal)
- **PgAdmin**: http://localhost:5050 (See `docker-compose.yml` for credentials)

## Team Assignments
- **GIS_Server Team**: Data discovery, evaluation, and spatial services.
- **Web_Server Team**: API implementation, aggregation, and core logic.
- **Web_Client Team**: UI implementation and API integration.

Please refer to `docs/` for detailed guides on branching, PRs, and coding conventions.
