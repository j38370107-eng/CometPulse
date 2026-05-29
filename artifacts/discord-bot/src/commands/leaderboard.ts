import { Message, EmbedBuilder } from "discord.js";
import { getLeaderboard } from "../db/queries.js";
import { medalFor } from "../lib/leveling.js";

export async function leaderboardCommand(message: Message) {
  const rows = await getLeaderboard(message.guildId!, 10);

  if (rows.length === 0) {
    await message.reply("No one has earned XP in this server yet. Start chatting!");
    return;
  }

  const lines: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let username = `<@${row.userId}>`;
    try {
      const member = await message.guild?.members.fetch(row.userId);
      if (member) username = member.displayName;
    } catch {
      // user left the server, keep mention fallback
    }
    lines.push(
      `${medalFor(i + 1)} **${username}** — Level \`${row.level}\` · \`${row.xp.toLocaleString()} XP\``
    );
  }

  const embed = new EmbedBuilder()
    .setColor(0x7c3aed)
    .setTitle(`🏆 ${message.guild?.name ?? "Server"} Leaderboard`)
    .setDescription(lines.join("\n"))
    .setFooter({ text: "Top 10 most active members" })
    .setTimestamp();

  await message.reply({ embeds: [embed] });
}
