import {
  BathIcon,
  BedIcon,
  CalendarIcon,
  HomeIcon,
  Maximize2,
  PawPrint,
  Users,
  Sofa,
  Check,
  X,
  AlarmSmoke,
} from "lucide-react";

interface PropertyDetailsProps {
  details: {
    bathrooms: number | string;
    bedrooms: number | string;
    size: string;
    availableFrom: string;
    residentsCount: number | string;
    availablePersons: number | string;
    pets: string;
    smoking: string;
    gender: string;
    furnished: string;
    availability: string;
  };
  showFull?: boolean;
}

export default function PropertyDetails({
  details,
  showFull = false,
}: PropertyDetailsProps) {
  // Basic details shown in overview
  const basicDetails = [
    {
      icon: <BedIcon className="h-5 w-5 text-blue-500" />,
      label: "Bedrooms",
      value: details.bedrooms,
    },
    {
      icon: <BathIcon className="h-5 w-5 text-blue-500" />,
      label: "Bathrooms",
      value: details.bathrooms,
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Current Residents",
      value: details.residentsCount,
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Available For",
      value: `${details.availablePersons} ${
        details.availablePersons === 1 ? "Person" : "People"
      }`,
    },
  ];

  // Additional details shown in full view
  const additionalDetails = [
    {
      icon: <Maximize2 className="h-5 w-5 text-blue-500" />,
      label: "Size",
      value: details.size,
    },
    {
      icon: <CalendarIcon className="h-5 w-5 text-blue-500" />,
      label: "Available From",
      value: details.availableFrom,
    },
    {
      icon: <PawPrint className="h-5 w-5 text-blue-500" />,
      label: "Pets Allowed",
      value: details.pets,
      isHighlighted: details.pets === "Allowed",
    },
    {
      icon: <AlarmSmoke className="h-5 w-5 text-blue-500" />,
      label: "Smoking Allowed",
      value: details.smoking,
      isHighlighted: details.smoking === "Allowed",
    },
    {
      icon: <Users className="h-5 w-5 text-blue-500" />,
      label: "Gender Preference",
      value: details.gender,
    },
    {
      icon: <Sofa className="h-5 w-5 text-blue-500" />,
      label: "Furnished",
      value: details.furnished,
      isHighlighted: details.furnished === "Yes",
    },
  ];

  return (
    <div className={showFull ? "" : "mt-6"}>
      <h2 className="text-xl font-semibold mb-4">
        {showFull ? "Property Details" : "Key Details"}
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {basicDetails.map((detail, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center"
          >
            <div className="mb-2">{detail.icon}</div>
            <p className="text-gray-500 text-sm mb-1">{detail.label}</p>
            <p className="font-semibold">{detail.value}</p>
          </div>
        ))}
      </div>

      {showFull && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {additionalDetails.map((detail, index) => (
              <div
                key={index}
                className="flex items-start p-4 border border-gray-100 rounded-lg"
              >
                <div className="mr-3">{detail.icon}</div>
                <div>
                  <p className="text-gray-500 text-sm">{detail.label}</p>
                  <p
                    className={`font-medium ${
                      detail.isHighlighted ? "text-green-600" : ""
                    }`}
                  >
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
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
