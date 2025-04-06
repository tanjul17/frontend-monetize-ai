import React from "react";
import { motion } from "framer-motion";

const SearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search models...",
  className = "",
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className={`relative flex-1 max-w-xl ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400 dark:text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="block w-full py-2.5 pl-10 pr-3 text-sm bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700/60 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400/70 focus:border-transparent shadow-sm dark:shadow-slate-900/30 transition-all duration-200"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onSearch}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <span className="text-xs font-medium bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded-md">
            Enter
          </span>
        </motion.button>
      </div>
    </div>
  );
};

export default SearchBar;
