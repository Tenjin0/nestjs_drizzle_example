import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}
	transform(value: any, metadata: ArgumentMetadata) {
		try {
			const parsedValue = this.schema.parse(value)
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return
			return parsedValue
		} catch (err) {
			const error = new BadRequestException('Validation failed')
			error['data'] = err
			throw error
		}
	}
}
