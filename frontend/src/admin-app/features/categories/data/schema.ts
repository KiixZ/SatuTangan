import { z } from 'zod'

const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  icon_url: z.string().nullable(),
  sdgs_ref: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
})
export type Category = z.infer<typeof categorySchema>

export const categoryListSchema = z.array(categorySchema)

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  description: z.string().max(1000).optional(),
  icon_url: z.string().url('Must be a valid URL').max(500).optional(),
  sdgs_ref: z.string().max(100).optional(),
})
export type CreateCategoryInput = z.infer<typeof createCategorySchema>

export const updateCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255).optional(),
  description: z.string().max(1000).optional(),
  icon_url: z.string().url('Must be a valid URL').max(500).optional(),
  sdgs_ref: z.string().max(100).optional(),
})
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
