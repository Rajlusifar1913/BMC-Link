import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ProductFeatureGrid } from "@/components/ProductFeatureGrid";
import { NewsCarousel } from "@/components/NewsCarousel";
import { SafetySection } from "@/components/SafetySection";
import { SocialProof } from "@/components/SocialProof";
import { Footer } from "@/components/Footer";

import { SearchModal } from "@/components/Modals/SearchModal";
import { CpfModal } from "@/components/Modals/CpfModal";
import { SafetyModal } from "@/components/Modals/SafetyModal";

export function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCpfOpen, setIsCpfOpen] = useState(false);
  const [cpfValue, setCpfValue] = useState("");

  const [safetyModalType, setSafetyModalType] = useState<string | null>(null);

  const handleContinueCpf = (cpf: string) => {
    setCpfValue(cpf);
    setIsCpfOpen(true);
  };

  return (
    <div className="min-h-screen bg-nu-bg flex flex-col font-sans selection:bg-nu-purple selection:text-white">
      {/* Sticky Header / Navigation */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenCpf={() => {
          setCpfValue("");
          setIsCpfOpen(true);
        }}
      />

      {/* Main Page Layout Flow */}
      <main className="flex-grow">
        {/* 1. Hero Section */}
        <Hero onContinueCpf={handleContinueCpf} />

        {/* 2. Interactive Tabbed Product Showcase */}
        <ProductShowcase />

        {/* 3. Product Feature Grid */}
        <ProductFeatureGrid />

        {/* 4. News & Updates Carousel */}
        <NewsCarousel />

        {/* 5. Safety Priority Section */}
        <SafetySection
          onOpenSafetyModal={(type) => setSafetyModalType(type)}
        />

        {/* 6. Social Proof & Customer Statistics */}
        <SocialProof />
      </main>

      {/* Comprehensive Multi-column Footer */}
      <Footer />

      {/* Modals & Portals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CpfModal
        isOpen={isCpfOpen}
        cpfValue={cpfValue}
        onClose={() => setIsCpfOpen(false)}
      />

      <SafetyModal
        isOpen={!!safetyModalType}
        type={safetyModalType}
        onClose={() => setSafetyModalType(null)}
      />
    </div>
  );
}
