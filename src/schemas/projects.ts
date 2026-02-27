import { z } from 'zod'

export const projectsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(3),
  perpage: z.coerce.number().int().min(1).max(1000).default(30),
})
