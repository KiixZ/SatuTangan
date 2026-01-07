import { validationResult } from 'express-validator';
import {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../../validators/authValidator';
import { Request, Response } from 'express';

// Helper function to run validators
const runValidators = async (validators: any[], req: Partial<Request>) => {
  const mockReq = req as Request;
  const mockRes = {} as Response;
  const mockNext = jest.fn();

  for (const validator of validators) {
    await validator.run(mockReq);
  }

  return validationResult(mockReq);
};

describe('AuthValidator', () => {
  describe('registerValidation', () => {
    it('should pass validation with valid registration data', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          full_name: 'John Doe',
          phone_number: '+1234567890',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid email', async () => {
      const req = {
        body: {
          email: 'invalid-email',
          password: 'Password123',
          full_name: 'John Doe',
          phone_number: '+1234567890',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please provide a valid email address',
          }),
        ])
      );
    });

    it('should fail validation with weak password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'weak',
          full_name: 'John Doe',
          phone_number: '+1234567890',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg.includes('at least 8 characters'))).toBe(true);
    });

    it('should fail validation without uppercase, lowercase, and number in password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password',
          full_name: 'John Doe',
          phone_number: '+1234567890',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(
        errors.some((e) => e.msg.includes('uppercase letter, one lowercase letter, and one number'))
      ).toBe(true);
    });

    it('should fail validation with empty full name', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          full_name: '',
          phone_number: '+1234567890',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Full name is required',
          }),
        ])
      );
    });

    it('should fail validation with invalid phone number', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          full_name: 'John Doe',
          phone_number: 'invalid-phone',
          captcha: 'valid-captcha',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please provide a valid phone number',
          }),
        ])
      );
    });

    it('should fail validation without captcha', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
          full_name: 'John Doe',
          phone_number: '+1234567890',
        },
      };

      const result = await runValidators(registerValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Captcha verification is required',
          }),
        ])
      );
    });
  });

  describe('loginValidation', () => {
    it('should pass validation with valid login data', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'Password123',
        },
      };

      const result = await runValidators(loginValidation, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid email', async () => {
      const req = {
        body: {
          email: 'invalid-email',
          password: 'Password123',
        },
      };

      const result = await runValidators(loginValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please provide a valid email address',
          }),
        ])
      );
    });

    it('should fail validation with empty password', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: '',
        },
      };

      const result = await runValidators(loginValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Password is required',
          }),
        ])
      );
    });
  });

  describe('forgotPasswordValidation', () => {
    it('should pass validation with valid email', async () => {
      const req = {
        body: {
          email: 'test@example.com',
        },
      };

      const result = await runValidators(forgotPasswordValidation, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with invalid email', async () => {
      const req = {
        body: {
          email: 'invalid-email',
        },
      };

      const result = await runValidators(forgotPasswordValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Please provide a valid email address',
          }),
        ])
      );
    });
  });

  describe('resetPasswordValidation', () => {
    it('should pass validation with valid passwords', async () => {
      const req = {
        body: {
          password: 'NewPassword123',
          confirmPassword: 'NewPassword123',
        },
      };

      const result = await runValidators(resetPasswordValidation, req);

      expect(result.isEmpty()).toBe(true);
    });

    it('should fail validation with weak password', async () => {
      const req = {
        body: {
          password: 'weak',
          confirmPassword: 'weak',
        },
      };

      const result = await runValidators(resetPasswordValidation, req);

      expect(result.isEmpty()).toBe(false);
      const errors = result.array();
      expect(errors.some((e) => e.msg.includes('at least 8 characters'))).toBe(true);
    });

    it('should fail validation when passwords do not match', async () => {
      const req = {
        body: {
          password: 'Password123',
          confirmPassword: 'DifferentPassword123',
        },
      };

      const result = await runValidators(resetPasswordValidation, req);

      expect(result.isEmpty()).toBe(false);
      expect(result.array()).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            msg: 'Passwords do not match',
          }),
        ])
      );
    });
  });
});
