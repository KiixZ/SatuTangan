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
  donor_count?: number;
  photo_count?: number;
  update_count?: number;
}

export interface CampaignListResponse {
  success: boolean;
  data: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon_url: string | null;
  sdgs_ref: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryListResponse {
  success: boolean;
  data: Category[];
}

export interface CampaignPhoto {
  id: string;
  campaign_id: string;
  photo_url: string;
  created_at: string;
}

export interface CampaignUpdate {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  photo_url: string | null;
  is_automatic: boolean;
  created_at: string;
}

export interface CampaignDetailData extends Campaign {
  photos?: CampaignPhoto[];
  updates?: CampaignUpdate[];
}
