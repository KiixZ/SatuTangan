import api from './api';

export interface SubmitReportData {
  campaign_id: string;
  reporter_email: string;
  reason: string;
  description: string;
}

export interface Report {
  id: string;
  campaign_id: string;
  reporter_id: string | null;
  reporter_email: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'REVIEWED' | 'REJECTED';
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  campaign_title?: string;
  reporter_name?: string;
}

export const reportService = {
  /**
   * Submit a report for a campaign
   */
  async submitReport(data: SubmitReportData): Promise<{ success: boolean; message: string; data: { id: string } }> {
    const response = await api.post('/reports', data);
    return response.data;
  },
};

export default reportService;
