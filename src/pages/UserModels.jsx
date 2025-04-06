import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { getPublishedModels } from "../services/userService";
import { motion } from "framer-motion";
import ModelList from "../components/models/ModelList";
import ModelFilterBar from "../components/models/ModelFilterBar";
import Button from "../components/common/Button";
import Card from "../components/common/Card";

const UserModels = () => {
  const { currentUser: auth } = useAuth();
  const { isDark: theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [error, setError] = useState(null);
  const [isAuthError, setIsAuthError] = useState(false);

  // Prepare category options for the filter
  const categoryOptions = categories.map((category) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
  }));

  // Sorting options
  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
  ];

  const fetchModels = async (filters = {}) => {
    setLoading(true);
    setError(null);
    setIsAuthError(false);

    try {
      const response = await getPublishedModels(filters);

      if (response && response.success) {
        // Sort models based on the selected sort option
        let sortedModels = [...(response.data || [])];

        if (selectedSort === "popular") {
          sortedModels.sort(
            (a, b) => (b.stats?.usageCount || 0) - (a.stats?.usageCount || 0)
          );
        } else if (selectedSort === "newest") {
          sortedModels.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
        } else if (selectedSort === "price-low") {
          sortedModels.sort((a, b) => {
            const priceA = a.perTokenPricing?.enabled
              ? a.perTokenPricing.price
              : 0;
            const priceB = b.perTokenPricing?.enabled
              ? b.perTokenPricing.price
              : 0;
            return priceA - priceB;
          });
        } else if (selectedSort === "price-high") {
          sortedModels.sort((a, b) => {
            const priceA = a.perTokenPricing?.enabled
              ? a.perTokenPricing.price
              : 0;
            const priceB = b.perTokenPricing?.enabled
              ? b.perTokenPricing.price
              : 0;
            return priceB - priceA;
          });
        }

        setModels(sortedModels);

        // Extract unique categories from models
        const uniqueCategories = ["all"];
        if (response.data && response.data.length > 0) {
          response.data.forEach((model) => {
            if (model.tags && Array.isArray(model.tags)) {
              model.tags.forEach((tag) => {
                if (!uniqueCategories.includes(tag)) {
                  uniqueCategories.push(tag);
                }
              });
            }
          });
        }
        setCategories(uniqueCategories);
      } else {
        console.error("API returned success: false", response);
        setError(response?.message || "Failed to load models");
      }
    } catch (err) {
      console.error("Error fetching published models:", err);

      // Check if it's an authentication error
      if (
        err?.message?.includes("401") ||
        err?.message?.includes("auth") ||
        err?.message?.includes("token")
      ) {
        setIsAuthError(true);
        setError("Authentication error. Please sign in again.");
      } else {
        setError(
          err?.message || "Failed to load models. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReLogin = () => {
    navigate("/login");
  };

  const handleSearch = () => {
    const filters = {};
    if (searchQuery) filters.search = searchQuery;
    if (selectedCategory !== "all") filters.category = selectedCategory;
    fetchModels(filters);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const filters = { category };
    if (searchQuery) filters.search = searchQuery;
    fetchModels(filters);
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    // Re-sort the current data
    let sortedModels = [...models];

    if (sort === "popular") {
      sortedModels.sort(
        (a, b) => (b.stats?.usageCount || 0) - (a.stats?.usageCount || 0)
      );
    } else if (sort === "newest") {
      sortedModels.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sort === "price-low") {
      sortedModels.sort((a, b) => {
        const priceA = a.perTokenPricing?.enabled ? a.perTokenPricing.price : 0;
        const priceB = b.perTokenPricing?.enabled ? b.perTokenPricing.price : 0;
        return priceA - priceB;
      });
    } else if (sort === "price-high") {
      sortedModels.sort((a, b) => {
        const priceA = a.perTokenPricing?.enabled ? a.perTokenPricing.price : 0;
        const priceB = b.perTokenPricing?.enabled ? b.perTokenPricing.price : 0;
        return priceB - priceA;
      });
    }

    setModels(sortedModels);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSort("popular");
    fetchModels();
  };

  // Transform models for ModelList component
  const transformModelsForUI = () => {
    return models.map((model) => ({
      id: model._id,
      name: model.name,
      description: model.description,
      imageUrl: model.image || null,
      category: model.category || "Other",
      tags: model.tags || [],
      rating: model.rating || 4.5,
      reviewCount: model.reviewCount || 0,
      usageCount: model.stats?.usageCount || 0,
      price: model.perTokenPricing?.enabled
        ? { type: "usage", amount: model.perTokenPricing.price }
        : { type: "free" },
      developer: {
        name: model.owner?.profile?.name || "AI Developer",
        verified: model.owner?.isVerified || false,
      },
      isNew:
        new Date(model.createdAt) >
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      trending: model.stats?.usageCount > 1000,
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
          Published AI Models
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">
          Discover and integrate AI models published by our community of
          developers
        </p>
      </motion.div>

      {error && (
        <Card
          animate={true}
          className={`p-4 mb-6 ${
            isAuthError
              ? "bg-yellow-50 dark:bg-yellow-900/20"
              : "bg-red-50 dark:bg-red-900/20"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p
              className={
                isAuthError
                  ? "text-yellow-800 dark:text-yellow-300"
                  : "text-red-700 dark:text-red-300"
              }
            >
              {error}
            </p>
            {isAuthError && (
              <Button onClick={handleReLogin} variant="primary" size="md">
                Sign In Again
              </Button>
            )}
          </div>
        </Card>
      )}

      <ModelFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
        categoryOptions={categoryOptions}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortOptions={sortOptions}
        selectedSort={selectedSort}
        onSortChange={handleSortChange}
        onClearFilters={handleClearFilters}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-primary-600 dark:border-primary-400 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-primary-600 dark:text-primary-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Loading AI models...
          </p>
        </div>
      ) : (
        <ModelList
          models={transformModelsForUI()}
          title={`${models.length} ${
            models.length === 1 ? "Model" : "Models"
          } Found`}
        />
      )}
    </div>
  );
};

export default UserModels;
