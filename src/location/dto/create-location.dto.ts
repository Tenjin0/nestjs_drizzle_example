import { z } from 'zod'

export const createLocationSchema = z
	.object({
		namespace: z.string(),
	})
	.required()

export type CreateLocationDto = z.infer<typeof createLocationSchema>
