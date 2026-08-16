import React, { useState } from "react";
import { X, Award, CheckCircle2, Loader2, Calendar, ShieldCheck } from "lucide-react";
import { subscribePlan, verifyMembership } from "@/lib/memberships";
import { openRazorpayCheckout } from "@/lib/razorpay";
import { useToast } from "@/context/ToastContext";
import type { MembershipPlan } from "@/lib/types";

interface Props {
  isOpen: boolean;
  plan: MembershipPlan | null;
  creatorName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export function SubscribeModal({
  isOpen,
  plan,
  creatorName,
  onClose,
  onSuccess,
}: Props) {
  const { success, error: toastError } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Create order
      const order = await subscribePlan({
        planId: plan.id,
        memberName: name.trim() || undefined,
        memberEmail: email.trim() || undefined,
      });

      // 2. Open Razorpay modal
      const checkoutResult = await openRazorpayCheckout({
        keyId: order.keyId,
        orderId: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: `Join ${plan.name}`,
        description: `Membership with ${creatorName}`,
        prefill: {
          name: name || undefined,
          email: email || undefined,
        },
      });

      // 3. Verify signature
      await verifyMembership(checkoutResult);

      setIsSuccess(true);
      success(`Welcome to ${plan.name}!`);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Subscription failed or was cancelled");
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
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-extrabold text-nu-charcoal">Membership Active!</h3>
            <p className="text-sm text-nu-muted max-w-xs">
              You are now a member of <strong className="text-nu-charcoal">{plan.name}</strong> with {creatorName}.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-all shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-nu-purple-soft border border-nu-purple/10 flex items-center justify-center text-nu-purple shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-nu-charcoal">{plan.name}</h3>
                <p className="text-xs text-nu-muted">By {creatorName}</p>
              </div>
            </div>

            {/* Plan Info Card */}
            <div className="bg-nu-purple-soft/60 border border-nu-purple/15 rounded-2xl p-4 flex flex-col gap-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-nu-muted uppercase tracking-wider">
                  Total
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-nu-purple">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-nu-muted">/ {plan.durationDays} days</span>
                </div>
              </div>

              {plan.description && (
                <p className="text-xs text-nu-charcoal mt-1 leading-relaxed">
                  {plan.description}
                </p>
              )}

              <div className="flex items-center gap-1.5 text-[11px] text-nu-purple font-semibold mt-1">
                <Calendar className="w-3.5 h-3.5" />
                Access for {plan.durationDays} days upon payment
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Smith"
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Your Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-nu-muted">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secure, instant checkout powered by Razorpay
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-bold rounded-full py-3 text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connecting Gateway...
                </>
              ) : (
                <>Join for ₹{Number(plan.price).toLocaleString("en-IN")}</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
