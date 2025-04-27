"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyFavorites() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-xl shadow-soft">
      <div className="bg-gray-50 p-6 rounded-full mb-6">
        <Heart className="h-16 w-16 text-gray-400" strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-semibold mb-3 text-gradient">
        No Favorites Yet
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        You haven&apos;t saved any properties to your favorites yet. Start
        browsing and save properties you&apos;re interested in.
      </p>
      <Button
        asChild
        size="lg"
        className="px-8 rounded-full bg-gradient hover:bg-gradient-dark"
      >
        <Link href="/">Browse Properties</Link>
      </Button>
    </div>
  );
}
