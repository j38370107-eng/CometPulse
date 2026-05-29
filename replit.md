# CometPulse

A Discord bot system with a companion management dashboard. Features a leveling system, moderation tools, and a centralized management interface.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/dashboard run dev` — run the dashboard (port 5000)
- `pnpm --filter @workspace/discord-bot run dev` — run the Discord bot
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Required Environment Variables

- `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)
- `DISCORD_BOT_TOKEN` — from Discord Developer Portal > Bot > Token
- `DISCORD_CLIENT_ID` — Application ID from Discord Developer Portal > General Information
- `SESSION_SECRET` — secret for express-session (auto-provisioned by Replit)
- `CLIENT_SECRET` — Discord OAuth2 client secret (for dashboard login)
- `BOT_API_URL` — URL of the API server (e.g. `http://localhost:8080` in dev)
- `BASE_URL` — public URL of the dashboard (for OAuth redirect URI)

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- API: Express 5 (port 8080)
- Dashboard: React 19 + Vite 7 + Tailwind CSS 4 + Express server (port 5000)
- Bot: discord.js v14
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod, drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle for API server)

## Where things live

- `artifacts/api-server` — Express REST API serving bot stats, features, servers
- `artifacts/dashboard` — React frontend + Express server with Discord OAuth + API proxy
- `artifacts/discord-bot` — discord.js bot with leveling system
- `lib/db` — shared Drizzle schema and DB connection
- `lib/api-spec` — OpenAPI spec (source of truth for API contract)
- `lib/api-zod` — Zod schemas generated from OpenAPI spec
- `lib/api-client-react` — TanStack Query hooks generated from OpenAPI spec

## Render Deployment

Three services defined in `render.yaml`:
- `cometpulse-bot` — API web service (build: `npm install -g pnpm && pnpm install && pnpm --filter @workspace/api-server run build`)
- `cometpulse-dashboard` — Dashboard web service (same pattern with dashboard filter)
- `cometpulse-discord-worker` — Discord bot background worker

## Architecture decisions

- The dashboard has its own Express server (`server.js`) that handles Discord OAuth, session management, and proxies `/api` requests to the API server
- The API server and bot are separate services so the API can stay up independently of the bot
- All API types are codegen'd from a single OpenAPI spec to keep client/server in sync

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `DISCORD_CLIENT_ID` is the correct env var name in code — the old `render.yaml` used `CLIENT_ID` which was wrong
- Port 5000 is used for the dashboard webview on Replit; `DASHBOARD_PORT` controls the Vite dev server port
- The API server port is controlled by `PORT` env var (set to 8080 in dev, 10000 on Render)
