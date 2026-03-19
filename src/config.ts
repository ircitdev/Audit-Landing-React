/**
 * Единый конфиг маркетинга, аналитики и интеграций.
 * Все параметры, которые используются на клиенте, собраны здесь.
 * Серверные секреты (токены) хранятся в .env и НЕ импортируются на клиент.
 */

// ===== БРЕНД =====
export const BRAND = {
  name: 'СайтЧИСТ',
  domain: 'sitechist.ru',
  url: 'https://sitechist.ru',
  owner: 'Денис Солдатов',
  phone: '+7 925 148 5560',
  email: 'soldatov@sitechist.ru',
  tagline: 'Бронежилет для сайта',
} as const;

// ===== TELEGRAM =====
export const TELEGRAM = {
  botUsername: 'WebAuditRuBot',
  botUrl: 'https://t.me/WebAuditRuBot',
  /** Deep link: ?start=action__source */
  deepLink: (action: string, source: string) =>
    `https://t.me/WebAuditRuBot?start=${action}__${source}`,
} as const;

// ===== ЯНДЕКС.МЕТРИКА =====
export const METRIKA = {
  counterId: 107728471,
  goals: {
    telegramClick: 'telegram_click',
    leadFormOpen: 'lead_form_open',
    leadFormSubmit: 'lead_form_submit',
    pdfDownload: 'pdf_download',
    emailCaptured: 'email_captured',
  },
} as const;

// ===== РЕСУРСЫ =====
export const ASSETS = {
  pdfUrl: 'https://storage.googleapis.com/uspeshnyy-projects/webaudit/SoldatovWebAudit.pdf',
  ogImage: 'https://storage.googleapis.com/uspeshnyy-projects/webaudit/ogimage.jpg',
  certImage: 'https://storage.googleapis.com/uspeshnyy-projects/webaudit/sert.jpg',
} as const;

// ===== ТАРИФЫ =====
export const PACKAGES = {
  razvedka: { name: 'Разведка', price: '25 000 ₽', slug: 'razvedka' },
  bronya:   { name: 'Броня',    price: '90 000 ₽', slug: 'bronya' },
  proekt:   { name: 'Проект',   price: '45 000 ₽', slug: 'proekt' },
} as const;

// ===== API ENDPOINTS =====
export const API = {
  sendLead: '/api/send-lead',
  sendPdf: '/api/send-pdf',
  aiNotify: '/api/ai-notify',
  aiLead: '/api/ai-lead',
} as const;

// ===== UTM ХЕЛПЕРЫ =====
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
}

export function packageSlug(pkg: string): string {
  if (pkg.includes('Разведка')) return 'razvedka';
  if (pkg.includes('Проект')) return 'proekt';
  if (pkg.includes('Броня')) return 'bronya';
  return 'general';
}
