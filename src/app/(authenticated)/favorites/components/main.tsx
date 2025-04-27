"use client";

import { useQuery } from "@tanstack/react-query";
import EmptyFavorites from "./EmptyFavorites";
import FavoritesHeader from "./FavoritesHeader";
import FavoritesList from "./FavoritesList";
import { getFavorites } from "@/actions/properties";
import { Loader2 } from "lucide-react";
export default function FavoritesMain() {
  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: getFavorites,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
      <FavoritesHeader count={favorites?.length || 0} />

      {favorites?.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <FavoritesList properties={favorites || []} />
      )}
    </main>
  );
}
