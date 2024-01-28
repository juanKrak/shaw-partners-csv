import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from "drizzle-orm";
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = sqliteTable('users', {
    id: integer('id').primaryKey({autoIncrement: true}),
    name: text('name').notNull(),
    city: text('city').notNull(),
    country: text('country').notNull(),
    favorite_sport: text('favorite_sport').notNull(),
    created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`)
})

export const insertUserSchema = createInsertSchema(users)
export const insertUsersSchema = z.array(insertUserSchema)

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
