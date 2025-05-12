import { Module } from '@nestjs/common'
import { SocketService } from './socket.service'
import { DbModule } from '../db/db.module'
import { SocketGateway } from './socket.gateway'
import { DeviceService } from '../device/device.service'

@Module({
	controllers: [],
	providers: [SocketService, SocketGateway, DeviceService],
	imports: [DbModule],
})
export class SocketModule {}
