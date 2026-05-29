import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

export const ping: Command = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if the bot is alive and see its latency"),

  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Pinging...",
      fetchReply: true,
    });
    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const wsLatency = interaction.client.ws.ping;
    await interaction.editReply(
      `Pong! Round-trip: **${latency}ms** | WebSocket: **${wsLatency}ms**`
    );
  },
};
