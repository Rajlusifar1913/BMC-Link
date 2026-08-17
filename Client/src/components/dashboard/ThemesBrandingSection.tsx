import React, { useState } from "react";
import {
  Palette,
  Save,
  Check,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  ExternalLink,
  Eye,
  Type,
  Layout,
  ArrowLeft,
  ArrowRight,
  SlidersHorizontal,
  TrendingUp,
  Camera,
} from "lucide-react";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { updateProfile } from "@/lib/account";
import type { Link as LinkType } from "@/lib/types";

interface Props {
  links: LinkType[];
  onNavigateSubTab?: (sub: "link-management" | "themes-branding" | "click-analytics") => void;
}

const PRESET_PALETTES = [
  { name: "Nu Purple", color: "#820AD1", bgGradient: "linear-gradient(135deg, #820AD122, #F4EBFF)" },
  { name: "Sunset Coral", color: "#FF5757", bgGradient: "linear-gradient(135deg, #FF575722, #FFF1F1)" },
  { name: "Emerald Pro", color: "#10B981", bgGradient: "linear-gradient(135deg, #10B98122, #ECFDF5)" },
  { name: "Ocean Blue", color: "#2563EB", bgGradient: "linear-gradient(135deg, #2563EB22, #EFF6FF)" },
  { name: "Amber Gold", color: "#F59E0B", bgGradient: "linear-gradient(135deg, #F59E0B22, #FFFBEB)" },
  { name: "Neon Rose", color: "#EC4899", bgGradient: "linear-gradient(135deg, #EC489922, #FDF2F8)" },
  { name: "Cyber Indigo", color: "#6366F1", bgGradient: "linear-gradient(135deg, #6366F122, #EEF2FF)" },
  { name: "Obsidian", color: "#18181B", bgGradient: "linear-gradient(135deg, #18181B22, #F4F4F5)" },
];

export function ThemesBrandingSection({ links, onNavigateSubTab }: Props) {
  const { user, refresh } = useAuth();
  const { success, error: toastError } = useToast();

  const profile = user?.creatorProfile;
  const username = profile?.username;
  const displayName = user?.name ?? user?.email ?? "Creator";

  const [accentColor, setAccentColor] = useState<string>(profile?.accentColor || "#820AD1");
  const [coverImage, setCoverImage] = useState<string>(profile?.coverImage || "");
  const [headline, setHeadline] = useState<string>(profile?.headline || "");
  const [saving, setSaving] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const handleApplyPreset = (color: string) => {
    setAccentColor(color);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        accentColor: accentColor || null,
        coverImage: coverImage.trim() || null,
        headline: headline.trim() || null,
      });
      await refresh();
      success("Themes & branding updated successfully!");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update branding");
    } finally {
      setSaving(false);
    }
  };

  const handleColorChange = (color: string) => {
    if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
      window.requestAnimationFrame(() => {
        setAccentColor(color);
      });
    } else {
      setAccentColor(color);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal dark:text-white">
            Themes & Profile Branding
          </h2>
          <p className="text-xs text-nu-muted dark:text-gray-400">
            Customize the visual style, colors, and banner of your public link bio
          </p>
        </div>

        {username && (
          <a
            href={`/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-semibold text-nu-purple bg-nu-purple-soft dark:bg-nu-purple/20 px-3.5 py-2 rounded-full hover:bg-nu-purple-soft-hover transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Bio</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Branding Controls */}
        <form onSubmit={handleSave} className="lg:col-span-7 flex flex-col gap-5">
          {/* Avatar & Profile Photo */}
          <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-nu-purple-soft border border-nu-purple/20 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={displayName}
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-base font-extrabold text-nu-purple">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-nu-charcoal dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-nu-purple" />
                  Profile Picture & Avatar
                </h3>
                <p className="text-xs text-nu-muted dark:text-gray-400 mt-0.5">
                  Choose from avatar presets or set a custom photo URL
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-nu-purple-soft hover:bg-nu-purple-soft/80 dark:bg-nu-purple/20 text-nu-purple transition-all border border-nu-purple/20 shadow-xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Change Picture</span>
            </button>
          </div>

          {/* Accent Color Palette */}
          <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-nu-purple" />
              <h3 className="text-sm font-bold text-nu-charcoal dark:text-white uppercase tracking-wider">
                Accent Brand Color
              </h3>
            </div>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_PALETTES.map((p) => {
                const isSelected = accentColor.toLowerCase() === p.color.toLowerCase();
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleApplyPreset(p.color)}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      isSelected
                        ? "border-nu-purple bg-nu-purple-soft/50 dark:bg-nu-purple/20 shadow-xs ring-2 ring-nu-purple/30"
                        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-gray-50/50 dark:bg-white/5"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shadow-xs shrink-0 flex items-center justify-center text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                    <span className="truncate text-nu-charcoal dark:text-gray-200 text-[11px]">
                      {p.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/10">
              <label className="text-xs font-semibold text-nu-muted dark:text-gray-400">
                Custom Hex:
              </label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-gray-200 dark:border-white/10 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => handleColorChange(e.target.value)}
                  placeholder="#820AD1"
                  maxLength={7}
                  className="w-28 border border-gray-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-nu-charcoal dark:text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-nu-purple/30"
                />
              </div>
            </div>
          </div>

          {/* Banner & Headline */}
          <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layout className="w-4 h-4 text-nu-purple" />
              <h3 className="text-sm font-bold text-nu-charcoal dark:text-white uppercase tracking-wider">
                Banner & Tagline
              </h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-nu-purple" />
                Cover Banner Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
              <p className="text-[11px] text-nu-muted dark:text-gray-400">
                Leave empty to use a soft gradient matching your brand color
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-nu-purple" />
                Headline Tagline
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Digital Creator • Building apps & presets"
                maxLength={120}
                className="border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-bold rounded-full py-3.5 text-sm shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Branding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Branding Changes
              </>
            )}
          </button>
        </form>

        {/* Right Column: Live Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <Sparkles className="w-4 h-4 text-nu-purple" />
            <h3 className="text-xs font-bold text-nu-charcoal dark:text-white uppercase tracking-wider">
              Live Mockup Preview
            </h3>
          </div>

          <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-nu-card">
            {/* Banner preview */}
            <div
              className="h-28 w-full transition-all duration-300"
              style={{
                background: coverImage
                  ? `url(${coverImage}) center/cover`
                  : `linear-gradient(135deg, ${accentColor}40, ${accentColor}11)`,
              }}
            />

            {/* Profile Avatar & Info */}
            <div className="px-5 pb-5 -mt-10 flex flex-col items-center text-center gap-2.5">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative group cursor-pointer"
                title="Click to change profile picture"
              >
                <div
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-[#180F26] shadow-md bg-nu-purple-soft flex items-center justify-center overflow-hidden group-hover:opacity-90 transition-opacity"
                  style={{ borderColor: `${accentColor}50` }}
                >
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={displayName}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-base font-extrabold text-nu-purple">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-nu-purple text-white shadow-xs border border-white dark:border-[#180F26]">
                  <Camera className="w-3 h-3" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-nu-charcoal dark:text-white">
                  {displayName}
                </h4>
                {username && (
                  <p className="text-[11px] text-nu-muted dark:text-gray-400">
                    @{username}
                  </p>
                )}
                {headline && (
                  <p
                    className="text-xs font-semibold mt-1 transition-colors"
                    style={{ color: accentColor }}
                  >
                    {headline}
                  </p>
                )}
              </div>

              {/* Sample link buttons with brand color */}
              <div className="w-full flex flex-col gap-2 mt-2">
                {(links.slice(0, 3).length > 0
                  ? links.slice(0, 3)
                  : [
                      { id: "1", title: "My Portfolio & Work", url: "https://example.com" },
                      { id: "2", title: "YouTube Channel", url: "https://youtube.com" },
                    ]
                ).map((link, idx) => (
                  <div
                    key={idx}
                    className="w-full py-2 px-3.5 rounded-xl border text-xs font-semibold text-nu-charcoal dark:text-gray-200 transition-all flex items-center justify-between"
                    style={{
                      borderColor: `${accentColor}40`,
                      backgroundColor: `${accentColor}08`,
                    }}
                  >
                    <span className="truncate">{link.title || link.url}</span>
                    <ExternalLink
                      className="w-3 h-3 shrink-0"
                      style={{ color: accentColor }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Quick Navigation Footer Buttons */}
      {onNavigateSubTab && (
        <div className="flex items-center justify-between gap-3 pt-6 border-t border-gray-100 dark:border-white/10 flex-wrap">
          <button
            onClick={() => onNavigateSubTab("link-management")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-white/15 bg-white dark:bg-[#180F26] text-nu-charcoal dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10 text-xs font-bold transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-nu-purple" />
            <span>Go to Link Management</span>
          </button>
          <button
            onClick={() => onNavigateSubTab("click-analytics")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-nu-purple hover:bg-nu-purple-hover text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Next: Click Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Change Avatar Modal */}
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        currentAvatar={profile?.avatar}
        displayName={displayName}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </div>
  );
}
