# CLAUDE.md — СайтЧИСТ (sitechist.ru)

## Project overview

Landing page for website compliance audit service (Russian market). Checks websites for 152-FZ compliance, technical security, and marketing issues. React SPA with Express backend for lead processing.

- **Production:** https://sitechist.ru (nginx + certbot on 31.44.7.144)
- **Bot:** https://t.me/WebAuditRuBot

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Motion (Framer Motion), Lucide icons
- **Backend:** Express (server.ts) with tsx runner
- **Analytics:** Yandex.Metrika (counter 107728471) with custom goals via `src/metrika.ts`
- **Lead pipeline:** Form → Express API → Telegram Bot API + Google Sheets (Apps Script)
- **Email:** Resend SMTP for PDF delivery (`api/send-pdf.ts`)
- **Language:** TypeScript throughout

## Commands

- `npm run dev` — Vite dev server (port 3000), proxies `/api` to port 3001
- `npm run server` — Express API server (port 3001), needs `.env`
- `npm run build` — Production build to `dist/`
- `npm run lint` — TypeScript type-check (`tsc --noEmit`)

## Deployment

```bash
npm run build
scp -r dist/* root@31.44.7.144:/var/www/sitechist.ru/
```
nginx config: `/etc/nginx/sites-available/sitechist.ru`, SSL via certbot (auto-renew).

## Architecture

### Lead flow
```
Form (Modals.tsx)        → POST /api/send-lead  → Telegram + Google Sheets
PDF form (Hero.tsx)      → POST /api/send-pdf   → Email (Resend) + Telegram + Google Sheets
AI chat/voice widget     → POST /api/ai-lead    → Telegram + Google Sheets
AI widget bot redirect   → POST /api/ai-notify  → Telegram notification
```
- Client collects UTM params, deep link, referrer automatically via `src/config.ts`
- Server sends to Telegram (with thread/topic support) and Google Sheets in parallel
- Google Sheets CRM via Apps Script webhook (`google-apps-script.js`)
- Secrets in `.env` (gitignored), never in client code
- All API endpoints have rate limiting (5 req/hour/IP)

### Telegram deep links
All bot links use format `?start=action__source` for tracking. Parser splits on `__`.

### Metrika goals
`telegram_click`, `lead_form_open`, `lead_form_submit`, `pdf_download`, `email_captured` — all via `reachGoal()` helper.

### Legal compliance (152-FZ)
- Consent checkbox (ПДн) on every form collecting personal data
- Privacy policy modal (`PrivacyPolicy.tsx`) opened via `CustomEvent('open-privacy')`
- Cookie banner (`CookieBanner.tsx`) — appears after 20s, once per 24h
- Company requisites (ИНН, ОГРНИП, address) in Footer
- Links to privacy policy in Footer and cookie banner

## Key files

| File | Purpose |
|------|---------|
| `src/App.tsx` | Root: layout, modals, privacy, cookie banner, voice widget |
| `src/config.ts` | API URLs, Telegram helpers, UTM, Metrika config |
| `src/components/Hero.tsx` | Hero section + story modal + PDF form + article iframe |
| `src/components/Modals.tsx` | Lead form with ПДн consent + post-submit CTA |
| `src/components/Pricing.tsx` | 3 pricing tiers, CTA buttons |
| `src/components/AuditPoints.tsx` | 32 audit checkpoints in 4 categories |
| `src/components/MarketingAudit.tsx` | Marketing audit bonus section |
| `src/components/RoiSection.tsx` | ROI calculator + quote + "Why us" |
| `src/components/CookieBanner.tsx` | Cookie consent banner (152-FZ) |
| `src/components/PrivacyPolicy.tsx` | Privacy policy modal (152-FZ) |
| `src/components/Footer.tsx` | Contacts + legal requisites + policy links |
| `src/components/StickyCta.tsx` | Sticky mobile CTA button |
| `src/components/VoiceWidget.tsx` | AI voice/chat widget |
| `api/send-lead.ts` | Express router: lead, AI-lead, AI-notify + rate limiting |
| `api/send-pdf.ts` | PDF email delivery via Resend |
| `server.ts` | Express server for production |
| `src/metrika.ts` | Yandex.Metrika reachGoal helper |
| `google-apps-script.js` | Google Apps Script CRM (copy to Sheets) |

## Conventions

- All text in Russian (UI, comments where relevant)
- Tailwind utility classes, no separate CSS files
- Components in `src/components/`, one component per file
- Lazy loading for below-the-fold components in App.tsx
- Bot token and secrets must never be in client-side code
- Mobile-first responsive design (separate mobile/desktop layouts in Hero)
