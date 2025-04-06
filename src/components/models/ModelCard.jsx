import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../common/Card";
import Badge from "../common/Badge";
import Button from "../common/Button";
import { useTheme } from "../../contexts/ThemeContext";

// Model category icons/emojis mapping
const CATEGORY_ICONS = {
  "text-generation": "✍️",
  "image-generation": "🖼️",
  "text-to-speech": "🔊",
  "speech-to-text": "🎤",
  translation: "🌐",
  "question-answering": "❓",
  "sentiment-analysis": "😊",
  "code-generation": "💻",
  "real-estate": "🏡",
  healthcare: "⚕️",
  finance: "💰",
  education: "🎓",
  legal: "⚖️",
  marketing: "📢",
  other: "🤖",
};

const ModelCard = ({ model, featured = false }) => {
  const { isDark } = useTheme();

  // Define default model data if not provided
  const defaultModel = {
    id: "1",
    name: "AI Model",
    description: "This is an AI model description",
    imageUrl: "https://placehold.co/600x400",
    category: "Other",
    tags: ["AI", "Machine Learning"],
    rating: 4.5,
    reviewCount: 120,
    usageCount: 5800,
    price: {
      type: "usage",
      amount: 0.0012,
      currency: "USD",
    },
    developer: {
      name: "AI Developer",
      verified: true,
    },
  };

  // Merge with defaults for any missing properties
  const modelData = { ...defaultModel, ...model };

  // Get the model category icon (with fallback)
  const categoryKey =
    modelData.category?.toLowerCase().replace(/\s+/g, "-") || "other";
  const categoryIcon = CATEGORY_ICONS[categoryKey] || CATEGORY_ICONS.other;

  // Format price display
  const formatPrice = (price) => {
    if (!price) return "Free";

    if (price.type === "free") return "Free";

    if (price.type === "subscription") {
      return `$${price.amount}/${price.interval}`;
    }

    if (price.type === "usage") {
      // Format very small numbers correctly
      const formattedAmount =
        price.amount < 0.01
          ? `$${price.amount.toFixed(6)}`
          : `$${price.amount.toFixed(2)}`;

      return `${formattedAmount}/token`;
    }

    return `$${price.amount}`;
  };

  // Format usage count
  const formatCount = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Animation for counting up numbers
  const CountUp = ({ value, duration = 2000 }) => {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {value}
      </motion.span>
    );
  };

  return (
    <Card
      animate={true}
      hover={true}
      shadow="lg"
      rounded="2xl"
      padding="none"
      className={`overflow-hidden ${featured ? "lg:col-span-2" : ""}`}
    >
      <Link to={`/model/${modelData.id}`} className="block h-full">
        <div className="flex flex-col h-full">
          {/* Card image */}
          <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-900 overflow-hidden">
            {modelData.imageUrl ? (
              <motion.img
                src={modelData.imageUrl}
                alt={modelData.name}
                className="h-full w-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-5xl">{categoryIcon}</span>
              </div>
            )}

            {/* Badges */}
            <motion.div
              className="absolute top-3 left-3 z-10 flex gap-2 flex-wrap max-w-[80%]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {modelData.featured && (
                <Badge variant="warning" animate={true}>
                  Featured
                </Badge>
              )}
              {modelData.isNew && (
                <Badge variant="success" animate={true}>
                  New
                </Badge>
              )}
              {modelData.trending && (
                <Badge variant="danger" animate={true}>
                  Trending
                </Badge>
              )}
              {modelData.usageCount === 0 && (
                <Badge variant="info" animate={true}>
                  🔥 New
                </Badge>
              )}
            </motion.div>

            {/* Category badge in top right */}
            <div className="absolute top-3 right-3">
              <Badge variant="primary" animate={true} className="pr-3">
                <span className="mr-1.5">{categoryIcon}</span>{" "}
                {modelData.category}
              </Badge>
            </div>
          </div>

          {/* Card content */}
          <div className="flex flex-col p-5 flex-grow">
            {/* Model name and verified badge */}
            <div className="flex items-start justify-between mb-2">
              <motion.h3
                className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1"
                whileHover={{ x: 3 }}
              >
                {modelData.name}
                {modelData.developer?.verified && (
                  <motion.svg
                    className="inline-block ml-1 h-5 w-5 text-blue-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    />
                  </motion.svg>
                )}
              </motion.h3>

              {/* Rating */}
              {modelData.rating && (
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    {modelData.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                    ({modelData.reviewCount})
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300 flex-grow line-clamp-2">
              {modelData.description}
            </p>

            {/* Tags */}
            {modelData.tags && modelData.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {modelData.tags.map((tag, index) => (
                  <Badge
                    key={`${tag}-${index}`}
                    variant={
                      isDark
                        ? "secondary"
                        : ["cyan", "teal", "indigo", "purple", "pink"][
                            index % 5
                          ]
                    }
                    size="sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Developer info */}
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
              <span className="font-medium mr-1">By:</span>
              <span>{modelData.developer?.name}</span>
            </div>

            {/* Usage and Price */}
            <div className="mt-auto grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Usage
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <CountUp value={formatCount(modelData.usageCount)} />
                </p>
                {modelData.usageCount === 0 && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Newly published
                  </p>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-slate-700/30 rounded-xl p-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Price
                </p>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  <CountUp value={formatPrice(modelData.price)} />
                </p>
                {modelData.price?.type === "usage" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Per token
                  </p>
                )}
              </div>
            </div>

            {/* Action Button */}
            <Button
              to={`/model/${modelData.id}`}
              variant="primary"
              size="lg"
              fullWidth
              className="rounded-full mt-3"
            >
              View Details
            </Button>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ModelCard;
