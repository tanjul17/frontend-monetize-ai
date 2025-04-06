import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import TokenDisplay from "../TokenDisplay";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [previousPath, setPreviousPath] = useState("/");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track route changes to highlight active nav link
  useEffect(() => {
    setPreviousPath(location.pathname);
  }, [location.pathname]);

  // Add scroll effect to navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsProfileOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Dropdown animation
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Mobile menu animation
  const mobileMenuVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  // Hamburger button animation
  const lineVariants = {
    closed: { rotate: 0, y: 0 },
    open: (custom) => {
      switch (custom) {
        case 1:
          return { rotate: 45, y: 6 };
        case 2:
          return { opacity: 0 };
        case 3:
          return { rotate: -45, y: -6 };
        default:
          return {};
      }
    },
  };

  // Check if a nav link is active
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Logo animation
  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 dark:bg-dark-800/70 backdrop-blur-md border-b border-gray-100 dark:border-dark-300/20 shadow-sm dark:shadow-dark-900/10 py-2"
          : "bg-white/30 dark:bg-dark-800/30 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <motion.div
                initial="initial"
                whileHover="hover"
                variants={logoVariants}
              >
                <Link
                  to="/"
                  className="text-xl font-bold flex items-center group"
                >
                  <motion.span
                    className="mr-2 text-2xl bg-gradient-to-br from-accent-blue/10 to-accent-purple/10 dark:from-accent-blue/20 dark:to-accent-purple/20 p-2 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10 dark:border-white/5 shadow-sm group-hover:shadow-md transition-all duration-300"
                    whileHover={{
                      rotate: [0, -10, 10, -5, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    🧠
                  </motion.span>
                  <span className="font-satoshi font-bold bg-gradient-to-r from-accent-blue to-accent-purple bg-clip-text text-transparent">
                    MonetizeAI
                  </span>
                </Link>
              </motion.div>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <NavLink path="/" label="Home" isActive={isActive("/")} />

              {currentUser && (
                <NavLink
                  path="/dashboard"
                  label="Dashboard"
                  isActive={isActive("/dashboard")}
                />
              )}

              {currentUser?.role === "developer" && (
                <>
                  <NavLink
                    path="/models"
                    label="My Models"
                    isActive={isActive("/models")}
                  />
                  <NavLink
                    path="/developer-dashboard"
                    label="Analytics"
                    isActive={
                      isActive("/developer-dashboard") ||
                      isActive("/model-analytics")
                    }
                  />
                </>
              )}

              {currentUser && (
                <NavLink
                  path="/marketplace"
                  label="AI Marketplace"
                  isActive={isActive("/marketplace")}
                />
              )}

              {currentUser && (
                <NavLink
                  path="/models/published"
                  label="Published Models"
                  isActive={isActive("/models/published")}
                />
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            <ThemeToggle />

            {currentUser && <TokenDisplay />}

            {!currentUser ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-300/30 dark:hover:bg-dark-300/50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-purple hover:to-accent-blue text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleProfile}
                    className="rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-blue dark:focus:ring-offset-dark-800 transition-all duration-300 group"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent-blue/30 to-accent-purple/30 dark:from-accent-blue/50 dark:to-accent-purple/50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <span className="text-accent-blue dark:text-white font-semibold text-sm">
                        {(
                          currentUser.profile?.name ||
                          currentUser.email ||
                          "User"
                        )
                          .substring(0, 1)
                          .toUpperCase()}
                      </span>
                    </div>
                  </button>
                </div>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={dropdownVariants}
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-xl py-1 bg-white/90 dark:bg-dark-400/90 backdrop-blur-md border border-gray-100 dark:border-dark-300/20 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <ProfileLink
                        to={
                          currentUser?.role === "developer"
                            ? "/dev-profile"
                            : "/user-profile"
                        }
                        label="Your Profile"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <ProfileLink
                        to="/dashboard"
                        label="Dashboard"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      {currentUser?.role === "developer" && (
                        <>
                          <ProfileLink
                            to="/models"
                            label="My Models"
                            onClick={() => setIsProfileOpen(false)}
                          />
                          <ProfileLink
                            to="/developer-dashboard"
                            label="Analytics"
                            onClick={() => setIsProfileOpen(false)}
                          />
                        </>
                      )}

                      <ProfileLink
                        to="/token-history"
                        label="Token History"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <ProfileLink
                        to="/buy-tokens"
                        label="Buy More Tokens"
                        onClick={() => setIsProfileOpen(false)}
                      />

                      <div>
                        <button
                          onClick={handleLogout}
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300/30 w-full text-left transition-colors duration-300"
                          role="menuitem"
                        >
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            {/* Mobile theme toggle */}
            <ThemeToggle />

            {/* Hamburger menu button */}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300/30 focus:outline-none transition-colors duration-300"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  custom={1}
                  variants={lineVariants}
                  animate={isMenuOpen ? "open" : "closed"}
                  className="w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full my-0.5 transform transition-all duration-300"
                ></motion.span>
                <motion.span
                  custom={2}
                  variants={lineVariants}
                  animate={isMenuOpen ? "open" : "closed"}
                  className="w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full my-0.5 transform transition-all duration-300"
                ></motion.span>
                <motion.span
                  custom={3}
                  variants={lineVariants}
                  animate={isMenuOpen ? "open" : "closed"}
                  className="w-4 h-0.5 bg-gray-700 dark:bg-gray-300 rounded-full my-0.5 transform transition-all duration-300"
                ></motion.span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="sm:hidden overflow-hidden"
          >
            <div className="pt-2 pb-3 space-y-1 px-4 sm:px-6 lg:px-8 bg-white/90 dark:bg-dark-400/90 backdrop-blur-md border-t border-gray-100 dark:border-dark-300/20">
              <MobileNavLink
                path="/"
                label="Home"
                isActive={isActive("/")}
                onClick={() => setIsMenuOpen(false)}
              />

              {currentUser && (
                <MobileNavLink
                  path="/dashboard"
                  label="Dashboard"
                  isActive={isActive("/dashboard")}
                  onClick={() => setIsMenuOpen(false)}
                />
              )}

              {currentUser?.role === "developer" && (
                <>
                  <MobileNavLink
                    path="/models"
                    label="My Models"
                    isActive={isActive("/models")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink
                    path="/developer-dashboard"
                    label="Analytics"
                    isActive={
                      isActive("/developer-dashboard") ||
                      isActive("/model-analytics")
                    }
                    onClick={() => setIsMenuOpen(false)}
                  />
                </>
              )}

              {currentUser && (
                <MobileNavLink
                  path="/marketplace"
                  label="AI Marketplace"
                  isActive={isActive("/marketplace")}
                  onClick={() => setIsMenuOpen(false)}
                />
              )}

              {currentUser && (
                <MobileNavLink
                  path="/models/published"
                  label="Published Models"
                  isActive={isActive("/models/published")}
                  onClick={() => setIsMenuOpen(false)}
                />
              )}

              {currentUser && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                  <MobileNavLink
                    path={
                      currentUser?.role === "developer"
                        ? "/dev-profile"
                        : "/user-profile"
                    }
                    label="Your Profile"
                    isActive={
                      isActive("/user-profile") || isActive("/dev-profile")
                    }
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink
                    path="/token-history"
                    label="Token History"
                    isActive={isActive("/token-history")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <MobileNavLink
                    path="/buy-tokens"
                    label="Buy More Tokens"
                    isActive={isActive("/buy-tokens")}
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        handleLogout();
                      }}
                      className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300/30 w-full text-left transition-colors duration-300 rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}

              {!currentUser && (
                <>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-3"></div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link
                      to="/login"
                      className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-300/30 dark:hover:bg-dark-300/50 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-accent-blue to-accent-purple hover:from-accent-purple hover:to-accent-blue text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Desktop navigation link
const NavLink = ({ path, label, isActive }) => {
  return (
    <Link
      to={path}
      className={`inline-flex items-center px-1 pt-1 text-sm font-medium border-b-2 transition-colors duration-300 ${
        isActive
          ? "border-accent-blue dark:border-accent-purple text-gray-900 dark:text-white"
          : "border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
};

// Mobile navigation link
const MobileNavLink = ({ path, label, isActive, onClick }) => {
  return (
    <Link
      to={path}
      className={`block pl-3 pr-4 py-2 text-base font-medium rounded-md transition-colors duration-300 ${
        isActive
          ? "bg-gray-100 dark:bg-dark-300/30 text-gray-900 dark:text-white"
          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-300/30 hover:text-gray-900 dark:hover:text-white"
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

// Profile menu link
const ProfileLink = ({ to, label, onClick }) => {
  return (
    <Link
      to={to}
      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-dark-300/30 transition-colors duration-300"
      role="menuitem"
      onClick={onClick}
    >
      {label}
    </Link>
  );
};

export default Navbar;
