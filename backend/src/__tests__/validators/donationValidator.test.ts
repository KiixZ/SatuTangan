import { validationResult } from 'express-validator';
import {
  createDonationValidator,
  getDonationByIdValidator,
  getCampaignDonationsValidator,
  getCampaignPrayersValidator,
} from '../../validators/donationValidator';
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

describe('DonationValidator', () => {
  describe('createDonationValidator', () => {
    it('should pass validation with valid donation data', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
          prayer: 'May this help those in need',
          isAnonymous: false,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation without optional prayer', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
          isAnonymous: false,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid campaign ID', async () => {
      const req = {
        body: {
          campaignId: 'invalid-uuid',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid campaign ID format',
          }),
        ])
      );
    });

    it('should fail validation with short donor name', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'J',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Donor name must be between 2 and 255 characters',
          }),
        ])
      );
    });

    it('should fail validation with invalid email', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'invalid-email',
          donorPhone: '+1234567890',
          amount: 50000,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid email format',
          }),
        ])
      );
    });

    it('should fail validation with invalid phone number', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: 'invalid-phone',
          amount: 50000,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid phone number format',
          }),
        ])
      );
    });

    it('should fail validation with amount below minimum', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 5000,
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Minimum donation amount is Rp 10,000',
          }),
        ])
      );
    });

    it('should fail validation with prayer exceeding maximum length', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
          prayer: 'a'.repeat(1001),
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Prayer must not exceed 1000 characters',
          }),
        ])
      );
    });

    it('should fail validation with non-boolean isAnonymous', async () => {
      const req = {
        body: {
          campaignId: '123e4567-e89b-12d3-a456-426614174000',
          donorName: 'John Doe',
          donorEmail: 'john@example.com',
          donorPhone: '+1234567890',
          amount: 50000,
          isAnonymous: 'yes',
        },
      };

      const result = await runValidators(createDonationValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'isAnonymous must be a boolean',
          }),
        ])
      );
    });
  });

  describe('getDonationByIdValidator', () => {
    it('should pass validation with valid UUID', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
      };

      const result = await runValidators(getDonationByIdValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid UUID', async () => {
      const req = {
        params: {
          id: 'invalid-uuid',
        },
      };

      const result = await runValidators(getDonationByIdValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid donation ID format',
          }),
        ])
      );
    });

    it('should fail validation with empty ID', async () => {
      const req = {
        params: {
          id: '',
        },
      };

      const result = await runValidators(getDonationByIdValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Donation ID is required',
          }),
        ])
      );
    });
  });

  describe('getCampaignDonationsValidator', () => {
    it('should pass validation with valid campaign ID', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {},
      };

      const result = await runValidators(getCampaignDonationsValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation with valid limit', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {
          limit: '20',
        },
      };

      const result = await runValidators(getCampaignDonationsValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid campaign ID', async () => {
      const req = {
        params: {
          id: 'invalid-uuid',
        },
        query: {},
      };

      const result = await runValidators(getCampaignDonationsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid campaign ID format',
          }),
        ])
      );
    });

    it('should fail validation with limit exceeding maximum', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {
          limit: '150',
        },
      };

      const result = await runValidators(getCampaignDonationsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Limit must be between 1 and 100',
          }),
        ])
      );
    });

    it('should fail validation with negative limit', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {
          limit: '-5',
        },
      };

      const result = await runValidators(getCampaignDonationsValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Limit must be between 1 and 100',
          }),
        ])
      );
    });
  });

  describe('getCampaignPrayersValidator', () => {
    it('should pass validation with valid campaign ID', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {},
      };

      const result = await runValidators(getCampaignPrayersValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should pass validation with valid limit', async () => {
      const req = {
        params: {
          id: '123e4567-e89b-12d3-a456-426614174000',
        },
        query: {
          limit: '50',
        },
      };

      const result = await runValidators(getCampaignPrayersValidator, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid campaign ID', async () => {
      const req = {
        params: {
          id: 'invalid-uuid',
        },
        query: {},
      };

      const result = await runValidators(getCampaignPrayersValidator, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Invalid campaign ID format',
          }),
        ])
      );
    });
  });
});
