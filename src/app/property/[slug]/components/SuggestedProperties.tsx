"use client";

import { Property } from "@prisma/client";
import PropertyCard from "@/components/shared/PropertyCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface SuggestedPropertiesProps {
  properties: Property[];
}

export default function SuggestedProperties({
  properties,
}: SuggestedPropertiesProps) {
  if (!properties || properties.length === 0) {
    return null;
  }

  // Format properties to match the PropertyCard component props
  const formattedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title || "Unnamed Property",
    price: `$${property.price || "0"}/month`,
    location: property.city || "Unknown location",
    type: property.type,
    roomType: property.roomType,
    imageUrl:
      property.images && (property.images as string[]).length > 0
        ? (property.images as string[])[0]
        : "/images/properties/placeholder.jpg",
    amenities: [] as string[],
    persons: property.availablePersons ? Number(property.availablePersons) : 1,
    bathrooms: property.bathrooms ? Number(property.bathrooms) : 1,
    genderPreference: property.genderRequired || "any",
    countryCode: property.country ? property.country.toLowerCase() : "us",
    slug: property.slug || "",
  }));

  return (
    <div className="bg-gray-50 py-12 px-6 -mx-4 md:-mx-6 lg:-mx-8 mt-12 rounded-t-3xl">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span className="text-amber-500 font-medium text-sm">
                RECOMMENDED FOR YOU
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              Similar Properties You May Like
            </h2>
            <p className="text-gray-600 mt-2">
              Based on your viewing preferences and similar properties in this
              area
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            View all properties
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {formattedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              location={property.location}
              type={property.type}
              roomType={property.roomType}
              imageUrl={property.imageUrl}
              amenities={property.amenities}
              persons={property.persons}
              bathrooms={property.bathrooms}
              genderPreference={
                property.genderPreference as "male" | "female" | "any"
              }
              countryCode={property.countryCode}
              slug={property.slug}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-600 text-sm">
            Can't find what you're looking for?
            <Link href="/search" className="text-blue-600 ml-1 hover:underline">
              Try a custom search
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
