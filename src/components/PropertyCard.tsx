import Image from 'next/image';
import Link from 'next/link';

interface PropertyCardProps {
  id: string;
  title: string;
  price: string;
  location: string;
  type: 'house' | 'room';
  roomType: 'mixed' | 'single';
  imageUrl: string;
  amenities: string[];
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  type,
  roomType,
  imageUrl,
  amenities,
}: PropertyCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-soft overflow-hidden shadow-hover animate-fadeIn transition-all duration-300 hover:shadow-lg">
      <div className="relative h-48 sm:h-56 w-full">
        <Image
          src={imageUrl || '/placeholder-property.jpg'}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 hover:scale-105"
          priority={false}
        />
        <div className="absolute top-3 right-3 bg-gradient text-white px-3 py-1.5 rounded-full text-xs font-medium">
          {type === 'house' ? 'House' : 'Room'} • {roomType === 'mixed' ? 'Mixed' : 'Single'}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-overlay"></div>
      </div>
      
      <div className="p-4 sm:p-5">
        <h3 className="text-lg sm:text-xl font-semibold mb-2 truncate">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-4">
          {amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-gradient-subtle text-gray-700 text-xs px-2.5 py-1 rounded-full">
              {amenity}
            </span>
          ))}
          {amenities.length > 3 && (
            <span className="bg-gradient-subtle text-gray-700 text-xs px-2.5 py-1 rounded-full">
              +{amenities.length - 3} more
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <p className="text-gradient font-bold text-lg">{price}</p>
          <Link 
            href={`/property/${id}`}
            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center group"
          >
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard; 