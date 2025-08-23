# API Documentation

The application exposes RESTful endpoints under the `/api` path. All route handlers are defined in `src/app/api/**/route.ts` and annotated with OpenAPI metadata using `zod-to-openapi`.

## OpenAPI Specification

An OpenAPI 3.1 document is generated during the build process and written to `public/api-docs/openapi.json`. It describes every available endpoint and basic success responses. You can access it at:

```
/public/api-docs/openapi.json
```

## Authentication

Authentication is handled by NextAuth. Use the `/api/auth` endpoints to sign in and maintain a session. Endpoints that require authentication expect the session cookie or a bearer token issued by NextAuth.

## Example

A simple authenticated request:

```
GET /api/auth
```

See the OpenAPI document for the complete list of routes and methods.