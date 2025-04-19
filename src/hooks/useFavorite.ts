import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface UseFavoriteProps {
  propertyId: string;
}

export const useFavorite = ({ propertyId }: UseFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const fetchFavoriteStatus = useCallback(async () => {
    if (!session?.user) return;

    try {
      setIsLoading(true);
      const response = await axios.get("/api/favorites");
      const { favorites } = response.data;
      const isFav = favorites.some((fav: any) => fav.id === propertyId);
      setIsFavorite(isFav);
    } catch (error) {
      console.error("Error fetching favorite status:", error);
    } finally {
      setIsLoading(false);
    }
  }, [propertyId, session?.user]);

  // Check if the property is in user's favorites on component mount or when session changes
  useEffect(() => {
    if (session?.user) {
      fetchFavoriteStatus();
    }
  }, [session, fetchFavoriteStatus]);

  const toggleFavorite = async (e?: React.MouseEvent) => {
    e?.preventDefault();

    if (!session?.user) {
      toast.error("Please login to add to favorites");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("/api/favorites", { propertyId });
      setIsFavorite(response.data.isFavorite);
      toast.success(
        response.data.isFavorite
          ? "Added to favorites"
          : "Removed from favorites"
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isFavorite,
    isLoading,
    toggleFavorite,
  };
};
