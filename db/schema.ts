import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const participants=sqliteTable("participants",{id:integer("id").primaryKey({autoIncrement:true}),name:text("name").notNull(),answers:text("answers").notNull(),createdAt:integer("created_at").notNull()});
export const participantsV2=sqliteTable("participants_v2",{id:integer("id").primaryKey({autoIncrement:true}),name:text("name").notNull(),answers:text("answers").notNull(),createdAt:integer("created_at").notNull()});
export const participantsV3=sqliteTable("participants_v3",{id:integer("id").primaryKey({autoIncrement:true}),name:text("name").notNull(),answers:text("answers").notNull(),createdAt:integer("created_at").notNull()});
export const participantsV4=sqliteTable("participants_v4",{id:integer("id").primaryKey({autoIncrement:true}),name:text("name").notNull(),answers:text("answers").notNull(),createdAt:integer("created_at").notNull()});
export const participantsV5=sqliteTable("participants_v5",{id:integer("id").primaryKey({autoIncrement:true}),name:text("name").notNull(),answers:text("answers").notNull(),createdAt:integer("created_at").notNull()});

