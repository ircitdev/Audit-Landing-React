import React, { useState, useEffect } from 'react';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { reachGoal } from '../metrika';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './ThemeProvider';

const menuItems = [
  { href: '#audit', label: '32 Пункта' },
  { href: '#marketing', label: 'Маркетинг' },
  { href: '#download', label: 'Презентация' },
  { href: '#pricing', label: 'Тарифы' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 bg-slate-950/60 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-2 md:gap-3 cursor-pointer group shrink-0"
            onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          >
            <Shield className="w-7 h-7 md:w-8 md:h-8 text-orange-500 group-hover:scale-110 transition-transform" />
            <span className="font-heading font-black tracking-tighter uppercase text-lg md:text-xl text-white">
              Сайт<span className="text-orange-500">ЧИСТ!</span>
            </span>
          </div>

          <div className="hidden lg:flex gap-8 text-sm font-bold uppercase tracking-wider">
            {menuItems.map(item => (
              <a key={item.href} href={item.href} className="text-slate-300 hover:text-orange-500 transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://t.me/WebAuditRuBot?start=sos_audit__navbar"
              onClick={() => reachGoal('telegram_click', { source: 'navbar' })}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex bg-orange-600 hover:bg-orange-500 px-4 py-2.5 md:px-6 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase shadow-lg shadow-orange-600/20 text-white transition-all active:scale-95 shrink-0"
            >
              БЕСПЛАТНЫЙ АУДИТ
            </a>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Burger button — mobile only */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Fullscreen mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[49] bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-2"
          >
            {menuItems.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: 'easeOut' }}
                onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight text-white hover:text-orange-500 transition-colors py-3"
              >
                {item.label}
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: menuItems.length * 0.08, duration: 0.4 }}
              className="mt-8 flex flex-col items-center gap-4"
            >
              <a
                href="https://t.me/WebAuditRuBot?start=sos_audit__navbar"
                onClick={() => { reachGoal('telegram_click', { source: 'navbar_menu' }); setIsMenuOpen(false); }}
                target="_blank"
                rel="noreferrer"
                className="px-10 py-4 bg-orange-600 hover:bg-orange-500 text-white font-black uppercase text-sm tracking-widest rounded-2xl shadow-2xl shadow-orange-600/30 transition-all active:scale-95"
              >
                БЕСПЛАТНЫЙ АУДИТ
              </a>
              <span className="text-slate-600 text-xs uppercase tracking-widest">sitechist.ru</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
