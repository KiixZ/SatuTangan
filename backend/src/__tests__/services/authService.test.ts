import authService from '../../services/authService';
import databaseService from '../../services/databaseService';
import * as bcrypt from '../../utils/bcrypt';
import * as jwt from '../../utils/jwt';

// Mock dependencies
jest.mock('../../services/databaseService');
jest.mock('../../utils/bcrypt');
jest.mock('../../utils/jwt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockRegisterData = {
        email: 'test@example.com',
        password: 'Password123',
        full_name: 'Test User',
        phone_number: '+1234567890',
      };

      (databaseService.query as jest.Mock).mockResolvedValue([]);
      (bcrypt.hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.generateEmailVerificationToken as jest.Mock).mockReturnValue('verificationToken');
      (databaseService.execute as jest.Mock).mockResolvedValue({ insertId: 1 });

      const result = await authService.register(mockRegisterData);

      expect(result).toHaveProperty('userId');
      expect(result).toHaveProperty('verificationToken');
      expect(result.verificationToken).toBe('verificationToken');
      expect(databaseService.query).toHaveBeenCalledWith(
        'SELECT id FROM users WHERE email = ?',
        [mockRegisterData.email]
      );
      expect(bcrypt.hashPassword).toHaveBeenCalledWith(mockRegisterData.password);
      expect(databaseService.execute).toHaveBeenCalled();
    });

    it('should throw error if email already exists', async () => {
      const mockRegisterData = {
        email: 'existing@example.com',
        password: 'Password123',
        full_name: 'Test User',
        phone_number: '+1234567890',
      };

      (databaseService.query as jest.Mock).mockResolvedValue([{ id: 'existing-id' }]);

      await expect(authService.register(mockRegisterData)).rejects.toThrow('Email already exists');
      expect(bcrypt.hashPassword).not.toHaveBeenCalled();
      expect(databaseService.execute).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockLoginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        phone_number: '+1234567890',
        role: 'DONOR',
        is_email_verified: true,
      };

      (databaseService.query as jest.Mock).mockResolvedValue([mockUser]);
      (bcrypt.comparePassword as jest.Mock).mockResolvedValue(true);
      (jwt.generateAccessToken as jest.Mock).mockReturnValue('accessToken');
      (jwt.generateRefreshToken as jest.Mock).mockReturnValue('refreshToken');

      const result = await authService.login(mockLoginData);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user.email).toBe(mockUser.email);
      expect(result.accessToken).toBe('accessToken');
      expect(result.refreshToken).toBe('refreshToken');
    });

    it('should throw error for invalid email', async () => {
      const mockLoginData = {
        email: 'nonexistent@example.com',
        password: 'Password123',
      };

      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await expect(authService.login(mockLoginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error for invalid password', async () => {
      const mockLoginData = {
        email: 'test@example.com',
        password: 'WrongPassword',
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        phone_number: '+1234567890',
        role: 'DONOR',
        is_email_verified: true,
      };

      (databaseService.query as jest.Mock).mockResolvedValue([mockUser]);
      (bcrypt.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockLoginData)).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if email not verified', async () => {
      const mockLoginData = {
        email: 'test@example.com',
        password: 'Password123',
      };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedPassword',
        full_name: 'Test User',
        phone_number: '+1234567890',
        role: 'DONOR',
        is_email_verified: false,
      };

      (databaseService.query as jest.Mock).mockResolvedValue([mockUser]);
      (bcrypt.comparePassword as jest.Mock).mockResolvedValue(true);

      await expect(authService.login(mockLoginData)).rejects.toThrow('Email not verified');
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email with valid token', async () => {
      const mockToken = 'validToken';
      const mockEmail = 'test@example.com';

      (jwt.verifyEmailToken as jest.Mock).mockReturnValue(mockEmail);
      (databaseService.query as jest.Mock).mockResolvedValue([{ id: 'user-id' }]);
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      await authService.verifyEmail(mockToken);

      expect(jwt.verifyEmailToken).toHaveBeenCalledWith(mockToken);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE users SET is_email_verified = TRUE, email_verify_token = NULL WHERE id = ?',
        ['user-id']
      );
    });

    it('should throw error for invalid token', async () => {
      const mockToken = 'invalidToken';
      const mockEmail = 'test@example.com';

      (jwt.verifyEmailToken as jest.Mock).mockReturnValue(mockEmail);
      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await expect(authService.verifyEmail(mockToken)).rejects.toThrow('Invalid verification token');
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token for existing user', async () => {
      const mockEmail = 'test@example.com';

      (databaseService.query as jest.Mock).mockResolvedValue([{ id: 'user-id' }]);
      (jwt.generatePasswordResetToken as jest.Mock).mockReturnValue('resetToken');
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      const result = await authService.forgotPassword(mockEmail);

      expect(result).toBe('resetToken');
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE users SET reset_password_token = ? WHERE id = ?',
        ['resetToken', 'user-id']
      );
    });

    it('should throw error for non-existent user', async () => {
      const mockEmail = 'nonexistent@example.com';

      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await expect(authService.forgotPassword(mockEmail)).rejects.toThrow('User not found');
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token', async () => {
      const mockToken = 'validResetToken';
      const mockEmail = 'test@example.com';
      const mockNewPassword = 'NewPassword123';

      (jwt.verifyEmailToken as jest.Mock).mockReturnValue(mockEmail);
      (databaseService.query as jest.Mock).mockResolvedValue([{ id: 'user-id' }]);
      (bcrypt.hashPassword as jest.Mock).mockResolvedValue('newHashedPassword');
      (databaseService.execute as jest.Mock).mockResolvedValue({ affectedRows: 1 });

      await authService.resetPassword(mockToken, mockNewPassword);

      expect(bcrypt.hashPassword).toHaveBeenCalledWith(mockNewPassword);
      expect(databaseService.execute).toHaveBeenCalledWith(
        'UPDATE users SET password = ?, reset_password_token = NULL WHERE id = ?',
        ['newHashedPassword', 'user-id']
      );
    });

    it('should throw error for invalid reset token', async () => {
      const mockToken = 'invalidToken';
      const mockEmail = 'test@example.com';
      const mockNewPassword = 'NewPassword123';

      (jwt.verifyEmailToken as jest.Mock).mockReturnValue(mockEmail);
      (databaseService.query as jest.Mock).mockResolvedValue([]);

      await expect(authService.resetPassword(mockToken, mockNewPassword)).rejects.toThrow('Invalid reset token');
    });
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      const mockUserId = 'user-id';
      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        full_name: 'Test User',
        phone_number: '+1234567890',
        role: 'DONOR',
        is_email_verified: true,
      };

      (databaseService.query as jest.Mock).mockResolvedValue([mockUser]);

      const result = await authService.getUserById(mockUserId);

      expect(result).toEqual(mockUser);
      expect(databaseService.query).toHaveBeenCalledWith(
        'SELECT id, email, full_name, phone_number, role, is_email_verified FROM users WHERE id = ?',
        [mockUserId]
      );
    });

    it('should return null when user not found', async () => {
      const mockUserId = 'nonexistent-id';

      (databaseService.query as jest.Mock).mockResolvedValue([]);

      const result = await authService.getUserById(mockUserId);

      expect(result).toBeNull();
    });
  });
});
