import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const ModelPerformanceList = ({ models, onModelClick }) => {
  const [sortField, setSortField] = useState("timeframeInteractions");
  const [sortDirection, setSortDirection] = useState("desc");

  // Animation variants
  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    hover: {
      y: -2,
      transition: { duration: 0.2 },
    },
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const sortedModels = [...models].sort((a, b) => {
    let aValue, bValue;

    if (sortField === "name") {
      aValue = a.name;
      bValue = b.name;
    } else if (sortField === "status") {
      aValue = a.status;
      bValue = b.status;
    } else if (sortField === "publishedAt") {
      aValue = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      bValue = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    } else {
      aValue = (a.stats && a.stats[sortField]) || 0;
      bValue = (b.stats && b.stats[sortField]) || 0;
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <ChevronUpIcon className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }

    return sortDirection === "asc" ? (
      <ChevronUpIcon className="h-4 w-4 text-indigo-500" />
    ) : (
      <ChevronDownIcon className="h-4 w-4 text-indigo-500" />
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="py-1 px-2.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
              Published
            </span>
          </span>
        );
      case "draft":
        return (
          <span className="py-1 px-2.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
            Draft
          </span>
        );
      case "pending-approval":
        return (
          <span className="py-1 px-2.5 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
            Pending
          </span>
        );
      default:
        return (
          <span className="py-1 px-2.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  // Generates a simple sparkline-style mini chart
  const MiniSparkline = ({ data = null, color = "indigo" }) => {
    // If no data, generate random values
    const values = data || Array.from({ length: 10 }, () => Math.random());

    return (
      <div className="flex h-6 items-end space-x-0.5 w-16">
        {values.map((value, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${value * 100}%` }}
            transition={{ delay: i * 0.03, duration: 0.5 }}
            className={`w-full max-w-[2px] rounded-sm bg-${color}-500 dark:bg-${color}-400 opacity-60`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
      <div className="overflow-x-auto">
        <motion.table
          className="min-w-full divide-y divide-slate-200 dark:divide-slate-700/30"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <thead className="bg-slate-50/80 dark:bg-slate-800/80">
            <tr>
              <th
                scope="col"
                className="group px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center space-x-1">
                  <span>Model Name</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center space-x-1">
                  <span>Status</span>
                  {getSortIcon("status")}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("publishedAt")}
              >
                <div className="flex items-center space-x-1">
                  <span>Published</span>
                  {getSortIcon("publishedAt")}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("timeframeInteractions")}
              >
                <div className="flex items-center space-x-1">
                  <span>Interactions</span>
                  {getSortIcon("timeframeInteractions")}
                </div>
              </th>
              <th
                scope="col"
                className="group px-6 py-3.5 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("timeframeRevenue")}
              >
                <div className="flex items-center space-x-1">
                  <span>Revenue</span>
                  {getSortIcon("timeframeRevenue")}
                </div>
              </th>
              <th scope="col" className="relative px-6 py-3.5">
                <span className="sr-only">Details</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-slate-200/70 dark:divide-slate-700/30">
            <AnimatePresence>
              {sortedModels.map((model, index) => (
                <motion.tr
                  key={model.id || index}
                  variants={rowVariants}
                  whileHover="hover"
                  className="cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                  onClick={() => onModelClick(model.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {model.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[220px] truncate">
                      {model.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(model.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {formatDate(model.publishedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatNumber(
                          (model.stats && model.stats.timeframeInteractions) ||
                            0
                        )}
                      </div>
                      <MiniSparkline color="blue" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatRevenue(
                          (model.stats && model.stats.timeframeRevenue) || 0
                        )}
                      </div>
                      <MiniSparkline color="green" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onModelClick(model.id);
                      }}
                      className="inline-flex items-center px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-xs font-medium rounded-lg text-indigo-600 dark:text-indigo-400 bg-white/80 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <ChartBarIcon className="h-3.5 w-3.5 mr-1" />
                      Details
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>

            {sortedModels.length === 0 && (
              <motion.tr variants={rowVariants}>
                <td colSpan="6" className="px-6 py-10 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-3 mb-3">
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
                    <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                      No models to display for the selected timeframe. Try
                      changing the timeframe or create a new model.
                    </p>
                  </div>
                </td>
              </motion.tr>
            )}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default ModelPerformanceList;
