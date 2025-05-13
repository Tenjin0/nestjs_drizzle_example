import { Controller, Post, Body, Patch, Param, UsePipes } from '@nestjs/common'
import { LocationService } from './location.service'
import { CreateLocationDto, createLocationSchema } from './dto/create-location.dto'
import { UpdateLocationDto, updateLocationSchema } from './dto/update-location.dto'
import { ZodValidationPipe } from '../common/pipes/zod_validation.pipe'
import { controllerNDE } from '../common/abstracts/controller.class'
import { TLocation } from '../db/schema/locations'

// @UseGuards(JwtAuthGuard)
@Controller('locations')
export class LocationController extends controllerNDE<TLocation, CreateLocationDto, UpdateLocationDto> {
	constructor(private readonly locationService: LocationService) {
		super(locationService)
	}

	@UsePipes(new ZodValidationPipe(createLocationSchema))
	@Post()
	create(@Body() createLocationDto: CreateLocationDto) {
		return this.locationService.create(createLocationDto)
	}

	@UsePipes(new ZodValidationPipe(updateLocationSchema))
	@Patch(':id')
	update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
		return this.locationService.update(+id, updateLocationDto)
	}
}
