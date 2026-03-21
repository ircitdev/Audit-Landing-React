import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modals from './components/Modals';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import VoiceWidget from './components/VoiceWidget';
import StickyCta from './components/StickyCta';
import { AuditPoint } from './types';

// Lazy loading components below the fold for performance optimization
const Roadmap = lazy(() => import('./components/Roadmap'));
const AuditPoints = lazy(() => import('./components/AuditPoints'));
const MarketingAudit = lazy(() => import('./components/MarketingAudit'));
const RoiSection = lazy(() => import('./components/RoiSection'));
const Pricing = lazy(() => import('./components/Pricing'));
const FAQ = lazy(() => import('./components/FAQ'));
const Footer = lazy(() => import('./components/Footer'));

export default function App() {
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [leadPackage, setLeadPackage] = useState('Главная');
  const [selectedPoint, setSelectedPoint] = useState<AuditPoint | null>(null);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsPrivacyOpen(true);
    window.addEventListener('open-privacy', handler);
    return () => window.removeEventListener('open-privacy', handler);
  }, []);

  // Handle body scroll lock when modals are open
  useEffect(() => {
    if (isLeadOpen || selectedPoint) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isLeadOpen, selectedPoint]);

  const handleOpenLead = (pkg: string = 'Главная') => {
    setLeadPackage(pkg);
    setIsLeadOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-orange-500/30 selection:text-orange-200 overflow-x-clip w-full max-w-[100vw]">
      <div className="bg-cubes" />
      
      <header className="flex-none w-full z-50">
        <Navbar />
      </header>
      
      <main className="flex-grow flex flex-col w-full relative z-10 pt-16 md:pt-32 pb-20">
        <Hero />
        
        <Suspense fallback={null}>
          <Roadmap />
        </Suspense>

        {/* Story banner — trust signal */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="frosted p-6 md:p-8 rounded-[2rem] border-red-500/20 flex flex-col md:flex-row items-start gap-4 md:gap-6">
            <span className="text-3xl md:text-4xl shrink-0">⚖️</span>
            <div className="space-y-2">
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                <strong className="text-white">Основатель получил 15 суток ареста</strong> за один забытый логотип Instagram* на сайте.
                Теперь он защищает ваш бизнес от таких же рисков.{' '}
                <a href="https://ria.ru/20260224/sud-2076330347.html" target="_blank" rel="noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2 font-semibold">
                  Источник: РИА Новости →
                </a>
              </p>
            </div>
          </div>
        </div>

        <Suspense fallback={null}>
          <RoiSection />
        </Suspense>
        <Suspense fallback={null}>
          <AuditPoints onPointClick={setSelectedPoint} />
          <MarketingAudit />
        </Suspense>
        <Suspense fallback={null}>
          <Pricing onOpenLead={handleOpenLead} />
          <FAQ />
        </Suspense>
      </main>

      <footer className="flex-none w-full relative z-10">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </footer>

      <CookieBanner />
      <StickyCta onOpenLead={() => handleOpenLead('Sticky CTA')} />
      <VoiceWidget />
      {isPrivacyOpen && <PrivacyPolicy onClose={() => setIsPrivacyOpen(false)} />}
      <Modals
        isLeadOpen={isLeadOpen}
        leadPackage={leadPackage}
        onCloseLead={() => setIsLeadOpen(false)}
        selectedPoint={selectedPoint}
        onClosePoint={() => setSelectedPoint(null)}
      />
    </div>
  );
}
