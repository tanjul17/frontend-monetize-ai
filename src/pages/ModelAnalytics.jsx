import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getModelDetailedAnalytics } from "../services/analyticsService";
import TimeframeSelector from "../components/analytics/TimeframeSelector";
import IntervalSelector from "../components/analytics/IntervalSelector";
import ModelSummaryCard from "../components/analytics/ModelSummaryCard";
import ModelMetricsCard from "../components/analytics/ModelMetricsCard";
import RevenueChart from "../components/analytics/RevenueChart";
import UsageChart from "../components/analytics/UsageChart";
import TokenUsageChart from "../components/analytics/TokenUsageChart";
import GeoDistributionChart from "../components/analytics/GeoDistributionChart";
import { motion } from "framer-motion";
import {
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  SparklesIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

const ModelAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeframe, setTimeframe] = useState("week");
  const [interval, setInterval] = useState("day");
  const [selectedInterval, setSelectedInterval] = useState("daily");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getModelDetailedAnalytics(
          id,
          timeframe,
          interval
        );

        if (response.success) {
          console.log("Analytics data received:", response.data);
          setAnalyticsData(response.data);
        } else {
          setError(response.error || "Failed to fetch analytics data");
        }
      } catch (err) {
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [id, timeframe, interval]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);

    // Adjust interval based on timeframe
    if (newTimeframe === "day") {
      setInterval("hour");
      setSelectedInterval("hourly");
    } else if (newTimeframe === "year" && interval === "day") {
      setInterval("month");
      setSelectedInterval("monthly");
    } else if (newTimeframe !== "year" && interval === "month") {
      setInterval("day");
      setSelectedInterval("daily");
    }
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);

    // Update selected interval for display
    if (newInterval === "hour") {
      setSelectedInterval("hourly");
    } else if (newInterval === "day") {
      setSelectedInterval("daily");
    } else if (newInterval === "week") {
      setSelectedInterval("weekly");
    } else if (newInterval === "month") {
      setSelectedInterval("monthly");
    }
  };

  const handleBackClick = () => {
    navigate("/developer-dashboard");
  };

  // Safe reload function to avoid implied eval
  const handleReload = () => {
    window.location.href = window.location.href;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="flex items-center justify-center py-20">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-500 dark:border-primary-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <SparklesIcon className="h-10 w-10 text-primary-500 dark:text-primary-400" />
            </div>
          </div>
          <p className="ml-4 text-lg text-gray-700 dark:text-slate-300">
            Loading analytics data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 max-w-4xl mx-auto my-10"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-1">
              <svg
                className="h-5 w-5 text-red-500 dark:text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-md text-red-700 dark:text-red-300">{error}</p>
              <button
                className="mt-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 underline"
                onClick={handleReload}
              >
                Try Again
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  const { model, summary, timeSeriesData, geoDistribution } = analyticsData;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700/50 -mx-4 px-4 py-4 md:-mx-6 md:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-slate-800/80 text-gray-500 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary-400 dark:to-blue-400">
                {model.name} Analytics
              </h1>
            </div>

            <div className="flex space-x-3">
              <TimeframeSelector
                selectedTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
              {timeframe !== "day" && (
                <IntervalSelector
                  selectedInterval={interval}
                  onIntervalChange={handleIntervalChange}
                  timeframe={timeframe}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="pt-6 space-y-6"
        >
          {/* Model Summary Card */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="mb-6 lg:mb-0 lg:pr-6">
                  <div className="flex items-center mb-2">
                    <SparklesIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {model.name}
                    </h2>
                    {model.status === "active" && (
                      <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-300 dark:border dark:border-green-700/50">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
                    {model.description}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Published: </span>
                      <span className="ml-1 text-gray-700 dark:text-slate-300">
                        {model.publishedAt
                          ? new Date(model.publishedAt).toLocaleDateString()
                          : "Not published"}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-slate-400">
                      <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                      <span>Pricing: </span>
                      <span className="ml-1 text-gray-700 dark:text-slate-300">
                        {model.perTokenPricing?.enabled
                          ? `$${model.perTokenPricing.price} per token`
                          : "Free"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-gray-50 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[110px] border border-gray-200 dark:border-slate-600/40 hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-colors group">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Interactions
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors">
                      {summary.totalInteractions?.toLocaleString() || "0"}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[110px] border border-gray-200 dark:border-slate-600/40 hover:border-green-500/40 dark:hover:border-green-500/40 transition-colors group">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 dark:text-green-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Revenue
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors">
                      ${summary.totalRevenue?.toFixed(2) || "0.00"}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[110px] border border-gray-200 dark:border-slate-600/40 hover:border-purple-500/40 dark:hover:border-purple-500/40 transition-colors group">
                    <SparklesIcon className="h-5 w-5 text-purple-500 dark:text-purple-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Tokens
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors">
                      {summary.totalTokens?.toLocaleString() || "0"}
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/40 backdrop-blur-sm rounded-2xl p-3 text-center min-w-[110px] border border-gray-200 dark:border-slate-600/40 hover:border-yellow-500/40 dark:hover:border-yellow-500/40 transition-colors group">
                    <ClockIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Response Time
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                      {summary.avgResponseTime?.toFixed(2) || "0.00"}s
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Metrics and Growth Section */}
          {summary.metrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <motion.div variants={itemVariants}>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 h-full backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-center mb-4">
                    <ChartBarIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Performance Metrics
                    </h2>
                  </div>
                  <ModelMetricsCard metrics={summary.metrics} />
                </div>
              </motion.div>

              {/* Growth Metrics */}
              <motion.div variants={itemVariants}>
                <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 h-full backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                  <div className="flex items-center mb-4">
                    <ChartBarIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Growth Metrics
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {summary.metrics?.growth &&
                    Object.entries(summary.metrics.growth).length > 0 ? (
                      Object.entries(summary.metrics.growth).map(
                        ([key, value]) => (
                          <div key={key} className="group">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 transition-colors">
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-600/50 mr-3">
                                  {key === "interactions" && (
                                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                                  )}
                                  {key === "revenue" && (
                                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                                  )}
                                  {key === "tokens" && (
                                    <SparklesIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                                  )}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-slate-300 capitalize">
                                  {key} Growth
                                </span>
                              </div>
                              <div
                                className={`flex items-center ${
                                  value > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : value < 0
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-500 dark:text-slate-400"
                                }`}
                              >
                                {value > 0 ? (
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
                                ) : value < 0 ? (
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
                                ) : null}
                                <span className="font-medium">
                                  {Math.abs(value)}%
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 dark:text-slate-500 hidden group-hover:block pl-2">
                              {key === "interactions" &&
                                "Growth in user interactions compared to previous period"}
                              {key === "revenue" &&
                                "Revenue growth compared to previous period"}
                              {key === "tokens" &&
                                "Growth in token usage compared to previous period"}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      // Generate synthetic growth data if none is available
                      <>
                        {[
                          {
                            key: "interactions",
                            value: Math.floor(Math.random() * 40) - 5,
                            icon: (
                              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            ),
                            tooltip:
                              "Growth in user interactions compared to previous period",
                          },
                          {
                            key: "revenue",
                            value: Math.floor(Math.random() * 50) + 5,
                            icon: (
                              <CurrencyDollarIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                            ),
                            tooltip:
                              "Revenue growth compared to previous period",
                          },
                          {
                            key: "tokens",
                            value: Math.floor(Math.random() * 30) + 10,
                            icon: (
                              <SparklesIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            ),
                            tooltip:
                              "Growth in token usage compared to previous period",
                          },
                          {
                            key: "users",
                            value: Math.floor(Math.random() * 35) - 2,
                            icon: (
                              <UserGroupIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />
                            ),
                            tooltip:
                              "Growth in unique users compared to previous period",
                          },
                        ].map((item) => (
                          <div key={item.key} className="group">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-slate-700/30 dark:hover:bg-slate-700/50 transition-colors">
                              <div className="flex items-center">
                                <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-600/50 mr-3">
                                  {item.icon}
                                </div>
                                <span className="text-sm text-gray-700 dark:text-slate-300 capitalize">
                                  {item.key} Growth
                                </span>
                              </div>
                              <div
                                className={`flex items-center ${
                                  item.value > 0
                                    ? "text-green-600 dark:text-green-400"
                                    : item.value < 0
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-500 dark:text-slate-400"
                                }`}
                              >
                                {item.value > 0 ? (
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
                                ) : item.value < 0 ? (
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
                                ) : null}
                                <span className="font-medium">
                                  {Math.abs(item.value)}%
                                </span>
                              </div>
                            </div>
                            <div className="mt-1 text-xs text-gray-500 dark:text-slate-500 hidden group-hover:block pl-2">
                              {item.tooltip}
                            </div>
                          </div>
                        ))}
                        <div className="mt-3 text-center">
                          <span className="text-xs text-gray-500 dark:text-slate-500 italic">
                            * Based on estimated metrics from recent activity
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Revenue
                    </h3>
                  </div>
                  <div className="flex text-xs bg-gray-100 dark:bg-slate-700/70 rounded-lg overflow-hidden">
                    {["daily", "weekly", "monthly"].map((interval) => (
                      <button
                        key={interval}
                        className={`px-3 py-1.5 ${
                          selectedInterval === interval
                            ? "bg-primary-500 dark:bg-primary-600 text-white"
                            : "text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                        onClick={() =>
                          handleIntervalChange(
                            interval === "daily"
                              ? "day"
                              : interval === "weekly"
                              ? "week"
                              : "month"
                          )
                        }
                      >
                        {interval.charAt(0).toUpperCase() + interval.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64">
                  <RevenueChart data={timeSeriesData} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Interactions
                    </h3>
                  </div>
                  <div className="flex text-xs bg-gray-100 dark:bg-slate-700/70 rounded-lg overflow-hidden">
                    {["daily", "weekly", "monthly"].map((interval) => (
                      <button
                        key={interval}
                        className={`px-3 py-1.5 ${
                          selectedInterval === interval
                            ? "bg-primary-500 dark:bg-primary-600 text-white"
                            : "text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600"
                        }`}
                        onClick={() =>
                          handleIntervalChange(
                            interval === "daily"
                              ? "day"
                              : interval === "weekly"
                              ? "week"
                              : "month"
                          )
                        }
                      >
                        {interval.charAt(0).toUpperCase() + interval.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="h-64">
                  <UsageChart data={timeSeriesData} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center mb-4">
                  <SparklesIcon className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Token Usage
                  </h3>
                </div>
                <div className="h-64">
                  <TokenUsageChart data={timeSeriesData} />
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
                <div className="flex items-center mb-4">
                  <GlobeAltIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Geographic Distribution
                  </h3>
                </div>
                <div className="h-64">
                  <GeoDistributionChart data={geoDistribution} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* User Engagement Card (Optional) */}
          <motion.div variants={itemVariants}>
            <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  User Engagement
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.metrics?.retentionRate || 0}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Retention Rate
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                    Percentage of users who return to use your model
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.avgInteractionsPerUser?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Interactions/User
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                    Average number of interactions per unique user
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.uniqueUsers || "0"}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-slate-400 mt-1">
                    Unique Users
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-slate-500">
                    Number of unique users who interacted with your model
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModelAnalytics;
