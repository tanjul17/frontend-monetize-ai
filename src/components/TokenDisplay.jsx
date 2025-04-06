import React from "react";
import { useTokens } from "../contexts/TokenContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const TokenDisplay = () => {
  const { tokenBalance, loading } = useTokens();

  return (
    <div className="relative group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center rounded-xl px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-400/50 shadow-sm hover:shadow-md border border-gray-100 dark:border-dark-300/20 transition-all duration-300"
      >
        <div className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 dark:from-accent-blue/30 dark:to-accent-purple/30">
          <svg
            className="h-4 w-4 text-accent-blue dark:text-accent-purple"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.31 11.14C13.54 10.73 14.39 9.59 14.39 8.26C14.39 6.55 13 5.16 11.29 5.16C9.58 5.16 8.19 6.55 8.19 8.26H10.08C10.08 7.6 10.62 7.06 11.28 7.06C11.94 7.06 12.48 7.6 12.48 8.26C12.48 8.93 11.95 9.46 11.29 9.46C10.9 9.46 10.55 9.31 10.33 9.05L8.84 9.9C9.37 10.73 10.36 11.16 11.29 11.16C11.3 11.16 11.3 11.16 11.31 11.16V11.14H12.31ZM11.27 14.84C11.96 14.84 12.52 14.28 12.52 13.58C12.52 12.88 11.96 12.32 11.27 12.32C10.57 12.32 10.01 12.88 10.01 13.58C10.01 14.28 10.57 14.84 11.27 14.84Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-gray-800 dark:text-gray-100 font-medium">
          {loading ? (
            <div className="h-4 w-16 bg-gray-200 dark:bg-dark-300 animate-pulse rounded"></div>
          ) : (
            <>{tokenBalance?.toLocaleString() || 0} tokens</>
          )}
        </span>
      </motion.div>

      <div className="absolute right-0 top-full mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
        <Link to="/buy-tokens">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-dark-400 shadow-md rounded-lg px-3 py-2 text-xs border border-gray-100 dark:border-dark-500 whitespace-nowrap"
          >
            Buy more tokens
            <div className="absolute top-0 right-4 -mt-2 transform rotate-45 w-2 h-2 bg-white dark:bg-dark-400 border-t border-l border-gray-100 dark:border-dark-500"></div>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default TokenDisplay;
