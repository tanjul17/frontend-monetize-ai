import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTokens } from "../contexts/TokenContext";
import { Link } from "react-router-dom";
import { getDashboardAnalytics } from "../services/tokenService";
import { motion } from "framer-motion";
import {
  ChartPieIcon,
  ClockIcon,
  CreditCardIcon,
  SparklesIcon,
  ArrowsRightLeftIcon,
  CubeTransparentIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  UserCircleIcon,
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

// Custom sparkline component (simplified)
const SparkLine = ({ data = [5, 10, 5, 20, 8, 15, 5], color = "#3B82F6" }) => {
  const max = Math.max(...data);
  const points = data
    .map(
      (d, i) => `${(i / (data.length - 1)) * 100}% ${100 - (d / max) * 100}%`
    )
    .join(" ");

  return (
    <div className="w-full h-8">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { tokenBalance } = useTokens();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getDashboardAnalytics();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("An error occurred while loading your dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto"
      >
        {/* Header with greeting */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
              {getGreeting()},{" "}
              {currentUser?.profile?.name?.split(" ")[0] || "User"} 👋
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-2 md:mt-0 text-sm text-slate-500 dark:text-slate-400"
          >
            Dashboard Overview •{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </motion.div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-600 dark:border-primary-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <SparklesIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className="ml-4 text-lg text-slate-600 dark:text-slate-300">
              Loading your dashboard...
            </p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-100 dark:border-red-800/50 text-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {/* Token Balance Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="relative overflow-hidden rounded-xl shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500"></div>
              <div className="absolute inset-0 bg-pattern opacity-5"></div>
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 rounded-full bg-white dark:bg-white opacity-10 blur-3xl"></div>

              <div className="relative p-6 md:p-8 text-white">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl mr-4">
                      <CreditCardIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-1">
                        Token Balance
                      </h2>
                      <p className="text-blue-100 dark:text-blue-200">
                        Available for AI model interactions
                      </p>
                    </div>
                  </div>

                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.6,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className="text-3xl md:text-4xl xl:text-5xl font-bold flex items-center"
                  >
                    <SparklesIcon className="h-8 w-8 mr-2 text-yellow-300" />
                    {tokenBalance !== null
                      ? tokenBalance.toLocaleString()
                      : (dashboardData?.currentBalance || 0).toLocaleString()}
                  </motion.div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 pt-4 border-t border-white/20">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <ArrowsRightLeftIcon className="h-5 w-5 mr-2 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      Total Used: {dashboardData?.totalUsed.toLocaleString()}{" "}
                      tokens
                    </span>
                  </div>

                  <div className="flex items-center group relative">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-center">
                      This is the average cost per interaction with AI models
                    </div>
                    <CubeTransparentIcon className="h-5 w-5 mr-2 text-blue-200" />
                    <span className="text-sm text-blue-100">
                      Cost per chat: 500 tokens
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/token-history"
                      className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-medium transition-all duration-200"
                    >
                      View Full History
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 ml-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* User Stats */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>

                <div className="relative p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                    <ChartPieIcon className="h-5 w-5 mr-2 text-primary-500" />
                    Your Stats
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-slate-100/80 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200/50 dark:border-slate-600/30 flex items-start"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-3">
                        <CubeTransparentIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Total Models Used
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {dashboardData?.totalModelsInteracted || 0}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-slate-100/80 dark:bg-slate-700/50 p-5 rounded-xl border border-slate-200/50 dark:border-slate-600/30 flex items-start"
                    >
                      <div className="bg-violet-100 dark:bg-violet-900/30 p-3 rounded-lg mr-3">
                        <ClockIcon className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Total Interactions
                        </p>
                        <p className="text-2xl font-bold text-slate-800 dark:text-white">
                          {dashboardData?.totalInteractions || 0}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Activity Trend
                    </p>
                    <SparkLine
                      data={[5, 15, 10, 25, 20, 30, 22]}
                      color="#6366f1"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Most Used Models */}
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative rounded-xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>

                <div className="relative p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                    <SparklesIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Most Used Models
                  </h3>

                  {dashboardData?.mostUsedModels?.length > 0 ? (
                    <ul className="space-y-3">
                      {dashboardData.mostUsedModels.map((model, index) => (
                        <motion.li
                          key={model.modelId?._id || index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                          className="p-3 bg-slate-100/80 dark:bg-slate-700/50 rounded-lg border border-slate-200/50 dark:border-slate-600/30 flex justify-between items-center"
                        >
                          <div className="flex items-center">
                            {model.modelId?.icon ? (
                              <img
                                src={model.modelId.icon}
                                alt="Model icon"
                                className="h-8 w-8 mr-3 rounded-md"
                              />
                            ) : (
                              <div className="h-8 w-8 mr-3 bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center rounded-md">
                                <CubeTransparentIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                              </div>
                            )}
                            <span className="font-medium text-slate-800 dark:text-white">
                              {model.modelId?.name || "Unknown Model"}
                            </span>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="text-sm bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full font-medium"
                          >
                            {model.interactions} uses
                          </motion.span>
                        </motion.li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 bg-slate-100/80 dark:bg-slate-700/30 rounded-xl">
                      <CubeTransparentIcon className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 italic">
                        You haven't used any models yet.
                      </p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4"
                      >
                        <Link
                          to="/marketplace"
                          className="text-sm text-primary-600 dark:text-primary-400 font-medium"
                        >
                          Explore Models →
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Recent Transactions */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>

              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 flex items-center">
                  <ArrowsRightLeftIcon className="h-5 w-5 mr-2 text-emerald-500" />
                  Recent Transactions
                </h3>

                {dashboardData?.recentTransactions?.length > 0 ? (
                  <div className="rounded-xl overflow-hidden border border-slate-200/50 dark:border-slate-600/30">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/30">
                      <thead className="bg-slate-100/80 dark:bg-slate-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Action
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/30">
                        {dashboardData.recentTransactions.map(
                          (transaction, index) => (
                            <motion.tr
                              key={index}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <motion.span
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.1 + index * 0.05 }}
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    transaction.action === "credit"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800/30"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800/30"
                                  }`}
                                >
                                  {transaction.action === "credit" ? (
                                    <svg
                                      className="mr-1 h-3 w-3"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      className="mr-1 h-3 w-3"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  {transaction.action === "credit"
                                    ? "CREDIT"
                                    : "DEBIT"}
                                </motion.span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-800 dark:text-slate-200 font-medium">
                                {transaction.amount.toLocaleString()} tokens
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-600 dark:text-slate-300">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400 text-sm">
                                {new Date(
                                  transaction.timestamp
                                ).toLocaleString()}
                              </td>
                            </motion.tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-100/80 dark:bg-slate-700/30 rounded-xl">
                    <ArrowsRightLeftIcon className="h-12 w-12 mx-auto text-slate-400 dark:text-slate-500 mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 italic">
                      No recent transactions to display.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Quick Navigation */}
            <motion.div
              variants={itemVariants}
              className="relative rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>

              <div className="relative p-6">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 flex items-center">
                  <SparklesIcon className="h-5 w-5 mr-2 text-blue-500" />
                  Quick Navigation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {currentUser?.role === "developer" && (
                    <>
                      <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/models"
                          className="flex flex-col items-center justify-center p-5 h-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <CubeTransparentIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className="mt-3 font-medium text-slate-800 dark:text-white text-center">
                            Manage Models
                          </span>
                        </Link>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -5, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link
                          to="/developer-dashboard"
                          className="flex flex-col items-center justify-center p-5 h-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-green-100 dark:border-green-900/30 shadow-sm hover:shadow-md transition-all group"
                        >
                          <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <ChartBarIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="mt-3 font-medium text-slate-800 dark:text-white text-center">
                            Analytics Dashboard
                          </span>
                        </Link>
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/marketplace"
                      className="flex flex-col items-center justify-center p-5 h-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-100 dark:border-purple-900/30 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <ShoppingBagIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="mt-3 font-medium text-slate-800 dark:text-white text-center">
                        Browse Marketplace
                      </span>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to={
                        currentUser?.role === "developer"
                          ? "/dev-profile"
                          : "/user-profile"
                      }
                      className="flex flex-col items-center justify-center p-5 h-full bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-100 dark:border-slate-700/30 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="bg-slate-100 dark:bg-slate-700/50 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <UserCircleIcon className="h-8 w-8 text-slate-600 dark:text-slate-400" />
                      </div>
                      <span className="mt-3 font-medium text-slate-800 dark:text-white text-center">
                        View Profile
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;
