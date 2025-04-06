import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { getDeveloperModels } from "../services/modelService";

// Icons
import {
  UserCircleIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  KeyIcon,
  ClipboardDocumentIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const DevProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: currentUser?.profile?.name || "",
    organization: currentUser?.profile?.organization || "",
    bio: currentUser?.profile?.bio || "",
  });

  // API Key states
  const [apiKey, setApiKey] = useState(""); // In a real app, this would be fetched from an API
  const [isApiKeyVisible, setIsApiKeyVisible] = useState(false);
  const [apiKeyLoading, setApiKeyLoading] = useState(true);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const apiKeyRef = useRef(null);

  // For real data fetching (disabled for now since we don't have a confirmed API endpoint)
  const [publishedModels, setPublishedModels] = useState([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [hasModelsData, setHasModelsData] = useState(false);

  // Function to fetch models data if API is available
  useEffect(() => {
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        const response = await getDeveloperModels();
        if (response && response.data && Array.isArray(response.data)) {
          setPublishedModels(
            response.data.filter((model) => model.status === "active")
          );
          setHasModelsData(response.data.length > 0);
        }
      } catch (err) {
        console.error("Error fetching models:", err);
        // API might not be available, silently fail
      } finally {
        setModelsLoading(false);
      }
    };

    // Simulating API key fetch (in a real app, this would be a separate API call)
    const fetchApiKey = async () => {
      setApiKeyLoading(true);
      try {
        // Simulate API call with timeout
        await new Promise((resolve) => setTimeout(resolve, 500));
        // This would be the API response in a real implementation
        setApiKey(
          "api_" +
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15)
        );
      } catch (err) {
        console.error("Error fetching API key:", err);
      } finally {
        setApiKeyLoading(false);
      }
    };

    fetchApiKey();
    fetchModels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const profileData = {
        profile: {
          ...formData,
        },
      };

      const response = await updateProfile(currentUser.id, profileData);

      if (response.success) {
        setSuccess("Profile updated successfully!");

        // Auto-dismiss success message after 3 seconds
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  const copyApiKeyToClipboard = () => {
    if (apiKeyRef.current) {
      navigator.clipboard
        .writeText(apiKeyRef.current.value)
        .then(() => {
          setApiKeyCopied(true);
          setTimeout(() => setApiKeyCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy API key:", err);
        });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6 border border-slate-100 dark:border-slate-700/30"
      >
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Developer Profile
        </h1>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-100 dark:border-red-800/20 flex items-start"
            >
              <ExclamationCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-xl border border-green-100 dark:border-green-800/20 flex items-start"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{success}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-slate-200 dark:border-slate-700/30 pt-6">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl mr-4">
              <UserCircleIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-slate-900 dark:text-white">
                {currentUser?.email}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">
                {currentUser?.role}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserCircleIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm py-2.5 px-3 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Your name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="organization"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Organization
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm py-2.5 px-3 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Your organization"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
              >
                Bio
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                  <DocumentTextIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <textarea
                  id="bio"
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                  className="mt-1 block w-full pl-10 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm py-2.5 px-3 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                  placeholder="Tell us about yourself"
                ></textarea>
              </div>
            </div>

            {apiKey && (
              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
                >
                  Your API Key
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input
                    ref={apiKeyRef}
                    type={isApiKeyVisible ? "text" : "password"}
                    id="apiKey"
                    value={apiKeyLoading ? "Loading..." : apiKey}
                    readOnly
                    className="block w-full pl-10 pr-20 border border-slate-300 dark:border-slate-600 rounded-xl shadow-sm py-2.5 px-3 bg-white dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
                    disabled={apiKeyLoading}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      type="button"
                      onClick={toggleApiKeyVisibility}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                      disabled={apiKeyLoading}
                    >
                      {isApiKeyVisible ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={copyApiKeyToClipboard}
                      className="pr-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors focus:outline-none"
                      disabled={apiKeyLoading}
                    >
                      <ClipboardDocumentIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <AnimatePresence>
                    {apiKeyCopied && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 -bottom-8 text-xs text-green-600 dark:text-green-400 flex items-center"
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" />
                        Copied to clipboard
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full sm:w-auto flex justify-center items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                loading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {/* API integration conditionally renders real model data if available */}
      {hasModelsData && publishedModels.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 shadow-md rounded-2xl p-6 border border-slate-100 dark:border-slate-700/30"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Published Models
            </h2>
          </div>

          {modelsLoading ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : publishedModels.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 italic">
              You have not published any models yet.
            </p>
          ) : (
            <div className="space-y-4">
              {publishedModels.map((model) => (
                <motion.div
                  key={model.id || model._id}
                  whileHover={{
                    y: -2,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                  className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 bg-white/50 dark:bg-slate-800/50 transition-all"
                >
                  <div className="flex justify-between">
                    <h3 className="text-md font-medium text-slate-900 dark:text-white">
                      {model.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        model.status === "active"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                          : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                      }`}
                    >
                      {model.status === "active" ? "Active" : "Pending Review"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {model.description}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Usage
                      </p>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        {(model.stats?.usageCount || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Revenue
                      </p>
                      <p className="text-lg font-medium text-slate-900 dark:text-white">
                        ${(model.stats?.revenue || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DevProfile;
