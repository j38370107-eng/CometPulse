import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Partials,
} from "discord.js";
import { pool } from "./db.js";
import { registerMessageCreate } from "./events/messageCreate.js";
import { logger } from "../lib/logger.js";

export async function startBot(): Promise<void> {
  const token = process.env["DISCORD_BOT_TOKEN"];
  const clientId = process.env["DISCORD_CLIENT_ID"];

  if (!token || !clientId) {
    logger.warn("DISCORD_BOT_TOKEN or DISCORD_CLIENT_ID not set — bot will not start");
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
    partials: [Partials.Message, Partials.Channel],
  });

  client.once(Events.ClientReady, async (readyClient) => {
    logger.info(`Discord bot logged in as ${readyClient.user.tag}`);

    try {
      const result = await pool.query("SELECT NOW() AS now");
      logger.info(`Bot DB connected. Server time: ${result.rows[0].now}`);
    } catch (err) {
      logger.error({ err }, "Bot DB connection failed — exiting");
      process.exit(1);
    }

    try {
      const rest = new REST().setToken(token);
      await rest.put(Routes.applicationCommands(clientId), { body: [] });
      logger.info("Slash commands cleared");
    } catch (err) {
      logger.warn({ err }, "Could not clear slash commands (non-fatal)");
    }

    logger.info("Leveling system ready. Prefix: c!");
  });

  client.on(Events.Error, (err) => {
    logger.error({ err }, "Discord client error");
  });

  registerMessageCreate(client);

  await client.login(token).catch((err) => {
    logger.error({ err }, "Failed to login to Discord — exiting");
    process.exit(1);
  });
}
