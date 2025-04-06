import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TokenUsageChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <p className="text-slate-400">No token usage data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => {
    const promptTokens = item.tokens?.prompt || 0;
    const completionTokens = item.tokens?.completion || 0;

    return {
      date: item._id || "",
      promptTokens,
      completionTokens,
      totalTokens: promptTokens + completionTokens,
    };
  });

  // Format large numbers
  const formatNumber = (value) => {
    if (value === undefined || value === null) return "0";

    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + "K";
    } else {
      return value.toString();
    }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-700/90 p-3 border border-slate-600/50 shadow-lg rounded-lg backdrop-blur-sm">
          <p className="font-medium text-slate-200 mb-2">
            {label || "Unknown"}
          </p>

          {payload.map((entry, index) => {
            const color =
              entry.name === "promptTokens"
                ? "text-purple-400"
                : entry.name === "completionTokens"
                ? "text-indigo-400"
                : "text-violet-400";

            const name =
              entry.name === "promptTokens"
                ? "Prompt"
                : entry.name === "completionTokens"
                ? "Completion"
                : "Total";

            return (
              <p
                key={`item-${index}`}
                className={`${color} text-sm flex items-center mb-1 last:mb-0`}
              >
                <span className="mr-2">•</span>
                <span className="font-medium">{name}:</span>
                <span className="ml-2 font-semibold">
                  {formatNumber(entry.value)}
                </span>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex justify-center mt-2 space-x-4">
        {payload.map((entry, index) => {
          const color =
            entry.dataKey === "promptTokens"
              ? "text-purple-400"
              : entry.dataKey === "completionTokens"
              ? "text-indigo-400"
              : "text-violet-400";

          const name =
            entry.dataKey === "promptTokens"
              ? "Prompt"
              : entry.dataKey === "completionTokens"
              ? "Completion"
              : "Total";

          return (
            <span
              key={`item-${index}`}
              className={`${color} text-xs flex items-center`}
            >
              <span className="mr-1">•</span>
              {name}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 25 }}
        >
          <defs>
            <linearGradient id="promptGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#334155"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            tickMargin={10}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
          />
          <YAxis
            tickFormatter={formatNumber}
            tick={{ fontSize: 12, fill: "#94A3B8" }}
            width={60}
            axisLine={{ stroke: "#475569" }}
            tickLine={{ stroke: "#475569" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend content={renderLegend} />
          <Area
            type="monotone"
            dataKey="promptTokens"
            name="Prompt"
            stackId="1"
            stroke="#A855F7"
            fill="url(#promptGradient)"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#A855F7" }}
          />
          <Area
            type="monotone"
            dataKey="completionTokens"
            name="Completion"
            stackId="1"
            stroke="#6366F1"
            fill="url(#completionGradient)"
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0, fill: "#6366F1" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenUsageChart;
