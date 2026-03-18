import React from 'react';
import { Shield } from 'lucide-react';
import { reachGoal } from '../metrika';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Shield className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
          <span className="font-heading font-black tracking-tighter uppercase text-xl text-white">
            Сайт<span className="text-orange-500">ЧИСТ!</span>
          </span>
        </div>
        <div className="hidden lg:flex gap-8 text-sm font-bold uppercase tracking-wider">
          <a href="#audit" className="text-slate-300 hover:text-orange-500 transition-colors">32 Пункта</a>
          <a href="#marketing" className="text-slate-300 hover:text-orange-500 transition-colors">Маркетинг</a>
          <a href="#download" className="text-slate-300 hover:text-orange-500 transition-colors">Презентация</a>
          <a href="#pricing" className="text-slate-300 hover:text-orange-500 transition-colors">Тарифы</a>
        </div>
        <a
          href="https://t.me/WebAuditRuBot?start=sos_audit__navbar"
          onClick={() => reachGoal('telegram_click', { source: 'navbar' })}
          target="_blank"
          rel="noreferrer"
          className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-orange-600/20 text-white transition-all active:scale-95"
        >
          SOS АУДИТ
        </a>
      </div>
    </motion.nav>
  );
}
