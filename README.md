# EstatePilot AI

EstatePilot AI is a bilingual, multi-tenant real-estate SaaS platform for Pakistan. It combines verified property discovery, explainable AI recommendations, lead qualification, appointment booking, CRM workflows, and an agency operations dashboard.

## Stack

- `apps/web`: Next.js 16, React 19, TypeScript, Tailwind CSS and owned shadcn-style components; deploys to Vercel.
- `apps/api`: NestJS with Fastify, Zod validation and OpenRouter; deploys to Vercel (Railway-compatible config remains available).
- `packages/shared`: shared contracts and deterministic portfolio seed data.
- Neon PostgreSQL with pgvector, tenant-scoped tables and RLS policies. EstatePilot uses an isolated `estatepilot` schema so an existing Neon project remains safe.

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

Without Docker or cloud keys, the API automatically uses the same 50-property seeded demo dataset and the pre-filled signed demo login remains functional. Add Neon `DATABASE_URL` and an OpenRouter API key to activate persistence and free-model AI responses.

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

### API on Vercel

Create a second Vercel project from the same repository with root directory `apps/api`. Add `DATABASE_URL`, `WEB_URL`, `OPENROUTER_API_KEY`, and `OPENROUTER_MODEL`; then set `NEXT_PUBLIC_API_URL` on the web project to the deployed `/api` URL.

### Neon

Set `DATABASE_URL` to the pooled Neon connection string, then run `npm run db:migrate` and `npm run db:seed`. The commands create and use only the `estatepilot` schema. Never commit the connection string or expose it to the browser.

## Safety

AI output is treated as untrusted input, structured search filters are validated, database writes use controlled service functions, property availability is never invented, and tenant records carry `organization_id` with RLS enabled.
