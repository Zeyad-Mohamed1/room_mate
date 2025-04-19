"use client";

import PropertyCard from "@/components/shared/PropertyCard";
import { Property } from "@prisma/client";

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

interface PropertyListProps {
  properties: PropertyWithRelations[];
}

const PropertyList = ({ properties }: PropertyListProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          id={property.id}
          title={property.title || "Unnamed Property"}
          price={property.price || "Price not available"}
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
          countryCode={property.country?.substring(0, 2).toLowerCase() || "us"}
        />
      ))}
    </div>
  );
};

export default PropertyList;
