"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Activity } from "lucide-react";
import { ActivityEvent } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export default function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="w-5 h-5 text-gold-primary" />
          <h3 className="font-cinzel font-bold text-lg text-text-primary">
            Recent Activity
          </h3>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {events.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center justify-between bg-bg-secondary/60 border border-border-subtle rounded-sm px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-primary" />
                  <p className="text-sm">
                    <span className="font-cinzel font-semibold text-gold-primary">
                      {event.player}
                    </span>{" "}
                    <span className="text-text-secondary">{event.action}</span>
                    {event.value && (
                      <span className="text-gold-light font-semibold">
                        {" "}
                        {event.value}
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-text-secondary whitespace-nowrap ml-4">
                  {timeAgo(event.timestamp)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
