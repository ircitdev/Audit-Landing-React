/**
 * Серверный конфиг — все секреты и параметры интеграций.
 * Читает .env один раз, импортируется из api/*.ts роутеров.
 * НИКОГДА не импортировать на клиент (src/).
 */

// ===== TELEGRAM =====
export const TG = {
  botToken: process.env.TG_BOT_TOKEN || '',
  chatId: process.env.TG_CHAT_ID || '',
  threadId: process.env.TG_THREAD_ID || '',
  inboxThreadId: process.env.TG_INBOX_THREAD_ID || '',  // топик для входящей почты
  apiUrl: (token: string) => `https://api.telegram.org/bot${token}/sendMessage`,
} as const;

// ===== GOOGLE SHEETS CRM =====
export const SHEETS = {
  webhook: process.env.GOOGLE_SHEET_WEBHOOK || '',
} as const;

// ===== RESEND (EMAIL) =====
export const RESEND = {
  apiKey: process.env.SMTP_PASS || '',       // re_xxx ключ
  webhookSecret: process.env.RESEND_WEBHOOK_SECRET || '',
  from: process.env.SMTP_FROM || 'СайтЧИСТ <soldatov@sitechist.ru>',
} as const;

// ===== PDF & DEEP LINKS =====
export const CONTENT = {
  pdfUrl: 'https://storage.googleapis.com/uspeshnyy-projects/webaudit/SoldatovWebAudit.pdf',
  botDeeplink: 'https://t.me/WebAuditRuBot?start=free_audit__pdf_email',
} as const;

// ===== RATE LIMITING =====
export const RATE = {
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
} as const;

// ===== ХЕЛПЕРЫ =====

/** Отправить сообщение в Telegram */
export async function sendTelegram(text: string, parseMode: 'Markdown' | 'HTML' = 'Markdown') {
  if (!TG.botToken || !TG.chatId) return null;

  const payload: Record<string, unknown> = {
    chat_id: TG.chatId,
    text,
    parse_mode: parseMode,
  };
  if (TG.threadId) payload.message_thread_id = Number(TG.threadId);

  return fetch(TG.apiUrl(TG.botToken), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

/** Отправить сообщение в конкретный топик Telegram */
export async function sendTelegramToThread(text: string, threadId: string, parseMode: 'Markdown' | 'HTML' = 'HTML') {
  if (!TG.botToken || !TG.chatId || !threadId) return null;

  return fetch(TG.apiUrl(TG.botToken), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG.chatId,
      text,
      parse_mode: parseMode,
      message_thread_id: Number(threadId),
    }),
  });
}

/** Отправить данные в Google Sheets CRM */
export async function sendToSheet(data: Record<string, unknown> | object) {
  if (!SHEETS.webhook) return;
  try {
    await fetch(SHEETS.webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    // best-effort
  }
}
