import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const GeoDistributionChart = ({ data }) => {
  // Handle missing or invalid data
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-slate-800/50 border border-slate-700/50 rounded-xl">
        <p className="text-slate-400">No geographic data available</p>
      </div>
    );
  }

  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.country || item._id || "Unknown",
    value: item.count || 0,
  }));

  // Sort by value descending to highlight the most significant regions
  chartData.sort((a, b) => b.value - a.value);

  // Take top 5 countries + aggregate others
  let processedData;
  if (chartData.length > 5) {
    const topRegions = chartData.slice(0, 5);
    const otherSum = chartData
      .slice(5)
      .reduce((sum, item) => sum + item.value, 0);

    processedData = [...topRegions, { name: "Others", value: otherSum }];
  } else {
    processedData = chartData;
  }

  // Custom colors with different saturation levels for dark theme
  const COLORS = [
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#10B981",
    "#6B7280",
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = (
        (data.value / chartData.reduce((sum, item) => sum + item.value, 0)) *
        100
      ).toFixed(1);

      return (
        <div className="bg-slate-700/90 p-3 border border-slate-600/50 shadow-lg rounded-lg backdrop-blur-sm">
          <p className="font-medium text-slate-200 mb-1">{data.name}</p>
          <div className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.fill }}
            ></div>
            <p className="text-slate-300 flex items-center">
              <span className="font-semibold">{data.value}</span>
              <span className="mx-1 text-slate-400">•</span>
              <span>{percentage}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const renderLegend = (props) => {
    const { payload } = props;

    return (
      <div className="grid grid-cols-2 gap-2 mt-2 justify-center">
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center text-xs">
            <div
              className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-slate-300 truncate">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={80}
            innerRadius={40}
            paddingAngle={2}
            label={false}
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(0, 0, 0, 0.1)"
                className="hover:opacity-80 transition-opacity"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            content={renderLegend}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GeoDistributionChart;
