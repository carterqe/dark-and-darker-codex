"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MedievalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary";
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

export default function MedievalButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  loading = false,
}: MedievalButtonProps) {
  const baseStyles =
    "relative px-6 py-3 font-cinzel font-bold text-sm tracking-wider uppercase transition-all duration-300 border-2 rounded-sm";
  const variants = {
    primary:
      "bg-gradient-to-b from-gold-dark/30 to-transparent border-gold-primary text-gold-light hover:shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:border-gold-light",
    secondary:
      "bg-transparent border-gold-dark text-gold-dark hover:border-gold-primary hover:text-gold-primary",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
    >
      {/* Corner decorations */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-primary" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gold-primary" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gold-primary" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-primary" />

      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
