import { Router, Request, Response, NextFunction } from 'express';

const router = Router();

// Simple in-memory rate limiter: max 5 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return next();
  }

  if (entry.count >= RATE_LIMIT) {
    return res.status(429).json({ ok: false, error: 'Too many requests' });
  }

  entry.count++;
  return next();
}

// Cleanup stale entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(ip);
  }
}, 10 * 60 * 1000);

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

router.post('/api/send-lead', rateLimit, async (req, res) => {
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

// AI widget: bot notification (user clicked through to bot)
router.post('/api/ai-notify', rateLimit, async (req, res) => {
  const { mode } = req.body || {};
  if (!API_TOKEN || !CHAT_ID) return res.status(500).json({ ok: false });

  const modeLabel = mode === 'voice' ? '🎙 голосовой' : '💬 текстовый';
  const lines = [
    '🤖 <b>AI-консультант направил клиента в бота</b>',
    '',
    `📋 Режим: ${modeLabel}`,
    '🔗 Клиент перешёл в @WebAuditRuBot',
    '',
    `📅 ${new Date().toLocaleString('ru-RU')}`,
  ];

  const payload: Record<string, unknown> = {
    chat_id: CHAT_ID,
    text: lines.join('\n'),
    parse_mode: 'HTML',
  };
  if (THREAD_ID) payload.message_thread_id = Number(THREAD_ID);

  try {
    const r = await fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return r.ok ? res.json({ ok: true }) : res.status(502).json({ ok: false });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

// AI widget: lead from chat/voice form
router.post('/api/ai-lead', rateLimit, async (req, res) => {
  const { name, phone, site } = req.body || {};
  if (!API_TOKEN || !CHAT_ID) return res.status(500).json({ ok: false });

  const esc = (s: string) => String(s || '—').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = [
    '🤖 <b>Заявка от AI-консультанта — СайтЧИСТ!</b>',
    '',
    `👤 <b>Имя:</b> ${esc(name)}`,
    `📞 <b>Телефон:</b> ${esc(phone)}`,
    `🌐 <b>Сайт:</b> ${esc(site)}`,
    '',
    `📅 ${esc(new Date().toLocaleString('ru-RU'))}`,
  ];

  const payload: Record<string, unknown> = {
    chat_id: CHAT_ID,
    text: lines.join('\n'),
    parse_mode: 'HTML',
  };
  if (THREAD_ID) payload.message_thread_id = Number(THREAD_ID);

  try {
    const [tgResponse] = await Promise.all([
      fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
      sendToSheet({ name, phone, site, package: 'AI-консультант' }),
    ]);
    return tgResponse.ok ? res.json({ ok: true }) : res.status(502).json({ ok: false });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

export default router;
