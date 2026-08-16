import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  Eye,
  MousePointerClick,
  Heart,
  ShoppingBag,
  DollarSign,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getAnalytics } from "@/lib/account";
import { getCachedData, setCachedData } from "@/lib/cache";
import type { CreatorAnalytics } from "@/lib/types";

const CACHE_KEY = "creator_analytics";

export function AnalyticsSection() {
  const [analytics, setAnalytics] = useState<CreatorAnalytics | null>(() => {
    return getCachedData<CreatorAnalytics>(CACHE_KEY);
  });
  const [loading, setLoading] = useState(() => !getCachedData<CreatorAnalytics>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
      setCachedData(CACHE_KEY, data);
    } catch (err) {
      if (!analytics) {
        setError(err instanceof Error ? err.message : "Failed to load analytics");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Revalidate in background if cached, otherwise show initial load
    loadData(!!analytics);
  }, []);

  const formatCurrency = (val: number | string | undefined) => {
    const num = Number(val || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(analytics?.totalRevenue),
      subtitle: "Combined donations, memberships & sales",
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50 border-emerald-100",
      accent: "text-emerald-700",
    },
    {
      title: "Donations Received",
      value: formatCurrency(analytics?.totalDonations),
      subtitle: "Direct supporter tips & coffee contributions",
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      bg: "bg-rose-50 border-rose-100",
      accent: "text-rose-700",
    },
    {
      title: "Digital Sales",
      value: formatCurrency(analytics?.totalSales),
      subtitle: "Revenue from digital downloads & items",
      icon: <ShoppingBag className="w-6 h-6 text-nu-purple" />,
      bg: "bg-nu-purple-soft border-nu-purple/20",
      accent: "text-nu-purple",
    },
    {
      title: "Profile Views",
      value: (analytics?.totalProfileViews ?? 0).toLocaleString(),
      subtitle: "Total visits to your public link bio",
      icon: <Eye className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50 border-blue-100",
      accent: "text-blue-700",
    },
    {
      title: "Link Clicks",
      value: (analytics?.totalLinkClicks ?? 0).toLocaleString(),
      subtitle: "Total clicks across all your shared links",
      icon: <MousePointerClick className="w-6 h-6 text-amber-600" />,
      bg: "bg-amber-50 border-amber-100",
      accent: "text-amber-700",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal">Performance & Analytics</h2>
          <p className="text-xs text-nu-muted">Real-time overview of your audience and earnings</p>
        </div>
        <button
          onClick={() => void loadData()}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-nu-muted hover:text-nu-purple p-2 rounded-full hover:bg-gray-100 transition-all disabled:opacity-50"
          title="Refresh analytics"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse p-6"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-800">Failed to load analytics data</p>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={() => void loadData()}
            className="text-xs font-semibold text-red-700 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-full transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-gray-100 p-6 shadow-nu-soft hover:shadow-nu-card transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-nu-muted uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${card.bg}`}>{card.icon}</div>
              </div>
              <div>
                <p className={`text-2xl sm:text-3xl font-extrabold ${card.accent} tracking-tight`}>
                  {card.value}
                </p>
                <p className="text-xs text-nu-muted mt-1.5">{card.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
