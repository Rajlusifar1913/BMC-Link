import React from "react";
import { Users, Link, MousePointerClick, Star } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    icon: <Users className="w-5 h-5 text-nu-purple" />,
    value: "10,000+",
    label: "Active Creators",
  },
  {
    icon: <Link className="w-5 h-5 text-nu-purple" />,
    value: "50,000+",
    label: "Links Shared",
  },
  {
    icon: <MousePointerClick className="w-5 h-5 text-nu-purple" />,
    value: "1M+",
    label: "Monthly Clicks",
  },
  {
    icon: <Star className="w-5 h-5 text-nu-purple" />,
    value: "99.9%",
    label: "Uptime Reliability",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 20 },
  },
};

export function SocialProof() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-40px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((s, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col items-center text-center p-6 bg-nu-bg rounded-3xl border border-gray-100/80 shadow-sm"
            >
              <div className="w-10 h-10 rounded-2xl bg-nu-purple-soft flex items-center justify-center mb-3 shadow-inner">
                {s.icon}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-nu-charcoal">
                {s.value}
              </p>
              <p className="text-xs text-nu-muted font-semibold mt-1">
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
