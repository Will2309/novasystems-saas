'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SoftwareSystem, IndustryCategory, CurrencyCode } from '@/types';
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SystemsCatalog } from '@/components/landing/SystemsCatalog';
import { DevQaSection } from '@/components/landing/DevQaSection';
import { ContactSection } from '@/components/landing/ContactSection';
import { Footer } from '@/components/landing/Footer';
import { LiveDemoModal } from '@/components/landing/LiveDemoModal';
import { INITIAL_SYSTEMS } from '@/lib/mock-data';

export default function HomePage() {
  const [systems, setSystems] = useState<SoftwareSystem[]>(INITIAL_SYSTEMS);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategory>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [activeDemoSystem, setActiveDemoSystem] = useState<SoftwareSystem | null>(null);
  const [quoteTargetSystem, setQuoteTargetSystem] = useState<SoftwareSystem | null>(null);

  // Fetch latest systems & settings on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [sysRes, settingsRes] = await Promise.all([
          fetch('/api/systems'),
          fetch('/api/settings'),
        ]);

        const sysData = await sysRes.json();
        const settingsData = await settingsRes.json();

        if (sysData.success && Array.isArray(sysData.data)) {
          setSystems(sysData.data);
        }

        if (settingsData.success && settingsData.data?.currency) {
          setCurrency(settingsData.data.currency);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }
    loadData();
  }, []);

  // Filtered systems memoized
  const filteredSystems = useMemo(() => {
    return systems.filter((s) => {
      const matchesCategory = selectedCategory === 'Todos' || s.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        s.title.toLowerCase().includes(q) ||
        s.targetBusiness.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.techStack.some((t) => t.toLowerCase().includes(q)) ||
        s.modules.some((m) => m.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [systems, selectedCategory, searchQuery]);

  // Handler when user clicks "PROBAR DEMO"
  const handleOpenDemo = async (sys: SoftwareSystem) => {
    setActiveDemoSystem(sys);

    // Track demo click in API asynchronously
    try {
      await fetch('/api/demos/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemId: sys.id }),
      });

      // Update local state views counter immediately
      setSystems((prev) =>
        prev.map((item) =>
          item.id === sys.id
            ? { ...item, metrics: { ...item.metrics, demoViews: item.metrics.demoViews + 1 } }
            : item
        )
      );
    } catch (err) {
      console.error('Error tracking demo click:', err);
    }
  };

  // Handler when user clicks "Cotizar" or selects quote
  const handleRequestQuote = (sys: SoftwareSystem) => {
    setQuoteTargetSystem(sys);
    const contactEl = document.getElementById('contacto');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070d17] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      <main className="flex-1">
        {/* Hero with live metrics and industry filters */}
        <HeroSection
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Dynamic Catalog with Currency Selector */}
        <SystemsCatalog
          systems={filteredSystems}
          currency={currency}
          onCurrencyChange={setCurrency}
          onOpenDemo={handleOpenDemo}
          onRequestQuote={handleRequestQuote}
        />

        {/* Dev & QA Dual Architecture Section with Interactive Team Profiles & Dynamic Hover Counters */}
        <DevQaSection />

        {/* Contact, Dynamic WhatsApp & FAQs */}
        <ContactSection
          systems={systems}
          preselectedSystem={quoteTargetSystem}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Live Interactive Sandbox Demo Modal */}
      {activeDemoSystem && (
        <LiveDemoModal
          system={activeDemoSystem}
          onClose={() => setActiveDemoSystem(null)}
          onRequestQuote={handleRequestQuote}
        />
      )}
    </div>
  );
}
