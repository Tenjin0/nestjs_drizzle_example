import { DrizzleDB } from '../../db/types/drizzle'
import { AnyPgTable, PgTable } from 'drizzle-orm/pg-core/table'
import { and, count, eq, isNull } from 'drizzle-orm'
import { ETable } from '../enums/table.enum'
import { NotFoundException } from '@nestjs/common'
import { TUser } from '../../db/schema/users'
import { TLocation } from '../../db/schema/locations'
import { TDevice } from '../../db/schema/devices'

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

export interface IJoinTable {
	columns: string[]
	joins: IJoin
	table: AnyPgTable
}
export interface IJoin {
	left: string
	rigth: string
}
export interface IFindOneOpt {
	with: { [key: string]: IJoinTable }
}

export interface IOptionFindAll {
	page: number
	perPage: number
}

export type TRessouce = TUser | TLocation | TDevice

// export type DBTable = PgTableWithColumns<NDETable>
export class NDEServiceDB<TRessouce, CreateRessourceDto extends object, UpdateLocationDto extends object> {
	static DEFAULT_FINDALL_OPT: IOptionFindAll = {
		page: 1,
		perPage: 10,
	}
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

	getVisibleFields(selectFormat: boolean = false) {
		const visibleFields = { id: selectFormat ? this.table['id'] : true }
		for (const key in this.table) {
			if (Object.prototype.hasOwnProperty.call(this.table, key)) {
				if (key === 'enableRLS') {
					break
				}
				if (['createdAt', 'updatedAt', 'deletedAt'].indexOf(key) >= 0) {
					// console.log('here', selectFormat)
					// if (!selectFormat) {
					// 	visibleFields[key] = false
					// }
					continue
				}
				if (this.exludedFields.includes(key)) {
					// if (!selectFormat) {
					// 	visibleFields[key] = false
					// }
					continue
				}
				if (key !== 'id' && key.startsWith('id')) {
					continue
				}

				visibleFields[key] = selectFormat ? this.table[key] : true
			}
		}
		return visibleFields
	}
	public create(createLocationDto: CreateRessourceDto) {
		// console.log(this.db.query.locationTable)
		return this.db
			.insert(this.table)
			.values(createLocationDto as unknown as any)
			.returning() as unknown as Promise<TRessouce>
	}

	public count() {
		return this.db
			.select({ count: count() })
			.from(this.table)
			.limit(1)
			.then((result) => {
				return result[0].count
			})
	}

	public findAll(opt?: IOptionFindAll) {
		if (!opt) {
			opt = NDEServiceDB.DEFAULT_FINDALL_OPT
		}
		const visibleFields = this.getVisibleFields()
		const offset = opt.perPage * (opt.page - 1)

		return this.db.query[this.tableName].findMany({
			limit: opt.perPage,
			offset: offset,
			columns: visibleFields,
		}) as unknown as Promise<TRessouce[]>
	}

	async findOne(id: number, opt?: any) {
		const visibleFields = this.getVisibleFields(false)
		// 	if (opt && opt.with) {
		// 		for (const key in opt.with) {
		// 			if (Object.prototype.hasOwnProperty.call(opt.with, key)) {
		// 				const joinOpt = opt.with[key]
		// 				// for (let i = 0; i < joinOpt.columns.length; i++) {
		// 				// 	const column = joinOpt.columns[i]
		// 				// 	visibleFields['roles.' + column] = joinOpt.table[column]
		// 				// }
		// 				visibleFields = {
		// 					...visibleFields,
		// 					...getTableColumns(joinOpt.table),
		// 				}
		// 			}
		// 		}
		// 	}
		const findManyOpt = {
			limit: 1,
			columns: visibleFields,
			where: eq(this.table['id'], id),
		}
		if (opt?.with) {
			findManyOpt['with'] = opt.with
		}
		// const query = this.db.select(visibleFields).from(this.table).where(findManyOpt.where).limit(1).$dynamic()
		// if (opt && opt.with) {
		// 	for (const key in opt.with) {
		// 		if (Object.prototype.hasOwnProperty.call(opt.with, key)) {
		// 			const joinOpt = opt.with[key]
		// 			query.leftJoin(joinOpt.table, eq(this.table[joinOpt.joins.left], this.table[joinOpt.joins.rigth]))
		// 		}
		// 	}
		// }
		// const ressources = await query
		// console.log(ressources)
		const ressources = await this.db.query[this.tableName].findMany(findManyOpt)
		if (ressources.length === 0) {
			throw new NotFoundException(`${this.tableName}.${id} not found`)
			return null
		}

		if (ressources.length > 0) {
			return ressources[0] as unknown as Promise<TRessouce>
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
