"use client";

import LiveSearch from "./LiveSearch";

export default function HomeSearch() {
  return (
    <div className="py-12 sm:py-16 bg-gradient-to-r from-gray-800 to-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Find Your Perfect Living Space
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-8">
            Search through thousands of rooms, apartments, and houses to find
            your ideal home
          </p>

          <LiveSearch />

          <div className="flex flex-wrap justify-center gap-4 mt-8 text-sm">
            <div className="px-4 py-2 bg-white/10 rounded-full">
              Affordable Prices
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full">
              Verified Listings
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full">
              Safe Neighborhoods
            </div>
            <div className="px-4 py-2 bg-white/10 rounded-full">
              Easy Booking
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
