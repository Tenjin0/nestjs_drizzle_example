import * as t from 'drizzle-orm/pg-core'

export const roles = t.pgTable('roles', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 255 }),
})
