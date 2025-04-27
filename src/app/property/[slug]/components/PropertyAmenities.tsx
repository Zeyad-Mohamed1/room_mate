import { Check } from "lucide-react";

interface PropertyAmenitiesProps {
  amenities: string[];
}

export default function PropertyAmenities({
  amenities,
}: PropertyAmenitiesProps) {
  if (!amenities || amenities.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {amenities.map((amenity, index) => (
          <div key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <span>{amenity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
