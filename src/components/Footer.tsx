import React from 'react';
import { motion } from 'motion/react';
import { reachGoal } from '../metrika';

export default function Footer() {
  return (
    <footer className="py-24 md:py-40 border-t border-white/5 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-16 md:gap-32 justify-between items-center text-center lg:text-left relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <h2 className="text-6xl md:text-[8rem] font-heading font-black uppercase tracking-tighter leading-[0.8] mb-10">
            Сайт <br /> <span className="text-orange-500 font-black">Чист.</span>
          </h2>
          <div className="space-y-4">
            <p className="text-2xl md:text-4xl font-black tracking-widest uppercase text-white">Денис Солдатов</p>
            <p className="text-slate-500 text-xl md:text-2xl font-medium tracking-widest">+7 925 148 5560</p>
            <a 
              href="https://t.me/WebAuditRuBot?start=contact__footer"
              target="_blank"
              rel="noreferrer"
              onClick={() => reachGoal('telegram_click', { source: 'footer' })}
              className="text-orange-500 font-black uppercase text-xl md:text-3xl border-b-8 border-orange-500/20 pb-4 hover:border-orange-500 transition-all duration-500 inline-block"
            >
              @WebAuditRuBot
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-10 md:gap-16"
        >
          <div className="p-6 md:p-10 bg-white rounded-[4rem] md:rounded-[5rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <img 
              src="https://storage.googleapis.com/uspeshnyy-projects/webaudit/qr.jpg" 
              alt="QR" 
              className="w-48 h-48 md:w-64 md:h-64 rounded-[2rem] md:rounded-[3rem]"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
          </div>
          <p className="text-[10px] md:text-[12px] uppercase font-black text-slate-700 tracking-[0.7em]">
            © 2026 Soldatov Law & Tech
          </p>
        </motion.div>
      </div>

      {/* Legal info */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-16 pt-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between gap-8 text-center md:text-left">
          <div className="space-y-2 text-[11px] text-slate-600 leading-relaxed">
            <p className="text-slate-500 font-bold">ИП Солдатов Денис Алексеевич</p>
            <p>ИНН: 770412389456 &nbsp;|&nbsp; ОГРНИП: 324774600298451</p>
            <p>119019, г. Москва, ул. Новый Арбат, д. 15, оф. 401</p>
            <p>soldatov@sitechist.ru</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center text-[11px]">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
              className="text-slate-500 hover:text-orange-500 transition-colors underline underline-offset-2"
            >
              Политика конфиденциальности
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))}
              className="text-slate-500 hover:text-orange-500 transition-colors underline underline-offset-2"
            >
              Согласие на обработку ПДн
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
