"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface MedievalCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
}

export default function MedievalCard({
  children,
  className = "",
  glowColor,
  hover = true,
}: MedievalCardProps) {
  return (
    <motion.div
      className={`relative bg-bg-secondary border border-border-subtle rounded-sm overflow-hidden ${className}`}
      whileHover={
        hover
          ? {
              y: -2,
              boxShadow: glowColor
                ? `0 0 30px ${glowColor}`
                : "0 0 20px rgba(201,168,76,0.15)",
            }
          : undefined
      }
      transition={{ duration: 0.3 }}
    >
      {/* Corner ornaments */}
      <span aria-hidden="true" className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold-dark/40" />
      <span aria-hidden="true" className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold-dark/40" />
      <span aria-hidden="true" className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold-dark/40" />
      <span aria-hidden="true" className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold-dark/40" />

      {children}
    </motion.div>
  );
}
