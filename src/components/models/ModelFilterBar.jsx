import React from "react";
import { motion } from "framer-motion";
import SearchBar from "../common/SearchBar";
import Select from "../common/Select";
import Button from "../common/Button";

const ModelFilterBar = ({
  searchQuery = "",
  onSearchChange,
  onSearch,
  categoryOptions = [],
  selectedCategory = "all",
  onCategoryChange,
  sortOptions = [],
  selectedSort = "popular",
  onSortChange,
  onClearFilters,
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div
      className="w-full mb-8 bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-slate-900/30 border border-gray-200 dark:border-slate-700/60 p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Search Bar */}
        <motion.div className="lg:col-span-5" variants={itemVariants}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={onSearch}
            placeholder="Search models by name, developer, or description..."
          />
        </motion.div>

        {/* Category Filter */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <Select
            value={selectedCategory}
            onChange={onCategoryChange}
            options={categoryOptions}
            placeholder="All Categories"
          />
        </motion.div>

        {/* Sort Options */}
        <motion.div className="lg:col-span-3" variants={itemVariants}>
          <Select
            value={selectedSort}
            onChange={onSortChange}
            options={sortOptions}
            placeholder="Sort by"
          />
        </motion.div>

        {/* Clear Filters Button */}
        <motion.div
          className="lg:col-span-1 flex justify-center"
          variants={itemVariants}
        >
          <Button
            onClick={onClearFilters}
            variant="secondary"
            size="md"
            className="w-full"
          >
            Clear
          </Button>
        </motion.div>
      </div>

      {/* Mobile optimized sticky search bar overlay that appears when scrolling down */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-30 pointer-events-none">
        <motion.div
          className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/50 rounded-xl border border-gray-200 dark:border-slate-700 p-3 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <SearchBar
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onSearch={onSearch}
            placeholder="Search models..."
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ModelFilterBar;
