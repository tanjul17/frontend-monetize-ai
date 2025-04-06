import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTokens } from "../contexts/TokenContext";
import {
  getMarketplaceModelById,
  testAzureConnection,
  testDeployments,
  directTest,
  getSimpleCompletion,
  pythonStyleTest,
  sendChatMessage,
} from "../services/modelService";
import { motion, AnimatePresence } from "framer-motion";
import {
  PaperAirplaneIcon,
  UserIcon,
  SparklesIcon,
  ArrowPathIcon,
  ClipboardIcon,
  DocumentTextIcon,
  TagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  UsersIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const ModelDetail = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { tokenBalance, updateTokenBalance, fetchTokenBalance } = useTokens();
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [testingAzure, setTestingAzure] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [testingDeployments, setTestingDeployments] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [testingDirect, setTestingDirect] = useState(false);
  const [directResult, setDirectResult] = useState(null);
  const [testingSimple, setTestingSimple] = useState(false);
  const [simpleResult, setSimpleResult] = useState(null);
  const [testingPython, setTestingPython] = useState(false);
  const [pythonResult, setPythonResult] = useState(null);
  const messagesEndRef = useRef(null);

  // Load model details
  useEffect(() => {
    const fetchModel = async () => {
      setLoading(true);
      try {
        const response = await getMarketplaceModelById(id);
        setModel(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching model details:", error);
        setError("Failed to load model details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [id]);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim() || isGenerating) return;

    // Check token balance
    if (tokenBalance !== null && tokenBalance < 500) {
      setMessages([
        ...messages,
        { role: "user", content: inputValue },
        {
          role: "system",
          content:
            "You don't have enough tokens. Each chat costs 500 tokens. Please visit the dashboard to add more tokens.",
        },
      ]);
      setInputValue("");
      return;
    }

    // Add user message to chat
    const userMessage = { role: "user", content: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");

    // Start generating response
    setIsGenerating(true);

    try {
      // Use sendChatMessage for token deduction
      const chatResponse = await sendChatMessage(inputValue, model._id);

      // Update token balance if returned from API
      if (
        chatResponse.success &&
        chatResponse.data.tokenBalance !== undefined
      ) {
        updateTokenBalance(chatResponse.data.tokenBalance);
        console.log(
          `Token balance updated to: ${chatResponse.data.tokenBalance}`
        );
      }

      // Add AI response to chat
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: chatResponse.data.response },
      ]);
    } catch (error) {
      console.error("Error generating response:", error);

      let errorMessage =
        "I'm sorry, I encountered an error while processing your request. Please try again.";

      // Check if the error is due to insufficient tokens
      if (error.response?.data?.error === "Insufficient token balance") {
        errorMessage =
          "You don't have enough tokens to continue chatting. Each message costs 500 tokens.";

        // Update token balance if it was returned
        if (error.response?.data?.balance !== undefined) {
          updateTokenBalance(error.response.data.balance);
        }
      }

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setIsGenerating(false);
      // Always refresh token balance after a chat
      fetchTokenBalance();
    }
  };

  // Reset the conversation
  const handleResetConversation = () => {
    setMessages([]);
  };

  // Test Azure OpenAI connection
  const handleTestAzure = async () => {
    setTestingAzure(true);
    setTestResult(null);
    try {
      const response = await testAzureConnection();
      console.log("Azure test successful:", response);
      setTestResult({
        success: true,
        message: "Azure OpenAI connection successful!",
        details: response.data,
      });
    } catch (error) {
      console.error("Azure test failed:", error);
      setTestResult({
        success: false,
        message: "Azure OpenAI connection failed",
        details: error,
      });
    } finally {
      setTestingAzure(false);
    }
  };

  // Test Azure OpenAI deployments
  const handleTestDeployments = async () => {
    setTestingDeployments(true);
    setDeploymentResult(null);
    try {
      const response = await testDeployments();
      console.log("Deployments test successful:", response);
      setDeploymentResult({
        success: true,
        message: response.message || "Deployments test successful!",
        details: response,
      });
    } catch (error) {
      console.error("Deployments test failed:", error);
      setDeploymentResult({
        success: false,
        message: "Deployments test failed",
        details: error,
      });
    } finally {
      setTestingDeployments(false);
    }
  };

  // Test with hardcoded credentials
  const handleDirectTest = async () => {
    setTestingDirect(true);
    setDirectResult(null);
    try {
      const response = await directTest();
      console.log("Direct test successful:", response);
      setDirectResult({
        success: true,
        message: response.message || "Direct test successful!",
        details: response,
      });
    } catch (error) {
      console.error("Direct test failed:", error);
      setDirectResult({
        success: false,
        message: "Direct test failed",
        details: error,
      });
    } finally {
      setTestingDirect(false);
    }
  };

  // Test simple completion
  const handleSimpleTest = async () => {
    setTestingSimple(true);
    setSimpleResult(null);
    try {
      const response = await getSimpleCompletion(
        "Give me a short greeting in one sentence."
      );
      console.log("Simple completion test successful:", response);
      setSimpleResult({
        success: true,
        message: "Simple completion successful!",
        result: response.data.result,
      });
    } catch (error) {
      console.error("Simple completion test failed:", error);
      setSimpleResult({
        success: false,
        message: "Simple completion failed",
        error: error,
      });
    } finally {
      setTestingSimple(false);
    }
  };

  // Test Python-style method
  const handlePythonTest = async () => {
    setTestingPython(true);
    setPythonResult(null);
    try {
      const response = await pythonStyleTest();
      console.log("Python-style test successful:", response);
      setPythonResult({
        success: true,
        message: response.message || "Python-style test successful!",
        details: response,
      });
    } catch (error) {
      console.error("Python-style test failed:", error);
      setPythonResult({
        success: false,
        message: "Python-style test failed",
        details: error,
      });
    } finally {
      setTestingPython(false);
    }
  };

  // Chat message animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  // Function to sanitize markdown symbols from messages
  const sanitizeMarkdown = (text) => {
    if (!text) return "";

    // Remove asterisks, underscores, backticks when used as markdown formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
      .replace(/\*(.*?)\*/g, "$1") // Italic
      .replace(/__(.*?)__/g, "$1") // Bold
      .replace(/_(.*?)_/g, "$1") // Italic
      .replace(/`(.*?)`/g, "$1") // Code
      .replace(/~~(.*?)~~/g, "$1"); // Strikethrough
  };

  // Typing animation component
  const TypingAnimation = () => (
    <div className="flex space-x-1 items-center justify-center">
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
        style={{ animationDelay: "0ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
        style={{ animationDelay: "300ms" }}
      ></div>
      <div
        className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"
        style={{ animationDelay: "600ms" }}
      ></div>
    </div>
  );

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative mb-6">
          {error || "Model not found"}
        </div>
        <Link
          to="/marketplace"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          &larr; Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-[1440px]">
      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Model Information Panel - Redesigned with glassmorphism */}
        <motion.div
          className="lg:w-[30%] lg:sticky lg:top-24 lg:self-start"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="bg-white/90 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 overflow-hidden relative">
            {/* Background gradient effect */}
            <div className="absolute -top-24 -right-24 w-40 h-40 rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 blur-xl"></div>

            {/* Profile avatar/icon */}
            <div className="flex flex-col items-center mb-6 relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-md">
                <SparklesIcon className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white text-center">
                {model.name}
              </h1>
              {model.owner?.profile?.name && (
                <div className="flex items-center mt-1 text-slate-600 dark:text-slate-300">
                  <UserIcon className="h-3.5 w-3.5 mr-1" />
                  <p className="text-sm">
                    {model.owner.profile.name}
                    {model.owner.profile.organization && (
                      <span className="text-slate-500 dark:text-slate-400">
                        {` (${model.owner.profile.organization})`}
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Description section */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                Description
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50/80 dark:bg-slate-700/30 p-3 rounded-lg">
                {model.description}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 dark:border-slate-700/50 my-4"></div>

            {/* Tags section */}
            {model.tags && model.tags.length > 0 && (
              <div className="mb-5">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                  <TagIcon className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag, index) => (
                    <motion.span
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2.5 py-1 rounded-full text-xs font-medium border border-indigo-100 dark:border-indigo-800/50"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}

            {/* Pricing section */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                Pricing
              </h2>
              <div className="inline-flex items-center px-3 py-1.5 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm font-medium">
                <SparklesIcon className="h-4 w-4 mr-1.5" />
                {model.perTokenPricing?.enabled
                  ? `$${model.perTokenPricing.price} per token`
                  : "Free to use"}
              </div>
            </div>

            {/* Usage statistics */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center">
                <ChartBarIcon className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                Usage Statistics
              </h2>
              <div className="bg-slate-50/80 dark:bg-slate-700/30 p-3 rounded-lg flex items-center">
                <div className="bg-indigo-100 dark:bg-indigo-900/50 p-2 rounded-full mr-3">
                  <UsersIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Total Usage
                  </p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {model.stats?.usageCount?.toLocaleString() || 0}
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-6"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-1.5" />
                Back to Marketplace
              </Link>
            </motion.div>

            {/* Azure test button (only visible in development) */}
            {process.env.NODE_ENV !== "production" && (
              <div className="mt-4 border-t border-slate-200 dark:border-slate-700/50 pt-4">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Debug Tools
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <button
                    onClick={handleTestAzure}
                    disabled={testingAzure}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
                  >
                    {testingAzure ? "Testing Azure..." : "Test Connection"}
                  </button>

                  <button
                    onClick={handleTestDeployments}
                    disabled={testingDeployments}
                    className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded hover:bg-green-200 transition-colors"
                  >
                    {testingDeployments
                      ? "Testing Deployments..."
                      : "Test Deployments"}
                  </button>

                  <button
                    onClick={handleDirectTest}
                    disabled={testingDirect}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded hover:bg-purple-200 transition-colors"
                  >
                    {testingDirect ? "Testing..." : "Direct Test"}
                  </button>

                  <button
                    onClick={handleSimpleTest}
                    disabled={testingSimple}
                    className="px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded hover:bg-orange-200 transition-colors"
                  >
                    {testingSimple ? "Testing..." : "Simple Completion"}
                  </button>

                  <button
                    onClick={handlePythonTest}
                    disabled={testingPython}
                    className="px-3 py-1 bg-pink-100 text-pink-800 text-xs rounded hover:bg-pink-200 transition-colors"
                  >
                    {testingPython ? "Testing..." : "Python-Style Test"}
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`mt-2 p-2 text-xs rounded ${
                      testResult.success
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">{testResult.message}</p>
                    {!testResult.success && testResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error:{" "}
                        {testResult.details.message ||
                          JSON.stringify(testResult.details)}
                      </p>
                    )}
                  </div>
                )}

                {deploymentResult && (
                  <div
                    className={`mt-2 p-2 text-xs rounded ${
                      deploymentResult.success
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">{deploymentResult.message}</p>
                    {deploymentResult.success &&
                      deploymentResult.details?.workingDeployment && (
                        <p className="mt-1 text-xs">
                          Working deployment:{" "}
                          <span className="font-mono bg-green-100 dark:bg-green-900/40 px-1 rounded">
                            {deploymentResult.details.workingDeployment}
                          </span>
                          {deploymentResult.details.recommendation && (
                            <div className="mt-1 text-green-700 dark:text-green-400">
                              {deploymentResult.details.recommendation}
                            </div>
                          )}
                        </p>
                      )}
                    {!deploymentResult.success && deploymentResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error:{" "}
                        {deploymentResult.details.message ||
                          JSON.stringify(deploymentResult.details)}
                      </p>
                    )}
                  </div>
                )}

                {directResult && (
                  <div
                    className={`mt-2 p-2 text-xs rounded ${
                      directResult.success
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">{directResult.message}</p>
                    {directResult.success &&
                      directResult.details?.workingDeployment && (
                        <p className="mt-1 text-xs">
                          Working deployment:{" "}
                          <span className="font-mono bg-green-100 dark:bg-green-900/40 px-1 rounded">
                            {directResult.details.workingDeployment}
                          </span>
                          <div className="mt-1 text-green-700 dark:text-green-400">
                            Use this deployment name in your .env file
                          </div>
                        </p>
                      )}
                    {directResult.success &&
                      directResult.details?.response?.content && (
                        <p className="mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded">
                          Response: "{directResult.details.response.content}"
                        </p>
                      )}
                    {!directResult.success && directResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error:{" "}
                        {directResult.details.message ||
                          directResult.details.error ||
                          JSON.stringify(directResult.details)}
                      </p>
                    )}
                  </div>
                )}

                {simpleResult && (
                  <div
                    className={`mt-2 p-2 text-xs rounded ${
                      simpleResult.success
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">{simpleResult.message}</p>
                    {simpleResult.success && simpleResult.result && (
                      <p className="mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded">
                        Response: "{simpleResult.result}"
                      </p>
                    )}
                    {!simpleResult.success && simpleResult.error && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error:{" "}
                        {simpleResult.error.message ||
                          JSON.stringify(simpleResult.error)}
                      </p>
                    )}
                  </div>
                )}

                {pythonResult && (
                  <div
                    className={`mt-2 p-2 text-xs rounded ${
                      pythonResult.success
                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                    }`}
                  >
                    <p className="font-medium">{pythonResult.message}</p>
                    {pythonResult.success &&
                      pythonResult.details?.response?.content && (
                        <p className="mt-1 text-xs bg-slate-100 dark:bg-slate-800 p-1 rounded">
                          Response: "{pythonResult.details.response.content}"
                        </p>
                      )}
                    {!pythonResult.success && pythonResult.details && (
                      <p className="mt-1 text-xs overflow-auto max-h-32">
                        Error:{" "}
                        {pythonResult.details.message ||
                          pythonResult.details.error ||
                          JSON.stringify(pythonResult.details)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Interface - Expanded width */}
        <motion.div
          className="lg:w-[70%] flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="bg-[#0F0F0F] rounded-2xl shadow-lg overflow-hidden flex flex-col h-[75vh] border border-slate-800 relative">
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 backdrop-blur-md">
              <h2 className="text-xl font-bold text-white">
                Chat with {model.name}
              </h2>
              {tokenBalance !== null && (
                <div className="flex items-center mt-1 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 w-fit">
                  <ClipboardIcon className="h-3.5 w-3.5 mr-1.5 text-indigo-200" />
                  <span className="text-xs font-medium text-white">
                    {tokenBalance.toLocaleString()} tokens (Cost: 500/chat)
                  </span>
                </div>
              )}
            </div>

            {/* Chat messages area - improved scrollbar */}
            <div
              className="flex-grow overflow-y-auto p-6 bg-[#1A1A1A] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent hover:scrollbar-thumb-slate-500"
              style={{
                backgroundImage: `radial-gradient(circle at 25px 25px, rgba(30, 41, 59, 0.2) 2%, transparent 0%), 
                                  radial-gradient(circle at 75px 75px, rgba(30, 41, 59, 0.2) 2%, transparent 0%)`,
                backgroundSize: "100px 100px",
                scrollbarWidth: "thin",
                scrollbarColor: "rgb(71, 85, 105) transparent",
              }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md backdrop-blur-sm bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 shadow-lg">
                    <SparklesIcon className="h-10 w-10 mx-auto mb-4 text-indigo-400" />
                    <p className="mb-2 text-slate-200 font-medium text-lg">
                      Start a conversation with {model.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      Enter a message below to get AI-powered responses in
                      real-time.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                      <motion.div
                        key={index}
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[85%] ${
                            message.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                              message.role === "user"
                                ? "bg-gradient-to-br from-blue-500 to-cyan-400 ml-3 shadow-md"
                                : "bg-gradient-to-br from-violet-500 to-fuchsia-400 mr-3 shadow-md"
                            }`}
                          >
                            {message.role === "user" ? (
                              <UserIcon className="h-5 w-5 text-white" />
                            ) : (
                              <SparklesIcon className="h-5 w-5 text-white" />
                            )}
                          </div>

                          {/* Message bubble - enhanced style */}
                          <div
                            className={`p-4 rounded-2xl shadow-md ${
                              message.role === "user"
                                ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-medium"
                                : "bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-slate-200"
                            }`}
                          >
                            <p className="text-base leading-relaxed whitespace-pre-wrap font-['Inter',sans-serif]">
                              {sanitizeMarkdown(message.content)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing animation when AI is responding */}
                    {isGenerating && (
                      <motion.div
                        variants={messageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex justify-start"
                      >
                        <div className="flex max-w-[85%] flex-row">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-violet-500 to-fuchsia-400 mr-3 shadow-md">
                            <SparklesIcon className="h-5 w-5 text-white" />
                          </div>
                          <div className="py-3 px-5 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-md">
                            <TypingAnimation />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input area - enhanced style */}
            <div className="p-4 bg-[#141414] border-t border-slate-800">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-grow bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl px-5 py-3.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-inner"
                  disabled={!currentUser || isGenerating}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3.5 rounded-xl flex items-center justify-center ${
                    isGenerating || !inputValue.trim() || !currentUser
                      ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
                  } transition-all duration-200`}
                  disabled={isGenerating || !inputValue.trim() || !currentUser}
                >
                  {isGenerating ? (
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </motion.button>

                {messages.length > 0 && (
                  <motion.button
                    type="button"
                    onClick={handleResetConversation}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3.5 bg-slate-800/70 border border-slate-700/50 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-200"
                    title="Reset conversation"
                  >
                    <ArrowPathIcon className="h-5 w-5" />
                  </motion.button>
                )}
              </form>
              {!currentUser && (
                <p className="mt-3 text-sm text-red-400 bg-red-900/20 rounded-lg p-2 border border-red-800/30">
                  Please{" "}
                  <Link to="/login" className="text-indigo-400 hover:underline">
                    log in
                  </Link>{" "}
                  to chat with this model.
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ModelDetail;
