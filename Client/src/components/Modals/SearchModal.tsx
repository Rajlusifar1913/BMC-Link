import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/${encodeURIComponent(query.trim().replace(/^@/, ""))}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-nu-charcoal/50 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-nu-elevated overflow-hidden p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-nu-charcoal">
            <Search className="w-5 h-5 text-nu-purple" />
            <span>Search Creator Profile</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 text-nu-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter username (e.g. alexcreator)"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-nu-charcoal focus:outline-none focus:ring-2 focus:ring-nu-purple/30"
            autoFocus
          />
          <button
            type="submit"
            className="bg-nu-purple hover:bg-nu-purple-hover text-white text-sm font-semibold rounded-xl px-5 py-2.5"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
