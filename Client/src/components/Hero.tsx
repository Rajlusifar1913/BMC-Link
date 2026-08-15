import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Layers } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  onContinueCpf?: (cpf: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export function Hero({ onContinueCpf: _onContinueCpf }: HeroProps) {
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (handle.trim()) {
      navigate(`/login?username=${encodeURIComponent(handle.trim())}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden">
      {/* Animated Floating Glow Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.18, 0.1],
          y: [0, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-nu-purple/15 rounded-full blur-[140px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-72 h-72 bg-purple-300/25 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          className="flex flex-col items-center text-center gap-8 max-w-3xl mx-auto"
        >
          {/* Tagline Pill */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 bg-nu-purple-soft border border-nu-purple/20 px-4 py-2 rounded-full text-xs font-bold text-nu-purple shadow-sm"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>The Next-Gen Link-in-Bio for Creators</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-extrabold text-nu-charcoal tracking-tight leading-[1.1]"
          >
            Everything you are, in{" "}
            <span className="bg-gradient-to-r from-nu-purple via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              one simple link.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-xl text-nu-muted leading-relaxed font-medium max-w-2xl"
          >
            Join thousands of creators, artists, and builders sharing their work, social profiles, products, and links effortlessly.
          </motion.p>

          {/* Claim Handle Bar */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleClaim}
            className="w-full max-w-md flex items-center bg-white p-2 rounded-full shadow-nu-card border border-gray-100/90 focus-within:ring-2 focus-within:ring-nu-purple/30 transition-all"
          >
            <div className="pl-4 text-nu-muted font-bold text-sm select-none">
              bmclink.com/
            </div>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="yourname"
              className="w-full bg-transparent border-none text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none px-2 font-semibold"
            />
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              className="bg-nu-purple hover:bg-nu-purple-hover text-white font-bold text-sm px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-1.5 shadow-md"
            >
              <span>Claim</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.form>

          {/* Feature Badges */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-nu-muted"
          >
            <div className="flex items-center gap-1.5 hover:text-nu-purple transition-colors">
              <Zap className="w-4 h-4 text-nu-purple" />
              <span>Instant Setup</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-nu-purple transition-colors">
              <ShieldCheck className="w-4 h-4 text-nu-purple" />
              <span>Secure Auth</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-nu-purple transition-colors">
              <Globe className="w-4 h-4 text-nu-purple" />
              <span>Custom Subdomain</span>
            </div>
            <div className="flex items-center gap-1.5 hover:text-nu-purple transition-colors">
              <Layers className="w-4 h-4 text-nu-purple" />
              <span>Analytics Ready</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
