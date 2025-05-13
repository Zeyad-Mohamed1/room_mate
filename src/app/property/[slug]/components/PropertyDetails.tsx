import {
  BathIcon,
  BedIcon,
  CalendarIcon,
  Maximize2,
  PawPrint,
  Users,
  Sofa,
  Check,
  X,
  AlarmSmoke,
  Wifi,
  Car,
  Building,
  ShieldCheck,
  Train,
  Store,
  Thermometer,
  ArrowUpDown,
  Clock,
  CreditCard,
  Droplets,
  Zap,
  Globe,
  Home,
  Building2,
} from "lucide-react";

interface PropertyDetailsProps {
  details: {
    bathrooms: number | string;
    bedrooms: number | string;
    size: string;
    availableFrom: string;
    residentsCount: number | string;
    availablePersons: number | string;
    pets?: string;
    smoking: string;
    gender: string;
    furnished: string;
    availability: string;
    floor?: string;
    separatedBathroom?: boolean;
    type?: string;
    roomType?: string;
    rentTime?: string;
    paymentTime?: string;
    priceIncludeWaterAndElectricity?: boolean;
    airConditioning?: boolean;
    includeWaterHeater?: boolean;
    parking?: boolean;
    internet?: boolean;
    nearToMetro?: boolean;
    nearToMarket?: boolean;
    elevator?: boolean;
    trialPeriod?: boolean;
    goodForForeigners?: boolean;
  };
  showFull?: boolean;
}

export default function PropertyDetails({
  details,
  showFull = false,
}: PropertyDetailsProps) {
  // All property details
  const propertyDetails = [
    // Basic details
    {
      icon: <BedIcon className="h-5 w-5 text-blue-500" />,
      label: "Bedrooms",
      value: details.bedrooms,
      isBasic: true,
    },
    {
      icon: <BathIcon className="h-5 w-5 text-blue-500" />,
      label: "Bathrooms",
      value: details.bathrooms,
      isBasic: true,
    },
    {
      icon: <Maximize2 className="h-5 w-5 text-blue-500" />,
      label: "Size",
      value: details.size,
      isBasic: true,
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Current Residents",
      value: details.residentsCount,
      isBasic: true,
    },
    // Property type & specifications
    {
      icon: <Home className="h-5 w-5 text-blue-500" />,
      label: "Property Type",
      value: details.type || "House",
    },
    {
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      label: "Room Type",
      value: details.roomType || "Single",
    },
    {
      icon: <ArrowUpDown className="h-5 w-5 text-blue-500" />,
      label: "Floor",
      value: details.floor || "Ground Floor",
    },
    {
      icon: <BathIcon className="h-5 w-5 text-blue-500" />,
      label: "Separated Bathroom",
      value: details.separatedBathroom ? "Yes" : "No",
      isBoolean: true,
      booleanValue: details.separatedBathroom,
    },
    // Rental terms
    {
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      label: "Rent Period",
      value: details.rentTime || "Monthly",
    },
    {
      icon: <CreditCard className="h-5 w-5 text-blue-500" />,
      label: "Payment Period",
      value: details.paymentTime || "Monthly",
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-blue-500" />,
      label: "Available From",
      value: details.availableFrom,
    },
    {
      icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
      label: "Trial Period",
      value: details.trialPeriod ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.trialPeriod,
    },
    // Occupancy
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Available For",
      value: `${details.availablePersons} ${details.availablePersons === 1 ? "Person" : "People"
        }`,
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Gender Preference",
      value: details.gender,
    },
    {
      icon: <Globe className="h-5 w-5 text-blue-500" />,
      label: "Good For Foreigners",
      value: details.goodForForeigners ? "Yes" : "No",
      isBoolean: true,
      booleanValue: details.goodForForeigners,
    },
    // Amenities
    {
      icon: <Sofa className="h-5 w-5 text-blue-500" />,
      label: "Furnished",
      value: details.furnished,
      isBoolean: true,
      booleanValue: details.furnished === "Yes",
    },
    {
      icon: <Wifi className="h-5 w-5 text-blue-500" />,
      label: "Internet",
      value: details.internet ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.internet,
    },
    {
      icon: <AlarmSmoke className="h-5 w-5 text-blue-500" />,
      label: "Smoking Allowed",
      value: details.smoking,
      isBoolean: true,
      booleanValue: details.smoking === "Allowed",
    },
    {
      icon: <PawPrint className="h-5 w-5 text-blue-500" />,
      label: "Pets Allowed",
      value: details.pets || "Not Allowed",
      isBoolean: true,
      booleanValue: details.pets === "Allowed",
    },
    {
      icon: <Thermometer className="h-5 w-5 text-blue-500" />,
      label: "Air Conditioning",
      value: details.airConditioning ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.airConditioning,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Water Heater",
      value: details.includeWaterHeater ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.includeWaterHeater,
    },
    {
      icon: <Car className="h-5 w-5 text-blue-500" />,
      label: "Parking",
      value: details.parking ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.parking,
    },
    {
      icon: <Building className="h-5 w-5 text-blue-500" />,
      label: "Elevator",
      value: details.elevator ? "Available" : "Not Available",
      isBoolean: true,
      booleanValue: details.elevator,
    },
    // Location features
    {
      icon: <Train className="h-5 w-5 text-blue-500" />,
      label: "Near Metro/Transit",
      value: details.nearToMetro ? "Yes" : "No",
      isBoolean: true,
      booleanValue: details.nearToMetro,
    },
    {
      icon: <Store className="h-5 w-5 text-blue-500" />,
      label: "Near Market/Shops",
      value: details.nearToMarket ? "Yes" : "No",
      isBoolean: true,
      booleanValue: details.nearToMarket,
    },
    // Utilities
    {
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      label: "Utilities Included",
      value: details.priceIncludeWaterAndElectricity ? "Water & Electricity Included" : "Not Included",
      isBoolean: true,
      booleanValue: details.priceIncludeWaterAndElectricity,
    },
  ];

  // Filter for basic details
  const basicDetails = propertyDetails.filter(detail => detail.isBasic);

  // Render a property detail card
  const renderDetailCard = (detail: any, index: number) => (
    <div
      key={index}
      className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center"
    >
      <div className="mb-2">{detail.icon}</div>
      <p className="text-gray-500 text-sm mb-1">{detail.label}</p>
      {detail.isBoolean ? (
        <div className="flex items-center justify-center">
          <div className={`p-1 rounded-full ${detail.booleanValue ? 'bg-green-100' : 'bg-red-100'} mr-1`}>
            {detail.booleanValue ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <X className="h-4 w-4 text-red-600" />
            )}
          </div>
          <p className={`font-medium ${detail.booleanValue ? "text-green-600" : "text-red-600"}`}>
            {detail.value}
          </p>
        </div>
      ) : (
        <p className="font-semibold">{detail.value}</p>
      )}
    </div>
  );

  return (
    <div className={showFull ? "" : "mt-6"}>
      <h2 className="text-xl font-semibold mb-4">
        {showFull ? "Property Details" : "Key Details"}
      </h2>

      {!showFull ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {basicDetails.map(renderDetailCard)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {propertyDetails.map(renderDetailCard)}
          </div>

          <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-3">Availability Status</h3>
            <div className="flex items-center">
              {details.availability === "available" ? (
                <>
                  <div className="p-1 rounded-full bg-green-100 mr-2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-green-600 font-medium">
                    Available from {details.availableFrom}
                  </p>
                </>
              ) : (
                <>
                  <div className="p-1 rounded-full bg-red-100 mr-2">
                    <X className="h-5 w-5 text-red-600" />
                  </div>
                  <p className="text-red-600 font-medium">Not Available</p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
