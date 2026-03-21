import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Scale, Code2, X, ChevronDown, FileText, CheckCircle2 } from 'lucide-react';
import { reachGoal } from '../metrika';
import { API, METRIKA, TELEGRAM, getUtmParams } from '../config';

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Бронежилет";
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [pdfConsent, setPdfConsent] = useState(false);

  const handlePdfSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPdfStatus('loading');
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(API.sendPdf, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), utm: getUtmParams(), referrer: document.referrer || null, page: window.location.href }),
      });
      if (res.ok) {
        reachGoal(METRIKA.goals.emailCaptured, { source: 'hero_pdf' });
        reachGoal(METRIKA.goals.pdfDownload);
        setPdfStatus('success');
      } else throw new Error();
    } catch {
      setPdfStatus('error');
      setTimeout(() => setPdfStatus('idle'), 3000);
    }
  };

  useEffect(() => {
    if (!isArticleOpen && !isStoryOpen && !isPdfOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPdfOpen) setIsPdfOpen(false);
        else if (isArticleOpen) setIsArticleOpen(false);
        else if (isStoryOpen) setIsStoryOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isArticleOpen, isStoryOpen, isPdfOpen]);

  useEffect(() => {
    if (isArticleOpen) {
      document.documentElement.classList.add('iframe-overlay-open');
    } else {
      document.documentElement.classList.remove('iframe-overlay-open');
    }
    return () => document.documentElement.classList.remove('iframe-overlay-open');
  }, [isArticleOpen]);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) {
        clearInterval(timer);
        setIsTypingDone(true);
      }
    }, 120);
    return () => clearInterval(timer);
  }, []);

  // Shared content blocks
  const badgeEl = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest"
    >
      <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
      Готов к проверкам 2026
    </motion.div>
  );

  const titleEl = (sizeClass: string) => (
    <h1 className={`${sizeClass} font-heading font-black leading-[1.1] tracking-tighter uppercase`}>
      <span className="inline-block">{displayText}</span>
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
        className="inline-block w-[0.1em] h-[0.8em] bg-orange-500 ml-1 md:ml-2 align-baseline"
      />
      <br />
      <motion.span
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: isTypingDone ? 1 : 0, filter: isTypingDone ? 'blur(0px)' : 'blur(10px)' }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="gradient-text inline-block mt-1 md:mt-2"
      >
        для сайта
      </motion.span>
    </h1>
  );

  const tagsEl = (justify: string, size: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`flex flex-wrap items-center ${justify} gap-2 md:gap-4`}
    >
      <div className={`flex items-center gap-2 ${size} rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md`}>
        <Scale className="w-4 h-4 md:w-5 md:h-5 text-orange-400 shrink-0" />
        <span className="text-xs md:text-base font-bold text-slate-200">Юрист</span>
      </div>
      <span className="text-slate-500 font-black text-lg md:text-xl">+</span>
      <div className={`flex items-center gap-2 ${size} rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md`}>
        <Code2 className="w-4 h-4 md:w-5 md:h-5 text-sky-400 shrink-0" />
        <span className="text-xs md:text-base font-bold text-slate-200">Разработчик</span>
      </div>
    </motion.div>
  );

  const descEl = (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-base md:text-xl text-slate-300 max-w-lg leading-relaxed font-light"
    >
      Уникальный тандем. Ликвидируем 32 уязвимости, за которые силовики блокируют бизнес и арестовывают владельцев.
    </motion.p>
  );

  return (
    <section className="max-w-7xl mx-auto overflow-hidden">
      {/* ═══════ MOBILE ═══════ */}
      <div className="lg:hidden">
        {/* Photo — full width, no gap to navbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative w-full -mt-16 -mb-28"
        >
          <img
            src="https://storage.googleapis.com/uspeshnyy-projects/webaudit/soildshield500.jpg"
            alt="Денис Солдатов"
            className="w-full h-auto object-cover"
            referrerPolicy="no-referrer"
            fetchPriority="high"
            width={500}
            height={500}
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-body)] via-[var(--bg-body)]/60 to-transparent" />

          {/* Badges row — slot left (pulsing), ready right */}
          <div className="absolute bottom-32 left-0 right-0 px-4 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ delay: 0.8, duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="bg-orange-500 px-3 py-1.5 rounded-lg shadow-lg shadow-orange-500/30"
            >
              <span className="text-white text-[11px] font-black uppercase tracking-wider">1 слот на март</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest"
            >
              <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping" />
              Готов к проверкам 2026
            </motion.div>
          </div>
        </motion.div>

        {/* Content — heavily overlapping photo */}
        <div className="relative z-10 px-4 pb-8 space-y-5 text-center">
          {titleEl('text-[2rem] sm:text-5xl')}
          {tagsEl('justify-center', 'px-3 py-2')}
          {descEl}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col gap-3 pt-2"
          >
            <a
              href="https://t.me/WebAuditRuBot?start=free_audit__hero"
              target="_blank"
              rel="noreferrer"
              onClick={() => reachGoal('telegram_click', { source: 'hero' })}
              className="w-full px-8 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] uppercase tracking-widest text-sm transition-all active:scale-95 relative overflow-hidden group text-center block"
            >
              <span className="relative z-10 drop-shadow-md">БЕСПЛАТНЫЙ АУДИТ ЗА 2 МИН</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </a>
            <div className="flex gap-3">
              <button
                onClick={() => { setIsPdfOpen(true); setPdfStatus('idle'); setPdfConsent(false); }}
                className="flex-1 px-4 py-4 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" /> PDF
              </button>
              <button
                onClick={() => setIsStoryOpen(true)}
                className="flex-1 px-4 py-4 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-xs transition-all active:scale-95"
              >
                Моя история
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══════ DESKTOP ═══════ */}
      <div className="hidden lg:grid grid-cols-2 gap-24 items-center px-6 min-h-[calc(100vh-5rem)]">
        <div className="space-y-10 text-left">
          {badgeEl}
          {titleEl('text-7xl')}
          {tagsEl('justify-start', 'px-4 py-2.5')}
          {descEl}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap gap-6 pt-4"
          >
            <a
              href="https://t.me/WebAuditRuBot?start=free_audit__hero"
              target="_blank"
              rel="noreferrer"
              onClick={() => reachGoal('telegram_click', { source: 'hero' })}
              className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] uppercase tracking-widest text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
            >
              <span className="relative z-10 drop-shadow-md">БЕСПЛАТНЫЙ АУДИТ</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </a>
            <button
              onClick={() => { setIsPdfOpen(true); setPdfStatus('idle'); setPdfConsent(false); }}
              className="px-8 py-6 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-sm flex items-center gap-3 transition-all hover:-translate-y-1 duration-300 active:scale-95"
            >
              <FileText className="w-4 h-4" /> PDF
            </button>
            <button
              onClick={() => setIsStoryOpen(true)}
              className="px-8 py-6 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-sm flex items-center gap-3 transition-all hover:-translate-y-1 duration-300 active:scale-95"
            >
              Моя история
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <img
            src="https://storage.googleapis.com/uspeshnyy-projects/webaudit/soildshield500.jpg"
            alt="Денис Солдатов"
            className="w-full h-auto rounded-[3rem] shadow-2xl border border-white/10 object-cover aspect-square"
            referrerPolicy="no-referrer"
            fetchPriority="high"
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="absolute -bottom-10 -right-10 frosted p-10 border-orange-500/40 shadow-2xl rounded-[3rem]"
          >
            <p className="text-[12px] font-black uppercase text-slate-400 mb-1 text-center">Слот на март</p>
            <p className="text-4xl font-black text-orange-500 uppercase text-center animate-pulse">Остался: 1</p>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════ PDF MODAL ═══════ */}
      <AnimatePresence>
        {isPdfOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsPdfOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 w-full max-w-md frosted p-8 md:p-10 rounded-[2rem] border border-orange-500/30 shadow-2xl"
            >
              <button
                onClick={() => setIsPdfOpen(false)}
                aria-label="Закрыть"
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <AnimatePresence mode="wait">
                {pdfStatus === 'success' ? (
                  <motion.div key="ok" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-5 py-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-heading font-black uppercase tracking-tighter text-white">Письмо отправлено</h3>
                    <p className="text-slate-400 text-sm">Проверьте почту — презентация уже там</p>
                    <div className="frosted p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 space-y-3">
                      <p className="text-slate-300 text-sm">Пока изучаете — пройдите <span className="text-sky-400 font-bold">бесплатный экспресс-аудит</span> за 2 минуты</p>
                      <a
                        href={TELEGRAM.deepLink('free_audit', 'hero_pdf')}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => reachGoal(METRIKA.goals.telegramClick, { source: 'hero_pdf' })}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-black rounded-xl uppercase text-xs tracking-widest transition-all shadow-lg shadow-sky-500/20"
                      >
                        Бесплатный аудит
                      </a>
                    </div>
                    <button onClick={() => setIsPdfOpen(false)} className="text-slate-500 hover:text-white text-xs uppercase tracking-widest font-bold transition-colors">
                      Закрыть
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tighter text-white mb-2">Презентация</h3>
                      <p className="text-slate-400 text-sm">Юридическая страховка и финансовая модель безопасности в одном PDF</p>
                    </div>
                    <form onSubmit={handlePdfSubmit} className="flex flex-col gap-3">
                      <input name="name" type="text" placeholder="Имя" required aria-label="Имя" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                      <input name="email" type="email" placeholder="Email" required aria-label="Email" className="p-4 rounded-xl text-sm w-full bg-white/5 border border-white/10 text-white focus:border-orange-500 focus:outline-none transition-colors" />
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="checkbox" checked={pdfConsent} onChange={(e) => setPdfConsent(e.target.checked)} className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 shrink-0 accent-orange-500" />
                        <span className="text-[11px] text-slate-500 leading-relaxed">
                          Даю согласие на{' '}
                          <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-privacy'))} className="text-orange-500 hover:text-orange-400 underline underline-offset-2">обработку персональных данных</button>
                        </span>
                      </label>
                      <button type="submit" disabled={pdfStatus === 'loading' || !pdfConsent} className="bg-orange-600 hover:bg-orange-500 text-white py-5 rounded-xl font-black uppercase text-sm tracking-widest transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50 flex items-center justify-center gap-3">
                        {pdfStatus === 'loading' ? 'ОТПРАВКА...' : pdfStatus === 'error' ? 'ОШИБКА — ПОВТОРИТЬ' : <><FileText className="w-5 h-5" /> ПОЛУЧИТЬ PDF</>}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ STORY MODAL ═══════ */}
      <AnimatePresence>
        {isStoryOpen && (
          <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center md:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              onClick={() => setIsStoryOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="relative z-10 w-full h-full md:max-w-2xl md:h-auto md:max-h-[85vh] overflow-y-auto bg-slate-900 md:rounded-[3rem] border-0 md:border border-white/10 shadow-2xl"
              onScroll={(e) => {
                const el = e.currentTarget;
                const hint = el.querySelector('[data-scroll-hint]') as HTMLElement;
                if (hint) hint.style.opacity = el.scrollTop > 50 ? '0' : '1';
              }}
            >
              <button
                onClick={() => setIsStoryOpen(false)}
                aria-label="Закрыть"
                className="sticky top-4 float-right mr-4 mt-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-red-500 text-white transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="p-6 pt-2 md:p-12 space-y-6 clear-both">
                <div>
                  <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/30 mb-4">
                    Личная история
                  </span>
                  <h2 className="text-2xl md:text-4xl font-heading font-black uppercase leading-tight tracking-tight text-white pr-12 md:pr-0">
                    От <span className="text-red-500">15 суток ареста</span> до «<span className="text-orange-500">Бронежилета</span>» для вашего сайта
                  </h2>
                </div>

                <div className="space-y-4 text-slate-300 text-sm md:text-base leading-relaxed">
                  <p>
                    В феврале 2026 года я получил <strong className="text-white">15 суток административного ареста</strong>.
                  </p>
                  <p>
                    Причина? <span className="text-red-400 font-semibold">Один забытый логотип Instagram*</span> в подвале сайта.
                    Силовики посчитали это «публичной демонстрацией экстремистской символики».
                  </p>
                  <p>
                    Я прошёл через суд и спецприёмник, чтобы <strong className="text-white">вы никогда не проходили через это</strong>.
                  </p>
                  <p>Этот момент перевернул мою практику.</p>

                  <div className="border-l-4 border-orange-500 pl-5 py-2 my-6">
                    <p className="font-black text-white text-base md:text-lg mb-2">Я понял главное:</p>
                    <p className="text-white font-bold text-base md:text-lg">
                      Код — это не просто код. Код — это закон.
                    </p>
                  </div>

                  <p>
                    Теперь я превращаю чужие сайты в неприступные крепости: убираю все юридические мины, закрываю дыры в 152-ФЗ и даю <span className="text-orange-400 font-semibold underline underline-offset-4 decoration-orange-500/50">гарантию защиты в суде</span>.
                  </p>

                  <p className="text-white font-black text-lg md:text-xl mt-6">
                    Ваш сайт больше не будет причиной ареста или огромного штрафа.
                  </p>
                </div>

                <button
                  onClick={() => { setIsStoryOpen(false); setIsArticleOpen(true); }}
                  className="w-full mt-4 px-8 py-5 bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all active:scale-95"
                >
                  Читать статью об аресте <ArrowUpRight className="w-4 h-4 text-orange-400" />
                </button>
              </div>

              {/* Bottom gradient + scroll hint */}
              <div
                data-scroll-hint
                className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex flex-col items-center pb-6 pt-20 transition-opacity duration-300 pointer-events-none bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"
              >
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">Листайте</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-7 h-7 text-orange-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ ARTICLE IFRAME ═══════ */}
      {isArticleOpen && (
        <div className="fixed inset-0 z-[99999] bg-black">
          <iframe
            src="https://ria.ru/20260224/sud-2076330347.html"
            className="w-full h-full border-0"
            title="История ареста — РИА Новости"
          />
          <button
            onClick={() => setIsArticleOpen(false)}
            className="fixed top-4 right-4 z-[100000] w-12 h-12 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-400 text-white shadow-2xl shadow-black/50 transition-colors active:scale-95"
            aria-label="Закрыть"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsArticleOpen(false)}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100000] px-8 py-3.5 bg-orange-500 hover:bg-orange-400 text-white font-black uppercase text-xs tracking-widest rounded-full shadow-2xl shadow-black/50 transition-all active:scale-95"
          >
            ← Вернуться на сайт
          </button>
        </div>
      )}
    </section>
  );
}
