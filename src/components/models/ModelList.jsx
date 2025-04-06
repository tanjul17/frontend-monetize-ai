import React, { useState } from "react";
import { motion } from "framer-motion";
import ModelCard from "./ModelCard";
import Card from "../common/Card";

const ModelList = ({ models = [], title = "AI Models" }) => {
  const [hoveredId, setHoveredId] = useState(null);

  // No models yet state
  if (models.length === 0) {
    return (
      <Card animate={true} className="p-6 text-center">
        <div className="text-4xl mb-4">🔍</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No models found
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Try adjusting your filters or check back later for new models.
        </p>
      </Card>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div className="w-full">
      <motion.h2
        className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h2>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {models.map((model, index) => (
          <motion.div
            key={model.id}
            variants={itemVariants}
            custom={index}
            onHoverStart={() => setHoveredId(model.id)}
            onHoverEnd={() => setHoveredId(null)}
          >
            <ModelCard
              model={model}
              featured={index === 0 && models.length > 3}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ModelList;
