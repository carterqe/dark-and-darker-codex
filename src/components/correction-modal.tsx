"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const inputClass =
  "w-full px-3 py-2.5 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all";

const sectionLabel =
  "text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5";

export type CorrectionTargetType =
  | "map"
  | "quest"
  | "item"
  | "boss"
  | "shrine"
  | "campfire"
  | "other";

interface CorrectionModalProps {
  open: boolean;
  onClose: () => void;
  targetType: CorrectionTargetType;
  targetId: string;
  field: string;
  currentValue?: string | null;
}

export default function CorrectionModal({
  open,
  onClose,
  targetType,
  targetId,
  field,
  currentValue,
}: CorrectionModalProps) {
  const { user, openAuthModal, showToast } = useAuth();
  const [suggestedValue, setSuggestedValue] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset form state every time the modal opens
  useEffect(() => {
    if (open) {
      setSuggestedValue("");
      setReason("");
      setError(null);
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (!suggestedValue.trim()) {
      setError("Please describe what the correct value should be.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/corrections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_type: targetType,
          target_id: targetId,
          field,
          current_value: currentValue ?? null,
          suggested_value: suggestedValue,
          reason: reason.trim() || null,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Failed to submit correction.");
        return;
      }

      setSuccess(true);
      showToast("Correction submitted — thanks for the heads up!");
      // Close shortly after success so the user sees the confirmation
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="correction-modal-title"
            className="relative w-full max-w-md mx-4 bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-gold-primary" aria-hidden="true" />
                <span id="correction-modal-title" className="font-cinzel font-bold text-gold-primary">
                  Report Inaccuracy
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
                type="button"
                aria-label="Close correction dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {!user ? (
                // Unauthed gate — mirrors CreateBuildClient's login prompt
                <div className="text-center py-4">
                  <Lock className="w-10 h-10 text-gold-dark mx-auto mb-3" />
                  <h3 className="font-cinzel font-bold text-gold-primary mb-2">
                    Sign in to Report
                  </h3>
                  <p className="text-sm text-text-secondary mb-5">
                    Only signed-in adventurers can submit corrections so we can
                    follow up if we need more info.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openAuthModal("login");
                    }}
                    className="px-4 py-2 bg-gold-primary text-bg-primary font-cinzel font-bold text-sm rounded-sm hover:bg-gold-light transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              ) : (
                <>
                  {/* Context block — what they're reporting */}
                  <div className="bg-bg-primary/40 border border-border-subtle/60 rounded-sm px-3 py-2.5 text-xs space-y-1">
                    <div className="flex justify-between gap-3">
                      <span className="text-text-secondary uppercase tracking-wider text-[10px]">
                        Type
                      </span>
                      <span className="text-text-primary font-medium capitalize">
                        {targetType}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-text-secondary uppercase tracking-wider text-[10px]">
                        Target
                      </span>
                      <span className="text-text-primary font-medium truncate max-w-[60%]" title={targetId}>
                        {targetId}
                      </span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-text-secondary uppercase tracking-wider text-[10px]">
                        Field
                      </span>
                      <span className="text-text-primary font-medium">{field}</span>
                    </div>
                    {currentValue != null && currentValue !== "" && (
                      <div className="pt-1 border-t border-border-subtle/60 mt-1.5">
                        <span className="text-text-secondary uppercase tracking-wider text-[10px] block mb-1">
                          Current value
                        </span>
                        <span className="text-text-primary/90 break-words">
                          {currentValue}
                        </span>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div role="alert" className="flex items-center gap-2.5 bg-accent-red/10 border border-accent-red/30 rounded-sm px-4 py-3">
                      <AlertCircle className="w-4 h-4 text-accent-red shrink-0" aria-hidden="true" />
                      <p className="text-xs text-accent-red">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div role="status" aria-live="polite" className="flex items-center gap-2.5 bg-accent-emerald/10 border border-accent-emerald/30 rounded-sm px-4 py-3">
                      <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" aria-hidden="true" />
                      <p className="text-xs text-accent-emerald">
                        Submitted — a maintainer will review this soon.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="correction-suggested-value" className={sectionLabel}>
                        Suggested value *
                      </label>
                      <textarea
                        id="correction-suggested-value"
                        value={suggestedValue}
                        onChange={(e) => setSuggestedValue(e.target.value)}
                        required
                        maxLength={2000}
                        rows={3}
                        placeholder="What should this be instead?"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div>
                      <label htmlFor="correction-reason" className={sectionLabel}>
                        Reason <span className="text-text-secondary font-normal normal-case">(optional)</span>
                      </label>
                      <textarea
                        id="correction-reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        placeholder="Source, in-game screenshot description, patch notes, etc."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-1">
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submitting || success}
                        className="px-4 py-2 bg-gold-primary text-bg-primary font-cinzel font-bold text-sm rounded-sm hover:bg-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? "Submitting..." : "Submit Correction"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
