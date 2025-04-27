"use client";

import { Offer } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import { Check, X, Clock, Phone } from "lucide-react";
import { useState } from "react";

interface OfferWithUser extends Offer {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface OffersListProps {
  propertyId: string;
  offers: OfferWithUser[];
}

export default function OffersList({ propertyId, offers }: OffersListProps) {
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  const handleOfferAction = async (
    offerId: string,
    action: "accept" | "reject"
  ) => {
    setIsUpdating({ ...isUpdating, [offerId]: true });

    try {
      const response = await fetch(`/api/offers/${offerId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: action === "accept" ? "accepted" : "rejected",
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} offer`);
      }

      // Refresh page to see updated status
      window.location.reload();
    } catch (error) {
      console.error(`Error ${action}ing offer:`, error);
      // Implement proper error handling/notification here
    } finally {
      setIsUpdating({ ...isUpdating, [offerId]: false });
    }
  };

  return (
    <div className="space-y-4">
      {offers?.length === 0 ? (
        <p className="text-gray-500 text-sm">No offers received yet.</p>
      ) : (
        offers?.map((offer) => (
          <div
            key={offer.id}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">{offer.user.name}</span>
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
                  </span>
                </div>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Offer Price:</span> $
                  {offer.price}
                </p>

                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Phone:</span>{" "}
                  <a
                    href={`tel:${offer.phone}`}
                    className="text-primary hover:underline flex items-center"
                  >
                    <Phone className="h-3 w-3 mr-1" />
                    {offer.phone}
                  </a>
                </p>

                <p className="text-sm text-gray-700 mb-3">{offer.message}</p>

                <p className="text-xs text-gray-500">
                  Received on {formatDate(offer.createdAt.toString())}
                </p>
              </div>

              {offer.status === "pending" && (
                <div className="flex items-center gap-2">
                  <button
                    className="flex items-center justify-center rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600 hover:bg-green-100 transition-colors disabled:opacity-50"
                    onClick={() => handleOfferAction(offer.id, "accept")}
                    disabled={isUpdating[offer.id]}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Accept
                  </button>

                  <button
                    className="flex items-center justify-center rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                    onClick={() => handleOfferAction(offer.id, "reject")}
                    disabled={isUpdating[offer.id]}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
