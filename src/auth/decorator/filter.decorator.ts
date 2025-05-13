import { createParamDecorator } from '@nestjs/common'
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host'
import { IFiltersQuery } from '../../common/interceptors/filter.interceptor'

// GENERATE 400 BAD REQUEST
export const ReqFilter = createParamDecorator((data, host: ExecutionContextHost): IFiltersQuery[] => {
	// const ctx = host.switchToHttp()
	// const request = ctx.getRequest()
	// // eslint-disable-next-line @typescript-eslint/no-unsafe-return
	// console.log(request['filters'])
	// return request['filters'] ?? []
	return []
})
