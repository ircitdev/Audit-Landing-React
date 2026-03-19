import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Scale, Code2, X, ChevronDown } from 'lucide-react';
import { reachGoal } from '../metrika';

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Бронежилет";
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [isArticleOpen, setIsArticleOpen] = useState(false);

  // Close modals on Escape
  useEffect(() => {
    if (!isArticleOpen && !isStoryOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isArticleOpen) setIsArticleOpen(false);
        else if (isStoryOpen) setIsStoryOpen(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isArticleOpen, isStoryOpen]);

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

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center overflow-hidden">
      <div className="space-y-8 md:space-y-10 text-center lg:text-left overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest"
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          Compliance 2026 Ready
        </motion.div>
        
        <h1 className="text-[1.75rem] xs:text-[2.2rem] sm:text-5xl md:text-7xl font-heading font-black leading-[1.1] tracking-tighter uppercase break-words">
          <span className="inline-block">{displayText}</span>
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="inline-block w-[0.1em] h-[0.8em] bg-orange-500 ml-2 align-baseline"
          />
          <br />
          <motion.span 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ 
              opacity: isTypingDone ? 1 : 0, 
              filter: isTypingDone ? 'blur(0px)' : 'blur(10px)' 
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="gradient-text inline-block mt-2"
          >
            для сайта
          </motion.span>
        </h1>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center lg:justify-start gap-2 md:gap-4"
        >
          <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md">
            <Scale className="w-4 h-4 md:w-5 md:h-5 text-orange-400 shrink-0" />
            <span className="text-xs md:text-base font-bold text-slate-200">Юрист</span>
          </div>
          <span className="text-slate-500 font-black text-lg md:text-xl">+</span>
          <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md">
            <Code2 className="w-4 h-4 md:w-5 md:h-5 text-sky-400 shrink-0" />
            <span className="text-xs md:text-base font-bold text-slate-200">Senior Dev</span>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-base md:text-xl text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
        >
          Уникальный тандем. Ликвидируем 32 уязвимости, за которые силовики блокируют бизнес и арестовывают владельцев.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 pt-4"
        >
          <a
            href="https://t.me/WebAuditRuBot?start=zakazat_audit__hero"
            target="_blank"
            rel="noreferrer"
            onClick={() => reachGoal('telegram_click', { source: 'hero' })}
            className="w-full sm:w-auto inline-block px-8 py-5 md:px-12 md:py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] uppercase tracking-widest text-sm md:text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0 relative overflow-hidden group text-center"
          >
            <span className="relative z-10 drop-shadow-md">ЗАКАЗАТЬ АУДИТ</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </a>
          <button
            onClick={() => setIsStoryOpen(true)}
            className="w-full sm:w-auto px-8 py-5 md:px-10 md:py-6 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all hover:-translate-y-1 duration-300 active:scale-95 active:translate-y-0"
          >
            Моя история
          </button>
        </motion.div>

      {/* Story Modal */}
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
                const scrollHint = el.querySelector('[data-scroll-hint]') as HTMLElement;
                if (scrollHint) scrollHint.style.opacity = el.scrollTop > 50 ? '0' : '1';
              }}
            >
              {/* Close button */}
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

              {/* Scroll hint — mobile only */}
              <div
                data-scroll-hint
                className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 transition-opacity duration-300 pointer-events-none"
              >
                <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Листайте</span>
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                >
                  <ChevronDown className="w-6 h-6 text-orange-500" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article iframe */}
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
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8 }}
        className="relative"
      >
        <img 
          src="https://storage.googleapis.com/uspeshnyy-projects/webaudit/soildshield500.jpg" 
          alt="Бронежилет" 
          className="w-full h-auto rounded-[3rem] shadow-2xl border border-white/10 object-cover aspect-square"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-6 right-2 md:-bottom-10 md:-right-10 frosted p-4 md:p-10 border-orange-500/40 shadow-2xl rounded-2xl md:rounded-[3rem]"
        >
          <p className="text-[10px] md:text-[12px] font-black uppercase text-slate-400 mb-1 text-center">Слот на март</p>
          <p className="text-2xl md:text-4xl font-black text-orange-500 uppercase text-center animate-pulse">Остался: 1</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
