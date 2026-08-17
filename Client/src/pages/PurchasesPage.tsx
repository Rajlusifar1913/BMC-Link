import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ShoppingBag,
  Download,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader2,
  Package,
  Key,
  ShieldCheck,
  Ban,
  Clock,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getPurchaseHistory, downloadPurchaseFile } from "@/lib/purchases";
import { useToast } from "@/context/ToastContext";
import type { Purchase } from "@/lib/types";

function PurchasesContent() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchaseHistory();
      setPurchases(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDownload = async (purchase: Purchase) => {
    const isExpired = purchase.expiresAt && new Date(purchase.expiresAt) < new Date();
    const isLimitReached =
      purchase.downloadLimit !== null &&
      purchase.downloadLimit !== undefined &&
      purchase.downloadCount >= purchase.downloadLimit;

    if (isExpired) {
      toastError("This purchase link has expired.");
      return;
    }
    if (isLimitReached) {
      toastError("Download limit has been reached for this asset.");
      return;
    }

    setDownloadingId(purchase.id);
    try {
      await downloadPurchaseFile(purchase.id, purchase.product?.title || "asset");
      success("Download started!");
      // Increment local count
      setPurchases((prev) =>
        prev.map((p) => (p.id === purchase.id ? { ...p, downloadCount: p.downloadCount + 1 } : p))
      );
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-nu-bg dark:bg-[#0C0614] transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#180F26]/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white transition-all"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-nu-charcoal dark:text-white">My Purchases</h1>
              <p className="text-xs text-nu-muted dark:text-gray-400">Your digital downloads, licenses & orders</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="text-xs font-bold text-nu-purple dark:text-purple-300 hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-nu-purple dark:text-purple-300" />
            <h2 className="text-sm font-extrabold text-nu-charcoal dark:text-white uppercase tracking-wider">
              Purchased Downloads ({purchases.length})
            </h2>
          </div>
          <button
            onClick={loadHistory}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted dark:text-gray-400 hover:text-nu-charcoal dark:hover:text-white transition-all disabled:opacity-50"
            title="Refresh purchases"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-rose-950/30 border border-red-200 dark:border-rose-800/40 rounded-3xl p-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 dark:text-rose-400 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-rose-300">Failed to load purchase history</p>
              <p className="text-xs text-red-500 dark:text-rose-400 mt-0.5">{error}</p>
            </div>
            <button
              onClick={loadHistory}
              className="text-xs font-bold text-red-600 dark:text-rose-300 underline"
            >
              Retry
            </button>
          </div>
        ) : purchases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white dark:bg-[#180F26] rounded-3xl border border-dashed border-gray-200 dark:border-white/15 text-center">
            <div className="w-16 h-16 bg-nu-purple-soft dark:bg-nu-purple/20 rounded-2xl flex items-center justify-center text-nu-purple dark:text-purple-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div>
              <p className="text-base font-bold text-nu-charcoal dark:text-white">No purchases found</p>
              <p className="text-xs text-nu-muted dark:text-gray-400 mt-1 max-w-sm">
                When you buy digital products from creators on BMC Link, your download links and license files will always be accessible here.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {purchases.map((purchase) => {
              const isExpired = purchase.expiresAt && new Date(purchase.expiresAt) < new Date();
              const isLimitReached =
                purchase.downloadLimit !== null &&
                purchase.downloadLimit !== undefined &&
                purchase.downloadCount >= purchase.downloadLimit;
              const isDownloadable = !isExpired && !isLimitReached;

              return (
                <div
                  key={purchase.id}
                  className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-5 shadow-sm hover:shadow-nu-soft transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-nu-purple-soft/60 dark:bg-nu-purple/20 overflow-hidden border border-gray-100 dark:border-white/10 flex items-center justify-center shrink-0">
                      {purchase.product?.thumbnail ? (
                        <img
                          src={purchase.product.thumbnail}
                          alt={purchase.product.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-nu-purple dark:text-purple-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-extrabold text-nu-charcoal dark:text-white">
                          {purchase.product?.title || "Digital Download"}
                        </h3>
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 uppercase">
                            <Clock className="w-3 h-3" /> Expired
                          </span>
                        ) : isLimitReached ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50 uppercase">
                            <Ban className="w-3 h-3" /> Limit Reached
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 uppercase">
                            <ShieldCheck className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-nu-muted dark:text-gray-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(purchase.purchasedAt || Date.now()).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        <span>•</span>
                        <span>
                          Downloaded {purchase.downloadCount} times
                          {purchase.downloadLimit ? ` (Max ${purchase.downloadLimit})` : " (Unlimited)"}
                        </span>
                      </div>

                      {purchase.licenseKey && (
                        <div className="mt-2 flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-2.5 py-1 rounded-lg w-fit text-[11px] font-mono text-nu-charcoal dark:text-gray-200">
                          <Key className="w-3 h-3 text-amber-500" />
                          <span>License: {purchase.licenseKey}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={() => handleDownload(purchase)}
                      disabled={downloadingId === purchase.id || !isDownloadable}
                      className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-extrabold rounded-full px-5 py-2.5 text-xs transition-all shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {downloadingId === purchase.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          {isDownloadable ? "Download Asset" : isExpired ? "Expired" : "Limit Reached"}
                        </>
                      )}
                    </button>
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

export function PurchasesPage() {
  return (
    <ProtectedRoute>
      <PurchasesContent />
    </ProtectedRoute>
  );
}
