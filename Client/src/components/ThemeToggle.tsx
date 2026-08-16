import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";

interface ThemeToggleProps {
  /** If true, renders as fixed floating button at corner */
  floating?: boolean;
  className?: string;
}

export function ThemeToggle({ floating = false, className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const buttonContent = (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative flex items-center justify-center transition-all focus:outline-none ${
        floating
          ? "w-12 h-12 rounded-2xl bg-white dark:bg-[#1E1530] text-nu-charcoal dark:text-amber-400 border border-gray-200 dark:border-white/15 shadow-xl hover:shadow-nu-glow"
          : "p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white"
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center text-amber-400"
          >
            <Sun className="w-4.5 h-4.5 fill-amber-400/20" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center text-nu-purple"
          >
            <Moon className="w-4.5 h-4.5 fill-nu-purple/20" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  if (floating) {
    return (
      <div className="fixed top-4 right-4 sm:top-5 sm:right-6 z-50 flex items-center gap-2.5 group">
        {/* Hover Tooltip Pill */}
        <div className="hidden sm:block opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 bg-black/85 dark:bg-white/95 text-white dark:text-nu-charcoal text-[11px] font-bold px-3 py-1.5 rounded-full shadow-xl whitespace-nowrap border border-white/10 dark:border-black/10 backdrop-blur-sm">
          {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </div>
        {buttonContent}
      </div>
    );
  }

  return buttonContent;
}
