"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogOut, Home } from "lucide-react";
import ShimmerText from "@/components/ui/ShimmerText";
import MedievalButton from "@/components/ui/MedievalButton";

export default function LogoutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 rounded-full border border-gold-primary/30 bg-gold-primary/5 flex items-center justify-center mb-6">
          <LogOut className="w-7 h-7 text-gold-primary" />
        </div>

        <ShimmerText as="h1" className="text-3xl sm:text-4xl mb-3">
          You&apos;ve been signed out
        </ShimmerText>

        <p className="text-text-secondary mb-10 max-w-md">
          Safe travels, adventurer. Your session has ended — return whenever the realm calls you.
        </p>

        <Link href="/">
          <MedievalButton variant="primary">
            <span className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Go Back Home
            </span>
          </MedievalButton>
        </Link>
      </motion.div>
    </div>
  );
}
