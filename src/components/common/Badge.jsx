import React from "react";
import { motion } from "framer-motion";

const variantStyles = {
  primary:
    "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800/30",
  secondary:
    "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300 ring-1 ring-gray-200 dark:ring-gray-700/30",
  success:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 ring-1 ring-green-200 dark:ring-green-800/30",
  danger:
    "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 ring-1 ring-red-200 dark:ring-red-800/30",
  warning:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 ring-1 ring-yellow-200 dark:ring-yellow-800/30",
  info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800/30",
  purple:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 ring-1 ring-purple-200 dark:ring-purple-800/30",
  pink: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 ring-1 ring-pink-200 dark:ring-pink-800/30",
  indigo:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 ring-1 ring-indigo-200 dark:ring-indigo-800/30",
  teal: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 ring-1 ring-teal-200 dark:ring-teal-800/30",
  cyan: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 ring-1 ring-cyan-200 dark:ring-cyan-800/30",
  orange:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 ring-1 ring-orange-200 dark:ring-orange-800/30",
};

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-xs",
  md: "px-2.5 py-0.5 text-xs",
  lg: "px-3 py-1 text-sm",
};

/**
 * Badge Component - Used for tags, status indicators, and other small labels
 */
const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  animate = false,
  ...props
}) => {
  // Get the variant and size styles
  const selectedVariantStyle = variantStyles[variant] || variantStyles.primary;
  const selectedSizeStyle = sizeStyles[size] || sizeStyles.md;

  // Base styles applied to all badges
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full whitespace-nowrap";

  // Combine all styles
  const badgeClasses = `${baseStyles} ${selectedVariantStyle} ${selectedSizeStyle} ${className}`;

  // Animation variants for optional animation support
  const badgeAnimationVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    hover: { scale: 1.1 },
  };

  return animate ? (
    <motion.span
      className={badgeClasses}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={badgeAnimationVariants}
      transition={{ type: "spring", stiffness: 500, damping: 15 }}
      {...props}
    >
      {children}
    </motion.span>
  ) : (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
