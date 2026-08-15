import React from "react";
import { X, ShieldCheck } from "lucide-react";

interface SafetyModalProps {
  isOpen: boolean;
  type: string | null;
  onClose: () => void;
}

export function SafetyModal({ isOpen, type, onClose }: SafetyModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-nu-charcoal/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-nu-elevated overflow-hidden p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2 font-bold text-nu-charcoal">
            <ShieldCheck className="w-5 h-5 text-nu-purple" />
            <span>{type === "privacy" ? "Privacy & Security Policy" : "Token & Session Security"}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-nu-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs text-nu-muted leading-relaxed flex flex-col gap-3">
          <p>
            BMC Link prioritizes user security and data privacy above all else. Our backend uses HTTP-only, secure, SameSite cookies to manage JWT access and refresh tokens.
          </p>
          <p>
            This ensures your credentials are protected from cross-site scripting (XSS) and unauthorized third-party access.
          </p>
        </div>

        <button
          onClick={onClose}
          className="bg-nu-purple hover:bg-nu-purple-hover text-white text-sm font-semibold rounded-full py-2.5 mt-2"
        >
          Understood
        </button>
      </div>
    </div>
  );
}
