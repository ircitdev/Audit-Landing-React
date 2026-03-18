import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { reachGoal } from '../metrika';
import { AuditPoint } from '../types';

interface ModalsProps {
  isLeadOpen: boolean;
  leadPackage: string;
  onCloseLead: () => void;
  selectedPoint: AuditPoint | null;
  onClosePoint: () => void;
}

const packageSlug = (pkg: string) => {
  if (pkg.includes('Разведка')) return 'razvedka';
  if (pkg.includes('Проект')) return 'proekt';
  if (pkg.includes('Броня')) return 'bronya';
  return 'general';
};

const getUtmParams = () => {
  const params = new URLSearchParams(window.location.search);
  const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  const utm: Record<string, string> = {};
  for (const key of utmKeys) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  return utm;
};

export default function Modals({ isLeadOpen, leadPackage, onCloseLead, selectedPoint, onClosePoint }: ModalsProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [consent, setConsent] = useState(false);
  const leadModalRef = useRef<HTMLDivElement>(null);
  const pointModalRef = useRef<HTMLDivElement>(null);

  // Reset form state when modal opens
  useEffect(() => {
    if (isLeadOpen) {
      setStatus('idle');
      setConsent(false);
    }
  }, [isLeadOpen]);

  // Escape key handler
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLeadOpen) onCloseLead();
        else if (selectedPoint) onClosePoint();
      }
    };
    if (isLeadOpen || selectedPoint) {
      document.addEventListener('keydown', handler);
    }
    return () => document.removeEventListener('keydown', handler);
  }, [isLeadOpen, selectedPoint, onCloseLead, onClosePoint]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const utm = getUtmParams();
    const slug = packageSlug(leadPackage);
    const deepLink = `https://t.me/WebAuditRuBot?start=free_audit__${slug}`;

    try {
      const response = await fetch('/api/send-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: leadPackage,
          name: data.name,
          company: data.company,
          industry: data.industry,
          phone: data.phone,
          telegram: data.telegram,
          site: data.site,
          message: data.message,
          deepLink,
          utm,
          referrer: document.referrer || null,
          page: window.location.href,
        })
      });
      
      if (response.ok) {
        reachGoal('lead_form_submit', { package: leadPackage });
        setStatus('success');
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
              aria-label="Закрыть"
              className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            {status === 'success' ? (
              <div className="text-center space-y-6 py-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tighter text-white mb-2">
                    Заявка отправлена
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Мы свяжемся с вами в ближайшее время
                  </p>
                </div>

                <div className="frosted p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-4">
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Пока ждёте — пройдите <span className="text-sky-400 font-bold">бесплатный экспресс-аудит</span> вашего сайта в нашем Telegram-боте. Это займёт 2 минуты.
                  </p>
                  <a
                    href={`https://t.me/WebAuditRuBot?start=free_audit__${packageSlug(leadPackage)}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => reachGoal('telegram_click', { source: 'post_submit_bot' })}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/20 hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Бесплатный аудит
                  </a>
                </div>

                <button
                  onClick={() => { setStatus('idle'); onCloseLead(); }}
                  className="text-slate-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors"
                >
                  Закрыть
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-heading font-black text-2xl md:text-3xl uppercase tracking-tighter mb-8 text-center text-white">
                  {leadPackage || 'Заявка'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="name" type="text" placeholder="Имя" aria-label="Имя" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
                  <input name="company" type="text" placeholder="Компания" aria-label="Компания" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                  <input name="industry" type="text" placeholder="Сфера деятельности" aria-label="Сфера деятельности" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                  <input name="phone" type="tel" placeholder="Телефон" aria-label="Телефон" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
                  <input name="telegram" type="text" placeholder="TG @" aria-label="Telegram" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                  <input name="site" type="url" placeholder="Сайт" aria-label="Сайт" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" required />
                  <textarea name="message" rows={3} placeholder="Ваш вопрос" aria-label="Ваш вопрос" className="p-4 rounded-xl text-sm md:col-span-2 w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors resize-none"></textarea>

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
                    disabled={status === 'loading' || !consent}
                    className="md:col-span-2 bg-orange-600 hover:bg-orange-500 py-5 rounded-xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-orange-600/20 text-white disabled:opacity-50 mt-2"
                  >
                    {status === 'loading' ? 'ОТПРАВКА...' : 'ОТПРАВИТЬ'}
                  </button>

                  {status === 'error' && (
                    <p className="md:col-span-2 text-center font-black mt-2 text-[10px] uppercase text-red-500">
                      ОШИБКА. ПОПРОБУЙТЕ ПОЗЖЕ.
                    </p>
                  )}
                </form>
              </>
            )}
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
              aria-label="Закрыть"
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
