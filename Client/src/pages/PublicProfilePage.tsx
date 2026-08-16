import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Globe,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Github,
  Link2,
  ExternalLink,
  Star,
  AlertCircle,
  User as UserIcon,
  Share2,
  Check,
  Heart,
  Coffee,
  Award,
  Package,
  Calendar,
  Mail,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import { getPublicLinks } from "@/lib/links";
import { getPublicPlans } from "@/lib/memberships";
import { getPublicProducts } from "@/lib/products";
import { preloadRazorpayScript } from "@/lib/razorpay";
import { DonationModal } from "@/components/Modals/DonationModal";
import { SubscribeModal } from "@/components/Modals/SubscribeModal";
import { ThemeToggle } from "@/components/ThemeToggle";
import type {
  DigitalProduct,
  Link as LinkType,
  MembershipPlan,
  PublicProfile,
} from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

// ─── Link type icons & colors ─────────────────────────────────────────────────

const LINK_ICONS: Record<string, React.ReactNode> = {
  WEBSITE: <Globe className="w-5 h-5" />,
  YOUTUBE: <Youtube className="w-5 h-5" />,
  INSTAGRAM: <Instagram className="w-5 h-5" />,
  FACEBOOK: <Facebook className="w-5 h-5" />,
  TWITTER: <Twitter className="w-5 h-5" />,
  GITHUB: <Github className="w-5 h-5" />,
  CUSTOM: <Link2 className="w-5 h-5" />,
};

const LINK_BG: Record<string, string> = {
  WEBSITE: "bg-blue-50 text-blue-600",
  YOUTUBE: "bg-red-50 text-red-600",
  INSTAGRAM: "bg-pink-50 text-pink-600",
  FACEBOOK: "bg-blue-50 text-blue-700",
  TWITTER: "bg-sky-50 text-sky-600",
  GITHUB: "bg-gray-100 text-gray-700",
  CUSTOM: "bg-nu-purple-soft text-nu-purple",
};

// ─── Skeleton loader ──────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col items-center gap-6 pt-20 animate-pulse">
      <div className="w-24 h-24 rounded-full bg-gray-200" />
      <div className="w-40 h-5 bg-gray-200 rounded-full" />
      <div className="w-60 h-3 bg-gray-100 rounded-full" />
      <div className="w-full max-w-sm flex flex-col gap-3 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-16 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [products, setProducts] = useState<DigitalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Modals state
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);

  // Share state
  const [copied, setCopied] = useState(false);

  // Preload payment script on idle for instant donations & membership checkouts
  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  useEffect(() => {
    if (!username) return;
    (async () => {
      setLoading(true);
      setNotFound(false);
      try {
        // Fetch public links, membership plans, and products simultaneously in parallel
        const [linksRes, plansRes, prodsRes] = await Promise.allSettled([
          getPublicLinks(username),
          getPublicPlans(username),
          getPublicProducts(username),
        ]);

        if (linksRes.status === "fulfilled") {
          const linkData = linksRes.value;
          setProfile(linkData);
          setLinks((linkData as unknown as { links: LinkType[] }).links ?? []);
        } else {
          const status = (linksRes.reason as { status?: number })?.status;
          if (status === 404) {
            setNotFound(true);
            return;
          }
        }

        if (plansRes.status === "fulfilled") {
          setPlans(plansRes.value);
        } else {
          setPlans([]);
        }

        if (prodsRes.status === "fulfilled") {
          setProducts(prodsRes.value);
        } else {
          setProducts([]);
        }
      } catch (err: unknown) {
        const status = (err as { status?: number })?.status;
        if (status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName ?? username}'s links`,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nu-bg px-4">
        <Skeleton />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-nu-bg flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <div className="text-center">
          <h1 className="text-xl font-bold text-nu-charcoal">
            Creator not found
          </h1>
          <p className="text-sm text-nu-muted mt-1">
            @{username} doesn&apos;t exist or has been removed.
          </p>
        </div>
        <Link
          to="/"
          className="mt-2 text-sm font-semibold text-nu-purple hover:underline"
        >
          ← Back to home
        </Link>
      </div>
    );
  }

  const rawData = profile as any;
  const cp = rawData?.creatorProfile ?? rawData;
  const profileUsername = cp?.username ?? rawData?.username ?? username;
  const displayName = rawData?.name ?? rawData?.user?.name ?? (profileUsername ? `@${profileUsername}` : "Creator");
  const avatarSrc = cp?.avatar ?? rawData?.avatar ?? rawData?.profilePicture ?? rawData?.user?.profilePicture;
  const coverImage = cp?.coverImage ?? rawData?.coverImage;
  const headline = cp?.headline ?? rawData?.headline;
  const bio = cp?.bio ?? rawData?.bio;
  const website = cp?.website ?? rawData?.website;
  const accentColor = cp?.accentColor ?? rawData?.accentColor ?? "#820AD1";

  const creatorSettings = rawData?.user?.creatorSettings || cp?.user?.creatorSettings;
  const allowDonations = creatorSettings ? creatorSettings.allowDonations : true;
  const allowMemberships = creatorSettings ? creatorSettings.allowMemberships : true;
  const allowProducts = creatorSettings ? creatorSettings.allowProducts : true;
  const showEmail = creatorSettings ? creatorSettings.showEmail : false;

  const sortedLinks = [...links].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (a.position ?? 999) - (b.position ?? 999);
  });

  return (
    <div className="min-h-screen bg-nu-bg pb-16 relative">
      {/* Top Floating Controls */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-6 z-20 flex items-center gap-2">
        <ThemeToggle className="bg-white/80 dark:bg-black/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm" />
      </div>

      {/* Cover image */}
      <motion.div
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full h-40 sm:h-52"
        style={{
          background: coverImage
            ? `url(${coverImage}) center/cover`
            : `linear-gradient(135deg, ${accentColor}33, ${accentColor}11)`,
        }}
      />

      {/* Profile card */}
      <div className="max-w-lg mx-auto px-4 -mt-14 flex flex-col items-center text-center gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
          className="w-24 h-24 rounded-full border-4 border-white shadow-nu-card bg-nu-purple-soft flex items-center justify-center overflow-hidden"
          style={{ borderColor: `${accentColor}40` }}
        >
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={displayName}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-nu-purple" />
          )}
        </motion.div>

        <div>
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-nu-charcoal">
              {displayName}
            </h1>
            {profile?.user?.isVerified && (
              <span
                title="Verified Creator"
                className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-full text-xs font-bold shadow-2xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 fill-blue-500 text-white" />
                <span className="text-[11px]">Verified</span>
              </span>
            )}
          </div>
          {profileUsername && <p className="text-sm text-nu-muted font-medium mt-0.5">@{profileUsername}</p>}
        </div>

        {headline && (
          <p
            className="text-base font-semibold"
            style={{ color: accentColor }}
          >
            {headline}
          </p>
        )}

        {bio && (
          <p className="text-sm text-nu-muted leading-relaxed max-w-sm">
            {bio}
          </p>
        )}

        <div className="flex items-center gap-3 flex-wrap justify-center">
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold text-nu-purple hover:text-nu-purple-hover transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {website.replace(/^https?:\/\//, "")}
            </a>
          )}

          {showEmail && rawData?.user?.email && (
            <a
              href={`mailto:${rawData.user.email}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted hover:text-nu-charcoal transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              {rawData.user.email}
            </a>
          )}
        </div>

        {/* Action Buttons: Donate & Share */}
        <div className="flex items-center gap-2.5 mt-1 flex-wrap justify-center">
          {allowDonations && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setIsDonateOpen(true)}
              className="flex items-center gap-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-full px-5 py-2.5 transition-all shadow-md active:scale-95"
            >
              <Coffee className="w-4 h-4" />
              <span>Buy me a coffee</span>
            </motion.button>
          )}

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleShare}
            className="flex items-center gap-2 text-xs font-semibold border-2 rounded-full px-4 py-2 transition-all"
            style={{
              borderColor: `${accentColor}40`,
              color: accentColor,
              backgroundColor: `${accentColor}0d`,
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="check"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Link copied!
                </motion.span>
              ) : (
                <motion.span
                  key="share"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  className="flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share profile
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ── Links Section ─────────────────────────────────────────────── */}
        <div className="w-full mt-4 flex flex-col gap-3">
          {sortedLinks.length > 0 && (
            sortedLinks.map((link) => {
              const iconClass = LINK_BG[link.type] ?? LINK_BG.CUSTOM;

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-white hover:bg-nu-purple-soft rounded-2xl border border-gray-100 hover:border-nu-purple/20 px-4 py-3.5 shadow-sm hover:shadow-nu-soft hover:-translate-y-0.5 active:scale-[0.99] transition-all duration-200 text-left will-change-transform"
                  style={link.isFeatured ? { borderColor: `${accentColor}40` } : undefined}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconClass} group-hover:scale-105 transition-transform`}
                  >
                    {LINK_ICONS[link.type]}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-nu-charcoal truncate group-hover:text-nu-purple transition-colors">
                        {link.title ?? link.url}
                      </p>
                      {link.isFeatured && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    {link.title && (
                      <p className="text-xs text-nu-muted truncate">{link.url}</p>
                    )}
                  </div>

                  <ExternalLink className="w-4 h-4 text-nu-muted shrink-0 group-hover:text-nu-purple transition-colors" />
                </a>
              );
            })
          )}
        </div>

        {/* ── Membership Tiers Showcase ──────────────────────────────────── */}
        {allowMemberships && plans.length > 0 && (
          <div className="w-full mt-6 text-left flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Award className="w-4 h-4 text-nu-purple" />
              <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
                Membership Tiers
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-nu-soft transition-all flex flex-col gap-2.5"
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-bold text-nu-charcoal">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-extrabold text-nu-purple">
                        ₹{Number(plan.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] text-nu-muted">/ {plan.durationDays}d</span>
                    </div>
                  </div>

                  {plan.description && (
                    <p className="text-xs text-nu-muted leading-relaxed">
                      {plan.description}
                    </p>
                  )}

                  <button
                    onClick={() => setSelectedPlan(plan)}
                    className="w-full mt-1 bg-nu-purple-soft hover:bg-nu-purple text-nu-purple hover:text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs"
                  >
                    Join {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Digital Products Showcase ─────────────────────────────────── */}
        {allowProducts && products.length > 0 && (
          <div className="w-full mt-6 text-left flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <Package className="w-4 h-4 text-nu-purple" />
              <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
                Digital Products & Downloads
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  to={`/${profileUsername}/products/${product.slug}`}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-nu-card transition-all flex flex-col justify-between group"
                >
                  {product.thumbnail ? (
                    <div className="h-28 bg-gray-100 overflow-hidden">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-24 bg-nu-purple-soft/60 flex items-center justify-center text-nu-purple">
                      <Package className="w-8 h-8" />
                    </div>
                  )}

                  <div className="p-3.5 flex flex-col gap-1.5 flex-1 justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-nu-charcoal line-clamp-2 group-hover:text-nu-purple transition-colors">
                        {product.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                      <span className="text-sm font-extrabold text-nu-purple">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                      <span className="text-[11px] font-semibold text-nu-purple flex items-center gap-0.5">
                        Buy <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer attribution */}
        <div className="mt-8 flex flex-col items-center gap-1">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-nu-muted hover:text-nu-purple transition-colors font-medium"
          >
            <div className="w-5 h-5 bg-nu-purple rounded-md flex items-center justify-center shadow-xs">
              <span className="text-white text-[9px] font-extrabold">B</span>
            </div>
            Made with BMC Link
          </Link>
        </div>
      </div>

      {/* Modals */}
      <DonationModal
        isOpen={isDonateOpen}
        username={profileUsername || username || ""}
        creatorName={displayName}
        avatarSrc={avatarSrc}
        onClose={() => setIsDonateOpen(false)}
      />

      <SubscribeModal
        isOpen={Boolean(selectedPlan)}
        plan={selectedPlan}
        creatorName={displayName}
        onClose={() => setSelectedPlan(null)}
      />
    </div>
  );
}
