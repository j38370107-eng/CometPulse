import {
  pgTable,
  text,
  integer,
  bigint,
  boolean,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const guildSettings = pgTable("guild_settings", {
  guildId: text("guild_id").primaryKey(),
  prefix: text("prefix").notNull().default("!"),
  welcomeChannelId: text("welcome_channel_id"),
  welcomeMessage: text("welcome_message"),
  logChannelId: text("log_channel_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const userData = pgTable(
  "user_data",
  {
    userId: text("user_id").notNull(),
    guildId: text("guild_id").notNull(),
    xp: integer("xp").notNull().default(0),
    level: integer("level").notNull().default(0),
    messageCount: integer("message_count").notNull().default(0),
    warnings: integer("warnings").notNull().default(0),
    isBanned: boolean("is_banned").notNull().default(false),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.guildId] })]
);

export const commandLogs = pgTable("command_logs", {
  id: bigint("id", { mode: "bigint" }).generatedAlwaysAsIdentity().primaryKey(),
  guildId: text("guild_id"),
  userId: text("user_id").notNull(),
  command: text("command").notNull(),
  args: text("args"),
  success: boolean("success").notNull().default(true),
  executedAt: timestamp("executed_at").notNull().defaultNow(),
});

export type GuildSettings = typeof guildSettings.$inferSelect;
export type UserData = typeof userData.$inferSelect;
export type CommandLog = typeof commandLogs.$inferSelect;
