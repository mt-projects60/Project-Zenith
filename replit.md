# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   ├── startid/            # StartID React+Vite frontend (main app at /)
│   └── mockup-sandbox/     # Component preview server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Project Zenith App (artifacts/startid)

Project Zenith is a high-end capital infrastructure platform (rebranded from StartID). Multi-role ecosystem: founders get shareable public profiles, investors browse curated deal flow, service providers receive leads, enthusiasts follow startups. Primary brand color: #008037 green.

**Golden Rule**: Must feel like structured, high-end capital infrastructure (Stripe meets AngelList), not a generic networking site.

### Pages

- `/` — Homepage: hero + vertical Product Hunt-style startup feed with upvoting, filters, and search sidebar
- `/startups/:slug` — Public startup profile: two-column layout with overview/traction/team/documents tabs + sticky funding card
- `/investors/:slug` — Public investor profile: name, firm, check size, industries, stages, portfolio + shareable link with OG meta tags
- `/providers/:slug` — Public provider profile: company name, services, industries, geographies, notable clients + OG meta tags
- `/community/:slug` — Public community profile: name, background, interests + OG meta tags
- `/signup` — Multi-step role-specific onboarding: Startup (4 steps), Investor (4 steps), Provider (5 steps), Enthusiast (3 steps). Each role collects role-specific fields including LinkedIn, sector/subsector, company type, registered name, etc. `Field` and `SelectField` are module-level (do NOT move inside Signup component — breaks mobile keyboard). Default country code: India (+91).
- `/founder/dashboard` — Founder Dashboard: overview widgets, manage profile form, investor pipeline with approve/deny
- `/investor/dashboard` — Investor Dashboard: ProfileCompletion widget, deal flow overview, discover table with filters, Kanban pipeline, commitments ledger
- `/provider/dashboard` — Service Provider Dashboard: ProfileCompletion widget, profile views/inbound metrics, manage profile, leads inbox
- `/community/dashboard` — Enthusiast Dashboard: ProfileCompletion widget, following feed, pitch events with RSVP, recommended startups grid
- `/admin/dashboard` — Admin: user approval queue, platform stats

### Key Components
- `src/components/ProfileCompletion.tsx` — Reusable profile completion widget: % progress bar, missing-fields checklist, shareable profile URL copy. Used across investor/provider/community dashboards.

### Auth Notes
- JWT stored in localStorage key `startid_jwt` (unchanged technical key despite brand rename)
- Login: `admin@projectzenith.io` / `StartID@2026` → `/admin/dashboard`
- Demo (password: `demo1234`): abiola@novapay.io (startup), sarah@sequoiacap.com (investor), emeka@okaforlaw.com (provider), chioma@gmail.com (enthusiast)
- Pending users can navigate freely; no forced redirect after login
- Reset password → `mailto:support@projectzenith.io` (no forgot-password flow)

### DB Schema (lib/db/src/schema/)

- `users.ts` — Users table with role enum (STARTUP, INVESTOR, PROVIDER, ENTHUSIAST)
- `startups.ts` — Startups, startup_metrics, startup_team tables
- `investors.ts` — Investors table linked to users
- `interactions.ts` — Polymorphic interactions table (UPVOTE, BOOKMARK, EXPRESS_INTEREST, DATA_ROOM_REQUEST) with PENDING/APPROVED/DENIED status

### Tech
- React + Vite + TypeScript
- Tailwind CSS with Shadcn UI components
- Wouter for client-side routing
- TanStack Query with mock data (Supabase-ready structure)
- Framer Motion for animations
- Fonts: Inter + Plus Jakarta Sans

### Data
Currently using fully mock data in `src/data/mock-startups.ts`. Code is structured for easy Supabase integration.

### User Roles (4 types)
1. Startups (Capital Seekers)
2. Investors (Capital Providers)
3. Service Providers (Execution Enablers)
4. Startup Enthusiasts (Community Layer)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/startid` (`@workspace/startid`)

Main StartID frontend. React + Vite. All mock data, no backend required for Phase 1.

- Entry: `src/main.tsx`
- App setup: `src/App.tsx` — routing with Wouter
- Pages: `src/pages/` (Home, StartupProfile, Signup)
- Components: `src/components/layout/` (Navbar, MainLayout), `src/components/startup/` (StartupCard)
- Data: `src/data/mock-startups.ts` — all 18 mock startups + NovaPay detailed profile (with companyType, registeredName, subsector, tags, businessModel, customerType)
- Hooks: `src/hooks/use-startups.ts` — TanStack Query hooks over mock data
- Lib: `src/lib/sectors.ts` — 18 startup sector taxonomy + subsectors, company types, investor types, service categories, geographies
- Lib: `src/lib/currency.ts` — 16 currencies with conversion utilities
- Dev: `pnpm --filter @workspace/startid run dev`

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages.

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec.

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`.
