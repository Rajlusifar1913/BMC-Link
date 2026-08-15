import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Search, User, ArrowRight, Menu, X, LogOut, Settings } from "lucide-react";
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handleLogout = async () => {
    await logout();
    success("Logged out successfully");
    navigate("/login", { replace: true });
    setMobileOpen(false);
  };

  const navLinks = [
    { label: "Showcase", href: "#showcase" },
    { label: "Features", href: "#features" },
    { label: "Security", href: "#safety" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-100/80 transition-all">
        {/* Scroll Progress Bar at the top */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-nu-purple via-purple-500 to-indigo-600 transform-origin-left z-50 shadow-nu-glow"
          style={{ scaleX }}
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
              <span className="text-lg font-extrabold text-nu-charcoal tracking-tight group-hover:text-nu-purple transition-colors">
                BMC Link
              </span>
              <span className="text-[10px] font-semibold text-nu-muted uppercase tracking-widest -mt-1">
                Link-in-bio
              </span>
            </div>
          </Link>

          {/* Center Nav Links — Desktop */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-nu-charcoal/80">
            {navLinks.map((nl) => (
              <a key={nl.label} href={nl.href} className="hover:text-nu-purple transition-colors">
                {nl.label}
              </a>
            ))}
            <button
              onClick={onOpenCpf}
              className="hover:text-nu-purple transition-colors font-medium text-nu-muted hover:text-nu-charcoal"
            >
              Verification
            </button>
          </nav>

          {/* Actions — Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenSearch}
              className="p-2.5 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
              title="Search profiles"
            >
              <Search className="w-5 h-5" />
            </motion.button>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md hover:shadow-lg"
                  >
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name ?? "User"}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                    <span>{user?.name ?? "Dashboard"}</span>
                  </Link>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-full hover:bg-red-50 text-nu-muted hover:text-red-500 transition-all"
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

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2.5 rounded-full hover:bg-gray-100 text-nu-muted transition-all"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
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
            className="md:hidden fixed top-20 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-nu-card px-5 py-5 flex flex-col gap-4"
          >
            {/* Nav links */}
            {navLinks.map((nl) => (
              <a
                key={nl.label}
                href={nl.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-semibold text-nu-charcoal hover:text-nu-purple transition-colors py-2 border-b border-gray-50"
              >
                {nl.label}
              </a>
            ))}
            <button
              onClick={() => { onOpenCpf(); setMobileOpen(false); }}
              className="text-sm font-semibold text-nu-muted hover:text-nu-purple transition-colors py-2 border-b border-gray-50 text-left"
            >
              Verification
            </button>
            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2 text-sm font-semibold text-nu-muted hover:text-nu-purple transition-colors py-2 border-b border-gray-50"
            >
              <Search className="w-4 h-4" />
              Search profiles
            </button>

            {/* Auth actions */}
            {isAuthenticated ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 bg-nu-purple text-white font-semibold rounded-full px-5 py-3 text-sm justify-center shadow-md"
                >
                  <User className="w-4 h-4" />
                  {user?.name ?? "Dashboard"}
                </Link>
                <Link
                  to="/dashboard/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 border-2 border-gray-200 text-nu-muted font-semibold rounded-full px-5 py-2.5 text-sm justify-center hover:border-nu-purple hover:text-nu-purple transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 border-2 border-red-100 text-red-500 font-semibold rounded-full px-5 py-2.5 text-sm justify-center hover:bg-red-50 transition-all"
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
    </>
  );
}
