import React, { useEffect, useState, useMemo } from "react";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  AlertCircle,
  Calendar,
  User as UserIcon,
  ExternalLink,
  DollarSign,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getCreatorSales } from "@/lib/purchases";
import { getCachedData, setCachedData } from "@/lib/cache";
import { useDebounce } from "@/hooks/useDebounce";
import type { Purchase } from "@/lib/types";

const CACHE_KEY = "creator_sales";

export function SalesSection() {
  const [sales, setSales] = useState<Purchase[]>(() => {
    return getCachedData<Purchase[]>(CACHE_KEY) || [];
  });
  const [loading, setLoading] = useState(() => !getCachedData<Purchase[]>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 150);

  const loadSales = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getCreatorSales();
      setSales(data);
      setCachedData(CACHE_KEY, data);
    } catch (err) {
      if (sales.length === 0) {
        setError(err instanceof Error ? err.message : "Failed to load sales");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSales(sales.length > 0);
  }, []);

  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return sales;
    const q = debouncedSearch.toLowerCase().trim();
    return sales.filter((s) => {
      return (
        (s.product?.title && s.product.title.toLowerCase().includes(q)) ||
        (s.buyerName && s.buyerName.toLowerCase().includes(q)) ||
        (s.buyerEmail && s.buyerEmail.toLowerCase().includes(q))
      );
    });
  }, [sales, debouncedSearch]);

  const totalSalesRevenue = useMemo(() => {
    return sales.reduce((sum, s) => {
      return sum + Number(s.payment?.amount || 0);
    }, 0);
  }, [sales]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-nu-charcoal dark:text-white tracking-tight">Customer Orders & Sales</h2>
          <p className="text-xs text-nu-muted dark:text-gray-400 mt-0.5">
            Track orders and downloads for all your digital products
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 rounded-2xl px-4 py-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-2xs">
            <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>
              Total Sales: ₹
              {totalSalesRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })} ({sales.length} orders)
            </span>
          </div>
          <Link
            to="/dashboard/purchases"
            className="flex items-center gap-1.5 text-xs font-bold text-nu-purple dark:text-purple-300 bg-nu-purple-soft dark:bg-nu-purple/15 hover:bg-nu-purple-soft-hover dark:hover:bg-nu-purple/25 border border-nu-purple/15 px-3.5 py-2 rounded-full transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            My Purchases
          </Link>
          <button
            onClick={() => void loadSales()}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white transition-all disabled:opacity-50"
            title="Refresh sales"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nu-muted dark:text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by buyer name, email, or product title..."
          className="w-full bg-white dark:bg-[#180F26] border border-gray-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-nu-charcoal dark:text-white placeholder-nu-muted/60 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all shadow-sm"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white dark:bg-[#180F26] rounded-2xl border border-gray-100 dark:border-white/10 animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-800/40 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-rose-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700 dark:text-rose-300">Failed to load sales data</p>
            <p className="text-xs text-red-500 dark:text-rose-400 mt-0.5">{error}</p>
          </div>
          <button onClick={() => void loadSales()} className="text-xs font-bold text-red-600 dark:text-rose-300 underline">
            Retry
          </button>
        </div>
      ) : sales.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white dark:bg-[#180F26] rounded-3xl border border-dashed border-gray-200 dark:border-white/15">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-nu-charcoal dark:text-white">No sales recorded yet</p>
            <p className="text-sm text-nu-muted dark:text-gray-400 mt-1 max-w-sm">
              When customers purchase your digital products, their orders and download history will be listed here.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10">
          <p className="text-sm text-nu-muted dark:text-gray-400">No sales match your search filter.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((sale) => (
            <div
              key={sale.id}
              className="bg-white dark:bg-[#180F26] rounded-2xl border border-gray-100 dark:border-white/10 p-4 shadow-sm hover:shadow-nu-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-nu-purple-soft dark:bg-nu-purple/20 border border-nu-purple/10 dark:border-nu-purple/30 flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-5 h-5 text-nu-purple dark:text-purple-300" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-nu-charcoal dark:text-white">
                    {sale.product?.title || "Digital Product"}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-nu-muted dark:text-gray-300 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 font-medium text-nu-charcoal dark:text-gray-200">
                      <UserIcon className="w-3.5 h-3.5 text-nu-muted dark:text-gray-400" />
                      {sale.buyerName || "Customer"}
                    </span>
                    {sale.buyerEmail && <span className="text-nu-muted dark:text-gray-400">({sale.buyerEmail})</span>}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-nu-muted dark:text-gray-400 mt-1.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(sale.purchasedAt || Date.now()).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Download className="w-3 h-3 text-nu-muted dark:text-gray-400" />
                      Downloads: {sale.downloadCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                  +₹{Number(sale.payment?.amount || 0).toLocaleString("en-IN")}
                </p>
                <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 mt-1">
                  {sale.payment?.paymentStatus || "SUCCESSFUL"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
