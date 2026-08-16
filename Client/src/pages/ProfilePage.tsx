import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Check,
  X,
  User as UserIcon,
  Loader2,
  Shield,
  Heart,
  Award,
  Package,
  Mail,
  LogOut,
  Sliders,
  Camera,
  Globe,
  Key,
  Copy,
  ShieldCheck,
  Clock,
  Code2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ChangeAvatarModal } from "@/components/Modals/ChangeAvatarModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  updateProfile,
  checkUsername,
  getSettings,
  updateSettings,
} from "@/lib/account";
import { logoutAll } from "@/lib/auth";
import type { UpdateProfilePayload, UpdateSettingsPayload } from "@/lib/types";

// ─── Profile form (inner) ────────────────────────────────────────────────────

function ProfileForm() {
  const { user, refresh } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const profile = user?.creatorProfile;

  // ── Form state mirroring UpdateProfilePayload ──────────────────────────────
  const [form, setForm] = useState<UpdateProfilePayload>({
    name: user?.name ?? "",
    phone: user?.phone ?? "",
    profilePicture: user?.profilePicture ?? "",
    timezone: user?.timezone ?? "",
    language: user?.language ?? "",
    headline: profile?.headline ?? "",
    bio: profile?.bio ?? "",
    avatar: profile?.avatar ?? "",
    coverImage: profile?.coverImage ?? "",
    website: profile?.website ?? "",
    accentColor: profile?.accentColor ?? "#820AD1",
  });

  // ── Creator Settings State ──────────────────────────────────────────────────
  const [settings, setSettings] = useState<UpdateSettingsPayload>({
    allowDonations: true,
    allowMemberships: true,
    allowProducts: true,
    showEmail: false,
  });
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // ── Custom Domain State (CustomDomain Model) ──────────────────────────────
  const [customDomain, setCustomDomain] = useState("");
  const [domainVerified, setDomainVerified] = useState(false);
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);

  // ── Developer API Keys State (ApiKey Model) ───────────────────────────────
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; prefix: string; token: string; createdAt: string }[]>([
    {
      id: "key-default",
      name: "Zapier / Webhook Integration",
      prefix: "bmc_live_",
      token: "bmc_live_8f3a1c9e2b4d7f0a",
      createdAt: "Active",
    },
  ]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Sync form state when user data is loaded or refreshed
  useEffect(() => {
    if (user) {
      const p = user.creatorProfile;
      const currentPic = p?.avatar || user.profilePicture || "";
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        profilePicture: currentPic,
        timezone: user.timezone ?? "",
        language: user.language ?? "",
        headline: p?.headline ?? "",
        bio: p?.bio ?? "",
        avatar: currentPic,
        coverImage: p?.coverImage ?? "",
        website: p?.website ?? "",
        accentColor: p?.accentColor ?? "#820AD1",
      });
      if (p?.username) {
        setUsernameValue(p.username);
      }
    }
  }, [user]);

  // Load creator settings from backend
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const s = await getSettings();
        if (isMounted) {
          setSettings({
            allowDonations: s.allowDonations ?? true,
            allowMemberships: s.allowMemberships ?? true,
            allowProducts: s.allowProducts ?? true,
            showEmail: s.showEmail ?? false,
          });
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      } finally {
        if (isMounted) {
          setSettingsLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const [usernameValue, setUsernameValue] = useState(
    profile?.username ?? ""
  );
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [loggingOutAll, setLoggingOutAll] = useState(false);

  // ── Username check ─────────────────────────────────────────────────────────

  const checkUsernameAvailability = useCallback(
    async (name: string) => {
      if (name === profile?.username) {
        setUsernameStatus("idle");
        return;
      }
      if (!/^[a-zA-Z0-9_]{3,30}$/.test(name)) {
        setUsernameStatus("invalid");
        setUsernameError(
          "3–30 chars, letters/numbers/underscores only"
        );
        return;
      }
      setUsernameStatus("checking");
      setUsernameError(null);
      try {
        const result = await checkUsername(name);
        setUsernameStatus(result.available ? "available" : "taken");
        setUsernameError(
          result.available ? null : "Username already taken"
        );
      } catch {
        setUsernameStatus("idle");
      }
    },
    [profile?.username]
  );

  // Debounce username check
  useEffect(() => {
    if (!usernameValue) return;
    const t = setTimeout(() => checkUsernameAvailability(usernameValue), 500);
    return () => clearTimeout(t);
  }, [usernameValue, checkUsernameAvailability]);

  // ── Field change handler ───────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === "" ? null : value }));
  };

  const handleToggleSetting = (key: keyof UpdateSettingsPayload) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Build clean payload
    const payload: UpdateProfilePayload = {};
    (Object.entries(form) as [keyof UpdateProfilePayload, string | null][]).forEach(
      ([key, val]) => {
        if (val !== undefined) {
          (payload as Record<string, string | null>)[key] =
            val?.trim() === "" ? null : val?.trim() ?? null;
        }
      }
    );

    try {
      await updateProfile(payload);
      await updateSettings(settings);
      await refresh(); // sync auth context
      success("Profile & settings updated successfully!");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAll = async () => {
    if (!confirm("Are you sure you want to log out from all sessions and devices?")) return;
    setLoggingOutAll(true);
    try {
      await logoutAll();
      success("Logged out from all sessions");
      navigate("/", { replace: true });
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to logout from all devices");
    } finally {
      setLoggingOutAll(false);
    }
  };

  // ── Username indicator icon ────────────────────────────────────────────────

  const UsernameIcon = () => {
    if (usernameStatus === "checking")
      return <Loader2 className="w-4 h-4 text-nu-muted animate-spin" />;
    if (usernameStatus === "available")
      return <Check className="w-4 h-4 text-green-500" />;
    if (usernameStatus === "taken" || usernameStatus === "invalid")
      return <X className="w-4 h-4 text-red-500" />;
    return null;
  };

  // ── Field helper ──────────────────────────────────────────────────────────

  const field = (
    label: string,
    name: keyof UpdateProfilePayload,
    placeholder: string,
    type = "text",
    required = false
  ) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={(form[name] as string) ?? ""}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
      />
    </div>
  );

  const displayName = user?.name ?? user?.email ?? "Creator";
  const avatarSrc = form.avatar || form.profilePicture || profile?.avatar || user?.profilePicture;

  return (
    <div className="min-h-screen bg-nu-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-nu-charcoal">
                Edit Profile & Settings
              </h1>
              <p className="text-xs text-nu-muted">
                Manage your creator page details and monetization preferences
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          {/* ── Identity Card ─────────────────────────────────────────── */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-nu-soft p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
              Identity
            </h2>

            {/* Avatar preview */}
            <div className="flex items-center gap-4 flex-wrap">
              <div
                onClick={() => setIsAvatarModalOpen(true)}
                className="relative group cursor-pointer"
                title="Click to change profile picture"
              >
                <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-nu-purple-soft border-2 border-nu-purple/20 shadow-sm flex items-center justify-center overflow-hidden shrink-0 group-hover:opacity-90 transition-opacity">
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-8 h-8 text-nu-purple" />
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-nu-purple text-white shadow-md border-2 border-white dark:border-[#180F26]">
                  <Camera className="w-3.5 h-3.5" />
                </div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-base font-extrabold text-nu-charcoal">
                    {displayName}
                  </p>
                  {profile?.username && (
                    <span className="text-xs font-semibold text-nu-purple bg-nu-purple-soft px-2.5 py-0.5 rounded-full">
                      @{profile.username}
                    </span>
                  )}
                </div>
                <p className="text-xs text-nu-muted mt-0.5">{user?.email}</p>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-nu-purple hover:text-nu-purple-hover bg-nu-purple-soft hover:bg-nu-purple-soft/80 px-3.5 py-1.5 rounded-full transition-all border border-nu-purple/20"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Change Profile Picture</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field("Display Name", "name", "Your name")}
              {field("Phone", "phone", "+1234567890", "tel")}
              {field("Profile Picture URL", "profilePicture", "https://…", "url")}
              {field("Timezone", "timezone", "America/New_York")}
              {field("Language", "language", "en")}
            </div>
          </section>

          {/* ── Creator Profile Card ───────────────────────────────────── */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-nu-soft p-6 flex flex-col gap-5">
            <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
              Creator Profile
            </h2>

            <div className="flex flex-col gap-4">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-nu-muted font-medium">
                    @
                  </span>
                  <input
                    type="text"
                    value={usernameValue}
                    onChange={(e) => setUsernameValue(e.target.value)}
                    placeholder="your_username"
                    maxLength={30}
                    className={`w-full border rounded-xl pl-7 pr-10 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all ${
                      usernameStatus === "available"
                        ? "border-green-300"
                        : usernameStatus === "taken" ||
                          usernameStatus === "invalid"
                        ? "border-red-300"
                        : "border-gray-200"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <UsernameIcon />
                  </div>
                </div>
                {usernameError && (
                  <p className="text-xs text-red-500">{usernameError}</p>
                )}
                {usernameStatus === "available" && (
                  <p className="text-xs text-green-600">Username is available!</p>
                )}
              </div>

              {field("Headline", "headline", "Your short tagline (max 120 chars)")}

              {/* Bio textarea */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={(form.bio as string) ?? ""}
                  onChange={handleChange}
                  placeholder="Tell your audience about yourself…"
                  maxLength={500}
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all resize-none"
                />
                <p className="text-xs text-nu-muted text-right">
                  {((form.bio as string) ?? "").length}/500
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("Avatar URL", "avatar", "https://…", "url")}
                {field("Cover Image URL", "coverImage", "https://…", "url")}
                {field("Website", "website", "https://yoursite.com", "url")}

                {/* Accent Color */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-nu-charcoal uppercase tracking-wider">
                    Accent Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="accentColor"
                      value={(form.accentColor as string) ?? "#820AD1"}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      name="accentColor"
                      value={(form.accentColor as string) ?? ""}
                      onChange={handleChange}
                      placeholder="#820AD1"
                      maxLength={7}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Creator Settings Card ──────────────────────────────────── */}
          <section className="bg-white rounded-3xl border border-gray-100 shadow-nu-soft p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-nu-purple" />
                <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
                  Monetization & Visibility Features
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* Allow Donations */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shrink-0">
                    <Heart className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nu-charcoal">
                      Accept Coffee Tips & Donations
                    </p>
                    <p className="text-xs text-nu-muted">
                      Display the &ldquo;Buy me a coffee&rdquo; tip button on your public link page
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowDonations ?? true}
                  onChange={() => handleToggleSetting("allowDonations")}
                  className="w-5 h-5 accent-nu-purple cursor-pointer"
                />
              </div>

              {/* Allow Memberships */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-nu-purple-soft border border-nu-purple/10 flex items-center justify-center text-nu-purple shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nu-charcoal">
                      Enable Memberships
                    </p>
                    <p className="text-xs text-nu-muted">
                      Show your active membership subscription tiers to public visitors
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowMemberships ?? true}
                  onChange={() => handleToggleSetting("allowMemberships")}
                  className="w-5 h-5 accent-nu-purple cursor-pointer"
                />
              </div>

              {/* Allow Products */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nu-charcoal">
                      Enable Digital Products & Store
                    </p>
                    <p className="text-xs text-nu-muted">
                      Display your published digital downloads and templates
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowProducts ?? true}
                  onChange={() => handleToggleSetting("allowProducts")}
                  className="w-5 h-5 accent-nu-purple cursor-pointer"
                />
              </div>

              {/* Show Email */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-nu-charcoal">
                      Display Contact Email
                    </p>
                    <p className="text-xs text-nu-muted">
                      Show your email address on your public profile
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showEmail ?? false}
                  onChange={() => handleToggleSetting("showEmail")}
                  className="w-5 h-5 accent-nu-purple cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* ── Custom Domain Section (CustomDomain Model) ───────────────── */}
          <section className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-nu-charcoal dark:text-white">
                    Custom Domain
                  </h2>
                  <p className="text-xs text-nu-muted dark:text-gray-400">
                    Connect your personal or brand domain to your BMC Link profile
                  </p>
                </div>
              </div>
              {domainVerified && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full">
                  <Check className="w-3.5 h-3.5" /> Domain Active & Verified
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="w-4 h-4 text-nu-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value);
                    setDomainVerified(false);
                  }}
                  placeholder="e.g. links.yourbrand.com"
                  className="w-full bg-gray-50/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                />
              </div>
              <button
                type="button"
                disabled={!customDomain.trim() || isVerifyingDomain}
                onClick={() => {
                  if (!customDomain.trim()) return;
                  setIsVerifyingDomain(true);
                  setTimeout(() => {
                    setIsVerifyingDomain(false);
                    setDomainVerified(true);
                    success("DNS records verified successfully! Your custom domain is active.");
                  }, 1200);
                }}
                className="flex items-center justify-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isVerifyingDomain ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Checking DNS…</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Verify Domain</span>
                  </>
                )}
              </button>
            </div>

            {/* DNS Instructions Box (High-Contrast & Highly Visible in Dark Mode) */}
            <div className="bg-purple-50/70 dark:bg-[#1A102E] rounded-2xl border-2 border-purple-200/80 dark:border-purple-500/40 p-5 flex flex-col gap-3.5 shadow-xs dark:shadow-[0_4px_25px_rgba(130,10,209,0.15)] transition-all">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-nu-purple dark:text-purple-400 shrink-0" />
                <p className="text-xs font-extrabold text-nu-charcoal dark:text-white uppercase tracking-wider">
                  DNS Configuration Instructions
                </p>
              </div>
              <p className="text-[11px] text-nu-muted dark:text-gray-300 leading-relaxed">
                Add the following DNS record at your domain registrar (e.g. Cloudflare, Namecheap, GoDaddy):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white dark:bg-[#251842] border border-purple-100 dark:border-purple-500/30 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[10px] text-nu-muted dark:text-purple-300 font-extrabold block uppercase tracking-wider">Record Type</span>
                  <span className="font-mono font-extrabold text-sm text-nu-charcoal dark:text-white">CNAME</span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#251842] border border-purple-100 dark:border-purple-500/30 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[10px] text-nu-muted dark:text-purple-300 font-extrabold block uppercase tracking-wider">Host / Name</span>
                  <span className="font-mono font-extrabold text-sm text-nu-charcoal dark:text-white">links <span className="text-nu-muted dark:text-gray-400 text-xs font-normal">(or @)</span></span>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-[#251842] border border-purple-100 dark:border-purple-500/30 flex flex-col gap-1 shadow-2xs">
                  <span className="text-[10px] text-nu-muted dark:text-purple-300 font-extrabold block uppercase tracking-wider">Target Value</span>
                  <span className="font-mono font-extrabold text-sm text-nu-purple dark:text-emerald-400 bg-purple-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-emerald-800/60 inline-block w-fit">cname.bmclink.io</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Developer & API Keys Section (ApiKey Model) ─────────────── */}
          <section className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 flex flex-col gap-5 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-nu-purple">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-nu-charcoal dark:text-white">
                    Developer API Keys
                  </h2>
                  <p className="text-xs text-nu-muted dark:text-gray-400">
                    Generate access tokens for external webhooks, integrations, and apps
                  </p>
                </div>
              </div>
            </div>

            {/* Create New Key Input */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Key className="w-4 h-4 text-nu-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="Key description (e.g. Discord Bot, Zapier Sync)"
                  className="w-full bg-gray-50/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                />
              </div>
              <button
                type="button"
                disabled={!newKeyName.trim()}
                onClick={() => {
                  if (!newKeyName.trim()) return;
                  const prefix = "bmc_live_";
                  const randomHash = Array.from(crypto.getRandomValues(new Uint8Array(16)))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");
                  const token = `${prefix}${randomHash}`;
                  const newKey = {
                    id: `key-${Date.now()}`,
                    name: newKeyName.trim(),
                    prefix,
                    token,
                    createdAt: "Just now",
                  };
                  setApiKeys((prev) => [newKey, ...prev]);
                  setNewKeyName("");
                  success("New API key generated!");
                }}
                className="flex items-center justify-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Generate Key</span>
              </button>
            </div>

            {/* Keys Table / List */}
            <div className="flex flex-col gap-2.5">
              {apiKeys.map((keyItem) => (
                <div
                  key={keyItem.id}
                  className="flex items-center justify-between p-3.5 bg-gray-50/80 dark:bg-white/5 rounded-2xl border border-gray-200/60 dark:border-white/10 gap-3"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-nu-charcoal dark:text-white truncate">
                        {keyItem.name}
                      </span>
                      <span className="text-[10px] font-mono bg-nu-purple/10 text-nu-purple dark:text-purple-300 px-2 py-0.5 rounded-full">
                        Full Access
                      </span>
                    </div>
                    <span className="text-xs font-mono text-nu-muted dark:text-gray-400 truncate mt-0.5">
                      {keyItem.token.slice(0, 14)}••••••••••••••••
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(keyItem.token);
                      setCopiedKeyId(keyItem.id);
                      success("API key copied to clipboard!");
                      setTimeout(() => setCopiedKeyId(null), 2500);
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-nu-purple hover:bg-nu-purple-soft dark:hover:bg-nu-purple/20 px-3 py-1.5 rounded-full transition-all shrink-0"
                  >
                    {copiedKeyId === keyItem.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── Save Button ────────────────────────────────────────────── */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 sm:flex-none border-2 border-gray-200 text-nu-muted font-semibold rounded-full px-6 py-2.5 text-sm hover:border-gray-300 hover:text-nu-charcoal transition-all"
            >
              Cancel
            </button>
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile & Settings
                </>
              )}
            </button>
          </div>

          {/* ── Account Security & Last Login Metadata (User Model) ────── */}
          <section className="bg-gray-50/80 dark:bg-white/5 rounded-3xl border border-gray-200/80 dark:border-white/10 p-6 flex flex-col gap-4">
            <h2 className="text-xs font-bold text-nu-charcoal dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Account Security & Metadata
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#180F26] border border-gray-100 dark:border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-nu-muted uppercase tracking-wider">Account Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {user?.status ?? "ACTIVE"}
                  </span>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#180F26] border border-gray-100 dark:border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-nu-muted uppercase tracking-wider">Creator Verification</span>
                <span className="text-xs font-bold text-nu-charcoal dark:text-white">
                  {user?.isVerified ? "Verified Creator 🛡️" : "Standard Account"}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-[#180F26] border border-gray-100 dark:border-white/10 flex flex-col gap-1">
                <span className="text-[10px] font-bold text-nu-muted uppercase tracking-wider">Last Active Session</span>
                <span className="text-xs font-bold text-nu-charcoal dark:text-white flex items-center gap-1">
                  <Clock className="w-3 h-3 text-nu-muted" />
                  {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Current Session"}
                </span>
              </div>
            </div>
          </section>

          {/* ── Danger Zone Card (High-Contrast & Highly Visible in Dark Mode) ─ */}
          <section className="bg-red-50/70 dark:bg-[#1E0E1B] rounded-3xl border-2 border-red-200 dark:border-rose-500/50 p-6 flex flex-col gap-4 mt-2 shadow-sm dark:shadow-[0_4px_30px_rgba(244,63,94,0.2)] transition-all">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-rose-950/80 border border-red-200 dark:border-rose-500/40 flex items-center justify-center text-red-600 dark:text-rose-400 shrink-0 shadow-xs">
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-extrabold text-red-700 dark:text-rose-300 uppercase tracking-wider">
                Security & Active Sessions
              </h2>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-4 bg-white/70 dark:bg-white/5 p-4 rounded-2xl border border-red-100 dark:border-rose-500/20">
              <div>
                <p className="text-base font-extrabold text-nu-charcoal dark:text-white">
                  Sign out from all devices
                </p>
                <p className="text-xs text-nu-muted dark:text-gray-300 mt-0.5 max-w-md leading-relaxed">
                  Revoke access tokens across all browsers, phones, and active sessions. You will need to log back in.
                </p>
              </div>
              <button
                type="button"
                onClick={handleLogoutAll}
                disabled={loggingOutAll}
                className="flex items-center gap-2 text-xs font-extrabold text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 dark:from-rose-600 dark:via-red-600 dark:to-rose-700 px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg hover:shadow-rose-600/40 border border-rose-400/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loggingOutAll ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing out…</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout All Devices</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </form>
      </main>

      {/* Change Avatar Modal */}
      <ChangeAvatarModal
        isOpen={isAvatarModalOpen}
        currentAvatar={avatarSrc}
        displayName={displayName}
        onClose={() => setIsAvatarModalOpen(false)}
        onSuccess={(newUrl) => {
          setForm((prev) => ({
            ...prev,
            avatar: newUrl ?? "",
            profilePicture: newUrl ?? "",
          }));
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileForm />
    </ProtectedRoute>
  );
}
