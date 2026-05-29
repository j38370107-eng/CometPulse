import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import type { Command } from "../types.js";

export const serverinfo: Command = {
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("Show information about this server"),

  async execute(interaction) {
    const guild = interaction.guild;
    if (!guild) {
      await interaction.reply({ content: "This command can only be used in a server.", ephemeral: true });
      return;
    }

    const owner = await guild.fetchOwner();
    const channels = guild.channels.cache;
    const textChannels = channels.filter((c) => c.isTextBased()).size;
    const voiceChannels = channels.filter((c) => c.isVoiceBased()).size;

    const embed = new EmbedBuilder()
      .setTitle(guild.name)
      .setColor(0x5865f2)
      .setThumbnail(guild.iconURL())
      .addFields(
        { name: "Owner", value: owner.user.tag, inline: true },
        { name: "Members", value: guild.memberCount.toString(), inline: true },
        { name: "Roles", value: guild.roles.cache.size.toString(), inline: true },
        { name: "Text Channels", value: textChannels.toString(), inline: true },
        { name: "Voice Channels", value: voiceChannels.toString(), inline: true },
        { name: "Boost Level", value: `Level ${guild.premiumTier}`, inline: true },
        { name: "Server ID", value: guild.id, inline: false },
      )
      .setFooter({ text: `Created` })
      .setTimestamp(guild.createdAt);

    await interaction.reply({ embeds: [embed] });
  },
};
