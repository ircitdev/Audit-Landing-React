import {
  Scale, CheckCircle, Cookie, Building, Phone, ScrollText, Ban, AlertTriangle,
  Globe, Search, AlertOctagon, FileText, Lock, RefreshCw, Settings, Eye, Zap,
  Image as ImageIcon, Package, Rocket, Smartphone, Link, TrendingUp, Hash,
  Bot, BarChart
} from 'lucide-react';
import { AuditPoint } from './types';

export const AUDIT_DATA: Record<number, AuditPoint> = {
  1: { id: 1, title: "Политика конфиденциальности", article: "152-ФЗ, ст. 18.1", fine: "до 100 000 ₽", text: "Проверяем наличие документа со ссылкой из подвала или форм.", icon: Scale },
  2: { id: 2, title: "Согласие на ПДн", article: "152-ФЗ, ст. 9", fine: "до 150 000 ₽", text: "Проверка чекбокса согласия во всех формах сбора ПДн.", icon: CheckCircle },
  3: { id: 3, title: "Cookie-баннер", article: "152-ФЗ, ст. 6", fine: "до 100 000 ₽", text: "Наличие уведомления об использовании cookies с кнопкой принятия.", icon: Cookie },
  4: { id: 4, title: "Реквизиты юрлица", article: "ГК РФ ст. 54", fine: "до 30 000 ₽", text: "ИНН, ОГРН и полное наименование должны быть на сайте.", icon: Building },
  5: { id: 5, title: "Контактные данные", article: "ЗоЗПП ст. 26.1", fine: "до 40 000 ₽", text: "Наличие адреса, телефона и email на видном месте.", icon: Phone },
  6: { id: 6, title: "Лицензии/Допуски", article: "99-ФЗ", fine: "до 500 000 ₽", text: "Обязательно для лицензируемых видов деятельности.", icon: ScrollText },
  7: { id: 7, title: "SSL-сертификат", article: "Безопасность", risk: "Взлом", text: "Проверка HTTPS соединения и валидности сертификата.", icon: Lock },
  8: { id: 8, title: "HTTP -> HTTPS", article: "Безопасность", risk: "Перехват", text: "Настройка редиректов на защищенный протокол.", icon: RefreshCw },
  9: { id: 9, title: "Защита от спама", article: "Безопасность", risk: "DDoS", text: "Установка капчи и защиты форм от ботов.", icon: Ban },
  10: { id: 10, title: "Актуальность CMS", article: "Безопасность", risk: "Уязвимости", text: "Обновление ядра и плагинов до последних версий.", icon: Settings },
  11: { id: 11, title: "Скрыта версия CMS", article: "Безопасность", risk: "Взлом", text: "Удаление мета-тегов с версией системы.", icon: Eye },
  12: { id: 12, title: "Заголовки (CSP)", article: "Безопасность", risk: "XSS", text: "Настройка Content Security Policy.", icon: Globe },
  13: { id: 13, title: "Загрузка < 3 сек", article: "Скорость", risk: "Отказы", text: "Оптимизация времени ответа сервера и рендеринга.", icon: Zap },
  14: { id: 14, title: "Сжатие изображений", article: "Скорость", risk: "Отказы", text: "Конвертация в WebP/AVIF и настройка lazy load.", icon: ImageIcon },
  15: { id: 15, title: "Минификация кода", article: "Скорость", risk: "Отказы", text: "Сжатие HTML, CSS и JS файлов.", icon: Package },
  16: { id: 16, title: "Кэширование", article: "Скорость", risk: "Отказы", text: "Настройка браузерного и серверного кэша.", icon: Rocket },
  17: { id: 17, title: "Адаптивность", article: "UX/UI", risk: "Отказы", text: "Корректное отображение на мобильных устройствах.", icon: Smartphone },
  18: { id: 18, title: "Чистка 404", article: "SEO", risk: "Пессимизация", text: "Поиск и устранение битых ссылок.", icon: Link },
  19: { id: 19, title: "Meta Tags", article: "SEO", risk: "Пессимизация", text: "Оптимизация Title, Description и Open Graph.", icon: TrendingUp },
  20: { id: 20, title: "Hierarchy H1-H3", article: "SEO", risk: "Пессимизация", text: "Правильная структура заголовков на странице.", icon: Hash },
  21: { id: 21, title: "Alt-теги фото", article: "SEO", risk: "Пессимизация", text: "Прописывание альтернативного текста для изображений.", icon: ImageIcon },
  22: { id: 22, title: "Robots & Sitemap", article: "SEO", risk: "Индексация", text: "Настройка файлов для поисковых роботов.", icon: Bot },
  23: { id: 23, title: "Микроразметка", article: "SEO", risk: "Сниппеты", text: "Внедрение Schema.org для улучшения сниппетов.", icon: Search },
  24: { id: 24, title: "Аналитика", article: "Маркетинг", risk: "Слепота", text: "Настройка Яндекс.Метрики и Google Analytics.", icon: BarChart },
  25: { id: 25, title: "Символика Meta*", article: "КоАП 20.3", punishment: "АРЕСТ", text: "Логотипы Instagram/FB — основание для ареста до 15 суток.", icon: Ban },
  26: { id: 26, title: "Twitter/X", article: "Блокировка", risk: "Штраф", text: "Удаление ссылок на заблокированные ресурсы.", icon: AlertTriangle },
  27: { id: 27, title: "LinkedIn", article: "Блокировка", risk: "Штраф", text: "Удаление ссылок на заблокированные ресурсы.", icon: AlertTriangle },
  28: { id: 28, title: "Маркировка контента", article: "Закон о рекламе", fine: "до 500 000 ₽", text: "Проверка наличия токенов (erid) на рекламных материалах.", icon: AlertOctagon },
  29: { id: 29, title: "Оферта", article: "ГК РФ", risk: "Суды", text: "Наличие публичной оферты при продаже товаров/услуг.", icon: FileText },
  30: { id: 30, title: "WhatsApp*", article: "ФЗ №41", fine: "до 6 млн ₽", text: "Ограничения на использование иностранных мессенджеров.", icon: Ban },
  31: { id: 31, title: "Foreign Forms", article: "ФЗ №41", fine: "6 млн ₽", text: "Запрет передачи ПДн на Google Forms и иностранные чаты.", icon: Globe },
  32: { id: 32, title: "Трекеры ПДн", article: "152-ФЗ", fine: "до 100 000 ₽", text: "Анализ сторонних скриптов, собирающих данные пользователей.", icon: Search }
};
