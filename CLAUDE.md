# CLAUDE.md — СайтЧИСТ (webaudit.ru)

## Project overview

Landing page for website compliance audit service (Russian market). Checks websites for 152-FZ compliance, technical security, and marketing issues. React SPA with Express backend for lead processing.

## Tech stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, Motion (Framer Motion), Recharts, Lucide icons
- **Backend:** Express (server.ts) with tsx runner
- **Analytics:** Yandex.Metrika (counter 107728471) with custom goals via `src/metrika.ts`
- **Lead pipeline:** Form → Express API → Telegram Bot API + Google Sheets (Apps Script)
- **Language:** TypeScript throughout

## Commands

- `npm run dev` — Vite dev server (port 3000), proxies `/api` to port 3001
- `npm run server` — Express API server (port 3001), needs `.env`
- `npm run build` — Production build to `dist/`
- `npm run lint` — TypeScript type-check (`tsc --noEmit`)

## Architecture

### Lead flow
```
Form (Modals.tsx) → POST /api/send-lead (api/send-lead.ts) → Telegram + Google Sheets
```
- Client collects UTM params, deep link, referrer automatically
- Server sends to Telegram (with thread/topic support) and Google Sheets in parallel
- Google Sheets CRM via Apps Script webhook (`google-apps-script.js`)
- Secrets in `.env` (gitignored), never in client code

### Telegram deep links
All bot links use format `?start=action__source` for tracking. Parser splits on `__`.

### Metrika goals
`telegram_click`, `lead_form_open`, `lead_form_submit`, `pdf_download` — all via `reachGoal()` helper.

## Key files

| File | Purpose |
|------|---------|
| `src/components/Modals.tsx` | Lead form + post-submit bot CTA + UTM collection |
| `src/components/Pricing.tsx` | 3 pricing tiers, all open lead form |
| `api/send-lead.ts` | Express router: Telegram + Google Sheets |
| `server.ts` | Express server for production |
| `src/metrika.ts` | Yandex.Metrika reachGoal helper |
| `google-apps-script.js` | Google Apps Script CRM (copy to Sheets) |
| `docs/LEAD-PIPELINE.md` | Full pipeline documentation |

## Conventions

- All text in Russian (UI, comments where relevant)
- Tailwind utility classes, no separate CSS files
- Components in `src/components/`, one component per file
- Lazy loading for below-the-fold components in App.tsx
- Bot token and secrets must never be in client-side code
