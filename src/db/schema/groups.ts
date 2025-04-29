import * as t from 'drizzle-orm/pg-core'

export const groups = t.pgTable('groups', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 255 }),
})
