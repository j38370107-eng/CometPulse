import express from "express";
import session from "express-session";
import { createProxyMiddleware } from "http-proxy-middleware";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 5000;
const BOT_API_URL = process.env.BOT_API_URL;
const CLIENT_ID = process.env.CLIENT_ID || process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET || "changeme-set-SESSION_SECRET";
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const REDIRECT_URI = `${BASE_URL}/auth/callback`;

const app = express();

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.get("/auth/login", (_req, res) => {
  if (!CLIENT_ID) {
    res.status(500).send("CLIENT_ID is not configured");
    return;
  }
  const url =
    `https://discord.com/oauth2/authorize` +
    `?client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&response_type=code` +
    `&scope=identify%20guilds`;
  res.redirect(url);
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    res.status(400).send("Missing OAuth code");
    return;
  }

  try {
    const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: String(code),
        redirect_uri: REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      console.error("OAuth token error:", tokenData);
      res.status(500).send("Failed to exchange OAuth code");
      return;
    }

    const userRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json();

    const guildsRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const guilds = await guildsRes.json();

    req.session.user = user;
    req.session.guilds = guilds;
    req.session.accessToken = tokenData.access_token;

    res.redirect("/");
  } catch (err) {
    console.error("OAuth callback error:", err);
    res.status(500).send("Authentication failed");
  }
});

app.get("/auth/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/auth/user", (req, res) => {
  res.json(req.session.user || null);
});

app.get("/auth/guilds", (req, res) => {
  res.json(req.session.guilds || []);
});

if (BOT_API_URL) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: BOT_API_URL,
      changeOrigin: true,
    })
  );
} else {
  console.warn("BOT_API_URL is not set — /api requests will not be proxied");
}

const staticDir = join(__dirname, "dist/public");
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(join(staticDir, "index.html"));
  });
} else {
  app.get("/", (_req, res) => {
    res.send(
      "Dashboard not built yet. Run <code>pnpm run build</code> first."
    );
  });
}

app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`Dashboard running on port ${PORT}`);
});
