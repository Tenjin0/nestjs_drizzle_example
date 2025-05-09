import { Module } from '@nestjs/common'
import { LocationService } from './location.service'
import { LocationController } from './location.controller'
import { DbModule } from '../db/db.module'

@Module({
	controllers: [LocationController],
	providers: [LocationService],
	imports: [DbModule],
})
export class LocationModule {}
