import api from './api';

export interface CreateDonationParams {
  campaignId: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  amount: number;
  prayer?: string;
  isAnonymous: boolean;
}

export interface DonationResponse {
  id: string;
  orderId: string;
  token: string;
  redirectUrl: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_name: string;
  donor_email: string;
  amount: number;
  prayer: string | null;
  is_anonymous: boolean;
  status: string;
  created_at: string;
  campaign_title?: string;
  campaign_thumbnail?: string;
}

const donationService = {
  async createDonation(params: CreateDonationParams): Promise<DonationResponse> {
    const response = await api.post('/donations', params);
    return response.data.data;
  },

  async getDonationById(id: string): Promise<Donation> {
    const response = await api.get(`/donations/${id}`);
    return response.data.data;
  },

  async getUserDonationHistory(): Promise<Donation[]> {
    const response = await api.get('/donations/user/history');
    return response.data.data;
  },

  async getCampaignDonations(campaignId: string, limit: number = 10): Promise<Donation[]> {
    const response = await api.get(`/campaigns/${campaignId}/donations`, {
      params: { limit },
    });
    return response.data.data;
  },

  async getCampaignPrayers(campaignId: string, limit: number = 20): Promise<Donation[]> {
    const response = await api.get(`/campaigns/${campaignId}/prayers`, {
      params: { limit },
    });
    return response.data.data;
  },
};

export default donationService;
