import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UpdateDeviceDto } from './dto/update-device.dto'
import { DRIZZLE } from '../db/db.module'
import { DrizzleDB } from '../db/types/drizzle'
import { devicesTable } from '../db/schema'
import { NDEServiceDB } from '../common/abstracts/servicesDB.class'
import { ETable } from '../common/enums/table.enum'
import { eq } from 'drizzle-orm'

@Injectable()
export class DeviceService extends NDEServiceDB<typeof devicesTable, object, UpdateDeviceDto> {
	constructor(@Inject(DRIZZLE) protected db: DrizzleDB) {
		super(db, devicesTable, ETable.DEVICE)
	}

	public findAll() {
		return this.db.query.devicesTable.findMany() as unknown as Promise<(typeof devicesTable)[]>
	}

	public findBySerial(serial: string) {
		return this.db.query.devicesTable
			.findMany({
				where: eq(devicesTable.serial, serial),
			})
			.then((devices) => {
				if (devices.length > 0) {
					return devices[0]
				}
				throw new NotFoundException(`${this.tableName}.${serial} not found`)
			})
	}
}
