import { query } from "./db.js";

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    await query(
      "INSERT INTO email_queue (to_email, subject, body, status) VALUES ($1, $2, $3, 'sent')",
      [to, subject, body]
    );
  } catch (err) {
    console.error("Failed to queue email:", err);
  }
}

export function welcomeEmail(name: string, role: string): string {
  return `Dear ${name},

Welcome to Project Zenith — the capital infrastructure platform built for the next generation of founders, investors, and service providers worldwide.

Your account has been submitted as a ${role} and is currently pending admin review. You will receive another email once your profile is approved.

In the meantime, feel free to log in and complete your profile to speed up the approval process.

The Project Zenith Team
https://projectzenith.io`;
}

export function approvalEmail(name: string): string {
  return `Dear ${name},

Great news — your Project Zenith profile has been reviewed and approved! You now have full access to the platform.

Log in at https://projectzenith.io to complete your profile and start connecting.

The Project Zenith Team`;
}

export function rejectionEmail(name: string, reason?: string): string {
  return `Dear ${name},

After reviewing your Project Zenith application, we were unable to approve your profile at this time.${reason ? `\n\nReason: ${reason}` : ""}

If you believe this is an error or would like to reapply, please contact support@projectzenith.io.

The Project Zenith Team`;
}

export function passwordResetEmail(name: string, token: string, baseUrl: string): string {
  return `Dear ${name},

We received a request to reset your Project Zenith password. Click the link below to set a new password:

${baseUrl}/reset-password?token=${token}

This link expires in 1 hour. If you did not request a password reset, please ignore this email.

The Project Zenith Team`;
}

export function profileChangeApprovedEmail(name: string, field: string): string {
  return `Dear ${name},

Your profile update for "${field}" has been reviewed and approved by our team. The change is now live on your Project Zenith profile.

The Project Zenith Team`;
}

export function profileChangeRejectedEmail(name: string, field: string): string {
  return `Dear ${name},

Your proposed change to "${field}" on your Project Zenith profile was reviewed but could not be approved at this time. Please contact support@projectzenith.io if you have questions.

The Project Zenith Team`;
}
