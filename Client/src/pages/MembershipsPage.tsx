import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getMyMemberships, cancelMembership } from "@/lib/memberships";
import { useToast } from "@/context/ToastContext";
import type { Membership } from "@/lib/types";

function MembershipsContent() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadMemberships = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyMemberships();
      setMemberships(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load memberships");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemberships();
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this membership?")) return;
    setCancellingId(id);
    try {
      const updated = await cancelMembership(id);
      setMemberships((prev) => prev.map((m) => (m.id === id ? updated : m)));
      success("Membership cancelled");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to cancel membership");
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-nu-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-bold text-nu-charcoal">My Subscriptions</h1>
              <p className="text-xs text-nu-muted">Creator memberships and access passes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="text-xs font-semibold text-nu-purple hover:underline"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-nu-purple" />
            <h2 className="text-sm font-bold text-nu-charcoal uppercase tracking-wider">
              Active & Past Memberships ({memberships.length})
            </h2>
          </div>
          <button
            onClick={loadMemberships}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all disabled:opacity-50"
            title="Refresh subscriptions"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-white rounded-3xl border border-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700">Failed to load subscriptions</p>
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadMemberships}
              className="text-xs font-semibold text-red-600 underline"
            >
              Retry
            </button>
          </div>
        ) : memberships.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
            <div className="w-16 h-16 bg-nu-purple-soft rounded-2xl flex items-center justify-center text-nu-purple">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-nu-charcoal">No active memberships</p>
              <p className="text-xs text-nu-muted mt-1 max-w-sm">
                When you join a creator&apos;s membership tier, your active access periods and perks will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {memberships.map((m) => {
              const isActive = m.status === "ACTIVE";
              const username = m.creator?.creatorProfile?.username;

              return (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-nu-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-nu-purple-soft border border-nu-purple/10 flex items-center justify-center text-nu-purple shrink-0">
                      <Award className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-nu-charcoal">
                          {m.plan?.name || "Membership Plan"}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {m.status}
                        </span>
                      </div>

                      {username && (
                        <p className="text-xs text-nu-muted mt-0.5">
                          Creator:{" "}
                          <Link
                            to={`/${username}`}
                            className="font-bold text-nu-purple hover:underline"
                          >
                            @{username}
                          </Link>
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs text-nu-muted mt-2 flex-wrap">
                        {m.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            Start: {new Date(m.startDate).toLocaleDateString()}
                          </span>
                        )}
                        {m.endDate && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Valid until: {new Date(m.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {isActive && (
                      <button
                        onClick={() => handleCancel(m.id)}
                        disabled={cancellingId === m.id}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 rounded-full px-4 py-2 transition-all disabled:opacity-50"
                      >
                        {cancellingId === m.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          "Cancel Tier"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export function MembershipsPage() {
  return (
    <ProtectedRoute>
      <MembershipsContent />
    </ProtectedRoute>
  );
}
