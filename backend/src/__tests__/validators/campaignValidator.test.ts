import { validationResult } from 'express-validator';
import {
  createCampaignValidator,
  updateCampaignValidator,
  updateStatusValidator,
  toggleEmergencyValidator,
  getCampaignsValidator,
} from '../../validators/campaignValidator';
import { Request, Response } from 'express';

const runValidators = async (validators: any[], req: Partial<Request>) => {
  const mockReq = req as Request;
  const mockRes = {} as Response;
  const mockNext = jest.fn();

  for (const validator of validators) {
    await validator.run(mockReq);
  }

  return validationResult(mockReq);
};

describe('CampaignValidator', () => {
  describe('createCampaignValidator', () => {
    it('should pass validation with valid campaign data', async () => {
      const req = {
        body: {
          title: 'Help Children Education',
          description: 'This is a detailed description about the campaign for children education',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 50000,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
          status: 'DRAFT',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with short title', async () => {
      const req = {
        body: {
          title: 'Help',
          description: 'This is a detailed description',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 50000,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Title must be between 5 and 255 characters',
          }),
        ])
      );
    });

    it('should fail validation with short description', async () => {
      const req = {
        body: {
          title: 'Help Children',
          description: 'Short desc',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 50000,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Description must be at least 20 characters',
          }),
        ])
      );
    });

    it('should fail validation with invalid category UUID', async () => {
      const req = {
        body: {
          title: 'Help Children',
          description: 'This is a detailed description',
          category_id: 'invalid-uuid',
          target_amount: 50000,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid category ID',
          }),
        ])
      );
    });

    it('should fail validation with target amount below minimum', async () => {
      const req = {
        body: {
          title: 'Help Children',
          description: 'This is a detailed description',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 500,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Target amount must be at least 1000',
          }),
        ])
      );
    });

    it('should fail validation when end date is before start date', async () => {
      const req = {
        body: {
          title: 'Help Children',
          description: 'This is a detailed description',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 50000,
          start_date: '2024-12-31T00:00:00Z',
          end_date: '2024-01-01T00:00:00Z',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'End date must be after start date',
          }),
        ])
      );
    });

    it('should fail validation with invalid status', async () => {
      const req = {
        body: {
          title: 'Help Children',
          description: 'This is a detailed description',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          target_amount: 50000,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
          status: 'INVALID_STATUS',
        },
      };

      const result = await runValidators(createCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Status must be either DRAFT or ACTIVE',
          }),
        ])
      );
    });
  });

  describe('updateCampaignValidator', () => {
    it('should pass validation with valid update data', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          title: 'Updated Campaign Title',
          target_amount: 75000,
        },
      };

      const result = await runValidators(updateCampaignValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation with partial update', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          description: 'Updated description with more details',
        },
      };

      const result = await runValidators(updateCampaignValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          status: 'INVALID',
        },
      };

      const result = await runValidators(updateCampaignValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid status',
          }),
        ])
      );
    });
  });

  describe('updateStatusValidator', () => {
    it('should pass validation with valid status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          status: 'ACTIVE',
        },
      };

      const result = await runValidators(updateStatusValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation without status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {},
      };

      const result = await runValidators(updateStatusValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Status is required',
          }),
        ])
      );
    });

    it('should fail validation with invalid status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          status: 'INVALID',
        },
      };

      const result = await runValidators(updateStatusValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid status',
          }),
        ])
      );
    });
  });

  describe('toggleEmergencyValidator', () => {
    it('should pass validation with boolean emergency status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          is_emergency: true,
        },
      };

      const result = await runValidators(toggleEmergencyValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation without emergency status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {},
      };

      const result = await runValidators(toggleEmergencyValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Emergency status is required',
          }),
        ])
      );
    });

    it('should fail validation with non-boolean emergency status', async () => {
      const req = {
        params: {
          id: 'campaign-id',
        },
        body: {
          is_emergency: 'yes',
        },
      };

      const result = await runValidators(toggleEmergencyValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Emergency status must be a boolean',
          }),
        ])
      );
    });
  });

  describe('getCampaignsValidator', () => {
    it('should pass validation with valid query parameters', async () => {
      const req = {
        query: {
          page: '1',
          limit: '20',
          category_id: '123e4567-e89b-12d3-a456-426614174000',
          status: 'ACTIVE',
          is_emergency: 'true',
          search: 'education',
        },
      };

      const result = await runValidators(getCampaignsValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation with no query parameters', async () => {
      const req = {
        query: {},
      };

      const result = await runValidators(getCampaignsValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid page number', async () => {
      const req = {
        query: {
          page: '0',
        },
      };

      const result = await runValidators(getCampaignsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Page must be a positive integer',
          }),
        ])
      );
    });

    it('should fail validation with limit exceeding maximum', async () => {
      const req = {
        query: {
          limit: '150',
        },
      };

      const result = await runValidators(getCampaignsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Limit must be between 1 and 100',
          }),
        ])
      );
    });

    it('should fail validation with invalid status', async () => {
      const req = {
        query: {
          status: 'INVALID',
        },
      };

      const result = await runValidators(getCampaignsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid status',
          }),
        ])
      );
    });
  });
});
