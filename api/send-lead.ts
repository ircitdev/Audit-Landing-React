import { Router, Request, Response, NextFunction } from 'express';
import { TG, RATE, sendTelegram, sendToSheet } from './config.js';

const router = Router();

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE.windowMs });
    return next();
  }

  if (entry.count >= RATE.maxRequests) {
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

router.post('/api/send-lead', rateLimit, async (req, res) => {
  const body: LeadBody = req.body;

  if (!body.name || !TG.botToken || !TG.chatId) {
    return res.status(400).json({ ok: false, error: 'Missing data' });
  }

  const text = formatMessage(body);

  try {
    const [tgResponse] = await Promise.all([
      sendTelegram(text),
      sendToSheet(body),
    ]);

    if (tgResponse?.ok) {
      return res.json({ ok: true });
    }

    const err = await tgResponse?.text();
    return res.status(502).json({ ok: false, error: err });
  } catch (e) {
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
});

// AI widget: bot notification
router.post('/api/ai-notify', rateLimit, async (req, res) => {
  const { mode } = req.body || {};
  if (!TG.botToken || !TG.chatId) return res.status(500).json({ ok: false });

  const modeLabel = mode === 'voice' ? '🎙 голосовой' : '💬 текстовый';
  const lines = [
    '🤖 <b>AI-консультант направил клиента в бота</b>',
    '',
    `📋 Режим: ${modeLabel}`,
    '🔗 Клиент перешёл в @WebAuditRuBot',
    '',
    `📅 ${new Date().toLocaleString('ru-RU')}`,
  ];

  try {
    const r = await sendTelegram(lines.join('\n'), 'HTML');
    return r?.ok ? res.json({ ok: true }) : res.status(502).json({ ok: false });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

// AI widget: lead from chat/voice form (full lead with UTM)
router.post('/api/ai-lead', rateLimit, async (req, res) => {
  const body = req.body || {};
  if (!TG.botToken || !TG.chatId) return res.status(500).json({ ok: false });

  const esc = (s: string) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const lines = [
    '🤖 <b>Заявка от AI-консультанта — СайтЧИСТ!</b>',
    '',
  ];

  if (body.name)     lines.push(`👤 <b>Имя:</b> ${esc(body.name)}`);
  if (body.phone)    lines.push(`📞 <b>Телефон:</b> ${esc(body.phone)}`);
  if (body.email)    lines.push(`📧 <b>Email:</b> ${esc(body.email)}`);
  if (body.company)  lines.push(`🏢 <b>Компания:</b> ${esc(body.company)}`);
  if (body.site)     lines.push(`🌐 <b>Сайт:</b> ${esc(body.site)}`);
  if (body.message)  lines.push(`✉️ <b>Вопрос:</b> ${esc(body.message)}`);
  if (body.interest) lines.push(`🎯 <b>Интерес:</b> ${esc(body.interest)}`);

  const utm = body.utm;
  if (utm && Object.keys(utm).length > 0) {
    lines.push('');
    lines.push('📊 <b>UTM-метки:</b>');
    for (const [key, val] of Object.entries(utm)) {
      lines.push(`  • ${key}: <code>${esc(String(val))}</code>`);
    }
  }

  if (body.deepLink) lines.push(`🔗 <b>Deep link:</b> ${esc(body.deepLink)}`);
  if (body.referrer) lines.push(`↩️ <b>Referrer:</b> ${esc(body.referrer)}`);
  if (body.page)     lines.push(`📄 <b>Страница:</b> ${esc(body.page)}`);

  lines.push('');
  lines.push(`📅 ${esc(new Date().toLocaleString('ru-RU'))}`);

  const sheetData = {
    package: 'AI-консультант',
    name: body.name,
    phone: body.phone,
    email: body.email,
    company: body.company,
    site: body.site,
    message: body.message || body.interest,
    deepLink: body.deepLink,
    utm: body.utm,
    referrer: body.referrer,
    page: body.page,
  };

  try {
    const [tgResponse] = await Promise.all([
      sendTelegram(lines.join('\n'), 'HTML'),
      sendToSheet(sheetData),
    ]);
    return tgResponse?.ok ? res.json({ ok: true }) : res.status(502).json({ ok: false });
  } catch {
    return res.status(500).json({ ok: false });
  }
});

export default router;
