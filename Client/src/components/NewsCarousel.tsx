import React from "react";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const news = [
  {
    tag: "Product Update",
    title: "Vite + React Migration Released",
    desc: "BMC Link frontend updated to modern SPA architecture with ultra-fast page transitions.",
    date: "August 2026",
  },
  {
    tag: "Feature",
    title: "Enhanced Link Analytics",
    desc: "Track link clicks, active visibility states, and user engagement metrics in real-time.",
    date: "July 2026",
  },
  {
    tag: "Security",
    title: "HTTP-Only Cookie Rotation",
    desc: "Upgraded authentication flow with silent token rotation and multi-device session management.",
    date: "June 2026",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function NewsCarousel() {
  return (
    <section className="py-20 bg-white border-t border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-nu-purple uppercase tracking-wider bg-nu-purple-soft px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What&apos;s New</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-nu-charcoal">
              Platform News & Updates
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="bg-nu-bg dark:bg-[#180F26] rounded-3xl p-6 border border-gray-100/80 dark:border-white/10 shadow-sm hover:border-nu-purple/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-4"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs font-bold text-nu-muted">
                  <span className="text-nu-purple bg-white px-3 py-1 rounded-full border border-gray-100 shadow-xs">
                    {item.tag}
                  </span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-base font-bold text-nu-charcoal pt-2">
                  {item.title}
                </h3>
                <p className="text-xs text-nu-muted leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-nu-purple hover:underline gap-1 pt-2 cursor-pointer group">
                <span>Read announcement</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
