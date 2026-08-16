import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  DollarSign,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileCheck,
  Share2,
} from "lucide-react";
import { getPublicProduct } from "@/lib/products";
import { createPurchaseOrder, verifyPurchase, downloadPurchaseFile } from "@/lib/purchases";
import { openRazorpayCheckout, preloadRazorpayScript } from "@/lib/razorpay";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useToast } from "@/context/ToastContext";
import type { DigitalProduct, Purchase } from "@/lib/types";

export function ProductDetailPage() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const { success, error: toastError } = useToast();

  const [product, setProduct] = useState<DigitalProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Checkout state
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<Purchase | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Preload Razorpay gateway on idle so checkout opens with 0ms delay
  useEffect(() => {
    preloadRazorpayScript();
  }, []);

  useEffect(() => {
    if (!username || !slug) return;
    (async () => {
      setLoading(true);
      try {
        const p = await getPublicProduct(username, slug);
        setProduct(p);
      } catch (err: any) {
        if (err?.status === 404) setNotFound(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [username, slug]);

  const handleBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!buyerEmail.trim()) {
      setCheckoutError("Please enter your email to receive your download link");
      return;
    }

    setPurchasing(true);
    setCheckoutError(null);

    try {
      // 1. Create purchase order
      const order = await createPurchaseOrder({
        productId: product.id,
        buyerName: buyerName.trim() || undefined,
        buyerEmail: buyerEmail.trim() || undefined,
      });

      // 2. Open Razorpay Checkout
      const checkoutResult = await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: product.title,
        description: `Digital download by @${username}`,
        prefill: {
          name: buyerName || undefined,
          email: buyerEmail || undefined,
        },
      });

      // 3. Verify signature
      const purchase = await verifyPurchase(checkoutResult);
      setPurchasedItem(purchase);
      success("Payment successful! Your file is ready for download.");
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Purchase failed or was cancelled");
    } finally {
      setPurchasing(false);
    }
  };

  const handleDownload = async () => {
    if (!purchasedItem) return;
    setDownloading(true);
    try {
      await downloadPurchaseFile(purchasedItem.id, product?.title || "download");
      success("Download started!");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Download failed");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-nu-bg flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-nu-purple animate-spin" />
          <p className="text-sm font-semibold text-nu-muted">Loading product...</p>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen bg-nu-bg flex flex-col items-center justify-center gap-4 p-4">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-nu-charcoal">Product not found</h1>
        <p className="text-sm text-nu-muted">This digital item is unavailable or private.</p>
        <Link
          to={`/${username}`}
          className="text-sm font-semibold text-nu-purple hover:underline"
        >
          ← Back to @{username}&apos;s profile
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nu-bg pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link
            to={`/${username}`}
            className="flex items-center gap-2 text-xs font-bold text-nu-muted hover:text-nu-charcoal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>@{username}&apos;s page</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-bold text-nu-charcoal"
            >
              <div className="w-6 h-6 bg-nu-purple rounded-lg flex items-center justify-center text-white text-xs font-extrabold">
                B
              </div>
              BMC Link Store
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Product Info */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Thumbnail */}
            <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-nu-soft">
              {product.thumbnail ? (
                <div className="w-full h-64 sm:h-80 bg-gray-100 overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-64 bg-nu-purple-soft flex items-center justify-center text-nu-purple">
                  <Package className="w-16 h-16" />
                </div>
              )}

              <div className="p-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-nu-purple bg-nu-purple-soft px-3 py-1 rounded-full">
                  Digital Download
                </span>
                <h1 className="text-2xl font-extrabold text-nu-charcoal mt-3 leading-tight">
                  {product.title}
                </h1>
                <p className="text-xs text-nu-muted mt-1">
                  Created and published by{" "}
                  <Link to={`/${username}`} className="font-bold text-nu-charcoal hover:underline">
                    @{username}
                  </Link>
                </p>

                {product.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-nu-charcoal uppercase tracking-wider mb-2">
                      About this product
                    </h3>
                    <p className="text-sm text-nu-charcoal leading-relaxed whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}

                {product.previewUrl && (
                  <div className="mt-6">
                    <a
                      href={product.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-nu-purple bg-nu-purple-soft hover:bg-nu-purple-soft-hover px-4 py-2 rounded-full transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live Demo / Preview
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Checkout & Download */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-nu-soft sticky top-24">
              {purchasedItem ? (
                /* Success & Download state */
                <div className="flex flex-col items-center text-center gap-4 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-nu-charcoal dark:text-white">
                      Order Confirmed!
                    </h3>
                    <p className="text-xs text-nu-muted dark:text-gray-300 mt-1 max-w-xs leading-relaxed">
                      Thank you for your purchase. You can now download your digital asset directly.
                    </p>
                  </div>

                  <button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-full py-3.5 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {downloading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Downloading file...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download Asset Now
                      </>
                    )}
                  </button>

                  <div className="w-full flex flex-col gap-2 pt-1 text-center">
                    <Link
                      to="/dashboard/purchases"
                      className="text-xs font-bold text-nu-purple dark:text-purple-300 hover:underline flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View in My Purchases
                    </Link>
                    <p className="text-[11px] text-nu-muted dark:text-gray-400">
                      Receipt sent to {buyerEmail || "your email"}.
                    </p>
                  </div>
                </div>
              ) : (
                /* Checkout Form */
                <form onSubmit={handleBuy} className="flex flex-col gap-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-bold text-nu-muted uppercase tracking-wider">
                      Price
                    </span>
                    <span className="text-3xl font-extrabold text-nu-purple">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="h-px bg-gray-100 my-1" />

                  {checkoutError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                      {checkoutError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="e.g. Jordan Lee"
                      className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-nu-muted mt-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    Instant download & invoice via Razorpay
                  </div>

                  <button
                    type="submit"
                    disabled={purchasing}
                    className="w-full mt-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-bold rounded-full py-3.5 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
                  >
                    {purchasing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting Gateway...
                      </>
                    ) : (
                      <>Buy & Download for ₹{Number(product.price).toLocaleString("en-IN")}</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
