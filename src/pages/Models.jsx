import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getDeveloperModels,
  deleteModel,
  submitForPublishing,
  testModelRoutes,
} from "../services/modelService";
import { motion, AnimatePresence } from "framer-motion";
import {
  CubeIcon,
  PlusIcon,
  BoltIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  DocumentIcon,
  DocumentCheckIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";

// Create Model Modal Component
const CreateModelModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    firstMessage: "",
    tags: "",
    perTokenPricing: {
      enabled: false,
      price: 0,
    },
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", duration: 0.4, bounce: 0.2 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "perTokenPricing.enabled") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          enabled: e.target.checked,
        },
      });
    } else if (name === "perTokenPricing.price") {
      setFormData({
        ...formData,
        perTokenPricing: {
          ...formData.perTokenPricing,
          price: parseFloat(value) || 0,
        },
      });
    } else if (name === "tags") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.firstMessage.trim())
      newErrors.firstMessage = "First message is required";

    if (
      formData.perTokenPricing.enabled &&
      formData.perTokenPricing.price <= 0
    ) {
      newErrors["perTokenPricing.price"] = "Price must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Format tags as an array from comma-separated string
      const formattedData = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      await onSubmit(formattedData);
      onClose();
    } catch (error) {
      console.error("Error creating model:", error);
      setErrors({ submit: error.message || "Failed to create model" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          ></div>

          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-xl overflow-hidden rounded-2xl"
            >
              {/* Glassmorphism effect */}
              <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-2xl"></div>

              <div className="relative p-6">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">
                    Create New Model
                  </h3>
                  <motion.button
                    whileHover={{ rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                  >
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {errors.submit && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 text-red-700 dark:text-red-300 rounded-lg"
                    >
                      {errors.submit}
                    </motion.div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Model Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-700/30 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg shadow-sm 
                        ${
                          errors.name
                            ? "ring-2 ring-red-500 dark:ring-red-400"
                            : "ring-1 ring-slate-300/50 dark:ring-slate-600/50 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        } transition-all`}
                      placeholder="e.g., Financial Advisor AI"
                    />
                    {errors.name && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Description*
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-700/30 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg shadow-sm 
                        ${
                          errors.description
                            ? "ring-2 ring-red-500 dark:ring-red-400"
                            : "ring-1 ring-slate-300/50 dark:ring-slate-600/50 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        } transition-all`}
                      rows="3"
                      placeholder="Describe what your model does..."
                    ></textarea>
                    {errors.description && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      First Message / System Prompt*
                    </label>
                    <textarea
                      name="firstMessage"
                      value={formData.firstMessage}
                      onChange={handleChange}
                      className={`block w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-700/30 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg shadow-sm 
                        ${
                          errors.firstMessage
                            ? "ring-2 ring-red-500 dark:ring-red-400"
                            : "ring-1 ring-slate-300/50 dark:ring-slate-600/50 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        } transition-all`}
                      rows="5"
                      placeholder="Enter the system prompt that defines how your AI should behave..."
                    ></textarea>
                    {errors.firstMessage && (
                      <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                        {errors.firstMessage}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-700/30 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg shadow-sm ring-1 ring-slate-300/50 dark:ring-slate-600/50 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all"
                      placeholder="e.g., finance, advisor, investment"
                    />
                  </div>

                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="perTokenPricing.enabled"
                        checked={formData.perTokenPricing.enabled}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 dark:peer-focus:ring-primary-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 dark:peer-checked:bg-primary-500"></div>
                      <span className="ms-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Enable Per Token Pricing
                      </span>
                    </label>
                  </div>

                  {formData.perTokenPricing.enabled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-1"
                    >
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Price Per Token ($)
                      </label>
                      <input
                        type="number"
                        name="perTokenPricing.price"
                        value={formData.perTokenPricing.price}
                        onChange={handleChange}
                        step="0.00001"
                        min="0"
                        className={`block w-full px-3 py-2 bg-slate-100/50 dark:bg-slate-700/30 backdrop-blur-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 rounded-lg shadow-sm 
                          ${
                            errors["perTokenPricing.price"]
                              ? "ring-2 ring-red-500 dark:ring-red-400"
                              : "ring-1 ring-slate-300/50 dark:ring-slate-600/50 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                          } transition-all`}
                        placeholder="e.g., 0.00001"
                      />
                      {errors["perTokenPricing.price"] && (
                        <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                          {errors["perTokenPricing.price"]}
                        </p>
                      )}
                    </motion.div>
                  )}

                  <div className="flex justify-end gap-3 mt-6">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`px-4 py-2 text-white text-sm font-medium rounded-lg shadow-sm
                        bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700
                        dark:from-primary-500 dark:to-indigo-500 dark:hover:from-primary-600 dark:hover:to-indigo-600
                        focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all
                        ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating...
                        </div>
                      ) : (
                        "Create Model"
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Count up animation hook
const useCountUp = (end, duration = 2000, delay = 0) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!end) return;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    const timeoutId = setTimeout(() => {
      window.requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [end, duration, delay]);

  return count;
};

// Get greeting based on time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

// Main Models Component
const Models = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [selectedTab, setSelectedTab] = useState("published");
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(null);

  // Stats for count-up animation
  const totalModels = useCountUp(models.length, 1500, 300);
  const activeModels = useCountUp(
    models.filter((model) => model.status === "active").length,
    1500,
    600
  );
  const totalUsage = useCountUp(
    models.reduce((sum, model) => sum + (model.stats?.usageCount || 0), 0),
    1500,
    900
  );
  const totalRevenue = parseFloat(
    models
      .reduce((sum, model) => sum + (model.stats?.revenue || 0), 0)
      .toFixed(2)
  );
  const animatedRevenue = useCountUp(totalRevenue * 100, 1500, 1200) / 100;

  // Fetch models from API
  useEffect(() => {
    const fetchModels = async () => {
      setLoading(true);
      try {
        const response = await getDeveloperModels();
        setModels(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching models:", err);
        setError("Failed to load models. Please try again later.");
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  // Filter models based on selected tab
  const filteredModels = models.filter((model) => {
    if (selectedTab === "published") {
      return model.status === "active";
    } else if (selectedTab === "drafts") {
      return model.status === "draft";
    }
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not published";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle model creation
  const handleCreateModel = async (formData) => {
    setIsProcessing(true);
    try {
      const response = await import("../services/modelService").then((module) =>
        module.createModel(formData)
      );
      setModels([response.data, ...models]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating model:", error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle model deletion
  const handleDeleteModel = async (modelId) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      setIsProcessing(true);
      setActionInProgress(modelId);
      try {
        await deleteModel(modelId);
        setModels(models.filter((model) => model._id !== modelId));
      } catch (error) {
        console.error("Error deleting model:", error);
        setError("Failed to delete model. Please try again.");
      } finally {
        setIsProcessing(false);
        setActionInProgress(null);
      }
    }
  };

  // Handle submission for publishing
  const handleSubmitForPublishing = async (modelId) => {
    setIsProcessing(true);
    setActionInProgress(modelId);
    try {
      const response = await submitForPublishing(modelId);
      setModels(
        models.map((model) => (model._id === modelId ? response.data : model))
      );
    } catch (error) {
      console.error("Error submitting model for publishing:", error);
      setError("Failed to submit model for publishing. Please try again.");
    } finally {
      setIsProcessing(false);
      setActionInProgress(null);
    }
  };

  // Model card animation
  const modelCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.3 },
    }),
    hover: {
      y: -8,
      boxShadow:
        "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 },
    },
  };

  // Tab animation variants
  const tabIndicatorVariants = {
    left: { x: 0 },
    right: { x: "100%" },
  };

  // Stats card animation
  const statsCardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.2 + index * 0.1, duration: 0.3 },
    }),
    hover: {
      y: -5,
      transition: { duration: 0.2 },
    },
  };

  // Add this function inside the Models component
  const handleTestRoutes = async () => {
    try {
      const result = await testModelRoutes();
      console.log("Test result:", result);
      alert("API test successful! Check console for details.");
    } catch (error) {
      console.error("API test failed:", error);
      alert("API test failed: " + (error.message || "Unknown error"));
    }
  };

  // No Models Found Component
  const NoModelsFound = ({ showCreateModelModal }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center p-10 mt-6 max-w-3xl mx-auto"
      >
        {/* Glassmorphism card */}
        <div className="relative w-full overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-white/20 dark:bg-slate-800/20 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 rounded-2xl"></div>

          <div className="relative p-8 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-5 p-4 rounded-full bg-gradient-to-r from-slate-100/30 to-slate-200/30 dark:from-slate-700/30 dark:to-slate-800/30 inline-flex mx-auto"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-16 h-16 text-indigo-500 dark:text-indigo-400"
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 3, duration: 2 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                />
              </motion.svg>
            </motion.div>

            <motion.h3
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 mb-2"
            >
              No Models Found
            </motion.h3>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-slate-600 dark:text-slate-400 mb-8 max-w-lg mx-auto"
            >
              You haven't created any AI models yet. Start by creating your
              first model to begin monetizing your AI solutions.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={showCreateModelModal}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 dark:from-primary-500 dark:to-indigo-500 dark:hover:from-primary-600 dark:hover:to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Create Your First Model
              </motion.button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-7xl"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm border border-red-100 dark:border-red-800/50 rounded-xl text-red-700 dark:text-red-300"
          >
            {error}
          </motion.div>
        )}

        {/* Header section with greeting and actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center"
          >
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600 dark:from-primary-400 dark:to-blue-400">
              {getGreeting()},{" "}
              {currentUser?.profile?.name?.split(" ")[0] || "Creator"} 👋
            </h1>
          </motion.div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTestRoutes}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm 
                bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-500 dark:hover:to-blue-600
                text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
            >
              <BoltIcon className="h-5 w-5 mr-1.5" />
              Test API
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm 
                bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700
                dark:from-primary-500 dark:to-indigo-500 dark:hover:from-primary-600 dark:hover:to-indigo-600
                text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
              disabled={isProcessing}
            >
              <PlusIcon className="h-5 w-5 mr-1.5" />
              Create New Model
            </motion.button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            variants={statsCardVariants}
            custom={0}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>
            <div className="relative p-6 flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg mr-4">
                <CubeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Models
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                  {totalModels}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statsCardVariants}
            custom={1}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>
            <div className="relative p-6 flex items-start">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg mr-4">
                <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Active Models
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                  {activeModels}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statsCardVariants}
            custom={2}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>
            <div className="relative p-6 flex items-start">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg mr-4">
                <ArrowPathIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Usage
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                  {totalUsage.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={statsCardVariants}
            custom={3}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="relative overflow-hidden rounded-xl"
          >
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>
            <div className="relative p-6 flex items-start">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg mr-4">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Revenue
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800 dark:text-white">
                  ${animatedRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="relative border-b border-slate-200 dark:border-slate-700/30 mb-8">
          <div className="flex space-x-8">
            <motion.button
              onClick={() => setSelectedTab("published")}
              className={`flex items-center whitespace-nowrap py-4 px-1 font-medium text-sm ${
                selectedTab === "published"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <DocumentCheckIcon className="h-5 w-5 mr-1.5" />
              Published
              <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                {models.filter((model) => model.status === "active").length}
              </span>
            </motion.button>

            <motion.button
              onClick={() => setSelectedTab("drafts")}
              className={`flex items-center whitespace-nowrap py-4 px-1 font-medium text-sm ${
                selectedTab === "drafts"
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <DocumentIcon className="h-5 w-5 mr-1.5" />
              Drafts
              <span className="ml-2 py-0.5 px-2 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {models.filter((model) => model.status === "draft").length}
              </span>
            </motion.button>

            {/* Animated underline */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 w-[calc(50%_-_2rem)] bg-primary-500 dark:bg-primary-400"
              animate={selectedTab === "published" ? "left" : "right"}
              variants={tabIndicatorVariants}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Models List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-primary-600 dark:border-primary-400 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CubeIcon className="h-10 w-10 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <p className="ml-4 text-lg text-slate-600 dark:text-slate-300">
              Loading your models...
            </p>
          </div>
        ) : (
          <>
            {/* Models List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {filteredModels.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredModels.map((model, index) => (
                      <motion.div
                        key={model._id || model.id}
                        custom={index}
                        variants={modelCardVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="relative overflow-hidden rounded-xl h-full"
                      >
                        {/* Glassmorphism background layers */}
                        <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/30 rounded-xl"></div>

                        {/* Model card content */}
                        <div className="relative p-6 flex flex-col h-full">
                          {/* Header with name, date and status */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-1 pr-6">
                                {model.name}
                              </h3>
                              <div className="flex flex-wrap items-center text-sm text-slate-500 dark:text-slate-400 gap-2">
                                <span>
                                  Created: {formatDate(model.createdAt)}
                                </span>
                                {model.status === "active" && (
                                  <motion.span
                                    animate={{
                                      boxShadow: [
                                        "0 0 0 0 rgba(34, 197, 94, 0)",
                                        "0 0 0 4px rgba(34, 197, 94, 0.3)",
                                        "0 0 0 0 rgba(34, 197, 94, 0)",
                                      ],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                    className="py-1 px-2.5 text-xs font-medium rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 flex items-center"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 mr-1.5"></span>
                                    Published
                                  </motion.span>
                                )}
                                {model.status === "draft" && (
                                  <span className="py-1 px-2.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 flex items-center">
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 mr-1.5"></span>
                                    Draft
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Action menu */}
                            <motion.button
                              whileHover={{ rotate: 90 }}
                              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
                            >
                              <EllipsisVerticalIcon className="h-5 w-5" />
                            </motion.button>
                          </div>

                          {/* Description */}
                          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-grow">
                            {model.description}
                          </p>

                          {/* Tags */}
                          {model.tags && model.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                              {model.tags.map((tag, idx) => (
                                <motion.span
                                  key={idx}
                                  whileHover={{ scale: 1.05 }}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30"
                                >
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                          )}

                          {/* Stats for active models */}
                          {model.status === "active" && (
                            <div className="grid grid-cols-2 gap-3 mb-5">
                              <motion.div
                                whileHover={{ y: -2 }}
                                className="bg-slate-100/80 dark:bg-slate-700/30 backdrop-blur-sm p-3 rounded-lg border border-slate-200/50 dark:border-slate-600/30"
                              >
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                                  <ArrowPathIcon className="h-3 w-3 mr-1" />
                                  Total Usage
                                </p>
                                <p className="font-bold text-slate-800 dark:text-white">
                                  {model.stats?.usageCount?.toLocaleString() ||
                                    0}
                                </p>
                              </motion.div>
                              <motion.div
                                whileHover={{ y: -2 }}
                                className="bg-slate-100/80 dark:bg-slate-700/30 backdrop-blur-sm p-3 rounded-lg border border-slate-200/50 dark:border-slate-600/30"
                              >
                                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center">
                                  <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                                  Revenue
                                </p>
                                <p className="font-bold text-slate-800 dark:text-white">
                                  ${model.stats?.revenue?.toFixed(2) || "0.00"}
                                </p>
                              </motion.div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex space-x-3">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                navigate(
                                  `/models/${model._id || model.id}/edit`
                                )
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-slate-300 dark:border-slate-600 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-700/50 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              disabled={
                                isProcessing && actionInProgress === model._id
                              }
                            >
                              Edit
                            </motion.button>

                            {model.status === "draft" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                  handleSubmitForPublishing(model._id)
                                }
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white
                                  bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700
                                  dark:from-primary-500 dark:to-indigo-500 dark:hover:from-primary-600 dark:hover:to-indigo-600
                                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                disabled={
                                  isProcessing && actionInProgress === model._id
                                }
                              >
                                {isProcessing && actionInProgress === model._id
                                  ? "Processing..."
                                  : "Publish to Marketplace"}
                              </motion.button>
                            )}

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() =>
                                handleDeleteModel(model._id || model.id)
                              }
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                              disabled={
                                isProcessing && actionInProgress === model._id
                              }
                            >
                              Delete
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <NoModelsFound
                    showCreateModelModal={() => setIsCreateModalOpen(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}

        {/* Create Model Modal */}
        <CreateModelModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateModel}
        />
      </motion.div>
    </div>
  );
};

export default Models;
