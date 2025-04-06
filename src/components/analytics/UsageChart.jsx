import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UsageChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl">
        <p className="text-gray-500 dark:text-slate-400">
          No usage data available
        </p>
      </div>
    );
  }

  // Format data for the chart and handle potential null/undefined values
  const chartData = data.map((item) => ({
    date: item._id || "",
    interactions: typeof item.interactions === "number" ? item.interactions : 0,
  }));

  // Format numbers with commas
  const formatNumber = (value) => {
    if (value === undefined || value === null) return "0";
    return value.toLocaleString();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700/90 p-3 border border-gray-200 dark:border-slate-600/50 shadow-lg rounded-lg backdrop-blur-sm">
          <p className="font-medium text-gray-700 dark:text-slate-200 mb-1">
            {label || "Unknown"}
          </p>
          <p className="text-blue-600 dark:text-blue-400 flex items-center font-semibold">
            {formatNumber(payload[0].value)} interactions
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          barSize={20}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--grid-color, #E5E7EB)"
            className="dark:stroke-slate-700"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{
              fontSize: 12,
              fill: "var(--text-color, #6B7280)",
              className: "dark:fill-slate-400",
            }}
            tickMargin={10}
            axisLine={{
              stroke: "var(--axis-color, #D1D5DB)",
              className: "dark:stroke-slate-700",
            }}
            tickLine={{
              stroke: "var(--axis-color, #D1D5DB)",
              className: "dark:stroke-slate-700",
            }}
          />
          <YAxis
            tickFormatter={formatNumber}
            tick={{
              fontSize: 12,
              fill: "var(--text-color, #6B7280)",
              className: "dark:fill-slate-400",
            }}
            width={60}
            axisLine={{
              stroke: "var(--axis-color, #D1D5DB)",
              className: "dark:stroke-slate-700",
            }}
            tickLine={{
              stroke: "var(--axis-color, #D1D5DB)",
              className: "dark:stroke-slate-700",
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <defs>
            <linearGradient
              id="interactionsGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
              <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <Bar
            dataKey="interactions"
            fill="url(#interactionsGradient)"
            radius={[4, 4, 0, 0]}
            activeBar={{ stroke: "#93C5FD", strokeWidth: 2 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
