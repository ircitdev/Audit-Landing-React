# СайтЧИСТ — Техническая документация

> Landing page сервиса комплексного аудита сайтов на соответствие 152-ФЗ, техническую безопасность и маркетинг.
> Прод: **https://sitechist.ru** | Сервер: `31.44.7.144` | Репо: [ircitdev/Audit-Landing-React](https://github.com/ircitdev/Audit-Landing-React)

---

## Содержание

1. [Стек технологий](#стек-технологий)
2. [Быстрый старт](#быстрый-старт)
3. [Архитектура проекта](#архитектура-проекта)
4. [Компоненты](#компоненты)
5. [API-эндпоинты](#api-эндпоинты)
6. [Лид-пайплайн](#лид-пайплайн)
7. [AI-консультант](#ai-консультант)
8. [Email-пайплайн](#email-пайплайн)
9. [Google Sheets CRM](#google-sheets-crm)
10. [Аналитика (Яндекс.Метрика)](#аналитика)
11. [Deep Links (Telegram)](#deep-links)
12. [Деплой](#деплой)
13. [Переменные окружения](#переменные-окружения)
14. [Структура файлов](#структура-файлов)

---

## Стек технологий

| Слой | Технологии |
|------|-----------|
| **Frontend** | React 19, Vite 6, TypeScript 5.8, Tailwind CSS 4, Motion (Framer Motion 12), Lucide icons |
| **Backend** | Express 4, tsx runner, nodemailer |
| **AI** | Gemini 2.5 Flash (текст), Gemini Live API (голос), WebSocket proxy |
| **Аналитика** | Яндекс.Метрика (counter 107728471) |
| **CRM** | Google Sheets + Apps Script |
| **Email** | Resend (SMTP + webhooks) |
| **Мессенджер** | Telegram Bot API (лиды + уведомления) |
| **Хостинг** | VPS (nginx + pm2), Google Cloud Storage (статика/изображения) |

---

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/ircitdev/Audit-Landing-React.git
cd Audit-Landing-React

# Установить зависимости
npm install

# Создать .env (см. раздел "Переменные окружения")
cp .env.example .env

# Запустить dev
npm run dev       # Vite на :3000, проксирует /api → :3001
npm run server    # Express на :3001 (в отдельном терминале)
```

### Команды

| Команда | Описание |
|---------|----------|
| `npm run dev` | Vite dev server (порт 3000), hot reload |
| `npm run server` | Express API (порт 3001), читает .env |
| `npm run build` | Production-сборка в `dist/` |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`) |
| `npm run preview` | Превью production-билда |

---

## Архитектура проекта

```
┌─────────────────────────────────────────────────────┐
│                    БРАУЗЕР                           │
│                                                     │
│  React SPA ──────────────────── Voice Widget (JS)   │
│    ├── Hero                      ├── Text Chat       │
│    ├── AuditPoints (32 пункта)   ├── Voice (Gemini)  │
│    ├── MarketingAudit (15 п.)    └── Lead Capture    │
│    ├── Pricing (3 тарифа)                            │
│    ├── Lead Form (Modals)                            │
│    └── PDF Email Gate                                │
└────────┬──────────────────────────┬──────────────────┘
         │ POST /api/*              │ WSS /ws-gemini
         ▼                          ▼
┌──────────────────┐    ┌──────────────────────┐
│  Express API     │    │  Gemini Proxy        │
│  (порт 3002)     │    │  (порт 3001)         │
│  ├── send-lead   │    │  ├── HTTP → Gemini   │
│  ├── ai-lead     │    │  └── WS → Gemini Live│
│  ├── ai-notify   │    └──────────────────────┘
│  ├── send-pdf    │
│  ├── resend-hook │
│  └── inbound-mail│
└───┬─────────┬────┘
    │         │
    ▼         ▼
┌────────┐ ┌──────────────┐
│Telegram│ │Google Sheets  │
│Bot API │ │(Apps Script)  │
│  ├─ Лиды│ │  ├─ Лиды     │
│  ├─ AI  │ │  ├─ Дашборд  │
│  └─ Email│ │  ├─ Email    │
└────────┘ │  └─ Входящие  │
           └──────────────┘
```

---

## Компоненты

### Основные (всегда загружены)

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| **Navbar** | `src/components/Navbar.tsx` | Фиксированная навигация, лого, якорные ссылки, кнопка SOS |
| **Hero** | `src/components/Hero.tsx` | Typewriter-анимация, CTA-кнопки, iframe статьи с РИА |
| **CookieBanner** | `src/components/CookieBanner.tsx` | Уведомление о cookies (152-ФЗ), localStorage |
| **VoiceWidget** | `src/components/VoiceWidget.tsx` | DOM-оболочка AI-виджета + inline CSS |
| **Modals** | `src/components/Modals.tsx` | Форма заявки + модалка пункта аудита |
| **PrivacyPolicy** | `src/components/PrivacyPolicy.tsx` | Полноэкранная политика конфиденциальности |
| **StickyCta** | `src/components/StickyCta.tsx` | Мобильная плавающая CTA (появляется при скролле > 600px) |

### Lazy-loaded (ниже fold)

| Компонент | Файл | Назначение |
|-----------|------|-----------|
| **DownloadSection** | `src/components/DownloadSection.tsx` | PDF email gate: имя + email → PDF на почту |
| **Roadmap** | `src/components/Roadmap.tsx` | 3 шага (Разведка → Проектирование → Штурм), мобильный scroll |
| **AuditPoints** | `src/components/AuditPoints.tsx` | 32 пункта в 4 колонках, hover-анимация, tooltip |
| **MarketingAudit** | `src/components/MarketingAudit.tsx` | 15 пунктов маркетинг-аудита, мобильный overlay |
| **RoiSection** | `src/components/RoiSection.tsx` | CSS-бары: 18 млн убытков vs 90к инвестиция |
| **Pricing** | `src/components/Pricing.tsx` | 3 тарифа + сертификат DS-CERT |
| **FAQ** | `src/components/FAQ.tsx` | 6 вопросов-ответов, аккордеон |
| **Footer** | `src/components/Footer.tsx` | Контакты, QR, юридическая информация |

### Потоки данных

```
App.tsx владеет состоянием:
├── isLeadOpen, leadPackage → Modals (форма заявки)
├── selectedPoint → Modals (детали пункта аудита)
├── isPrivacyOpen → PrivacyPolicy
└── CustomEvent('open-privacy') — event bus для Footer/Modals/CookieBanner
```

---

## API-эндпоинты

Все эндпоинты имеют rate limiting: **5 запросов/час с одного IP**.

### POST `/api/send-lead`

Основная форма заявки с сайта.

```typescript
// Request
{
  name: string,         // обязательно
  phone?: string,
  telegram?: string,
  site?: string,
  company?: string,
  industry?: string,
  message?: string,
  package?: string,     // "Разведка — 25 000 ₽" и т.д.
  deepLink?: string,    // auto: ?start=free_audit__razvedka
  utm?: {               // auto: из URL
    utm_source?: string,
    utm_medium?: string,
    utm_campaign?: string,
    utm_content?: string,
    utm_term?: string
  },
  referrer?: string,    // auto: document.referrer
  page?: string         // auto: window.location.href
}

// Response
{ ok: true }
```

**Обработка:** параллельно Telegram (Markdown) + Google Sheets.

### POST `/api/ai-lead`

Заявка от AI-консультанта.

```typescript
// Request
{
  name: string,
  phone?: string,
  email?: string,
  company?: string,
  site?: string,
  message?: string,
  interest?: string,    // что интересует клиента
  deepLink?: string,    // auto: ?start=ai_lead__{utm_source}
  utm?: Record<string, string>,
  referrer?: string,
  page?: string
}

// Response
{ ok: true }
```

**Обработка:** параллельно Telegram (HTML, тариф "AI-консультант") + Google Sheets.

### POST `/api/ai-notify`

Уведомление о переходе клиента в бота из AI-виджета.

```typescript
// Request
{ mode: "text" | "voice" }

// Response
{ ok: true }
```

### POST `/api/send-pdf`

Email gate: отправка PDF-чеклиста на email.

```typescript
// Request
{ name: string, email: string }

// Response
{ ok: true, emailId: string }
```

**Обработка:** Resend email (HTML-шаблон с PDF-ссылкой) + Telegram + Google Sheets.

### POST `/api/resend-webhook`

Webhook от Resend для трекинга email-событий (opened, clicked, bounced, complained).

### POST `/api/inbound-email`

Webhook для входящей почты (Resend inbound). Пересылает в Telegram-топик + Google Sheets.

---

## Лид-пайплайн

```
                    ┌─────────────────┐
                    │   Пользователь   │
                    └──────┬──────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │ Форма    │ │ AI-      │ │ PDF      │
        │ заявки   │ │ консульт.│ │ email    │
        │ Modals   │ │ Widget   │ │ gate     │
        └────┬─────┘ └────┬─────┘ └────┬─────┘
             │            │            │
             ▼            ▼            ▼
        /api/send-   /api/ai-    /api/send-
         lead         lead         pdf
             │            │            │
             └────────────┼────────────┘
                          │
                    ┌─────┴─────┐
                    │  Parallel  │
                    └─────┬─────┘
                ┌─────────┼─────────┐
                ▼                   ▼
          ┌──────────┐        ┌──────────┐
          │ Telegram │        │ Google   │
          │ Bot API  │        │ Sheets   │
          │          │        │ CRM      │
          │ Формат:  │        │          │
          │ Markdown │        │ Автодаш- │
          │ или HTML │        │ борд     │
          └──────────┘        └──────────┘
```

### Источники лидов и их маркеры

| Источник | Тариф в CRM | Deep link |
|----------|-------------|-----------|
| Форма (Разведка) | `Разведка — 25 000 ₽` | `?start=free_audit__razvedka` |
| Форма (Броня) | `Броня` | `?start=free_audit__bronya` |
| Форма (Проект) | `Проект — 45 000 ₽` | `?start=free_audit__proekt` |
| AI-консультант | `AI-консультант` | `?start=ai_lead__{source}` |
| PDF email gate | `PDF-чеклист` | `?start=free_audit__pdf_email` |

---

## AI-консультант

### Архитектура

```
┌──────────────────────────────────────┐
│          voice-widget.js             │
│  (vanilla JS, загружается в <script>)│
│                                      │
│  ┌─────────────────────────────────┐ │
│  │ Text Chat (Gemini 2.5 Flash)   │ │
│  │ POST /gemini-api/v1beta/...    │ │
│  │ + function calling:            │ │
│  │   - submitLead()               │ │
│  │   - redirectToBot()            │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ Voice (Gemini Live)            │ │
│  │ WSS /ws-gemini                 │ │
│  │ PCM 16-bit audio ↔ streaming   │ │
│  └─────────────────────────────────┘ │
│  ┌─────────────────────────────────┐ │
│  │ System Prompt                  │ │
│  │ GET /ai-consultant-prompt.txt  │ │
│  │ (загружается при первом клике) │ │
│  └─────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### Tool Calls (Function Calling)

```javascript
// submitLead — создаёт лид в CRM
submitLead({
  name: "Иван",           // обязательно
  phone: "+7...",          // хотя бы phone или email
  email: "ivan@...",
  company: "ООО Рога",
  site: "example.com",
  interest: "Тариф Броня"
})
// → POST /api/ai-lead + UTM + referrer + page автоматически

// redirectToBot — перенаправление в Telegram-бот
redirectToBot()
// → window.open('https://t.me/WebAuditRuBot?start=ai_audit__{source}')
```

### Воронка AI-консультанта

```
Приоритет 1: submitLead()        Приоритет 2: redirectToBot()
(собрать контакт)                (отправить в бота)

Шаг 1: "Как вас зовут?"
Шаг 2: "Какой у вас сайт?"
Шаг 3: Рассказать про риски
Шаг 4: "Оставьте телефон — Денис перезвонит"
Шаг 5: submitLead() ──────────── если отказ → redirectToBot()
Шаг 6: Предложить бота дополнительно
```

### Промпт

Файл: `public/ai-consultant-prompt.txt` — редактируется без пересборки.

Содержит:
- О сервисе, контакты, основатель
- 32 пункта аудита со штрафами
- 3 тарифа с ценами
- Воронка разговора
- Стратегия сбора данных
- Фразы-триггеры для продажи
- 6 сценариев возражений

---

## Email-пайплайн

```
Пользователь вводит email в PDF gate
    ↓
POST /api/send-pdf { name, email }
    ↓
┌─────────────────────────────────────┐
│ Parallel:                           │
│ 1. Resend → HTML-письмо с PDF      │
│ 2. Telegram → уведомление          │
│ 3. Google Sheets → запись           │
└─────────────────────────────────────┘
    ↓
Resend webhooks → POST /api/resend-webhook
    ↓
Google Sheets лист "Email события"
(opened, clicked, bounced, complained)
```

### Входящая почта

```
Письмо на info@sitechist.ru
    ↓
Resend Inbound → POST /api/inbound-email
    ↓
┌─────────────────────────────────────┐
│ 1. Telegram (топик "Входящие")     │
│ 2. Google Sheets "Входящие письма" │
└─────────────────────────────────────┘
```

---

## Google Sheets CRM

**ID таблицы:** `1Y2gxCrbNlT7G9C-FPGPqi4Se5vKzsG28W70wpmKFhfg`

### Листы

| Лист | Назначение | Заполнение |
|------|-----------|-----------|
| **Лиды** | Все заявки | Автоматически (21 колонка) + 3 ручных (Статус, Комментарий, Сумма) |
| **Дашборд** | KPI, воронка, источники | Автообновление при каждом лиде + при ручном редактировании |
| **Email события** | Resend webhooks | Автоматически, color-coded |
| **Входящие письма** | Inbound email | Автоматически, статус-dropdown |

### Статусы лида

`Новый` → `В работе` → `Переговоры` → `Счёт выставлен` → `Оплачен` / `Отказ` / `Отложен`

### Установка Apps Script

1. Откройте таблицу в Google Sheets
2. Расширения → Apps Script
3. Вставьте код из `google-apps-script.js`
4. Развернуть → Новое развертывание → Веб-приложение (доступ: "Все")
5. Скопируйте URL → `GOOGLE_SHEET_WEBHOOK` в `.env`

---

## Аналитика

**Яндекс.Метрика** — counter `107728471`

### Цели

| Цель | Когда срабатывает | Параметры |
|------|-------------------|-----------|
| `telegram_click` | Клик на любую Telegram-ссылку | `source`: hero, navbar, footer, roi_top, roi_bottom, post_submit_bot, sticky_cta, pdf_gate |
| `lead_form_open` | Открытие формы заявки | `package`: razvedka, proekt, bronya |
| `lead_form_submit` | Успешная отправка заявки | `package`: название тарифа |
| `pdf_download` | Скачивание PDF | — |
| `email_captured` | Email собран через PDF gate | `source`: pdf_gate |

### Использование

```typescript
import { reachGoal } from '../metrika';
reachGoal('telegram_click', { source: 'hero' });
```

---

## Deep Links

Формат: `https://t.me/WebAuditRuBot?start={action}__{source}`

Парсер на стороне бота разделяет по `__`.

| Контекст | Deep link | Пример |
|----------|-----------|--------|
| Форма (по тарифу) | `free_audit__{slug}` | `?start=free_audit__bronya` |
| AI-консультант (заявка) | `ai_lead__{utm_source}` | `?start=ai_lead__yandex` |
| AI-консультант (бот) | `ai_audit__{utm_source}` | `?start=ai_audit__direct` |
| Навбар | `free_audit__navbar` | `?start=free_audit__navbar` |
| Hero | `zakazat_audit__hero` | `?start=zakazat_audit__hero` |
| ROI секция | `zakazat_audit__roi_top` | `?start=zakazat_audit__roi_top` |
| PDF email | `free_audit__pdf_email` | `?start=free_audit__pdf_email` |
| Sticky CTA | `free_audit__sticky_cta` | `?start=free_audit__sticky_cta` |

---

## Деплой

### Серверная инфраструктура

```
Сервер: 31.44.7.144 (root)
Домен: sitechist.ru (Let's Encrypt SSL)

nginx
├── / → /var/www/sitechist.ru (статика, SPA fallback)
├── /api/* → http://127.0.0.1:3002 (Express API)
├── /gemini-api/* → http://127.0.0.1:3001 (Gemini HTTP proxy)
├── /ws/* → http://127.0.0.1:3001 (Gemini WS proxy)
└── /ws-gemini → http://127.0.0.1:3001 (Gemini Live WS)

pm2
├── gemini-proxy-sitechist (порт 3001) — /opt/gemini-proxy.js
└── sitechist-api (порт 3002) — /var/www/sitechist.ru-api/server.ts
```

### Процедура деплоя

```bash
# 1. Собрать
npm run build

# 2. Загрузить фронтенд
scp -r dist/* root@31.44.7.144:/var/www/sitechist.ru/

# 3. Загрузить бэкенд
scp server.ts package.json root@31.44.7.144:/var/www/sitechist.ru-api/
scp -r api root@31.44.7.144:/var/www/sitechist.ru-api/

# 4. Загрузить статику виджета (без пересборки)
scp public/voice-widget.js public/ai-consultant-prompt.txt \
  root@31.44.7.144:/var/www/sitechist.ru/

# 5. Установить зависимости и перезапустить
ssh root@31.44.7.144 "cd /var/www/sitechist.ru-api && npm install --production && pm2 restart sitechist-api"
```

### Быстрое обновление промпта AI (без деплоя)

```bash
# Редактировать прямо на сервере:
ssh root@31.44.7.144 "nano /var/www/sitechist.ru/ai-consultant-prompt.txt"
# Изменения подхватываются при следующем открытии виджета.
```

---

## Переменные окружения

Файл `.env` (gitignored). Пример: `.env.example`.

```bash
# === Telegram ===
TG_BOT_TOKEN=          # Токен бота (обязательно)
TG_CHAT_ID=            # ID чата/группы (обязательно)
TG_THREAD_ID=          # ID топика для лидов (опционально)
TG_INBOX_THREAD_ID=    # ID топика для входящей почты (опционально)

# === Google Sheets CRM ===
GOOGLE_SHEET_WEBHOOK=  # URL развертывания Apps Script

# === Email (Resend) ===
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=             # Resend API key (re_xxx)
SMTP_FROM=СайтЧИСТ <info@sitechist.ru>
RESEND_WEBHOOK_SECRET= # Для валидации webhooks (опционально)
```

---

## Структура файлов

```
Audit-Landing-React/
├── index.html                  # HTML shell, Metrika counter
├── vite.config.ts              # Vite + React + Tailwind, /api proxy
├── tsconfig.json               # TypeScript ES2022
├── package.json                # Dependencies, npm scripts
├── server.ts                   # Express: static + API routers
├── .env                        # Секреты (gitignored)
├── .env.example                # Шаблон переменных
├── CLAUDE.md                   # Инструкции для Claude Code
│
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root: layout, state, lazy loading
│   ├── index.css               # Tailwind + custom utilities
│   ├── config.ts               # Клиентский конфиг (бренд, ссылки, UTM)
│   ├── constants.ts            # 32 пункта аудита (AUDIT_DATA)
│   ├── types.ts                # AuditPoint interface
│   ├── metrika.ts              # reachGoal() wrapper
│   └── components/
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── DownloadSection.tsx
│       ├── Roadmap.tsx
│       ├── AuditPoints.tsx
│       ├── MarketingAudit.tsx
│       ├── RoiSection.tsx
│       ├── Pricing.tsx
│       ├── FAQ.tsx
│       ├── Footer.tsx
│       ├── Modals.tsx
│       ├── StickyCta.tsx
│       ├── VoiceWidget.tsx
│       ├── CookieBanner.tsx
│       └── PrivacyPolicy.tsx
│
├── api/
│   ├── config.ts               # Серверный конфиг (TG, Sheets, Resend)
│   ├── send-lead.ts            # /api/send-lead, /api/ai-lead, /api/ai-notify
│   ├── send-pdf.ts             # /api/send-pdf, /api/resend-webhook
│   └── inbound-email.ts        # /api/inbound-email
│
├── public/
│   ├── voice-widget.js         # AI-виджет (vanilla JS)
│   └── ai-consultant-prompt.txt # Системный промпт AI-консультанта
│
├── google-apps-script.js       # CRM скрипт (копировать в Google Sheets)
│
└── docs/
    ├── README.md               # Эта документация
    └── LEAD-PIPELINE.md        # Документация лид-пайплайна
```
