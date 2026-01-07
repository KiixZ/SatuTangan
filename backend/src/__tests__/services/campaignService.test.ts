import campaignService from '../../services/campaignService';
import databaseService from '../../services/databaseService';

jest.mock('../../services/databaseService');

describe('CampaignService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getCampaigns', () => {
    it('should return paginated campaigns with default parameters', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          title: 'Test Campaign 1',
          description: 'Description 1',
          category_id: 'cat-1',
          creator_id: 'user-1',
          target_amount: 10000,
          collected_amount: 5000,
          status: 'ACTIVE',
          is_emergency: false,
        },
      ];

      (databaseService.query as jest.Mock)
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce(mockCampaigns);

      const result = await campaignService.getCampaigns();

      expect(result.data).toEqual(mockCampaigns);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      });
    });

    it('should filter campaigns by category', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          title: 'Test Campaign',
          category_id: 'cat-1',
          status: 'ACTIVE',
        },
      ];

      (databaseService.query as jest.Mock)
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce(mockCampaigns);

      const result = await campaignService.getCampaigns({ category_id: 'cat-1' });

      expect(result.data).toEqual(mockCampaigns);
      expect(databaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.category_id = ?'),
        expect.arrayContaining(['cat-1'])
      );
    });

    it('should filter campaigns by status', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          title: 'Active Campaign',
          status: 'ACTIVE',
        },
      ];

      (databaseService.query as jest.Mock)
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce(mockCampaigns);

      const result = await campaignService.getCampaigns({ status: 'ACTIVE' });

      expect(result.data).toEqual(mockCampaigns);
      expect(databaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.status = ?'),
        expect.arrayContaining(['ACTIVE'])
      );
    });

    it('should filter emergency campaigns', async () => {
      const mockCampaigns = [
        {
          id: 'campaign-1',
          title: 'Emergency Campaign',
          is_emergency: true,
        },
      ];

      (databaseService.query as jest.Mock)
        .mockResolvedValueOnce([{ total: 1 }])
        .mockResolvedValueOnce(mockCampaigns);

      const result = await campaignService.getCampaigns({ is_emergency: true });

      expect(result.data).toEqual(mockCampaigns);
    });
  });

  describe('getCampaignById', () => {
    it('should return campaign with details when found', async () => {
      const mockCampaign = {
        id: 'campaign-1',
        title: 'Test Campaign',
        description: 'Test Description',
        category_name: 'Education',
        creator_name: 'John Doe',
        creator_email: 'john@example.com',
      };

      (databaseService.query as jest.Mock).mockResolvedValue([mockCampaign]);

      const result = await campaignService.getCampaignById('campaign-1');

      expect(result).toEqual(mockCampaign);
      expect(databaseService.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE c.id = ?'),
        ['campaign-1']
      );
    });

    it('should return null when campaign not found', async () => {
      (databaseService.query as jest.Mock).mockResolvedValue([]);

      const result = await campaignService.getCampaignById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('createCampaign', () => {
    it('should successfully create a campaign', async () => {
      const mockCampaignData = {
        title: 'New Campaign',
        description: 'Campaign Description',
        category_id: 'cat-1',
        creator_id: 'user-1',
        target_amount: 50000,
        thumbnail_url: '/uploads/thumb.jpg',
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'DRAFT' as const,
      };

      (databaseService.execute as jest.Mock).mockResolvedValue({ insertId: 123 });

      const result = await campaignService.createCampaign(mockCampaignData);

      expect(result).toBe('123');
      expect(databaseService.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO campaigns'),
        expect.arrayContaining([
          mockCampaignData.title,
          mockCampaignData.description,
          mockCampaignData.category_id,
          mockCampaignData.creator_id,
          mockCampaignData.target_amount,
          mockCampaignData.thumbnail_url,
          mockCampaignData.start_date,
          mockCampaignData.end_date,
          'DRAFT',
        ])
      );
    });
  });

  describe('updateCampaign', () => {
    it('should successfully update campaign fields', async () => {
      const mockUpdateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        target_amount: 75000,
      };

      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.updateCampaign('campaign-1', mockUpdateData);

      expect(result).toBe(true);
      expect(databaseService.execute).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE campaigns'),
        expect.arrayContaining([
          mockUpdateData.title,
          mockUpdateData.description,
          mockUpdateData.target_amount,
          'campaign-1',
        ])
      );
    });

    it('should return false when no fields to update', async () => {
      const result = await campaignService.updateCampaign('campaign-1', {});

      expect(result).toBe(false);
      expect(databaseService.execute).not.toHaveBeenCalled();
    });

    it('should return false when campaign not found', async () => {
      const mockUpdateData = {
        title: 'Updated Title',
      };

      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 0 });

      const result = await campaignService.updateCampaign('nonexistent-id', mockUpdateData);

      expect(result).toBe(false);
    });
  });

  describe('deleteCampaign', () => {
    it('should successfully delete a campaign', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.deleteCampaign('campaign-1');

      expect(result).toBe(true);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'DELETE FROM campaigns WHERE id = ?',
        ['campaign-1']
      );
    });

    it('should return false when campaign not found', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 0 });

      const result = await campaignService.deleteCampaign('nonexistent-id');

      expect(result).toBe(false);
    });
  });

  describe('updateCampaignStatus', () => {
    it('should successfully update campaign status', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.updateCampaignStatus('campaign-1', 'ACTIVE');

      expect(result).toBe(true);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE campaigns SET status = ? WHERE id = ?',
        ['ACTIVE', 'campaign-1']
      );
    });
  });

  describe('toggleEmergency', () => {
    it('should successfully toggle emergency status', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.toggleEmergency('campaign-1', true);

      expect(result).toBe(true);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE campaigns SET is_emergency = ? WHERE id = ?',
        [true, 'campaign-1']
      );
    });
  });

  describe('isCreator', () => {
    it('should return true when user is campaign creator', async () => {
      (databaseService.query as jest.Mock).mockResolvedValue([{ id: 'campaign-1' }]);

      const result = await campaignService.isCreator('campaign-1', 'user-1');

      expect(result).toBe(true);
      expect(databaseService.query).toHaveBeenCalledWith(
        'SELECT id FROM campaigns WHERE id = ? AND creator_id = ?',
        ['campaign-1', 'user-1']
      );
    });

    it('should return false when user is not campaign creator', async () => {
      (databaseService.query as jest.Mock).mockResolvedValue([]);

      const result = await campaignService.isCreator('campaign-1', 'user-2');

      expect(result).toBe(false);
    });
  });

  describe('updateCollectedAmount', () => {
    it('should successfully update collected amount', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.updateCollectedAmount('campaign-1', 10000);

      expect(result).toBe(true);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE campaigns SET collected_amount = collected_amount + ? WHERE id = ?',
        [10000, 'campaign-1']
      );
    });
  });

  describe('addCampaignPhoto', () => {
    it('should successfully add campaign photo', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ insertId: 456 });

      const result = await campaignService.addCampaignPhoto('campaign-1', '/uploads/photo.jpg');

      expect(result).toBe('456');
      expect(databaseService.execute).toHaveBeenCalledWith(
        'INSERT INTO campaign_photos (campaign_id, photo_url) VALUES (?, ?)',
        ['campaign-1', '/uploads/photo.jpg']
      );
    });
  });

  describe('getCampaignPhotos', () => {
    it('should return campaign photos', async () => {
      const mockPhotos = [
        { id: 'photo-1', campaign_id: 'campaign-1', photo_url: '/uploads/photo1.jpg' },
        { id: 'photo-2', campaign_id: 'campaign-1', photo_url: '/uploads/photo2.jpg' },
      ];

      (databaseService.query as jest.Mock).mockResolvedValue(mockPhotos);

      const result = await campaignService.getCampaignPhotos('campaign-1');

      expect(result).toEqual(mockPhotos);
    });
  });

  describe('deleteCampaignPhoto', () => {
    it('should successfully delete campaign photo', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await campaignService.deleteCampaignPhoto('photo-1');

      expect(result).toBe(true);
    });
  });

  describe('addCampaignUpdate', () => {
    it('should successfully add campaign update', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ insertId: 789 });

      const result = await campaignService.addCampaignUpdate(
        'campaign-1',
        'Update Title',
        'Update Description',
        '/uploads/update.jpg',
        false
      );

      expect(result).toBe('789');
      expect(databaseService.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO campaign_updates'),
        ['campaign-1', 'Update Title', 'Update Description', '/uploads/update.jpg', false]
      );
    });

    it('should add automatic update without photo', async () => {
      (databaseService.execute as jest.Mock).mockResolvedValue({ insertId: 790 });

      const result = await campaignService.addCampaignUpdate(
        'campaign-1',
        'Withdrawal Update',
        'Funds withdrawn',
        undefined,
        true
      );

      expect(result).toBe('790');
      expect(databaseService.execute).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO campaign_updates'),
        ['campaign-1', 'Withdrawal Update', 'Funds withdrawn', null, true]
      );
    });
  });

  describe('getCampaignUpdates', () => {
    it('should return campaign updates', async () => {
      const mockUpdates = [
        {
          id: 'update-1',
          campaign_id: 'campaign-1',
          title: 'Update 1',
          description: 'Description 1',
        },
      ];

      (databaseService.query as jest.Mock).mockResolvedValue(mockUpdates);

      const result = await campaignService.getCampaignUpdates('campaign-1');

      expect(result).toEqual(mockUpdates);
    });
  });
});
