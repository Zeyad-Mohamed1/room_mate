"use client";

import Link from "next/link";
import {
  MapPin,
  ArrowLeft,
  BedDouble,
  Home,
  Flag,
  Badge,
  Share2,
  Heart,
  Star,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useFavorite } from "@/hooks/useFavorite";
import { toast } from "react-hot-toast";
import PropertyRating from "./PropertyRating";
import { useState, useEffect } from "react";
import { useIsAdmin } from "@/utils/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/ui/rating-stars";
import { addAdminRating } from "@/actions/admin-ratings";

interface PropertyHeaderProps {
  title: string;
  location: string;
  type: "house" | "room";
  roomType: "mixed" | "single";
  propertyId: string;
  rating: number;
  totalRatings: number;
  adminRating?: number;
  hasAdminRating?: boolean;
}

export default function PropertyHeader({
  title,
  location,
  type,
  roomType,
  propertyId,
  rating,
  totalRatings,
  adminRating,
  hasAdminRating,
}: PropertyHeaderProps) {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite({ propertyId });
  const isAdmin = useIsAdmin();
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [adminComment, setAdminComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Set initial admin rating if it exists
  useEffect(() => {
    if (adminRating && hasAdminRating) {
      setUserRating(adminRating);
    }
  }, [adminRating, hasAdminRating]);

  // Check if viewport is mobile size
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: window.location.href,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAdminRatingChange = (value: number) => {
    setUserRating(value);
  };

  const handleAdminRatingSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addAdminRating({
        propertyId,
        score: userRating,
        comment: adminComment.trim() || undefined,
      });

      if (result.success) {
        toast.success("Rating added successfully");
        setIsRatingModalOpen(false);
        // Refresh the page to show the updated rating
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to add rating");
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to add rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative mb-8">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        <span>Back to Properties</span>
      </Link>

      {/* Property Title */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShareClick}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Share2 className="h-4 w-4 mr-1.5" />
            Share
          </button>
          <button
            onClick={toggleFavorite}
            disabled={isLoading}
            className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium"
          >
            <Heart
              className={`h-4 w-4 mr-1.5 ${isFavorite ? "text-red-500 fill-current" : ""
                }`}
            />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* Property info */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1.5" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center text-gray-600">
            {type === "house" ? (
              <Home className="h-4 w-4 mr-1.5" />
            ) : (
              <BedDouble className="h-4 w-4 mr-1.5" />
            )}
            <span>
              {type === "house" ? "House" : "Room"} •{" "}
              {roomType === "mixed" ? "Mixed" : "Single"}
            </span>
          </div>

          {/* Property Rating */}
          <div className="flex items-center">
            {totalRatings > 0 ? (
              <PropertyRating rating={rating} totalRatings={totalRatings} />
            ) : (
              <PropertyRating rating={0} totalRatings={0} />
            )}

            {isAdmin && (
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm flex items-center"
                title="Add admin rating"
              >
                <Star className={`h-4 w-4 ${hasAdminRating ? "fill-yellow-400" : ""}`} />
                {hasAdminRating && <span className="ml-1 text-xs">{adminRating?.toFixed(1)}</span>}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Admin Rating Modal */}
      {isAdmin && (
        <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
          <DialogContent className={`${isMobile ? 'w-[90vw]' : 'sm:max-w-md'} p-4 sm:p-6`}>
            <DialogHeader className="pb-2">
              <DialogTitle className="text-center text-xl font-semibold">
                {hasAdminRating ? "Update Admin Rating" : "Add Admin Rating"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2 sm:py-4">
              <div className="flex flex-col items-center space-y-3">
                <span className="text-sm text-gray-500">
                  Rate this property (1-5 stars)
                </span>
                <RatingStars
                  rating={userRating}
                  size={isMobile ? "md" : "lg"}
                  interactive={true}
                  onRatingChange={handleAdminRatingChange}
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  placeholder="Add a comment (optional)"
                  value={adminComment}
                  onChange={(e) => setAdminComment(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsRatingModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAdminRatingSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : hasAdminRating ? "Update Rating" : "Submit Rating"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
