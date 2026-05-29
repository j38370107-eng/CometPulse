import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
  Partials,
} from "discord.js";
import { pool } from "./db/index.js";
import { registerMessageCreate } from "./events/messageCreate.js";

const token = process.env["DISCORD_BOT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];

if (!token) throw new Error("DISCORD_BOT_TOKEN is required");
if (!clientId) throw new Error("DISCORD_CLIENT_ID is required");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel],
});

async function clearSlashCommands() {
  try {
    const rest = new REST().setToken(token!);
    await rest.put(Routes.applicationCommands(clientId!), { body: [] });
    console.log("Slash commands cleared.");
  } catch (err) {
    console.warn("Could not clear slash commands (non-fatal):", err);
  }
}

async function testDb() {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    console.log(`Database connected. Server time: ${result.rows[0].now}`);
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);

  try {
    await testDb();
  } catch (err) {
    console.error("Fatal: could not connect to database. Exiting.");
    process.exit(1);
  }

  await clearSlashCommands();
  console.log(`Leveling system ready. Prefix: c!`);
});

client.on(Events.Error, (err) => {
  console.error("Discord client error:", err);
});

registerMessageCreate(client);

client.login(token).catch((err) => {
  console.error("Failed to login to Discord:", err);
  process.exit(1);
});
