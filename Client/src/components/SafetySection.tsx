import React from "react";
import { ShieldCheck, Lock, Key, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface SafetySectionProps {
  onOpenSafetyModal?: (type: string) => void;
}

export function SafetySection({ onOpenSafetyModal }: SafetySectionProps) {
  return (
    <section id="safety" className="py-20 bg-nu-ultraviolet text-white relative overflow-hidden">
      {/* Ambient background glow */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-96 h-96 bg-nu-purple/25 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 text-purple-200 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold w-fit">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Security & Privacy First</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Your creator data is safe with us.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
              We employ strict security practices: HTTP-only cookies prevent token theft via JavaScript, CSRF protection secures endpoints, and explicit OAuth 2.0 keeps your Google credentials private.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenSafetyModal?.("privacy")}
                className="flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3.5 rounded-2xl border border-white/10 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>Privacy Policy & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onOpenSafetyModal?.("tokens")}
                className="flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3.5 rounded-2xl border border-white/10 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  <span>Token Rotation & Cookies</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </motion.button>
            </div>
          </motion.div>

          {/* Right Card Scroll Reveal */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-md flex flex-col gap-6 shadow-2xl"
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Zero Token Leakage</h4>
                <p className="text-xs text-gray-400">Tokens never stored in localStorage</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">OAuth 2.0 Protection</h4>
                <p className="text-xs text-gray-400">Direct auth integration via Google</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Single-Click Device Logout</h4>
                <p className="text-xs text-gray-400">Invalidate session across all devices anytime</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
