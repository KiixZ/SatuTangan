import nodemailer, { Transporter } from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Check if email configuration is valid
const isEmailConfigured = (): boolean => {
  return !!(
    SMTP_USER &&
    SMTP_PASS &&
    SMTP_USER !== "your-email@gmail.com" &&
    SMTP_PASS !== "your-email-password"
  );
};

export class EmailService {
  private transporter: Transporter | null = null;

  constructor() {
    if (isEmailConfigured()) {
      try {
        this.transporter = nodemailer.createTransport({
          host: SMTP_HOST,
          port: SMTP_PORT,
          secure: SMTP_PORT === 465, // true for 465, false for other ports
          auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
          },
        });
      } catch (error) {
        console.error("Failed to initialize email transporter:", error);
        this.transporter = null;
      }
    } else {
      console.warn(
        "Email service is not configured. Please check your environment variables.",
      );
    }
  }

  /**
   * Send verification email
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    if (!this.transporter) {
      console.warn(
        "Email service not configured, skipping verification email to:",
        email,
      );
      return; // Don't throw error, just skip sending
    }

    const verificationUrl = `${FRONTEND_URL}/verify-email/${token}`;

    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: this.getVerificationEmailTemplate(verificationUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error("Error sending verification email:", error);
      // Don't throw error, just log it to prevent blocking the flow
      console.warn(
        "Email service failed, but continuing with registration process",
      );
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    if (!this.transporter) {
      console.warn(
        "Email service not configured, skipping password reset email to:",
        email,
      );
      return; // Don't throw error, just skip sending
    }

    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: this.getPasswordResetEmailTemplate(resetUrl),
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      // Don't throw error, just log it to prevent blocking the flow
      console.warn(
        "Email service failed, but continuing with password reset process",
      );
    }
  }

  /**
   * Send verification approved email
   */
  async sendVerificationApprovedEmail(
    email: string,
    fullName: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Creator Verification Approved",
      html: this.getVerificationApprovedEmailTemplate(fullName),
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        console.log(`Verification approved email sent to ${email}`);
      }
    } catch (error) {
      console.error("Error sending verification approved email:", error);
      throw new Error("Failed to send verification approved email");
    }
  }

  /**
   * Send verification rejected email
   */
  async sendVerificationRejectedEmail(
    email: string,
    fullName: string,
    reason: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Creator Verification Update",
      html: this.getVerificationRejectedEmailTemplate(fullName, reason),
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        console.log(`Verification rejected email sent to ${email}`);
      }
    } catch (error) {
      console.error("Error sending verification rejected email:", error);
      throw new Error("Failed to send verification rejected email");
    }
  }

  /**
   * Email template for verification
   */
  private getVerificationEmailTemplate(verificationUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for registering with Donation Campaign!</p>
            <p>Please click the button below to verify your email address and activate your account:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
            <p><strong>Note:</strong> This link will expire in 24 hours.</p>
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for password reset
   */
  private getPasswordResetEmailTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
          .warning {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 10px;
            margin: 15px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password for your Donation Campaign account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetUrl}</p>
            <div class="warning">
              <p style="margin: 0;"><strong>Important:</strong> This link will expire in 1 hour for security reasons.</p>
            </div>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for verification approved
   */
  private getVerificationApprovedEmailTemplate(fullName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Approved</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .success-box {
            background-color: #d1fae5;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Congratulations, ${fullName}!</h2>
            <div class="success-box">
              <p style="margin: 0;"><strong>Your creator verification has been approved!</strong></p>
            </div>
            <p>You can now create and manage your own donation campaigns on our platform.</p>
            <p>As a verified creator, you can:</p>
            <ul>
              <li>Create unlimited donation campaigns</li>
              <li>Upload photos and updates for your campaigns</li>
              <li>Track donations and donor information</li>
              <li>Receive funds directly to your registered bank account</li>
            </ul>
            <div style="text-align: center;">
              <a href="${FRONTEND_URL}/creator/dashboard" class="button">Go to Creator Dashboard</a>
            </div>
            <p>Thank you for joining our community of creators!</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for verification rejected
   */
  private getVerificationRejectedEmailTemplate(
    fullName: string,
    reason: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verification Update</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Creator Verification Update</h2>
            <p>Dear ${fullName},</p>
            <p>Thank you for submitting your creator verification request.</p>
            <div class="warning-box">
              <p style="margin: 0 0 10px 0;"><strong>Unfortunately, we were unable to approve your verification at this time.</strong></p>
              <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
            <p>You can resubmit your verification with the correct information. Please ensure that:</p>
            <ul>
              <li>All documents are clear and readable</li>
              <li>Your KTP information matches your registration details</li>
              <li>Your bank account information is accurate</li>
              <li>You have agreed to our terms and conditions</li>
            </ul>
            <div style="text-align: center;">
              <a href="${FRONTEND_URL}/profile" class="button">Resubmit Verification</a>
            </div>
            <p>If you have any questions, please contact our support team.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Send warning email to creator
   */
  async sendWarningEmail(
    email: string,
    fullName: string,
    campaignTitle: string,
    reason: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Warning: Campaign Report Review",
      html: this.getWarningEmailTemplate(fullName, campaignTitle, reason),
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        console.log(`Warning email sent to ${email}`);
      }
    } catch (error) {
      console.error("Error sending warning email:", error);
      throw new Error("Failed to send warning email");
    }
  }

  /**
   * Send suspension email to creator
   */
  async sendSuspensionEmail(
    email: string,
    fullName: string,
    campaignTitle: string,
    reason: string,
  ): Promise<void> {
    const mailOptions = {
      from: `"Donation Campaign" <${SMTP_USER}>`,
      to: email,
      subject: "Campaign Suspended",
      html: this.getSuspensionEmailTemplate(fullName, campaignTitle, reason),
    };

    try {
      if (this.transporter) {
        await this.transporter.sendMail(mailOptions);
        console.log(`Suspension email sent to ${email}`);
      }
    } catch (error) {
      console.error("Error sending suspension email:", error);
      throw new Error("Failed to send suspension email");
    }
  }

  /**
   * Email template for warning
   */
  private getWarningEmailTemplate(
    fullName: string,
    campaignTitle: string,
    reason: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campaign Warning</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .warning-box {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Campaign Warning Notice</h2>
            <p>Dear ${fullName},</p>
            <p>Your campaign "<strong>${campaignTitle}</strong>" has been reported and reviewed by our team.</p>
            <div class="warning-box">
              <p style="margin: 0 0 10px 0;"><strong>Warning Issued</strong></p>
              <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
            <p>Please review our community guidelines and terms of service to ensure your campaign complies with our policies.</p>
            <p><strong>Important:</strong> Multiple warnings may result in campaign suspension or account termination.</p>
            <p>If you believe this warning was issued in error, please contact our support team.</p>
            <div style="text-align: center;">
              <a href="${FRONTEND_URL}/creator/dashboard" class="button">View Campaign</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Email template for suspension
   */
  private getSuspensionEmailTemplate(
    fullName: string,
    campaignTitle: string,
    reason: string,
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Campaign Suspended</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #f9f9f9;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
          }
          .content {
            background-color: white;
            padding: 20px;
            border-radius: 5px;
          }
          .danger-box {
            background-color: #fee2e2;
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 20px 0;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Donation Campaign</h1>
          </div>
          <div class="content">
            <h2>Campaign Suspended</h2>
            <p>Dear ${fullName},</p>
            <p>Your campaign "<strong>${campaignTitle}</strong>" has been suspended due to policy violations.</p>
            <div class="danger-box">
              <p style="margin: 0 0 10px 0;"><strong>Campaign Suspended</strong></p>
              <p style="margin: 0;"><strong>Reason:</strong> ${reason}</p>
            </div>
            <p>Your campaign is no longer visible to the public and cannot receive donations.</p>
            <p><strong>What this means:</strong></p>
            <ul>
              <li>Your campaign has been removed from public listings</li>
              <li>No new donations can be made</li>
              <li>Existing donations are not affected</li>
              <li>You can still access your campaign dashboard</li>
            </ul>
            <p>If you believe this suspension was issued in error or would like to appeal, please contact our support team immediately.</p>
            <div style="text-align: center;">
              <a href="${FRONTEND_URL}/support" class="button">Contact Support</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 Donation Campaign. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Verify email configuration
   */
  async verifyConnection(): Promise<boolean> {
    try {
      if (this.transporter) {
        await this.transporter.verify();
        console.log("Email service is ready");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Email service verification failed:", error);
      return false;
    }
  }
}

export default new EmailService();
