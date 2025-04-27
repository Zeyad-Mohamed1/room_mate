"use client";

import { useState } from "react";
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
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  propertyTitle: string;
  onSuccess?: () => void;
}

export default function RatingModal({
  isOpen,
  onClose,
  bookingId,
  propertyTitle,
  onSuccess,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/ratings", {
        bookingId,
        score: rating,
        comment: comment.trim() || undefined,
      });

      if (response.data.success) {
        toast.success("Rating submitted successfully");
        setRating(0);
        setComment("");
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.error || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Rate Your Experience
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-center text-gray-600 text-sm">
            How was your experience with {propertyTitle || "this property"}?
          </p>

          <div className="flex justify-center pt-2 pb-4">
            <RatingStars
              rating={rating}
              interactive={true}
              size="lg"
              onRatingChange={handleRatingChange}
            />
          </div>

          <Textarea
            placeholder="Share your experience (optional)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter className="sm:justify-center gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
