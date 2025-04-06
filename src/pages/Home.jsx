import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Home = () => {
  const { currentUser } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, []);

  // eslint-disable-next-line no-unused-vars
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  // Determine the appropriate dashboard based on user role
  const getDashboardLink = () => {
    // This is a simple example - you'd likely have more sophisticated role detection
    return currentUser?.isAdmin ? "/admin-dashboard" : "/dashboard";
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  // Intersection observer hooks for scroll animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] transition-colors duration-300 dark:bg-gray-900">
      {/* Theme toggle button */}
      {/* <button
        onClick={toggleTheme}
        className="fixed z-50 right-6 top-24 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        )}
      </button> */}

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="relative bg-gradient-to-b from-white to-gray-50 dark:from-dark-800 dark:to-dark-900 py-16 lg:py-24 overflow-hidden"
      >
        {/* Background animation/particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-accent-blue/5 to-transparent dark:from-accent-blue/10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-dark-300/30 to-transparent"></div>
          <svg
            className="absolute right-0 top-0 opacity-10 dark:opacity-5 translate-x-1/4 -translate-y-1/4"
            width="800"
            height="800"
            viewBox="0 0 800 800"
          >
            <motion.circle
              cx="400"
              cy="400"
              r="200"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#5f6fff" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-accent-purple/10 dark:bg-accent-purple/20 rounded-full filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <motion.div
              variants={fadeInUp}
              className="lg:col-span-6 xl:col-span-5"
            >
              <div className="text-center lg:text-left space-y-8">
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl font-satoshi"
                >
                  <span className="block">MonetizeAI</span>
                  <span className="block text-accent-blue dark:text-accent-purple">
                    Marketplace
                  </span>
                </motion.h1>
                <motion.p
                  variants={fadeInUp}
                  className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300"
                >
                  The platform that connects AI model developers with users.
                  Publish your models, set pricing, and reach a global audience
                  or discover and use cutting-edge AI models for your
                  applications.
                </motion.p>
                <motion.div
                  variants={staggerContainer}
                  className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start justify-center"
                >
                  {currentUser ? (
                    <>
                      <motion.div variants={fadeInUp}>
                        <Link
                          to={getDashboardLink()}
                          className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3.5 text-base font-medium text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 transition-all duration-300 overflow-hidden"
                        >
                          <span className="relative flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 13H10C10.55 13 11 12.55 11 12V4C11 3.45 10.55 3 10 3H4C3.45 3 3 3.45 3 4V12C3 12.55 3.45 13 4 13ZM4 21H10C10.55 21 11 20.55 11 20V16C11 15.45 10.55 15 10 15H4C3.45 15 3 15.45 3 16V20C3 20.55 3.45 21 4 21ZM14 21H20C20.55 21 21 20.55 21 20V12C21 11.45 20.55 11 20 11H14C13.45 11 13 11.45 13 12V20C13 20.55 13.45 21 14 21ZM13 4V8C13 8.55 13.45 9 14 9H20C20.55 9 21 8.55 21 8V4C21 3.45 20.55 3 20 3H14C13.45 3 13 3.45 13 4Z"
                                fill="currentColor"
                              />
                            </svg>
                            Go to Dashboard
                          </span>
                          <span className="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-accent-purple to-accent-blue transition-transform duration-500 origin-left"></span>
                        </Link>
                      </motion.div>
                      <motion.div variants={fadeInUp}>
                        <Link
                          to="/marketplace"
                          className="group relative inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-medium dark:bg-dark-400/50 text-accent-blue dark:text-accent-purple shadow-sm ring-1 ring-accent-blue/20 dark:ring-accent-purple/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 transition-all duration-300 overflow-hidden dark:focus:ring-offset-dark-800"
                        >
                          <span className="relative flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.5 11H19V7C19 5.9 18.1 5 17 5H13V3.5C13 2.12 11.88 1 10.5 1C9.12 1 8 2.12 8 3.5V5H4C2.9 5 2 5.9 2 7V10.8H3.5C5.5 10.8 7 12.3 7 14.3C7 16.3 5.5 17.8 3.5 17.8H2V21C2 22.1 2.9 23 4 23H7.8V21.5C7.8 19.5 9.3 18 11.3 18C13.3 18 14.8 19.5 14.8 21.5V23H18C19.1 23 20 22.1 20 21V16.9H20.5C21.88 16.9 23 15.78 23 14.4C23 13.02 21.88 11 20.5 11Z"
                                fill="currentColor"
                              />
                            </svg>
                            Explore Models
                          </span>
                          <span className="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 transition-transform duration-500 origin-left"></span>
                        </Link>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={fadeInUp}>
                        <Link
                          to="/marketplace"
                          className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3.5 text-base font-medium text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 transition-all duration-300 overflow-hidden"
                        >
                          <span className="relative flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.5 11H19V7C19 5.9 18.1 5 17 5H13V3.5C13 2.12 11.88 1 10.5 1C9.12 1 8 2.12 8 3.5V5H4C2.9 5 2 5.9 2 7V10.8H3.5C5.5 10.8 7 12.3 7 14.3C7 16.3 5.5 17.8 3.5 17.8H2V21C2 22.1 2.9 23 4 23H7.8V21.5C7.8 19.5 9.3 18 11.3 18C13.3 18 14.8 19.5 14.8 21.5V23H18C19.1 23 20 22.1 20 21V16.9H20.5C21.88 16.9 23 15.78 23 14.4C23 13.02 21.88 11 20.5 11Z"
                                fill="currentColor"
                              />
                            </svg>
                            Explore Models
                          </span>
                          <span className="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-accent-purple to-accent-blue transition-transform duration-500 origin-left"></span>
                        </Link>
                      </motion.div>
                      <motion.div variants={fadeInUp}>
                        <Link
                          to="/register"
                          className="group relative inline-flex items-center justify-center rounded-xl bg-white px-6 py-3.5 text-base font-medium dark:bg-dark-400/50 text-accent-blue dark:text-accent-purple shadow-sm ring-1 ring-accent-blue/20 dark:ring-accent-purple/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 transition-all duration-300 overflow-hidden dark:focus:ring-offset-dark-800"
                        >
                          <span className="relative flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16 10V7C16 4.79 14.21 3 12 3C9.79 3 8 4.79 8 7V10C6.9 10 6 10.9 6 12V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V12C18 10.9 17.1 10 16 10ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM14 10H10V7C10 5.9 10.9 5 12 5C13.1 5 14 5.9 14 7V10Z"
                                fill="currentColor"
                              />
                            </svg>
                            Become a Developer
                          </span>
                          <span className="absolute inset-0 -z-10 transform scale-x-0 group-hover:scale-x-100 bg-gradient-to-r from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 transition-transform duration-500 origin-left"></span>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </motion.div>

                {/* Stats */}
                <motion.div
                  variants={staggerContainer}
                  className="mt-12 grid grid-cols-3 gap-5 text-center lg:text-left"
                >
                  <motion.div
                    variants={fadeInUp}
                    className="bg-white dark:bg-dark-400/30 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-300/20 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <p className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-satoshi">
                      500+
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                      <svg
                        className="h-4 w-4 text-accent-blue dark:text-accent-purple"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"
                          fill="currentColor"
                        />
                      </svg>
                      AI Models
                    </p>
                  </motion.div>
                  <motion.div
                    variants={fadeInUp}
                    className="bg-white dark:bg-dark-400/30 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-300/20 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <p className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-satoshi">
                      10K+
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                      <svg
                        className="h-4 w-4 text-accent-blue dark:text-accent-purple"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                          fill="currentColor"
                        />
                      </svg>
                      Active Users
                    </p>
                  </motion.div>
                  <motion.div
                    variants={fadeInUp}
                    className="bg-white dark:bg-dark-400/30 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-100 dark:border-dark-300/20 transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <p className="text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent font-satoshi">
                      99.9%
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center lg:justify-start gap-2">
                      <svg
                        className="h-4 w-4 text-accent-blue dark:text-accent-purple"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z"
                          fill="currentColor"
                        />
                      </svg>
                      Uptime
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="relative mt-12 lg:col-span-6 lg:mt-0 xl:col-span-7"
            >
              <div className="relative mx-auto w-full">
                <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white dark:bg-dark-400/40 backdrop-blur-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5 dark:from-accent-blue/10 dark:to-accent-purple/10"></div>
                  <div className="relative flex justify-center">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center backdrop-blur-sm">
                        🚀
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white font-satoshi">
                        Getting Started
                      </h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Find the perfect AI model or monetize your own creation
                        in just a few steps.
                      </p>
                    </div>
                  </div>
                  <div className="relative border-t border-gray-200 dark:border-gray-700 pt-6">
                    <ol className="space-y-6">
                      <li className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 dark:from-accent-blue/30 dark:to-accent-purple/30 text-accent-blue dark:text-accent-purple font-semibold">
                          1
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {currentUser
                              ? "Browse available models"
                              : "Create your account"}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            {currentUser
                              ? "Explore our marketplace of AI models"
                              : "Sign up as a user or developer"}
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 dark:from-accent-blue/30 dark:to-accent-purple/30 text-accent-blue dark:text-accent-purple font-semibold">
                          2
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {currentUser
                              ? "Subscribe to models or publish your own"
                              : "Browse models or publish your own"}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Get API access or monetize your AI models
                          </p>
                        </div>
                      </li>
                      <li className="flex gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-accent-blue/20 to-accent-purple/20 dark:from-accent-blue/30 dark:to-accent-purple/30 text-accent-blue dark:text-accent-purple font-semibold">
                          3
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Subscribe to models or track your earnings
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Integrate AI into your apps or earn revenue
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose MonetizeAI Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="relative bg-white dark:bg-dark-800 py-16 border-b border-gray-200 dark:border-dark-700/30 transition-colors duration-300"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-accent-blue/5 dark:bg-accent-blue/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent-purple/5 dark:bg-accent-purple/10 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-satoshi">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                MonetizeAI
              </span>
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Simplifying AI model discovery, integration and monetization in
              one powerful platform
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center bg-white dark:bg-dark-400/30 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-dark-300/20 transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H14.82C14.4 1.84 13.3 1 12 1C10.7 1 9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 3C12.55 3 13 3.45 13 4C13 4.55 12.55 5 12 5C11.45 5 11 4.55 11 4C11 3.45 11.45 3 12 3Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="font-satoshi text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                500+
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">AI Models</p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center bg-white dark:bg-dark-400/30 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-dark-300/20 transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="font-satoshi text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                1250+
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Active Users
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center bg-white dark:bg-dark-400/30 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-dark-300/20 transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="font-satoshi text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                300+
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                AI Developers
              </p>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center bg-white dark:bg-dark-400/30 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-dark-300/20 transition-all duration-300 transform hover:scale-105 text-center"
            >
              <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84004 2.4 9.65004 2.57 9.61004 2.81L9.25004 5.35C8.66004 5.59 8.12004 5.92 7.63004 6.29L5.24004 5.33C5.02004 5.25 4.77004 5.33 4.65004 5.55L2.74004 8.87C2.62004 9.08 2.66004 9.34 2.86004 9.48L4.89004 11.06C4.84004 11.36 4.80004 11.69 4.80004 12C4.80004 12.31 4.82004 12.64 4.87004 12.94L2.84004 14.52C2.66004 14.66 2.61004 14.93 2.72004 15.13L4.64004 18.45C4.76004 18.67 5.01004 18.74 5.23004 18.67L7.62004 17.71C8.12004 18.09 8.65004 18.41 9.24004 18.65L9.60004 21.19C9.65004 21.43 9.84004 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.40004 13.98 8.40004 12C8.40004 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="font-satoshi text-3xl font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                5.2M
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">API Calls</p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="relative py-20 bg-gray-50 dark:bg-dark-900 transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 dark:to-accent-blue/5 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-satoshi sm:text-4xl">
              How It{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              A seamless platform connecting AI developers and users
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-10 md:grid-cols-3"
          >
            {/* For Developers */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-dark-400/40 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-dark-300/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-transparent dark:from-accent-blue/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.4 16.6L4.8 12L9.4 7.4L8 6L2 12L8 18L9.4 16.6ZM14.6 16.6L19.2 12L14.6 7.4L16 6L22 12L16 18L14.6 16.6Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-satoshi mb-3 group-hover:text-accent-blue dark:group-hover:text-accent-purple transition-colors duration-300">
                  For Developers
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Publish your AI models with custom pricing, track usage, and
                  earn revenue from your innovations. Our platform makes it easy
                  to manage your model portfolio and reach global customers.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Easy model deployment
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Flexible pricing options
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Detailed analytics dashboard
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* For Users */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-dark-400/40 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-dark-300/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/5 to-transparent dark:from-accent-purple/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-satoshi mb-3 group-hover:text-accent-blue dark:group-hover:text-accent-purple transition-colors duration-300">
                  For Users
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse and select high-quality AI models, track your usage,
                  and access powerful analytics for your AI integration. Find
                  models that fit your specific needs and budget.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Access to premium AI models
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Simple API integration
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Usage-based pricing
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* Marketplace */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group relative bg-white dark:bg-dark-400/40 backdrop-blur-md p-8 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-dark-300/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-accent-teal/5 to-transparent dark:from-accent-teal/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-3 rounded-xl inline-flex items-center justify-center mb-4">
                  <svg
                    className="h-8 w-8 text-accent-blue dark:text-accent-purple"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 18C5.9 18 5.01 18.9 5.01 20C5.01 21.1 5.9 22 7 22C8.1 22 9 21.1 9 20C9 18.9 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20C15.01 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20C19 18.9 18.1 18 17 18Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white font-satoshi mb-3 group-hover:text-accent-blue dark:group-hover:text-accent-purple transition-colors duration-300">
                  Secure Marketplace
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our token transaction system ensures safe and transparent
                  payments between developers and users. We handle the
                  complexity so you can focus on using great AI models.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Secure payment processing
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Token-based system
                  </li>
                  <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 mr-2 text-accent-blue dark:text-accent-purple"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z"
                        fill="currentColor"
                      />
                    </svg>
                    Transparent billing
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Categories Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="relative py-20 bg-white dark:bg-dark-800 transition-colors duration-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/5 via-transparent to-accent-purple/5 dark:from-accent-blue/10 dark:via-transparent dark:to-accent-purple/10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-satoshi sm:text-4xl">
              Popular{" "}
              <span className="bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                AI Categories
              </span>
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              Explore top AI models across different specialized fields
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="group"
            >
              <Link
                to="/marketplace?category=nlp"
                className="block group relative"
              >
                <div className="overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-60 flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <svg
                        className="w-full h-full text-white/5"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 10 0 L 0 0 0 10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                      </svg>
                    </div>
                    <div className="text-center text-white z-10 p-8">
                      <div className="mb-4 bg-white/10 p-4 rounded-xl inline-flex backdrop-blur-sm">
                        <svg
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM15 9H5V7H15V9ZM18 15H5V13H18V15ZM18 11H5V5H18V11ZM17 17H5V19H17V17Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-2xl font-satoshi font-bold tracking-tight">
                        Natural Language Processing
                      </h3>
                      <p className="mt-2 text-white/80">
                        Text generation, translation, classification and more
                      </p>
                      <div className="mt-4 inline-flex items-center text-white font-medium">
                        Explore models
                        <svg
                          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="group"
            >
              <Link
                to="/marketplace?category=computer-vision"
                className="block group relative"
              >
                <div className="overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-pink opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-60 flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <svg
                        className="w-full h-full text-white/5"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <pattern
                            id="dots"
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle cx="5" cy="5" r="1" fill="currentColor" />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#dots)" />
                      </svg>
                    </div>
                    <div className="text-center text-white z-10 p-8">
                      <div className="mb-4 bg-white/10 p-4 rounded-xl inline-flex backdrop-blur-sm">
                        <svg
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-2xl font-satoshi font-bold tracking-tight">
                        Computer Vision
                      </h3>
                      <p className="mt-2 text-white/80">
                        Image recognition, object detection, facial analysis and
                        more
                      </p>
                      <div className="mt-4 inline-flex items-center text-white font-medium">
                        Explore models
                        <svg
                          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              whileHover={{ scale: 1.03 }}
              className="group"
            >
              <Link
                to="/marketplace?category=speech"
                className="block group relative"
              >
                <div className="overflow-hidden rounded-2xl shadow-lg transform transition-all duration-500 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent-teal to-accent-blue opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="h-60 flex items-center justify-center relative">
                    <div className="absolute inset-0">
                      <svg
                        className="w-full h-full text-white/5"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <pattern
                            id="wave"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M0 10 Q5 5, 10 10 T 20 10"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#wave)" />
                      </svg>
                    </div>
                    <div className="text-center text-white z-10 p-8">
                      <div className="mb-4 bg-white/10 p-4 rounded-xl inline-flex backdrop-blur-sm">
                        <svg
                          className="h-12 w-12"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 15C13.66 15 15 13.66 15 12V6C15 4.34 13.66 3 12 3C10.34 3 9 4.34 9 6V12C9 13.66 10.34 15 12 15ZM19 12C19 15.53 16.39 18.47 13 18.93V21H11V18.93C7.61 18.47 5 15.53 5 12H7C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12H19Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <h3 className="mt-2 text-2xl font-satoshi font-bold tracking-tight">
                        Speech Recognition
                      </h3>
                      <p className="mt-2 text-white/80">
                        Speech-to-text, voice synthesis, audio processing and
                        more
                      </p>
                      <div className="mt-4 inline-flex items-center text-white font-medium">
                        Explore models
                        <svg
                          className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeIn}
        className="relative mt-auto"
      >
        <div className="relative w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-purple opacity-90"></div>
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-radial from-white/10 to-transparent"></div>
          <div className="absolute inset-0">
            <svg
              className="w-full h-full text-white/5"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="circuit"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 0 L5 0 L5 5 L10 5 L10 0 L20 0 M0 10 L5 10 L5 15 L10 15 L10 20 L15 20 L15 15 M20 5 L15 5 L15 10 L20 10 M0 20 L5 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#circuit)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 relative">
            <motion.div
              variants={staggerContainer}
              className="lg:grid lg:grid-cols-2 lg:gap-12 items-center"
            >
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl font-satoshi">
                  <span className="block">Ready to get started?</span>
                  <span className="block text-white/80 mt-2">
                    {currentUser
                      ? "Explore more features!"
                      : "Join our platform today."}
                  </span>
                </h2>
                <p className="mt-4 text-white/80 text-lg">
                  {currentUser
                    ? "Discover more AI models or start publishing your own creations to reach a global audience."
                    : "Create an account to access premium AI models or start monetizing your own AI solutions."}
                </p>
                <motion.div variants={fadeInUp} className="mt-8">
                  {currentUser ? (
                    <Link
                      to="/marketplace"
                      className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-accent-blue bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
                            fill="currentColor"
                          />
                        </svg>
                        Explore Marketplace
                      </span>
                    </Link>
                  ) : (
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-xl text-accent-blue bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
                    >
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M15 12C17.21 12 19 10.21 19 8C19 5.79 17.21 4 15 4C12.79 4 11 5.79 11 8C11 10.21 12.79 12 15 12ZM15 6C16.1 6 17 6.9 17 8C17 9.1 16.1 10 15 10C13.9 10 13 9.1 13 8C13 6.9 13.9 6 15 6ZM15 14C12.33 14 7 15.34 7 18V20H23V18C23 15.34 17.67 14 15 14ZM9 18C9.22 17.28 12.31 16 15 16C17.7 16 20.8 17.29 21 18H9ZM6 15V12H9V10H6V7H4V10H1V12H4V15H6Z"
                            fill="currentColor"
                          />
                        </svg>
                        Get Started
                      </span>
                    </Link>
                  )}
                </motion.div>
              </motion.div>
              <motion.div
                variants={fadeInUp}
                className="mt-12 lg:mt-0 relative"
              >
                <div className="hidden lg:block">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="relative mx-auto"
                  >
                    <svg
                      viewBox="0 0 400 300"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-full max-w-lg mx-auto"
                    >
                      <defs>
                        <linearGradient
                          id="ctaGradient"
                          x1="0%"
                          y1="0%"
                          x2="100%"
                          y2="100%"
                        >
                          <stop
                            offset="0%"
                            stopColor="white"
                            stopOpacity="0.2"
                          />
                          <stop
                            offset="100%"
                            stopColor="white"
                            stopOpacity="0.1"
                          />
                        </linearGradient>
                      </defs>
                      <rect
                        x="40"
                        y="40"
                        width="320"
                        height="220"
                        rx="15"
                        fill="url(#ctaGradient)"
                        stroke="white"
                        strokeWidth="2"
                        opacity="0.8"
                      />
                      <circle
                        cx="200"
                        cy="150"
                        r="60"
                        fill="none"
                        stroke="white"
                        strokeWidth="4"
                        strokeDasharray="10 5"
                      />
                      <circle
                        cx="200"
                        cy="150"
                        r="30"
                        fill="white"
                        opacity="0.2"
                      />
                      <path
                        d="M180 150 L230 150 M200 130 L200 170"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                      <rect
                        x="80"
                        y="80"
                        width="80"
                        height="8"
                        rx="4"
                        fill="white"
                        opacity="0.6"
                      />
                      <rect
                        x="80"
                        y="100"
                        width="120"
                        height="8"
                        rx="4"
                        fill="white"
                        opacity="0.6"
                      />
                      <rect
                        x="80"
                        y="220"
                        width="60"
                        height="20"
                        rx="10"
                        fill="white"
                        opacity="0.8"
                      />
                      <rect
                        x="260"
                        y="80"
                        width="40"
                        height="40"
                        rx="8"
                        fill="white"
                        opacity="0.2"
                      />
                      <rect
                        x="270"
                        y="220"
                        width="30"
                        height="8"
                        rx="4"
                        fill="white"
                        opacity="0.6"
                      />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
