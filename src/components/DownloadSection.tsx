import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, CheckCircle2 } from 'lucide-react';
import { reachGoal } from '../metrika';
import { API, METRIKA, TELEGRAM, getUtmParams } from '../config';

export default function DownloadSection() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [consent, setConsent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    try {
      const response = await fetch(API.sendPdf, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          utm: getUtmParams(),
          referrer: document.referrer || null,
          page: window.location.href,
        }),
      });

      if (response.ok) {
        reachGoal(METRIKA.goals.emailCaptured, { source: 'pdf_gate' });
        reachGoal(METRIKA.goals.pdfDownload);
        setStatus('success');
      } else {
        throw new Error();
      }
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <section id="download" className="max-w-7xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="frosted p-8 md:p-16 border-orange-500/30 bg-gradient-to-br from-slate-900/80 to-slate-950 rounded-[3rem] md:rounded-[4rem]"
      >
        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center space-y-6 py-4"
            >
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tighter text-white mb-2">
                  Письмо отправлено
                </h3>
                <p className="text-slate-400 text-sm">
                  Проверьте почту — презентация уже там
                </p>
              </div>
              <div className="frosted p-6 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-4 max-w-md mx-auto">
                <p className="text-slate-300 text-sm leading-relaxed">
                  Пока изучаете — пройдите <span className="text-sky-400 font-bold">бесплатный экспресс-аудит</span> вашего сайта за 2 минуты
                </p>
                <a
                  href={TELEGRAM.deepLink('free_audit', 'pdf_gate')}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => reachGoal(METRIKA.goals.telegramClick, { source: 'pdf_gate' })}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/20 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  Бесплатный аудит
                </a>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16"
            >
              <div className="space-y-4 text-center lg:text-left shrink-0">
                <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white">
                  Презентация услуг
                </h2>
                <p className="text-slate-400 text-lg md:text-xl max-w-xl font-light italic">
                  Юридическая страховка и финансовая модель безопасности в одном PDF.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full lg:w-auto flex flex-col gap-3 min-w-0 lg:min-w-[340px]">
                <input
                  name="name"
                  type="text"
                  placeholder="Имя"
                  required
                  className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors"
                />
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500 shrink-0 accent-orange-500"
                  />
                  <span className="text-[11px] text-slate-500 leading-relaxed">
                    Даю согласие на{' '}
                    <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))} className="text-orange-500 hover:text-orange-400 underline underline-offset-2">
                      обработку персональных данных
                    </button>
                  </span>
                </label>
                <button
                  type="submit"
                  disabled={status === 'loading' || !consent}
                  className="bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-orange-600/20 flex items-center justify-center gap-4 hover:bg-white hover:text-orange-600 text-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    'ОТПРАВКА...'
                  ) : status === 'error' ? (
                    'ОШИБКА — ПОВТОРИТЬ'
                  ) : (
                    <><FileText className="w-5 h-5" /> ПОЛУЧИТЬ PDF</>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
