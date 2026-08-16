import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
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
  ChevronLeft,
  ChevronRight,
  GripVertical,
  BarChart3,
  Heart,
  Award,
  Package,
  ShoppingBag,
  ShieldAlert,
  Palette,
  TrendingUp,
  SlidersHorizontal,
  Camera,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { motion, AnimatePresence } from "framer-motion";
import { LinkCard } from "@/components/dashboard/LinkCard";
import { AddLinkModal } from "@/components/dashboard/AddLinkModal";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { AnalyticsSection } from "@/components/dashboard/AnalyticsSection";
import { DonationsSection } from "@/components/dashboard/DonationsSection";
import { MembershipSection } from "@/components/dashboard/MembershipSection";
import { ProductsSection } from "@/components/dashboard/ProductsSection";
import { SalesSection } from "@/components/dashboard/SalesSection";
import { ThemesBrandingSection } from "@/components/dashboard/ThemesBrandingSection";
import { ClickAnalyticsSection } from "@/components/dashboard/ClickAnalyticsSection";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutConfirmModal } from "@/components/Modals/LogoutConfirmModal";
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
import { getCachedData, setCachedData } from "@/lib/cache";
import type { Link as LinkType, CreateLinkPayload, UpdateLinkPayload } from "@/lib/types";

import { useDebounce } from "@/hooks/useDebounce";

const CACHE_KEY_LINKS = "creator_links";

// ─── Tab & Filter Types ───────────────────────────────────────────────────────

type DashboardTab = "links" | "analytics" | "donations" | "memberships" | "products" | "sales";
type LinksSubTab = "link-management" | "themes-branding" | "click-analytics";

const SUB_TAB_ORDER: LinksSubTab[] = ["link-management", "themes-branding", "click-analytics"];

type FilterType =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE"
  | "WEBSITE"
  | "YOUTUBE"
  | "INSTAGRAM"
  | "FACEBOOK"
  | "TWITTER"
  | "GITHUB"
  | "CUSTOM";

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

const MAIN_TABS: { id: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { id: "links", label: "Links & Bio", icon: <Link2 className="w-4 h-4" /> },
  { id: "analytics", label: "Revenue Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "donations", label: "Donations", icon: <Heart className="w-4 h-4" /> },
  { id: "memberships", label: "Memberships", icon: <Award className="w-4 h-4" /> },
  { id: "products", label: "Products", icon: <Package className="w-4 h-4" /> },
  { id: "sales", label: "Sales", icon: <ShoppingBag className="w-4 h-4" /> },
];

const LINKS_SUB_TABS: { id: LinksSubTab; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: "link-management",
    label: "Link Management",
    icon: <Link2 className="w-4 h-4" />,
    desc: "Manage, duplicate, and toggle active links on your profile.",
  },
  {
    id: "themes-branding",
    label: "Themes & Branding",
    icon: <Palette className="w-4 h-4" />,
    desc: "Customize colors, cover art, and profile appearance.",
  },
  {
    id: "click-analytics",
    label: "Click Analytics",
    icon: <TrendingUp className="w-4 h-4" />,
    desc: "Detailed link click performance and top link rankings.",
  },
];

// ─── Dashboard Content (rendered only when authenticated) ─────────────────────

function DashboardContent() {
  const { user, logout } = useAuth();
  const { success, error: toastError, info } = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>("links");
  const [linksSubTab, setLinksSubTab] = useState<LinksSubTab>("link-management");

  const [links, setLinks] = useState<LinkType[]>(() => {
    return getCachedData<LinkType[]>(CACHE_KEY_LINKS) || [];
  });
  const [linksLoading, setLinksLoading] = useState(() => !getCachedData<LinkType[]>(CACHE_KEY_LINKS));
  const [linksError, setLinksError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkType | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // ── Search & Filter ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Reorder mode ──────────────────────────────────────────────────────────────
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [reorderList, setReorderList] = useState<LinkType[]>([]);
  const [savingReorder, setSavingReorder] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // ── Auto-redirect Admin to Admin Panel unless ?view=creator is set ───────────
  useEffect(() => {
    if (user && user.role === "ADMIN") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("view") !== "creator") {
        navigate("/admin", { replace: true });
      }
    }
  }, [user, navigate]);

  // ── Load links ──────────────────────────────────────────────────────────────

  const loadLinks = useCallback(async (silent = false) => {
    const searchParams = new URLSearchParams(window.location.search);
    if (user?.role === "ADMIN" && searchParams.get("view") !== "creator") {
      return;
    }
    if (!silent) setLinksLoading(true);
    setLinksError(null);
    try {
      const result = await getLinks({ sortBy: "position", order: "asc", limit: 100 });
      const items: LinkType[] = Array.isArray(result)
        ? result
        : ((result as { items?: LinkType[] })?.items ?? []);
      setLinks(items);
      setCachedData(CACHE_KEY_LINKS, items);
    } catch (err) {
      setLinks((prev) => {
        if (prev.length === 0) {
          setLinksError(err instanceof Error ? err.message : "Failed to load links");
        }
        return prev;
      });
    } finally {
      setLinksLoading(false);
    }
  }, [user?.role]);

  useEffect(() => {
    loadLinks(links.length > 0);
  }, [loadLinks]);

  // ── Debounced Search Query for buttery smooth filtering ─────────────────────
  const debouncedSearchQuery = useDebounce(searchQuery, 150);

  // ── Filtered Links (Memoized for high performance) ─────────────────────────

  const filteredLinks = useMemo(() => {
    const q = debouncedSearchQuery.toLowerCase().trim();
    return links.filter((link) => {
      const matchesSearch =
        !q ||
        (link.title && link.title.toLowerCase().includes(q)) ||
        link.url.toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === "ALL" ||
        (activeFilter === "ACTIVE" && link.isActive) ||
        (activeFilter === "INACTIVE" && !link.isActive) ||
        link.type === activeFilter;

      return matchesSearch && matchesFilter;
    });
  }, [links, debouncedSearchQuery, activeFilter]);

  // ── Derived values (Memoized) ───────────────────────────────────────────────

  const profile = user?.creatorProfile;
  const displayName = user?.name ?? user?.email ?? "Creator";
  const avatarSrc = profile?.avatar ?? user?.profilePicture;
  const username = profile?.username;
  const activeCount = useMemo(() => links.filter((l) => l.isActive).length, [links]);
  const totalClicks = useMemo(() => links.reduce((sum, l) => sum + (l.clickCount ?? 0), 0), [links]);
  const isAdmin = user?.role === "ADMIN";

  // ── Sub-Tab Navigation Helpers (Only Arrows) ───────────────────────────────

  const currentSubTabObj = LINKS_SUB_TABS.find((s) => s.id === linksSubTab);

  const nextSubTab = () => {
    const currentIndex = SUB_TAB_ORDER.indexOf(linksSubTab);
    const nextIndex = (currentIndex + 1) % SUB_TAB_ORDER.length;
    setLinksSubTab(SUB_TAB_ORDER[nextIndex]);
  };

  const prevSubTab = () => {
    const currentIndex = SUB_TAB_ORDER.indexOf(linksSubTab);
    const prevIndex = (currentIndex - 1 + SUB_TAB_ORDER.length) % SUB_TAB_ORDER.length;
    setLinksSubTab(SUB_TAB_ORDER[prevIndex]);
  };

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleCreate = async (payload: CreateLinkPayload | UpdateLinkPayload): Promise<void> => {
    const newLink = await createLink(payload as CreateLinkPayload);
    setLinks((prev) => {
      const next = [...prev, newLink];
      setCachedData(CACHE_KEY_LINKS, next);
      return next;
    });
    success("Link added successfully!");
  };

  const handleUpdate = async (payload: CreateLinkPayload | UpdateLinkPayload): Promise<void> => {
    if (!editingLink) return;
    const updated = await updateLink(editingLink.id, payload as UpdateLinkPayload);
    setLinks((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      setCachedData(CACHE_KEY_LINKS, next);
      return next;
    });
    setEditingLink(null);
    success("Link updated successfully!");
  };

  const handleToggle = async (id: string): Promise<void> => {
    const updated = await toggleLink(id);
    setLinks((prev) => {
      const next = prev.map((l) => (l.id === updated.id ? updated : l));
      setCachedData(CACHE_KEY_LINKS, next);
      return next;
    });
    info(updated.isActive ? "Link activated" : "Link deactivated");
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteLink(id);
    setLinks((prev) => {
      const next = prev.filter((l) => l.id !== id);
      setCachedData(CACHE_KEY_LINKS, next);
      return next;
    });
    success("Link deleted");
  };

  const handleDuplicate = async (id: string): Promise<void> => {
    const copy = await duplicateLink(id);
    setLinks((prev) => {
      const next = [...prev, copy];
      setCachedData(CACHE_KEY_LINKS, next);
      return next;
    });
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

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      success("Logged out successfully");
      setIsLogoutModalOpen(false);
      navigate("/", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
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
    <div className="min-h-screen bg-nu-bg overflow-x-hidden">
      {/* ─── Top Navigation ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#140B23]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/12 shadow-sm">
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
            <span className="text-sm font-bold text-nu-charcoal dark:text-white hidden sm:block">
              BMC Link
            </span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-xs font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 px-3.5 py-1.5 rounded-full shadow-md hover:shadow-lg border border-amber-400/80 transition-all hover:scale-105 active:scale-95 ring-2 ring-amber-400/30"
                title="Admin Control Panel"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-white" />
                <span>Admin Panel</span>
              </Link>
            )}
            {username && (
              <a
                href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-nu-purple bg-nu-purple-soft dark:bg-nu-purple/20 hover:bg-nu-purple-soft-hover px-3 py-1.5 rounded-full transition-all"
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
              title="Profile & Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <button
              id="logout-btn"
              onClick={() => setIsLogoutModalOpen(true)}
              className="p-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 text-nu-muted dark:text-gray-300 hover:bg-rose-500 hover:text-white hover:border-rose-500 dark:hover:bg-rose-600 dark:hover:border-rose-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-md hover:shadow-rose-500/25"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main Content ────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">

        {/* ── Admin Mode Banner ─────────────────────────────────────────── */}
        {isAdmin && (
          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/5 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-transparent border border-amber-300/60 dark:border-amber-700/50 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-amber-900 dark:text-amber-200">
                  Administrator Mode — Personal Creator View
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  You are currently managing your personal creator profile as an Admin.
                </p>
              </div>
            </div>
            <Link
              to="/admin"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-full transition-all shadow-md active:scale-95 ml-auto"
            >
              <span>Back to Admin Panel</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* ── Profile Summary Card ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#180F26] rounded-3xl shadow-nu-soft border border-gray-100 dark:border-white/10 overflow-hidden">
          {/* Cover image / gradient banner */}
          <div
            className="h-28 w-full transition-all duration-300"
            style={{
              background: profile?.coverImage
                ? `url(${profile.coverImage}) center/cover`
                : `linear-gradient(135deg, ${profile?.accentColor ?? "#820AD1"}22, #F4EBFF)`,
            }}
          />
          <div className="px-6 pb-6 -mt-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            {/* Avatar + info */}
            <div className="flex items-end gap-4">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative group cursor-pointer"
                title="Click to change profile picture"
              >
                <div className="w-20 h-20 rounded-2xl border-4 border-white dark:border-[#180F26] shadow-nu-card bg-nu-purple-soft flex items-center justify-center overflow-hidden shrink-0 group-hover:opacity-90 transition-opacity">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-9 h-9 text-nu-purple" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-nu-purple text-white shadow-md border-2 border-white dark:border-[#180F26]">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="pb-1">
                <h1 className="text-xl font-extrabold text-nu-charcoal dark:text-white">
                  {displayName}
                </h1>
                {username && (
                  <p className="text-sm text-nu-muted dark:text-gray-400 font-medium">
                    @{username}
                  </p>
                )}
                {profile?.headline && (
                  <p className="text-xs text-nu-muted dark:text-gray-400 mt-0.5">{profile.headline}</p>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 sm:pb-1 flex-wrap">
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-charcoal dark:text-white">
                  {links.length}
                </p>
                <p className="text-xs text-nu-muted dark:text-gray-400">Total Links</p>
              </div>
              <div className="h-8 w-px bg-gray-100 dark:bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-purple">
                  {activeCount}
                </p>
                <p className="text-xs text-nu-muted dark:text-gray-400">Active</p>
              </div>
              <div className="h-8 w-px bg-gray-100 dark:bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-extrabold text-nu-charcoal dark:text-white flex items-center gap-1">
                  <MousePointerClick className="w-4 h-4 text-nu-muted" />
                  {totalClicks}
                </p>
                <p className="text-xs text-nu-muted dark:text-gray-400">Total Clicks</p>
              </div>
              <Link
                to="/dashboard/profile"
                className="ml-2 border-2 border-nu-purple text-nu-purple font-semibold rounded-full px-4 py-1.5 text-xs hover:bg-nu-purple-soft transition-all"
              >
                Settings
              </Link>
            </div>
          </div>
        </div>

        {/* ── Main Category Tabs (No Horizontal Scroll - Flex Wrap) ──────── */}
        <div className="flex flex-wrap items-center gap-2">
          {MAIN_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-nu-purple text-white shadow-md shadow-nu-purple/20 scale-102"
                    : "bg-white dark:bg-[#180F26] text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white border border-gray-100 dark:border-white/10 hover:border-gray-200"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── Tab Views with GPU-Accelerated Smooth Transition ─────────── */}
        <div key={activeTab} className="tab-transition-enter will-change-transform">
          {activeTab === "links" && (
              <div className="flex flex-col gap-6">
                {/* Box Header with Left and Right Side Arrow Buttons */}
                <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#180F26] p-3 sm:p-4 rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm">
                  {/* Left Side Arrow Button */}
                  <button
                    onClick={prevSubTab}
                    aria-label="Previous sub-tab"
                    title="Previous sub-tab"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 flex items-center justify-center text-nu-charcoal dark:text-white hover:text-nu-purple hover:bg-nu-purple-soft/50 dark:hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shrink-0 shadow-xs focus:outline-none"
                  >
                    <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                  </button>

                  {/* Center: Current Sub-Tab Name & Info */}
                  <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-extrabold text-nu-purple uppercase tracking-wider bg-nu-purple-soft dark:bg-nu-purple/20 px-4 py-1.5 rounded-full border border-nu-purple/10">
                      {currentSubTabObj?.icon}
                      <span>{currentSubTabObj?.label}</span>
                    </div>
                    <p className="text-[11px] text-nu-muted dark:text-gray-400 mt-1 hidden sm:block">
                      {currentSubTabObj?.desc}
                    </p>
                  </div>

                  {/* Right Side Arrow Button */}
                  <button
                    onClick={nextSubTab}
                    aria-label="Next sub-tab"
                    title="Next sub-tab"
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-nu-purple text-white hover:bg-nu-purple-hover flex items-center justify-center hover:scale-105 active:scale-95 transition-all shrink-0 shadow-sm focus:outline-none"
                  >
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* Sub-Tabs Content with Smooth Cross-Fade */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={linksSubTab}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Sub-Tab 2: Themes & Branding */}
                    {linksSubTab === "themes-branding" && (
                      <ThemesBrandingSection links={links} />
                    )}

                    {/* Sub-Tab 3: Click Analytics */}
                    {linksSubTab === "click-analytics" && (
                      <ClickAnalyticsSection links={links} />
                    )}

                    {/* Sub-Tab 1: Link Management (Default) */}
                    {linksSubTab === "link-management" && (
                      <div className="flex flex-col gap-4">
                        {/* Section Header */}
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <h2 className="text-lg font-bold text-nu-charcoal dark:text-white">
                              Link Management
                            </h2>
                            <p className="text-xs text-nu-muted dark:text-gray-400">
                              {isReorderMode
                                ? "Drag or use arrows to reorder, then save."
                                : "Manage, duplicate, and toggle active links on your profile."}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            {isReorderMode ? (
                              <>
                                <button
                                  onClick={cancelReorder}
                                  className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted border-2 border-gray-200 dark:border-white/20 hover:border-gray-300 rounded-full px-4 py-2 transition-all"
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
                                  onClick={() => void loadLinks()}
                                  title="Refresh links"
                                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-all"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                {links.length > 1 && (
                                  <button
                                    onClick={enterReorderMode}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted border-2 border-gray-200 dark:border-white/20 hover:border-nu-purple hover:text-nu-purple rounded-full px-4 py-2 transition-all"
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
                                className="w-full bg-white dark:bg-[#180F26] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-10 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
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
                                      : "bg-white dark:bg-[#180F26] text-nu-muted dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-nu-purple/40 hover:text-nu-purple"
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
                                className="h-16 bg-white dark:bg-[#180F26] rounded-2xl border border-gray-100 dark:border-white/10 animate-pulse"
                              />
                            ))}
                          </div>
                        ) : linksError ? (
                          <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <div>
                              <p className="text-sm font-bold text-red-700 dark:text-red-400">
                                Failed to load links
                              </p>
                              <p className="text-xs text-red-500 mt-0.5">{linksError}</p>
                            </div>
                            <button
                              onClick={() => void loadLinks()}
                              className="ml-auto text-xs font-semibold text-red-600 hover:text-red-700 underline"
                            >
                              Retry
                            </button>
                          </div>
                        ) : links.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white dark:bg-[#180F26] rounded-3xl border border-dashed border-gray-200 dark:border-white/15">
                            <div className="w-16 h-16 bg-nu-purple-soft dark:bg-nu-purple/20 rounded-2xl flex items-center justify-center">
                              <Link2 className="w-8 h-8 text-nu-purple" />
                            </div>
                            <div className="text-center">
                              <p className="text-base font-bold text-nu-charcoal dark:text-white">No links yet</p>
                              <p className="text-sm text-nu-muted dark:text-gray-400 mt-1">
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
                          <div className="flex flex-col items-center justify-center py-12 gap-3 bg-white dark:bg-[#180F26] rounded-3xl border border-dashed border-gray-200 dark:border-white/15">
                            <Search className="w-8 h-8 text-nu-muted/50" />
                            <div className="text-center">
                              <p className="text-sm font-bold text-nu-charcoal dark:text-white">No links found</p>
                              <p className="text-xs text-nu-muted dark:text-gray-400 mt-0.5">
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
                                <div
                                  key={link.id}
                                  draggable
                                  onDragStart={() => handleDragStart(idx)}
                                  onDragEnter={() => handleDragEnter(idx)}
                                  onDragEnd={() => { dragItem.current = null; dragOverItem.current = null; }}
                                  onDragOver={(e) => e.preventDefault()}
                                  className="group flex items-center gap-3 bg-white dark:bg-[#180F26] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm cursor-grab active:cursor-grabbing transition-all hover:shadow-nu-soft hover:border-nu-purple/20 select-none"
                                >
                                  <GripVertical className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-nu-purple transition-colors shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-nu-charcoal dark:text-white truncate">
                                      {link.title ?? <span className="italic text-nu-muted">Untitled</span>}
                                    </p>
                                    <p className="text-xs text-nu-muted dark:text-gray-400 truncate">{link.url}</p>
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
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}

            {/* ── Other Primary Tab Views ────────────────────────────────────── */}
            {activeTab === "analytics" && <AnalyticsSection />}
            {activeTab === "donations" && <DonationsSection />}
            {activeTab === "memberships" && <MembershipSection />}
            {activeTab === "products" && <ProductsSection />}
            {activeTab === "sales" && <SalesSection />}
        </div>
      </main>

      {/* ─── Add / Edit Modal ─────────────────────────────────────────────── */}
      <AddLinkModal
        isOpen={isModalOpen}
        editingLink={editingLink}
        onClose={closeModal}
        onSubmit={editingLink ? handleUpdate : handleCreate}
      />

      {/* ─── Change Avatar Modal ───────────────────────────────────────────── */}
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        currentAvatar={avatarSrc}
        displayName={displayName}
        onClose={() => setIsAvatarModalOpen(false)}
      />

      {/* ─── Logout Confirmation Modal ──────────────────────────────────────── */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={isLoggingOut}
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
