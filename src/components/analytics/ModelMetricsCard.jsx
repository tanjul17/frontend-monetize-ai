import React from "react";

const ModelMetricsCard = ({ metrics }) => {
  if (!metrics) return null;

  // Ensure all metrics have default values
  const {
    revenuePerInteraction = 0,
    tokensPerInteraction = 0,
    costPerToken = 0,
    retentionRate = 0,
    projectedMonthlyRevenue = 0,
    projectedYearlyRevenue = 0,
    growth = {},
  } = metrics;

  // Format numbers for display
  const formatNumber = (num) => {
    if (num === undefined || num === null) return "0";

    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "$0.00";
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0%";
    return `${value}%`;
  };

  // Helper function for growth indicator
  const getGrowthIndicator = (value) => {
    if (!value && value !== 0) value = 0;

    if (value > 0) {
      return (
        <span className="inline-flex items-center text-green-600 dark:text-green-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
              clipRule="evenodd"
            />
          </svg>
          {formatPercentage(value)}
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="inline-flex items-center text-red-600 dark:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
              clipRule="evenodd"
            />
          </svg>
          {formatPercentage(Math.abs(value))}
        </span>
      );
    } else {
      return <span className="text-gray-500 dark:text-slate-400">0%</span>;
    }
  };

  const metrics1 = [
    {
      label: "Revenue Per Interaction",
      value: formatCurrency(revenuePerInteraction),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-500 dark:text-blue-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tooltip: "Average revenue generated per user interaction",
    },
    {
      label: "Tokens Per Interaction",
      value: formatNumber(tokensPerInteraction),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-purple-500 dark:text-purple-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
          <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
          <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
        </svg>
      ),
      tooltip: "Average number of tokens used in each interaction",
    },
    {
      label: "Cost Per Token",
      value: `$${
        typeof costPerToken === "number" ? costPerToken.toFixed(6) : "0.000000"
      }`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-green-500 dark:text-green-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 011.732 1H7a1 1 0 100 2h2.732A2 2 0 018 11H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414-1.414l-1.483-1.484A4.008 4.008 0 0011.874 10H13a1 1 0 100-2h-1.126a3.976 3.976 0 00-.41-1H13a1 1 0 100-2H7z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tooltip: "The cost charged per token used in this model",
    },
    {
      label: "Retention Rate",
      value: formatPercentage(retentionRate),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-500 dark:text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 00-4.33 10.146c.776-1.268 2.037-2.145 3.472-2.146a3.012 3.012 0 011.673.51 3.97 3.97 0 011.185.86 4.017 4.017 0 011.185-.86 3.013 3.013 0 011.673-.51c1.434 0 2.695.878 3.472 2.146A6 6 0 0010 4zm2.504 8.5l-.72.72a1 1 0 11-1.414-1.414l.72-.72a1 1 0 111.414 1.414zm-6.54-1.414l.72.72a1 1 0 01-1.414 1.414l-.72-.72a1 1 0 011.414-1.414zM10 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tooltip: "Percentage of users who return to use the model again",
    },
  ];

  const metrics2 = [
    {
      label: "Projected Monthly Revenue",
      value: formatCurrency(projectedMonthlyRevenue),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-500 dark:text-indigo-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tooltip: "Expected revenue over the next 30 days based on current trends",
    },
    {
      label: "Projected Yearly Revenue",
      value: formatCurrency(projectedYearlyRevenue),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-pink-500 dark:text-pink-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      tooltip:
        "Expected revenue over the next 365 days based on current trends",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="space-y-3">
          {metrics1.map((metric, index) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-600/50 mr-3">
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-slate-300">
                    {metric.label}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
              {/* Tooltip that appears on hover */}
              <div className="absolute left-0 right-0 mt-1 p-2 rounded-lg bg-gray-700/90 dark:bg-slate-600/90 text-xs text-white dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {metric.tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-slate-600/50 pt-5">
        <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">
          Projected Revenue
        </h3>
        <div className="space-y-3">
          {metrics2.map((metric, index) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-600/50 mr-3">
                    {metric.icon}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-slate-300">
                    {metric.label}
                  </span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
              {/* Tooltip that appears on hover */}
              <div className="absolute left-0 right-0 mt-1 p-2 rounded-lg bg-gray-700/90 dark:bg-slate-600/90 text-xs text-white dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {metric.tooltip}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelMetricsCard;
