import { Inject, Injectable } from '@nestjs/common'
import { UpdateDeviceDto } from './dto/update-device.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { devicesTable } from '../db/schema'
import { NDEServiceDB } from '../common/abstracts/servicesDB.class'
import { ETable } from '../common/enums/table.enum'

@Injectable()
export class DeviceService extends NDEServiceDB<typeof devicesTable, object, UpdateDeviceDto> {
	constructor(@Inject(DRIZZLE) protected db: DrizzleDB) {
		super(db, devicesTable, ETable.DEVICE)
	}

	public findAll() {
		return this.db.query.devicesTable.findMany() as unknown as Promise<(typeof devicesTable)[]>
	}
}
