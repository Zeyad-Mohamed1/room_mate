import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MapPin,
  Users,
  Bath,
  UserRound,
  ArrowRight,
  Home,
  BedDouble,
} from "lucide-react";
import { useFavorite } from "@/hooks/useFavorite";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  type: "house" | "room";
  roomType: "mixed" | "single";
  imageUrl: string;
  amenities: string[];
  persons: number;
  bathrooms: number;
  genderPreference: "male" | "female" | "any";
  countryCode: string;
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  type,
  roomType,
  imageUrl,
  persons,
  bathrooms,
  genderPreference,
  countryCode,
}: PropertyCardProps) => {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite({
    propertyId: id,
  });

  return (
    <div className="group bg-white rounded-xl shadow-soft overflow-hidden shadow-hover animate-fadeIn transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 sm:h-56 w-full">
        <Image
          src={imageUrl || "/placeholder-property.jpg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        <div className="absolute top-3 right-3 bg-gradient text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1">
          {type === "house" ? (
            <Home className="h-4 w-4" />
          ) : (
            <BedDouble className="h-4 w-4" />
          )}
          {type === "house" ? "House" : "Room"} •{" "}
          {roomType === "mixed" ? "Mixed" : "Single"}
        </div>
        <button
          onClick={toggleFavorite}
          disabled={isLoading}
          className="absolute top-3 left-3 p-2 bg-white/90 rounded-full hover:bg-white transition-colors cursor-pointer"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "text-red-500 fill-current" : "text-gray-400"
            } ${isLoading ? "opacity-50" : ""}`}
            strokeWidth={2}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-overlay"></div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
            alt={`${countryCode} flag`}
            width={20}
            height={15}
            className="rounded-sm"
          />
          <h3 className="text-lg sm:text-xl font-semibold truncate flex-1">
            {title}
          </h3>
        </div>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center text-gray-700 text-sm bg-gray-50 p-2 rounded-lg">
            <Users className="h-4 w-4 mr-1 text-primary" />
            {persons} {persons === 1 ? "Person" : "Persons"}
          </div>
          <div className="flex items-center text-gray-700 text-sm bg-gray-50 p-2 rounded-lg">
            <Bath className="h-4 w-4 mr-1 text-primary" />
            {bathrooms} {bathrooms === 1 ? "Bath" : "Baths"}
          </div>
          <div className="flex items-center text-gray-700 text-sm bg-gray-50 p-2 rounded-lg">
            <UserRound className="h-4 w-4 mr-1 text-primary" />
            {genderPreference === "any"
              ? "Any"
              : genderPreference === "male"
              ? "Male"
              : "Female"}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <p className="text-gradient font-bold text-lg">{price}</p>
          <Link
            href={`/property/${id}`}
            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center group cursor-pointer"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
