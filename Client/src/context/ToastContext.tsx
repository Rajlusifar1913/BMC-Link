import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

// ─── Icon & Style Maps ────────────────────────────────────────────────────────

const TOAST_STYLES: Record<ToastType, { wrapper: string; icon: React.ReactNode }> = {
  success: {
    wrapper: "bg-white border border-green-200 shadow-lg",
    icon: <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />,
  },
  error: {
    wrapper: "bg-white border border-red-200 shadow-lg",
    icon: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
  },
  info: {
    wrapper: "bg-white border border-nu-purple/30 shadow-lg",
    icon: <Info className="w-5 h-5 text-nu-purple shrink-0" />,
  },
  warning: {
    wrapper: "bg-white border border-amber-200 shadow-lg",
    icon: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  },
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `toast-${Date.now()}-${++counterRef.current}`;
      const newToast: Toast = { id, type, message };
      setToasts((prev) => [...prev.slice(-4), newToast]); // max 5 visible
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  const success = useCallback((msg: string) => toast(msg, "success"), [toast]);
  const error = useCallback((msg: string) => toast(msg, "error"), [toast]);
  const info = useCallback((msg: string) => toast(msg, "info"), [toast]);
  const warning = useCallback((msg: string) => toast(msg, "warning"), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning }}>
      {children}

      {/* Toast Viewport */}
      <div
        className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const style = TOAST_STYLES[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl px-4 py-3.5 ${style.wrapper}`}
              >
                {style.icon}
                <p className="text-sm font-medium text-nu-charcoal flex-1 leading-snug">
                  {t.message}
                </p>
                <button
                  onClick={() => dismiss(t.id)}
                  className="p-0.5 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all shrink-0 -mt-0.5"
                  aria-label="Dismiss notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
