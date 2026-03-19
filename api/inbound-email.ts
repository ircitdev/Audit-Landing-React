import { Router } from 'express';
import { TG, sendTelegramToThread, sendToSheet } from './config.js';

const router = Router();

/**
 * Resend Inbound Email Webhook
 *
 * Resend отправляет JSON с входящим письмом:
 * {
 *   "type": "email.received",
 *   "created_at": "...",
 *   "data": {
 *     "from": "sender@example.com",
 *     "to": ["info@sitechist.ru"],
 *     "subject": "...",
 *     "text": "plain text body",
 *     "html": "<html>...</html>",
 *     "headers": [...],
 *     "attachments": [{ "filename": "...", "content_type": "...", "size": ... }]
 *   }
 * }
 */
router.post('/api/inbound-email', async (req, res) => {
  const event = req.body;
  const email = event?.data || event; // Resend wraps in data, fallback for direct post

  const from = email.from || email.sender || '';
  const to = Array.isArray(email.to) ? email.to.join(', ') : (email.to || '');
  const subject = email.subject || '(без темы)';
  const textBody = email.text || '';
  const attachments = email.attachments || [];
  const timestamp = event.created_at || new Date().toISOString();

  // Truncate body for Telegram (max ~4000 chars)
  const bodyPreview = textBody.length > 2000
    ? textBody.slice(0, 2000) + '\n\n... (обрезано)'
    : textBody;

  const esc = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Format for Telegram
  const lines = [
    '📨 <b>ВХОДЯЩЕЕ ПИСЬМО</b>',
    '',
    `📧 <b>От:</b> ${esc(from)}`,
    `📬 <b>Кому:</b> ${esc(to)}`,
    `📋 <b>Тема:</b> ${esc(subject)}`,
  ];

  if (attachments.length > 0) {
    const attList = attachments.map((a: { filename?: string; size?: number }) => {
      const size = a.size ? ` (${Math.round(a.size / 1024)} KB)` : '';
      return `  📎 ${esc(a.filename || 'файл')}${size}`;
    });
    lines.push('', '<b>Вложения:</b>', ...attList);
  }

  lines.push('', `📅 ${esc(timestamp)}`);

  if (bodyPreview.trim()) {
    lines.push('', '─────────────────', '', `<pre>${esc(bodyPreview)}</pre>`);
  }

  const threadId = TG.inboxThreadId;

  // Send to Telegram inbox topic
  if (threadId) {
    try {
      await sendTelegramToThread(lines.join('\n'), threadId);
    } catch (err) {
      console.error('Inbound email → TG error:', err);
    }
  }

  // Log to Google Sheets
  try {
    await sendToSheet({
      _type: 'inbound_email',
      from,
      to,
      subject,
      bodyPreview: textBody.slice(0, 500),
      attachmentsCount: attachments.length,
      timestamp,
      status: 'Новое',
    });
  } catch (err) {
    console.error('Inbound email → Sheet error:', err);
  }

  return res.json({ ok: true });
});

export default router;
