/* eslint-disable @typescript-eslint/no-unsafe-return */
import { DrizzleDB } from '../../db/types/drizzle'
import { AnyPgTable, PgTable } from 'drizzle-orm/pg-core/table'
import { and, eq, isNull } from 'drizzle-orm'
import { ETable } from '../enums/table.enum'

export interface NDETable extends PgTable {
	id: number
	createdAt: string
	updatedAt: string
	deletedAt: string
}

export interface NDETableCreate {
	id: number
	createdAt: string
}

export interface NDETableUpdate {
	id: number
	updatedAt: string
}

export interface NDETableDelete {
	id: number
	deletedAt: string
}

// export type DBTable = PgTableWithColumns<NDETable>
export class NDEServiceDB<TRessouce, CreateRessouceDto extends object, UpdateLocationDto extends object> {
	public exludedFields: string[] = []
	protected tableName: string
	protected table: AnyPgTable
	protected db: DrizzleDB
	constructor(db: DrizzleDB, table: AnyPgTable, tablename: ETable, exludedFields?: string[]) {
		if (exludedFields) {
			this.exludedFields = exludedFields
		} else {
			this.exludedFields = []
		}
		this.table = table
		this.db = db
		this.tableName = tablename
		// this.table = this.db.query[this.tableName]
		// if (!this.table) throw new Error('No table found ' + this.tableName)
	}

	setExcludedFields(aExcludedFields: string[]) {
		this.exludedFields = aExcludedFields
	}

	setTableName(tableName: string) {
		this.tableName = tableName
	}
	// getTable(tableName: string) {
	// 	const table = this.db.query[tableName] as Table
	// 	return table
	// }

	getVisibleFields() {
		const visibleFields = { id: true }
		for (const key in this.table) {
			if (Object.prototype.hasOwnProperty.call(this.table, key)) {
				if (key === 'enableRLS') {
					break
				}
				if (['created_at', 'updated_at', 'deleted_at'].indexOf(key) >= 0) {
					visibleFields[key] = false
				}
				if (this.exludedFields.includes(key)) {
					visibleFields[key] = false
				}
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const element = this.table[key]
				visibleFields[key] = true
			}
		}
		return visibleFields
	}
	public create(createLocationDto: CreateRessouceDto) {
		// console.log(this.db.query.locationTable)
		return this.db
			.insert(this.table)
			.values(createLocationDto as unknown as any)
			.returning() as unknown as Promise<TRessouce>
	}

	public findAll() {
		const visibleFields = this.getVisibleFields()
		return this.db.query[this.tableName].findMany({
			columns: visibleFields,
		}) as Promise<TRessouce[]>
	}

	async findOne(id: number) {
		const visibleFields = this.getVisibleFields()
		const ressources = await this.db.query[this.tableName].findMany({
			limit: 1,
			columns: visibleFields,
			where: eq(this.table['id'], id),
		})
		if (ressources.length === 0) {
			return null
		}

		if (ressources.length > 0) {
			return ressources[0] as Promise<TRessouce>
		}
	}

	update(id: number, updateLocationDto: UpdateLocationDto) {
		return this.db
			.update(this.table)
			.set(updateLocationDto)
			.where(eq(this.table['id'], id))
			.returning({ id: this.table['id'], updated_at: this.table['updatedAt'] }) as unknown as Promise<
			Partial<TRessouce> & NDETableUpdate
		>
	}

	public remove(id: number) {
		return this.db
			.update(this.table)
			.set({ deletedAt: new Date() })
			.where(and(eq(this.table['id'], id), isNull(this.table['deletedAt'])))
			.returning({ id: this.table['id'], deleted_at: this.table['deletedAt'] }) as unknown as Promise<
			Partial<TRessouce> & NDETableDelete
		>
	}
}
