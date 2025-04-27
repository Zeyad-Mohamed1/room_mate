"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useClickAway } from "@/hooks/useClickAway";
import Image from "next/image";
import { useRouter } from "next/navigation";

type Property = {
  id: string;
  title: string;
  price: number;
  city: string;
  slug: string;
  images: string[];
};

export default function LiveSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useClickAway(searchRef, () => {
    setIsOpen(false);
  });

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/properties/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/properties?search=${encodeURIComponent(searchQuery.trim())}`
      );
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search for rooms, houses, or locations..."
            className="w-full py-3 px-12 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-md"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                setResults([]);
              }}
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-full hover:bg-primary/90 transition-colors"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </form>

      {/* Results dropdown */}
      {isOpen && searchQuery && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
              <span className="ml-2 text-gray-600">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {results.map((property) => (
                <Link
                  key={property.id}
                  href={`/property/${property.slug}`}
                  className="block hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center p-3 border-b border-gray-100">
                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                      {property.images && property.images[0] ? (
                        <Image
                          src={property.images[0]}
                          alt={property.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <span className="text-xs text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="font-medium text-sm line-clamp-1">
                        {property.title}
                      </p>
                      <p className="text-gray-500 text-xs">{property.city}</p>
                      <p className="text-primary font-medium text-sm mt-1">
                        ${property.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-3 text-center">
                <button
                  onClick={() => {
                    router.push(
                      `/properties?search=${encodeURIComponent(searchQuery)}`
                    );
                    setIsOpen(false);
                  }}
                  className="text-sm text-primary hover:underline"
                >
                  View all results
                </button>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 text-center">
              <p className="text-gray-500">No properties found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try different keywords or browse all properties
              </p>
              <Link
                href="/properties"
                className="mt-3 inline-block text-sm text-primary hover:underline"
                onClick={() => setIsOpen(false)}
              >
                Browse all properties
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
