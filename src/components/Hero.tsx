import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Scale, Code2 } from 'lucide-react';

export default function Hero() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Бронежилет";
  const [isTypingDone, setIsTypingDone] = useState(false);

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
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
      <div className="space-y-8 md:space-y-10 text-center lg:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest"
        >
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
          Compliance 2026 Ready
        </motion.div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-black leading-[1.1] tracking-tighter uppercase">
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
          className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md">
            <Scale className="w-5 h-5 text-orange-400" />
            <span className="text-sm md:text-base font-bold text-slate-200 tracking-wide">Юрист</span>
          </div>
          <span className="text-slate-500 font-black text-xl">+</span>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg shadow-black/20 backdrop-blur-md">
            <Code2 className="w-5 h-5 text-sky-400" />
            <span className="text-sm md:text-base font-bold text-slate-200 tracking-wide">Senior Developer</span>
          </div>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isTypingDone ? 1 : 0, y: isTypingDone ? 0 : 20 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-300 max-w-lg leading-relaxed font-light"
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
            href="https://t.me/WebAuditRuBot?start=zakazat_audit"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto inline-block px-12 py-6 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-black rounded-2xl shadow-[0_0_40px_rgba(249,115,22,0.4)] hover:shadow-[0_0_60px_rgba(249,115,22,0.6)] uppercase tracking-widest text-base md:text-lg transition-all duration-300 hover:-translate-y-1 active:scale-95 active:translate-y-0 relative overflow-hidden group text-center"
          >
            <span className="relative z-10 drop-shadow-md">ЗАКАЗАТЬ АУДИТ</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          </a>
          <a 
            href="https://ria.ru/20260224/sud-2076330347.html" 
            target="_blank" 
            rel="noreferrer"
            className="w-full sm:w-auto px-10 py-6 frosted hover:bg-slate-800 rounded-2xl text-white font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-3 transition-all hover:-translate-y-1 duration-300 active:scale-95 active:translate-y-0"
          >
            История ареста <ArrowUpRight className="w-4 h-4" />
          </a>
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
          alt="Бронежилет" 
          className="w-full h-auto rounded-[3rem] shadow-2xl border border-white/10 object-cover aspect-square"
          referrerPolicy="no-referrer"
          fetchPriority="high"
        />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-6 -right-4 md:-bottom-10 md:-right-10 frosted p-6 md:p-10 border-orange-500/40 shadow-2xl rounded-[2.5rem] md:rounded-[3rem]"
        >
          <p className="text-[10px] md:text-[12px] font-black uppercase text-slate-400 mb-1 text-center">Слот на март</p>
          <p className="text-2xl md:text-4xl font-black text-orange-500 uppercase text-center animate-pulse">Остался: 1</p>
        </motion.div>
      </motion.div>
    </section>
  );
}
