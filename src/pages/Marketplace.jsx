import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMarketplaceModels } from "../services/modelService";
import { motion, AnimatePresence } from "framer-motion";

// Icons
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  UserCircleIcon,
  SparklesIcon,
  TagIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";

const Marketplace = () => {
  const { currentUser: auth } = useAuth(); // Renamed to avoid the unused warning
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [error, setError] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("popular");
  const dropdownRef = useRef(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await getMarketplaceModels();
        const modelsData = response.data || [];
        setModels(modelsData);
        setFilteredModels(modelsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching marketplace models:", err);
        setError("Failed to load AI models. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Filter models when search query or category changes
  useEffect(() => {
    let result = [...models];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          (model.tags &&
            model.tags.some((tag) => tag.toLowerCase().includes(query)))
      );
    }

    // Filter by category
    if (selectedCategory !== "all" && selectedCategory) {
      result = result.filter(
        (model) => model.tags && model.tags.includes(selectedCategory)
      );
    }

    // Sort the models
    if (sortOrder === "popular") {
      result.sort(
        (a, b) => (b.stats?.usageCount || 0) - (a.stats?.usageCount || 0)
      );
    } else if (sortOrder === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (sortOrder === "price-low") {
      result.sort((a, b) => {
        const priceA = a.perTokenPricing?.enabled ? a.perTokenPricing.price : 0;
        const priceB = b.perTokenPricing?.enabled ? b.perTokenPricing.price : 0;
        return priceA - priceB;
      });
    } else if (sortOrder === "price-high") {
      result.sort((a, b) => {
        const priceA = a.perTokenPricing?.enabled ? a.perTokenPricing.price : 0;
        const priceB = b.perTokenPricing?.enabled ? b.perTokenPricing.price : 0;
        return priceB - priceA;
      });
    }

    setFilteredModels(result);
  }, [searchQuery, selectedCategory, models, sortOrder]);

  // Extract unique categories from models
  const categories = [
    "all",
    ...new Set(models.flatMap((model) => model.tags || []).filter(Boolean)),
  ];

  // Model card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.4,
        type: "spring",
        damping: 15,
      },
    }),
    hover: {
      y: -8,
      transition: { duration: 0.3, type: "spring", stiffness: 300 },
    },
  };

  // Fade in container animation
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

  // Format number with K/M suffixes
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-white to-gray-100 dark:from-slate-900 dark:to-slate-800 -z-10"></div>
      <div className="fixed inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/20 -z-10"></div>

      <div className="container mx-auto py-12 px-4 sm:px-6 relative z-10">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800/50 shadow-sm backdrop-blur-sm"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-4">
            AI Model Marketplace
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Discover and use powerful AI models created by developers. Find the
            perfect model for your needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row justify-between items-stretch space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow max-w-3xl">
              <div className="relative rounded-2xl overflow-hidden backdrop-blur-sm">
                <input
                  type="text"
                  placeholder="Search models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 items-stretch">
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="h-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm backdrop-blur-sm text-slate-700 dark:text-slate-200 font-medium flex items-center gap-2 hover:bg-white/90 dark:hover:bg-slate-700/90 transition-all"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                  <span>Sort By</span>
                </motion.button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-50 overflow-hidden backdrop-blur-sm">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setSortOrder("popular");
                          setShowDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOrder === "popular"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        Most Popular
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("newest");
                          setShowDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOrder === "newest"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        Newest First
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("price-low");
                          setShowDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOrder === "price-low"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => {
                          setSortOrder("price-high");
                          setShowDropdown(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          sortOrder === "price-high"
                            ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                            : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                        }`}
                      >
                        Price: High to Low
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative backdrop-blur-sm rounded-2xl overflow-hidden h-full">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="h-full px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-sm text-slate-700 dark:text-slate-200 appearance-none pr-10 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      className="bg-white dark:bg-slate-800"
                    >
                      {category === "all"
                        ? "All Categories"
                        : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <TagIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-indigo-200 dark:border-indigo-900/30"></div>
              <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <SparklesIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : filteredModels.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 px-6 text-center bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-6">
              <svg
                className="h-8 w-8 text-slate-500 dark:text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
              No models found
            </h3>
            <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search criteria or filter settings"
                : "No models are currently available in the marketplace"}
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredModels.map((model, index) => (
              <motion.div
                key={model._id || model.id || index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                <div className="relative flex flex-col h-full rounded-2xl overflow-hidden backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 shadow-lg transition-all duration-300 z-10">
                  <div className="p-6 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
                        {model.name}
                      </h3>

                      {/* New model badge - add conditionally */}
                      {model.isNew && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300">
                          <SparklesIcon className="h-3 w-3 mr-1" />
                          New
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
                      {model.description}
                    </p>

                    {model.owner?.profile?.name && (
                      <div className="flex items-center mb-4">
                        <div className="mr-2 h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                          {model.owner.profile.avatar ? (
                            <img
                              src={model.owner.profile.avatar}
                              alt="Creator"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Created by
                          </p>
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center">
                            {model.owner.profile.name}
                            {model.owner.profile.verified && (
                              <CheckBadgeIcon className="h-4 w-4 ml-1 text-indigo-600 dark:text-indigo-400" />
                            )}
                          </p>
                        </div>
                      </div>
                    )}

                    {model.tags && model.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {model.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 mt-auto">
                      <div className="relative overflow-hidden rounded-xl bg-slate-50/80 dark:bg-slate-700/50 p-3 backdrop-blur-sm border border-slate-100 dark:border-slate-600/20 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Usage
                        </p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          <AnimatePresence mode="wait">
                            <motion.span
                              key={model._id || model.id || index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3 }}
                            >
                              {formatNumber(model.stats?.usageCount || 0)}
                            </motion.span>
                          </AnimatePresence>
                        </p>
                      </div>
                      <div className="relative overflow-hidden rounded-xl bg-slate-50/80 dark:bg-slate-700/50 p-3 backdrop-blur-sm border border-slate-100 dark:border-slate-600/20 text-center">
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                          Pricing
                        </p>
                        <div className="font-semibold text-slate-700 dark:text-slate-200">
                          {model.perTokenPricing?.enabled ? (
                            <div className="flex flex-col">
                              <span className="text-sm">
                                From{" "}
                                <span className="text-indigo-600 dark:text-indigo-400">
                                  ${model.perTokenPricing.price}
                                </span>
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                per token
                              </span>
                            </div>
                          ) : (
                            <span>Free</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-indigo-900/30 dark:to-purple-900/30 border-t border-slate-200/50 dark:border-slate-700/50">
                    <Link
                      to={`/marketplace/${model._id || model.id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all group"
                    >
                      Try This Model
                      <motion.span
                        className="ml-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRightIcon className="h-4 w-4" />
                      </motion.span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Help tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="fixed bottom-6 right-6 z-20"
        >
          <div className="group relative">
            <button className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <div className="opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 absolute bottom-full right-0 mb-3 w-72 rounded-xl bg-white dark:bg-slate-800 shadow-xl p-4 text-sm text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 backdrop-blur-sm">
              <div className="font-semibold text-slate-900 dark:text-white mb-2">
                About AI Model Pricing
              </div>
              <p className="mb-2">
                AI models are typically priced per token. A token is roughly 4
                characters or 3/4 of a word.
              </p>
              <p>
                Free models have no charge, while paid models charge based on
                tokens processed during use.
              </p>
              <div className="absolute bottom-[-6px] right-4 w-3 h-3 rotate-45 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700/50"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Marketplace;
