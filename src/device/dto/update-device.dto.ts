import { z } from 'zod'

export const updateDeviceSchema = z.object({
	alias: z.string(),
})

export type UpdateDeviceDto = z.infer<typeof updateDeviceSchema>
