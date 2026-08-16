import React, { useState } from "react";
import {
  Link2,
  Palette,
  BarChart3,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  {
    id: "links",
    label: "Link Management",
    icon: <Link2 className="w-4 h-4" />,
    badgeColor: "bg-nu-purple-soft dark:bg-nu-purple/20 text-nu-purple",
    title: "Organize all your digital touchpoints",
    desc: "Easily add, reorder, feature, or temporarily disable links with real-time preview and custom click tracking.",
    points: [
      "Custom titles and platform icon auto-matching",
      "Featured link highlighting for important announcements",
      "One-tap toggle visibility without deleting links",
      "Instant duplication and position ordering",
    ],
  },
  {
    id: "themes",
    label: "Themes & Branding",
    icon: <Palette className="w-4 h-4" />,
    badgeColor: "bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400",
    title: "Make your page uniquely yours",
    desc: "Customize accent colors, profile avatars, cover banners, bios, and headlines to align with your brand identity.",
    points: [
      "Vibrant hex accent color picker",
      "High-res cover photos and profile avatars",
      "Bio and tagline customization",
      "Light and dark glassmorphic themes",
    ],
  },
  {
    id: "analytics",
    label: "Click Analytics",
    icon: <BarChart3 className="w-4 h-4" />,
    badgeColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
    title: "Understand audience engagement",
    desc: "Monitor click counts per link and evaluate which content drives the most conversion from your audience.",
    points: [
      "Real-time click counters for every link",
      "Sort links by total engagement",
      "Track top performing platforms",
      "Clean privacy-preserving metric logs",
    ],
  },
];

export function ProductShowcase() {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [demoColor, setDemoColor] = useState("#820AD1");

  const currentTab = tabs[activeTabIdx];

  const nextTab = () => {
    setActiveTabIdx((prev) => (prev + 1) % tabs.length);
  };

  const prevTab = () => {
    setActiveTabIdx((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  return (
    <section
      id="showcase"
      className="py-16 sm:py-24 bg-white dark:bg-[#0C0614] text-nu-charcoal dark:text-white relative overflow-hidden transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-nu-purple-soft dark:bg-nu-purple/20 text-nu-purple px-4 py-1.5 rounded-full text-xs font-bold border border-nu-purple/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Platform Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-nu-charcoal dark:text-white">
            Designed for seamless creator workflows
          </h2>
          <p className="text-xs sm:text-sm text-nu-muted dark:text-gray-400 font-medium max-w-lg">
            Use the arrows on the left and right of the box to navigate between sub-tabs.
          </p>

          {/* Active Sub-Tab Pill Indicator */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/10 text-nu-charcoal dark:text-white text-xs font-bold mt-2 border border-gray-200/60 dark:border-white/10 shadow-xs">
            {currentTab.icon}
            <span>{currentTab.label}</span>
            <span className="text-[10px] text-nu-muted dark:text-gray-400 ml-1">
              ({activeTabIdx + 1} of {tabs.length})
            </span>
          </div>
        </div>

        {/* Content Display Box with Left and Right Navigation Arrows */}
        <div className="relative w-full">
          {/* Left Arrow Button */}
          <button
            onClick={prevTab}
            aria-label="Previous sub-tab"
            title="Previous sub-tab"
            className="absolute left-2 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white dark:bg-[#1C122E] border border-gray-200 dark:border-white/15 shadow-xl flex items-center justify-center text-nu-charcoal dark:text-white hover:text-nu-purple hover:bg-nu-purple-soft/50 dark:hover:bg-white/15 hover:scale-110 active:scale-95 transition-all focus:outline-none"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={nextTab}
            aria-label="Next sub-tab"
            title="Next sub-tab"
            className="absolute right-2 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white dark:bg-[#1C122E] border border-gray-200 dark:border-white/15 shadow-xl flex items-center justify-center text-nu-charcoal dark:text-white hover:text-nu-purple hover:bg-nu-purple-soft/50 dark:hover:bg-white/15 hover:scale-110 active:scale-95 transition-all focus:outline-none"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Main Showcase Box */}
          <div className="w-full rounded-3xl border border-gray-100 dark:border-white/10 bg-nu-bg dark:bg-[#140B23] p-6 sm:p-12 shadow-nu-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabIdx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
              >
                {/* Left Column: Feature Details */}
                <div className="flex flex-col gap-4 sm:gap-5">
                  <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg w-fit ${currentTab.badgeColor}`}>
                    {currentTab.icon}
                    <span>{currentTab.label}</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-nu-charcoal dark:text-white">
                    {currentTab.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-nu-muted dark:text-gray-400 leading-relaxed font-medium">
                    {currentTab.desc}
                  </p>
                  <div className="flex flex-col gap-2.5 pt-1">
                    {currentTab.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-nu-charcoal dark:text-gray-200">
                        <CheckCircle2 className="w-4 h-4 text-nu-purple shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Dynamic Interactive Mockups */}
                <div>
                  {/* ─── SLIDE 0: Link Management Mockup ─── */}
                  {activeTabIdx === 0 && (
                    <div className="bg-white dark:bg-[#180F26] rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 dark:border-white/10 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                      <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-white/10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-nu-purple-soft dark:bg-nu-purple/20 flex items-center justify-center text-nu-purple font-extrabold text-base sm:text-lg shadow-inner">
                          B
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-nu-charcoal dark:text-white">@alexcreator</p>
                          <p className="text-[11px] sm:text-xs text-nu-muted dark:text-gray-400">Designer & Digital Artist</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div
                          className="p-3 bg-nu-purple-soft dark:bg-nu-purple/20 rounded-xl text-xs font-bold text-nu-purple flex justify-between items-center cursor-pointer hover:bg-nu-purple/25 transition-colors"
                        >
                          <span>🎨 My Design Portfolio</span>
                          <span className="text-[10px] bg-white dark:bg-white/10 px-2 py-0.5 rounded-full shadow-xs">★ Featured</span>
                        </div>
                        <div
                          className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-nu-charcoal dark:text-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                          <span>📹 Latest YouTube Video</span>
                          <span className="text-[10px] text-nu-muted dark:text-gray-400">1.4k clicks</span>
                        </div>
                        <div
                          className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-xs font-bold text-nu-charcoal dark:text-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        >
                          <span>📸 Instagram Profile</span>
                          <span className="text-[10px] text-nu-muted dark:text-gray-400">950 clicks</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── SLIDE 1: Themes & Branding Mockup ─── */}
                  {activeTabIdx === 1 && (
                    <div className="bg-white dark:bg-[#180F26] rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 dark:border-white/10 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2 text-xs font-bold text-nu-charcoal dark:text-white">
                          <Palette className="w-4 h-4 text-pink-500" />
                          <span>Live Theme Color Swatch</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded text-nu-muted dark:text-gray-300">
                          Interactive
                        </span>
                      </div>

                      {/* Accent Color Swatches */}
                      <div className="flex items-center justify-center gap-3 py-1">
                        {[
                          { color: "#820AD1", label: "Nu Purple" },
                          { color: "#EC4899", label: "Hot Pink" },
                          { color: "#10B981", label: "Emerald" },
                          { color: "#3B82F6", label: "Blue" },
                          { color: "#F59E0B", label: "Amber" },
                        ].map((c) => (
                          <button
                            key={c.color}
                            onClick={() => setDemoColor(c.color)}
                            className={`w-7 h-7 rounded-full transition-transform border-2 ${
                              demoColor === c.color ? "scale-125 border-gray-800 dark:border-white shadow-md" : "border-transparent hover:scale-110"
                            }`}
                            style={{ backgroundColor: c.color }}
                            title={c.label}
                          />
                        ))}
                      </div>

                      {/* Custom Styled Profile Card */}
                      <div
                        className="rounded-2xl p-4 sm:p-5 text-white transition-all duration-300 shadow-md flex flex-col gap-3"
                        style={{
                          background: `linear-gradient(135deg, ${demoColor}, ${demoColor}cc)`,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white border border-white/30">
                            B
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-white">@alexcreator</p>
                            <p className="text-[10px] text-white/80">Custom Brand Identity</p>
                          </div>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md rounded-xl p-2.5 text-xs font-bold border border-white/20 flex justify-between items-center">
                          <span>✨ Exclusive Merchandise</span>
                          <ChevronRight className="w-4 h-4 text-white/80" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ─── SLIDE 2: Click Analytics Mockup ─── */}
                  {activeTabIdx === 2 && (
                    <div className="bg-white dark:bg-[#180F26] rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 dark:border-white/10 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-nu-charcoal dark:text-white">Real-time Metrics</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-nu-bg dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                          <p className="text-[10px] text-nu-muted dark:text-gray-400 font-medium">Total Clicks</p>
                          <p className="text-lg font-extrabold text-nu-charcoal dark:text-white mt-0.5">2,480</p>
                          <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">↑ +18.4% this week</p>
                        </div>
                        <div className="bg-nu-bg dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                          <p className="text-[10px] text-nu-muted dark:text-gray-400 font-medium">Top Link</p>
                          <p className="text-xs font-bold text-nu-purple truncate mt-0.5">Portfolio</p>
                          <p className="text-[10px] font-semibold text-nu-muted dark:text-gray-400 mt-0.5">1,240 clicks</p>
                        </div>
                      </div>

                      {/* Animated Chart Bars */}
                      <div className="pt-1 flex flex-col gap-2">
                        <p className="text-[10px] font-bold text-nu-muted dark:text-gray-400 uppercase tracking-wider">Engagement by Platform</p>
                        {[
                          { name: "Portfolio", val: 85, color: "bg-nu-purple" },
                          { name: "YouTube", val: 65, color: "bg-red-500" },
                          { name: "Instagram", val: 45, color: "bg-pink-500" },
                        ].map((bar) => (
                          <div key={bar.name} className="flex flex-col gap-1">
                            <div className="flex justify-between text-[10px] font-semibold text-nu-charcoal dark:text-gray-200">
                              <span>{bar.name}</span>
                              <span>{bar.val}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${bar.val}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className={`h-full ${bar.color} rounded-full`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
