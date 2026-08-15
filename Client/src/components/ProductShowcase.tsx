import React, { useState, useRef } from "react";
import {
  Link2,
  Palette,
  BarChart3,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";

const tabs = [
  {
    id: "links",
    label: "Link Management",
    icon: <Link2 className="w-4 h-4" />,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [demoColor, setDemoColor] = useState("#820AD1");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Map vertical scroll progress to horizontal translation (3 slides = 300% width)
  const translateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["0%", "-33.333%", "-66.666%"]
  );

  // Smooth scroll progress bar width
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Update active tab button indicator as user scrolls
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.33) {
      setActiveTabIdx(0);
    } else if (latest < 0.66) {
      setActiveTabIdx(1);
    } else {
      setActiveTabIdx(2);
    }
  });

  const handleTabClick = (index: number) => {
    setActiveTabIdx(index);
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;
    const targetScroll = containerTop + scrollableDistance * (index / 2);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      id="showcase"
      ref={containerRef}
      className="relative h-[250vh] bg-white text-nu-charcoal"
    >
      <div className="sticky top-0 h-screen flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto pt-2 sm:pt-4 shrink-0">
          <div className="inline-flex items-center gap-2 bg-nu-purple-soft text-nu-purple px-4 py-1 rounded-full text-xs font-bold mb-2 border border-nu-purple/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Platform Showcase</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-nu-charcoal">
            Designed for seamless creator workflows
          </h2>
          <p className="text-xs sm:text-base text-nu-muted mt-1.5 font-medium">
            Scroll down to horizontally slide between feature tabs.
          </p>

          {/* Horizontal Scroll Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 flex-wrap">
            {tabs.map((t, idx) => {
              const isActive = activeTabIdx === idx;
              return (
                <button
                  key={t.id}
                  onClick={() => handleTabClick(idx)}
                  className={`relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? "text-white shadow-md shadow-nu-purple/20 scale-105"
                      : "bg-nu-bg text-nu-charcoal hover:bg-nu-purple-soft hover:text-nu-purple"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeShowcaseTab"
                      className="absolute inset-0 bg-nu-purple rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {t.icon}
                    <span>{t.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horizontal Sliding Track Window */}
        <div className="relative w-full my-auto overflow-hidden rounded-3xl border border-gray-100/90 bg-nu-bg p-4 sm:p-8 shadow-nu-soft">
          <motion.div
            style={{ x: translateX }}
            className="flex w-[300%] transition-transform duration-75 ease-out"
          >
            {/* ─── SLIDE 1: Link Management ─── */}
            <div className="w-1/3 px-3 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-nu-purple uppercase tracking-wider bg-nu-purple-soft px-3 py-1.5 rounded-lg w-fit">
                  <Link2 className="w-4 h-4" />
                  <span>Link Management</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-nu-charcoal">
                  {tabs[0].title}
                </h3>
                <p className="text-xs sm:text-sm text-nu-muted leading-relaxed font-medium">
                  {tabs[0].desc}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  {tabs[0].points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-nu-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-nu-purple shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Card 1 */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-nu-purple-soft flex items-center justify-center text-nu-purple font-extrabold text-base sm:text-lg shadow-inner">
                    B
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-nu-charcoal">@alexcreator</p>
                    <p className="text-[11px] sm:text-xs text-nu-muted">Designer & Digital Artist</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-3 bg-nu-purple-soft rounded-xl text-xs font-bold text-nu-purple flex justify-between items-center cursor-pointer"
                  >
                    <span>🎨 My Design Portfolio</span>
                    <span className="text-[10px] bg-white px-2 py-0.5 rounded-full shadow-xs">★ Featured</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-nu-charcoal flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  >
                    <span>📹 Latest YouTube Video</span>
                    <span className="text-[10px] text-nu-muted">1.4k clicks</span>
                  </motion.div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-3 bg-gray-50 rounded-xl text-xs font-bold text-nu-charcoal flex justify-between items-center cursor-pointer hover:bg-gray-100"
                  >
                    <span>📸 Instagram Profile</span>
                    <span className="text-[10px] text-nu-muted">950 clicks</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ─── SLIDE 2: Themes & Branding ─── */}
            <div className="w-1/3 px-3 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider bg-pink-50 px-3 py-1.5 rounded-lg w-fit">
                  <Palette className="w-4 h-4" />
                  <span>Themes & Branding</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-nu-charcoal">
                  {tabs[1].title}
                </h3>
                <p className="text-xs sm:text-sm text-nu-muted leading-relaxed font-medium">
                  {tabs[1].desc}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  {tabs[1].points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-nu-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Card 2 (Interactive Theme Customizer) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs font-bold text-nu-charcoal">
                    <Palette className="w-4 h-4 text-pink-500" />
                    <span>Live Theme Color Swatch</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 px-2 py-0.5 rounded text-nu-muted">
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
                        demoColor === c.color ? "scale-125 border-gray-800 shadow-md" : "border-transparent hover:scale-110"
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
            </div>

            {/* ─── SLIDE 3: Click Analytics ─── */}
            <div className="w-1/3 px-3 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                  <BarChart3 className="w-4 h-4" />
                  <span>Click Analytics</span>
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-nu-charcoal">
                  {tabs[2].title}
                </h3>
                <p className="text-xs sm:text-sm text-nu-muted leading-relaxed font-medium">
                  {tabs[2].desc}
                </p>
                <div className="flex flex-col gap-2 pt-1">
                  {tabs[2].points.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs sm:text-sm font-semibold text-nu-charcoal">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Card 3 (Analytics Dashboard Widget) */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-nu-card border border-gray-100 flex flex-col gap-3.5 max-w-md mx-auto w-full">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-nu-charcoal">Real-time Metrics</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-nu-bg p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-nu-muted font-medium">Total Clicks</p>
                    <p className="text-lg font-extrabold text-nu-charcoal mt-0.5">2,480</p>
                    <p className="text-[10px] font-semibold text-emerald-600 mt-0.5">↑ +18.4% this week</p>
                  </div>
                  <div className="bg-nu-bg p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-nu-muted font-medium">Top Link</p>
                    <p className="text-xs font-bold text-nu-purple truncate mt-0.5">Portfolio</p>
                    <p className="text-[10px] font-semibold text-nu-muted mt-0.5">1,240 clicks</p>
                  </div>
                </div>

                {/* Animated Chart Bars */}
                <div className="pt-1 flex flex-col gap-2">
                  <p className="text-[10px] font-bold text-nu-muted uppercase tracking-wider">Engagement by Platform</p>
                  {[
                    { name: "Portfolio", val: 85, color: "bg-nu-purple" },
                    { name: "YouTube", val: 65, color: "bg-red-500" },
                    { name: "Instagram", val: 45, color: "bg-pink-500" },
                  ].map((bar) => (
                    <div key={bar.name} className="flex flex-col gap-1">
                      <div className="flex justify-between text-[10px] font-semibold text-nu-charcoal">
                        <span>{bar.name}</span>
                        <span>{bar.val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${bar.val}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full ${bar.color} rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Progress Bar at Bottom of Section */}
        <div className="w-full max-w-xl mx-auto pt-2 flex flex-col items-center gap-1.5 shrink-0">
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              style={{ width: progressWidth }}
              className="h-full bg-gradient-to-r from-nu-purple via-pink-500 to-emerald-500 rounded-full"
            />
          </div>
          <div className="flex items-center justify-between w-full text-[11px] font-semibold text-nu-muted">
            <span>Scroll vertically to horizontally navigate tabs</span>
            <span>Tab {activeTabIdx + 1} of 3</span>
          </div>
        </div>
      </div>
    </section>
  );
}
