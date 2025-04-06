'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '../../../components/Header';

// Sample property data
const propertyData = {
  id: '1',
  title: 'Cozy Studio Apartment',
  price: '$800/month',
  location: 'Downtown, New York',
  type: 'room',
  roomType: 'single',
  images: ['/images/properties/studio-apartment.jpg', '/images/properties/studio-apartment.jpg', '/images/properties/studio-apartment.jpg'],
  description: 'This cozy studio apartment is perfect for a single professional looking for a comfortable living space in the heart of downtown. The apartment features modern amenities and is within walking distance to public transportation, restaurants, and shopping.',
  amenities: [
    'WiFi',
    'Air Conditioning',
    'Furnished',
    'Parking',
    'Security System',
    'Laundry',
    'Dishwasher',
    'Microwave',
    'Refrigerator',
    'Stove',
    'Oven',
  ],
  owner: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: 'January 2023',
  },
  rules: [
    'No smoking',
    'No pets',
    'Quiet hours from 10 PM to 7 AM',
    'Clean up after yourself',
    'Respect shared spaces',
  ],
};

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link href="/" className="text-blue-600 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Properties
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative h-96 w-full">
            <Image
              src={propertyData.images[activeImage]}
              alt={propertyData.title}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
              {propertyData.type === 'house' ? 'House' : 'Room'} • {propertyData.roomType === 'mixed' ? 'Mixed' : 'Single'}
            </div>
          </div>
          
          <div className="flex overflow-x-auto p-2 space-x-2">
            {propertyData.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden ${
                  activeImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <Image
                  src={image}
                  alt={`${propertyData.title} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{propertyData.title}</h1>
            <p className="text-gray-600 mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {propertyData.location}
            </p>
            
            <div className="flex justify-between items-center mb-6">
              <p className="text-2xl font-bold text-blue-600">{propertyData.price}</p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Contact Owner
              </button>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700">{propertyData.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {propertyData.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">House Rules</h2>
              <ul className="list-disc pl-5 space-y-1">
                {propertyData.rules.map((rule, index) => (
                  <li key={index} className="text-gray-700">{rule}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3">Property Owner</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="font-medium">{propertyData.owner.name}</p>
                <p className="text-gray-600">Member since {propertyData.owner.joinDate}</p>
                <div className="mt-2">
                  <p className="text-gray-700">Email: {propertyData.owner.email}</p>
                  <p className="text-gray-700">Phone: {propertyData.owner.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 