import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Target, Gem, Handshake, ShieldAlert, MousePointerClick, Timer, UserCheck, Flame, Map, VolumeX, FileWarning, HelpCircle, RouteOff, FormInput, Hourglass, X } from 'lucide-react';

const pressurePoints = [
  { title: 'Чёткий оффер', text: 'Есть ли конкретное предложение на первом экране? Понятно ли, что получит клиент?', icon: Target },
  { title: 'Раскрыта выгода', text: 'Говорит ли сайт о результате для клиента, а не о себе?', icon: Gem },
  { title: 'Доказательства', text: 'Есть ли кейсы, отзывы, цифры, логотипы клиентов, сертификаты?', icon: Handshake },
  { title: 'Обработка возражений', text: 'Сняты ли типичные страхи: цена, сроки, гарантии, «а что если не подойдёт»?', icon: ShieldAlert },
  { title: 'Точки CTA', text: 'Достаточно ли кнопок действия? Расположены ли они в правильных местах?', icon: MousePointerClick },
];

const clarityPoints = [
  { title: 'Понятно за 5 секунд', text: 'Может ли посетитель за 5 секунд понять, что продаётся и зачем ему это?', icon: Timer },
  { title: 'Целевой «герой»', text: 'Ясно ли, для кого этот продукт? Узнаёт ли себя целевая аудитория?', icon: UserCheck },
  { title: 'Сформулирована проблема', text: 'Описана ли боль клиента? Чувствует ли он, что сайт «про него»?', icon: Flame },
  { title: 'Простой план действий', text: 'Есть ли понятные шаги: «Оставьте заявку → Получите расчёт → Начнём работу»?', icon: Map },
  { title: 'Нет инфо-шума', text: 'Нет ли лишнего текста, отвлекающих элементов, конкурирующих CTA?', icon: VolumeX },
];

const conversionPoints = [
  { title: 'Размытый текст', text: 'Где текст размытый и не конкретный?', icon: FileWarning },
  { title: 'Отсутствие фактов', text: 'Где нет цифр, фактов, доказательств?', icon: HelpCircle },
  { title: 'Непонятный шаг', text: 'Где пользователь не понимает, что делать дальше?', icon: RouteOff },
  { title: 'Сложные формы', text: 'Где форма слишком длинная или спрятана?', icon: FormInput },
  { title: 'Нет срочности', text: 'Где нет срочности или ограниченности предложения?', icon: Hourglass },
];

export default function MarketingAudit() {
  const [activeTooltip, setActiveTooltip] = useState<{ title: string; text: string; colorClass: string } | null>(null);

  const renderPoint = (point: any, colorClass: string) => {
    const Icon = point.icon;
    return (
      <div
        key={point.title}
        className="group relative flex items-center gap-3 p-3.5 md:p-3 text-sm md:text-xs rounded-xl bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 transition-colors cursor-help min-h-[44px]"
        onClick={() => setActiveTooltip({ title: point.title, text: point.text, colorClass })}
      >
        <Icon className="w-5 h-5 md:w-4 md:h-4 opacity-70 shrink-0" />
        <span className="font-medium leading-snug">{point.title}</span>

        {/* Desktop tooltip — hover only */}
        <div className="hidden md:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none translate-y-2 group-hover:translate-y-0">
          <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50 relative">
            <p className={`font-bold mb-1.5 text-sm leading-tight ${colorClass}`}>{point.title}</p>
            <p className="text-slate-300 leading-relaxed text-xs whitespace-normal">{point.text}</p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900/95 border-b border-r border-slate-700/50 rotate-45"></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
    {/* Mobile tooltip overlay */}
    {activeTooltip && (
      <div
        className="md:hidden fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-6"
        onClick={() => setActiveTooltip(null)}
      >
        <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
          <div className="flex justify-between items-start mb-3">
            <p className={`font-bold text-base leading-tight ${activeTooltip.colorClass}`}>{activeTooltip.title}</p>
            <button onClick={() => setActiveTooltip(null)} className="text-slate-400 ml-3 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-sm">{activeTooltip.text}</p>
        </div>
      </div>
    )}
    <section id="marketing" className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-32 rounded-[2.5rem] md:rounded-[4rem] border border-white/10 overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-2xl shadow-sky-900/20">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem] md:rounded-[4rem]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] rotate-45" />
        </div>
        {/* Subtle noise/grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wMykiLz48L3N2Zz4=')] opacity-30" />
      </div>

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-24"
        >
          <div className="inline-block px-4 py-1.5 bg-sky-500/10 border border-sky-500/20 rounded-full text-sky-400 text-[10px] font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            Бонус
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter leading-none mb-6">
            Маркетинговый <br /> <span className="text-orange-500">аудит лендинга</span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-3xl mx-auto leading-relaxed">
            <strong className="text-slate-200">Проводится автоматически для типов сайта «Лендинг» и «Промо-сайт».</strong><br/><br/>
            Главная задача лендинга — <strong>продажи</strong>. Технический аудит проверяет, что сайт безопасен и соответствует закону. Маркетинговый аудит проверяет, что сайт <strong>продаёт</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4 text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">Фреймворк StoryBrand</span>
            <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">Архитектура прямого отклика</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          {/* Pressure Structure */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="frosted p-6 md:p-8 border-t-4 border-t-sky-500 rounded-[2rem] md:rounded-[2.5rem] flex flex-col bg-slate-900/50 backdrop-blur-md"
          >
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
              <motion.h3 
                whileHover={{ scale: 1.05, x: 5 }}
                className="font-heading font-black text-xl text-sky-400 uppercase cursor-default hover:text-sky-300 transition-colors origin-left"
              >
                I. Структура<br/>давления
              </motion.h3>
              <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20 whitespace-nowrap mt-1">0-10 БАЛЛОВ</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Анализ убедительности предложения и наличия необходимых триггеров доверия.</p>
            <div className="space-y-2 flex-grow">
              {pressurePoints.map(point => renderPoint(point, 'text-sky-400'))}
            </div>
          </motion.div>

          {/* Clarity */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="frosted p-6 md:p-8 border-t-4 border-t-blue-400 rounded-[2rem] md:rounded-[2.5rem] flex flex-col bg-slate-900/50 backdrop-blur-md"
          >
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
              <motion.h3 
                whileHover={{ scale: 1.05, x: 5 }}
                className="font-heading font-black text-xl text-blue-400 uppercase cursor-default hover:text-blue-300 transition-colors origin-left"
              >
                II. Ясность<br/>коммуникации
              </motion.h3>
              <span className="text-[10px] font-bold text-blue-300 bg-blue-400/10 px-2 py-1 rounded-lg border border-blue-400/20 whitespace-nowrap mt-1">0-10 БАЛЛОВ</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Оценка того, насколько быстро и легко пользователь понимает суть продукта.</p>
            <div className="space-y-2 flex-grow">
              {clarityPoints.map(point => renderPoint(point, 'text-blue-400'))}
            </div>
          </motion.div>

          {/* Conversion Loss */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="frosted p-6 md:p-8 border-t-4 border-t-indigo-400 rounded-[2rem] md:rounded-[2.5rem] flex flex-col bg-slate-900/50 backdrop-blur-md"
          >
            <div className="flex flex-wrap justify-between items-start gap-3 mb-6">
              <motion.h3 
                whileHover={{ scale: 1.05, x: 5 }}
                className="font-heading font-black text-xl text-indigo-400 uppercase cursor-default hover:text-indigo-300 transition-colors origin-left"
              >
                III. Потери<br/>конверсии
              </motion.h3>
              <span className="text-[10px] font-bold text-indigo-300 bg-indigo-400/10 px-2 py-1 rounded-lg border border-indigo-400/20 whitespace-nowrap mt-1">0-10 БАЛЛОВ</span>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">Поиск "дыр" в воронке, где пользователи уходят без целевого действия.</p>
            <div className="space-y-2 flex-grow">
              {conversionPoints.map(point => renderPoint(point, 'text-indigo-400'))}
            </div>
            <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-200 font-medium text-center">
              Даем рекомендации по исправлению
            </div>
          </motion.div>
        </div>

        {/* Scoring and Plan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="frosted p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/5 bg-slate-900/50 backdrop-blur-md"
          >
            <h4 className="font-heading font-black text-xl uppercase mb-6 md:mb-8 tracking-tighter">Общая оценка маркетинга (0–10)</h4>
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-2xl gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-emerald-400 font-bold whitespace-nowrap">8–10 Отличный</span>
                <span className="text-xs text-slate-400 sm:text-right">Лендинг работает как продающий инструмент. Нужна только тонкая настройка.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-2xl gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-sky-400 font-bold whitespace-nowrap">5–7 Средний</span>
                <span className="text-xs text-slate-400 sm:text-right">Есть база, но упущены важные элементы. Конверсия ниже потенциала на 30–50%.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-2xl gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-amber-400 font-bold whitespace-nowrap">2–4 Слабый</span>
                <span className="text-xs text-slate-400 sm:text-right">Серьёзные проблемы со структурой и коммуникацией. Сайт теряет большинство посетителей.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-2xl gap-2 border border-white/5 hover:bg-white/10 transition-colors">
                <span className="text-red-400 font-bold whitespace-nowrap">0–1 Критический</span>
                <span className="text-xs text-slate-400 sm:text-right">Лендинг не выполняет свою функцию. Требуется полная переработка.</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="frosted p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/5 bg-slate-900/50 backdrop-blur-md"
          >
            <h4 className="font-heading font-black text-xl uppercase mb-6 md:mb-8 tracking-tighter">IV. План улучшений</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-sm font-black uppercase text-sky-400 flex items-center gap-2">
                  <span className="text-xl">🤖</span> Решается автоматизацией / ИИ
                </p>
                <ul className="text-sm leading-relaxed text-slate-400 space-y-3">
                  <li className="flex items-start gap-2"><span className="text-sky-500/50">•</span> Переписать заголовки и офферы</li>
                  <li className="flex items-start gap-2"><span className="text-sky-500/50">•</span> Сгенерировать варианты CTA</li>
                  <li className="flex items-start gap-2"><span className="text-sky-500/50">•</span> Разработать наброски текстов для секций</li>
                  <li className="flex items-start gap-2"><span className="text-sky-500/50">•</span> Оптимизировать структуру страницы</li>
                </ul>
              </div>
              <div className="space-y-4">
                <p className="text-sm font-black uppercase text-amber-500 flex items-center gap-2">
                  <span className="text-xl">👤</span> Нужен специалист
                </p>
                <ul className="text-sm leading-relaxed text-slate-400 space-y-3">
                  <li className="flex items-start gap-2"><span className="text-amber-500/50">•</span> Провести фото/видеосъёмку</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500/50">•</span> Собрать реальные кейсы и отзывы</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500/50">•</span> Разработать уникальное торговое предложение</li>
                  <li className="flex items-start gap-2"><span className="text-amber-500/50">•</span> Создать дизайн-макеты</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
