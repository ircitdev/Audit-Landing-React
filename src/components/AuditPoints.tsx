import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { AUDIT_DATA } from '../constants';
import { AuditPoint } from '../types';
import { Check, X, AlertTriangle, ArrowRight } from 'lucide-react';

const getLawBadge = (article?: string) => {
  if (!article) return null;
  
  let badgeClass = "";
  let shortName = "";

  if (article.includes('152-ФЗ')) {
    badgeClass = "bg-orange-500/10 text-orange-400 border-orange-500/20";
    shortName = '152-ФЗ';
  } else if (article.includes('КоАП')) {
    badgeClass = "bg-red-500/10 text-red-400 border-red-500/20";
    shortName = 'КоАП';
  } else if (article.includes('ФЗ №41')) {
    badgeClass = "bg-rose-500/10 text-rose-400 border-rose-500/20";
    shortName = 'ФЗ №41';
  } else if (article.includes('ГК РФ')) {
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    shortName = 'ГК РФ';
  } else if (article.includes('99-ФЗ')) {
    badgeClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    shortName = '99-ФЗ';
  } else if (article.includes('Закон о рекламе')) {
    badgeClass = "bg-orange-500/10 text-orange-400 border-orange-500/20";
    shortName = 'Реклама';
  } else if (article.includes('ЗоЗПП')) {
    badgeClass = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    shortName = 'ЗоЗПП';
  } else {
    return null;
  }

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${badgeClass} shrink-0 leading-none`}>
      {shortName}
    </span>
  );
};

interface AuditPointsProps {
  onPointClick: (point: AuditPoint) => void;
}

export default function AuditPoints({ onPointClick }: AuditPointsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [showExtraLaw, setShowExtraLaw] = useState(false);

  useEffect(() => {
    // Simulate data fetching or processing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const lawPoints = [1, 2, 3, 4, 5, 6];
  const extraLawPoints = [25, 26, 27, 30, 31, 32, 28, 29];
  const protectionPoints = [7, 8, 9, 10, 11, 12];
  const speedPoints = [13, 14, 15, 16, 17, 18];
  const seoPoints = [19, 20, 21, 22, 23, 24];

  // Memoize the render function to prevent unnecessary re-creations
  const renderPoint = useCallback((id: number, isInteractive: boolean = true) => {
    const point = AUDIT_DATA[id];
    if (!point) return null;
    const Icon = point.icon;
    
    if (!isInteractive) {
      return (
        <div 
          key={id}
          className="group relative flex items-center gap-3 p-4 md:p-3 text-sm md:text-xs rounded-xl bg-white/5 border border-transparent text-slate-300 hover:bg-white/10 transition-colors cursor-help min-h-[44px]"
        >
          <Icon className="w-5 h-5 md:w-4 md:h-4 opacity-70 shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium leading-snug">{id}. {point.title}</span>
            {getLawBadge(point.article)}
          </div>
          
          {/* Tooltip */}
          <div className="hidden md:block absolute left-0 bottom-full mb-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none translate-y-2 group-hover:translate-y-0">
            <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50 relative">
              <p className="font-bold text-orange-400 mb-1.5 text-sm leading-tight">{point.title}</p>
              <p className="text-slate-300 leading-relaxed text-xs whitespace-normal">{point.text}</p>
              <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-slate-900/95 border-b border-r border-slate-700/50 rotate-45"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        key={id}
        onClick={() => onPointClick(point)}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative flex items-center justify-between p-4 md:p-3 text-sm md:text-xs cursor-pointer rounded-xl transition-colors duration-200 bg-white/5 hover:bg-black/40 hover:text-orange-400 border border-transparent active:bg-white/10 md:hover:border-orange-500/30 md:hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] min-h-[44px]"
      >
        <div className="flex items-center gap-3 pr-2 flex-1">
          <Icon className="w-5 h-5 md:w-4 md:h-4 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="font-medium leading-snug">{id}. {point.title}</span>
            {getLawBadge(point.article)}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 md:w-4 md:h-4 opacity-50 md:opacity-0 -translate-x-1 md:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-orange-500 shrink-0" />
        
        {/* Tooltip - Hidden on mobile to avoid double UI with modal */}
        <div className="hidden md:block absolute left-0 bottom-full mb-3 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none translate-y-2 group-hover:translate-y-0">
          <div className="bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-slate-700/50 relative">
            <p className="font-bold text-orange-400 mb-1.5 text-sm leading-tight">{point.title}</p>
            <p className="text-slate-300 leading-relaxed text-xs whitespace-normal">{point.text}</p>
            <div className="absolute -bottom-1.5 left-8 w-3 h-3 bg-slate-900/95 border-b border-r border-slate-700/50 rotate-45"></div>
          </div>
        </div>
      </motion.div>
    );
  }, [onPointClick]);

  const renderSkeletonColumn = (borderColor: string, titleColor: string, title: string) => (
    <div className={`frosted p-6 md:p-8 border-t-4 ${borderColor} rounded-[2rem] md:rounded-[2.5rem] flex flex-col`}>
      <h3 className={`font-heading font-black text-xl ${titleColor} uppercase mb-6 opacity-50`}>{title}</h3>
      <div className="space-y-2 flex-grow">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 md:p-3 rounded-xl bg-white/5 animate-pulse min-h-[44px]">
            <div className="w-5 h-5 md:w-4 md:h-4 rounded bg-white/10 shrink-0" />
            <div className="h-4 bg-white/10 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="audit" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter">
          32 Пункта
        </h2>
        <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-[10px] md:text-[12px] mt-6">
          Код + Закон. Кликните для деталей.
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {renderSkeletonColumn('border-t-red-500', 'text-red-500', 'ЗАКОН')}
          {renderSkeletonColumn('border-t-sky-500', 'text-sky-400', 'ЗАЩИТА')}
          {renderSkeletonColumn('border-t-emerald-500', 'text-emerald-400', 'СКОРОСТЬ')}
          {renderSkeletonColumn('border-t-purple-500', 'text-purple-400', 'РОСТ (SEO)')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-20">
          {/* LAW */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="frosted p-6 md:p-8 border-t-4 border-t-red-500 rounded-[2rem] md:rounded-[2.5rem] flex flex-col"
          >
            <h3 className="font-heading font-black text-xl text-red-500 uppercase mb-6">ЗАКОН</h3>
            <div className="space-y-2 flex-grow">
              {lawPoints.map(id => renderPoint(id, false))}
              {showExtraLaw && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-2 pt-2"
                >
                  {extraLawPoints.map(id => renderPoint(id, false))}
                </motion.div>
              )}
            </div>
            <button 
              onClick={() => setShowExtraLaw(!showExtraLaw)}
              className="mt-6 w-full py-4 md:py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[10px] md:text-xs font-black uppercase tracking-widest rounded-xl border border-red-500/20 transition-all min-h-[44px]"
            >
              {showExtraLaw ? 'Скрыть' : 'Показать еще 8'}
            </button>
          </motion.div>

          {/* PROTECTION */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="frosted p-6 md:p-8 border-t-4 border-t-sky-500 rounded-[2rem] md:rounded-[2.5rem]"
          >
            <h3 className="font-heading font-black text-xl text-sky-400 uppercase mb-6">ЗАЩИТА</h3>
            <div className="space-y-2">
              {protectionPoints.map(id => renderPoint(id, true))}
            </div>
          </motion.div>

          {/* SPEED */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="frosted p-6 md:p-8 border-t-4 border-t-emerald-500 rounded-[2rem] md:rounded-[2.5rem]"
          >
            <h3 className="font-heading font-black text-xl text-emerald-400 uppercase mb-6">СКОРОСТЬ</h3>
            <div className="space-y-2">
              {speedPoints.map(id => renderPoint(id, true))}
            </div>
          </motion.div>

          {/* SEO */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="frosted p-6 md:p-8 border-t-4 border-t-purple-500 rounded-[2rem] md:rounded-[2.5rem]"
          >
            <h3 className="font-heading font-black text-xl text-purple-400 uppercase mb-6">РОСТ (SEO)</h3>
            <div className="space-y-2">
              {seoPoints.map(id => renderPoint(id, true))}
            </div>
          </motion.div>
        </div>
      )}

      {/* STATUSES AND LAWS SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="frosted p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/5"
        >
          <h4 className="font-heading font-black text-xl uppercase mb-8 tracking-tighter">Статусы проверки</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md uppercase bg-emerald-500/20 text-emerald-400">
                <Check className="w-3 h-3" /> OK
              </span>
              <p className="text-xs text-slate-400">Проверка пройдена, всё в порядке</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md uppercase bg-red-500/20 text-red-400">
                <X className="w-3 h-3" /> FAIL
              </span>
              <p className="text-xs text-slate-400">Проблема обнаружена, требуется исправление</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
              <span className="flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-md uppercase bg-amber-500/20 text-amber-400">
                <AlertTriangle className="w-3 h-3" /> WARN
              </span>
              <p className="text-xs text-slate-400">Предупреждение, рекомендация к исправлению</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="frosted p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border-white/5"
        >
          <h4 className="font-heading font-black text-xl uppercase mb-8 tracking-tighter">Ключевые законы</h4>
          <div className="space-y-4">
            <div className="bg-white/5 border-l-4 border-orange-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-400 mb-1">152-ФЗ</p>
                <p className="text-xs text-slate-300">О персональных данных</p>
              </div>
              <span className="text-base md:text-lg font-black text-red-500 whitespace-nowrap">до 18 000 000 ₽ (с 2025)</span>
            </div>
            <div className="bg-white/5 border-l-4 border-orange-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-400 mb-1">ч. 1 ст. 20.3 КоАП</p>
                <p className="text-xs text-slate-300">Демонстрация символики экстремистских организаций</p>
              </div>
              <span className="text-base md:text-lg font-black text-red-500 whitespace-nowrap">арест до 15 суток</span>
            </div>
            <div className="bg-white/5 border-l-4 border-orange-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-400 mb-1">ФЗ №41</p>
                <p className="text-xs text-slate-300">Запрет передачи ПДн на иностранные ресурсы</p>
              </div>
              <span className="text-base md:text-lg font-black text-red-500 whitespace-nowrap">до 6 000 000 ₽</span>
            </div>
            <div className="bg-white/5 border-l-4 border-orange-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-400 mb-1">149-ФЗ</p>
                <p className="text-xs text-slate-300">Об информации и информационных технологиях</p>
              </div>
              <span className="text-base md:text-lg font-black text-red-500 whitespace-nowrap">до 1 000 000 ₽</span>
            </div>
            <div className="bg-white/5 border-l-4 border-orange-500 p-4 rounded-r-2xl flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <p className="text-[10px] font-black uppercase text-orange-400 mb-1">436-ФЗ</p>
                <p className="text-xs text-slate-300">О защите детей от информации</p>
              </div>
              <span className="text-base md:text-lg font-black text-red-500 whitespace-nowrap">до 200 000 ₽</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
