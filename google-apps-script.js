/**
 * Google Apps Script — CRM для СайтЧИСТ
 *
 * УСТАНОВКА:
 * 1. Откройте таблицу: https://docs.google.com/spreadsheets/d/1Y2gxCrbNlT7G9C-FPGPqi4Se5vKzsG28W70wpmKFhfg
 * 2. Расширения → Apps Script
 * 3. Вставьте этот код, сохраните
 * 4. Нажмите "Развернуть" → "Новое развертывание" → Тип: "Веб-приложение"
 *    - Выполнять от имени: "Я"
 *    - Доступ: "Все"
 * 5. Скопируйте URL развертывания → вставьте в .env как GOOGLE_SHEET_WEBHOOK
 * 6. При первом запуске разрешите доступ к таблице
 */

// ===== НАСТРОЙКИ =====
const SHEET_ID = '1Y2gxCrbNlT7G9C-FPGPqi4Se5vKzsG28W70wpmKFhfg';
const LEADS_SHEET = 'Лиды';
const DASHBOARD_SHEET = 'Дашборд';

const EMAIL_EVENTS_SHEET = 'Email события';

// ===== WEB APP ENDPOINT =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Route: email tracking event from Resend webhook
    if (data._type === 'email_event') {
      const row = writeEmailEvent(data);
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, type: 'email_event', row }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Route: inbound email
    if (data._type === 'inbound_email') {
      const row = writeInboundEmail(data);
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true, type: 'inbound_email', row }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // Route: regular lead
    const row = writeLeadRow(data);
    updateDashboard();
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, row }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ===== EMAIL СОБЫТИЯ (Resend webhooks) =====
function writeEmailEvent(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(EMAIL_EVENTS_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(EMAIL_EVENTS_SHEET);
    const headers = ['Дата', 'Время', 'Событие', 'Email', 'Email ID', 'Ссылка клика', 'Raw timestamp'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 160);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 220);
    sheet.setColumnWidth(6, 300);
  }

  const now = new Date();
  const row = [
    Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy'),
    Utilities.formatDate(now, 'Europe/Moscow', 'HH:mm:ss'),
    data.label || data.event || '',
    data.to || '',
    data.emailId || '',
    data.clickUrl || '',
    data.timestamp || '',
  ];

  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);

  // Color-code by event type
  const newRow = lastRow + 1;
  const colors = {
    'email.opened': '#eff6ff',   // blue tint
    'email.clicked': '#f0fdf4',  // green tint
    'email.bounced': '#fef2f2',  // red tint
    'email.complained': '#fefce8', // yellow tint
  };
  const bg = colors[data.event] || '#ffffff';
  sheet.getRange(newRow, 1, 1, row.length).setBackground(bg);

  return newRow;
}

// ===== ВХОДЯЩИЕ ПИСЬМА =====
const INBOX_SHEET = 'Входящие письма';

function writeInboundEmail(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(INBOX_SHEET);

  if (!sheet) {
    sheet = ss.insertSheet(INBOX_SHEET);
    const headers = ['Дата', 'Время', 'От', 'Кому', 'Тема', 'Текст (превью)', 'Вложения', 'Статус'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 100);
    sheet.setColumnWidth(2, 80);
    sheet.setColumnWidth(3, 200);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 300);
    sheet.setColumnWidth(6, 400);
    sheet.setColumnWidth(7, 80);
    sheet.setColumnWidth(8, 120);

    // Статус валидация
    const statuses = ['Новое', 'Прочитано', 'Отвечено', 'Спам'];
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(statuses, true)
      .setAllowInvalid(false)
      .build();
    sheet.getRange(2, 8, 1000, 1).setDataValidation(rule);
  }

  const now = new Date();
  const row = [
    Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy'),
    Utilities.formatDate(now, 'Europe/Moscow', 'HH:mm:ss'),
    data.from || '',
    data.to || '',
    data.subject || '',
    data.bodyPreview || '',
    data.attachmentsCount || 0,
    data.status || 'Новое',
  ];

  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);
  sheet.getRange(lastRow + 1, 1, 1, row.length).setBackground('#eff6ff');

  return lastRow + 1;
}

// ===== ЗАПИСЬ ЛИДА =====
function writeLeadRow(data) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName(LEADS_SHEET);

  // Создаём лист с заголовками, если нет
  if (!sheet) {
    sheet = ss.insertSheet(LEADS_SHEET);
    const headers = [
      'Дата', 'Время', 'Тариф', 'Имя', 'Компания', 'Сфера',
      'Телефон', 'Telegram', 'Email', 'Сайт', 'Сообщение',
      'Deep Link', 'Email ID', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_content', 'utm_term', 'Referrer', 'Страница',
      'Статус', 'Комментарий менеджера', 'Сумма сделки'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Стили заголовков
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a1a2e').setFontColor('#ffffff').setFontWeight('bold');
    sheet.setFrozenRows(1);

    // Ширина колонок
    sheet.setColumnWidth(1, 100);  // Дата
    sheet.setColumnWidth(2, 80);   // Время
    sheet.setColumnWidth(3, 160);  // Тариф
    sheet.setColumnWidth(4, 140);  // Имя
    sheet.setColumnWidth(21, 120); // Статус
    sheet.setColumnWidth(22, 250); // Комментарий
    sheet.setColumnWidth(23, 120); // Сумма

    // Выпадающий список для статуса
    setupStatusValidation(sheet);
  }

  const utm = data.utm || {};
  const now = new Date();
  const row = [
    Utilities.formatDate(now, 'Europe/Moscow', 'dd.MM.yyyy'),
    Utilities.formatDate(now, 'Europe/Moscow', 'HH:mm:ss'),
    data.package || '',
    data.name || '',
    data.company || '',
    data.industry || '',
    data.phone || '',
    data.telegram || '',
    data.email || '',
    data.site || '',
    data.message || '',
    data.deepLink || '',
    data.emailId || '',
    utm.utm_source || '',
    utm.utm_medium || '',
    utm.utm_campaign || '',
    utm.utm_content || '',
    utm.utm_term || '',
    data.referrer || '',
    data.page || '',
    'Новый',        // Статус по умолчанию
    '',             // Комментарий
    ''              // Сумма
  ];

  const lastRow = Math.max(sheet.getLastRow(), 1);
  sheet.getRange(lastRow + 1, 1, 1, row.length).setValues([row]);

  // Подсветка нового лида
  const newRowRange = sheet.getRange(lastRow + 1, 1, 1, row.length);
  newRowRange.setBackground('#f0fdf4');

  return lastRow + 1;
}

// ===== ВАЛИДАЦИЯ СТАТУСА =====
function setupStatusValidation(sheet) {
  const statuses = ['Новый', 'В работе', 'Переговоры', 'Счёт выставлен', 'Оплачен', 'Отказ', 'Отложен'];
  // Применяем на 1000 строк вперёд
  const statusCol = 21;
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(statuses, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, statusCol, 1000, 1).setDataValidation(rule);
}

// ===== ДАШБОРД =====
function updateDashboard() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let dash = ss.getSheetByName(DASHBOARD_SHEET);

  if (!dash) {
    dash = ss.insertSheet(DASHBOARD_SHEET);
    dash.getRange('A1').setValue('Дашборд обновляется автоматически при каждом новом лиде');
    dash.getRange('A1').setFontWeight('bold').setFontSize(12);
  }

  const leads = ss.getSheetByName(LEADS_SHEET);
  if (!leads || leads.getLastRow() < 2) return;

  const data = leads.getRange(2, 1, leads.getLastRow() - 1, 23).getValues();
  const total = data.length;

  // Считаем статистику
  const byStatus = {};
  const byPackage = {};
  const bySource = {};
  const byDay = {};
  let totalRevenue = 0;

  data.forEach(row => {
    const pkg = row[2] || 'Не указан';
    const source = row[13] || 'Прямой';
    const status = row[20] || 'Новый';
    const date = row[0];
    const revenue = parseFloat(row[22]) || 0;

    byStatus[status] = (byStatus[status] || 0) + 1;
    byPackage[pkg] = (byPackage[pkg] || 0) + 1;
    bySource[source] = (bySource[source] || 0) + 1;
    byDay[date] = (byDay[date] || 0) + 1;
    totalRevenue += revenue;
  });

  const paid = byStatus['Оплачен'] || 0;
  const conversionRate = total > 0 ? ((paid / total) * 100).toFixed(1) : '0';

  // Очищаем дашборд
  dash.clear();

  // Заголовок
  dash.getRange('A1').setValue('CRM Дашборд — СайтЧИСТ').setFontWeight('bold').setFontSize(14).setFontColor('#1a1a2e');
  dash.getRange('A2').setValue('Обновлено: ' + Utilities.formatDate(new Date(), 'Europe/Moscow', 'dd.MM.yyyy HH:mm'));

  // KPI блок
  const kpiRow = 4;
  const kpis = [
    ['Всего лидов', total],
    ['Оплачено', paid],
    ['Конверсия', conversionRate + '%'],
    ['Выручка', totalRevenue.toLocaleString('ru-RU') + ' ₽'],
  ];

  dash.getRange(kpiRow, 1).setValue('КЛЮЧЕВЫЕ МЕТРИКИ').setFontWeight('bold').setFontSize(11);
  kpis.forEach((kpi, i) => {
    dash.getRange(kpiRow + 1, i * 2 + 1).setValue(kpi[0]).setFontColor('#666');
    dash.getRange(kpiRow + 2, i * 2 + 1).setValue(kpi[1]).setFontWeight('bold').setFontSize(16).setFontColor('#f97316');
  });

  // По статусам
  let row = kpiRow + 5;
  dash.getRange(row, 1).setValue('ПО СТАТУСАМ').setFontWeight('bold').setFontSize(11);
  row++;
  dash.getRange(row, 1).setValue('Статус').setFontWeight('bold');
  dash.getRange(row, 2).setValue('Кол-во').setFontWeight('bold');
  dash.getRange(row, 3).setValue('Доля').setFontWeight('bold');
  row++;
  Object.entries(byStatus).sort((a, b) => b[1] - a[1]).forEach(([status, count]) => {
    dash.getRange(row, 1).setValue(status);
    dash.getRange(row, 2).setValue(count);
    dash.getRange(row, 3).setValue(((count / total) * 100).toFixed(1) + '%');
    row++;
  });

  // По тарифам
  row += 1;
  dash.getRange(row, 1).setValue('ПО ТАРИФАМ').setFontWeight('bold').setFontSize(11);
  row++;
  dash.getRange(row, 1).setValue('Тариф').setFontWeight('bold');
  dash.getRange(row, 2).setValue('Кол-во').setFontWeight('bold');
  row++;
  Object.entries(byPackage).sort((a, b) => b[1] - a[1]).forEach(([pkg, count]) => {
    dash.getRange(row, 1).setValue(pkg);
    dash.getRange(row, 2).setValue(count);
    row++;
  });

  // По источникам
  row += 1;
  dash.getRange(row, 1).setValue('ПО ИСТОЧНИКАМ (utm_source)').setFontWeight('bold').setFontSize(11);
  row++;
  dash.getRange(row, 1).setValue('Источник').setFontWeight('bold');
  dash.getRange(row, 2).setValue('Кол-во').setFontWeight('bold');
  row++;
  Object.entries(bySource).sort((a, b) => b[1] - a[1]).forEach(([src, count]) => {
    dash.getRange(row, 1).setValue(src);
    dash.getRange(row, 2).setValue(count);
    row++;
  });

  // По дням (последние 14)
  row += 1;
  dash.getRange(row, 1).setValue('ЛИДЫ ПО ДНЯМ (последние 14)').setFontWeight('bold').setFontSize(11);
  row++;
  dash.getRange(row, 1).setValue('Дата').setFontWeight('bold');
  dash.getRange(row, 2).setValue('Кол-во').setFontWeight('bold');
  row++;
  const sortedDays = Object.entries(byDay).sort().slice(-14);
  sortedDays.forEach(([date, count]) => {
    dash.getRange(row, 1).setValue(date);
    dash.getRange(row, 2).setValue(count);
    row++;
  });

  // Email-аналитика
  const emailSheet = ss.getSheetByName(EMAIL_EVENTS_SHEET);
  if (emailSheet && emailSheet.getLastRow() > 1) {
    const emailData = emailSheet.getRange(2, 1, emailSheet.getLastRow() - 1, 7).getValues();
    const emailStats = {};
    emailData.forEach(r => {
      const evt = r[2] || 'unknown';
      emailStats[evt] = (emailStats[evt] || 0) + 1;
    });

    row += 1;
    dash.getRange(row, 1).setValue('EMAIL TRACKING (Resend)').setFontWeight('bold').setFontSize(11);
    row++;
    dash.getRange(row, 1).setValue('Событие').setFontWeight('bold');
    dash.getRange(row, 2).setValue('Кол-во').setFontWeight('bold');
    row++;
    Object.entries(emailStats).sort((a, b) => b[1] - a[1]).forEach(([evt, count]) => {
      dash.getRange(row, 1).setValue(evt);
      dash.getRange(row, 2).setValue(count);
      row++;
    });
  }

  // Ширина колонок
  dash.setColumnWidth(1, 200);
  dash.setColumnWidth(2, 120);
  dash.setColumnWidth(3, 100);
}

// ===== ТРИГГЕР: автообновление дашборда при ручном редактировании =====
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() === LEADS_SHEET) {
    updateDashboard();
  }
}

// ===== РУЧНОЙ ЗАПУСК: создать структуру таблицы =====
function setupSheets() {
  writeLeadRow({
    package: 'Тестовый лид',
    name: 'Тест',
    company: 'Тестовая компания',
    industry: 'IT',
    phone: '+70000000000',
    telegram: '@test',
    site: 'https://example.com',
    message: 'Тестовое сообщение',
    deepLink: 'https://t.me/WebAuditRuBot?start=free_audit__razvedka',
    utm: { utm_source: 'test', utm_medium: 'test' },
    referrer: 'https://test.com',
    page: 'https://webaudit.ru/?utm_source=test',
  });
  updateDashboard();
}
