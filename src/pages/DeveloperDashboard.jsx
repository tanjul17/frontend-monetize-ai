import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getDeveloperDashboardSummary } from "../services/analyticsService";
import DashboardSummary from "../components/analytics/DashboardSummary";
import ModelPerformanceList from "../components/analytics/ModelPerformanceList";
import TimeframeSelector from "../components/analytics/TimeframeSelector";
import { useAuth } from "../contexts/AuthContext";

// Icons
import {
  CalendarIcon,
  ArrowPathIcon,
  ChartBarIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

const DeveloperDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [timeframe, setTimeframe] = useState("week");

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getDeveloperDashboardSummary(timeframe);

        if (response.success) {
          console.log("Dashboard data received:", response.data);
          setDashboardData(response.data);
        } else if (response.data && response.data.modelsPerformance) {
          // Handle the case when the analytics service returns fake data
          console.log("Using fake dashboard data:", response);
          setDashboardData(response);
        } else {
          setError(response.error || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleModelClick = (modelId) => {
    navigate(`/model-analytics/${modelId}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-l-transparent border-r-transparent border-indigo-600 animate-spin"></div>
          <CubeTransparentIcon className="h-8 w-8 text-indigo-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
        <p className="text-indigo-600 ml-4 font-medium text-lg">
          Loading dashboard data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 border border-red-200 dark:border-red-800/30 shadow-md"
      >
        <div className="flex">
          <div className="flex-shrink-0 bg-red-100 dark:bg-red-900/30 rounded-full p-2">
            <svg
              className="h-6 w-6 text-red-500 dark:text-red-400"
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
          <div className="ml-4">
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
              Error Loading Dashboard
            </h3>
            <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
              onClick={() => window.location.reload()}
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Retry
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-purple-50/30 dark:from-indigo-900/10 dark:to-purple-900/10 -z-10"></div>

      {/* Main container with glass effect */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/70 dark:bg-slate-900/50 border border-white/50 dark:border-slate-800/50 shadow-lg"
      >
        <div className="p-8">
          {/* Header with greeting and timeframe selector */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <motion.div variants={itemVariants} className="flex items-center">
              <div className="mr-4 p-3 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 rounded-xl">
                <ChartBarIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                  {getGreeting()}, {currentUser?.name || "Developer"}
                </h2>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                  Analytics Dashboard
                </h1>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center">
              <TimeframeSelector
                selectedTimeframe={timeframe}
                onTimeframeChange={handleTimeframeChange}
              />
            </motion.div>
          </div>

          {dashboardData ? (
            <>
              <DashboardSummary summaryData={dashboardData} />

              <motion.div variants={itemVariants} className="mt-10">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                    Models Performance
                  </h2>
                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Data for selected timeframe</span>
                  </div>
                </div>
                <ModelPerformanceList
                  models={
                    dashboardData.modelsPerformance ||
                    dashboardData.models ||
                    []
                  }
                  onModelClick={handleModelClick}
                />
              </motion.div>
            </>
          ) : (
            <motion.div
              variants={itemVariants}
              className="p-6 border border-slate-200 dark:border-slate-700/50 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm text-slate-700 dark:text-slate-300"
            >
              <div className="flex flex-col items-center justify-center py-8">
                <div className="p-4 bg-slate-100 dark:bg-slate-700/30 rounded-full mb-4">
                  <svg
                    className="h-8 w-8 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No Dashboard Data</h3>
                <p className="text-center mb-6">
                  No data available for this timeframe. Try changing the
                  timeframe or refreshing the page.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh Dashboard
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeveloperDashboard;
