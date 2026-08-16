import React, { useEffect, useState } from "react";
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getMyPlans, createPlan, updatePlan } from "@/lib/memberships";
import { getCachedData, setCachedData } from "@/lib/cache";
import { MembershipPlanModal } from "./MembershipPlanModal";
import { useToast } from "@/context/ToastContext";
import type { CreatePlanPayload, MembershipPlan, UpdatePlanPayload } from "@/lib/types";

const CACHE_KEY = "creator_memberships";

export function MembershipSection() {
  const { success, error: toastError } = useToast();
  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    return getCachedData<MembershipPlan[]>(CACHE_KEY) || [];
  });
  const [loading, setLoading] = useState(() => !getCachedData<MembershipPlan[]>(CACHE_KEY));
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);
  const [confirmDeletePlan, setConfirmDeletePlan] = useState<MembershipPlan | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPlans = async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const data = await getMyPlans();
      const activePlans = data.filter((p) => p.isActive);
      setPlans(activePlans);
      setCachedData(CACHE_KEY, activePlans);
    } catch (err) {
      if (plans.length === 0) {
        setError(err instanceof Error ? err.message : "Failed to load membership plans");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans(plans.length > 0);
  }, []);

  const handleCreate = async (payload: CreatePlanPayload | UpdatePlanPayload) => {
    const created = await createPlan(payload as CreatePlanPayload);
    setPlans((prev) => {
      const next = [created, ...prev];
      setCachedData(CACHE_KEY, next);
      return next;
    });
    success("Membership tier created!");
  };

  const handleUpdate = async (payload: CreatePlanPayload | UpdatePlanPayload) => {
    if (!editingPlan) return;
    const updated = await updatePlan(editingPlan.id, payload as UpdatePlanPayload);
    setPlans((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      setCachedData(CACHE_KEY, next);
      return next;
    });
    success("Membership tier updated!");
  };

  const handleDelete = async () => {
    if (!confirmDeletePlan) return;
    setDeleting(true);
    try {
      await updatePlan(confirmDeletePlan.id, { isActive: false });
      setPlans((prev) => prev.filter((p) => p.id !== confirmDeletePlan.id));
      success(`"${confirmDeletePlan.name}" tier deleted successfully!`);
      setConfirmDeletePlan(null);
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Failed to delete membership plan");
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const openEdit = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-nu-charcoal dark:text-white">Membership Tiers</h2>
          <p className="text-xs text-nu-muted dark:text-gray-400">
            Create recurring or time-based subscription packages for your loyal supporters
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/dashboard/memberships"
            className="flex items-center gap-1.5 text-xs font-semibold text-nu-purple bg-nu-purple-soft hover:bg-nu-purple-soft-hover dark:bg-nu-purple/20 px-3.5 py-2 rounded-full transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            My Subscriptions
          </Link>
          <button
            onClick={() => void loadPlans()}
            disabled={loading}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-all disabled:opacity-50"
            title="Refresh tiers"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Tier
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 animate-pulse p-6"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/40 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700 dark:text-red-400">Failed to load membership plans</p>
            <p className="text-xs text-red-500 mt-0.5">{error}</p>
          </div>
          <button onClick={() => void loadPlans()} className="text-xs font-semibold text-red-600 hover:text-red-700 underline">
            Retry
          </button>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-white dark:bg-[#180F26] rounded-3xl border border-dashed border-gray-200 dark:border-white/15">
          <div className="w-16 h-16 bg-nu-purple-soft dark:bg-nu-purple/20 rounded-2xl flex items-center justify-center">
            <Award className="w-8 h-8 text-nu-purple" />
          </div>
          <div className="text-center">
            <p className="text-base font-bold text-nu-charcoal dark:text-white">No membership tiers yet</p>
            <p className="text-sm text-nu-muted dark:text-gray-400 mt-1 max-w-sm">
              Offer exclusive perks, discord roles, or bonus content with custom subscription tiers.
            </p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-5 py-2.5 text-sm transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create your first tier
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-nu-card transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      plan.isActive
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                        : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-400 border border-gray-200 dark:border-white/10"
                    }`}
                  >
                    {plan.isActive ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Active
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" /> Inactive
                      </>
                    )}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(plan)}
                      className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-purple dark:hover:text-purple-300 transition-colors"
                      title="Edit tier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDeletePlan(plan)}
                      className="p-1.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/40 text-nu-muted hover:text-red-500 transition-colors"
                      title="Delete tier"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-nu-charcoal dark:text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-2xl font-extrabold text-nu-purple">
                    ₹{Number(plan.price).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-nu-muted dark:text-gray-400 font-medium">
                    / {plan.durationDays} days
                  </span>
                </div>

                {plan.description && (
                  <p className="text-xs text-nu-muted dark:text-gray-400 mt-3 leading-relaxed line-clamp-3">
                    {plan.description}
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs text-nu-muted dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Valid for {plan.durationDays} days
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Membership Modal ────────────────────────────────────── */}
      <MembershipPlanModal
        isOpen={isModalOpen}
        editingPlan={editingPlan}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingPlan ? handleUpdate : handleCreate}
      />

      {/* ── Delete Confirmation Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {confirmDeletePlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !deleting && setConfirmDeletePlan(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ type: "spring", damping: 26, stiffness: 360 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#180F26] rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center justify-center text-red-600 dark:text-red-400">
                  <Trash2 className="w-6 h-6" />
                </div>
                <button
                  onClick={() => !deleting && setConfirmDeletePlan(null)}
                  className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-nu-muted hover:text-nu-charcoal dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-nu-charcoal dark:text-white">
                  Delete Membership Tier?
                </h3>
                <p className="text-xs text-nu-muted dark:text-gray-400 mt-1 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-nu-charcoal dark:text-white">"{confirmDeletePlan.name}"</span>? This tier will be removed from your profile and will no longer be available for fans to join.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setConfirmDeletePlan(null)}
                  className="flex-1 py-2.5 px-4 rounded-full border border-gray-200 dark:border-white/10 text-xs font-semibold text-nu-muted hover:text-nu-charcoal dark:hover:text-white transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Deleting…</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Tier</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
