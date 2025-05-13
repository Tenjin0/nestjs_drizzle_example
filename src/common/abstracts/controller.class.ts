import { Delete, Get, Param, Query, UsePipes } from '@nestjs/common'
import { NDEServiceDB } from './servicesDB.class'
import { PaginationDTO, paginationSchema } from '../dto/pagination.dto'
import { ZodValidationPipe } from '../pipes/zod_validation.pipe'

export class controllerNDE<TRessource, CreateRessourceDto extends object, UpdateLocationDto extends object> {
	static DEFAULT_PER_PAGE = 10
	constructor(protected ressourceService: NDEServiceDB<TRessource, CreateRessourceDto, UpdateLocationDto>) {}
	@Get()
	@UsePipes(new ZodValidationPipe(paginationSchema))
	async findAll(@Query() paginationDTO: PaginationDTO) {
		console.log(paginationDTO)
		const count = await this.ressourceService.count()
		const perPage = controllerNDE.DEFAULT_PER_PAGE
		const totalPages = Math.ceil(count / perPage)
		const meta = {
			page: 1,
			per_page: controllerNDE.DEFAULT_PER_PAGE,
			total_pages: totalPages,
			total: count,
		}
		const datas = await this.ressourceService.findAll({ page: paginationDTO.page, perPage: paginationDTO.per_page })
		return {
			meta: meta,
			data: datas,
			links: null,
		}
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ressourceService.findOne(+id)
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ressourceService.remove(+id)
	}
}
