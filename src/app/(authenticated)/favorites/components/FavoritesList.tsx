"use client";

import { useEffect, useState } from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import { PaymentTime, Property } from "@prisma/client";
import { ChevronDown } from "lucide-react";

interface PropertyWithRelations extends Property {
  category: {
    id: string;
    name: string;
  };
  owner: {
    id: string;
    name: string;
  };
}

interface FavoritesListProps {
  properties: PropertyWithRelations[];
}

export default function FavoritesList({ properties }: FavoritesListProps) {
  const [favorites, setFavorites] = useState(properties);
  const [visibleCount, setVisibleCount] = useState(12);

  const visibleProperties = favorites.slice(0, visibleCount);
  const hasMoreProperties = visibleCount < favorites.length;

  const loadMoreProperties = () => {
    setVisibleCount((prevCount) => prevCount + 12);
  };

  useEffect(() => {
    setFavorites(properties);
  }, [properties]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProperties.map((property) => (
          <PropertyCard
            key={property.id}
            id={property.id}
            title={property.title || "Unnamed Property"}
            price={property.price || "0"}
            location={`${property.city || ""}, ${property.country || ""}`}
            type={property.type}
            roomType={property.roomType}
            imageUrl={property.images?.[0] || "/placeholder-property.jpg"}
            amenities={[
              property.airConditioning ? "Air Conditioning" : "",
              property.internet ? "Internet" : "",
              property.parking ? "Parking" : "",
            ].filter(Boolean)}
            persons={Number(property.availablePersons) || 1}
            bathrooms={Number(property.bathrooms) || 1}
            genderPreference={
              (property.genderRequired as "male" | "female" | "any") || "any"
            }
            countryCode={
              property.country?.substring(0, 2).toLowerCase() || "us"
            }
            slug={property.slug || ""}
            paymentTime={property.paymentTime as PaymentTime}
          />
        ))}
      </div>

      {hasMoreProperties && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreProperties}
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-medium rounded-full hover:bg-gradient-subtle transition-colors"
          >
            View More Favorites
            <ChevronDown className="ml-2 h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
