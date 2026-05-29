import { Message } from "discord.js";
import { PREFIX } from "./leveling.js";
import { rankCommand } from "./commands/rank.js";
import { leaderboardCommand } from "./commands/leaderboard.js";
import { setxpCommand } from "./commands/setxp.js";
import { setlevelCommand } from "./commands/setlevel.js";

export async function handleCommand(message: Message) {
  const content = message.content.slice(PREFIX.length).trim();
  const args = content.split(/\s+/);
  const commandName = args[0]?.toLowerCase();

  if (!commandName) return;

  try {
    switch (commandName) {
      case "rank":
        await rankCommand(message, args.slice(1));
        break;
      case "leaderboard":
      case "lb":
      case "top":
        await leaderboardCommand(message);
        break;
      case "setxp":
        await setxpCommand(message, args.slice(1));
        break;
      case "setlevel":
        await setlevelCommand(message, args.slice(1));
        break;
      case "help":
        await message.reply(
          [
            "**CometPulse Commands** — Prefix: `c!`",
            "",
            "`c!rank [@user]` — View your rank card or another user's",
            "`c!leaderboard` — See the server's top 10",
            "`c!setxp @user <amount>` — *(Admin)* Set a user's XP",
            "`c!setlevel @user <level>` — *(Admin)* Set a user's level",
          ].join("\n")
        );
        break;
      default:
        break;
    }
  } catch (err) {
    console.error(`Command error [${commandName}]:`, err);
    await message.reply("❌ Something went wrong running that command.").catch(() => {});
  }
}
