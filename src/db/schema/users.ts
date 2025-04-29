import { relations } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

import { roles } from './roles'
import { groups } from './groups'

export const users = t.pgTable('users', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 255 }).notNull(),
	email: t.varchar('email', { length: 255 }).notNull().unique(),
	password: t.varchar('password', { length: 255 }),
	idRole: t.integer('id_role').references(() => roles.id),
	idGroup: t.integer('id_group').references(() => groups.id),
	createdAt: t.timestamp('created_at').notNull().defaultNow(),
	updatedAt: t.timestamp('updated_at').notNull().defaultNow(),
	deletedAt: t.timestamp('deleted_at'),
})

export const usersRelations = relations(users, ({ one }) => ({
	role: one(roles, {
		fields: [users.idRole],
		references: [roles.id],
	}),
	group: one(groups, {
		fields: [users.idGroup],
		references: [groups.id],
	}),
}))
