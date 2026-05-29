# CometPulse — Render Setup Guide

You will deploy **two separate Web Services** on Render — the bot and the dashboard — sharing one PostgreSQL database.

---

## Step 1 — Create a Discord Application

1. Go to https://discord.com/developers/applications → **New Application**
2. Under **Bot** tab → **Add Bot** → copy the **Bot Token**
3. Under **OAuth2 → General**, add this redirect URI:
   ```
   https://YOUR-DASHBOARD-URL.onrender.com/auth/callback
   ```
   *(Fill in the real URL after deploying in Step 4)*
4. Copy your **Client ID** and **Client Secret** from OAuth2 → General

---

## Step 2 — Create a PostgreSQL Database on Render

1. Render dashboard → **New → PostgreSQL**
2. Name it (e.g. `cometpulse-db`) and choose a plan
3. After creation, copy the **External Database URL** — you'll paste it into both services

---

## Step 3 — Deploy the Bot

1. **New → Web Service** → connect your GitHub repo
2. Settings:

   | Field | Value |
   |-------|-------|
   | **Root Directory** | *(leave blank)* |
   | **Runtime** | Node |
   | **Build Command** | `corepack enable && pnpm install && pnpm --filter @workspace/discord-bot run db:push && pnpm --filter @workspace/api-server run build` |
   | **Start Command** | `npx concurrently --kill-others "pnpm --filter @workspace/api-server run start" "pnpm --filter @workspace/discord-bot run start"` |

3. Environment variables:

   | Key | Value |
   |-----|-------|
   | `DISCORD_BOT_TOKEN` | Bot token from Step 1 |
   | `DISCORD_CLIENT_ID` | Client ID from Step 1 |
   | `DATABASE_URL` | PostgreSQL URL from Step 2 |
   | `PORT` | `3000` |

4. Deploy and copy the service URL (e.g. `https://cometpulse-bot.onrender.com`)

---

## Step 4 — Deploy the Dashboard

1. **New → Web Service** → connect the same repo
2. Settings:

   | Field | Value |
   |-------|-------|
   | **Root Directory** | `artifacts/dashboard` |
   | **Runtime** | Node |
   | **Build Command** | `corepack enable && pnpm install && pnpm run build` |
   | **Start Command** | `node server.js` |

3. Environment variables:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | Same PostgreSQL URL from Step 2 |
   | `DISCORD_CLIENT_ID` | Client ID from Step 1 |
   | `CLIENT_SECRET` | Client Secret from Step 1 |
   | `SESSION_SECRET` | A random string — see below |
   | `BASE_URL` | `https://your-dashboard.onrender.com` (this service's URL) |
   | `DISCORD_BOT_TOKEN` | Bot token (needed for server info) |
   | `BOT_API_URL` | Bot's Render URL from Step 3 |
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |

4. Deploy

---

## Step 5 — Finish Discord OAuth Setup

1. Back in https://discord.com/developers/applications → your app → **OAuth2 → General**
2. Make sure the redirect URI matches **exactly**:
   ```
   https://your-dashboard.onrender.com/auth/callback
   ```
3. Save changes

---

## Step 6 — Invite the Bot to Your Server

Replace `CLIENT_ID` with your actual client ID:
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=8&scope=bot
```

---

## Step 7 — Test It

1. Visit your dashboard URL
2. Click **Login with Discord**
3. Select your server and start managing!

---

## Generating a SESSION_SECRET

Run in any terminal:
```bash
openssl rand -base64 32
```
Or use any password generator to create a 32+ character random string.

---

## Troubleshooting

**Build fails — "Use pnpm instead"**
→ The build command must start with `corepack enable && pnpm install`. Do not use plain `npm install` — the project enforces pnpm.

**Build fails — EROFS / read-only file system**
→ Do not use `npm install -g pnpm`. Use `corepack enable` instead — it activates pnpm without a global install.

**"Access denied to this server"**
→ You must have Manage Server or Administrator permission in the Discord server.

**OAuth redirect mismatch**
→ The redirect URI in Discord must match `BASE_URL` + `/auth/callback` exactly, including `https://`.

**Bot not responding to commands**
→ Check that `DISCORD_BOT_TOKEN` is set correctly and the bot has been invited to the server (Step 6).

**Bot shows offline on dashboard**
→ Set `BOT_API_URL` to the bot's Render URL. Both services must be running.

**Free tier sleeps after 15 minutes**
→ Render's free plan spins down on inactivity. The first request after sleep takes ~30s. Upgrade to a paid plan to keep it always-on.

---

## Dashboard Pages Reference

| Page | What it does |
|------|-------------|
| **Home** | Public landing page |
| **Servers** | List of servers the bot is in |
| **Overview** | Server stats, member count, bot uptime |
| **Leveling** | Configure XP rates and level-up role rewards |
| **Welcoming** | Set channel and message for join/leave events |
| **Giveaways** | Manage server giveaways |
| **Moderation** | Automod rules and filters |
| **Logging** | Set a channel to log server events |
| **Settings** | General server bot settings |
