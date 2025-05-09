import { Module } from '@nestjs/common'
import { DeviceService } from './device.service'
import { DeviceController } from './device.controller'
import { DbModule } from '../db/db.module'

@Module({
	controllers: [DeviceController],
	providers: [DeviceService],
	imports: [DbModule],
})
export class DeviceModule {}
