"use client";

import PropertyCard from "../../../components/shared/PropertyCard";
import Link from "next/link";
import { PropertyType, RoomType } from "@prisma/client";

type FormattedProperty = {
  id: string;
  title: string;
  price: string;
  location: string;
  type: PropertyType;
  roomType: RoomType;
  imageUrl: string;
  amenities: string[];
  persons: number;
  bathrooms: number;
  genderPreference: string;
  countryCode: string;
};

interface PropertySectionProps {
  properties: FormattedProperty[];
}

export default function PropertySection({ properties }: PropertySectionProps) {
  return (
    <section className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">
          Find Your Perfect Roommate
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Discover rooms and houses that match your preferences
        </p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">
            No properties available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {properties.map((property) => (
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
            />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <Link
          href="/properties"
          className="inline-block px-6 py-3 border-2 border-primary text-primary font-medium rounded-full hover:bg-gradient-subtle transition-colors"
        >
          View All Properties
        </Link>
      </div>
    </section>
  );
}
