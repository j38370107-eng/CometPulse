import { Message, PermissionFlagsBits } from "discord.js";
import { setUserXP } from "../db/queries.js";

export async function setxpCommand(message: Message, args: string[]) {
  if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
    await message.reply("❌ You need **Manage Server** permission to use this command.");
    return;
  }

  const target = message.mentions.users.first();
  const amount = parseInt(args[1] ?? "");

  if (!target || isNaN(amount) || amount < 0) {
    await message.reply(`Usage: \`c!setxp @user <amount>\``);
    return;
  }

  await setUserXP(target.id, message.guildId!, amount);
  await message.reply(`✅ Set **${target.displayName ?? target.username}**'s XP to \`${amount.toLocaleString()}\`.`);
}
