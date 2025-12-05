import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, name: string): Promise<boolean> {
  try {
    const mailOptions = {
      from: `"ReBook Sri Lanka" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Email Verification - ReBook Sri Lanka',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
              color: #333333;
            }
            .greeting {
              font-size: 18px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #4b5563;
              margin-bottom: 30px;
            }
            .otp-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 16px;
              padding: 40px 30px;
              text-align: center;
              margin: 35px 0;
            }
            .otp-label {
              font-size: 13px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1.5px;
              margin-bottom: 16px;
              font-weight: 500;
            }
            .otp-code {
              font-size: 48px;
              font-weight: 600;
              color: #1e293b;
              letter-spacing: 12px;
              font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
              margin: 20px 0;
              padding: 20px;
              background: white;
              border-radius: 12px;
              display: inline-block;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
            }
            .validity {
              font-size: 13px;
              color: #64748b;
              margin-top: 16px;
              font-weight: 400;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .warning-text {
              font-size: 14px;
              color: #92400e;
              margin: 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              font-size: 13px;
              color: #6b7280;
              margin: 5px 0;
            }
            .link {
              color: #2563eb;
              text-decoration: none;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 0;
                border-radius: 8px;
              }
              .header {
                padding: 30px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .content {
                padding: 30px 20px;
              }
              .otp-box {
                padding: 30px 20px;
                margin: 25px 0;
              }
              .otp-code {
                font-size: 36px;
                letter-spacing: 8px;
                padding: 16px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📚 ReBook Sri Lanka</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${name},</p>
              <p class="message">
                Thank you for registering with ReBook Sri Lanka! To complete your registration and verify your email address, please use the One-Time Password (OTP) below:
              </p>
              
              <div class="otp-box">
                <div class="otp-label">Your Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="validity">Valid for 10 minutes</div>
              </div>
              
              <p class="message">
                Enter this code on the verification page to activate your donor account and start making a difference in students' lives.
              </p>
              
              <div class="warning">
                <p class="warning-text">
                  <strong>⚠️ Security Notice:</strong> If you didn't request this verification code, please ignore this email. Do not share this OTP with anyone.
                </p>
              </div>
              
              <p class="message">
                Once verified, your account will be reviewed by our admin team for final approval.
              </p>
            </div>
            <div class="footer">
              <p class="footer-text">ReBook Sri Lanka - Empowering Education</p>
              <p class="footer-text">Helping flood-affected students across Sri Lanka</p>
              <p class="footer-text">
                Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}" class="link">${process.env.EMAIL_USER}</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name},

        Thank you for registering with ReBook Sri Lanka!

        Your Email Verification Code: ${otp}

        This code is valid for 10 minutes.

        Enter this code on the verification page to complete your registration.

        If you didn't request this code, please ignore this email.

        Best regards,
        ReBook Sri Lanka Team
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
}

// Generate secure reset token
export function generateResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Send password reset email
export async function sendPasswordResetEmail(email: string, resetToken: string, name: string): Promise<boolean> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const resetUrl = `${baseUrl}/donor/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"ReBook Sri Lanka" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - ReBook Sri Lanka',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
              padding: 40px 30px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
            .content {
              padding: 40px 30px;
              color: #333333;
            }
            .greeting {
              font-size: 18px;
              color: #1f2937;
              margin-bottom: 20px;
            }
            .message {
              font-size: 16px;
              line-height: 1.6;
              color: #4b5563;
              margin-bottom: 30px;
            }
            .button-container {
              text-align: center;
              margin: 35px 0;
            }
            .reset-button {
              display: inline-block;
              background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
              color: white;
              padding: 16px 40px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
              transition: transform 0.2s;
            }
            .reset-button:hover {
              transform: translateY(-2px);
            }
            .link-box {
              background: #f8fafc;
              border: 1px solid #e2e8f0;
              border-radius: 8px;
              padding: 20px;
              margin: 25px 0;
              word-break: break-all;
            }
            .link-label {
              font-size: 12px;
              color: #64748b;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 10px;
              font-weight: 500;
            }
            .link-text {
              font-size: 13px;
              color: #475569;
              font-family: monospace;
            }
            .warning {
              background-color: #fef3c7;
              border-left: 4px solid #f59e0b;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .warning-text {
              font-size: 14px;
              color: #92400e;
              margin: 0;
            }
            .expiry-notice {
              background-color: #fee2e2;
              border-left: 4px solid #dc2626;
              padding: 15px;
              margin: 25px 0;
              border-radius: 4px;
            }
            .expiry-text {
              font-size: 14px;
              color: #7f1d1d;
              margin: 0;
            }
            .footer {
              background-color: #f9fafb;
              padding: 25px 30px;
              text-align: center;
              border-top: 1px solid #e5e7eb;
            }
            .footer-text {
              font-size: 13px;
              color: #6b7280;
              margin: 5px 0;
            }
            .link {
              color: #dc2626;
              text-decoration: none;
            }
            @media only screen and (max-width: 600px) {
              .container {
                margin: 0;
                border-radius: 0;
              }
              .header {
                padding: 30px 20px;
              }
              .header h1 {
                font-size: 24px;
              }
              .content {
                padding: 30px 20px;
              }
              .reset-button {
                padding: 14px 32px;
                font-size: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="icon">🔐</div>
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <p class="greeting">Hello ${name},</p>
              <p class="message">
                We received a request to reset the password for your ReBook Sri Lanka donor account. If you made this request, click the button below to reset your password:
              </p>
              
              <div class="button-container">
                <a href="${resetUrl}" class="reset-button">Reset Your Password</a>
              </div>
              
              <p class="message">
                Or copy and paste this link into your browser:
              </p>
              
              <div class="link-box">
                <div class="link-label">Reset Link</div>
                <div class="link-text">${resetUrl}</div>
              </div>
              
              <div class="expiry-notice">
                <p class="expiry-text">
                  <strong>⏰ Time Sensitive:</strong> This password reset link will expire in 1 hour for security reasons.
                </p>
              </div>
              
              <div class="warning">
                <p class="warning-text">
                  <strong>⚠️ Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged. Someone may have entered your email address by mistake.
                </p>
              </div>
              
              <p class="message">
                For security, this link can only be used once and will expire after 1 hour.
              </p>
            </div>
            <div class="footer">
              <p class="footer-text">ReBook Sri Lanka - Empowering Education</p>
              <p class="footer-text">Helping flood-affected students across Sri Lanka</p>
              <p class="footer-text">
                Need help? Contact us at <a href="mailto:${process.env.EMAIL_USER}" class="link">${process.env.EMAIL_USER}</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Hello ${name},

        We received a request to reset your password for ReBook Sri Lanka.

        To reset your password, visit this link:
        ${resetUrl}

        This link will expire in 1 hour.

        If you didn't request this, please ignore this email.

        Best regards,
        ReBook Sri Lanka Team
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
}
