import { Heart } from "lucide-react";
import { useFavorite } from "@/hooks/useFavorite";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  variant?: "icon" | "button";
  size?: "sm" | "md" | "lg";
}

const FavoriteButton = ({
  propertyId,
  className,
  variant = "icon",
  size = "md",
}: FavoriteButtonProps) => {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite({ propertyId });

  const sizeClasses = {
    sm: {
      button: "py-1 px-3 text-xs",
      icon: "p-1.5",
      heartIcon: "h-4 w-4",
    },
    md: {
      button: "py-2 px-4 text-sm",
      icon: "p-2",
      heartIcon: "h-5 w-5",
    },
    lg: {
      button: "py-2.5 px-5 text-base",
      icon: "p-2.5",
      heartIcon: "h-6 w-6",
    },
  };

  if (variant === "icon") {
    return (
      <button
        onClick={toggleFavorite}
        disabled={isLoading}
        className={cn(
          "bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer",
          sizeClasses[size].icon,
          className
        )}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={cn(
            sizeClasses[size].heartIcon,
            isFavorite ? "text-red-500 fill-current" : "text-gray-400",
            isLoading ? "opacity-50" : ""
          )}
          strokeWidth={2}
        />
      </button>
    );
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={cn(
        "flex items-center gap-1.5 rounded-lg font-medium transition-colors",
        isFavorite
          ? "bg-red-50 text-red-500 hover:bg-red-100"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer",
        sizeClasses[size].button,
        className
      )}
    >
      <Heart
        className={cn(
          sizeClasses[size].heartIcon,
          isFavorite ? "text-red-500 fill-current" : "text-gray-500"
        )}
        strokeWidth={2}
      />
      {isFavorite ? "Saved" : "Save"}
    </button>
  );
};

export default FavoriteButton;
