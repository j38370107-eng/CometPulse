import { Message, PermissionFlagsBits } from "discord.js";
import { setUserLevel } from "../db/queries.js";
import { totalXpForLevel } from "../lib/leveling.js";

export async function setlevelCommand(message: Message, args: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply("❌ You need **Manage Server** permission to use this command.");
    return;
  }

  const target = message.mentions.users.first();
  const level = parseInt(args[1] ?? "");

  if (!target || isNaN(level) || level < 0 || level > 500) {
    await message.reply(`Usage: \`c!setlevel @user <level>\``);
    return;
  }

  await setUserLevel(target.id, message.guildId!, level);
  const xp = totalXpForLevel(level);
  await message.reply(
    `✅ Set **${target.displayName ?? target.username}**'s level to \`${level}\` (\`${xp.toLocaleString()} XP\`).`
  );
}
