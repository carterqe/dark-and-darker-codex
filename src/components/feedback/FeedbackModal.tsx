"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquarePlus, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const inputClass =
  "w-full px-3 py-2.5 bg-bg-primary border border-border-subtle rounded-sm text-sm text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-all";

const sectionLabel =
  "text-[10px] uppercase tracking-wider text-gold-dark font-bold block mb-1.5";

type Category = "bug" | "suggestion" | "data" | "other";

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "suggestion", label: "Suggestion" },
  { value: "bug", label: "Bug" },
  { value: "data", label: "Data issue" },
  { value: "other", label: "Other" },
];

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const { user, profile, showToast } = useAuth();
  const [category, setCategory] = useState<Category>("suggestion");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open) {
      setCategory("suggestion");
      setMessage("");
      setError(null);
      setSuccess(false);
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message }),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(json.error ?? "Failed to submit feedback.");
        return;
      }

      setSuccess(true);
      showToast("Feedback received — thank you!");
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
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
            aria-labelledby="feedback-modal-title"
            className="relative w-full max-w-md mx-4 bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-gold-primary" aria-hidden="true" />
                <span id="feedback-modal-title" className="font-cinzel font-bold text-gold-primary">
                  Send Feedback
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors p-1"
                type="button"
                aria-label="Close feedback dialog"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-text-secondary leading-relaxed">
                Spotted a bug, have an idea, or see wrong data? Let us know.
                {user && profile
                  ? ` Submitting as @${profile.username}.`
                  : " Submitting anonymously."}
              </p>

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
                    Received — thanks for the heads up.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="feedback-category" className={sectionLabel}>Category</label>
                  <select
                    id="feedback-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category)}
                    className={inputClass}
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback-message" className={sectionLabel}>Message *</label>
                  <textarea
                    id="feedback-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    maxLength={2000}
                    rows={5}
                    placeholder="What happened, what did you expect, and where?"
                    className={`${inputClass} resize-none`}
                  />
                  <div className="text-[10px] text-text-secondary/70 text-right mt-1">
                    {message.length}/2000
                  </div>
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
                    {submitting ? "Submitting..." : "Send Feedback"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
