import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Check,
  X,
  User as UserIcon,
  Loader2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { updateProfile } from "@/lib/account";
import { checkUsername } from "@/lib/account";
import type { UpdateProfilePayload } from "@/lib/types";

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
  });

  // Sync form state when user data is loaded or refreshed
  useEffect(() => {
    if (user) {
      const p = user.creatorProfile;
      setForm({
        name: user.name ?? "",
        phone: user.phone ?? "",
        profilePicture: user.profilePicture ?? "",
        timezone: user.timezone ?? "",
        language: user.language ?? "",
        headline: p?.headline ?? "",
        bio: p?.bio ?? "",
        avatar: p?.avatar ?? "",
        coverImage: p?.coverImage ?? "",
        website: p?.website ?? "",
        accentColor: p?.accentColor ?? "#820AD1",
      });
      if (p?.username) {
        setUsernameValue(p.username);
      }
    }
  }, [user]);

  const [usernameValue, setUsernameValue] = useState(
    profile?.username ?? ""
  );
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);

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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    // Build clean payload — only include changed/non-empty fields
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
      await refresh(); // sync auth context
      success("Profile updated successfully!");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
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
  const avatarSrc = profile?.avatar ?? user?.profilePicture;

  return (
    <div className="min-h-screen bg-nu-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-16">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-nu-charcoal">
              Edit Profile
            </h1>
            <p className="text-xs text-nu-muted">
              Manage your public creator profile
            </p>
          </div>
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
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-nu-purple-soft border border-gray-100 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-7 h-7 text-nu-purple" />
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-nu-charcoal">
                  {displayName}
                </p>
                {profile?.username && (
                  <p className="text-xs text-nu-muted">@{profile.username}</p>
                )}
                <p className="text-xs text-nu-muted mt-0.5">{user?.email}</p>
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
                <p className="text-xs text-nu-muted">
                  Note: Username editing is shown here for UX — actual username
                  changes require a separate username update endpoint.
                </p>
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
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </main>
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
