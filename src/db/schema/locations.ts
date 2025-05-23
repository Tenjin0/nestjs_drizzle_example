import { InferSelectModel } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

export const locationsTable = t.pgTable('locations', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	namespace: t.varchar('namespace', { length: 255 }).notNull().unique(),
	createdAt: t.timestamp('created_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	updatedAt: t.timestamp('updated_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	deletedAt: t.timestamp('deleted_at', { withTimezone: true, precision: 3 }),
})

export type TLocation = InferSelectModel<typeof locationsTable>
