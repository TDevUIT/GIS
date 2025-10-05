import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendSupervisorCredentials(
    email: string,
    otp: string,
    opts?: { name?: string; expiresMinutes?: number },
  ) {
    const subject = 'EGis — Your Supervisor Account Credentials';
    const displayName = opts?.name || 'Supervisor';
    const expiresText = opts?.expiresMinutes
      ? `This OTP will expire in ${opts.expiresMinutes} minutes.`
      : 'This OTP will expire shortly.';

    const html = `
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#333;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
                <td align="center" style="padding:24px 16px;">
                    <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(16,24,40,0.05);">
                        <tr>
                            <td style="padding:24px 32px;border-bottom:1px solid #eef2f7;">
                                <div style="display:flex;align-items:center;gap:12px;">
                                    <div style="width:48px;height:48px;border-radius:8px;background:#0ea5a4;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:18px;">EG</div>
                                    <div>
                                        <h1 style="margin:0;font-size:18px;color:#0f172a;">Welcome to EGis</h1>
                                        <p style="margin:4px 0 0;color:#64748b;font-size:13px;">Account created by administrator</p>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:28px 32px;">
                                <p style="margin:0 0 12px;font-size:15px;color:#0f172a;">Hi ${displayName},</p>
                                <p style="margin:0 0 18px;color:#475569;line-height:1.5;font-size:14px;">An account has been created for you on the EGis system. Use the one-time password (OTP) below to sign in for the first time. You will be prompted to set a new password after signing in.</p>
                                <div style="margin:18px 0;padding:18px;background:#f8fafc;border-radius:8px;border:1px solid #e6eef6;text-align:center;">
                                    <div style="font-size:13px;color:#64748b;margin-bottom:8px;">Your one-time password</div>
                                    <div style="display:inline-block;padding:12px 18px;border-radius:6px;background:linear-gradient(180deg,#0ea5a4,#059669);color:#ffffff;font-weight:700;font-size:20px;letter-spacing:2px;">${otp}</div>
                                </div>
                                <p style="margin:12px 0 8px;color:#64748b;font-size:13px;">${expiresText}</p>
                                <p style="margin:0 0 20px;color:#64748b;font-size:13px;">If you did not request this account or believe this email is in error, please contact your system administrator or reply to this message.</p>
                                <div style="text-align:left;margin-top:8px;">
                                    <a href="#" style="display:inline-block;padding:10px 16px;border-radius:6px;background:#0ea5a4;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Go to EGis Dashboard</a>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:16px 32px;background:#fbfdff;border-top:1px solid #eef2f7;font-size:12px;color:#94a3b8;">
                                <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
                                    <div>EGis · Empowering Geographic Insights</div>
                                    <div>Need help? <a href="mailto:support@egis.example" style="color:#0ea5a4;text-decoration:none;">support@egis.example</a></div>
                                </div>
                            </td>
                        </tr>
                    </table>
                    <div style="max-width:600px;margin-top:12px;color:#94a3b8;font-size:12px;text-align:center;">If the button doesn't work, copy and paste the OTP into the EGis login screen.</div>
                </td>
            </tr>
        </table>
    </body>
</html>
        `;

    const text = `
Welcome to EGis!

An account has been created for you by an administrator.

Email: ${email}
One-time password (OTP): ${otp}
${opts?.expiresMinutes ? `This OTP will expire in ${opts.expiresMinutes} minutes.` : 'This OTP will expire shortly.'}

Please use this OTP to sign in for the first time. You will be required to set a new password upon first login.

If you did not request this account, contact your system administrator.
`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      html,
      text,
    });
  }
}
