import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { AuditPoint } from '../types';

interface ModalsProps {
  isLeadOpen: boolean;
  leadPackage: string;
  onCloseLead: () => void;
  selectedPoint: AuditPoint | null;
  onClosePoint: () => void;
}

const API_TOKEN = '8628600595AAFmkPAeCe16M9rWqVRoWpJ1rrW-POqiFek';
const CHAT_ID = '-1003889865771';

export default function Modals({ isLeadOpen, leadPackage, onCloseLead, selectedPoint, onClosePoint }: ModalsProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    const msg = `🚀 НОВЫЙ ЛИД: ${leadPackage}\n👤: ${data.name}\n🏢: ${data.company}\n💼: ${data.industry}\n📞: ${data.phone}\n📱: ${data.telegram}\n🌐: ${data.site}\n✉️: ${data.message}`;

    try {
      const response = await fetch(`https://api.telegram.org/bot${API_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
      });
      
      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          setStatus('idle');
          onCloseLead();
        }, 3000);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <AnimatePresence>
      {/* Lead Modal */}
      {isLeadOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onCloseLead}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="frosted relative w-full max-w-xl p-6 md:p-10 rounded-[2rem] border border-orange-500/30 shadow-2xl z-10"
          >
            <button 
              onClick={onCloseLead} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <h3 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tighter mb-8 text-center text-white">
              {leadPackage || 'Заявка'}
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" type="text" placeholder="Имя" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
              <input name="company" type="text" placeholder="Компания" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
              <input name="industry" type="text" placeholder="Сфера деятельности" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
              <input name="phone" type="tel" placeholder="Телефон" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
              <input name="telegram" type="text" placeholder="TG @" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
              <input name="site" type="url" placeholder="Сайт" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
              <textarea name="message" rows={3} placeholder="Ваш вопрос" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"></textarea>
              
              <label className="md:col-span-2 flex items-start gap-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500 shrink-0 accent-orange-500"
                />
                <span className="text-xs text-slate-400 leading-relaxed">
                  Даю согласие на{' '}
                  <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))} className="text-orange-500 hover:text-orange-400 underline underline-offset-2">
                    обработку персональных данных
                  </button>
                  {' '}в соответствии с Федеральным законом № 152-ФЗ
                </span>
              </label>

              <button
                type="submit"
                disabled={status === 'loading' || status === 'success' || !consent}
                className="md:col-span-2 bg-orange-600 hover:bg-orange-500 py-5 rounded-xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-orange-600/20 text-white disabled:opacity-50 mt-2"
              >
                {status === 'loading' ? 'ОТПРАВКА...' : status === 'success' ? 'ОТПРАВЛЕНО' : 'ОТПРАВИТЬ'}
              </button>
              
              {status === 'success' && (
                <p className="md:col-span-2 text-center font-black mt-2 text-[10px] uppercase text-emerald-500">
                  УСПЕШНО! МЫ СВЯЖЕМСЯ.
                </p>
              )}
              {status === 'error' && (
                <p className="md:col-span-2 text-center font-black mt-2 text-[10px] uppercase text-red-500">
                  ОШИБКА. ПОПРОБУЙТЕ ПОЗЖЕ.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedPoint && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            onClick={onClosePoint}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="frosted p-8 md:p-12 w-full max-w-2xl border-sky-500/30 shadow-2xl relative rounded-[2.5rem] md:rounded-[3rem] z-10"
          >
            <button 
              onClick={onClosePoint} 
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="space-y-6 md:space-y-8 mt-4">
              <h3 className="text-2xl md:text-4xl font-heading font-black uppercase text-sky-400 leading-tight">
                {selectedPoint.id}. {selectedPoint.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 frosted rounded-2xl border border-white/10">
                  <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">Статья / Группа</p>
                  <p className="text-sm font-bold text-white">{selectedPoint.article || 'Общий регламент'}</p>
                </div>
                <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/20">
                  <p className="text-[10px] uppercase font-bold text-red-500 mb-2 tracking-wider">Санкция / Риск</p>
                  <p className="text-sm font-black text-red-400 uppercase">
                    {selectedPoint.fine || selectedPoint.punishment || selectedPoint.risk || 'Высокий'}
                  </p>
                </div>
              </div>
              <p className="text-slate-300 text-lg leading-relaxed font-light">
                {selectedPoint.text}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
