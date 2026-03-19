import { Router } from 'express';
import { Resend } from 'resend';
import { RESEND, CONTENT, TG, sendTelegram, sendToSheet } from './config.js';

const router = Router();

interface PdfLeadBody {
  name?: string;
  email?: string;
  utm?: Record<string, string>;
  referrer?: string | null;
  page?: string;
}

function buildEmailHtml(name: string): string {
  const firstName = name.split(' ')[0] || name;
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">

        <!-- Header -->
        <tr><td style="padding:32px 40px;background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:24px 24px 0 0;border:1px solid rgba(255,255,255,0.05);border-bottom:none">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-1px;text-transform:uppercase">
                Сайт<span style="color:#f97316">ЧИСТ</span>
              </td>
              <td align="right" style="font-size:12px;color:#64748b;letter-spacing:2px;text-transform:uppercase">
                sitechist.ru
              </td>
            </tr>
          </table>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;background:#1e293b;border:1px solid rgba(255,255,255,0.05);border-top:none;border-bottom:none">

          <p style="color:#e2e8f0;font-size:18px;margin:0 0 8px;font-weight:700">
            ${firstName}, здравствуйте!
          </p>
          <p style="color:#94a3b8;font-size:15px;line-height:1.7;margin:0 0 32px">
            Спасибо за интерес к нашим услугам. Ваша презентация готова — нажмите кнопку ниже, чтобы скачать.
          </p>

          <!-- PDF Button -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="padding:0 0 32px">
              <a href="${CONTENT.pdfUrl}" target="_blank" style="display:inline-block;padding:18px 48px;background:#f97316;color:#fff;font-size:14px;font-weight:900;text-decoration:none;border-radius:14px;letter-spacing:2px;text-transform:uppercase;box-shadow:0 8px 32px rgba(249,115,22,0.3)">
                СКАЧАТЬ ПРЕЗЕНТАЦИЮ
              </a>
            </td></tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="height:1px;background:linear-gradient(90deg,transparent,rgba(249,115,22,0.3),transparent)"></td></tr>
          </table>

          <!-- Bot CTA -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px">
            <tr><td style="background:rgba(14,165,233,0.08);border:1px solid rgba(14,165,233,0.15);border-radius:16px;padding:28px 32px">
              <p style="color:#38bdf8;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px">
                Бесплатный бонус
              </p>
              <p style="color:#cbd5e1;font-size:15px;line-height:1.7;margin:0 0 20px">
                Пройдите <strong style="color:#38bdf8">экспресс-аудит</strong> вашего сайта в нашем Telegram-боте. За 2 минуты вы узнаете основные уязвимости и юридические риски.
              </p>
              <a href="${CONTENT.botDeeplink}" target="_blank" style="display:inline-block;padding:14px 32px;background:#0ea5e9;color:#fff;font-size:13px;font-weight:800;text-decoration:none;border-radius:12px;letter-spacing:1.5px;text-transform:uppercase;box-shadow:0 4px 20px rgba(14,165,233,0.25)">
                ПРОЙТИ АУДИТ В TELEGRAM
              </a>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 40px;background:#0f172a;border-radius:0 0 24px 24px;border:1px solid rgba(255,255,255,0.05);border-top:none">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="color:#475569;font-size:12px;line-height:1.8">
                <strong style="color:#94a3b8">Денис Солдатов</strong><br>
                +7 925 148 5560<br>
                <a href="https://sitechist.ru" style="color:#f97316;text-decoration:none">sitechist.ru</a>
              </td>
              <td align="right" valign="top" style="color:#334155;font-size:11px;line-height:1.8">
                Это письмо отправлено<br>
                потому что вы запросили<br>
                презентацию на сайте
              </td>
            </tr>
          </table>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendEmail(to: string, name: string): Promise<{ sent: boolean; emailId?: string }> {
  if (!RESEND.apiKey) return { sent: false };

  try {
    const resend = new Resend(RESEND.apiKey);
    const { data, error } = await resend.emails.send({
      from: RESEND.from,
      to: [to],
      subject: `${name}, ваша презентация СайтЧИСТ готова`,
      html: buildEmailHtml(name),
    });

    if (error) {
      console.error('Resend error:', error);
      return { sent: false };
    }

    return { sent: true, emailId: data?.id };
  } catch (err) {
    console.error('Email send error:', err);
    return { sent: false };
  }
}

async function notifyTelegram(body: PdfLeadBody, emailId?: string) {
  if (!TG.botToken || !TG.chatId) return;

  const utm = body.utm || {};
  const utmLines = Object.entries(utm).map(([k, v]) => `  • ${k}: \`${v}\``);

  const lines = [
    `📩 *PDF-ПРЕЗЕНТАЦИЯ*`,
    '',
    `👤 *Имя:* ${body.name}`,
    `📧 *Email:* ${body.email}`,
    '',
    `🔗 *Deep link:* ${CONTENT.botDeeplink}`,
  ];

  if (emailId) lines.push(`📬 *Email ID:* \`${emailId}\``);

  if (utmLines.length > 0) {
    lines.push('', '📊 *UTM:*', ...utmLines);
  }
  if (body.referrer) lines.push(`↩️ *Referrer:* ${body.referrer}`);
  if (body.page) lines.push(`📄 *Страница:* ${body.page}`);

  await sendTelegram(lines.join('\n'));
}

// ===== SEND PDF ENDPOINT =====
router.post('/api/send-pdf', async (req, res) => {
  const body: PdfLeadBody = req.body;

  if (!body.name || !body.email) {
    return res.status(400).json({ ok: false, error: 'Name and email required' });
  }

  try {
    const { sent, emailId } = await sendEmail(body.email, body.name);

    Promise.all([
      notifyTelegram(body, emailId),
      sendToSheet({
        ...body,
        package: 'PDF-презентация',
        deepLink: CONTENT.botDeeplink,
        emailId: emailId || '',
      }),
    ]).catch(() => {});

    return res.json({ ok: true, emailSent: sent });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// ===== RESEND WEBHOOK: email.opened, email.clicked =====
router.post('/api/resend-webhook', async (req, res) => {
  const event = req.body;

  const eventType = event?.type;
  const emailId = event?.data?.email_id;
  const to = event?.data?.to?.[0] || event?.data?.to || '';
  const clickUrl = event?.data?.click?.link || '';

  if (!eventType || !emailId) {
    return res.json({ ok: true });
  }

  const eventLabels: Record<string, string> = {
    'email.sent': '📤 Отправлено',
    'email.delivered': '✅ Доставлено',
    'email.opened': '👁 Открыто',
    'email.clicked': '🖱 Клик',
    'email.bounced': '❌ Bounce',
    'email.complained': '⚠️ Жалоба',
  };

  const label = eventLabels[eventType];
  if (!label) return res.json({ ok: true });

  // Send event to Google Sheet
  await sendToSheet({
    _type: 'email_event',
    emailId,
    event: eventType,
    label,
    to,
    clickUrl,
    timestamp: event.created_at || new Date().toISOString(),
  });

  // Notify Telegram on opens and clicks
  if (eventType === 'email.opened' || eventType === 'email.clicked') {
    const lines = [
      `${label} *EMAIL TRACKING*`,
      '',
      `📧 *To:* ${to}`,
      `📬 *Email ID:* \`${emailId}\``,
    ];
    if (clickUrl) lines.push(`🔗 *Ссылка:* ${clickUrl}`);
    lines.push(`📅 ${event.created_at || new Date().toISOString()}`);

    await sendTelegram(lines.join('\n'));
  }

  return res.json({ ok: true });
});

export default router;
