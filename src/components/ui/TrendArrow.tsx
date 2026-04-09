"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendArrowProps {
  trend: "up" | "down" | "stable";
}

export default function TrendArrow({ trend }: TrendArrowProps) {
  if (trend === "stable") {
    return <Minus className="w-4 h-4 text-text-secondary" />;
  }

  const isUp = trend === "up";
  const Icon = isUp ? TrendingUp : TrendingDown;
  const color = isUp ? "text-accent-emerald" : "text-accent-red";

  return (
    <motion.div
      initial={{ y: isUp ? 5 : -5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Icon className={`w-4 h-4 ${color}`} />
    </motion.div>
  );
}
