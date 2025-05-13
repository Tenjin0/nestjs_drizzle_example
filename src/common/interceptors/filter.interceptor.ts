import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { Observable } from 'rxjs'
import { URL } from 'url'

export type TFilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like'
export interface IFiltersQuery {
	name: string
	value: string | number
	op: TFilterOperator
}

@Injectable()
export class FilterInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<FastifyRequest>()
		const filters: IFiltersQuery[] = []
		const url = new URL(`${request.protocol}://${request.hostname}${request.url}`)
		const filterRegEx = /(.+)\[(neq|eq|gt|gte|lt|lte|like)]/

		url.searchParams.forEach((value, name) => {
			const filter = name.match(filterRegEx)
			if (filter) {
				const parsedValue = Number.parseInt(value)
				filters.push({
					name: filter[1],
					value: Number.isNaN(parsedValue) || value.includes('-') ? value : parsedValue,
					op: filter[2] as TFilterOperator,
				})
			}
		})
		request['filters'] = filters
		return next.handle()
	}
}
