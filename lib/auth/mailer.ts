import { Resend } from 'resend';
import { getAppUrl } from '../utils';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = 'Brand Estate <onboarding@resend.dev>';
const APP_URL = getAppUrl();

/**
 * Sends an email verification link to the newly registered user.
 */
export async function sendVerificationEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  // Links to the UI verify page, not the raw API route
  const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Verify your Brand Estate account',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #080D16 0%, #0a1628 100%); padding: 40px 48px 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Brand Estate</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Premium Real Estate Platform</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 48px;">
          <h2 style="color: #080D16; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Welcome, ${name}! 🏡</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for creating your Brand Estate account. To complete your registration and start exploring premium properties, please verify your email address.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background: #0067D2; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 9999px; letter-spacing: 0.2px;">
              Verify My Email Address
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #0067D2; font-size: 13px; word-break: break-all; margin: 0 0 24px;">
            ${verifyUrl}
          </p>

          <p style="color: #9ca3af; font-size: 13px; margin: 0;">
            This link expires in <strong>24 hours</strong>. If you did not create a Brand Estate account, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 48px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            &copy; ${new Date().getFullYear()} Brand Estate. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}

/**
 * Sends a password reset link to the user's email address.
 */
export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string
): Promise<void> {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const { error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: 'Reset your Brand Estate password',
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #080D16 0%, #0a1628 100%); padding: 40px 48px 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">Brand Estate</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Premium Real Estate Platform</p>
        </div>

        <!-- Body -->
        <div style="padding: 40px 48px;">
          <h2 style="color: #080D16; font-size: 20px; font-weight: 600; margin: 0 0 12px;">Password Reset Request</h2>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
            Hi ${name}, we received a request to reset the password for your Brand Estate account. Click the button below to choose a new password.
          </p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #0067D2; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 9999px; letter-spacing: 0.2px;">
              Reset My Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 13px; line-height: 1.6; margin: 0 0 8px;">
            Or copy and paste this link into your browser:
          </p>
          <p style="color: #0067D2; font-size: 13px; word-break: break-all; margin: 0 0 24px;">
            ${resetUrl}
          </p>

          <p style="color: #9ca3af; font-size: 13px; margin: 0;">
            This link expires in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email — your password will remain unchanged.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 48px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            &copy; ${new Date().getFullYear()} Brand Estate. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
}
