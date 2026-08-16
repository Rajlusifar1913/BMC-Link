import React, { useState, useRef, useEffect } from "react";
import {
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Link2,
  Star,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  Copy,
  MousePointerClick,
  Loader2,
} from "lucide-react";
import type { Link } from "@/lib/types";

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const LINK_ICONS: Record<string, React.ReactNode> = {
  WEBSITE:   <Globe     className="w-4 h-4" />,
  YOUTUBE:   <Youtube   className="w-4 h-4" />,
  INSTAGRAM: <Instagram className="w-4 h-4" />,
  FACEBOOK:  <Facebook  className="w-4 h-4" />,
  TWITTER:   <Twitter   className="w-4 h-4" />,
  GITHUB:    <Github    className="w-4 h-4" />,
  CUSTOM:    <Link2     className="w-4 h-4" />,
};

const LINK_COLORS: Record<string, string> = {
  WEBSITE:   "bg-blue-50 text-blue-600",
  YOUTUBE:   "bg-red-50 text-red-600",
  INSTAGRAM: "bg-pink-50 text-pink-600",
  FACEBOOK:  "bg-blue-50 text-blue-700",
  TWITTER:   "bg-sky-50 text-sky-600",
  GITHUB:    "bg-gray-100 text-gray-800",
  CUSTOM:    "bg-nu-purple-soft text-nu-purple",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  /** Must return a Promise so we can show a loading state and catch errors */
  onDelete: (id: string) => Promise<void>;
  onToggle: (id: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

function LinkCardComponent({
  link,
  onEdit,
  onDelete,
  onToggle,
  onDuplicate,
}: LinkCardProps) {
  // Delete requires two clicks — first click shows a labelled confirmation zone
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
    };
  }, []);

  // ── Delete Flow ───────────────────────────────────────────────────────────────

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      // First click: arm the confirmation
      setConfirmingDelete(true);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      // Auto-cancel after 4 s if user doesn't confirm
      deleteTimerRef.current = setTimeout(() => setConfirmingDelete(false), 4000);
      return;
    }
    // Second click: actually delete
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    void handleDeleteConfirm();
  };

  const handleDeleteConfirm = async () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setDeleting(true);
    try {
      await onDelete(link.id);
      // Card will be removed from parent list — no need to reset state
    } catch {
      // Error already toasted by parent; reset UI so user can retry
      setDeleting(false);
      setConfirmingDelete(false);
    }
  };

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    setConfirmingDelete(false);
  };

  // ── Toggle Flow ───────────────────────────────────────────────────────────────

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onToggle(link.id);
    } finally {
      setToggling(false);
    }
  };

  // ── Duplicate Flow ────────────────────────────────────────────────────────────

  const handleDuplicate = async () => {
    setDuplicating(true);
    try {
      await onDuplicate(link.id);
    } finally {
      setDuplicating(false);
    }
  };

  const iconClass = LINK_COLORS[link.type] ?? LINK_COLORS.CUSTOM;
  // clickCount comes from the API as a number; default to 0 if missing
  const clicks = link.clickCount ?? 0;

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-sm hover:shadow-nu-card ${
        link.isActive
          ? "border-gray-100 hover:border-nu-purple/20"
          : "border-dashed border-gray-200 opacity-60"
      }`}
    >
      {/* ── Main Row ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 p-4">

        {/* Type Icon */}
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconClass}`}
        >
          {LINK_ICONS[link.type]}
        </div>

        {/* Link Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-nu-charcoal truncate">
              {link.title ?? <span className="italic text-nu-muted">Untitled</span>}
            </p>
            {link.isFeatured && (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
            )}
          </div>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-nu-muted hover:text-nu-purple transition-colors truncate block"
          >
            {link.url}
          </a>
        </div>

        {/* Click Count — right side badge, always visible */}
        <div className="flex flex-col items-center justify-center shrink-0 min-w-[52px] bg-nu-purple-soft rounded-xl px-2.5 py-1.5 gap-0.5">
          <MousePointerClick className="w-3.5 h-3.5 text-nu-purple shrink-0" />
          <span className="text-sm font-extrabold text-nu-purple leading-none">{clicks}</span>
          <span className="text-[9px] font-semibold text-nu-purple/60 uppercase tracking-wider leading-none">clicks</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Toggle Active */}
          <button
            id={`toggle-${link.id}`}
            onClick={handleToggle}
            disabled={toggling}
            title={link.isActive ? "Deactivate" : "Activate"}
            className="p-2 rounded-full hover:bg-nu-purple-soft text-nu-muted hover:text-nu-purple transition-all disabled:opacity-50"
          >
            {toggling ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : link.isActive ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>

          {/* Edit */}
          <button
            id={`edit-${link.id}`}
            onClick={() => onEdit(link)}
            title="Edit link"
            className="p-2 rounded-full hover:bg-nu-purple-soft text-nu-muted hover:text-nu-purple transition-all"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            id={`duplicate-${link.id}`}
            onClick={handleDuplicate}
            disabled={duplicating}
            title="Duplicate link"
            className="p-2 rounded-full hover:bg-nu-purple-soft text-nu-muted hover:text-nu-purple transition-all disabled:opacity-50"
          >
            {duplicating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          {/* Delete */}
          <button
            id={`delete-${link.id}`}
            onClick={handleDeleteClick}
            disabled={deleting}
            title={confirmingDelete ? "Click again to confirm delete" : "Delete link"}
            className={`p-2 rounded-full transition-all disabled:opacity-50 ${
              confirmingDelete
                ? "bg-red-100 text-red-600 hover:bg-red-200 ring-2 ring-red-300 ring-offset-1"
                : "hover:bg-red-50 text-nu-muted hover:text-red-500"
            }`}
          >
            {deleting ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ── Delete Confirmation Banner ──────────────────────────────────── */}
      {confirmingDelete && !deleting && (
        <div className="flex items-center justify-between border-t border-red-100 bg-red-50 px-4 py-2.5 rounded-b-2xl">
          <p className="text-xs font-semibold text-red-700">
            ⚠️ Are you sure? This cannot be undone.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelDelete}
              className="text-xs font-semibold text-nu-muted hover:text-nu-charcoal border border-gray-200 rounded-full px-3 py-1 bg-white hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => void handleDeleteConfirm()}
              className="text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-full px-3 py-1 transition-all shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Inactive label */}
      {!link.isActive && !confirmingDelete && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center pb-1.5">
          <span className="text-[10px] font-semibold text-nu-muted uppercase tracking-widest">
            inactive
          </span>
        </div>
      )}
    </div>
  );
}

export const LinkCard = React.memo(LinkCardComponent);
