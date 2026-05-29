import { SlashCommandBuilder } from "discord.js";
import type { Command } from "../types.js";

export const roll: Command = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a dice")
    .addIntegerOption((opt) =>
      opt
        .setName("sides")
        .setDescription("Number of sides on the dice (2-100, default 6)")
        .setMinValue(2)
        .setMaxValue(100)
    ) as SlashCommandBuilder,

  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") ?? 6;
    const result = Math.floor(Math.random() * sides) + 1;
    await interaction.reply(
      `You rolled a **d${sides}** and got **${result}**!`
    );
  },
};
