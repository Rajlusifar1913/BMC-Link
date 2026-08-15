import React from "react";
import { Shield, Zap, RefreshCw, Layout, Lock, Share2 } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="w-6 h-6 text-nu-purple" />,
    title: "Blazing Fast Loads",
    desc: "Optimized single-page architecture built with Vite and React for instantaneous page loads worldwide.",
  },
  {
    icon: <Shield className="w-6 h-6 text-nu-purple" />,
    title: "HTTP-Only Security",
    desc: "Protected by industry-standard JWT authentication stored in secure HTTP-only cookies against XSS.",
  },
  {
    icon: <RefreshCw className="w-6 h-6 text-nu-purple" />,
    title: "Instant Live Updates",
    desc: "Any edit to your title, URL, or visibility is immediately synced and reflected on your public profile.",
  },
  {
    icon: <Layout className="w-6 h-6 text-nu-purple" />,
    title: "Responsive Aesthetics",
    desc: "Looks stunning across all screens — from mobile phones to high-resolution desktop monitors.",
  },
  {
    icon: <Lock className="w-6 h-6 text-nu-purple" />,
    title: "Google OAuth 2.0",
    desc: "One-click authentication with Google. No passwords to remember or compromise.",
  },
  {
    icon: <Share2 className="w-6 h-6 text-nu-purple" />,
    title: "Easy Sharing",
    desc: "Copy your clean public username URL with one click and add it to all your social media bios.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ProductFeatureGrid() {
  return (
    <section id="features" className="py-20 bg-nu-bg overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-nu-charcoal tracking-tight">
            Built for security, speed, and simplicity
          </h2>
          <p className="text-base text-nu-muted mt-3 font-medium">
            Powerful features designed to give creators total control over their personal brand.
          </p>
        </motion.div>

        {/* Staggered Scroll Animation Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-nu-soft transition-all duration-300 flex flex-col gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-nu-purple-soft flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-nu-charcoal">{f.title}</h3>
              <p className="text-sm text-nu-muted leading-relaxed font-medium">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
