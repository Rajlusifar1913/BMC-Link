import React, { useEffect, useState, useMemo } from "react";
import {
  Heart,
  MessageSquare,
  Search,
  RefreshCw,
  AlertCircle,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { getReceivedDonations } from "@/lib/donations";
import { getCachedData, setCachedData } from "@/lib/cache";
import { useDebounce } from "@/hooks/useDebounce";
import type { Donation } from "@/lib/types";

const CACHE_KEY = "creator_donations";

export function DonationsSection() {
  const [donations, setDonations] = useState<Donation[]>(() => {
    return getCachedData<Donation[]>(CACHE_KEY) || [];
  });
  const [loading, setLoading] = useState(() => !getCachedData<Donation[]>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 150);

  const loadDonations = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getReceivedDonations();
      setDonations(data);
      setCachedData(CACHE_KEY, data);
    } catch (err) {
      if (donations.length === 0) {
        setError(err instanceof Error ? err.message : "Failed to load donations");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations(donations.length > 0);
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return donations;
    const q = debouncedSearch.toLowerCase().trim();
    return donations.filter((d) => {
      return (
        (d.displayName && d.displayName.toLowerCase().includes(q)) ||
        (d.message && d.message.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q))
      );
    });
  }, [donations, debouncedSearch]);

  const totalAmount = useMemo(() => {
    return donations.reduce((sum, d) => {
      const amt = Number(d.payment?.amount || 0);
      return sum + amt;
    }, 0);
  }, [donations]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal">Received Donations</h2>
          <p className="text-xs text-nu-muted">
            Tips and contributions sent by your audience
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-2 text-rose-700 text-xs font-bold flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span>
              Total: ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })} (
              {donations.length})
            </span>
          </div>
          <button
            onClick={() => void loadDonations()}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 text-nu-muted hover:text-nu-charcoal transition-all disabled:opacity-50"
            title="Refresh donations"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nu-muted pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by supporter name, email, or message..."
          className="w-full bg-white border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white rounded-2xl border border-gray-100 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Failed to load donations</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => void loadDonations()}
            className="text-xs font-semibold text-red-600 underline"
          >
            Retry
          </button>
        </div>
      ) : donations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose-500" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-nu-charcoal">No donations yet</p>
            <p className="text-sm text-nu-muted mt-1 max-w-sm">
              When supporters send you coffee tips or donations, they will show up here.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center bg-white rounded-3xl border border-gray-100">
          <p className="text-sm text-nu-muted">No donations match your search filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-nu-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                  {d.isAnonymous ? (
                    <UserIcon className="w-5 h-5 text-rose-400" />
                  ) : (
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-nu-charcoal">
                      {d.isAnonymous ? "Anonymous Supporter" : d.displayName || "Supporter"}
                    </p>
                    {d.email && !d.isAnonymous && (
                      <span className="text-xs text-nu-muted">({d.email})</span>
                    )}
                  </div>
                  {d.message && (
                    <div className="flex items-start gap-1.5 mt-1 text-xs text-nu-charcoal bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                      <MessageSquare className="w-3.5 h-3.5 text-nu-muted shrink-0 mt-0.5" />
                      <span>{d.message}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-[11px] text-nu-muted mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-extrabold text-emerald-600">
                  +₹{Number(d.payment?.amount || 0).toLocaleString("en-IN")}
                </p>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1">
                  {d.payment?.paymentStatus || "SUCCESSFUL"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
