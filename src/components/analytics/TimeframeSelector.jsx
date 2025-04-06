import React from "react";
import { motion } from "framer-motion";
import { CalendarIcon } from "@heroicons/react/24/outline";

const TimeframeSelector = ({ selectedTimeframe, onTimeframeChange }) => {
  const timeframes = [
    { value: "day", label: "Day" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "year", label: "Year" },
  ];

  // Find the index of the currently selected timeframe
  const selectedIndex = timeframes.findIndex(
    (t) => t.value === selectedTimeframe
  );

  return (
    <div className="flex items-center">
      <CalendarIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
      <div className="relative">
        {/* Mobile dropdown for small screens */}
        <div className="md:hidden">
          <select
            value={selectedTimeframe}
            onChange={(e) => onTimeframeChange(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg transition-colors border border-gray-300 dark:border-slate-700"
          >
            {timeframes.map((timeframe) => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop tabs with sliding indicator */}
        <div className="hidden md:flex relative rounded-xl shadow-sm bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden p-1 border border-gray-200 dark:border-slate-700/50">
          {/* Background sliding indicator */}
          <motion.div
            className="absolute inset-y-1 rounded-lg bg-white dark:bg-primary-600/30 shadow-sm border border-gray-300 dark:border-primary-500/30"
            initial={false}
            animate={{
              x: `calc(${selectedIndex} * 100% / ${timeframes.length})`,
              width: `calc(100% / ${timeframes.length})`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Buttons */}
          {timeframes.map((timeframe, index) => (
            <motion.button
              key={timeframe.value}
              whileHover={{ y: -1 }}
              whileTap={{ y: 1 }}
              type="button"
              className={`relative z-10 px-5 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                selectedTimeframe === timeframe.value
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              }`}
              onClick={() => onTimeframeChange(timeframe.value)}
              style={{ width: `calc(100% / ${timeframes.length})` }}
            >
              {timeframe.label}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeframeSelector;
