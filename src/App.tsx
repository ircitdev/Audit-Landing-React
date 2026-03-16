import React, { useState, useEffect, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Modals from './components/Modals';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './components/PrivacyPolicy';
import VoiceWidget from './components/VoiceWidget';
import { AuditPoint } from './types';

// Lazy loading components below the fold for performance optimization
const DownloadSection = lazy(() => import('./components/DownloadSection'));
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
    <div className="min-h-screen flex flex-col relative selection:bg-orange-500/30 selection:text-orange-200">
      <div className="bg-cubes" />
      
      <header className="flex-none w-full z-50">
        <Navbar />
      </header>
      
      <main className="flex-grow flex flex-col w-full relative z-10 pt-24 md:pt-32 pb-20">
        <Hero />
        
        <Suspense fallback={<div className="h-32 flex items-center justify-center text-orange-500/50">Загрузка...</div>}>
          <DownloadSection />
          <Roadmap />
          <AuditPoints onPointClick={setSelectedPoint} />
          <MarketingAudit />
          <RoiSection />
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
