import { InferSelectModel } from 'drizzle-orm'
import * as t from 'drizzle-orm/pg-core'
import { ERole } from '../../common/enums/role.enum'

console.log(Object.values(ERole))
export const rolesTable = t.pgTable('roles', {
	id: t.integer('id').primaryKey().generatedAlwaysAsIdentity(),
	name: t.varchar('name', { length: 10, enum: Object.values(ERole) as [string, ...string[]] }).notNull(),
})

export type TRole = InferSelectModel<typeof rolesTable>
