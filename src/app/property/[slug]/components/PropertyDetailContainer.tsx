"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, HomeIcon, MapIcon } from "lucide-react";
import PropertyHeader from "./PropertyHeader";
import PropertyGallery from "./PropertyGallery";
import PropertyDescription from "./PropertyDescription";
import PropertyAmenities from "./PropertyAmenities";
import PropertyRules from "./PropertyRules";
import PropertyOwner from "./PropertyOwner";
import SuggestedProperties from "./SuggestedProperties";
import PropertyDetails from "./PropertyDetails";
import PropertyContactSidebar from "./PropertyContactSidebar";
import { Property } from "@prisma/client";
import dynamic from "next/dynamic";
import PropertyOffers from "./PropertyOffers";

const PropertyMap = dynamic(() => import("./PropertyMap"), { ssr: false });

// Define the OfferStatus type to match the one in PropertyOffers
type OfferStatus = "pending" | "accepted" | "rejected" | "cancelled";

// Define the OfferWithUser type to match the one in PropertyOffers
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

interface PropertyDetailContainerProps {
  property: Property & {
    owner?: {
      id: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      image: string | null;
      createdAt: Date;
    } | null;
    offers?: OfferWithUser[];
  };
  suggestedProperties: Property[];
}

export default function PropertyDetailContainer({
  property,
  suggestedProperties,
}: PropertyDetailContainerProps) {
  const [activeImage, setActiveImage] = useState(0);

  // Format property data for components
  const formattedProperty = {
    id: property.id,
    title: property.title || "Unnamed Property",
    price: property.price,
    location: `${property.city || ""}, ${property.country || ""}`,
    type: property.type,
    roomType: property.roomType,
    images: (property.images as string[]) || [
      "/images/properties/placeholder.jpg",
    ],
    description: property.description || "No description available",
    paymentTime: property.paymentTime,
    amenities: ((property as any).amenities as string[]) || [],
    rules: ((property as any).rules as string[]) || [],
    details: {
      bathrooms: property.bathrooms || 1,
      bedrooms: ((property as any).bedroomsCount as number) || 1,
      size: ((property as any).size as string) || "N/A",
      availableFrom: (property as any).availableFrom
        ? new Date((property as any).availableFrom).toLocaleDateString()
        : "Immediately",
      residentsCount: property.residentsCount || 0,
      availablePersons: property.availablePersons || 1,
      pets: (property as any).allowPets ? "Allowed" : "Not allowed",
      smoking: (property as any).allowSmoking ? "Allowed" : "Not allowed",
      gender: property.genderRequired || "Any",
      furnished: (property as any).furnished ? "Yes" : "No",
      availability: ((property as any).availability as string) || "available",
    },
    owner: {
      id: property.ownerId,
      name: property.owner?.name || "Property Owner",
      email: property.owner?.email || "contact@example.com",
      phone: property.owner?.phone || "",
      joinDate: property.owner?.createdAt
        ? new Date(property.owner.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
        })
        : "Unknown",
      image: property.owner?.image || "/images/default-avatar.png",
    },
    coordinates: {
      lat: property.latitude || 40.7128,
      lng: property.longitude || -74.006,
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="container mx-auto px-4 py-8">
        <PropertyHeader
          title={formattedProperty.title}
          location={formattedProperty.location}
          type={formattedProperty.type}
          roomType={formattedProperty.roomType}
          propertyId={property.id}
          rating={property.rating}
          totalRatings={property.totalRatings}
          adminRating={property.adminRating || undefined}
          hasAdminRating={property.hasAdminRating || false}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <PropertyGallery
                images={formattedProperty.images}
                activeImage={activeImage}
                setActiveImage={setActiveImage}
                type={formattedProperty.type}
                roomType={formattedProperty.roomType}
              />
            </div>

            {/* Tabbed content */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-5 bg-gray-100 p-0 rounded-none">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-4"
                  >
                    <InfoIcon className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-4"
                  >
                    <HomeIcon className="h-4 w-4 mr-2" />
                    Details
                  </TabsTrigger>

                  <TabsTrigger
                    value="map"
                    className="data-[state=active]:bg-white rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 py-4"
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    Map
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="overview"
                  className="p-6 focus:outline-none"
                >
                  <PropertyDescription
                    description={formattedProperty.description}
                  />
                  <PropertyDetails details={formattedProperty.details} />
                </TabsContent>

                <TabsContent value="details" className="p-6 focus:outline-none">
                  <PropertyDetails
                    details={formattedProperty.details}
                    showFull
                  />
                </TabsContent>

                <TabsContent
                  value="amenities"
                  className="p-6 focus:outline-none"
                >
                  <PropertyAmenities amenities={formattedProperty.amenities} />
                </TabsContent>

                <TabsContent value="rules" className="p-6 focus:outline-none">
                  <PropertyRules rules={formattedProperty.rules} />
                </TabsContent>

                <TabsContent value="map" className="focus:outline-none">
                  <div className="h-[400px]">
                    <PropertyMap
                      coordinates={formattedProperty.coordinates}
                      title={formattedProperty.title}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Owner info */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
              <PropertyOwner owner={formattedProperty.owner} />
            </div>
          </div>

          {/* Sidebar - 1/3 width on large screens */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <PropertyContactSidebar
                price={formattedProperty.price || "0"}
                owner={formattedProperty.owner}
                availability={formattedProperty.details.availability}
                availableFrom={formattedProperty.details.availableFrom}
                paymentTime={formattedProperty.paymentTime}
                propertyId={property.id}
              />
            </div>
          </div>
        </div>

        {/* Property Offers - full width */}
        <div className="mt-8">
          <PropertyOffers propertyId={property.id} offers={property.offers || []} />
        </div>

        {/* Suggested properties - full width */}
        <div className="mt-12">
          <SuggestedProperties properties={suggestedProperties} />
        </div>
      </main>
    </div>
  );
}
