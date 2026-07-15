# EstatePilot AI

EstatePilot AI is a bilingual, multi-tenant real-estate SaaS platform for Pakistan. It combines verified property discovery, explainable AI recommendations, lead qualification, appointment booking, CRM workflows, and an agency operations dashboard.

## Stack

- `apps/web`: Next.js 16, React 19, TypeScript, Tailwind CSS and owned shadcn-style components; deploys to Vercel.
- `apps/api`: NestJS with Fastify, Zod validation and OpenRouter; deploys to Railway.
- `packages/shared`: shared contracts and deterministic portfolio seed data.
- PostgreSQL with pgvector, tenant-scoped tables and RLS policies; Supabase is the recommended managed provider.

## Run locally

Requirements: Node.js 22+, npm 10+, and optionally Docker Desktop for PostgreSQL.

```bash
copy .env.example .env
npm install
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. The API health endpoint is `http://localhost:4000/api/health`.

Without Docker or cloud keys, the API automatically uses the same seeded demo dataset and the pre-filled demo sign-in remains functional. Add Supabase and OpenRouter environment values to activate managed authentication, persistence and free-model AI responses.

## Demo sign-in

- Email: `manager@demo.estatepilot.pk`
- Password: `EstatePilot2026!`

## Commands

```bash
npm run dev
npm run build
npm run lint
npm test
npm run db:migrate
npm run db:seed
```

## Deployment

### Vercel

Create a Vercel project from this repository and set the root directory to `apps/web`. Add the `NEXT_PUBLIC_*` environment values from `.env.example`.

### Railway

Create a Railway service from the same repository with root directory `apps/api`. Railway reads `railway.json`. Add `DATABASE_URL`, `WEB_URL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, and Supabase service credentials.

### Supabase

Run `apps/api/database/migrations/001_schema.sql`, then `002_seed.sql` in the SQL editor or through the API migration command. Never expose the service role key to the browser.

## Safety

AI output is treated as untrusted input, structured search filters are validated, database writes use controlled service functions, property availability is never invented, and tenant records carry `organization_id` with RLS enabled.
