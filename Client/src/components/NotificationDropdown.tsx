import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Heart,
  Award,
  ShoppingBag,
  Sparkles,
  ShieldAlert,
  Info,
  X,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "DONATION" | "MEMBERSHIP" | "PURCHASE" | "SYSTEM" | "SECURITY";
  isRead: boolean;
  link?: string;
  createdAt: string;
}

const SAMPLE_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "New Supporter Tip! 💖",
    message: "A fan just supported you with ₹150 and left a note: 'Love your work!'",
    type: "DONATION",
    isRead: false,
    link: "/dashboard",
    createdAt: "10 mins ago",
  },
  {
    id: "notif-2",
    title: "New Membership Subscriber! 🌟",
    message: "Rahul joined your 'Gold Tier' membership plan.",
    type: "MEMBERSHIP",
    isRead: false,
    link: "/dashboard",
    createdAt: "1 hour ago",
  },
  {
    id: "notif-3",
    title: "Digital Product Sold! 📦",
    message: "Your 'Ultimate Notion Template' was purchased for ₹499.",
    type: "PURCHASE",
    isRead: false,
    link: "/dashboard",
    createdAt: "3 hours ago",
  },
  {
    id: "notif-4",
    title: "Profile Verified 🛡️",
    message: "Your creator profile has been officially verified by the BMC Link team.",
    type: "SECURITY",
    isRead: true,
    link: "/dashboard/profile",
    createdAt: "Yesterday",
  },
];

export function NotificationDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>(SAMPLE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "EARNINGS" | "SYSTEM">("ALL");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeFilter === "EARNINGS") {
      return n.type === "DONATION" || n.type === "MEMBERSHIP" || n.type === "PURCHASE";
    }
    if (activeFilter === "SYSTEM") {
      return n.type === "SYSTEM" || n.type === "SECURITY";
    }
    return true;
  });

  const getIcon = (type: AppNotification["type"]) => {
    switch (type) {
      case "DONATION":
        return (
          <div className="w-8 h-8 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500 shrink-0">
            <Heart className="w-4 h-4 fill-rose-500/20" />
          </div>
        );
      case "MEMBERSHIP":
        return (
          <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/50 flex items-center justify-center text-amber-500 shrink-0">
            <Award className="w-4 h-4 fill-amber-500/20" />
          </div>
        );
      case "PURCHASE":
        return (
          <div className="w-8 h-8 rounded-full bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-nu-purple shrink-0">
            <ShoppingBag className="w-4 h-4 fill-nu-purple/20" />
          </div>
        );
      case "SECURITY":
        return (
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/50 flex items-center justify-center text-blue-500 shrink-0">
            <ShieldAlert className="w-4 h-4 fill-blue-500/20" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-500 shrink-0">
            <Info className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white transition-all focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Popover Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white/80 dark:bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-nu-charcoal dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="bg-nu-purple/10 text-nu-purple dark:text-purple-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1 text-[11px] font-semibold text-nu-purple hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-gray-100 dark:border-white/10 flex items-center gap-1.5 bg-gray-50/50 dark:bg-white/2">
              <button
                onClick={() => setActiveFilter("ALL")}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  activeFilter === "ALL"
                    ? "bg-nu-purple text-white shadow-xs"
                    : "text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter("EARNINGS")}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  activeFilter === "EARNINGS"
                    ? "bg-nu-purple text-white shadow-xs"
                    : "text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white"
                }`}
              >
                Earnings
              </button>
              <button
                onClick={() => setActiveFilter("SYSTEM")}
                className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                  activeFilter === "SYSTEM"
                    ? "bg-nu-purple text-white shadow-xs"
                    : "text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white"
                }`}
              >
                System
              </button>
            </div>

            {/* Notification List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-white/5">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center px-4 gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center text-nu-muted">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-nu-charcoal dark:text-white">All caught up!</p>
                  <p className="text-[11px] text-nu-muted dark:text-gray-400">
                    No notifications in this category.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => markAsRead(item.id)}
                    className={`p-4 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-gray-50/80 dark:hover:bg-white/5 ${
                      !item.isRead ? "bg-purple-50/40 dark:bg-purple-950/15" : ""
                    }`}
                  >
                    {getIcon(item.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-nu-charcoal dark:text-white truncate">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-nu-muted dark:text-gray-400 shrink-0">
                          {item.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-nu-muted dark:text-gray-300 mt-0.5 leading-snug">
                        {item.message}
                      </p>
                      {item.link && (
                        <Link
                          to={item.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-nu-purple mt-1.5 hover:underline"
                        >
                          <span>View Details</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={(e) => removeNotification(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-opacity"
                      title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-gray-50/70 dark:bg-white/5 border-t border-gray-100 dark:border-white/10 flex items-center justify-center">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-nu-purple hover:underline"
              >
                Go to Creator Dashboard →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
