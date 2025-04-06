import React from "react";
import { motion } from "framer-motion";

// Import CountUp for animating numbers
const CountUp = ({ end, duration = 2, decimals = 0 }) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    let animationFrame;

    const updateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(progress * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateCount);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return decimals ? count.toFixed(decimals) : Math.floor(count);
};

const DashboardSummary = ({ summaryData }) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  // Add a null check to handle cases where summary might be undefined
  if (!summaryData) {
    console.log("Missing or invalid summary data:", summaryData);
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
          Dashboard Summary
        </h2>
        <motion.div
          variants={itemVariants}
          className="p-6 border border-slate-200 dark:border-slate-700/50 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-300"
        >
          No summary data available at this time.
        </motion.div>
      </motion.div>
    );
  }

  // Handle the structure correctly - the API returns data in a nested 'data' property
  const data = summaryData.data || summaryData;

  // Create defaults for missing values
  const totalModels =
    data.totalModels ||
    data.summary?.totalModels ||
    data.models?.length ||
    data.modelsPerformance?.length ||
    0;
  const totalInteractions =
    data.totalInteractions || data.summary?.totalInteractions || 0;
  const totalRevenue = data.totalRevenue || data.summary?.totalRevenue || 0;
  const totalTokens = data.totalTokens || data.summary?.totalTokens || 0;

  // Calculate derived metrics for dashboard summary
  const revenuePerInteraction =
    totalInteractions > 0
      ? parseFloat((totalRevenue / totalInteractions).toFixed(4))
      : 0;

  const tokensPerInteraction =
    totalInteractions > 0 ? Math.round(totalTokens / totalInteractions) : 0;

  // eslint-disable-next-line no-unused-vars
  const costPerToken =
    totalTokens > 0 ? parseFloat((totalRevenue / totalTokens).toFixed(6)) : 0;

  // Projected revenue
  const projectedMonthlyRevenue = parseFloat(
    (totalRevenue * (30 / 7)).toFixed(2)
  ); // Assuming weekly data
  const projectedYearlyRevenue = parseFloat(
    (projectedMonthlyRevenue * 12).toFixed(2)
  );

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  };

  const formatRevenue = (revenue) => {
    return `$${revenue.toFixed(2)}`;
  };

  const formatTokens = (tokens) => {
    if (tokens >= 1000000) {
      return (tokens / 1000000).toFixed(1) + "M";
    } else if (tokens >= 1000) {
      return (tokens / 1000).toFixed(1) + "K";
    } else {
      return tokens.toString();
    }
  };

  const getTooltipText = (metricId) => {
    const tooltips = {
      models: "Total number of AI models you have created",
      interactions:
        "Total user interactions with your models in the selected timeframe",
      revenue:
        "Total revenue generated from your models in the selected timeframe",
      tokens: "Total number of tokens processed by your models",
      revenuePerInteraction: "Average revenue generated per user interaction",
      tokensPerInteraction: "Average number of tokens used per interaction",
      projectedMonthly:
        "Projected monthly revenue based on current performance",
      projectedYearly:
        "Projected yearly revenue based on current monthly projections",
    };

    return tooltips[metricId] || "No description available";
  };

  const summaryItems = [
    {
      id: "models",
      label: "Total Models",
      value: totalModels,
      formattedValue: totalModels.toString(),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-blue-600 dark:text-blue-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      ),
      bgGradient: "from-blue-500/5 to-blue-600/10",
      borderColor: "border-blue-200 dark:border-blue-800/30",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      id: "interactions",
      label: "Total Interactions",
      value: totalInteractions,
      formattedValue: formatNumber(totalInteractions),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-green-600 dark:text-green-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M13 8H7" />
          <path d="M17 12H7" />
        </svg>
      ),
      bgGradient: "from-green-500/5 to-green-600/10",
      borderColor: "border-green-200 dark:border-green-800/30",
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: totalRevenue,
      formattedValue: formatRevenue(totalRevenue),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-yellow-600 dark:text-yellow-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      ),
      bgGradient: "from-yellow-500/5 to-yellow-600/10",
      borderColor: "border-yellow-200 dark:border-yellow-800/30",
      textColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      id: "tokens",
      label: "Total Tokens",
      value: totalTokens,
      formattedValue: formatTokens(totalTokens),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-purple-600 dark:text-purple-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
          <line x1="16" y1="8" x2="2" y2="22" />
          <line x1="17.5" y1="15" x2="9" y2="15" />
        </svg>
      ),
      bgGradient: "from-purple-500/5 to-purple-600/10",
      borderColor: "border-purple-200 dark:border-purple-800/30",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const calculatedMetrics = [
    {
      id: "revenuePerInteraction",
      label: "Revenue/Interaction",
      value: revenuePerInteraction,
      formattedValue: `$${revenuePerInteraction.toFixed(4)}`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      bgGradient: "from-indigo-500/5 to-indigo-600/10",
      borderColor: "border-indigo-200 dark:border-indigo-800/30",
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      id: "tokensPerInteraction",
      label: "Tokens/Interaction",
      value: tokensPerInteraction,
      formattedValue: formatNumber(tokensPerInteraction),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-pink-600 dark:text-pink-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v3m0 4.5v3m0 4.5v3" />
          <circle cx="12" cy="12" r="1.5" />
          <path d="M7.5 7.5a6 6 0 0 0 0 9h9a6 6 0 0 0 0-9h-9Z" />
        </svg>
      ),
      bgGradient: "from-pink-500/5 to-pink-600/10",
      borderColor: "border-pink-200 dark:border-pink-800/30",
      textColor: "text-pink-600 dark:text-pink-400",
    },
    {
      id: "projectedMonthly",
      label: "Projected Monthly",
      value: projectedMonthlyRevenue,
      formattedValue: formatRevenue(projectedMonthlyRevenue),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-cyan-600 dark:text-cyan-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </svg>
      ),
      bgGradient: "from-cyan-500/5 to-cyan-600/10",
      borderColor: "border-cyan-200 dark:border-cyan-800/30",
      textColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      id: "projectedYearly",
      label: "Projected Yearly",
      value: projectedYearlyRevenue,
      formattedValue: formatRevenue(projectedYearlyRevenue),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-teal-600 dark:text-teal-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <path d="M17 14h-6" />
          <path d="M13 18H7" />
          <path d="M7 14h.01" />
          <path d="M17 18h.01" />
        </svg>
      ),
      bgGradient: "from-teal-500/5 to-teal-600/10",
      borderColor: "border-teal-200 dark:border-teal-800/30",
      textColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
        Dashboard Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {summaryItems.map((item, index) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm border ${item.borderColor} shadow-sm`}
          >
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm"></div>
            <div className="relative p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="group relative">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                      {item.label}
                      <span className="ml-1.5 text-slate-400 dark:text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </p>
                    <div className="invisible group-hover:visible absolute z-10 w-64 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 top-0 left-0 transform -translate-y-full mt-1">
                      {getTooltipText(item.id)}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${item.textColor}`}>
                    <CountUp
                      end={item.value}
                      decimals={
                        typeof item.value === "number" && item.value % 1 !== 0
                          ? 2
                          : 0
                      }
                    />
                    {item.id === "revenue" && (
                      <span className="ml-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                        USD
                      </span>
                    )}
                  </div>
                </div>
                <motion.div
                  className="rounded-lg p-3"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
              </div>

              {/* Mini sparkline placeholder - could be replaced with actual mini charts */}
              <div className="w-full h-8 mt-4 flex items-end space-x-0.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const height = Math.floor(Math.random() * 24) + 8; // Random height between 8-32px
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height }}
                      transition={{ delay: i * 0.05, duration: 0.5 }}
                      className={`w-full max-w-[5px] rounded-sm ${item.textColor} opacity-30`}
                    ></motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
        Calculated Metrics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {calculatedMetrics.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${item.bgGradient} backdrop-blur-sm border ${item.borderColor} shadow-sm`}
          >
            <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm"></div>
            <div className="relative p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="group relative">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                      {item.label}
                      <span className="ml-1.5 text-slate-400 dark:text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </span>
                    </p>
                    <div className="invisible group-hover:visible absolute z-10 w-64 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 top-0 left-0 transform -translate-y-full mt-1">
                      {getTooltipText(item.id)}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${item.textColor}`}>
                    <CountUp
                      end={item.value}
                      decimals={
                        typeof item.value === "number" && item.value % 1 !== 0
                          ? 4
                          : 0
                      }
                    />
                  </div>
                </div>
                <motion.div
                  className="rounded-lg p-2"
                  whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DashboardSummary;
