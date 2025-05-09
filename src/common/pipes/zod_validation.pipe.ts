import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'
import { IdParamSchema } from './id_param_zod'

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}
	transform(value: any, metadata: ArgumentMetadata) {
		try {
			const schema = metadata.type === 'param' && metadata.data === 'id' ? IdParamSchema : this.schema
			const parsedValue = schema.parse(value)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return parsedValue
		} catch (err) {
			const error = new BadRequestException('Validation failed')
			error['data'] = err
			throw error
		}
	}
}
