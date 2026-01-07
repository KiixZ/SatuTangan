import { z } from 'zod';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category_id: string;
  creator_id: string;
  target_amount: number;
  collected_amount: number;
  thumbnail_url: string;
  start_date: string;
  end_date: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
  is_emergency: boolean;
  created_at: string;
  updated_at: string;
  category_name?: string;
  creator_name?: string;
  creator_email?: string;
}

export const campaignFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  category_id: z.string().min(1, 'Category is required'),
  target_amount: z.coerce.number().min(1, 'Target amount must be greater than 0'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'SUSPENDED']).default('DRAFT'),
});

export type CampaignFormValues = z.infer<typeof campaignFormSchema>;

export interface CreateCampaignInput {
  title: string;
  description: string;
  category_id: string;
  target_amount: number;
  start_date: string;
  end_date: string;
  status?: 'DRAFT' | 'ACTIVE';
}

export interface UpdateCampaignInput {
  title?: string;
  description?: string;
  category_id?: string;
  target_amount?: number;
  start_date?: string;
  end_date?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED';
}
