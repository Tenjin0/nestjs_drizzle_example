import { pgTable, unique, integer, varchar } from 'drizzle-orm/pg-core'

export const roles = pgTable(
	'permissions',
	{
		id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
		ressource: varchar('ressource', { length: 255 }),
		action: varchar('action', { length: 255 }),
	},
	(t) => ({
		uq: unique('roles_ressource_action_unique').on(t.ressource, t.action),
	}),
)
