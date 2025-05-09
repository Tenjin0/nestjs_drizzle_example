import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes } from '@nestjs/common'
import { LocationService } from './location.service'
import { CreateLocationDto, createLocationSchema } from './dto/create-location.dto'
import { UpdateLocationDto, updateLocationSchema } from './dto/update-location.dto'
import { ZodValidationPipe } from '../common/pipes/zod_validation.pipe'

@Controller('locations')
export class LocationController {
	constructor(private readonly locationService: LocationService) {}

	@UsePipes(new ZodValidationPipe(createLocationSchema))
	@Post()
	create(@Body() createLocationDto: CreateLocationDto) {
		return this.locationService.create(createLocationDto)
	}

	@Get()
	findAll() {
		return this.locationService.findAll()
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.locationService.findOne(+id)
	}

	@UsePipes(new ZodValidationPipe(updateLocationSchema))
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
		return this.locationService.update(+id, updateLocationDto)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.locationService.remove(+id)
	}
}
