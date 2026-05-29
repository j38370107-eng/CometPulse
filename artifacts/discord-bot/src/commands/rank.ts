import { Message, EmbedBuilder } from "discord.js";
import { getOrCreateUser, getUserRank } from "../db/queries.js";
import {
  levelFromTotalXP,
  xpForLevel,
  xpInCurrentLevel,
  progressBar,
} from "../lib/leveling.js";

export async function rankCommand(message: Message, args: string[]) {
  const target =
    message.mentions.users.first() ?? message.author;

  const user = await getOrCreateUser(target.id, message.guildId!);
  const rank = await getUserRank(target.id, message.guildId!);

  const level = user.level;
  const totalXP = user.xp;
  const currentLevelXP = xpInCurrentLevel(totalXP, level);
  const neededXP = xpForLevel(level);
  const bar = progressBar(currentLevelXP, neededXP);

  const embed = new EmbedBuilder()
    .setColor(0x7c3aed)
    .setAuthor({
      name: target.displayName,
      iconURL: target.displayAvatarURL(),
    })
    .setTitle("📊 Rank Card")
    .addFields(
      { name: "Level", value: `\`${level}\``, inline: true },
      { name: "Rank", value: rank === -1 ? "Unranked" : `\`#${rank}\``, inline: true },
      { name: "Messages", value: `\`${user.messageCount.toLocaleString()}\``, inline: true },
      {
        name: `XP — ${currentLevelXP.toLocaleString()} / ${neededXP.toLocaleString()}`,
        value: `\`${bar}\` ${Math.round((currentLevelXP / neededXP) * 100)}%`,
      },
      { name: "Total XP", value: `\`${totalXP.toLocaleString()} XP\``, inline: true },
    )
    .setFooter({ text: `CometPulse Leveling` })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
