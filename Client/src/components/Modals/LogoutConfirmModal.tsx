import React, { useEffect } from "react";
import { LogOut, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
}

export function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with smooth fade & blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={loading ? undefined : onClose}
            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="relative z-10 bg-white dark:bg-[#180F26] border border-gray-200/80 dark:border-white/10 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl flex flex-col gap-5 text-center"
          >
            {/* Close Icon */}
            <button
              onClick={onClose}
              disabled={loading}
              className="absolute top-4 right-4 p-2 rounded-full text-nu-muted hover:text-nu-charcoal dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all disabled:opacity-40"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon Banner */}
            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
              <LogOut className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Header / Text */}
            <div className="flex flex-col gap-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-nu-charcoal dark:text-white tracking-tight">
                Confirm Sign Out
              </h3>
              <p className="text-xs sm:text-sm text-nu-muted dark:text-gray-300 leading-relaxed font-medium">
                Are you sure you want to log out of BMC Link? You can log back in anytime with your account.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-full border border-gray-200 dark:border-white/15 text-nu-charcoal dark:text-gray-200 text-xs sm:text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-md hover:shadow-lg hover:shadow-rose-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing out…</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
