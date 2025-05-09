import { z } from 'zod'

export const IdParamSchema = z.string().transform((arg, ctx) => {
	const parsed = parseInt(arg, 10)
	// if (Number.isNaN(val)) throw new BadRequestException(metadata.data + ' must be a number')
	// if (val <= 0) throw new BadRequestException(metadata.data + ' must be a positive number')
	if (isNaN(parsed)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'must be a number',
		})
		return z.NEVER
	}
	if (parsed <= 0) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: ' must be positive',
		})
		return z.NEVER
	}
	return parsed
})

export type IdParamDto = z.infer<typeof IdParamSchema>
