import React, { useState, useMemo } from "react";
import {
  MousePointerClick,
  Award,
  Search,
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Link2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import type { Link as LinkType } from "@/lib/types";

interface Props {
  links: LinkType[];
  onNavigateSubTab?: (sub: "link-management" | "themes-branding" | "click-analytics") => void;
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  WEBSITE: <Globe className="w-4 h-4 text-nu-purple" />,
  YOUTUBE: <Youtube className="w-4 h-4 text-red-500" />,
  INSTAGRAM: <Instagram className="w-4 h-4 text-pink-500" />,
  FACEBOOK: <Facebook className="w-4 h-4 text-blue-600" />,
  TWITTER: <Twitter className="w-4 h-4 text-sky-500" />,
  GITHUB: <Github className="w-4 h-4" />,
  CUSTOM: <Link2 className="w-4 h-4" />,
};

export function ClickAnalyticsSection({ links, onNavigateSubTab }: Props) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 150);

  const totalClicks = useMemo(() => links.reduce((sum, l) => sum + (l.clickCount || 0), 0), [links]);
  const activeLinks = useMemo(() => links.filter((l) => l.isActive), [links]);
  const avgClicks = useMemo(() => (links.length > 0 ? Math.round(totalClicks / links.length) : 0), [links, totalClicks]);

  // Sorted by click count descending (Memoized)
  const sortedLinks = useMemo(() => {
    return [...links].sort((a, b) => (b.clickCount || 0) - (a.clickCount || 0));
  }, [links]);

  const filteredLinks = useMemo(() => {
    if (!debouncedSearch.trim()) return sortedLinks;
    const q = debouncedSearch.toLowerCase().trim();
    return sortedLinks.filter((l) => {
      return (
        (l.title && l.title.toLowerCase().includes(q)) ||
        l.url.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
      );
    });
  }, [sortedLinks, debouncedSearch]);

  const maxClicks = useMemo(() => Math.max(...links.map((l) => l.clickCount || 0), 1), [links]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal dark:text-white">
            Link Click Analytics
          </h2>
          <p className="text-xs text-nu-muted dark:text-gray-400">
            Real-time engagement breakdown and top-performing links
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-nu-purple-soft dark:bg-nu-purple/20 text-nu-purple px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>{totalClicks} Total Clicks</span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
          <p className="text-xs font-bold text-nu-muted dark:text-gray-400 uppercase tracking-wider">
            Total Engagements
          </p>
          <p className="text-3xl font-extrabold text-nu-purple mt-1">{totalClicks}</p>
          <p className="text-[11px] text-nu-muted dark:text-gray-400 mt-1">Across all shared links</p>
        </div>

        <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
          <p className="text-xs font-bold text-nu-muted dark:text-gray-400 uppercase tracking-wider">
            Active Links
          </p>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {activeLinks.length} / {links.length}
          </p>
          <p className="text-[11px] text-nu-muted dark:text-gray-400 mt-1">Currently visible to audience</p>
        </div>

        <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-sm">
          <p className="text-xs font-bold text-nu-muted dark:text-gray-400 uppercase tracking-wider">
            Average Clicks / Link
          </p>
          <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
            {avgClicks}
          </p>
          <p className="text-[11px] text-nu-muted dark:text-gray-400 mt-1">Click engagement average</p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nu-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter analytics by link title or URL..."
          className="w-full bg-white dark:bg-[#180F26] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
        />
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
          <Award className="w-4 h-4 text-nu-purple" />
          <h3 className="text-sm font-bold text-nu-charcoal dark:text-white uppercase tracking-wider">
            Click Leaderboard & Distribution
          </h3>
        </div>

        {links.length === 0 ? (
          <p className="text-xs text-nu-muted dark:text-gray-400 text-center py-8">
            No links created yet. Add links to see click analytics.
          </p>
        ) : filteredLinks.length === 0 ? (
          <p className="text-xs text-nu-muted dark:text-gray-400 text-center py-8">
            No links match your search filter.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredLinks.map((link, idx) => {
              const clickPercent =
                totalClicks > 0
                  ? Math.round(((link.clickCount || 0) / totalClicks) * 100)
                  : 0;
              const barPercent = Math.round(((link.clickCount || 0) / maxClicks) * 100);

              return (
                <div
                  key={link.id}
                  className="p-4 bg-gray-50/70 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-nu-purple-soft dark:bg-nu-purple/20 text-nu-purple text-xs font-bold flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-white/10 flex items-center justify-center shrink-0">
                        {PLATFORM_ICONS[link.type] || <Link2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-nu-charcoal dark:text-white truncate">
                          {link.title || link.url}
                        </p>
                        <p className="text-[10px] text-nu-muted dark:text-gray-400 truncate">
                          {link.url}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-extrabold text-nu-charcoal dark:text-white">
                        {link.clickCount || 0}{" "}
                        <span className="text-[10px] font-normal text-nu-muted">clicks</span>
                      </span>
                      <span className="block text-[10px] font-semibold text-nu-purple">
                        {clickPercent}% of total
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-nu-purple to-purple-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(barPercent, 2)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sub-Tab Quick Navigation Footer Buttons */}
      {onNavigateSubTab && (
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 dark:border-white/10 flex-wrap">
          <button
            onClick={() => onNavigateSubTab("themes-branding")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#180F26] text-nu-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-nu-purple" />
            <span>Go to Themes & Branding</span>
          </button>
          <button
            onClick={() => onNavigateSubTab("link-management")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-nu-purple hover:bg-nu-purple-hover text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Back to Link Management</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
