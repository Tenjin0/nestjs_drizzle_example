import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common'
import { DeviceService } from './device.service'
import { UpdateDeviceDto } from './dto/update-device.dto'

@Controller('devices')
export class DeviceController {
	constructor(private readonly deviceService: DeviceService) {}

	@Get()
	findAll() {
		return this.deviceService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.deviceService.findOne(+id)
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
		return this.deviceService.update(+id, updateDeviceDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.deviceService.remove(+id)
	}
}
