import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';
import { reachGoal } from '../metrika';

interface PricingProps {
  onOpenLead: (pkg: string) => void;
}

export default function Pricing({ onOpenLead }: PricingProps) {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div className="flex flex-col gap-8 md:gap-12">
        {/* P1 - Разведка (Full Width Premium) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 p-10 md:p-16 lg:p-20 flex flex-col md:flex-row items-start md:items-center justify-between rounded-[3rem] shadow-[0_20px_50px_rgba(255,255,255,0.05)] border border-white/40 text-slate-900 relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="mb-10 md:mb-0 md:mr-12 flex-1 relative z-10">
            <div className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 font-bold text-[10px] uppercase tracking-widest rounded-full mb-6 border border-orange-200">Базовый аудит</div>
            <h3 className="font-heading font-black text-4xl md:text-5xl mb-4 uppercase tracking-tighter text-slate-900">Разведка</h3>
            <p className="text-5xl md:text-6xl font-black text-orange-600 tracking-tighter">25 000 ₽</p>
          </div>
          
          <ul className="space-y-5 text-lg text-slate-700 mb-10 md:mb-0 flex-1 font-medium relative z-10">
            <li className="flex items-center gap-4"><Check className="w-6 h-6 text-emerald-500 shrink-0" /> Чек-ап 32 пункта</li>
            <li className="flex items-center gap-4"><Check className="w-6 h-6 text-emerald-500 shrink-0" /> Карта рисков</li>
            <li className="flex items-center gap-4"><Check className="w-6 h-6 text-emerald-500 shrink-0" /> PDF-отчет</li>
          </ul>
          
          <div className="w-full md:w-auto flex-1 flex justify-end relative z-10">
            <button
              onClick={() => { reachGoal('lead_form_open', { package: 'razvedka' }); onOpenLead('Разведка — 25 000 ₽'); }}
              className="w-full md:w-auto px-10 py-6 bg-slate-900 hover:bg-slate-800 text-white rounded-[2rem] text-center font-black text-sm uppercase tracking-widest transition-all shadow-2xl hover:shadow-orange-500/20 hover:-translate-y-1"
            >
              ЗАКАЗАТЬ ЗАЩИТУ
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center mt-4">
          {/* P2 — Проект (45к) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="frosted p-10 md:p-12 flex flex-col border-white/5 rounded-[3rem] opacity-90 hover:opacity-100 transition-opacity"
          >
            <h3 className="font-heading font-black text-2xl md:text-3xl mb-4 uppercase tracking-tighter text-slate-300">Проект</h3>
            <p className="text-4xl md:text-5xl font-black text-orange-500 mb-10 tracking-tighter">45 000 ₽</p>
            <ul className="space-y-6 text-base text-slate-400 mb-12 flex-grow">
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> ТЗ для техников</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Юр. документы</li>
              <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Скрипты внедрения</li>
            </ul>
            <button
              onClick={() => { reachGoal('lead_form_open', { package: 'proekt' }); onOpenLead('Проект — 45 000 ₽'); }}
              className="w-full py-5 border border-slate-700 hover:border-orange-500 hover:text-orange-500 rounded-[2rem] text-center font-black text-xs uppercase tracking-widest text-white transition-colors"
            >
              ЗАКАЗАТЬ ЗАЩИТУ
            </button>
          </motion.div>

          {/* P3 — Броня (90к, выбор 80%) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="frosted p-10 md:p-12 flex flex-col border-orange-500 bg-slate-900 shadow-2xl relative overflow-hidden rounded-[3rem] z-10"
          >
            <div className="absolute top-8 right-[-50px] rotate-45 bg-orange-600 px-20 py-3 text-[10px] font-black uppercase text-white shadow-xl tracking-widest">
              Выбор 80%
            </div>
            <h3 className="font-heading font-black text-3xl md:text-4xl mb-4 uppercase tracking-tighter text-white">Полная Броня</h3>
            <p className="text-5xl md:text-6xl font-black text-orange-500 mb-12 tracking-tighter">90 000 ₽</p>
            <ul className="space-y-6 text-base md:text-lg text-slate-200 mb-12 flex-grow">
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-orange-500 shrink-0" /> Правки «под ключ»</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-orange-500 shrink-0" /> Мониторинг 3 мес.</li>
              <li className="flex items-center gap-4"><Check className="w-6 h-6 text-orange-500 shrink-0" /> Сертификат DS-CERT</li>
            </ul>
            <button
              onClick={() => { reachGoal('lead_form_open', { package: 'bronya' }); onOpenLead('Броня'); }}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white py-6 md:py-8 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-600/20 transition-all active:scale-95"
            >
              ЗАКАЗАТЬ ЗАЩИТУ
            </button>
          </motion.div>
        </div>
      </div>

      {/* Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mt-16 frosted p-8 md:p-10 rounded-[2rem] border-emerald-500/20 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-3xl">🛡️</span>
          <h4 className="font-heading font-black text-xl uppercase tracking-tight text-white">Гарантия результата</h4>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-xl mx-auto">
          Если после нашей работы придёт претензия от Роскомнадзора — <span className="text-emerald-400 font-bold">Денис лично защитит вас в суде бесплатно</span>.
          Ответственность зафиксирована в договоре. Единственный эксперт, который подписывается под результатом.
        </p>
      </motion.div>

      {/* Final Result */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto mt-32 text-center"
      >
        <h2 className="text-4xl md:text-7xl font-heading font-black uppercase mb-16 md:mb-20 tracking-tighter leading-tight">
          Ваш DS-CERT
        </h2>
        <div className="group relative inline-block">
          <img 
            src="https://storage.googleapis.com/uspeshnyy-projects/webaudit/sert.jpg" 
            alt="Сертификат" 
            className="w-full max-w-2xl mx-auto rounded-[3rem] shadow-2xl border border-white/10"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-[3rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] pointer-events-none"></div>
        </div>
        <p className="text-slate-400 text-sm mt-8 max-w-xl mx-auto leading-relaxed">
          DS-CERT — сертификат соответствия сайта требованиям 152-ФЗ, технической безопасности и маркетинговых стандартов. Выдаётся после полного аудита по 32 пунктам. Документ для клиентов и контролирующих органов.
        </p>
      </motion.div>
    </section>
  );
}
