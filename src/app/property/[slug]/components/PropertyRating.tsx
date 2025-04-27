"use client";

import { Star } from "lucide-react";
import { RatingStars } from "@/components/ui/rating-stars";

interface PropertyRatingProps {
  rating: number;
  totalRatings: number;
}

export default function PropertyRating({
  rating,
  totalRatings,
}: PropertyRatingProps) {
  const displayRating = Math.round(rating * 10) / 10; // Round to 1 decimal place

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        <RatingStars rating={rating} size="md" />
      </div>
      <div className="flex items-center text-sm">
        <span className="font-medium">{displayRating}</span>
        <span className="mx-1 text-gray-400">•</span>
        <span className="text-gray-600">
          {totalRatings} {totalRatings === 1 ? "rating" : "ratings"}
        </span>
      </div>
    </div>
  );
}
