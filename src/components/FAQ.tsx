import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';
import { reachGoal } from '../metrika';

const faqs = [
  {
    question: "Зачем мне аудит, если сайт и так нормально работает?",
    answer: "Внешне работающий сайт часто скрывает критические уязвимости. Мы находим юридические риски (штрафы до 18 млн руб. за нарушения 152-ФЗ), дыры в безопасности и технические ошибки, которые незаметно режут вашу конверсию и позиции в SEO."
  },
  {
    question: "Как именно проходит процесс аудита?",
    answer: "Вы оставляете заявку, мы связываемся для уточнения деталей. Затем наш юрист и senior-разработчик проводят глубокий ручной и автоматизированный анализ вашего проекта. Через 3-5 дней вы получаете подробный PDF-отчет с понятным планом действий."
  },
  {
    question: "Вы сами исправляете найденные ошибки?",
    answer: "Да. Мы не просто указываем на проблемы, но и предлагаем услуги по их устранению под ключ. При желании вы можете передать наш подробный отчет своим текущим подрядчикам — инструкций будет достаточно для самостоятельного внедрения."
  },
  {
    question: "Что конкретно проверяет юрист?",
    answer: "Юрист проверяет соответствие сайта 152-ФЗ (сбор и хранение персональных данных), наличие и корректность обязательных документов (Политика конфиденциальности, Оферта, Согласия), правильную маркировку рекламы, защиту авторских прав и отсутствие запрещенного контента."
  },
  {
    question: "Повлияет ли аудит на работу моего сайта?",
    answer: "Нет, аудит проводится абсолютно безопасно и незаметно для ваших пользователей. Мы анализируем публичную часть сайта, клиентский исходный код и юридические документы без вмешательства в работу сервера или базы данных."
  },
  {
    question: "Подойдет ли аудит для моего типа бизнеса?",
    answer: "Наш аудит универсален и адаптируется под специфику. Мы проверяем лендинги, интернет-магазины, корпоративные порталы и SaaS-сервисы. Для каждого типа сайта мы делаем акцент на наиболее критичных именно для него зонах риска."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="max-w-4xl mx-auto px-6 py-20 md:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter mb-6">
          Частые <span className="text-orange-500">вопросы</span>
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Всё, что нужно знать перед тем, как доверить нам защиту вашего бизнеса.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`frosted rounded-2xl border transition-colors duration-300 overflow-hidden ${
                isOpen ? 'border-orange-500/50 bg-slate-900/80' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-bold text-slate-200 pr-8">{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full ${
                    isOpen ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-slate-400 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16 pt-12 border-t border-white/5"
      >
        <p className="text-slate-400 text-sm mb-6">Готовы защитить свой сайт?</p>
        <a
          href="https://t.me/WebAuditRuBot?start=zakazat_audit__faq"
          target="_blank"
          rel="noreferrer"
          onClick={() => reachGoal('telegram_click', { source: 'faq' })}
          className="inline-flex items-center gap-3 px-10 py-5 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-2xl uppercase text-sm tracking-widest transition-all shadow-xl shadow-orange-600/20 hover:-translate-y-1 active:scale-95"
        >
          Заказать аудит <ArrowUpRight className="w-4 h-4" />
        </a>
      </motion.div>
    </section>
  );
}
