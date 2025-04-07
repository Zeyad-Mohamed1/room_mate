'use client';

import { useState } from 'react';
import Header from '../components/Header';
import PropertyCard from '../components/PropertyCard';
import AddPropertyModal from '../components/AddPropertyModal';
import WelcomeDialog from '@/components/WelcomeDialog';

// Sample data for properties
const sampleProperties = [
  {
    id: '1',
    title: 'Cozy Studio Apartment',
    price: '$800/month',
    location: 'Downtown, New York',
    type: 'room' as const,
    roomType: 'single' as const,
    imageUrl: '/images/properties/studio-apartment.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Parking'],
    persons: 2,
    bathrooms: 1,
    genderPreference: 'any' as const,
    countryCode: 'us',
  },
  {
    id: '2',
    title: 'Modern 2-Bedroom House',
    price: '$1,200/month',
    location: 'Suburbs, Chicago',
    type: 'house' as const,
    roomType: 'mixed' as const,
    imageUrl: '/images/properties/modern-house.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Parking', 'Garden'],
    persons: 4,
    bathrooms: 2,
    genderPreference: 'female' as const,
    countryCode: 'us',
  },
  {
    id: '3',
    title: 'Luxury Penthouse Room',
    price: '$1,500/month',
    location: 'Financial District, San Francisco',
    type: 'room' as const,
    roomType: 'single' as const,
    imageUrl: '/images/properties/penthouse.jpg',
    amenities: ['WiFi', 'Air Conditioning', 'Furnished', 'Parking', 'Gym Access', 'Pool'],
    persons: 1,
    bathrooms: 1,
    genderPreference: 'male' as const,
    countryCode: 'us',
  },
  {
    id: '4',
    title: 'Shared Apartment Room',
    price: '$600/month',
    location: 'University Area, Boston',
    type: 'room' as const,
    roomType: 'mixed' as const,
    imageUrl: '/images/properties/shared-apartment.jpg',
    amenities: ['WiFi', 'Furnished', 'Near Public Transport'],
    persons: 3,
    bathrooms: 2,
    genderPreference: 'any' as const,
    countryCode: 'us',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <WelcomeDialog />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient mb-2">Find Your Perfect Roommate</h1>
          <p className="text-gray-600 text-sm sm:text-base">Discover rooms and houses that match your preferences</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {sampleProperties.map((property) => (
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
              genderPreference={property.genderPreference}
              countryCode={property.countryCode}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="#" 
            className="inline-block px-6 py-3 border-2 border-primary text-primary font-medium rounded-full hover:bg-gradient-subtle transition-colors"
          >
            View All Properties
          </a>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl">
                  RF
                </div>
                <span className="text-xl font-bold">RoommateFinder</span>
              </div>
              <p className="text-gray-400 text-sm">
                Find your perfect roommate and living space with ease.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">FAQs</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">support@roommatefinder.com</span>
                </li>
                <li className="flex items-center text-gray-400 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +1 (555) 123-4567
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} RoommateFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
