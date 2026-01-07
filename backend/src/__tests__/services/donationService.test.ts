import donationService from '../../services/donationService';
import { DatabaseService } from '../../services/databaseService';
import midtransService from '../../services/midtransService';

jest.mock('../../services/databaseService');
jest.mock('../../services/midtransService');

describe('DonationService', () => {
  let mockDb: jest.Mocked<DatabaseService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockDb = new DatabaseService() as jest.Mocked<DatabaseService>;
    (donationService as any).db = mockDb;
  });

  describe('createDonation', () => {
    it('should successfully create a donation', async () => {
      const mockDonationParams = {
        campaignId: 'campaign-1',
        userId: 'user-1',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorPhone: '+1234567890',
        amount: 50000,
        prayer: 'May this help',
        isAnonymous: false,
      };

      const mockCampaign = {
        id: 'campaign-1',
        title: 'Test Campaign',
        collected_amount: 100000,
      };

      const mockMidtransResponse = {
        token: 'midtrans-token',
        redirect_url: 'https://midtrans.com/pay',
      };

      mockDb.query = jest.fn().mockResolvedValue([mockCampaign]);
      mockDb.execute = jest.fn().mockResolvedValue({ insertId: 1 });
      (midtransService.createTransaction as jest.Mock).mockResolvedValue(mockMidtransResponse);

      const result = await donationService.createDonation(mockDonationParams);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('orderId');
      expect(result).toHaveProperty('token');
      expect(result).toHaveProperty('redirectUrl');
      expect(result.token).toBe('midtrans-token');
      expect(mockDb.query).toHaveBeenCalledWith(
        'SELECT id, title, collected_amount FROM campaigns WHERE id = ? AND status = ?',
        ['campaign-1', 'ACTIVE']
      );
      expect(midtransService.createTransaction).toHaveBeenCalled();
      expect(mockDb.execute).toHaveBeenCalled();
    });

    it('should throw error if campaign not found', async () => {
      const mockDonationParams = {
        campaignId: 'nonexistent-campaign',
        donorName: 'John Doe',
        donorEmail: 'john@example.com',
        donorPhone: '+1234567890',
        amount: 50000,
        isAnonymous: false,
      };

      mockDb.query = jest.fn().mockResolvedValue([]);

      await expect(donationService.createDonation(mockDonationParams)).rejects.toThrow(
        'Campaign not found or not active'
      );
      expect(midtransService.createTransaction).not.toHaveBeenCalled();
      expect(mockDb.execute).not.toHaveBeenCalled();
    });

    it('should create anonymous donation', async () => {
      const mockDonationParams = {
        campaignId: 'campaign-1',
        donorName: 'Anonymous',
        donorEmail: 'anon@example.com',
        donorPhone: '+1234567890',
        amount: 25000,
        isAnonymous: true,
      };

      const mockCampaign = {
        id: 'campaign-1',
        title: 'Test Campaign',
        collected_amount: 100000,
      };

      const mockMidtransResponse = {
        token: 'midtrans-token',
        redirect_url: 'https://midtrans.com/pay',
      };

      mockDb.query = jest.fn().mockResolvedValue([mockCampaign]);
      mockDb.execute = jest.fn().mockResolvedValue({ insertId: 1 });
      (midtransService.createTransaction as jest.Mock).mockResolvedValue(mockMidtransResponse);

      const result = await donationService.createDonation(mockDonationParams);

      expect(result).toHaveProperty('id');
      expect(mockDb.execute).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([
          expect.any(String),
          'campaign-1',
          null,
          'Anonymous',
          'anon@example.com',
          '+1234567890',
          25000,
          null,
          true,
          'PENDING',
          expect.any(String),
          'midtrans-token',
        ])
      );
    });
  });

  describe('updateDonationStatus', () => {
    it('should update donation status to SUCCESS and update campaign amount', async () => {
      const mockOrderId = 'DONATION-123';
      const mockDonation = {
        campaign_id: 'campaign-1',
        amount: 50000,
      };

      mockDb.execute = jest.fn().mockResolvedValue({ affectedRows: 1 });
      mockDb.query = jest.fn().mockResolvedValue([mockDonation]);

      await donationService.updateDonationStatus(mockOrderId, 'SUCCESS');

      expect(mockDb.execute).toHaveBeenCalledWith(
        'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE midtrans_order_id = ?',
        ['SUCCESS', mockOrderId]
      );
      expect(mockDb.execute).toHaveBeenCalledWith(
        'UPDATE campaigns SET collected_amount = collected_amount + ? WHERE id = ?',
        [50000, 'campaign-1']
      );
    });

    it('should update donation status to FAILED without updating campaign', async () => {
      const mockOrderId = 'DONATION-123';

      mockDb.execute = jest.fn().mockResolvedValue({ affectedRows: 1 });
      mockDb.query = jest.fn().mockResolvedValue([]);

      await donationService.updateDonationStatus(mockOrderId, 'FAILED');

      expect(mockDb.execute).toHaveBeenCalledTimes(1);
      expect(mockDb.execute).toHaveBeenCalledWith(
        'UPDATE donations SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE midtrans_order_id = ?',
        ['FAILED', mockOrderId]
      );
    });
  });

  describe('getDonationById', () => {
    it('should return donation with campaign details', async () => {
      const mockDonation = {
        id: 'donation-1',
        campaign_id: 'campaign-1',
        donor_name: 'John Doe',
        amount: 50000,
        status: 'SUCCESS',
        campaign_title: 'Test Campaign',
      };

      mockDb.query = jest.fn().mockResolvedValue([mockDonation]);

      const result = await donationService.getDonationById('donation-1');

      expect(result).toEqual(mockDonation);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT d.*, c.title as campaign_title'),
        ['donation-1']
      );
    });

    it('should return null when donation not found', async () => {
      mockDb.query = jest.fn().mockResolvedValue([]);

      const result = await donationService.getDonationById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('getDonationByOrderId', () => {
    it('should return donation by order ID', async () => {
      const mockDonation = {
        id: 'donation-1',
        midtrans_order_id: 'DONATION-123',
        amount: 50000,
        campaign_title: 'Test Campaign',
      };

      mockDb.query = jest.fn().mockResolvedValue([mockDonation]);

      const result = await donationService.getDonationByOrderId('DONATION-123');

      expect(result).toEqual(mockDonation);
    });

    it('should return null when order not found', async () => {
      mockDb.query = jest.fn().mockResolvedValue([]);

      const result = await donationService.getDonationByOrderId('NONEXISTENT-ORDER');

      expect(result).toBeNull();
    });
  });

  describe('getUserDonationHistory', () => {
    it('should return user donation history including pre-registration donations', async () => {
      const mockDonations = [
        {
          id: 'donation-1',
          user_id: 'user-1',
          donor_email: 'john@example.com',
          amount: 50000,
          status: 'SUCCESS',
          campaign_title: 'Campaign 1',
        },
        {
          id: 'donation-2',
          user_id: null,
          donor_email: 'john@example.com',
          amount: 25000,
          status: 'SUCCESS',
          campaign_title: 'Campaign 2',
        },
      ];

      mockDb.query = jest.fn().mockResolvedValue(mockDonations);

      const result = await donationService.getUserDonationHistory('user-1', 'john@example.com');

      expect(result).toEqual(mockDonations);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE (d.user_id = ? OR d.donor_email = ?) AND d.status = ?'),
        ['user-1', 'john@example.com', 'SUCCESS']
      );
    });
  });

  describe('getCampaignDonations', () => {
    it('should return recent donations for a campaign', async () => {
      const mockDonations = [
        {
          id: 'donation-1',
          donor_name: 'John Doe',
          amount: 50000,
          is_anonymous: false,
          created_at: new Date(),
        },
        {
          id: 'donation-2',
          donor_name: 'Jane Smith',
          amount: 25000,
          is_anonymous: true,
          created_at: new Date(),
        },
      ];

      mockDb.query = jest.fn().mockResolvedValue(mockDonations);

      const result = await donationService.getCampaignDonations('campaign-1', 10);

      expect(result).toHaveLength(2);
      expect(result[0].donor_name).toBe('John Doe');
      expect(result[1].donor_name).toBe('Hamba Allah');
    });

    it('should hide donor names for anonymous donations', async () => {
      const mockDonations = [
        {
          id: 'donation-1',
          donor_name: 'Anonymous Donor',
          amount: 100000,
          is_anonymous: true,
          created_at: new Date(),
        },
      ];

      mockDb.query = jest.fn().mockResolvedValue(mockDonations);

      const result = await donationService.getCampaignDonations('campaign-1');

      expect(result[0].donor_name).toBe('Hamba Allah');
    });
  });

  describe('getCampaignPrayers', () => {
    it('should return prayers with donor names', async () => {
      const mockPrayers = [
        {
          id: 'donation-1',
          donor_name: 'John Doe',
          prayer: 'May this help those in need',
          is_anonymous: false,
          created_at: new Date(),
        },
        {
          id: 'donation-2',
          donor_name: 'Jane Smith',
          prayer: 'Blessings to all',
          is_anonymous: true,
          created_at: new Date(),
        },
      ];

      mockDb.query = jest.fn().mockResolvedValue(mockPrayers);

      const result = await donationService.getCampaignPrayers('campaign-1', 20);

      expect(result).toHaveLength(2);
      expect(result[0].donor_name).toBe('John Doe');
      expect(result[1].donor_name).toBe('Hamba Allah');
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining("WHERE campaign_id = ? AND status = ? AND prayer IS NOT NULL AND prayer != ''"),
        ['campaign-1', 'SUCCESS', 20]
      );
    });

    it('should only return donations with prayers', async () => {
      const mockPrayers = [
        {
          id: 'donation-1',
          donor_name: 'John Doe',
          prayer: 'Good wishes',
          is_anonymous: false,
          created_at: new Date(),
        },
      ];

      mockDb.query = jest.fn().mockResolvedValue(mockPrayers);

      const result = await donationService.getCampaignPrayers('campaign-1');

      expect(result).toHaveLength(1);
      expect(result[0].prayer).toBe('Good wishes');
    });
  });
});
