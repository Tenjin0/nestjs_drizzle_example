import { InferSelectModel } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'

export const rolesTable = t.pgTable('roles', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 255 }).notNull(),
})

export type TRole = InferSelectModel<typeof rolesTable>
