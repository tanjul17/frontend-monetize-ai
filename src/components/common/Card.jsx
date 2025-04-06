import React from "react";
import { motion } from "framer-motion";

/**
 * Card Component - A flexible card component for displaying content with animation support
 */
const Card = ({
  children,
  className = "",
  animate = false,
  hover = false,
  shadow = "md", // none, sm, md, lg, xl
  padding = "lg", // none, sm, md, lg, xl
  rounded = "lg", // none, sm, md, lg, xl, 2xl, full
  border = true,
  ...props
}) => {
  // Shadow variants
  const shadowVariants = {
    none: "",
    sm: "shadow-sm dark:shadow-slate-900/10",
    md: "shadow-md dark:shadow-slate-900/20",
    lg: "shadow-lg dark:shadow-slate-900/30",
    xl: "shadow-xl dark:shadow-slate-900/40",
  };

  // Padding variants
  const paddingVariants = {
    none: "p-0",
    sm: "p-2",
    md: "p-3",
    lg: "p-4 sm:p-5",
    xl: "p-5 sm:p-6",
  };

  // Border radius variants
  const roundedVariants = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  // Build classes
  const cardClasses = `
    bg-white dark:bg-slate-800 
    ${shadowVariants[shadow] || shadowVariants.md} 
    ${paddingVariants[padding] || paddingVariants.lg} 
    ${roundedVariants[rounded] || roundedVariants.lg} 
    ${border ? "border border-gray-200 dark:border-slate-700/60" : ""} 
    transition-all duration-200
    ${className}
  `;

  // Animation variants
  const cardAnimationVariants = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    },
  };

  // If animation is enabled, render with motion
  if (animate) {
    return (
      <motion.div
        className={cardClasses}
        initial="initial"
        animate="animate"
        variants={cardAnimationVariants}
        whileHover={hover ? "hover" : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  // Otherwise render as regular div
  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;
