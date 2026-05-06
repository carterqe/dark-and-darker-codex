"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface ToastProps {
  message: string | null;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          role="alert"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3 bg-bg-secondary border border-accent-emerald/40 rounded-sm shadow-xl"
        >
          <CheckCircle className="w-4 h-4 text-accent-emerald shrink-0" />
          <span className="text-sm text-text-primary">{message}</span>
          <button onClick={onClose} aria-label="Dismiss notification" className="text-text-secondary hover:text-text-primary transition-colors shrink-0">
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
