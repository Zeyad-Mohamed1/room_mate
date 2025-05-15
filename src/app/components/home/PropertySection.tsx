"use client";

import { useState, useEffect } from "react";
import PropertyCard from "@/components/shared/PropertyCard";
import { Property } from "@prisma/client";
import { Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { PaymentTime } from "@/types";
import { useHomePage } from "./HomePageContext";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";

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

export default function PropertySection() {
  const router = useRouter();
  const [filteredProperties, setFilteredProperties] = useState<
    PropertyWithRelations[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sliderRef, setSliderRef] = useState<HTMLDivElement | null>(null);

  // Get search params from context and methods to update it
  const { searchQuery, selectedCategory, setSelectedCategory } = useHomePage();

  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [propertyType, setPropertyType] = useState<string[]>([]);
  const [bedroomCount, setBedroomCount] = useState<string[]>([]);

  // Fetch properties using React Query
  const { data: properties = [], isLoading: propertiesLoading } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetch("/api/properties").then((res) => res.json()),
  });

  // Fetch categories using React Query
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((res) => res.json()),
  });

  // Extract categories from response
  const categories = categoriesData?.categories || [];

  // Determine overall loading state
  const isLoading = propertiesLoading || categoriesLoading;

  // Slider navigation functions
  const scrollLeft = () => {
    if (sliderRef) {
      sliderRef.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef) {
      sliderRef.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Navigate to advanced filters page
  const goToAdvancedFilters = () => {
    router.push('/filters');
  };

  // Apply filters whenever dependencies change
  useEffect(() => {
    if (properties.length > 0) {
      filterProperties(
        properties,
        searchQuery,
        selectedCategory,
        priceRange[0],
        priceRange[1],
        propertyType,
        bedroomCount
      );
    }
  }, [
    properties,
    searchQuery,
    selectedCategory,
    priceRange,
    propertyType,
    bedroomCount,
  ]);

  // Handle filtering of properties
  const filterProperties = (
    allProperties: PropertyWithRelations[],
    query: string = "",
    category: string = "",
    priceMin: number = priceRange[0],
    priceMax: number = priceRange[1],
    types: string[] = propertyType,
    bedrooms: string[] = bedroomCount
  ) => {
    let filtered = [...allProperties];

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title?.toLowerCase().includes(lowerQuery) ||
          property.description?.toLowerCase().includes(lowerQuery) ||
          property.city?.toLowerCase().includes(lowerQuery) ||
          property.address?.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter(
        (property) => property.categoryId === category
      );
    }

    // Filter by price range
    filtered = filtered.filter((property) => {
      const price = parseFloat(property.price || "0");
      return price >= priceMin && price <= priceMax;
    });

    // Filter by property type (house or room)
    if (types.length > 0) {
      filtered = filtered.filter((property) => types.includes(property.type));
    }

    // Filter by bedroom count
    if (bedrooms.length > 0) {
      filtered = filtered.filter((property) =>
        bedrooms.includes(property.totalRooms || "")
      );
    }

    setFilteredProperties(filtered);
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 10000]);
    setPropertyType([]);
    setBedroomCount([]);
    setSelectedCategory("");
    filterProperties(properties, searchQuery, "");
  };

  // Toggle property type filter
  const togglePropertyType = (type: string) => {
    const newTypes = propertyType.includes(type)
      ? propertyType.filter((t) => t !== type)
      : [...propertyType, type];

    setPropertyType(newTypes);
  };

  // Toggle bedroom count filter
  const toggleBedroomCount = (count: string) => {
    const newCounts = bedroomCount.includes(count)
      ? bedroomCount.filter((c) => c !== count)
      : [...bedroomCount, count];

    setBedroomCount(newCounts);
  };

  // Handle category change (toggle behavior)
  const handleCategoryChange = (categoryId: string) => {
    const newCategory = selectedCategory === categoryId ? "" : categoryId;
    setSelectedCategory(newCategory);
  };

  // Create a placeholder for categories without icons
  const getCategoryPlaceholder = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="container mx-auto">
      {/* Category Slider Section */}
      <div className="mb-8 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary">
            Browse by Category
          </h2>
          <div className="flex items-center gap-3">
            {/* <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button> */}
            <Link
              href="/filters"
              className="flex items-center px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              More Filters
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={setSliderRef}
            className="flex overflow-x-auto scrollbar-hide py-2 px-10 gap-4 scroll-smooth max-w-3xl mx-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {categories.map((category: { id: string; name: string; icon?: string }) => (
              <div
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex flex-col items-center justify-center min-w-[100px] p-3 rounded-lg cursor-pointer transition-all ${selectedCategory === category.id
                  ? "bg-primary text-white shadow-md scale-105"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-sm">
                  {category.icon ? (
                    <Image
                      src={category.icon}
                      width={48}
                      height={48}
                      alt={category.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary">
                      {getCategoryPlaceholder(category.name)}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-2 rounded-full shadow-md transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Quick Filters</h3>
            <button
              onClick={resetFilters}
              className="text-primary text-sm font-medium hover:underline flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Property Type Filter */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Property Type</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => togglePropertyType("house")}
                  className={`px-3 py-1 text-xs rounded-full ${propertyType.includes("house")
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  House
                </button>
                <button
                  onClick={() => togglePropertyType("room")}
                  className={`px-3 py-1 text-xs rounded-full ${propertyType.includes("room")
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Room
                </button>
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h4 className="font-medium mb-2 text-sm">Price Range</h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value);
                    setPriceRange([newMin, priceRange[1]]);
                  }}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
                <span>to</span>
                <input
                  type="number"
                  min="0"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value);
                    setPriceRange([priceRange[0], newMax]);
                  }}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-soft animate-pulse h-80"
            />
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title || "Unnamed Property"}
              price={property.price || "Price not available"}
              paymentTime={(property.paymentTime as PaymentTime) || "monthly"}
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
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 text-lg mb-2">
            No properties found matching your criteria
          </p>
          <p className="text-gray-400 text-sm mb-4">
            Try adjusting your filters or search term
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
