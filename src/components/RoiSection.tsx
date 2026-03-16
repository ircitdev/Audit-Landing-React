import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUpRight, Quote, X, ShieldCheck, CheckCircle2, Layers, Shield, TrendingUp } from 'lucide-react';

const data = [
  { name: 'Убытки от проверок', value: 18000000, color: '#ef4444', hoverColor: '#ef4444' },
  { name: 'Инвестиция в защиту', value: 90000, color: '#f97316', hoverColor: '#fb923c' },
];

interface RoiSectionProps {
  onOpenLead: () => void;
}

export default function RoiSection({ onOpenLead }: RoiSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 py-24 md:py-32 border-y border-slate-200/60">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full">
          <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-sky-400/5 rounded-full blur-[120px]" />
        </div>
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwgMCwgMCwgMC4wNSkiLz48L3N2Zz4=')] opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="order-2 lg:order-1 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative"
        >
          {/* Hint for interactivity */}
          <div className="absolute top-6 right-8 text-[10px] font-bold uppercase tracking-widest text-orange-500 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200/50 animate-pulse pointer-events-none">
            Нажми на график
          </div>

          <div className="h-[300px] md:h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                  dy={15}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(226, 232, 240, 0.8)', 
                    borderRadius: '1rem', 
                    color: '#0f172a', 
                    fontWeight: 600, 
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' 
                  }}
                  itemStyle={{ color: '#0f172a' }}
                  formatter={(value: number) => new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(value)}
                />
                <Bar dataKey="value" radius={[16, 16, 0, 0]} barSize={80}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={hoveredIndex === index ? entry.hoverColor : entry.color} 
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onClick={() => {
                        if (index === 1) setIsModalOpen(true);
                      }}
                      style={{ 
                        cursor: index === 1 ? 'pointer' : 'default', 
                        transition: 'fill 0.3s ease',
                        filter: hoveredIndex === index && index === 1 ? 'drop-shadow(0 0 12px rgba(249,115,22,0.4))' : 'none'
                      }}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-10 order-1 lg:order-2 text-center lg:text-left"
        >
          <h2 className="text-5xl md:text-7xl font-heading font-black uppercase leading-none tracking-tighter text-slate-900">
            Математика <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Спокойствия</span>
          </h2>
          
          <div className="relative bg-gradient-to-br from-orange-50/80 to-white p-8 md:p-12 border border-orange-100/50 rounded-[2rem] md:rounded-[3rem] shadow-lg shadow-orange-500/5">
            <Quote className="absolute top-8 left-8 w-10 h-10 text-orange-500/10 rotate-180" />
            <p className="relative z-10 text-slate-700 leading-relaxed text-xl md:text-2xl italic font-medium">
              "Инвестиция в защиту в <span className="text-orange-600 font-bold">200 раз</span> меньше потенциальных убытков. Мы убираем риски до того, как они станут проблемами. Спокойный сон собственника — бесценен."
            </p>
          </div>

          <button 
            onClick={onOpenLead}
            className="inline-flex items-center gap-3 px-12 py-6 md:px-16 md:py-8 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl md:rounded-3xl transition-all shadow-[0_20px_40px_-15px_rgba(15,23,42,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.5)] hover:-translate-y-1 uppercase tracking-widest text-xs md:text-sm active:scale-95"
          >
            Заказать аудит <ArrowUpRight className="w-5 h-5 text-orange-400" />
          </button>
        </motion.div>
      </div>

      {/* Why Us Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mt-24 md:mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-slate-900">
            Почему <span className="text-orange-500">мы?</span>
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <Layers className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Полный комплекс</h4>
            <p className="text-slate-600 leading-relaxed">
              Юридический, технический и маркетинговый аудит в одном отчете. Мы закрываем все уязвимости вашего бизнеса разом.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Гарантия безопасности</h4>
            <p className="text-slate-600 leading-relaxed">
              Защищаем от штрафов до 18 млн руб., внезапных блокировок Роскомнадзора и критических утечек баз данных.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-black uppercase tracking-tight mb-4">Рост продаж</h4>
            <p className="text-slate-600 leading-relaxed">
              Находим неочевидные точки потери конверсии и даем конкретные рекомендации по увеличению вашей прибыли.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Benefits Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl p-8 md:p-10 overflow-hidden z-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <h3 className="text-2xl md:text-3xl font-heading font-black uppercase tracking-tight text-slate-900 mb-4">
                Что входит в <span className="text-orange-500">инвестицию</span>
              </h3>
              
              <ul className="space-y-4 text-slate-600 mb-8 font-medium">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Полный юридический аудит (152-ФЗ, оферты, согласия, маркировка рекламы).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Технический аудит безопасности (защита от DDoS, взломов, утечек БД).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Маркетинговый аудит (повышение конверсии, структура давления).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Пошаговый PDF-план устранения всех 32 критических уязвимостей.</span>
                </li>
              </ul>
              
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  onOpenLead();
                }}
                className="w-full py-5 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-xl uppercase tracking-wider text-sm transition-colors active:scale-95"
              >
                Заказать аудит
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
