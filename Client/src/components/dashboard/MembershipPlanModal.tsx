import React, { useEffect, useState } from "react";
import { X, Loader2, Award, Calendar, DollarSign } from "lucide-react";
import type { CreatePlanPayload, MembershipPlan, UpdatePlanPayload } from "@/lib/types";

interface Props {
  isOpen: boolean;
  editingPlan: MembershipPlan | null;
  onClose: () => void;
  onSubmit: (payload: CreatePlanPayload | UpdatePlanPayload) => Promise<void>;
}

export function MembershipPlanModal({
  isOpen,
  editingPlan,
  onClose,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationDays, setDurationDays] = useState("30");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingPlan) {
      setName(editingPlan.name || "");
      setDescription(editingPlan.description || "");
      setPrice(String(editingPlan.price || ""));
      setDurationDays(String(editingPlan.durationDays || 30));
      setIsActive(editingPlan.isActive ?? true);
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setDurationDays("30");
      setIsActive(true);
    }
    setError(null);
  }, [editingPlan, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Plan name is required");
      return;
    }
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid positive price");
      return;
    }
    const numDuration = Number(durationDays);
    if (isNaN(numDuration) || numDuration < 1) {
      setError("Duration must be at least 1 day");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || null,
        price: numPrice,
        durationDays: numDuration,
        isActive,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-nu-purple-soft flex items-center justify-center text-nu-purple">
              <Award className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-nu-charcoal">
              {editingPlan ? "Edit Membership Tier" : "New Membership Tier"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-nu-muted hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
              Tier Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. VIP Backstage Pass, Gold Supporter"
              maxLength={100}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Price (INR ₹) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="299"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
                Duration (Days) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-nu-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  min="1"
                  max="3650"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  placeholder="30"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-nu-charcoal uppercase tracking-wider">
              Perks & Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List what members get: Discord role, private newsletter, shoutout..."
              maxLength={2000}
              className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-nu-charcoal placeholder-nu-muted/60 focus:outline-none focus:ring-2 focus:ring-nu-purple/30 focus:border-nu-purple transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
            <input
              type="checkbox"
              id="plan-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-nu-purple rounded-md accent-nu-purple cursor-pointer"
            />
            <label htmlFor="plan-active" className="text-xs font-semibold text-nu-charcoal cursor-pointer">
              Tier is active and visible to public audience
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-200 text-nu-muted hover:text-nu-charcoal font-semibold rounded-full px-5 py-2 text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-nu-purple hover:bg-nu-purple-hover text-white font-semibold rounded-full px-6 py-2 text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : editingPlan ? (
                "Update Tier"
              ) : (
                "Create Tier"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
