# Система сбора и аналитики лидов — СайтЧИСТ

## Обзор архитектуры

```
Посетитель сайта
    │
    │  Заполняет форму заявки
    │  (любой тариф: Разведка / Броня / Проект)
    │
    ▼
┌─────────────────────────────┐
│  Клиент (React)             │
│  src/components/Modals.tsx   │
│                             │
│  Собирает:                  │
│  - Данные формы             │
│  - UTM-метки из URL         │
│  - Deep link с тарифом      │
│  - Referrer                 │
│  - URL страницы             │
│                             │
│  POST /api/send-lead        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Сервер (Express)           │
│  api/send-lead.ts           │
│                             │
│  Параллельно отправляет:    │
│                             │
│  ┌──────────┐ ┌───────────┐ │
│  │ Telegram │ │ Google    │ │
│  │ Bot API  │ │ Sheets    │ │
│  └──────────┘ └───────────┘ │
└─────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌────────────┐  ┌──────────────┐
│  TG-группа │  │ Google Sheet  │
│  (топик)   │  │ Лиды + Дашб. │
└────────────┘  └──────────────┘
```

## Файлы системы

| Файл | Назначение |
|------|------------|
| `src/components/Modals.tsx` | Форма заявки, сбор UTM/deep link, отправка на сервер |
| `src/metrika.ts` | Хелпер для Яндекс.Метрики `reachGoal()` |
| `api/send-lead.ts` | Express-роутер: Telegram + Google Sheets |
| `server.ts` | Express-сервер: API + раздача статики |
| `google-apps-script.js` | Apps Script: запись в таблицу + дашборд |
| `.env` | Секреты (токены, ID чата, webhook) |
| `vite.config.ts` | Proxy `/api` → `localhost:3001` для dev |

---

## Переменные окружения (.env)

```env
TG_BOT_TOKEN=...          # Токен Telegram-бота
TG_CHAT_ID=...            # ID группы/чата для уведомлений
TG_THREAD_ID=...          # ID топика в группе (необязательно)
GOOGLE_SHEET_WEBHOOK=...  # URL Google Apps Script web app
```

> `.env` уже в `.gitignore`. Шаблон без значений — `.env.example`.

---

## Что отправляется с каждым лидом

### Данные формы

| Поле | Обязательное | Источник |
|------|:---:|----------|
| `name` | да | Ввод пользователя |
| `phone` | да | Ввод пользователя |
| `site` | да | Ввод пользователя |
| `company` | нет | Ввод пользователя |
| `industry` | нет | Ввод пользователя |
| `telegram` | нет | Ввод пользователя |
| `message` | нет | Ввод пользователя |

### Автоматическая аналитика

| Поле | Пример | Откуда берётся |
|------|--------|----------------|
| `package` | `Разведка — 25 000 ₽` | Кнопка тарифа, по которой открылась форма |
| `deepLink` | `https://t.me/WebAuditRuBot?start=free_audit__razvedka` | Генерируется из тарифа |
| `utm.utm_source` | `yandex` | `?utm_source=...` из URL посетителя |
| `utm.utm_medium` | `cpc` | `?utm_medium=...` из URL посетителя |
| `utm.utm_campaign` | `audit_152fz` | `?utm_campaign=...` из URL посетителя |
| `utm.utm_content` | `banner1` | `?utm_content=...` из URL посетителя |
| `utm.utm_term` | `аудит сайта` | `?utm_term=...` из URL посетителя |
| `referrer` | `https://yandex.ru/` | `document.referrer` |
| `page` | `https://webaudit.ru/?utm_source=yandex` | `window.location.href` |

---

## Telegram: формат сообщения

Каждый лид приходит в группу (и топик, если указан `TG_THREAD_ID`) в формате Markdown:

```
🚀 *НОВЫЙ ЛИД: Разведка — 25 000 ₽*

👤 *Имя:* Иван Петров
🏢 *Компания:* ООО Рога и Копыта
💼 *Сфера:* E-commerce
📞 *Телефон:* +79251234567
📱 *Telegram:* @ivanpetrov
🌐 *Сайт:* https://example.com
✉️ *Сообщение:* Хочу проверить сайт

🔗 *Deep link:* https://t.me/WebAuditRuBot?start=free_audit__razvedka

📊 *UTM-метки:*
  • utm_source: `yandex`
  • utm_medium: `cpc`
  • utm_campaign: `audit_152fz`
↩️ *Referrer:* https://yandex.ru/
📄 *Страница:* https://webaudit.ru/?utm_source=yandex
```

### Настройка топика

1. Создайте топик в группе (например, "Лиды с сайта")
2. Перешлите любое сообщение из топика боту [@RawDataBot](https://t.me/RawDataBot)
3. Найдите `message_thread_id` в ответе
4. Укажите его в `.env` как `TG_THREAD_ID`

---

## Google Sheets: CRM

### Лист "Лиды"

Каждый лид записывается в новую строку с 21 колонкой:

| # | Колонка | Заполняется | Описание |
|---|---------|:-----------:|----------|
| 1 | Дата | авто | `dd.MM.yyyy` по МСК |
| 2 | Время | авто | `HH:mm:ss` по МСК |
| 3 | Тариф | авто | Название тарифа из формы |
| 4 | Имя | авто | |
| 5 | Компания | авто | |
| 6 | Сфера | авто | |
| 7 | Телефон | авто | |
| 8 | Telegram | авто | |
| 9 | Сайт | авто | |
| 10 | Сообщение | авто | |
| 11 | Deep Link | авто | Ссылка на бота с тарифом и источником |
| 12 | utm_source | авто | |
| 13 | utm_medium | авто | |
| 14 | utm_campaign | авто | |
| 15 | utm_content | авто | |
| 16 | utm_term | авто | |
| 17 | Referrer | авто | |
| 18 | Страница | авто | |
| 19 | Статус | вручную | Выпадающий список (см. ниже) |
| 20 | Комментарий | вручную | Заметки менеджера |
| 21 | Сумма сделки | вручную | Для расчёта выручки |

**Статусы лида:** Новый → В работе → Переговоры → Счёт выставлен → Оплачен / Отказ / Отложен

### Лист "Дашборд"

Обновляется автоматически при каждом новом лиде и при ручном редактировании листа "Лиды". Содержит:

- **KPI:** всего лидов, оплачено, конверсия %, выручка
- **По статусам:** таблица с количеством и долей
- **По тарифам:** какой тариф популярнее
- **По источникам:** откуда приходят (utm_source)
- **По дням:** последние 14 дней

### Установка Apps Script

1. Откройте таблицу → Расширения → Apps Script
2. Вставьте код из `google-apps-script.js`
3. Запустите функцию `setupSheets` (создаст структуру + тестовый лид)
4. Развернуть → Новое развертывание → Веб-приложение
   - Выполнять от имени: "Я"
   - Доступ: "Все"
5. Скопируйте URL → вставьте в `.env` как `GOOGLE_SHEET_WEBHOOK`

---

## Deep links в Telegram-боте

Все ссылки на бота содержат трекинг через параметр `start`. Формат: `действие__источник`.

| Компонент | Deep link | Парсинг в боте |
|-----------|-----------|----------------|
| Hero | `start=zakazat_audit__hero` | действие=`zakazat_audit`, источник=`hero` |
| Navbar | `start=sos_audit__navbar` | действие=`sos_audit`, источник=`navbar` |
| Footer | `start=contact__footer` | действие=`contact`, источник=`footer` |
| ROI (верх) | `start=zakazat_audit__roi_top` | действие=`zakazat_audit`, источник=`roi_top` |
| ROI (низ) | `start=zakazat_audit__roi_bottom` | действие=`zakazat_audit`, источник=`roi_bottom` |
| После формы (Разведка) | `start=free_audit__razvedka` | действие=`free_audit`, источник=`razvedka` |
| После формы (Броня) | `start=free_audit__bronya` | действие=`free_audit`, источник=`bronya` |
| После формы (Проект) | `start=free_audit__proekt` | действие=`free_audit`, источник=`proekt` |

### Парсинг в боте (Python)

```python
@bot.message_handler(commands=['start'])
def handle_start(message):
    payload = message.text.split(' ', 1)[1] if ' ' in message.text else ''
    parts = payload.split('__', 1)
    action = parts[0]       # zakazat_audit, free_audit, sos_audit, contact
    source = parts[1] if len(parts) > 1 else 'direct'  # hero, navbar, razvedka...
```

---

## Яндекс.Метрика

Счётчик: **107728471** (в `index.html`).

### Настройки

| Параметр | Значение | Назначение |
|----------|----------|------------|
| `webvisor` | true | Запись сессий пользователей |
| `clickmap` | true | Тепловая карта кликов |
| `accurateTrackBounce` | true | Точный расчёт отказов |
| `trackHash` | true | Отслеживание хеш-навигации |
| `trackLinks` | true | Клики по внешним ссылкам |
| `ecommerce` | dataLayer | Электронная коммерция |

### Цели (reachGoal)

Все цели вызываются через хелпер `src/metrika.ts`:

| Цель | Событие | Параметры |
|------|---------|-----------|
| `telegram_click` | Клик на любую ссылку Telegram-бота | `source`: hero, navbar, footer, roi_top, roi_bottom, post_submit_bot |
| `lead_form_open` | Открытие формы заявки | `package`: razvedka, proekt, bronya |
| `lead_form_submit` | Успешная отправка формы | `package`: название тарифа |
| `pdf_download` | Клик на "Скачать PDF" | — |

### Настройка целей в интерфейсе Метрики

1. metrika.yandex.ru → счётчик 107728471 → Настройка → Цели
2. Добавить цель → тип "JavaScript-событие"
3. Создать 4 цели с идентификаторами: `telegram_click`, `lead_form_open`, `lead_form_submit`, `pdf_download`

---

## Запуск

### Разработка (dev)

```bash
# Терминал 1: Vite dev server (порт 3000, с proxy на 3001)
npm run dev

# Терминал 2: Express API server (порт 3001)
npm run server
```

Vite проксирует `/api/*` на Express через настройку в `vite.config.ts`.

### Продакшен

```bash
npm run build              # Собирает статику в dist/
npm run server             # Express раздаёт dist/ + API на одном порте
```

---

## Воронка после отправки формы

```
Форма отправлена
    │
    ├─► Telegram-группа (мгновенное уведомление с UTM и deep link)
    ├─► Google Sheets (строка в CRM с полной аналитикой)
    ├─► Яндекс.Метрика (цель lead_form_submit)
    │
    ▼
Экран "Заявка отправлена"
    │
    ▼
CTA: "Бесплатный экспресс-аудит в боте"
    │  (deep link: free_audit__<тариф>)
    │
    ▼
Telegram-бот @WebAuditRuBot
    │  (бот видит откуда пришёл пользователь)
    │
    ▼
Бесплатный мини-аудит → upsell в полный тариф
```
