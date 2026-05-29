import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../types.js";

export const help: Command = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show all available commands"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Available Commands")
      .setColor(0x5865f2)
      .addFields(
        { name: "/ping", value: "Check the bot's latency" },
        { name: "/help", value: "Show this help message" },
        { name: "/serverinfo", value: "Show information about this server" },
        { name: "/userinfo [user]", value: "Show information about a user (defaults to you)" },
        { name: "/roll [sides]", value: "Roll a dice (default: d6, max: d100)" }
      )
      .setFooter({ text: "Use slash commands to interact with the bot" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
