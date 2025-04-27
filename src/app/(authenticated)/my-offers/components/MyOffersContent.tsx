"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Home, Check, X, Clock, ExternalLink } from "lucide-react";
import { getMySubmittedOffers } from "@/actions/offers";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { formatPriceWithTime } from "@/utils/formatters";
import { Button } from "@/components/ui/button";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { toast } from "react-hot-toast";

// Helper function to call the server-side API
async function cancelOffer(offerId: string) {
  const response = await fetch(`/api/offers/${offerId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to cancel offer");
  }

  return response.json();
}

export default function MyOffersContent() {
  const queryClient = useQueryClient();
  const { data: offers, isLoading } = useQuery({
    queryKey: ["my-submitted-offers"],
    queryFn: async () => getMySubmittedOffers(),
  });

  // Mutation for cancelling an offer
  const cancelOfferMutation = useMutation({
    mutationFn: cancelOffer,
    onSuccess: () => {
      // Invalidate the my-submitted-offers query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["my-submitted-offers"] });
      toast.success("Offer cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCancelOffer = (offerId: string) => {
    if (confirm("Are you sure you want to cancel this offer?")) {
      cancelOfferMutation.mutate(offerId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Submitted Offers</h1>

      {!offers || offers.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Home className="h-8 w-8 text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No offers yet</h2>
          <p className="text-gray-600 mb-6">
            You haven't submitted any offers on properties yet.
          </p>
          <Link href="/search">
            <Button className="bg-primary">Browse Properties</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {offers.map((offer) => {
            const initials = getInitials(offer.property.owner.name);
            const bgColor = getAvatarColor(offer.property.owner.name);

            return (
              <div
                key={offer.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {offer.property.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {offer.property.address}, {offer.property.city}
                    </p>
                  </div>
                  <Link
                    href={`/property/${offer.property.slug}`}
                    className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                  >
                    <span>View Property</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Status:
                          </span>
                          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                            {offer.status === "pending" && (
                              <span className="flex items-center text-amber-600">
                                <Clock className="h-3 w-3 mr-1" /> Pending
                              </span>
                            )}
                            {offer.status === "accepted" && (
                              <span className="flex items-center text-green-600">
                                <Check className="h-3 w-3 mr-1" /> Accepted
                              </span>
                            )}
                            {offer.status === "rejected" && (
                              <span className="flex items-center text-red-600">
                                <X className="h-3 w-3 mr-1" /> Rejected
                              </span>
                            )}
                            {offer.status === "cancelled" && (
                              <span className="flex items-center text-gray-600">
                                <X className="h-3 w-3 mr-1" /> Cancelled
                              </span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Your Offer</p>
                          <p className="text-lg font-semibold text-blue-600">
                            ${offer.price}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Listed Price</p>
                          <p className="text-lg">
                            {formatPriceWithTime(
                              offer.property.price || "0",
                              offer.property.paymentTime
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-700 font-medium mb-1">
                          Your Message:
                        </p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {offer.message}
                        </p>
                      </div>

                      <p className="text-xs text-gray-500">
                        Submitted on {formatDate(offer.createdAt.toString())}
                      </p>
                    </div>

                    <div className="border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex-shrink-0 md:w-64">
                      <p className="text-sm text-gray-500 mb-3">
                        Property Owner
                      </p>
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 flex items-center justify-center">
                          <div
                            className={`${bgColor} w-full h-full flex items-center justify-center text-white font-bold`}
                          >
                            {initials}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">
                            {offer.property.owner.name}
                          </h4>
                          {offer.status === "accepted" && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">
                                Contact:
                              </p>
                              <a
                                href={`mailto:${offer.property.owner.email}`}
                                className="text-sm text-blue-600 hover:text-blue-800 block"
                              >
                                {offer.property.owner.email}
                              </a>
                              {offer.property.owner.phone && (
                                <a
                                  href={`tel:${offer.property.owner.phone}`}
                                  className="text-sm text-blue-600 hover:text-blue-800 block mt-1"
                                >
                                  {offer.property.owner.phone}
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {offer.status === "pending" && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={() => handleCancelOffer(offer.id)}
                      disabled={cancelOfferMutation.isPending}
                    >
                      {cancelOfferMutation.isPending &&
                      cancelOfferMutation.variables === offer.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        "Cancel Offer"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
