# Leeder

An experimental front-end prototype for Algerian universities to explore graduation research proposals, committee review, and academic writing workflows.

This build uses realistic sample data and browser-local demo persistence only. It does not provide institutional authentication, secure storage, plagiarism detection, or actual academic approval.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/team-projects/src/App.tsx` — Leeder pages, role navigation, proposal review, and demo dashboards.
- `artifacts/team-projects/src/demo.ts` — fictional seed records and browser-local demo data model.
- `artifacts/team-projects/src/components/RegistrationFields.tsx` — student and supervisor demo registration forms.
- `artifacts/team-projects/src/index.css` — Leeder theme, RTL rules, and responsive layout.

## Architecture decisions

- Leeder is a front-end-only prototype. Its role switching, permissions, approvals, and local persistence are demonstrations, not security or institutional services.
- Review steps and academic settings are configurable per department; central settings provide defaults for new demo departments.
- Interface language and research-document language are separate. Arabic UI direction follows the interface setting; editor direction follows the research language.
- Registration passwords are temporary form input and are never stored.

## Product

Leeder demonstrates role-specific student, supervisor, department-admin, and central-admin workspaces; proposal submission; configurable review steps; and an editor preview that opens only after the configured approval steps complete.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Use fictional information only. Demo records and any entered proposal data stay in browser local storage, which is not secure.
- No email verification, university authentication, secure server storage, plagiarism detection, or actual academic approval is implemented.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
