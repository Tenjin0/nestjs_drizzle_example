import { Delete, Get, Param, Query, Req, UseInterceptors, UsePipes } from '@nestjs/common'
import { NDEServiceDB } from './servicesDB.class'
import { PaginationDTO, paginationSchema } from '../dto/pagination.dto'
import { ZodValidationPipe } from '../pipes/zod_validation.pipe'
import { FastifyRequest } from 'fastify'
import { FilterInterceptor, IFiltersQuery } from '../interceptors/filter.interceptor'
export interface IMeta {
	page: number
	per_page: number
	total_pages: number
	total: number
	fields: string[]
}
export interface ILinks {
	previous: string | null
	next: string | null
}
export class controllerNDE<TRessource, CreateRessourceDto extends object, UpdateLocationDto extends object> {
	static DEFAULT_PER_PAGE = 10
	constructor(protected ressourceService: NDEServiceDB<TRessource, CreateRessourceDto, UpdateLocationDto>) {}
	@Get()
	@UseInterceptors(FilterInterceptor)
	@UsePipes(new ZodValidationPipe(paginationSchema))
	async findAll(
		@Req() req: FastifyRequest,
		@Query() paginationDTO: PaginationDTO,
		// @ReqFilter() filters: IFiltersQuery[],
	) {
		const filters: IFiltersQuery[] = req['filters']
		const count = await this.ressourceService.count(filters)
		const perPage = paginationDTO?.per_page ?? controllerNDE.DEFAULT_PER_PAGE
		const page = paginationDTO?.page ?? 1
		const totalPages = Math.ceil(count / perPage)
		const meta: IMeta = {
			page: page,
			per_page: controllerNDE.DEFAULT_PER_PAGE,
			total_pages: totalPages,
			total: count,
			fields: this.ressourceService.getFieldsArray(),
		}
		const links = this.getLinks(req, meta)
		const datas = await this.ressourceService.findAll(filters, {
			page: paginationDTO.page,
			perPage: paginationDTO.per_page,
		})
		return {
			meta: meta,
			data: datas,
			links: links,
		}
	}

	getLinks(req: any, meta: IMeta) {
		const url = new URL(`${req.protocol}://${req.host}${req.raw.url}`)
		const params = new URLSearchParams(url.search)

		const links: ILinks = {
			previous: null,
			next: null,
		}

		if (meta.page > 1) {
			params.set('page', String(meta.page - 1))
			links.previous = `${req.protocol}://${req.host}${req.raw.url}/${params.toString()}`
		}
		if (meta.page < meta.total_pages) {
			params.set('page', String(meta.page + 1))
			links.next = `${req.protocol}://${req.host}${req.raw.url}/${params.toString()}`
		}
		return links
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.ressourceService.findOne(+id).then((result) => {
			return {
				data: result,
			}
		})
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.ressourceService.remove(+id)
	}
}
