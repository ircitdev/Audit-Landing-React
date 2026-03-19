import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('cookie_accepted');
    if (lastShown) {
      const diff = Date.now() - Number(lastShown);
      if (diff < 86400000) return; // 24 hours
    }

    const showTimer = setTimeout(() => setVisible(true), 20000);
    return () => clearTimeout(showTimer);
  }, []);

  // Auto-hide after 20 seconds of being visible
  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => handleAccept(), 20000);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  const handleAccept = () => {
    localStorage.setItem('cookie_accepted', String(Date.now()));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[200]"
        >
          <div className="bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-5 shadow-2xl shadow-black/40 flex gap-4 items-start">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center shrink-0">
              <Cookie className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm mb-1">Мы используем файлы cookie</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Для корректной работы сайта и анализа трафика. Продолжая, вы соглашаетесь с нашей{' '}
                <button type="button" onClick={() => { handleAccept(); window.dispatchEvent(new CustomEvent('open-privacy')); }} className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2">политикой</button>.
              </p>
              <button
                onClick={handleAccept}
                className="mt-3 px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-black uppercase tracking-wider rounded-lg transition-colors active:scale-95"
              >
                Хорошо
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
