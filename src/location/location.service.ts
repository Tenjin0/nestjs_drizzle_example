import { Inject, Injectable } from '@nestjs/common'
import { CreateLocationDto } from './dto/create-location.dto'
import { UpdateLocationDto } from './dto/update-location.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { NDEServiceDB } from '../common/abstracts/servicesDB.class'
import { locationsTable, TLocation } from '../db/schema/locations'
import { ETable } from '../common/enums/table.enum'

export interface IValues {
	id: number
	namespace: string
}

@Injectable()
export class LocationService extends NDEServiceDB<TLocation, CreateLocationDto, UpdateLocationDto> {
	constructor(@Inject(DRIZZLE) protected db: DrizzleDB) {
		super(db, locationsTable, ETable.LOCATION)
	}

	public create(createLocationDto: CreateLocationDto) {
		return super.create(createLocationDto)
	}
}
