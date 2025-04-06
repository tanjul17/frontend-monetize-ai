import React from "react";
import { ClockIcon } from "@heroicons/react/24/outline";

const IntervalSelector = ({
  selectedInterval,
  onIntervalChange,
  timeframe,
}) => {
  // Define intervals based on timeframe
  const getIntervals = () => {
    if (timeframe === "day") {
      return [{ value: "hour", label: "Hour" }];
    } else if (timeframe === "year") {
      return [
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ];
    } else {
      return [
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
      ];
    }
  };

  const intervals = getIntervals();

  if (intervals.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center">
      <ClockIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
      <div
        className="inline-flex rounded-xl shadow-sm overflow-hidden bg-gray-100/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700/50"
        role="group"
      >
        {intervals.map((interval, index) => (
          <button
            key={interval.value}
            type="button"
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedInterval === interval.value
                ? "bg-white dark:bg-primary-600/30 text-primary-600 dark:text-primary-400 border-r border-l border-gray-300 dark:border-primary-500/30"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700/50"
            }`}
            onClick={() => onIntervalChange(interval.value)}
          >
            {interval.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default IntervalSelector;
