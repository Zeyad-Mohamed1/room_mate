"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating?: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function RatingStars({
  rating = 0,
  maxRating = 5,
  size = "md",
  color = "text-amber-400",
  interactive = false,
  onRatingChange,
  className,
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(rating);

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const handleClick = (index: number) => {
    if (!interactive) return;
    setSelectedRating(index);
    onRatingChange?.(index);
  };

  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const currentRating = hoverRating || selectedRating || rating;

  return (
    <div className={cn("flex", className)}>
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const filled = starValue <= currentRating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              "cursor-default transition-colors",
              interactive && "cursor-pointer hover:scale-110"
            )}
            disabled={!interactive}
            tabIndex={interactive ? 0 : -1}
            aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled ? `${color} fill-current` : "text-gray-300",
                "transition-all duration-100"
              )}
              strokeWidth={2}
            />
          </button>
        );
      })}
    </div>
  );
}
