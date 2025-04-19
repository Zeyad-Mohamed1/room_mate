"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyFavorites = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Heart className="h-12 w-12 text-gray-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
      <p className="text-gray-500 max-w-md mb-6">
        You haven&apos;t saved any properties to your favorites yet. Start
        browsing and save properties you&apos;re interested in.
      </p>
      <Button asChild>
        <Link href="/properties">Browse Properties</Link>
      </Button>
    </div>
  );
};

export default EmptyFavorites;
