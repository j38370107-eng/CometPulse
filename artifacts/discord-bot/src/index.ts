import {
  Client,
  GatewayIntentBits,
  Events,
  REST,
  Routes,
} from "discord.js";
import { pool } from "./db/index.js";

const token = process.env["DISCORD_BOT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];

if (!token) throw new Error("DISCORD_BOT_TOKEN is required");
if (!clientId) throw new Error("DISCORD_CLIENT_ID is required");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

async function clearCommands() {
  const rest = new REST().setToken(token!);
  await rest.put(Routes.applicationCommands(clientId!), { body: [] });
  console.log("All slash commands removed.");
}

async function testDb() {
  const result = await pool.query("SELECT NOW() AS now");
  console.log(`Database connected. Server time: ${result.rows[0].now}`);
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await clearCommands();
  await testDb();
});

client.login(token);
