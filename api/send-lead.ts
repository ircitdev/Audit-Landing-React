import { Router } from 'express';

const router = Router();

const API_TOKEN = process.env.TG_BOT_TOKEN || '';
const CHAT_ID = process.env.TG_CHAT_ID || '';
const THREAD_ID = process.env.TG_THREAD_ID || '';
const SHEET_WEBHOOK = process.env.GOOGLE_SHEET_WEBHOOK || '';

interface LeadBody {
  package?: string;
  name?: string;
  company?: string;
  industry?: string;
  phone?: string;
  telegram?: string;
  site?: string;
  message?: string;
  deepLink?: string;
  utm?: Record<string, string>;
  referrer?: string | null;
  page?: string;
}

function formatMessage(body: LeadBody): string {
  const lines: string[] = [];

  lines.push(`🚀 *НОВЫЙ ЛИД: ${body.package || 'Без тарифа'}*`);
  lines.push('');
  if (body.name) lines.push(`👤 *Имя:* ${body.name}`);
  if (body.company) lines.push(`🏢 *Компания:* ${body.company}`);
  if (body.industry) lines.push(`💼 *Сфера:* ${body.industry}`);
  if (body.phone) lines.push(`📞 *Телефон:* ${body.phone}`);
  if (body.telegram) lines.push(`📱 *Telegram:* ${body.telegram}`);
  if (body.site) lines.push(`🌐 *Сайт:* ${body.site}`);
  if (body.message) lines.push(`✉️ *Сообщение:* ${body.message}`);

  if (body.deepLink) {
    lines.push('');
    lines.push(`🔗 *Deep link:* ${body.deepLink}`);
  }

  const utm = body.utm;
  if (utm && Object.keys(utm).length > 0) {
    lines.push('');
    lines.push('📊 *UTM-метки:*');
    for (const [key, val] of Object.entries(utm)) {
      lines.push(`  • ${key}: \`${val}\``);
    }
  }

  if (body.referrer) lines.push(`↩️ *Referrer:* ${body.referrer}`);
  if (body.page) lines.push(`📄 *Страница:* ${body.page}`);

  return lines.join('\n');
}

async function sendToTelegram(text: string) {
  const payload: Record<string, unknown> = {
    chat_id: CHAT_ID,
    text,
    parse_mode: 'Markdown',
  };
  if (THREAD_ID) payload.message_thread_id = Number(THREAD_ID);

  return fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

async function sendToSheet(body: LeadBody) {
  if (!SHEET_WEBHOOK) return;
  try {
    await fetch(SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    // Sheet write is best-effort, don't block Telegram send
  }
}

router.post('/api/send-lead', async (req, res) => {
  const body: LeadBody = req.body;

  if (!body.name || !API_TOKEN || !CHAT_ID) {
    return res.status(400).json({ ok: false, error: 'Missing data' });
  }

  const text = formatMessage(body);

  try {
    // Send to Telegram and Google Sheet in parallel
    const [tgResponse] = await Promise.all([
      sendToTelegram(text),
      sendToSheet(body),
    ]);

    if (tgResponse.ok) {
      return res.json({ ok: true });
    }

    const err = await tgResponse.text();
    return res.status(502).json({ ok: false, error: err });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

export default router;
