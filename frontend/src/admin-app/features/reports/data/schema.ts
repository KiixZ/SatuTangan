import { z } from 'zod'

export const reportSchema = z.object({
  id: z.string(),
  campaign_id: z.string(),
  reporter_id: z.string().nullable(),
  reporter_email: z.string(),
  reason: z.string(),
  description: z.string(),
  status: z.enum(['PENDING', 'REVIEWED', 'REJECTED']),
  admin_note: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  campaign_title: z.string().optional(),
  campaign_creator_id: z.string().optional(),
  campaign_status: z.string().optional(),
  reporter_name: z.string().optional(),
  creator_name: z.string().optional(),
  creator_email: z.string().optional(),
})

export type Report = z.infer<typeof reportSchema>

export const reviewReportSchema = z.object({
  status: z.enum(['REVIEWED', 'REJECTED']),
  action: z.enum(['WARNING', 'SUSPEND', 'REJECT']),
  admin_note: z.string().min(10, 'Admin note must be at least 10 characters'),
})

export type ReviewReportData = z.infer<typeof reviewReportSchema>
