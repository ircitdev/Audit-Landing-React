import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { reachGoal } from '../metrika';
import { TELEGRAM, METRIKA } from '../config';

interface StickyCtaProps {
  onOpenLead: () => void;
}

export default function StickyCta({ onOpenLead }: StickyCtaProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      // Show after Roadmap section (Штурм block)
      const roadmap = document.getElementById('roadmap');
      if (roadmap) {
        const rect = roadmap.getBoundingClientRect();
        setVisible(rect.bottom < window.innerHeight);
      } else {
        setVisible(window.scrollY > 2500);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden"
        >
          <div className="bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex gap-3">
            <button
              onClick={() => {
                reachGoal(METRIKA.goals.leadFormOpen, { source: 'sticky_cta' });
                onOpenLead();
              }}
              className="flex-1 bg-orange-600 hover:bg-orange-500 text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-colors shadow-lg shadow-orange-600/20"
            >
              Оставить заявку
            </button>
            <a
              href={TELEGRAM.deepLink('free_audit', 'sticky_cta')}
              target="_blank"
              rel="noreferrer"
              onClick={() => reachGoal(METRIKA.goals.telegramClick, { source: 'sticky_cta' })}
              className="flex items-center justify-center w-14 bg-sky-500 hover:bg-sky-400 text-white rounded-xl transition-colors shadow-lg shadow-sky-500/20"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
