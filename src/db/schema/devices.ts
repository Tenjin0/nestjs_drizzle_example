import { InferSelectModel, relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

import { locationsTable, TLocation } from './locations'

export const devicesTable = t.pgTable('devices', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	serial: t.varchar('serial', { length: 255 }).unique().notNull(),
	alias: t.varchar({ length: 255 }),
	info: t.jsonb(),
	socket_id: t.varchar('socket_id', { length: 255 }),
	connected: t.boolean().default(false).notNull(),
	idLocation: t.integer('id_location').references(() => locationsTable.id),
	last_connection: t.timestamp('created_at', { withTimezone: true, precision: 3 }),
	createdAt: t.timestamp('created_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	updatedAt: t.timestamp('updated_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	deletedAt: t.timestamp('deleted_at', { withTimezone: true, precision: 3 }),
})

export const devicesRelations = relations(devicesTable, ({ one }) => ({
	location: one(locationsTable, {
		fields: [devicesTable.idLocation],
		references: [locationsTable.id],
	}),
}))

export type TDevice = InferSelectModel<typeof devicesTable> & {
	location: TLocation
}
