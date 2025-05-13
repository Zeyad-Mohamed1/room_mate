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
import { PaymentTime } from "@/types";
import { formatPaymentTime, formatPriceWithTime } from "@/utils/formatters";

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  paymentTime?: PaymentTime;
  location: string;
  type: "house" | "room";
  roomType: "mixed" | "single";
  imageUrl: string;
  amenities: string[];
  persons: number;
  bathrooms: number;
  genderPreference: "male" | "female" | "any";
  countryCode: string;
  slug: string;
}

const PropertyCard = ({
  id,
  title,
  price,
  paymentTime = "monthly",
  location,
  type,
  roomType,
  imageUrl,
  persons,
  bathrooms,
  genderPreference,
  countryCode,
  slug,
}: PropertyCardProps) => {
  const { isFavorite, isLoading, toggleFavorite } = useFavorite({
    propertyId: id,
  });

  return (
    <div className="group relative bg-white rounded-xl shadow-soft overflow-hidden shadow-hover animate-fadeIn transition-all duration-300 hover:shadow-lg h-72">
      {/* Full-size image background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageUrl || "/placeholder-property.jpg"}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-800/70 via-slate-700/30 to-slate-800/10"></div>
      </div>

      {/* Top badges and buttons */}
      <div className="absolute top-3 right-3 bg-slate-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 z-10">
        {type === "house" ? (
          <Home className="h-4 w-4" />
        ) : (
          <BedDouble className="h-4 w-4" />
        )}
        {type === "house" ? "House" : "Room"} •{" "}
        {roomType === "mixed" ? "Mixed" : "Single"}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite();
        }}
        disabled={isLoading}
        className="absolute top-3 left-3 p-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors cursor-pointer z-20"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`h-5 w-5 ${isFavorite ? "text-red-500 fill-current" : "text-gray-400"
            } ${isLoading ? "opacity-50" : ""}`}
          strokeWidth={2}
        />
      </button>

      {/* Content overlaid on image */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 z-10">
        <div className="flex items-center gap-2 mb-2">
          <Image
            src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`}
            alt={`${countryCode} flag`}
            width={20}
            height={15}
            className="rounded-sm"
          />
          <h3 className="text-lg font-semibold truncate flex-1 text-white">
            {title}
          </h3>
        </div>

        <p className="text-white/90 text-sm mb-3 flex items-center">
          <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
          <span className="truncate">{location}</span>
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center font-semibold text-white text-xs bg-slate-600/60 p-1.5 rounded-lg">
            <Users className="h-3.5 w-3.5 mr-1 text-slate-200" />
            {persons}
          </div>
          <div className="flex items-center font-semibold text-white text-xs bg-slate-600/60 p-1.5 rounded-lg">
            <Bath className="h-3.5 w-3.5 mr-1 text-slate-200" />
            {bathrooms}
          </div>
          <div className="flex items-center font-semibold text-white text-xs bg-slate-600/60 p-1.5 rounded-lg">
            <UserRound className="h-3.5 w-3.5 mr-1 text-slate-200" />
            {genderPreference === "any" ? "Any" : genderPreference === "male" ? "M" : "F"}
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-300/20">
          <p className="text-white font-bold text-lg">
            {formatPriceWithTime(price, paymentTime)}
          </p>
          <Link
            href={`/property/${slug}`}
            className="text-slate-200 hover:text-white text-sm font-medium flex items-center group cursor-pointer bg-slate-600/60 px-2 py-1 rounded-lg"
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
