import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    num: 1,
    title: "Разведка",
    desc: "Стресс-тест сайта по 32 пунктам. Находим все «мины», за которые могут зацепиться силовики.",
    details: [
      "Глубокое сканирование исходного кода",
      "Анализ форм сбора данных и трекеров",
      "Юридический аудит текущих текстов",
      "Поиск уязвимостей (XSS, SQLi)"
    ],
    active: false
  },
  {
    num: 2,
    title: "Проектирование",
    desc: "Создаем «чертеж» исправления ошибок: четкое ТЗ для техников и пакет документов.",
    details: [
      "Подготовка Политики конфиденциальности",
      "Составление Согласия на обработку ПДн",
      "Разработка пошагового ТЗ для IT-отдела",
      "Инструкции по настройке серверов"
    ],
    active: true
  },
  {
    num: 3,
    title: "Штурм",
    desc: "Закрываем дыры в коде и документах. Выдаем финальный сертификат соответствия DS-CERT.",
    details: [
      "Внедрение правок на боевом сервере",
      "Настройка правильных баннеров cookie",
      "Финальное тестирование всех систем",
      "Выдача сертификата безопасности"
    ],
    active: false
  }
];

export default function Roadmap() {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="roadmap" className="max-w-7xl mx-auto px-6 py-20 md:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 md:mb-24"
      >
        <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter leading-none">
          Дорожная карта <span className="text-orange-500">защиты</span>
        </h2>
        <p className="text-slate-500 uppercase font-black tracking-[0.4em] text-[10px] md:text-[12px] mt-6">
          От первого касания до полного спокойствия
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {steps.map((step, i) => {
          const isHovered = hoveredStep === step.num;
          
          return (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              onHoverStart={() => setHoveredStep(step.num)}
              onHoverEnd={() => setHoveredStep(null)}
              animate={{ 
                scale: isHovered ? 1.05 : 1,
                zIndex: isHovered ? 10 : 1
              }}
              className={`frosted p-10 rounded-[3rem] flex flex-col items-center text-center cursor-pointer relative overflow-hidden transition-colors duration-300 ${
                step.active || isHovered 
                  ? 'border-orange-500/40 bg-slate-900/80 shadow-2xl shadow-orange-500/10' 
                  : 'border-white/5 bg-slate-900/40'
              }`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black mb-6 transition-colors duration-300 ${
                step.active || isHovered 
                  ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/30' 
                  : 'bg-orange-500/10 text-orange-500'
              }`}>
                {step.num}
              </div>
              <h3 className="text-xl font-heading font-black uppercase mb-4 tracking-tight">{step.title}</h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                step.active || isHovered ? 'text-slate-200 font-medium' : 'text-slate-400'
              }`}>
                {step.desc}
              </p>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full text-left overflow-hidden"
                  >
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-500/30 to-transparent mb-6" />
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <motion.li 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 + 0.1 }}
                          className="flex items-start gap-3 text-xs text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
