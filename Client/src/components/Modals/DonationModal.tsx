import React, { useState, useEffect } from "react";
import {
  X,
  Heart,
  Coffee,
  DollarSign,
  Loader2,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { createDonationOrder, verifyDonation } from "@/lib/donations";
import { openRazorpayCheckout, preloadRazorpayScript } from "@/lib/razorpay";
import { useToast } from "@/context/ToastContext";

interface Props {
  isOpen: boolean;
  username: string;
  creatorName: string;
  avatarSrc?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const PRESET_AMOUNTS = [100, 300, 500, 1000];

export function DonationModal({
  isOpen,
  username,
  creatorName,
  avatarSrc,
  onClose,
  onSuccess,
}: Props) {
  const { success, error: toastError } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number>(300);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preload payment script as soon as the modal is opened
  useEffect(() => {
    if (isOpen) {
      preloadRazorpayScript();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  const handlePreset = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAmount || currentAmount <= 0) {
      setError("Please select or enter a valid donation amount");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const order = await createDonationOrder({
        username,
        amount: currentAmount,
        name: isAnonymous ? undefined : name.trim() || undefined,
        email: email.trim() || undefined,
        message: message.trim() || undefined,
        isAnonymous,
      });

      // 2. Open Razorpay modal
      const checkoutResult = await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: `Support ${creatorName}`,
        description: message || "Donation & Coffee Tip",
        prefill: {
          name: name || undefined,
          email: email || undefined,
        },
      });

      // 3. Verify payment signature on backend
      await verifyDonation(checkoutResult);

      setIsSuccess(true);
      success(`Thank you for supporting ${creatorName}!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Donation failed or was cancelled");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 relative">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-nu-muted hover:bg-gray-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <Heart className="w-8 h-8 fill-rose-500 animate-bounce" />
            </div>
            <h3 className="text-xl font-extrabold text-nu-charcoal">Thank You!</h3>
            <p className="text-sm text-nu-muted max-w-xs">
              Your contribution of <strong className="text-nu-charcoal">₹{currentAmount}</strong> has been sent to{" "}
              {creatorName}.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center overflow-hidden shrink-0">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={creatorName} decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <Coffee className="w-6 h-6 text-rose-500" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-nu-charcoal">
                  Buy {creatorName} a coffee
                </h3>
                <p className="text-xs text-nu-muted">Direct supporter donation & tip</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                {error}
              </div>
            )}

            {/* Presets */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Select Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AMOUNTS.map((amt) => {
                  const isSelected = !customAmount && selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePreset(amt)}
                      className={`py-2.5 rounded-2xl border text-sm font-bold transition-all ${
                        isSelected
                          ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                          : "bg-white text-nu-charcoal border-gray-200 hover:border-rose-300"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-nu-muted">
                ₹
              </span>
              <input
                type="number"
                min="10"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Or enter custom amount..."
                className="w-full border border-gray-200 rounded-2xl pl-8 pr-4 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              />
            </div>

            {/* Supporter details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isAnonymous}
                placeholder="Your name (optional)"
                className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all disabled:bg-gray-100"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>

            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something nice or ask a question..."
              maxLength={500}
              className="border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all resize-none"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous-donation"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-rose-500 rounded-md accent-rose-500 cursor-pointer"
              />
              <label htmlFor="anonymous-donation" className="text-xs text-nu-muted cursor-pointer">
                Donate anonymously (hide my name)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-full py-3 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting Gateway...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  Support ₹{currentAmount || 0}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
