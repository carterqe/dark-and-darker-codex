"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquarePlus } from "lucide-react";
import FeedbackModal from "./FeedbackModal";

export default function FeedbackButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 group
                   flex items-center gap-2 px-3.5 py-2.5
                   bg-bg-secondary/95 border border-gold-primary/40 rounded-sm
                   text-gold-primary shadow-lg backdrop-blur-sm
                   hover:bg-bg-tertiary hover:border-gold-primary
                   hover:shadow-[0_0_20px_rgba(201,168,76,0.25)]
                   transition-all duration-200"
      >
        <MessageSquarePlus className="w-4 h-4" />
        <span className="font-cinzel font-bold text-xs uppercase tracking-wider hidden sm:inline">
          Feedback
        </span>
      </button>
      <FeedbackModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
