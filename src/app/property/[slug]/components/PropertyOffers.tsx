"use client";

import { useState } from "react";
import {
  Tag,
  Percent,
  GiftIcon,
  Clock,
  Check,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PropertyOffersProps {
  propertyId: string;
}

// Sample offers data - in a real app, this would come from the database
const sampleOffers = [
  {
    id: "1",
    title: "First Month Free",
    description: "Sign a 12-month lease and get your first month's rent free!",
    discount: "100%",
    expires: "2023-12-31",
    type: "discount",
    terms:
      "Valid for new tenants only. Must sign a 12-month lease agreement to qualify.",
  },
  {
    id: "2",
    title: "Move-In Special",
    description: "No security deposit required for qualified applicants.",
    discount: null,
    expires: "2023-11-30",
    type: "special",
    terms:
      "Subject to background check and credit approval. Other fees may apply.",
  },
  {
    id: "3",
    title: "Refer a Friend",
    description:
      "Get $500 off your rent when you refer a friend who signs a lease.",
    discount: "$500",
    expires: null,
    type: "referral",
    terms:
      "Referred friend must sign a minimum 6-month lease. Discount applied after friend's move-in.",
  },
];

export default function PropertyOffers({ propertyId }: PropertyOffersProps) {
  const [offers] = useState(sampleOffers);
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  if (!offers || offers.length === 0) {
    return null;
  }

  const toggleExpandOffer = (id: string) => {
    if (expandedOffer === id) {
      setExpandedOffer(null);
    } else {
      setExpandedOffer(id);
    }
  };

  const getIconForOfferType = (type: string) => {
    switch (type) {
      case "discount":
        return <Percent className="h-10 w-10 text-blue-500" />;
      case "referral":
        return <GiftIcon className="h-10 w-10 text-blue-500" />;
      default:
        return <Tag className="h-10 w-10 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-semibold flex items-center">
          <Tag className="h-6 w-6 mr-2 text-blue-500" />
          Special Offers & Discounts
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Exclusive deals available with this property
        </p>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="border border-gray-200 hover:border-blue-200 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Header with accent color based on offer type */}
              <div
                className={`py-3 px-4 border-b border-gray-100 ${
                  offer.type === "discount"
                    ? "bg-blue-50"
                    : offer.type === "referral"
                    ? "bg-green-50"
                    : "bg-purple-50"
                }`}
              >
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    offer.type === "discount"
                      ? "bg-blue-100 text-blue-800"
                      : offer.type === "referral"
                      ? "bg-green-100 text-green-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {offer.type === "discount"
                    ? "Discount"
                    : offer.type === "referral"
                    ? "Referral Program"
                    : "Special Offer"}
                </span>
              </div>

              {/* Offer content */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  {getIconForOfferType(offer.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{offer.title}</h3>
                    <p className="text-gray-600 text-sm">{offer.description}</p>

                    {offer.discount && (
                      <p className="text-blue-600 font-medium mt-2 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Save {offer.discount}
                      </p>
                    )}

                    {offer.expires && (
                      <div className="flex items-center text-amber-600 text-sm mt-2 font-medium">
                        <Clock className="h-4 w-4 mr-1" />
                        Limited time offer • Expires{" "}
                        {new Date(offer.expires).toLocaleDateString()}
                      </div>
                    )}

                    {/* Expandable terms section */}
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => toggleExpandOffer(offer.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
                      >
                        {expandedOffer === offer.id
                          ? "Hide terms"
                          : "View terms"}
                        <ArrowRight
                          className={`h-3 w-3 ml-1 transition-transform ${
                            expandedOffer === offer.id ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {expandedOffer === offer.id && (
                        <div className="mt-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg flex items-start">
                          <AlertCircle className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0 mt-0.5" />
                          <p>{offer.terms}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer with claim button */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Button
                  variant="outline"
                  className="w-full gap-2 hover:bg-white hover:text-blue-600 hover:border-blue-600"
                >
                  Claim this offer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <Button variant="link" className="gap-2">
            View all available offers
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
