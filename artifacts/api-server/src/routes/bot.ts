import { Router, type IRouter } from "express";
import {
  GetBotStatsResponse,
  GetBotFeaturesResponse,
  GetBotServersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const startTime = Date.now();

router.get("/bot/stats", (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);
  const data = GetBotStatsResponse.parse({
    servers: 0,
    users: 0,
    commands: 0,
    uptimeSeconds,
    status: "online",
  });
  res.json(data);
});

router.get("/bot/features", (_req, res) => {
  const data = GetBotFeaturesResponse.parse([
    {
      id: "leveling",
      icon: "⚡",
      title: "Leveling",
      description: "Reward active members with XP and levels. Customizable multipliers, role rewards, and leaderboards keep your community engaged.",
      category: "engagement",
    },
    {
      id: "welcoming",
      icon: "👋",
      title: "Welcoming",
      description: "Greet new members with custom messages, images, and role assignments. Make every join feel special.",
      category: "engagement",
    },
    {
      id: "giveaways",
      icon: "🎁",
      title: "Giveaways",
      description: "Run fair, automated giveaways with role requirements, entry limits, and instant winner selection.",
      category: "engagement",
    },
    {
      id: "utility",
      icon: "🛡",
      title: "Utility",
      description: "A full toolkit of moderation, server info, role management, and administration commands.",
      category: "moderation",
    },
    {
      id: "automod",
      icon: "🤖",
      title: "Auto-Moderation",
      description: "Automatically filter spam, bad words, links, and suspicious content with configurable rules.",
      category: "moderation",
    },
    {
      id: "logging",
      icon: "📋",
      title: "Server Logging",
      description: "Track joins, leaves, message edits, deletions, and more. Choose exactly what gets logged and where.",
      category: "moderation",
    },
  ]);
  res.json(data);
});

router.get("/bot/servers", (_req, res) => {
  const data = GetBotServersResponse.parse([]);
  res.json(data);
});

export default router;
