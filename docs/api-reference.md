# API Reference

Key REST endpoints exposed by the application:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | GET | Retrieve authentication status. |
| `/api/auth/signin` | POST | Sign in using credentials. |
| `/api/users` | GET | List users (requires auth). |
| `/api/users/:id` | GET | Retrieve user details. |

See the generated OpenAPI spec at `public/api-docs/openapi.json` for a complete description of all available endpoints and schemas.
