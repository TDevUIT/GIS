# API Conventions

These conventions apply to all public APIs exposed by `services/Web_Server/` and any internal APIs consumed between services.

## Versioning
- Prefix all public routes with `/v1` (e.g., `/v1/districts`).
- Breaking changes bump the major version: `/v2`.
- Internal APIs may use `/internal` prefix and are subject to change.

## Resource naming
- Use kebab-case or simple nouns for paths: `/v1/districts`, `/v1/districts/{id}/infrastructure`.
- Collections are plural; items are addressed by stable `id`.

## Query parameters
- Filtering: `?districtId=...&domain=infrastructure`.
- Pagination: `?page=1&pageSize=20` (default `page=1`, `pageSize<=100`).
- Sorting: `?sort=fieldName&order=asc|desc`.

## Responses
- Use JSON only. Content-Type: `application/json; charset=utf-8`.
- Standard envelope for collections:
```
{
  "time": "2025-09-16T15:00:00.000Z",   // ISO8601 UTC
  "status": "success",                  // success | error
  "requestId": "2f1e3c5a-...",         // correlation ID (see interceptor below)
  "data": [...],
  "pagination": { "page": 1, "pageSize": 20, "total": 123 }
}
```
- For single resources:
```
{
  "time": "2025-09-16T15:00:00.000Z",
  "status": "success",
  "requestId": "2f1e3c5a-...",
  "data": { /* resource */ }
}
```

## Errors
- Always return a machine-readable shape:
```
{
  "time": "2025-09-16T15:00:00.000Z",
  "status": "error",
  "requestId": "2f1e3c5a-...",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "District not found",
    "details": { /* optional context */ }
  }
}
```
- HTTP codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests, 5xx Server errors.

## Correlation ID and Interceptors (NestJS)
- Use an incoming `X-Request-Id` header as the correlation ID if present; otherwise generate a UUID v4 per request.
- Return the same value in response header `X-Request-Id` and in the envelope `requestId`.
- Implement a global NestJS interceptor to:
  - Capture/generate `requestId`.
  - Stamp `time` as current UTC in ISO8601.
  - Wrap successful responses into the standard envelope with `status: "success"`.
  - Normalize errors (via exception filter or within interceptor) to the standard error envelope with `status: "error"`.

Example outline (pseudo-TypeScript):
```
@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const req = ctx.switchToHttp().getRequest();
    const res = ctx.switchToHttp().getResponse();
    const requestId = req.headers['x-request-id'] ?? crypto.randomUUID();
    res.setHeader('X-Request-Id', requestId);
    return next.handle().pipe(map((data) => ({
      time: new Date().toISOString(),
      status: 'success',
      requestId,
      ... (Array.isArray(data) || data?.pagination ? data : { data })
    })));
  }
}
```
Register globally in `main.ts` and pair with a global exception filter to match the error envelope.

## Idempotency
- GET is safe/idempotent.
- POST creates resources; use PUT/PATCH for updates.
- For operations that may be retried, accept an `Idempotency-Key` header.

## Security
- All public endpoints require authentication (TBD) unless explicitly open.
- Validate inputs strictly; never trust client data.

## OpenAPI
- Keep `services/Web_Server/openapi.yaml` as the single source of truth.
- Document all endpoints, models, and error responses.

## Observability
- Include `traceId` in error/envelope when possible.
- Log request method, path, status, latency.
