import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../types.js";

export const userinfo: Command = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Show information about a user")
    .addUserOption((opt) =>
      opt.setName("user").setDescription("The user to look up (defaults to you)")
    ) as SlashCommandBuilder,

  async execute(interaction) {
    const target = interaction.options.getUser("user") ?? interaction.user;
    const member = interaction.guild?.members.cache.get(target.id);

    const embed = new EmbedBuilder()
      .setTitle(target.tag)
      .setColor(0x5865f2)
      .setThumbnail(target.displayAvatarURL())
      .addFields(
        { name: "User ID", value: target.id, inline: true },
        { name: "Bot", value: target.bot ? "Yes" : "No", inline: true },
        { name: "Account Created", value: `<t:${Math.floor(target.createdTimestamp / 1000)}:R>`, inline: true },
      );

    if (member) {
      embed.addFields(
        { name: "Joined Server", value: member.joinedAt ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:R>` : "Unknown", inline: true },
        { name: "Nickname", value: member.nickname ?? "None", inline: true },
        { name: "Top Role", value: member.roles.highest.name, inline: true },
      );
    }

    embed.setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
