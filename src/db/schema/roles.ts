import { InferSelectModel } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { ARoles } from '../../role/types/role.enum'

export const rolesTable = t.pgTable('roles', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 10, enum: ARoles as [string, ...string[]] }).notNull(),
})

export type TRole = InferSelectModel<typeof rolesTable>
