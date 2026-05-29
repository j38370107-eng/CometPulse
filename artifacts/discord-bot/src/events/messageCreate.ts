import { Client, Events, Message, EmbedBuilder } from "discord.js";
import { addXP } from "../db/queries.js";
import { randomXP, PREFIX, XP_COOLDOWN_MS } from "../lib/leveling.js";
import { handleCommand } from "../lib/commandHandler.js";

const cooldowns = new Map<string, number>();

export function registerMessageCreate(client: Client) {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;
    if (!message.guildId) return;

    if (message.content.startsWith(PREFIX)) {
      await handleCommand(message);
      return;
    }

    const cooldownKey = `${message.author.id}:${message.guildId}`;
    const lastXP = cooldowns.get(cooldownKey) ?? 0;
    const now = Date.now();

    if (now - lastXP < XP_COOLDOWN_MS) return;
    cooldowns.set(cooldownKey, now);

    const xpGained = randomXP();
    const { user, leveledUp, newLevel } = await addXP(
      message.author.id,
      message.guildId,
      xpGained
    );

    if (leveledUp) {
      const embed = new EmbedBuilder()
        .setColor(0x7c3aed)
        .setTitle("⚡ Level Up!")
        .setDescription(
          `${message.author} just reached **Level ${newLevel}**! Keep it up! 🎉`
        )
        .setThumbnail(message.author.displayAvatarURL())
        .setTimestamp();

      await message.channel.send({ embeds: [embed] });
    }
  });
}
