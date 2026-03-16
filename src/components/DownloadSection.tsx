import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export default function DownloadSection() {
  return (
    <section id="download" className="max-w-7xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="frosted p-8 md:p-16 border-orange-500/30 bg-gradient-to-br from-slate-900/80 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 rounded-[3rem] md:rounded-[4rem]"
      >
        <div className="space-y-4 text-center lg:text-left">
          <h2 className="text-3xl md:text-5xl font-heading font-black uppercase tracking-tighter text-white">
            Презентация услуг
          </h2>
          <p className="text-slate-400 text-lg md:text-xl max-w-xl font-light italic">
            Юридическая страховка и финансовая модель безопасности в одном PDF.
          </p>
        </div>
        <a 
          href="https://storage.googleapis.com/uspeshnyy-projects/webaudit/SoldatovWebAudit.pdf" 
          target="_blank" 
          rel="noreferrer"
          className="w-full lg:w-auto bg-orange-600 text-white px-10 md:px-12 py-6 md:py-8 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest shadow-2xl shadow-orange-600/20 flex items-center justify-center gap-4 hover:bg-white hover:text-orange-600 text-sm md:text-lg transition-all active:scale-95"
        >
          <FileText className="w-6 h-6 md:w-8 md:h-8" /> СКАЧАТЬ PDF
        </a>
      </motion.div>
    </section>
  );
}
