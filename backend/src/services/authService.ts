import { v4 as uuidv4 } from "uuid";
import databaseService from "./databaseService";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyEmailToken,
  JWTPayload,
} from "../utils/jwt";
import { RowDataPacket } from "mysql2";

interface User extends RowDataPacket {
  id: string;
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
  role: "DONOR" | "CREATOR" | "ADMIN";
  is_email_verified: boolean;
  email_verify_token: string | null;
  reset_password_token: string | null;
  profile_photo_url: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  phone_number: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    full_name: string;
    phone_number: string;
    role: "DONOR" | "CREATOR" | "ADMIN";
    is_email_verified: boolean;
    profile_photo_url?: string | null;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register new user
   */
  async register(
    data: RegisterData,
  ): Promise<{ userId: string; verificationToken: string }> {
    const { email, password, full_name, phone_number } = data;

    // Check if email already exists
    const existingUsers = await databaseService.query<User>(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate verification token
    const verificationToken = generateEmailVerificationToken(email);

    // Create user
    const userId = uuidv4();
    await databaseService.execute(
      `INSERT INTO users (id, email, password, full_name, phone_number, role, is_email_verified, email_verify_token)
       VALUES (?, ?, ?, ?, ?, 'DONOR', FALSE, ?)`,
      [
        userId,
        email,
        hashedPassword,
        full_name,
        phone_number,
        verificationToken,
      ],
    );

    return { userId, verificationToken };
  }

  /**
   * Login user
   */
  async login(data: LoginData): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const users = await databaseService.query<User>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }

    const user = users[0];

    // Compare password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    // Check if email is verified
    if (!user.is_email_verified) {
      throw new Error("Email not verified");
    }

    // Generate tokens
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
        is_email_verified: user.is_email_verified,
        profile_photo_url: user.profile_photo_url,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(token: string): Promise<void> {
    // Verify token and get email
    const email = verifyEmailToken(token);

    // Find user by email and token
    const users = await databaseService.query<User>(
      "SELECT id FROM users WHERE email = ? AND email_verify_token = ?",
      [email, token],
    );

    if (users.length === 0) {
      throw new Error("Invalid verification token");
    }

    // Update user as verified
    await databaseService.execute(
      "UPDATE users SET is_email_verified = TRUE, email_verify_token = NULL WHERE id = ?",
      [users[0].id],
    );
  }

  /**
   * Request password reset
   */
  async forgotPassword(email: string): Promise<string> {
    // Find user by email
    const users = await databaseService.query<User>(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      throw new Error("User not found");
    }

    // Generate reset token
    const resetToken = generatePasswordResetToken(email);

    // Save reset token
    await databaseService.execute(
      "UPDATE users SET reset_password_token = ? WHERE id = ?",
      [resetToken, users[0].id],
    );

    return resetToken;
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Verify token and get email
    const email = verifyEmailToken(token);

    // Find user by email and token
    const users = await databaseService.query<User>(
      "SELECT id FROM users WHERE email = ? AND reset_password_token = ?",
      [email, token],
    );

    if (users.length === 0) {
      throw new Error("Invalid reset token");
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await databaseService.execute(
      "UPDATE users SET password = ?, reset_password_token = NULL WHERE id = ?",
      [hashedPassword, users[0].id],
    );
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<User | null> {
    const users = await databaseService.query<User>(
      "SELECT id, email, full_name, phone_number, role, is_email_verified, profile_photo_url FROM users WHERE id = ?",
      [userId],
    );

    return users.length > 0 ? users[0] : null;
  }

  /**
   * Get all users with pagination and filters (admin)
   */
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<{
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    let whereConditions: string[] = [];
    let queryParams: any[] = [];

    // Filter by role
    if (params.role) {
      whereConditions.push("role = ?");
      queryParams.push(params.role);
    }

    // Filter by status (email verified)
    if (params.status === "active") {
      whereConditions.push("is_email_verified = TRUE");
    } else if (params.status === "inactive") {
      whereConditions.push("is_email_verified = FALSE");
    }

    // Search by email or full name
    if (params.search) {
      whereConditions.push("(email LIKE ? OR full_name LIKE ?)");
      queryParams.push(`%${params.search}%`, `%${params.search}%`);
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    interface CountResult extends RowDataPacket {
      total: number;
    }
    const countResult = await databaseService.query<CountResult>(
      countQuery,
      queryParams,
    );
    const total = countResult[0].total;

    // Get users with pagination
    const usersQuery = `
      SELECT id, email, full_name, phone_number, role, is_email_verified, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const users = await databaseService.query<User>(usersQuery, [
      ...queryParams,
      limit,
      offset,
    ]);

    // Map to frontend schema
    const mappedUsers = users.map((user) => ({
      id: user.id,
      account_no: user.email.split("@")[0], // Generate account_no from email
      email: user.email,
      full_name: user.full_name,
      phone_number: user.phone_number,
      role: [user.role], // Convert to array
      is_verified: user.is_email_verified,
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return {
      users: mappedUsers as any,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update user profile photo
   */
  async updateProfilePhoto(userId: string, photoUrl: string): Promise<boolean> {
    const result = await databaseService.execute(
      "UPDATE users SET profile_photo_url = ? WHERE id = ?",
      [photoUrl, userId],
    );
    return result.affectedRows > 0;
  }
}

export default new AuthService();
