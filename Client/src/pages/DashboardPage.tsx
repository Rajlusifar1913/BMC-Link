import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  LogOut,
  User as UserIcon,
  Settings,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Link2,
  Search,
  X,
  Copy,
  Check,
  MousePointerClick,
  ChevronUp,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LinkCard } from "@/components/dashboard/LinkCard";
import { AddLinkModal } from "@/components/dashboard/AddLinkModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  toggleLink,
  duplicateLink,
  reorderLinks,
} from "@/lib/links";
import type { Link as LinkType, CreateLinkPayload, UpdateLinkPayload } from "@/lib/types";

// ─── Active Filter Types ──────────────────────────────────────────────────────

type FilterType = "ALL" | "ACTIVE" | "INACTIVE" | "WEBSITE" | "YOUTUBE" | "INSTAGRAM" | "FACEBOOK" | "TWITTER" | "GITHUB" | "CUSTOM";

const FILTER_PILLS: { label: string; value: FilterType }[] = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Website", value: "WEBSITE" },
  { label: "YouTube", value: "YOUTUBE" },
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "Twitter", value: "TWITTER" },
  { label: "GitHub", value: "GITHUB" },
  { label: "Custom", value: "CUSTOM" },
];

// ─── Dashboard Content (rendered only when authenticated) ─────────────────────

function DashboardContent() {
  const { user, logout } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();

  const [links, setLinks] = useState<LinkType[]>([]);
  const [linksLoading, setLinksLoading] = useState(true);
  const [linksError, setLinksError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);

  // ── Search & Filter ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [copiedProfile, setCopiedProfile] = useState(false);

  // ── Reorder mode ──────────────────────────────────────────────────────────────
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderList, setReorderList] = useState<LinkType[]>([]);
  const [savingReorder, setSavingReorder] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // ── Load links ──────────────────────────────────────────────────────────────

  const loadLinks = useCallback(async () => {
    setLinksLoading(true);
    setLinksError(null);
    try {
      const result = await getLinks({ sortBy: "position", order: "asc", limit: 100 });
      // Backend returns { items: Link[], pagination: {...} } wrapped in ApiResponse.data
      // The apiFetch helper unwraps .data, so result IS the PaginatedResponse object.
      const items: LinkType[] = Array.isArray(result)
        ? result
        : ((result as { items?: LinkType[] })?.items ?? []);
      setLinks(items);
    } catch (err) {
      setLinksError(err instanceof Error ? err.message : "Failed to load links");
    } finally {
      setLinksLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLinks();
  }, [loadLinks]);

  // ── Filtered Links ───────────────────────────────────────────────────────────

  const filteredLinks = links.filter((link) => {
    const matchesSearch =
      !searchQuery ||
      link.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.url.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "ALL" ||
      (activeFilter === "ACTIVE" && link.isActive) ||
      (activeFilter === "INACTIVE" && !link.isActive) ||
      link.type === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // ── Derived values ──────────────────────────────────────────────────────────

  const profile = user?.creatorProfile;
  const displayName = user?.name ?? user?.email ?? "Creator";
  const avatarSrc = profile?.avatar ?? user?.profilePicture;
  const username = profile?.username;
  const activeCount = links.filter((l) => l.isActive).length;
  const totalClicks = links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreate = async (payload: CreateLinkPayload | UpdateLinkPayload): Promise<void> => {
    const newLink = await createLink(payload as CreateLinkPayload);
    setLinks((prev) => [...prev, newLink]);
    success("Link added successfully!");
  };

  const handleUpdate = async (payload: CreateLinkPayload | UpdateLinkPayload): Promise<void> => {
    if (!editingLink) return;
    const updated = await updateLink(editingLink.id, payload as UpdateLinkPayload);
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    setEditingLink(null);
    success("Link updated successfully!");
  };

  const handleToggle = async (id: string): Promise<void> => {
    const updated = await toggleLink(id);
    setLinks((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    info(updated.isActive ? "Link activated" : "Link deactivated");
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteLink(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));
    success("Link deleted");
  };

  const handleDuplicate = async (id: string): Promise<void> => {
    const copy = await duplicateLink(id);
    setLinks((prev) => [...prev, copy]);
    success("Link duplicated!");
  };

  const openEdit = (link: LinkType) => {
    setEditingLink(link);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleCopyProfileLink = async () => {
    const url = username
      ? `${window.location.origin}/${username}`
      : window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedProfile(true);
      success("Profile link copied to clipboard!");
      setTimeout(() => setCopiedProfile(false), 2500);
    } catch {
      toastError("Failed to copy link");
    }
  };

  // ── Reorder Drag Handlers ───────────────────────────────────────────────────

  const enterReorderMode = () => {
    setReorderList([...links]);
    setIsReorderMode(true);
  };

  const cancelReorder = () => {
    setIsReorderMode(false);
    setReorderList([]);
  };

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragEnter = (idx: number) => {
    dragOverItem.current = idx;
    if (dragItem.current === null || dragItem.current === idx) return;
    setReorderList((prev) => {
      const list = [...prev];
      const [moved] = list.splice(dragItem.current!, 1);
      list.splice(idx, 0, moved);
      dragItem.current = idx;
      return list;
    });
  };

  const moveItem = (idx: number, direction: "up" | "down") => {
    setReorderList((prev) => {
      const list = [...prev];
      const swapWith = direction === "up" ? idx - 1 : idx + 1;
      if (swapWith < 0 || swapWith >= list.length) return list;
      [list[idx], list[swapWith]] = [list[swapWith], list[idx]];
      return list;
    });
  };

  const saveReorder = async () => {
    setSavingReorder(true);
    try {
      const payload = reorderList.map((l, idx) => ({ id: l.id, position: idx + 1 }));
      await reorderLinks(payload);
      const updated = reorderList.map((l, idx) => ({ ...l, position: idx + 1 }));
      setLinks(updated);
      setIsReorderMode(false);
      setReorderList([]);
      success("Link order saved!");
    } catch {
      toastError("Failed to save order. Please try again.");
    } finally {
      setSavingReorder(false);
    }
  };

  const listToRender = isReorderMode ? reorderList : filteredLinks;

  return (
    <div className="min-h-screen bg-nu-bg">
      {/* ─── Top Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            title="Back to home"
          >
            <div className="w-8 h-8 bg-nu-purple rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-md group-hover:bg-nu-purple-hover transition-all group-hover:scale-105">
              B
            </div>
            <span className="text-sm font-bold text-nu-charcoal hidden sm:block">
              BMC Link
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-nu-purple bg-nu-purple-soft hover:bg-nu-purple-soft-hover px-3 py-1.5 rounded-full transition-all"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                View Profile
              </a>
            )}
            <button
              onClick={handleCopyProfileLink}
              title="Copy your profile link"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-nu-muted hover:text-nu-purple bg-gray-50 hover:bg-nu-purple-soft px-3 py-1.5 rounded-full transition-all"
            >
              {copiedProfile ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copiedProfile ? "Copied!" : "Copy Link"}
            </button>
            <Link
              to="/dashboard/profile"
              className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
              title="Edit profile"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <button
              id="logout-btn"
              onClick={handleLogout}
              className="p-2 rounded-full hover:bg-red-50 text-nu-muted hover:text-red-500 transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── Profile Summary Card ───────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-nu-soft border border-gray-100 overflow-hidden">
          {/* Cover image / gradient banner */}
          <div
            className="h-28 w-full"
            style={{
              background: profile?.coverImage
                ? `url(${profile.coverImage}) center/cover`
                : `linear-gradient(135deg, ${profile?.accentColor ?? "#820AD1"}22, #F4EBFF)`,
            }}
          />
          <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar + info */}
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-nu-card bg-nu-purple-soft flex items-center justify-center overflow-hidden shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-9 h-9 text-nu-purple" />
                )}
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-extrabold text-nu-charcoal">
                  {displayName}
                </h1>
                {username && (
                  <p className="text-sm text-nu-muted font-medium">
                    @{username}
                  </p>
                )}
                {profile?.headline && (
                  <p className="text-xs text-nu-muted mt-0.5">{profile.headline}</p>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 sm:pb-1">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-charcoal">
                  {links.length}
                </p>
                <p className="text-xs text-nu-muted">Total Links</p>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-purple">
                  {activeCount}
                </p>
                <p className="text-xs text-nu-muted">Active</p>
              </div>
              <div className="h-8 w-px bg-gray-100" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-charcoal flex items-center gap-1">
                  <MousePointerClick className="w-4 h-4 text-nu-muted" />
                  {totalClicks}
                </p>
                <p className="text-xs text-nu-muted">Total Clicks</p>
              </div>
              <Link
                to="/dashboard/profile"
                className="ml-2 border-2 border-nu-purple text-nu-purple font-semibold rounded-full px-4 py-1.5 text-xs hover:bg-nu-purple-soft transition-all"
              >
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* ── Links Section ──────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4">
          {/* Section Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-nu-charcoal">Your Links</h2>
              <p className="text-xs text-nu-muted">
                {isReorderMode
                  ? "Drag or use arrows to reorder, then save."
                  : "Manage all your links — click the eye to toggle visibility."}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {isReorderMode ? (
                <>
                  <button
                    onClick={cancelReorder}
                    className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted border-2 border-gray-200 hover:border-gray-300 rounded-full px-4 py-2 transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel
                  </button>
                  <button
                    onClick={saveReorder}
                    disabled={savingReorder}
                    className="flex items-center gap-1.5 text-xs font-semibold bg-nu-purple hover:bg-nu-purple-hover text-white rounded-full px-4 py-2 transition-all shadow-md disabled:opacity-60"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {savingReorder ? "Saving…" : "Save Order"}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={loadLinks}
                    title="Refresh links"
                    className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  {links.length > 1 && (
                    <button
                      onClick={enterReorderMode}
                      className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted border-2 border-gray-200 hover:border-nu-purple hover:text-nu-purple rounded-full px-4 py-2 transition-all"
                      title="Reorder links"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                      Reorder
                    </button>
                  )}
                  <button
                    id="add-link-btn"
                    onClick={() => { setEditingLink(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    Add Link
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search & Filter (only in normal mode) */}
          {!isReorderMode && (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nu-muted pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search links by title or URL…"
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-nu-muted transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2">
                {FILTER_PILLS.map((pill) => (
                  <button
                    key={pill.value}
                    onClick={() => setActiveFilter(pill.value)}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                      activeFilter === pill.value
                        ? "bg-nu-purple text-white border-nu-purple shadow-sm"
                        : "bg-white text-nu-muted border-gray-200 hover:border-nu-purple/40 hover:text-nu-purple"
                    }`}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Links List */}
          {linksLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-white rounded-2xl border border-gray-100 animate-pulse"
                />
              ))}
            </div>
          ) : linksError ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-red-700">
                  Failed to load links
                </p>
                <p className="text-xs text-red-500 mt-0.5">{linksError}</p>
              </div>
              <button
                onClick={loadLinks}
                className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 underline"
              >
                Retry
              </button>
            </div>
          ) : links.length === 0 ? (
            // Empty state
            <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="w-16 h-16 bg-nu-purple-soft rounded-2xl flex items-center justify-center">
                <Link2 className="w-8 h-8 text-nu-purple" />
              </div>
              <div className="text-center">
                <p className="text-base font-bold text-nu-charcoal">No links yet</p>
                <p className="text-sm text-nu-muted mt-1">
                  Add your first link to get started.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md"
              >
                <Plus className="w-4 h-4" />
                Add your first link
              </button>
            </div>
          ) : listToRender.length === 0 ? (
            // Empty search/filter state
            <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white rounded-3xl border border-dashed border-gray-200">
              <Search className="w-8 h-8 text-nu-muted/50" />
              <div className="text-center">
                <p className="text-sm font-bold text-nu-charcoal">No links found</p>
                <p className="text-xs text-nu-muted mt-0.5">
                  Try a different search or filter.
                </p>
              </div>
              <button
                onClick={() => { setSearchQuery(""); setActiveFilter("ALL"); }}
                className="text-xs font-semibold text-nu-purple hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {listToRender.map((link, idx) => (
                isReorderMode ? (
                  // Reorder mode: show drag-and-drop card
                  <div
                    key={link.id}
                    draggable
                    onDragStart={() => handleDragStart(idx)}
                    onDragEnter={() => handleDragEnter(idx)}
                    onDragEnd={() => { dragItem.current = null; dragOverItem.current = null; }}
                    onDragOver={(e) => e.preventDefault()}
                    className="group flex items-center gap-3 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-nu-soft hover:border-nu-purple/20 select-none"
                  >
                    <GripVertical className="w-4 h-4 text-gray-300 group-hover:text-nu-purple transition-colors shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-nu-charcoal truncate">
                        {link.title ?? <span className="italic text-nu-muted">Untitled</span>}
                      </p>
                      <p className="text-xs text-nu-muted truncate">{link.url}</p>
                    </div>
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button
                        onClick={() => moveItem(idx, "up")}
                        disabled={idx === 0}
                        className="p-1 rounded-lg hover:bg-nu-purple-soft text-nu-muted hover:text-nu-purple disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, "down")}
                        disabled={idx === listToRender.length - 1}
                        className="p-1 rounded-lg hover:bg-nu-purple-soft text-nu-muted hover:text-nu-purple disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <LinkCard
                    key={link.id}
                    link={link}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                    onDuplicate={handleDuplicate}
                  />
                )
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────── */}
      <AddLinkModal
        isOpen={isModalOpen}
        editingLink={editingLink}
        onClose={closeModal}
        onSubmit={editingLink ? handleUpdate : handleCreate}
      />
    </div>
  );
}

// ─── Page export wrapped in ProtectedRoute ────────────────────────────────────

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
