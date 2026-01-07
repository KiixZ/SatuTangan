import { z } from 'zod';

export const withdrawalSchema = z.object({
  id: z.string(),
  campaign_id: z.string(),
  amount: z.number(),
  note: z.string().nullable(),
  status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED']),
  processed_by: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  campaign_title: z.string().optional(),
  campaign_creator_id: z.string().optional(),
  creator_name: z.string().optional(),
  creator_email: z.string().optional(),
  bank_name: z.string().optional(),
  account_number: z.string().optional(),
  processed_by_name: z.string().optional(),
});

export type Withdrawal = z.infer<typeof withdrawalSchema>;

export const createWithdrawalSchema = z.object({
  campaign_id: z.string().min(1, 'Campaign is required'),
  amount: z.number().min(1000, 'Amount must be at least 1000'),
  note: z.string().optional(),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;

export const updateWithdrawalStatusSchema = z.object({
  status: z.enum(['PROCESSING', 'COMPLETED', 'FAILED']),
});

export type UpdateWithdrawalStatusInput = z.infer<typeof updateWithdrawalStatusSchema>;
