import { Metadata } from "next";
import {
  getPropertyBySlug,
  getSuggestedProperties,
} from "@/actions/properties";
import PropertyDetailContainer from "./components/PropertyDetailContainer";
import { notFound } from "next/navigation";
import { Property } from "@prisma/client";
import PropertyHeader from "./components/PropertyHeader";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return {
      title: "Property Not Found",
      description: "The requested property could not be found.",
    };
  }

  return {
    title: `${property.title || "View Property"} | RoommateFinder`,
    description:
      property.description ||
      `Explore this ${property.type} in ${property.city}, ${property.country}.`,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    notFound();
  }

  // Get suggested properties
  const suggestedProperties = await getSuggestedProperties(property.id);

  return (
    <div className="flex flex-col gap-4">
      <PropertyDetailContainer
        property={property as Property}
        suggestedProperties={suggestedProperties}
      />
      {/* Property Header
      <PropertyHeader
        title={property.title || "Unnamed Property"}
        location={`${property.address}, ${property.city}, ${property.country}`}
        type={property.type}
        roomType={property.roomType}
        propertyId={property.id}
        rating={property.rating}
        totalRatings={property.totalRatings}
      /> */}
    </div>
  );
}
