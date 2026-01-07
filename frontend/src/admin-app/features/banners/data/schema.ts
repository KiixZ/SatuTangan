import { z } from 'zod';

export const bannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  image_url: z.string(),
  link_url: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type Banner = z.infer<typeof bannerSchema>;

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters'),
  description: z.string().optional(),
  link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().default(true),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;

export const updateBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must not exceed 255 characters').optional(),
  description: z.string().optional(),
  link_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  is_active: z.boolean().optional(),
});

export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
