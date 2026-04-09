"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface RankHistoryChartProps {
  data: { date: string; rank: number }[];
}

export default function RankHistoryChart({ data }: RankHistoryChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-bg-secondary border border-border-subtle rounded-sm p-6 mb-10"
    >
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-gold-primary" />
        <h3 className="font-cinzel font-bold text-lg text-text-primary">
          Rank History
        </h3>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="rankGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c9a84c" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#c9a84c" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(201,168,76,0.1)"
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#8a8693", fontSize: 11 }}
              axisLine={{ stroke: "rgba(201,168,76,0.15)" }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              reversed
              tick={{ fill: "#8a8693", fontSize: 11 }}
              axisLine={{ stroke: "rgba(201,168,76,0.15)" }}
              tickLine={false}
              label={{
                value: "Rank",
                angle: -90,
                position: "insideLeft",
                fill: "#8a8693",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#12121a",
                border: "1px solid rgba(201,168,76,0.3)",
                borderRadius: "2px",
                color: "#e8e6e1",
                fontSize: 12,
              }}
              labelStyle={{ color: "#c9a84c", fontWeight: "bold" }}
            />
            <Area
              type="monotone"
              dataKey="rank"
              stroke="#c9a84c"
              strokeWidth={2}
              fill="url(#rankGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
