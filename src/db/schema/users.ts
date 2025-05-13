import { InferSelectModel, relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

import { rolesTable, TRole } from './roles'
import { groups } from './groups'

export const usersTable = t.pgTable('users', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 255 }).notNull(),
	email: t.varchar('email', { length: 255 }).notNull().unique(),
	password: t.varchar('password', { length: 255 }),
	tokenID: t.varchar('token_id', { length: 100 }),
	idRole: t
		.integer('id_role')
		.notNull()
		.references(() => rolesTable.id),
	idGroup: t.integer('id_group').references(() => groups.id),
	createdAt: t.timestamp('created_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	updatedAt: t.timestamp('updated_at', { withTimezone: true, precision: 3 }).notNull().defaultNow(),
	deletedAt: t.timestamp('deleted_at', { withTimezone: true, precision: 3 }),
})

export const usersRelations = relations(usersTable, ({ one }) => ({
	role: one(rolesTable, {
		fields: [usersTable.idRole],
		references: [rolesTable.id],
	}),
	group: one(groups, {
		fields: [usersTable.idGroup],
		references: [groups.id],
	}),
}))

export type TUser = InferSelectModel<typeof usersTable> & {
	role: TRole
}
