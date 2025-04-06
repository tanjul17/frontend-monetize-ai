import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

const RevenueChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 rounded-xl">
        <p className="text-gray-500 dark:text-slate-400">
          No revenue data available
        </p>
      </div>
    );
  }

  // Format data for the chart and handle potential null/undefined values
  const chartData = data.map((item) => ({
    date: item._id || "",
    revenue: typeof item.revenue === "number" ? item.revenue : 0,
  }));

  // Format currency in the tooltip
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "$0.00";
    return `$${value.toFixed(2)}`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-700/90 p-3 border border-gray-200 dark:border-slate-600/50 shadow-lg rounded-lg backdrop-blur-sm">
          <p className="font-medium text-gray-700 dark:text-slate-200 mb-1">
            {label || "Unknown"}
          </p>
          <p className="text-green-600 dark:text-green-400 flex items-center font-semibold">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            tickFormatter={formatCurrency}
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
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            activeDot={{ r: 6, strokeWidth: 0, fill: "#10B981" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
