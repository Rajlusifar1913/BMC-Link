import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Search, User, ArrowRight, Menu, X, LogOut, Settings, Shield } from "lucide-react";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogoutConfirmModal } from "@/components/Modals/LogoutConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenCpf: () => void;
}

export function Navbar({ onOpenSearch, onOpenCpf }: NavbarProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      success("Logged out successfully");
      setIsLogoutModalOpen(false);
      navigate("/", { replace: true });
      setMobileOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navLinks = [
    { label: "Showcase", href: "#showcase" },
    { label: "Features", href: "#features" },
    { label: "Security", href: "#safety" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-[#130924]/95 backdrop-blur-md border-b border-gray-100/80 dark:border-white/15 shadow-sm dark:shadow-[0_4px_25px_rgba(0,0,0,0.5)] transition-all">
        {/* Scroll Progress Bar at the top */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-nu-purple via-purple-500 to-indigo-600 transform-origin-left z-50 shadow-nu-glow"
          style={{ scaleX, willChange: "transform", transformOrigin: "0%" }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-nu-purple rounded-2xl flex items-center justify-center shadow-nu-soft group-hover:bg-nu-purple-hover transition-all"
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold text-nu-charcoal dark:text-white tracking-tight group-hover:text-nu-purple dark:group-hover:text-purple-300 transition-colors">
                BMC Link
              </span>
              <span className="text-[10px] font-semibold text-nu-muted dark:text-purple-200/70 uppercase tracking-widest -mt-1">
                Link-in-bio
              </span>
            </div>
          </Link>

          {/* Center Nav Links — Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-nu-charcoal/80 dark:text-gray-200">
            {navLinks.map((nl) => (
              <a
                key={nl.label}
                href={nl.href}
                className="hover:text-nu-purple dark:hover:text-purple-300 transition-colors"
              >
                {nl.label}
              </a>
            ))}
            <button
              onClick={onOpenCpf}
              className="hover:text-nu-purple dark:hover:text-purple-300 transition-colors font-medium text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white"
            >
              Verification
            </button>
          </nav>

          {/* Actions — Desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            <ThemeToggle />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white transition-all"
              title="Search profiles"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {/* In-App Notification Center */}
                <NotificationDropdown />

                {user?.role === "ADMIN" ? (
                  <>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 px-5 py-2.5 rounded-full text-sm shadow-md hover:shadow-amber-500/30 transition-all border border-amber-400/80 ring-2 ring-amber-400/30"
                      >
                        <Shield className="w-4 h-4 text-white fill-white/20" />
                        <span>Admin Panel</span>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        to="/dashboard?view=creator"
                        className="hidden lg:flex items-center gap-1.5 font-semibold text-nu-purple dark:text-purple-300 bg-nu-purple-soft dark:bg-nu-purple/20 hover:bg-nu-purple hover:text-white px-4 py-2.5 rounded-full text-xs transition-all border border-nu-purple/20"
                      >
                        <span>Creator View</span>
                      </Link>
                    </motion.div>
                  </>
                ) : (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 font-semibold bg-nu-purple hover:bg-nu-purple-hover text-white rounded-full px-5 py-2.5 text-sm transition-all shadow-md hover:shadow-lg"
                    >
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name ?? "User"}
                          decoding="async"
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span>{user?.name ?? "Dashboard"}</span>
                    </Link>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setIsLogoutModalOpen(true)}
                  title="Logout"
                  className="p-2.5 rounded-full bg-gray-100/80 dark:bg-white/5 text-nu-muted dark:text-gray-300 border border-transparent hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white hover:border-rose-500 shadow-2xs hover:shadow-md hover:shadow-rose-500/25 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all shadow-md hover:shadow-lg group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile Actions: Theme Toggle + Hamburger */}
          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle />
            <button
              className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-200 transition-all"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 inset-x-0 z-30 bg-white/95 dark:bg-[#160B29]/98 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-nu-card dark:shadow-2xl px-5 py-5 flex flex-col gap-4"
          >
            {/* Nav links */}
            {navLinks.map((nl) => (
              <a
                key={nl.label}
                href={nl.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-nu-charcoal dark:text-gray-100 hover:text-nu-purple dark:hover:text-purple-300 transition-colors py-2 border-b border-gray-50 dark:border-white/5"
              >
                {nl.label}
              </a>
            ))}
            <button
              onClick={() => { onOpenCpf(); setMobileOpen(false); }}
              className="text-sm font-semibold text-nu-muted dark:text-gray-300 hover:text-nu-purple dark:hover:text-purple-300 transition-colors py-2 border-b border-gray-50 dark:border-white/5 text-left"
            >
              Verification
            </button>
            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2 text-sm font-semibold text-nu-muted dark:text-gray-300 hover:text-nu-purple dark:hover:text-purple-300 transition-colors py-2 border-b border-gray-50 dark:border-white/5"
            >
              <Search className="w-4 h-4" />
              Search profiles
            </button>

            {/* Auth actions */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                {user?.role === "ADMIN" ? (
                  <>
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 font-extrabold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-5 py-3 text-sm justify-center rounded-full shadow-md border border-amber-400/80"
                    >
                      <Shield className="w-4 h-4 text-white fill-white/20" />
                      <span>Admin Control Panel</span>
                    </Link>
                    <Link
                      to="/dashboard?view=creator"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2 bg-nu-purple-soft dark:bg-nu-purple/20 text-nu-purple dark:text-purple-300 font-bold px-5 py-2.5 text-sm justify-center rounded-full border border-nu-purple/20"
                    >
                      Creator Dashboard
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-semibold rounded-full px-5 py-3 text-sm justify-center shadow-md bg-nu-purple text-white"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.name ?? "Dashboard"}</span>
                  </Link>
                )}
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 border-2 border-gray-200 dark:border-white/20 text-nu-muted dark:text-gray-300 font-semibold rounded-full px-5 py-2.5 text-sm justify-center hover:border-nu-purple hover:text-nu-purple transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="flex items-center gap-2 border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-bold rounded-full px-5 py-2.5 text-sm justify-center bg-red-50/50 dark:bg-red-950/20 hover:bg-rose-600 hover:text-white hover:border-rose-600 dark:hover:bg-rose-600 dark:hover:text-white transition-all duration-200 shadow-2xs hover:shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-3 text-sm transition-all shadow-md justify-center group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={isLoggingOut}
      />
    </>
  );
}
