import React from "react";
import { ShieldCheck } from "lucide-react";

interface CpfModalProps {
  isOpen: boolean;
  cpfValue: string;
  onClose: () => void;
}

export function CpfModal({ isOpen, cpfValue, onClose }: CpfModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-nu-charcoal/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-nu-elevated overflow-hidden p-6 flex flex-col gap-4 text-center items-center">
        <div className="w-12 h-12 rounded-full bg-nu-purple-soft flex items-center justify-center text-nu-purple">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-nu-charcoal">Account Verification</h3>
        <p className="text-xs text-nu-muted">
          Verification check for account identifier: <span className="font-mono font-bold text-nu-charcoal">{cpfValue || "Verified"}</span>
        </p>
        <button
          onClick={onClose}
          className="w-full bg-nu-purple hover:bg-nu-purple-hover text-white text-sm font-semibold rounded-full py-2.5 mt-2"
        >
          Close
        </button>
      </div>
    </div>
  );
}
