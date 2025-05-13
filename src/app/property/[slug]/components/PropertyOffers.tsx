"use client";

import { useState } from "react";
import { Offer } from "@prisma/client";
import { formatDate } from "@/lib/utils";
import {
  Tag,
  MessageCircle,
  Clock,
  Check,
  X,
  DollarSign,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type OfferStatus = "pending" | "accepted" | "rejected" | "cancelled";

interface OfferWithUser {
  id: string;
  message: string;
  price: string;
  phone: string;
  duration: string | null;
  deposit: boolean;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
  propertyId: string;
  userId: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

interface PropertyOffersProps {
  propertyId: string;
  offers: OfferWithUser[];
}

export default function PropertyOffers({ propertyId, offers }: PropertyOffersProps) {
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
            Property Offers
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            No offers have been submitted for this property yet
          </p>
        </div>
      </div>
    );
  }

  const toggleExpandOffer = (id: string) => {
    if (expandedOffer === id) {
      setExpandedOffer(null);
    } else {
      setExpandedOffer(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold flex items-center">
          <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
          Property Offers
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          {offers.length} offer{offers.length !== 1 ? "s" : ""} submitted for this property
        </p>
      </div>

      <div className="px-6 pb-6">
        <div className="space-y-4 mt-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-gray-200 hover:border-blue-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Header with status indicator */}
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">{offer.user.name || "Anonymous User"}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full flex items-center ${offer.status === "pending"
                  ? "bg-amber-100 text-amber-800"
                  : offer.status === "accepted"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                  }`}>
                  {offer.status === "pending" && (
                    <>
                      <Clock className="h-3 w-3 mr-1" /> Pending
                    </>
                  )}
                  {offer.status === "accepted" && (
                    <>
                      <Check className="h-3 w-3 mr-1" /> Accepted
                    </>
                  )}
                  {offer.status === "rejected" && (
                    <>
                      <X className="h-3 w-3 mr-1" /> Rejected
                    </>
                  )}
                </span>
              </div>

              {/* Offer content */}
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center text-green-700">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="font-medium">Price Offer: ${offer.price}</span>
                  </div>

                  {offer.duration && (
                    <div className="text-gray-700 text-sm">
                      <span className="font-medium">Duration:</span> {offer.duration}
                    </div>
                  )}

                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Deposit:</span> {offer.deposit ? "Required" : "Not required"}
                  </div>

                  <div className="text-gray-700 text-sm">
                    <span className="font-medium">Message:</span> {offer.message}
                  </div>

                  <div className="text-gray-500 text-xs">
                    Submitted on {formatDate(offer.createdAt.toString())}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
