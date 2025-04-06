import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Variant styles for different button types
const variantStyles = {
  primary:
    "bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 shadow-md hover:shadow-lg dark:shadow-primary-900/20 focus:ring-primary-500",
  secondary:
    "bg-white text-gray-800 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-200 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700 dark:border-slate-700 dark:shadow-slate-900/10 focus:ring-gray-500",
  outline:
    "bg-transparent text-primary-600 hover:bg-primary-50 border border-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:border-primary-500/60 focus:ring-primary-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 shadow-md hover:shadow-lg dark:shadow-red-900/20 focus:ring-red-500",
  success:
    "bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 shadow-md hover:shadow-lg dark:shadow-green-900/20 focus:ring-green-500",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800 focus:ring-gray-500",
};

// Size styles
const sizeStyles = {
  xs: "py-1 px-2 text-xs rounded",
  sm: "py-1.5 px-3 text-sm rounded-md",
  md: "py-2 px-4 text-sm rounded-lg",
  lg: "py-2.5 px-5 text-base rounded-xl",
  xl: "py-3 px-6 text-lg rounded-xl",
};

// Base class that all buttons share
const baseClass =
  "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed";

/**
 * Button Component - Supports regular buttons, link buttons, and different variants
 *
 * @param {string} variant - Button style variant (primary, secondary, outline, ghost, danger, success)
 * @param {string} size - Button size (xs, sm, md, lg, xl)
 * @param {string} to - If provided, renders as Link component to this path
 * @param {boolean} fullWidth - Whether the button should take full width
 * @param {boolean} animate - Whether to apply animation effects
 * @param {React.ReactNode} leftIcon - Icon element to show before button text
 * @param {React.ReactNode} rightIcon - Icon element to show after button text
 * @param {string} className - Additional CSS classes
 */
const Button = ({
  children,
  variant = "primary",
  size = "md",
  to,
  type = "button",
  fullWidth = false,
  animate = true,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  className = "",
  ...props
}) => {
  // Combine all the classes
  const buttonClass = `
    ${baseClass} 
    ${variantStyles[variant] || variantStyles.primary} 
    ${sizeStyles[size] || sizeStyles.md}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  // Animation variants
  const buttonVariants = {
    hover: { scale: 1.03 },
    tap: { scale: 0.97 },
  };

  // If 'to' prop exists, render as Link
  if (to) {
    return (
      <motion.div
        whileHover={animate && !disabled ? "hover" : undefined}
        whileTap={animate && !disabled ? "tap" : undefined}
        variants={buttonVariants}
      >
        <Link to={to} className={buttonClass} {...props}>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </Link>
      </motion.div>
    );
  }

  // Otherwise render as button
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClass}
      whileHover={animate && !disabled ? "hover" : undefined}
      whileTap={animate && !disabled ? "tap" : undefined}
      variants={buttonVariants}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;
