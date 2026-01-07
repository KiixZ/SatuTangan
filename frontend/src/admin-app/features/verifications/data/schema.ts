import { z } from 'zod'

const verificationSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  full_name: z.string(),
  ktp_name: z.string(),
  ktp_number: z.string(),
  ktp_photo_url: z.string(),
  bank_account_photo_url: z.string(),
  account_number: z.string(),
  bank_name: z.string(),
  terms_photo_url: z.string(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  rejection_reason: z.string().nullable(),
  warning_count: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  email: z.string().optional(),
  user_full_name: z.string().optional(),
})
export type Verification = z.infer<typeof verificationSchema>

export const verificationListSchema = z.array(verificationSchema)

export const reviewVerificationSchema = z
  .object({
    status: z.enum(['APPROVED', 'REJECTED']),
    rejection_reason: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.status === 'REJECTED') {
        return data.rejection_reason && data.rejection_reason.length >= 10
      }
      return true
    },
    {
      message: 'Rejection reason must be at least 10 characters when rejecting',
      path: ['rejection_reason'],
    }
  )
  .refine(
    (data) => {
      if (data.rejection_reason && data.rejection_reason.length > 0) {
        return data.rejection_reason.length <= 500
      }
      return true
    },
    {
      message: 'Rejection reason must not exceed 500 characters',
      path: ['rejection_reason'],
    }
  )

export type ReviewVerificationInput = z.infer<typeof reviewVerificationSchema>
