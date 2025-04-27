"use client";

import { Heart } from "lucide-react";

interface FavoritesHeaderProps {
  count: number;
}

export default function FavoritesHeader({ count }: FavoritesHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gradient">
          Your Favorites
        </h1>
        <div className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium flex items-center">
          <Heart className="h-4 w-4 mr-1 fill-current" />
          {count}
        </div>
      </div>
      <p className="text-gray-600">
        You have {count} {count === 1 ? "property" : "properties"} saved to your
        favorites
      </p>
    </div>
  );
}
