# GitHub Copilot Instructions — Hospital FE PoC

## Project Overview

This is a **React 19 + TypeScript** hospital management frontend built with:
- **Vite** — build tool & dev server
- **TanStack Query v5** — server-state & data fetching
- **React Hook Form v7 + Zod v4** — form management & validation
- **Zustand v5** — client-state management
- **Axios v1** — HTTP client with interceptors
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **Vitest v4 + Testing Library + MSW v2** — unit/integration testing

## Architecture

### Module Structure

All features live under `src/modules/<feature>/` following this layout:

```
src/modules/<feature>/
├── api/          # Axios API calls (*.api.ts)
├── components/   # Feature UI components
├── hooks/        # TanStack Query hooks (use*Query, use*Mutation)
├── pages/        # Route-level page components
├── services/     # Business logic / orchestration
├── stores/       # Zustand store slices
├── types/        # TypeScript interfaces & types (*.types.ts)
├── utils/        # Pure utility functions
└── validations/  # Zod schemas (*.validation.ts)
```

### Shared Infrastructure

- `src/shared/components/` — Reusable UI components (TextField, Toast)
- `src/shared/services/` — Shared services (token-service)
- `src/lib/http/client.ts` — Axios instance
- `src/middlewares/axios-interceptor.ts` — Auth/error interceptors
- `src/schema/` — Shared field schema definitions

## Coding Standards

### TypeScript
- Use strict TypeScript; avoid `any`
- Prefer `interface` for object shapes, `type` for unions/aliases
- Export types from the module's `types/` directory

### React
- Functional components only — no class components
- Use React hooks; follow Rules of Hooks
- Keep components small and single-responsibility
- Co-locate test files alongside the component (`*.test.tsx`)

### Data Fetching
- Always use TanStack Query hooks for server state
- Define query/mutation hooks in `hooks/` (`use*Query.ts`, `use*Mutation.ts`)
- Raw Axios calls belong in `api/` files only
- Use `queryClient` from `src/app/providers/query-client.ts`

### Forms
- Use React Hook Form with `zodResolver` for all forms
- Define Zod schemas in `validations/`
- Register field configurations in `src/schema/`

### State Management
- Server state → TanStack Query
- Auth / UI state → Zustand (`stores/`)
- Avoid prop drilling deeper than 2 levels — lift to store

### Styling
- Tailwind CSS utility classes only
- Module-level CSS files (`*.css`) only for complex animations or overrides

### Error Handling
- Use `ErrorBoundary` from `src/app/router/ErrorBoundary.tsx` for route-level errors
- Toast notifications via `src/shared/components/Toaster/Toast.tsx`
- Axios errors handled centrally in `src/middlewares/axios-interceptor.ts`

## Testing Conventions
- Test files: `*.test.tsx` or `*.test.ts` co-located with source
- Use `@testing-library/react` for component tests
- Use MSW for API mocking in integration tests
- Coverage target: statements, branches, functions ≥ 80%
- Run tests: `npm run test` (vitest)

## Routing
- Protected routes: `src/app/router/ProtectedRoute.tsx`
- Public-only routes: `src/app/router/PublicOnlyRoute.tsx`
- Root layout: `src/app/router/RootLayout.tsx`
- Route definitions: `src/app/router/AppRouter.tsx`

## Development Workflow

```
Requirement Agent → Coding Agent → Test Agent → PR Review Agent → Git Agent → CI/CD Agent
```

Each agent has a focused role. Follow the agent chain for every feature or fix.

## Path Aliases
- `@modules/*` → `src/modules/*`
- `@shared/*` → `src/shared/*`
- `@lib/*` → `src/lib/*`

## Commands
- `npm run dev` — Start dev server
- `npm run build` — TypeScript check + Vite build
- `npm run lint` — ESLint
- `npm run test` — Vitest test suite
