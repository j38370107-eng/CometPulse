import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  REST,
  Routes,
} from "discord.js";
import { ping } from "./commands/ping.js";
import { help } from "./commands/help.js";
import { serverinfo } from "./commands/serverinfo.js";
import { userinfo } from "./commands/userinfo.js";
import { roll } from "./commands/roll.js";
import type { Command } from "./types.js";

const token = process.env["DISCORD_BOT_TOKEN"];
const clientId = process.env["DISCORD_CLIENT_ID"];

if (!token) throw new Error("DISCORD_BOT_TOKEN is required");
if (!clientId) throw new Error("DISCORD_CLIENT_ID is required");

const commands: Command[] = [ping, help, serverinfo, userinfo, roll];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
});

const commandCollection = new Collection<string, Command>();
for (const command of commands) {
  commandCollection.set(command.data.name, command);
}

async function registerCommands() {
  const rest = new REST().setToken(token!);
  const commandData = commands.map((c) => c.data.toJSON());
  console.log(`Registering ${commandData.length} slash commands globally...`);
  await rest.put(Routes.applicationCommands(clientId!), { body: commandData });
  console.log("Slash commands registered.");
}

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
  await registerCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commandCollection.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    const msg = { content: "Something went wrong running that command.", ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg);
    } else {
      await interaction.reply(msg);
    }
  }
});

client.login(token);
