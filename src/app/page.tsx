import WelcomeDialog from "@/components/shared/WelcomeDialog";
import prisma from "@/lib/prisma";
import { PropertyType, RoomType } from "@prisma/client";
import PropertySection from "./components/home/PropertySection";
import Footer from "./components/home/Footer";

// Define property type for type safety
type Property = {
  id: string;
  title: string | null;
  price: string | null;
  city: string | null;
  type: PropertyType;
  roomType: RoomType;
  images: string[];
  bathrooms: string | null;
  residentsCount: string | null;
  availablePersons: string | null;
  goodForForeigners: boolean;
  country: string | null;
  genderRequired: string | null;
};

export const revalidate = 3600; // Revalidate at most every hour

async function getProperties() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        city: true,
        type: true,
        roomType: true,
        images: true,
        bathrooms: true,
        residentsCount: true,
        availablePersons: true,
        goodForForeigners: true,
        country: true,
        genderRequired: true,
      },
      orderBy: {
        createdAt: "desc", // Get the most recent properties
      },
    });

    console.log(properties);

    return properties as Property[];
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [] as Property[];
  }
}

export default async function Home() {
  const properties = await getProperties();

  // Map properties to the format expected by PropertyCard
  const formattedProperties = properties.map((property) => ({
    id: property.id,
    title: property.title || "Unnamed Property",
    price: `$${property.price || "0"}/month`,
    location: property.city || "Unknown location",
    type: property.type,
    roomType: property.roomType,
    imageUrl:
      property.images && property.images.length > 0
        ? property.images[0]
        : "/images/properties/placeholder.jpg",
    amenities: [], // This would need to be populated from a relation or parsed field
    persons: property.availablePersons ? Number(property.availablePersons) : 1,
    bathrooms: property.bathrooms ? Number(property.bathrooms) : 1,
    genderPreference: property.genderRequired || "any",
    countryCode: property.country ? property.country.toLowerCase() : "us",
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <WelcomeDialog />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
        <PropertySection properties={formattedProperties} />
      </main>

      <Footer />
    </div>
  );
}
