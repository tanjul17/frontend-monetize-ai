import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Check for user's preferred theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  // Determine the appropriate dashboard based on user role
  const getDashboardLink = () => {
    // This is a simple example - you'd likely have more sophisticated role detection
    return currentUser?.isAdmin ? "/admin-dashboard" : "/dashboard";
  };

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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-950 py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-5">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  MonetizeAI Marketplace
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                  The platform that connects AI model developers with users. Publish your models, set pricing, and reach a global audience or discover and use cutting-edge AI models for your applications.
                </p>
                <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 lg:justify-start justify-center">
                  {currentUser ? (
                    <>
                      <Link
                        to={getDashboardLink()}
                        className="rounded-md bg-blue-600 dark:bg-blue-700 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Go to Dashboard
                      </Link>
                      <Link
                        to="/marketplace"
                        className="rounded-md bg-white dark:bg-gray-800 px-6 py-3.5 text-base font-medium text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-200 dark:ring-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Explore Models
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/marketplace"
                        className="rounded-md bg-blue-600 dark:bg-blue-700 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Explore Models
                      </Link>
                      <Link
                        to="/register"
                        className="rounded-md bg-white dark:bg-gray-800 px-6 py-3.5 text-base font-medium text-blue-700 dark:text-blue-300 shadow-sm ring-1 ring-blue-200 dark:ring-blue-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300"
                      >
                        Become a Developer
                      </Link>
                    </>
                  )}
                </div>
                
                {/* Simple Statistics */}
                <div className="mt-12 grid grid-cols-3 gap-5 text-center lg:text-left">
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">AI Models</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">99.9%</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative mt-12 lg:col-span-6 lg:mt-0 xl:col-span-7">
              <div className="relative mx-auto w-full">
                <div className="overflow-hidden rounded-lg shadow-xl bg-white dark:bg-gray-800 p-8 transition-colors duration-300">
                  <div className="flex justify-center">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-4">🚀</div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Getting Started</h3>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">
                        Find the perfect AI model or monetize your own creation in just a few steps.
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">1</span>
                        <span className="text-gray-700 dark:text-gray-300">{currentUser ? 'Browse available models' : 'Create your account'}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">2</span>
                        <span className="text-gray-700 dark:text-gray-300">{currentUser ? 'Subscribe to models or publish your own' : 'Browse models or publish your own'}</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold">3</span>
                        <span className="text-gray-700 dark:text-gray-300">Subscribe to models or track your earnings</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white dark:bg-gray-800 py-10 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Choose MonetizeAI</h2>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">Simplifying AI model discovery, integration and monetization</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">AI Models</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">1250+</div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">Active Users</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">300+</div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">AI Developers</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">5.2M</div>
              <p className="mt-2 text-gray-600 dark:text-gray-300">API Calls</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              A seamless platform connecting AI developers and users
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* For Developers */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                For Developers
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Publish your AI models with custom pricing, track usage, and
                earn revenue from your innovations. Our platform makes it easy
                to manage your model portfolio and reach global customers.
              </p>
            </div>

            {/* For Users */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
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
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                For Users
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Browse and select high-quality AI models, track your usage,
                and access powerful analytics for your AI integration. Find models
                that fit your specific needs and budget.
              </p>
            </div>

            {/* Marketplace */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full transform hover:scale-105 transition-all duration-300">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-md p-2 inline-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600 dark:text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                Secure Marketplace
              </h3>
              <p className="mt-2 text-base text-gray-500 dark:text-gray-300">
                Our token transaction system ensures safe and transparent
                payments between developers and users. We handle the complexity
                so you can focus on using great AI models.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="py-12 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Popular AI Categories
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              Explore top AI models across different specialized fields
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Link to="/marketplace?category=nlp" className="block group">
              <div className="overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 dark:from-blue-600 dark:to-blue-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="text-4xl">🔠</span>
                    <h3 className="mt-2 text-xl font-medium">Natural Language Processing</h3>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/marketplace?category=computer-vision" className="block group">
              <div className="overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                <div className="h-40 bg-gradient-to-r from-purple-400 to-purple-600 dark:from-purple-600 dark:to-purple-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="text-4xl">👁</span>
                    <h3 className="mt-2 text-xl font-medium">Computer Vision</h3>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link to="/marketplace?category=speech" className="block group">
              <div className="overflow-hidden rounded-lg shadow-md transform hover:scale-105 transition-all duration-300">
                <div className="h-40 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-600 dark:to-green-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <span className="text-4xl">🎤</span>
                    <h3 className="mt-2 text-xl font-medium">Speech Recognition</h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700 dark:bg-blue-900 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-blue-200">
              {currentUser ? 'Explore more features!' : 'Join our platform today.'}
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              {currentUser ? (
                <Link
                  to="/marketplace"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 dark:text-blue-900 bg-white dark:bg-blue-50 hover:bg-blue-50 dark:hover:bg-white transition-all duration-300 transform hover:scale-105"
                >
                  Explore Marketplace
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 dark:text-blue-900 bg-white dark:bg-blue-50 hover:bg-blue-50 dark:hover:bg-white transition-all duration-300 transform hover:scale-105"
                >
                  Get Started
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;