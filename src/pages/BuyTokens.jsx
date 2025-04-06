import React from "react";
import { Link } from "react-router-dom";
import { useTokens } from "../contexts/TokenContext";
import { motion } from "framer-motion";

const BuyTokens = () => {
  const { tokenBalance } = useTokens();

  return (
    <motion.div
      className="max-w-4xl mx-auto bg-white dark:bg-dark-900 shadow rounded-lg p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Buy More Tokens
        </h1>
        <Link
          to="/dashboard"
          className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="text-center py-12">
        <div className="mb-6 text-7xl">💳</div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Token Balance:{" "}
          {tokenBalance !== null ? tokenBalance.toLocaleString() : "Loading..."}{" "}
          tokens
        </h2>

        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          We currently provide 10,000 free tokens to developers. We're working
          on integrating Stripe so you can easily purchase more tokens. Thanks
          for your patience!
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
          <button
            disabled
            className="px-6 py-3 text-lg font-medium rounded-md bg-gray-200 text-gray-500 cursor-not-allowed relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gray-300 opacity-20"></div>
            <span className="relative z-10 flex items-center justify-center">
              <span>Coming Soon</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>

          <button className="px-6 py-3 text-lg font-medium rounded-md bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 border border-primary-300 dark:border-primary-700 transition duration-200">
            <span className="flex items-center justify-center">
              <span>Notify Me When Available</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </span>
          </button>
        </div>

        <div className="rounded-lg bg-gray-50 dark:bg-dark-800 p-6 max-w-xl mx-auto border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
            Token Pricing (Coming Soon)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-600 dark:text-gray-300">
            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900">
              <div className="font-bold text-xl">50K</div>
              <div>Basic Pack</div>
            </div>
            <div className="p-4 rounded-md border border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 transform scale-105">
              <div className="font-bold text-xl">200K</div>
              <div>Popular</div>
            </div>
            <div className="p-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-900">
              <div className="font-bold text-xl">500K</div>
              <div>Pro Pack</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Have questions about tokens?{" "}
        <Link
          to="/token-history"
          className="text-primary-600 hover:underline dark:text-primary-400"
        >
          View your token history
        </Link>{" "}
        or
        <Link
          to="/dashboard"
          className="text-primary-600 hover:underline dark:text-primary-400 ml-1"
        >
          contact support
        </Link>
        .
      </div>
    </motion.div>
  );
};

export default BuyTokens;
