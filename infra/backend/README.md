# Optional backend (LEW-271, LEW-273)

This directory is a **skeleton** for BePossible-style backends. The default Seabuckthorn template remains static-only; enable this stack only when you need forms, HCP registration, or an admin API.

## Scope

| Component | Ticket | Status |
|-----------|--------|--------|
| API Gateway (per environment) | LEW-271 | Scaffold / docs |
| Lambda (contact, registration, admin) | LEW-271 | Not implemented |
| DynamoDB (`siteId` partition key) | LEW-271 | Not implemented |
| SES transactional email | LEW-271 | Not implemented |
| Cognito user pool (per site) | LEW-273 | Optional stub |

## Design

- One API Gateway per **environment** (test / uat / prod), shared by all sites in that environment.
- Every record and request includes `siteId` for multi-tenant routing.
- CORS allowlist should include all site domains from Terraform outputs in that environment.
- Cognito: one user pool per site when registration auth is required; pool IDs flow to Lambdas and a future admin dashboard.

## Next steps

1. Add `infra/backend/terraform/` modules mirroring `infra/terraform/live/{test,uat,prod}`.
2. Wire GitHub Actions deploy workflow for Lambda artifacts after static deploy.
3. Add `PUBLIC_API_URL` to `.env.example` and optional `src/lib/api.ts` client helpers in generated sites.

Until those modules exist, use external form endpoints or a separate service repository.
