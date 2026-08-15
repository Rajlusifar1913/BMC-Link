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
} from "lucide-react";
import { getPublicLinks } from "@/lib/links";
import type { Link as LinkType, PublicProfile } from "@/lib/types";
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

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Share state
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    (async () => {
      try {
        const data = await getPublicLinks(username);
        setProfile(data);
        setLinks((data as unknown as { links: LinkType[] }).links ?? []);
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

  const sortedLinks = [...links].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return (a.position ?? 999) - (b.position ?? 999);
  });

  return (
    <div className="min-h-screen bg-nu-bg pb-16">
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
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-10 h-10 text-nu-purple" />
          )}
        </motion.div>

        <div>
          <h1 className="text-2xl font-extrabold text-nu-charcoal">
            {displayName}
          </h1>
          {profileUsername && <p className="text-sm text-nu-muted font-medium">@{profileUsername}</p>}
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

        {website && (
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold text-nu-purple hover:text-nu-purple-hover transition-colors"
          >
            <Globe className="w-4 h-4" />
            {website.replace(/^https?:\/\//, "")}
          </a>
        )}

        {/* Share Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
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

        {/* Links Staggered Reveal */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="w-full mt-4 flex flex-col gap-3"
        >
          {sortedLinks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-nu-muted">No links yet.</p>
            </div>
          ) : (
            sortedLinks.map((link) => {
              const iconClass = LINK_BG[link.type] ?? LINK_BG.CUSTOM;

              return (
                <motion.a
                  key={link.id}
                  variants={itemVariants}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 bg-white hover:bg-nu-purple-soft rounded-2xl border border-gray-100 hover:border-nu-purple/20 px-4 py-3.5 shadow-sm hover:shadow-nu-soft transition-all duration-200 text-left"
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
                </motion.a>
              );
            })
          )}
        </motion.div>

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
    </div>
  );
}
