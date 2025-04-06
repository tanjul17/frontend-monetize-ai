import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getTokenHistory,
  getModelInteractions,
} from "../services/tokenService";
import { motion } from "framer-motion";

const TokenHistory = () => {
  const [tokenHistory, setTokenHistory] = useState([]);
  const [modelInteractions, setModelInteractions] = useState([]);
  const [activeTab, setActiveTab] = useState("history");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  // Animation variants
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === "history") {
          const response = await getTokenHistory();
          if (response.success) {
            setTokenHistory(response.data);
          } else {
            setError("Failed to load token history");
          }
        } else {
          const response = await getModelInteractions();
          if (response.success) {
            setModelInteractions(response.data);
          } else {
            setError("Failed to load model interactions");
          }
        }
      } catch (err) {
        console.error(`Error fetching ${activeTab} data:`, err);
        setError(`An error occurred while loading ${activeTab} data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleTransactionSelect = (transaction) => {
    setSelectedTransaction(
      transaction === selectedTransaction ? null : transaction
    );
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const sortedHistory = [...tokenHistory].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-slate-900 shadow-lg dark:shadow-slate-900/30 rounded-xl overflow-hidden"
    >
      <div className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800/30 dark:to-slate-700/30 opacity-30"></div>

        <div className="relative p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <motion.h1
              variants={itemVariants}
              className="text-2xl font-bold text-slate-900 dark:text-white flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-primary-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Token History
            </motion.h1>
            <motion.div variants={itemVariants} className="flex space-x-3">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center text-sm font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                Filter
              </button>
              <button
                onClick={toggleSortOrder}
                className="flex items-center text-sm font-medium px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      sortOrder === "desc"
                        ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        : "M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4"
                    }
                  />
                </svg>
                {sortOrder === "desc" ? "Newest First" : "Oldest First"}
              </button>
              <Link
                to="/dashboard"
                className="flex items-center text-sm font-medium px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </Link>
            </motion.div>
          </div>

          {/* Filter panel */}
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isFilterOpen ? "auto" : 0,
              opacity: isFilterOpen ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mb-6"
          >
            <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date Range
                  </label>
                  <select className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-sm">
                    <option>All time</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Transaction Type
                  </label>
                  <select className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-sm">
                    <option>All transactions</option>
                    <option>Credits only</option>
                    <option>Debits only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Model
                  </label>
                  <select className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm py-2 px-3 text-sm">
                    <option>All models</option>
                    <option>TextEnhancer</option>
                    <option>Devendra Sahu</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="border-b border-slate-200 dark:border-slate-700/60 mb-6"
          >
            <nav className="-mb-px flex" aria-label="Tabs">
              <button
                onClick={() => handleTabChange("history")}
                className={`${
                  activeTab === "history"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm mr-8 transition-colors`}
              >
                Transaction History
              </button>
              <button
                onClick={() => handleTabChange("models")}
                className={`${
                  activeTab === "models"
                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 hover:border-slate-300"
                } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                Model Interactions
              </button>
            </nav>
          </motion.div>

          {loading ? (
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-12 h-12 rounded-full border-4 border-primary-100 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 animate-spin"></div>
              <p className="mt-4 text-slate-500 dark:text-slate-400">
                Loading your data...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              variants={itemVariants}
              className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30"
            >
              <div className="flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-red-400 dark:text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            </motion.div>
          ) : (
            <>
              {activeTab === "history" ? (
                // Token Transaction History
                <>
                  {sortedHistory.length > 0 ? (
                    <motion.div
                      variants={itemVariants}
                      className="overflow-x-auto"
                    >
                      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/60">
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
                              Model
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800/30 divide-y divide-slate-200 dark:divide-slate-700/60">
                          {sortedHistory.map((transaction, index) => (
                            <motion.tr
                              key={index}
                              className={`hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors ${
                                selectedTransaction === transaction
                                  ? "bg-primary-50 dark:bg-primary-900/20"
                                  : ""
                              }`}
                              onClick={() =>
                                handleTransactionSelect(transaction)
                              }
                              whileHover={{ scale: 1.005 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 35,
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    transaction.action === "credit"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  }`}
                                >
                                  {transaction.action === "credit"
                                    ? "CREDIT"
                                    : "DEBIT"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900 dark:text-white">
                                {transaction.amount.toLocaleString()} tokens
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {transaction.description}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {transaction.modelId ? (
                                  <Link
                                    to={`/marketplace/${transaction.modelId}`}
                                    className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    View Model
                                  </Link>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {new Date(
                                  transaction.timestamp
                                ).toLocaleString()}
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-slate-300 dark:text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                        No transaction history found
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Your token transactions will appear here
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                // Model Interactions
                <>
                  {modelInteractions.length > 0 ? (
                    <motion.div
                      variants={containerVariants}
                      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                      {modelInteractions.map((model, index) => (
                        <motion.div
                          key={model.modelId?._id || index}
                          variants={itemVariants}
                          whileHover={{ y: -5, transition: { duration: 0.2 } }}
                          className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              {model.modelId?.icon ? (
                                <img
                                  src={model.modelId.icon}
                                  alt={model.modelId.name}
                                  className="h-10 w-10 mr-3 rounded-full"
                                />
                              ) : (
                                <div className="h-10 w-10 mr-3 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                  <span className="text-primary-600 dark:text-primary-400 text-sm">
                                    AI
                                  </span>
                                </div>
                              )}
                              <div>
                                <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                                  {model.modelId?.name || "Unknown Model"}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                  {model.modelId?.description ||
                                    "No description"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                              <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">
                                Interactions
                              </p>
                              <p className="text-xl font-semibold text-blue-900 dark:text-blue-300">
                                {model.interactions.toLocaleString()}
                              </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                              <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                                Tokens Used
                              </p>
                              <p className="text-xl font-semibold text-green-900 dark:text-green-300">
                                {model.tokensUsed.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400">
                            <span>
                              Last used:{" "}
                              {new Date(
                                model.lastInteraction
                              ).toLocaleDateString()}
                            </span>
                            {model.modelId?._id && (
                              <Link
                                to={`/marketplace/${model.modelId._id}`}
                                className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium"
                              >
                                View Model
                              </Link>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      variants={itemVariants}
                      className="flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-lg"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 text-slate-300 dark:text-slate-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">
                        No model interactions found
                      </p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
                        Start using AI models to see your interactions
                      </p>
                    </motion.div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TokenHistory;
