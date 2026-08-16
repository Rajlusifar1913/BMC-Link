import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Link2,
  AlertTriangle,
  Wand2,
} from "lucide-react";
import type { Link, LinkType, CreateLinkPayload, UpdateLinkPayload } from "@/lib/types";

// ─── Link type options ────────────────────────────────────────────────────────

const LINK_TYPES: { value: LinkType; label: string; icon: React.ReactNode }[] = [
  { value: "WEBSITE",   label: "Website",    icon: <Globe      className="w-4 h-4" /> },
  { value: "YOUTUBE",   label: "YouTube",    icon: <Youtube    className="w-4 h-4" /> },
  { value: "INSTAGRAM", label: "Instagram",  icon: <Instagram  className="w-4 h-4" /> },
  { value: "FACEBOOK",  label: "Facebook",   icon: <Facebook   className="w-4 h-4" /> },
  { value: "TWITTER",   label: "Twitter / X",icon: <Twitter    className="w-4 h-4" /> },
  { value: "GITHUB",    label: "GitHub",     icon: <Github     className="w-4 h-4" /> },
  { value: "CUSTOM",    label: "Custom",     icon: <Link2      className="w-4 h-4" /> },
];

// ─── URL → LinkType detection ─────────────────────────────────────────────────
//
// Maps known domain patterns to a LinkType.
// Returns null for unknown / generic URLs (→ WEBSITE or CUSTOM).

const URL_PATTERNS: { pattern: RegExp; type: LinkType }[] = [
  { pattern: /youtube\.com|youtu\.be/i,             type: "YOUTUBE" },
  { pattern: /instagram\.com/i,                     type: "INSTAGRAM" },
  { pattern: /facebook\.com|fb\.com|fb\.me/i,       type: "FACEBOOK" },
  { pattern: /twitter\.com|x\.com/i,                type: "TWITTER" },
  { pattern: /github\.com|github\.io/i,             type: "GITHUB" },
];

function detectTypeFromUrl(url: string): LinkType | null {
  if (!url) return null;
  let hostname: string;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    // Not a valid URL yet — try raw string matching
    hostname = url.replace(/^https?:\/\//, "").replace(/^www\./, "");
  }
  for (const { pattern, type } of URL_PATTERNS) {
    if (pattern.test(hostname)) return type;
  }
  return null; // generic site → keep whatever user chose or default WEBSITE
}

// ─── Mismatch check ───────────────────────────────────────────────────────────
//
// Returns true if the URL clearly belongs to a different known platform
// than what the user has selected. "CUSTOM" and "WEBSITE" never mismatch
// (they're intentionally generic).

function isMismatch(url: string, selectedType: LinkType): boolean {
  const detected = detectTypeFromUrl(url);
  if (!detected) return false;                       // unknown site — no mismatch
  if (selectedType === "CUSTOM" || selectedType === "WEBSITE") return false;
  return detected !== selectedType;
}

function getMismatchLabel(url: string): string {
  const detected = detectTypeFromUrl(url);
  const found = LINK_TYPES.find((lt) => lt.value === detected);
  return found?.label ?? "Unknown";
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddLinkModalProps {
  isOpen: boolean;
  editingLink?: Link | null;
  onClose: () => void;
  onSubmit: (payload: CreateLinkPayload | UpdateLinkPayload) => Promise<void>;
}

// ─── Default form state ───────────────────────────────────────────────────────

const defaultForm = (): CreateLinkPayload => ({
  title: "",
  url: "",
  type: "WEBSITE",
  icon: "",
  thumbnail: "",
  isFeatured: false,
  isActive: true,
});

// ─── Component ────────────────────────────────────────────────────────────────

export function AddLinkModal({
  isOpen,
  editingLink,
  onClose,
  onSubmit,
}: AddLinkModalProps) {
  const [form, setForm] = useState<CreateLinkPayload>(defaultForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Populate form when editing ───────────────────────────────────────────────

  useEffect(() => {
    if (editingLink) {
      setForm({
        title:       editingLink.title ?? "",
        url:         editingLink.url,
        type:        editingLink.type,
        icon:        editingLink.icon ?? "",
        thumbnail:   editingLink.thumbnail ?? "",
        isFeatured:  editingLink.isFeatured,
        isActive:    editingLink.isActive,
      });
    } else {
      setForm(defaultForm());
    }
    setError(null);
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  // ── Derived state ────────────────────────────────────────────────────────────

  const urlMismatch = form.url ? isMismatch(form.url, form.type) : false;
  const detectedLabel = form.url ? getMismatchLabel(form.url) : "";
  const detectedType = form.url ? detectTypeFromUrl(form.url) : null;

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  /**
   * Handle URL field changes with auto-detection:
   * When a URL is pasted/typed and belongs to a known platform,
   * automatically switch the type selector to match it.
   */
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const detected = detectTypeFromUrl(url);
    setForm((prev) => ({
      ...prev,
      url,
      // Auto-switch type only if we recognise the domain.
      // Never auto-override a manual CUSTOM selection.
      ...(detected && prev.type !== "CUSTOM" ? { type: detected } : {}),
    }));
  };

  /** One-click fix: apply the detected type */
  const applyDetectedType = () => {
    if (detectedType) {
      setForm((prev) => ({ ...prev, type: detectedType }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload: CreateLinkPayload = {
      ...form,
      title:     form.title?.trim()     || null,
      icon:      form.icon?.trim()      || null,
      thumbnail: form.thumbnail?.trim() || null,
    };

    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save link");
    } finally {
      setSubmitting(false);
    }
  };

  const isEditing = !!editingLink;

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          {/* Blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute inset-0 bg-nu-charcoal/40 backdrop-blur-sm"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 14 }}
            transition={{ type: "spring", damping: 28, stiffness: 380 }}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-nu-elevated overflow-hidden max-h-[90vh] flex flex-col"
          >

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-nu-charcoal">
              {isEditing ? "Edit Link" : "Add New Link"}
            </h2>
            <p className="text-xs text-nu-muted mt-0.5">
              {isEditing
                ? "Update your link details below."
                : "Paste your URL — we'll detect the platform automatically."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">

          {/* ── URL first — detection drives type ──────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
              URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="url"
              value={form.url}
              onChange={handleUrlChange}
              required
              placeholder="https://youtube.com/… or https://instagram.com/…"
              className={`w-full border rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 transition-all ${
                urlMismatch
                  ? "border-amber-400 focus:ring-amber-300 focus:border-amber-400"
                  : "border-gray-200 focus:ring-nu-purple/30 focus:border-nu-purple"
              }`}
            />

            {/* Auto-detected type badge */}
            {!urlMismatch && detectedType && detectedType !== "WEBSITE" && (
              <p className="text-xs text-nu-purple flex items-center gap-1 font-medium">
                <Wand2 className="w-3.5 h-3.5" />
                Detected as <span className="font-bold">{detectedLabel}</span> — type set automatically
              </p>
            )}

            {/* Mismatch warning */}
            {urlMismatch && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-amber-800">
                    Link type mismatch
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                    This URL looks like a <strong>{detectedLabel}</strong> link, but you selected{" "}
                    <strong>{LINK_TYPES.find((lt) => lt.value === form.type)?.label}</strong>.
                    It will be saved with the wrong icon.
                  </p>
                  {detectedType && (
                    <button
                      type="button"
                      onClick={applyDetectedType}
                      className="mt-1.5 text-xs font-bold text-amber-700 underline hover:text-amber-900 transition-colors"
                    >
                      Switch to {detectedLabel} →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Link Type Selector ─────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
              Link Type <span className="text-red-500">*</span>
              <span className="ml-1.5 text-nu-muted font-normal normal-case tracking-normal">
                (auto-detected from URL)
              </span>
            </label>

            {/* Visual pill selector */}
            <div className="grid grid-cols-4 gap-2">
              {LINK_TYPES.map((lt) => (
                <button
                  key={lt.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type: lt.value }))}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-2 text-[11px] font-semibold transition-all ${
                    form.type === lt.value
                      ? "border-nu-purple bg-nu-purple-soft text-nu-purple shadow-sm"
                      : "border-gray-200 text-nu-muted hover:border-nu-purple/40 hover:text-nu-purple hover:bg-nu-purple-soft/50"
                  }`}
                >
                  {lt.icon}
                  {lt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Title ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={form.title ?? ""}
              onChange={handleChange}
              placeholder="Display title (optional)"
              maxLength={100}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>

          {/* ── Icon URL ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
              Custom Icon URL
            </label>
            <input
              type="url"
              name="icon"
              value={form.icon ?? ""}
              onChange={handleChange}
              placeholder="https://… (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>

          {/* ── Thumbnail URL ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
              Thumbnail URL
            </label>
            <input
              type="url"
              name="thumbnail"
              value={form.thumbnail ?? ""}
              onChange={handleChange}
              placeholder="https://… (optional)"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>

          {/* ── Checkboxes ───────────────────────────────────────────────── */}
          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive ?? true}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-nu-purple cursor-pointer"
              />
              <span className="text-sm font-medium text-nu-charcoal">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured ?? false}
                onChange={handleChange}
                className="w-4 h-4 rounded accent-nu-purple cursor-pointer"
              />
              <span className="text-sm font-medium text-nu-charcoal">Featured</span>
            </label>
          </div>

          {/* ── Submit Error ─────────────────────────────────────────────── */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* ── Actions ──────────────────────────────────────────────────── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-200 text-nu-muted font-semibold rounded-full py-2.5 text-sm hover:border-gray-300 hover:text-nu-charcoal transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full py-2.5 text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving…"
                : isEditing
                ? "Save Changes"
                : "Add Link"}
            </button>
          </div>
        </form>
        </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
