import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

interface PricingProps {
  onOpenLead: (pkg: string) => void;
}

export default function Pricing({ onOpenLead }: PricingProps) {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center">
        {/* P1 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="frosted p-10 md:p-12 flex flex-col border-white/5 rounded-[3rem] opacity-90 hover:opacity-100 transition-opacity"
        >
          <h3 className="font-heading font-black text-2xl md:text-3xl mb-4 uppercase tracking-tighter text-slate-300">Разведка</h3>
          <p className="text-4xl md:text-5xl font-black text-orange-500 mb-10 tracking-tighter">25 000 ₽</p>
          <ul className="space-y-6 text-base text-slate-400 mb-12 flex-grow">
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Чек-ап 32 пункта</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> Карта рисков</li>
            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500" /> PDF-отчет</li>
          </ul>
          <button 
            onClick={() => onOpenLead('Разведка')}
            className="w-full py-5 border border-slate-700 hover:border-orange-500 hover:text-orange-500 rounded-[2rem] text-center font-black text-xs uppercase tracking-widest text-white transition-colors"
          >
            ЗАКАЗАТЬ АУДИТ
          </button>
        </motion.div>

        {/* P2 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="frosted p-10 md:p-12 flex flex-col border-orange-500 bg-slate-900 shadow-2xl scale-100 lg:scale-105 relative overflow-hidden rounded-[3rem] z-10"
        >
          <div className="absolute top-8 right-[-50px] rotate-45 bg-orange-600 px-20 py-3 text-[10px] font-black uppercase text-white shadow-xl tracking-widest">
            Выбор 80%
          </div>
          <h3 className="font-heading font-black text-3xl md:text-4xl mb-4 uppercase tracking-tighter text-white">Броня</h3>
          <p className="text-5xl md:text-6xl font-black text-orange-500 mb-12 tracking-tighter">90 000 ₽</p>
          <ul className="space-y-6 text-base md:text-lg text-slate-200 mb-12 flex-grow">
            <li className="flex items-center gap-4"><span className="text-2xl">🚀</span> Правки "под ключ"</li>
            <li className="flex items-center gap-4"><span className="text-2xl">📜</span> Мониторинг 3 мес.</li>
            <li className="flex items-center gap-4"><span className="text-2xl">🛡️</span> Сертификат DS</li>
          </ul>
          <button 
            onClick={() => onOpenLead('Броня')}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white py-6 md:py-8 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-orange-600/20 transition-all active:scale-95"
          >
            ВЗЯТЬ ПОД ЗАЩИТУ
          </button>
        </motion.div>

        {/* P3 */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
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
            onClick={() => onOpenLead('Проект')}
            className="w-full py-5 border border-slate-700 hover:border-orange-500 hover:text-orange-500 rounded-[2rem] text-center font-black text-xs uppercase tracking-widest text-white transition-colors"
          >
            ПОЛУЧИТЬ ПЛАН
          </button>
        </motion.div>
      </div>

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
      </motion.div>
    </section>
  );
}
