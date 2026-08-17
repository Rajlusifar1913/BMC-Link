import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Sparkles,
  FileText,
  Search,
  RefreshCw,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  LayoutDashboard,
  Activity,
  LogOut,
  Settings,
  UserCheck,
  UserX,
  ShieldCheck,
  ShieldOff,
  Calendar,
  Filter,
  X,
  Monitor,
  Globe,
  Hash,
  Clock,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  CheckCircle2,
  Ban,
  Menu,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { LogoutConfirmModal } from "@/components/Modals/LogoutConfirmModal";
import {
  getAdminUsers,
  updateAdminUser,
  getAdminCreators,
  getAdminReports,
} from "@/lib/admin";
import type {
  AdminCreator,
  AdminReport,
  AdminUser,
  UserRole,
  UserStatus,
} from "@/lib/types";

// ─── Types ─────────────────────────────────────────────────────────────────────

type AdminTab = "overview" | "users" | "creators" | "reports";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(dateStr: string, withTime = false) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}

function getInitials(name: string | null, fallback: string): string {
  if (!name) return fallback.charAt(0).toUpperCase();
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Stat Card Component ────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
  bgClass: string;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon, colorClass, bgClass, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-nu-soft hover:shadow-nu-card transition-all flex flex-col justify-between gap-4 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-nu-muted dark:text-gray-400 uppercase tracking-wider">{title}</p>
          {trend && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full mt-1">
              <TrendingUp className="w-2.5 h-2.5" />
              {trend}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-2xl border ${bgClass} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <p className={`text-3xl font-extrabold tracking-tight ${colorClass}`}>{value}</p>
        <p className="text-xs text-nu-muted dark:text-gray-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
  const map: Record<UserStatus, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800",
    SUSPENDED: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800",
    DELETED: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-400 border border-gray-200 dark:border-white/10",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${map[status]}`}>
      {status}
    </span>
  );
}

// ─── Role Badge ─────────────────────────────────────────────────────────────────

function RoleBadge({
  role,
  isVerified,
  permissionLevel,
}: {
  role: UserRole;
  isVerified?: boolean;
  permissionLevel?: string;
}) {
  if (role === "ADMIN") {
    return (
      <div className="flex items-center gap-1 flex-wrap">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-2xs">
          <Shield className="w-2.5 h-2.5" />
          {permissionLevel ? permissionLevel.replace("_", " ") : "SUPER ADMIN"}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-nu-purple-soft text-nu-purple dark:bg-nu-purple/20 border border-nu-purple/20">
        CREATOR
      </span>
      {isVerified && (
        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
          <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
        </span>
      )}
    </div>
  );
}

// ─── Pagination Controls ─────────────────────────────────────────────────────────

interface PaginationProps {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function Pagination({ page, totalPages, onPrev, onNext }: PaginationProps) {
  return (
    <div className="px-5 py-3 border-t border-gray-100 dark:border-white/8 flex items-center justify-between text-xs text-nu-muted dark:text-gray-400">
      <span>
        Page <span className="font-bold text-nu-charcoal dark:text-white">{page}</span> of{" "}
        <span className="font-bold text-nu-charcoal dark:text-white">{totalPages}</span>
      </span>
      <div className="flex items-center gap-1.5">
        <button
          onClick={onPrev}
          disabled={page <= 1}
          className="p-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={onNext}
          disabled={page >= totalPages}
          className="p-1.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Empty State ────────────────────────────────────────────────────────────────

function EmptyState({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-nu-muted">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-nu-charcoal dark:text-white">{title}</p>
        <p className="text-xs text-nu-muted dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

// ─── Section Header ─────────────────────────────────────────────────────────────

function SectionHeader({ title, subtitle, onRefresh, loading }: {
  title: string;
  subtitle: string;
  onRefresh: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-1">
      <div>
        <h2 className="text-lg font-extrabold text-nu-charcoal dark:text-white">{title}</h2>
        <p className="text-xs text-nu-muted dark:text-gray-400 mt-0.5">{subtitle}</p>
      </div>
      <button
        onClick={onRefresh}
        disabled={loading}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-all disabled:opacity-50"
        title="Refresh"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

// ─── Overview Tab ───────────────────────────────────────────────────────────────

interface OverviewTabProps {
  onNavigate: (tab: AdminTab) => void;
}

function OverviewTab({ onNavigate }: OverviewTabProps) {
  const [recentReports, setRecentReports] = useState<AdminReport[]>([]);
  const [usersTotal, setUsersTotal] = useState<number>(0);
  const [creatorsTotal, setCreatorsTotal] = useState<number>(0);
  const [logsTotal, setLogsTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [usersRes, creatorsRes, reportsRes] = await Promise.all([
        getAdminUsers({ page: 1, limit: 1 }),
        getAdminCreators({ page: 1, limit: 1 }),
        getAdminReports({ page: 1, limit: 5, sortBy: "createdAt", order: "desc" }),
      ]);
      setUsersTotal(usersRes.pagination?.total ?? 0);
      setCreatorsTotal(creatorsRes.pagination?.total ?? 0);
      setLogsTotal(reportsRes.pagination?.total ?? 0);
      setRecentReports(reportsRes.reports ?? []);
    } catch {
      // silently fail — errors shown per section
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const stats = [
    {
      title: "Total Users",
      value: loading ? "—" : usersTotal.toLocaleString(),
      subtitle: "Registered platform accounts",
      icon: <Users className="w-5 h-5 text-blue-600" />,
      colorClass: "text-blue-700 dark:text-blue-400",
      bgClass: "bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-800",
      action: () => onNavigate("users"),
    },
    {
      title: "Creator Profiles",
      value: loading ? "—" : creatorsTotal.toLocaleString(),
      subtitle: "Active bio link creators",
      icon: <Sparkles className="w-5 h-5 text-nu-purple" />,
      colorClass: "text-nu-purple",
      bgClass: "bg-nu-purple-soft border-nu-purple/20",
      action: () => onNavigate("creators"),
    },
    {
      title: "Audit Events",
      value: loading ? "—" : logsTotal.toLocaleString(),
      subtitle: "Total platform activity logs",
      icon: <Activity className="w-5 h-5 text-amber-600" />,
      colorClass: "text-amber-700 dark:text-amber-400",
      bgClass: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800",
      action: () => onNavigate("reports"),
    },
  ];

  const actionBadgeColor = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes("CREATE") || a.includes("REGISTER")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (a.includes("DELETE") || a.includes("SUSPEND")) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    if (a.includes("UPDATE") || a.includes("PATCH")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (a.includes("LOGIN") || a.includes("AUTH")) return "bg-nu-purple-soft text-nu-purple dark:bg-nu-purple/20 dark:text-purple-400";
    return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 20% 80%, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
        />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold bg-white/20 rounded-full px-3 py-1 uppercase tracking-widest">Admin Control Panel</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Platform Overview</h2>
            <p className="text-sm text-white/80 mt-1">Manage users, creators, and monitor platform activity</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => onNavigate("users")} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-semibold transition-all">
              <UserPlus className="w-4 h-4" /> Manage Users
            </button>
            <button onClick={() => onNavigate("reports")} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-2xl text-sm font-semibold transition-all">
              <FileText className="w-4 h-4" /> Audit Logs
            </button>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <button key={i} onClick={s.action} className="text-left">
            <StatCard
              title={s.title}
              value={s.value}
              subtitle={s.subtitle}
              icon={s.icon}
              colorClass={s.colorClass}
              bgClass={s.bgClass}
            />
          </button>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-extrabold text-nu-charcoal dark:text-white">Recent Activity</h3>
          <button onClick={() => onNavigate("reports")} className="text-xs font-semibold text-nu-purple hover:underline">
            View all →
          </button>
        </div>
        <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-3 text-nu-muted">
              <Loader2 className="w-5 h-5 animate-spin text-nu-purple" />
              <span className="text-sm">Loading activity...</span>
            </div>
          ) : recentReports.length === 0 ? (
            <EmptyState
              icon={<Activity className="w-8 h-8" />}
              title="No activity recorded yet"
              subtitle="Platform events will appear here as users interact with the system"
            />
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-white/8">
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                  <div className={`shrink-0 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider font-mono ${actionBadgeColor(r.action)}`}>
                    {r.action}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-nu-charcoal dark:text-white truncate">
                      <span className="text-nu-muted dark:text-gray-400">on </span>
                      {r.entity}
                      {r.entityId && (
                        <span className="text-nu-muted dark:text-gray-500 font-mono"> #{r.entityId.slice(0, 8)}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-nu-muted dark:text-gray-500 truncate mt-0.5">
                      {r.user?.email || r.userId || "System"} {r.ip && `· ${r.ip}`}
                    </p>
                  </div>
                  <div className="shrink-0 text-[11px] text-nu-muted dark:text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDate(r.createdAt, true)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-base font-extrabold text-nu-charcoal dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "All Users", icon: <Users className="w-5 h-5" />, tab: "users" as AdminTab, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800" },
            { label: "Creators", icon: <Sparkles className="w-5 h-5" />, tab: "creators" as AdminTab, color: "text-nu-purple bg-nu-purple-soft border-nu-purple/20" },
            { label: "Audit Logs", icon: <FileText className="w-5 h-5" />, tab: "reports" as AdminTab, color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800" },
            { label: "View Reports", icon: <Activity className="w-5 h-5" />, tab: "reports" as AdminTab, color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800" },
          ].map((qa) => (
            <button
              key={qa.label}
              onClick={() => onNavigate(qa.tab)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border font-semibold text-sm transition-all hover:scale-105 hover:shadow-md ${qa.color}`}
            >
              {qa.icon}
              {qa.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ──────────────────────────────────────────────────────────────────

function UsersTab() {
  const { success, error: toastError } = useToast();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "">("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminUsers({
        page: p,
        limit: 10,
        search: search || undefined,
        role: (roleFilter as UserRole) || undefined,
        status: (statusFilter as UserStatus) || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      setUsers(res.users ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, statusFilter, toastError]);

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  const handleFilterChange = () => {
    setPage(1);
    load(1);
  };

  const handleUpdateStatus = async (u: AdminUser, newStatus: UserStatus) => {
    try {
      const updated = await updateAdminUser(u.id, { status: newStatus });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: updated.status } : x)));
      success(`Status changed to ${newStatus}`);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const handleUpdateRole = async (u: AdminUser, newRole: UserRole) => {
    try {
      const updated = await updateAdminUser(u.id, { role: newRole });
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: updated.role } : x)));
      success(`Role updated to ${newRole}`);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const clearFilters = () => {
    setRoleFilter("");
    setStatusFilter("");
    setSearch("");
    setPage(1);
    setTimeout(() => load(1), 0);
  };

  const hasFilters = roleFilter || statusFilter || search;

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="User Management"
        subtitle="Search, filter and manage all registered platform accounts"
        onRefresh={() => load(page)}
        loading={loading}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-nu-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-white dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-2xl px-4 py-2.5 text-sm transition-all shadow-sm"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-nu-muted shrink-0" />
          {/* Role filter */}
          {(["", "CREATOR", "ADMIN"] as const).map((r) => (
            <button
              key={r || "all-roles"}
              onClick={() => { setRoleFilter(r); handleFilterChange(); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                roleFilter === r
                  ? "bg-nu-purple text-white border-nu-purple shadow-sm"
                  : "bg-white dark:bg-[#180F26] text-nu-muted dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-nu-purple/40"
              }`}
            >
              {r === "" ? "All Roles" : r}
            </button>
          ))}
          <span className="w-px h-4 bg-gray-200 dark:bg-white/10" />
          {/* Status filter */}
          {(["", "ACTIVE", "SUSPENDED", "DELETED"] as const).map((s) => (
            <button
              key={s || "all-status"}
              onClick={() => { setStatusFilter(s); handleFilterChange(); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                statusFilter === s
                  ? s === "ACTIVE" ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                  : s === "SUSPENDED" ? "bg-red-500 text-white border-red-500 shadow-sm"
                  : s === "DELETED" ? "bg-gray-500 text-white border-gray-500 shadow-sm"
                  : "bg-nu-purple text-white border-nu-purple shadow-sm"
                  : "bg-white dark:bg-[#180F26] text-nu-muted dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-nu-purple/40"
              }`}
            >
              {s === "" ? "All Status" : s}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 hover:bg-red-100 transition-all">
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-[#211535] border-b border-gray-100 dark:border-white/8">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Joined</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/8">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-nu-purple" />
                    <p className="text-xs text-nu-muted dark:text-gray-400 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={<Users className="w-8 h-8" />}
                      title="No users found"
                      subtitle="Try adjusting your search or filters"
                    />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-nu-purple-soft dark:bg-nu-purple/20 flex items-center justify-center text-nu-purple font-extrabold text-sm shrink-0 border border-nu-purple/10">
                          {getInitials(u.name, u.email)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-nu-charcoal dark:text-white truncate">{u.name || "Unnamed"}</p>
                          <p className="text-xs text-nu-muted dark:text-gray-400 truncate">{u.email}</p>
                          {u.creatorProfile?.username && (
                            <p className="text-[11px] text-nu-purple font-semibold">@{u.creatorProfile.username}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4"><RoleBadge role={u.role} isVerified={u.isVerified} /></td>
                    <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                    <td className="px-5 py-4 text-xs text-nu-muted dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(u.createdAt)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        {u.status === "ACTIVE" ? (
                          <button
                            onClick={() => handleUpdateStatus(u, "SUSPENDED")}
                            title="Suspend user account"
                            className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-300 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50 px-3 py-1.5 rounded-full transition-all border border-red-200 dark:border-red-800 shadow-2xs hover:scale-102 active:scale-95"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Suspend</span>
                          </button>
                        ) : u.status === "SUSPENDED" ? (
                          <button
                            onClick={() => handleUpdateStatus(u, "ACTIVE")}
                            title="Re-activate user account"
                            className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 px-3 py-1.5 rounded-full transition-all border border-emerald-200 dark:border-emerald-800 shadow-2xs hover:scale-102 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Activate</span>
                          </button>
                        ) : null}

                        {/* Make Admin / Demote Button */}
                        <button
                          onClick={() => handleUpdateRole(u, u.role === "ADMIN" ? "CREATOR" : "ADMIN")}
                          title={u.role === "ADMIN" ? "Demote this user to Creator" : "Promote this user to Administrator"}
                          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full transition-all shadow-xs hover:scale-105 active:scale-95 ${
                            u.role === "ADMIN"
                              ? "text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 hover:bg-amber-200 dark:hover:bg-amber-800/60"
                              : "text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 border border-amber-400/80 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {u.role === "ADMIN" ? (
                            <>
                              <ShieldOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                              <span>Demote to Creator</span>
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                              <span>Make Admin</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}

// ─── Creators Tab ───────────────────────────────────────────────────────────────

function CreatorsTab() {
  const { error: toastError } = useToast();

  const [creators, setCreators] = useState<AdminCreator[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "">("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminCreators({
        page: p,
        limit: 12,
        search: search || undefined,
        status: (statusFilter as UserStatus) || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      setCreators(res.creators ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to load creators");
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, toastError]);

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Creator Profiles"
        subtitle="Browse and monitor all creator bio link profiles on the platform"
        onRefresh={() => load(page)}
        loading={loading}
      />

      <div className="flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-nu-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by username, name or email..."
              className="w-full bg-white dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
            />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-2xl px-4 py-2.5 text-sm transition-all shadow-sm">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-nu-muted shrink-0" />
          {(["", "ACTIVE", "SUSPENDED", "DELETED"] as const).map((s) => (
            <button
              key={s || "all"}
              onClick={() => { setStatusFilter(s); setPage(1); setTimeout(() => load(1), 0); }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                statusFilter === s
                  ? "bg-nu-purple text-white border-nu-purple shadow-sm"
                  : "bg-white dark:bg-[#180F26] text-nu-muted dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-nu-purple/40"
              }`}
            >
              {s === "" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 animate-pulse" />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft">
          <EmptyState
            icon={<Sparkles className="w-8 h-8" />}
            title="No creator profiles found"
            subtitle="Try adjusting your search or status filter"
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {creators.map((c) => (
              <div
                key={c.id}
                className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-nu-soft hover:shadow-nu-card hover:border-nu-purple/20 dark:hover:border-nu-purple/30 transition-all flex flex-col gap-4 group"
              >
                <div className="flex items-start gap-3">
                  {c.avatar ? (
                    <img src={c.avatar} alt={c.username} loading="lazy" decoding="async" className="w-12 h-12 rounded-2xl object-cover border-2 border-nu-purple/20 shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-nu-purple-soft dark:bg-nu-purple/20 flex items-center justify-center text-nu-purple font-extrabold text-lg border border-nu-purple/20 shrink-0">
                      {c.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-nu-charcoal dark:text-white truncate">{c.user.name || c.username}</p>
                    <p className="text-xs text-nu-purple font-semibold">@{c.username}</p>
                    <p className="text-xs text-nu-muted dark:text-gray-400 truncate mt-0.5">{c.user.email}</p>
                  </div>
                  <StatusBadge status={c.user.status} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-nu-muted dark:text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(c.createdAt)}
                  </span>
                  <a
                    href={`/${c.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-nu-purple bg-nu-purple-soft hover:bg-nu-purple hover:text-white px-3 py-1.5 rounded-full transition-all border border-nu-purple/20"
                  >
                    <ExternalLink className="w-3 h-3" /> View Profile
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </>
      )}
    </div>
  );
}

// ─── Reports Tab ────────────────────────────────────────────────────────────────

function ReportsTab() {
  const { error: toastError } = useToast();

  const [reports, setReports] = useState<AdminReport[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [entityFilter, setEntityFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminReports({
        page: p,
        limit: 15,
        search: search || undefined,
        entity: entityFilter || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        sortBy: "createdAt",
        order: "desc",
      });
      setReports(res.reports ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [page, search, entityFilter, startDate, endDate, toastError]);

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    load(1);
  };

  const clearFilters = () => {
    setSearch("");
    setEntityFilter("");
    setStartDate("");
    setEndDate("");
    setPage(1);
    setTimeout(() => load(1), 0);
  };

  const hasFilters = search || entityFilter || startDate || endDate;

  const actionColor = (action: string) => {
    const a = action.toUpperCase();
    if (a.includes("CREATE") || a.includes("REGISTER")) return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
    if (a.includes("DELETE") || a.includes("SUSPEND") || a.includes("BAN")) return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    if (a.includes("UPDATE") || a.includes("PATCH") || a.includes("EDIT")) return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (a.includes("LOGIN") || a.includes("AUTH") || a.includes("TOKEN")) return "bg-nu-purple-soft text-nu-purple dark:bg-nu-purple/20";
    return "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300";
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader
        title="Audit Logs & Reports"
        subtitle="Full audit trail of all system activity with advanced filtering"
        onRefresh={() => load(page)}
        loading={loading}
      />

      {/* Filters */}
      <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft p-4 flex flex-col gap-3">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-nu-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by action, entity or ID..."
              className="w-full bg-gray-50 dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-2xl px-4 py-2.5 text-sm transition-all shadow-sm">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Hash className="w-3.5 h-3.5 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              placeholder="Filter by entity (e.g. user)"
              className="w-full bg-gray-50 dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-nu-charcoal dark:text-white placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-nu-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-gray-50 dark:bg-[#211535] border border-gray-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-nu-charcoal dark:text-white focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => { setPage(1); load(1); }}
            className="text-xs font-semibold text-nu-purple hover:underline flex items-center gap-1"
          >
            <Filter className="w-3 h-3" /> Apply Filters
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:underline">
              <X className="w-3 h-3" /> Clear all
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-nu-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[700px]">
            <thead className="bg-gray-50 dark:bg-[#211535] border-b border-gray-100 dark:border-white/8">
              <tr>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Action</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Entity</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">User</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest">Source</th>
                <th className="px-5 py-3.5 text-[10px] font-extrabold text-nu-muted dark:text-gray-400 uppercase tracking-widest text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/8">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-nu-purple" />
                    <p className="text-xs text-nu-muted dark:text-gray-400 mt-2">Loading audit logs...</p>
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={<FileText className="w-8 h-8" />}
                      title="No audit events recorded"
                      subtitle="Platform activity will appear here"
                    />
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <React.Fragment key={r.id}>
                    <tr
                      className="hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                    >
                      <td className="px-5 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider font-mono ${actionColor(r.action)}`}>
                          {r.action}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-nu-charcoal dark:text-white font-mono">{r.entity}</p>
                        {r.entityId && (
                          <p className="text-[10px] text-nu-muted dark:text-gray-500 font-mono">#{r.entityId.slice(0, 12)}…</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-nu-charcoal dark:text-white">{r.user?.name || "—"}</p>
                        <p className="text-[11px] text-nu-muted dark:text-gray-400">{r.user?.email || r.userId || "System"}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          {r.ip && (
                            <span className="text-[11px] text-nu-muted dark:text-gray-400 flex items-center gap-1">
                              <Globe className="w-3 h-3" /> {r.ip}
                            </span>
                          )}
                          {r.userAgent && (
                            <span className="text-[10px] text-nu-muted dark:text-gray-500 flex items-center gap-1 max-w-[160px] truncate">
                              <Monitor className="w-3 h-3 shrink-0" />
                              <span className="truncate">{r.userAgent.split(" ")[0]}</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-[11px] text-nu-muted dark:text-gray-400 flex items-center justify-end gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(r.createdAt, true)}
                        </span>
                      </td>
                    </tr>
                    {expandedId === r.id && Boolean(r.oldData || r.newData) && (
                      <tr>
                        <td colSpan={5} className="px-5 pb-4 bg-gray-50/80 dark:bg-white/3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
                            {Boolean(r.oldData) && (
                              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-red-700 dark:text-red-400 mb-2 uppercase tracking-wider">Before</p>
                                <pre className="text-red-800 dark:text-red-300 overflow-auto max-h-32 whitespace-pre-wrap break-all">
                                  {JSON.stringify(r.oldData, null, 2)}
                                </pre>
                              </div>
                            )}
                            {Boolean(r.newData) && (
                              <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-xl p-3">
                                <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mb-2 uppercase tracking-wider">After</p>
                                <pre className="text-emerald-800 dark:text-emerald-300 overflow-auto max-h-32 whitespace-pre-wrap break-all">
                                  {JSON.stringify(r.newData, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      </div>
    </div>
  );
}

// ─── Sidebar Nav Item ───────────────────────────────────────────────────────────

interface NavItemProps {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  badge?: string;
}

function NavItem({ label, icon, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
        active
          ? "bg-nu-purple text-white shadow-md shadow-nu-purple/25"
          : "text-nu-muted dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-nu-charcoal dark:hover:text-white"
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-gray-100 dark:bg-white/10 text-nu-muted dark:text-gray-400"}`}>
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Main Admin Content ─────────────────────────────────────────────────────────

function AdminContent() {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Access guard
  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

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

  const handleNav = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileSidebarOpen(false);
  };

  const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" /> },
    { id: "creators", label: "Creators", icon: <Sparkles className="w-4 h-4" /> },
    { id: "reports", label: "Audit Logs", icon: <FileText className="w-4 h-4" /> },
  ];

  const displayName = user?.name ?? user?.email ?? "Admin";
  const initials = getInitials(user?.name ?? null, user?.email ?? "A");

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <aside className={`flex flex-col gap-3 ${mobile ? "p-4" : "p-6"}`}>
      {/* Brand */}
      <div className={`flex items-center gap-3 ${mobile ? "mb-2" : "mb-4"}`}>
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-extrabold text-nu-charcoal dark:text-white leading-tight">Admin Panel</p>
          <p className="text-[10px] text-nu-muted dark:text-gray-400">BMC Link Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            id={item.id}
            label={item.label}
            icon={item.icon}
            active={activeTab === item.id}
            onClick={() => handleNav(item.id)}
          />
        ))}
      </nav>

      <div className="h-px bg-gray-100 dark:bg-white/10 my-2" />

      {/* Links */}
      <div className="flex flex-col gap-1">
        <Link
          to="/dashboard?view=creator"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-nu-muted dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-nu-charcoal dark:hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Creator Dashboard
        </Link>
        <Link
          to="/dashboard/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-nu-muted dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/8 hover:text-nu-charcoal dark:hover:text-white transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          My Settings
        </Link>
      </div>

      {/* User card */}
      <div className="mt-auto pt-4">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-100 dark:border-amber-800/30 p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-200 dark:bg-amber-800 flex items-center justify-center text-amber-900 dark:text-amber-200 font-extrabold text-sm shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-nu-charcoal dark:text-white truncate">{displayName}</p>
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-amber-700 dark:text-amber-400 uppercase tracking-widest">
              <Shield className="w-2.5 h-2.5" /> Administrator
            </span>
          </div>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            title="Logout"
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-nu-muted dark:text-gray-400 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 dark:hover:text-white transition-all duration-200 hover:scale-105 active:scale-95 shadow-2xs hover:shadow-md hover:shadow-rose-500/25"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-nu-bg dark:bg-[#0C0614] flex">

      {/* ─── Desktop Sidebar ──────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-[#180F26] border-r border-gray-100 dark:border-white/10 min-h-screen sticky top-0 shadow-sm">
        <Sidebar />
      </div>

      {/* ─── Mobile Sidebar Overlay ───────────────────────── */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#180F26] shadow-2xl flex flex-col">
            <div className="flex items-center justify-end p-3 border-b border-gray-100 dark:border-white/10">
              <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                <X className="w-4 h-4 text-nu-muted" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar mobile />
            </div>
          </div>
        </div>
      )}

      {/* ─── Main Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Sticky top bar (mobile only) */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#140B23]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/12 shadow-sm lg:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-all"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm font-extrabold text-nu-charcoal dark:text-white">Admin Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <Link to="/dashboard?view=creator" className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted hover:text-nu-purple dark:hover:text-nu-purple transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Creator View
              </Link>
            </div>
          </div>

          {/* Mobile tab bar */}
          <div className="flex items-center gap-1 px-4 pb-3 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                  activeTab === item.id
                    ? "bg-nu-purple text-white shadow-sm"
                    : "bg-gray-100 dark:bg-white/8 text-nu-muted dark:text-gray-300 hover:text-nu-charcoal dark:hover:text-white"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </header>

        {/* Desktop header */}
        <header className="hidden lg:flex sticky top-0 z-20 bg-white/90 dark:bg-[#140B23]/95 backdrop-blur-md border-b border-gray-100 dark:border-white/12 shadow-sm items-center justify-between h-16 px-8">
          <div className="flex items-center gap-3">
            <div className="text-sm font-extrabold text-nu-charcoal dark:text-white">
              {NAV_ITEMS.find((n) => n.id === activeTab)?.label}
            </div>
            <span className="text-nu-muted dark:text-gray-500">/</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              <Shield className="w-3 h-3" /> Administrator
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard?view=creator"
              className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted hover:text-nu-purple dark:hover:text-nu-purple transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Creator Dashboard
            </Link>
          </div>
        </header>

        {/* Tab Content with Smooth Animated Switch */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === "overview" && <OverviewTab onNavigate={setActiveTab} />}
              {activeTab === "users" && <UsersTab />}
              {activeTab === "creators" && <CreatorsTab />}
              {activeTab === "reports" && <ReportsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        loading={isLoggingOut}
      />
    </div>
  );
}

// ─── Page Export ────────────────────────────────────────────────────────────────

export function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN" roleFallback="/dashboard">
      <AdminContent />
    </ProtectedRoute>
  );
}
