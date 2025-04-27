"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";
import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { Loader2 } from "lucide-react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentTime, RentTime, PropertyType, RoomType, Gender } from "@/types";
import { getPaymentTimeLabel, formatRentTime } from "@/utils/formatters";

// Define the PropertyMapProps interface
interface PropertyMapProps {
  initialPosition: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

// Import Leaflet dynamically to avoid SSR issues
const MapWithNoSSR: ComponentType<PropertyMapProps> = dynamic(
  () => import("./PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-lg">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    ),
  }
);

interface AddPropertyModalProps {
  onClose: () => void;
  propertyId?: string; // Optional property ID for editing
  isEditing?: boolean; // Flag to indicate if we are editing
}

interface PropertyFormData {
  title: string;
  type: PropertyType;
  roomType: RoomType;
  city: string;
  country: string;
  address: string;
  description: string;
  price: string;
  rentTime: RentTime;
  paymentTime: PaymentTime;
  totalRooms: string;
  availableRooms: string;
  roomsToComplete: string;
  size: string;
  floor: string;
  bathrooms: string;
  separatedBathroom: boolean;
  residentsCount: string;
  availablePersons: string;
  gender: Gender;
  priceIncludeWaterAndElectricity: boolean;
  includeFurniture: boolean;
  airConditioning: boolean;
  includeWaterHeater: boolean;
  parking: boolean;
  internet: boolean;
  nearToMetro: boolean;
  nearToMarket: boolean;
  elevator: boolean;
  trialPeriod: boolean;
  goodForForeigners: boolean;
  allowSmoking: boolean;
  termsAndConditions: string;
  images: File[];
  categoryId: string;
  latitude: string;
  longitude: string;
}

interface FormErrors {
  [key: string]: string;
}

// Define country coordinates mapping
const countryCoordinates: Record<string, [number, number]> = {
  US: [37.0902, -95.7129], // USA
  GB: [55.3781, -3.436], // UK
  CA: [56.1304, -106.3468], // Canada
  AU: [-25.2744, 133.7751], // Australia
  DE: [51.1657, 10.4515], // Germany
  FR: [46.2276, 2.2137], // France
  JP: [36.2048, 138.2529], // Japan
  CN: [35.8617, 104.1954], // China
  IN: [20.5937, 78.9629], // India
  BR: [-14.235, -51.9253], // Brazil
  AE: [23.4241, 53.8478], // UAE
  SA: [23.8859, 45.0792], // Saudi Arabia
  EG: [26.8206, 30.8025], // Egypt
  TR: [38.9637, 35.2433], // Turkey
  RU: [61.524, 105.3188], // Russia
};

const getCurrencySymbol = (countryCode: string) => {
  switch (countryCode) {
    case "US":
      return "$";
    case "GB":
      return "£";
    case "CA":
      return "$";
    case "AU":
      return "$";
    case "DE":
      return "€";
    case "FR":
      return "€";
    case "JP":
      return "¥";
    case "CN":
      return "¥";
    case "IN":
      return "₹";
    case "BR":
      return "R$";
    case "AE":
      return "د.إ";
    case "SA":
      return "ر.س";
    case "EG":
      return "£";
    case "TR":
      return "₺";
    case "RU":
      return "₽";
    default:
      return "$";
  }
};

// Add this new component after the imports
const NavigationButton = ({
  type,
  onClick,
  disabled = false,
  isLoading = false,
}: {
  type: "next" | "prev";
  onClick: (e?: React.MouseEvent) => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
}) => {
  return (
    <button
      type="button"
      onClick={(e) => onClick(e)}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 ${
        type === "next"
          ? "bg-gradient text-white shadow-md hover:shadow-lg hover:opacity-90"
          : "border border-gray-300/80 text-gray-700 hover:bg-gray-50 backdrop-blur-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {type === "prev" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {type === "prev" ? "Previous" : "Next"}
      {type === "next" && !isLoading && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
    </button>
  );
};

const AddPropertyModal = ({
  onClose,
  propertyId,
  isEditing = false,
}: AddPropertyModalProps) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    type: "house",
    roomType: "single",
    city: "",
    country: "",
    address: "",
    description: "",
    price: "",
    rentTime: "monthly",
    paymentTime: "monthly",
    totalRooms: "",
    availableRooms: "",
    roomsToComplete: "",
    size: "",
    floor: "",
    bathrooms: "",
    separatedBathroom: false,
    residentsCount: "",
    availablePersons: "",
    gender: "any",
    priceIncludeWaterAndElectricity: false,
    includeFurniture: false,
    airConditioning: false,
    includeWaterHeater: false,
    parking: false,
    internet: false,
    nearToMetro: false,
    nearToMarket: false,
    elevator: false,
    trialPeriod: false,
    goodForForeigners: false,
    allowSmoking: false,
    termsAndConditions: "",
    images: [],
    categoryId: "1",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        setCategories(response.data?.categories);

        // Set default category if available
        if (response.data?.categories.length > 0) {
          setFormData((prev) => ({
            ...prev,
            categoryId: response.data?.categories[0].id,
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Set totalRooms to 1 when property type is "room"
  useEffect(() => {
    if (formData.type === "room") {
      setFormData((prev) => ({
        ...prev,
        totalRooms: "1",
      }));
    }
  }, [formData.type]);

  // Fetch property data if editing
  useEffect(() => {
    if (isEditing && propertyId) {
      const fetchPropertyData = async () => {
        try {
          const response = await axios.get(`/api/properties/${propertyId}`);
          const property = response.data;

          setFormData({
            title: property.title || "",
            type: property.type || "house",
            roomType: property.roomType || "single",
            city: property.city || "",
            country: property.country || "",
            address: property.address || "",
            description: property.description || "",
            price: property.price || "",
            rentTime: property.rentTime || "monthly",
            paymentTime: property.paymentTime || "monthly",
            totalRooms: property.totalRooms || "",
            availableRooms: property.availableRooms || "",
            roomsToComplete: property.roomsToComplete || "",
            size: property.size || "",
            floor: property.floor || "",
            bathrooms: property.bathrooms || "",
            separatedBathroom: property.separatedBathroom || false,
            residentsCount: property.residentsCount || "",
            availablePersons: property.availablePersons || "",
            gender: property.genderRequired || "any",
            priceIncludeWaterAndElectricity:
              property.priceIncludeWaterAndElectricity || false,
            includeFurniture: property.includeFurniture || false,
            airConditioning: property.airConditioning || false,
            includeWaterHeater: property.includeWaterHeater || false,
            parking: property.parking || false,
            internet: property.internet || false,
            nearToMetro: property.nearToMetro || false,
            nearToMarket: property.nearToMarket || false,
            elevator: property.elevator || false,
            trialPeriod: property.trialPeriod || false,
            goodForForeigners: property.goodForForeigners || false,
            allowSmoking: property.allowSmoking || false,
            termsAndConditions: property.termsAndConditions || "",
            images: [], // We can't edit the actual file objects
            categoryId: property.categoryId || "1",
            latitude: property.latitude || "",
            longitude: property.longitude || "",
          });

          // Set preview images from existing property images
          if (property.images && property.images.length > 0) {
            setPreviewImages(property.images);
          }
        } catch (error) {
          console.error("Error fetching property data:", error);
          toast.error("Failed to load property data");
        }
      };

      fetchPropertyData();
    }
  }, [isEditing, propertyId]);

  // Validate form based on current step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    switch (stepNumber) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = "Title is required";
        }
        if (!formData.type) {
          newErrors.type = "Property type is required";
        }
        if (!formData.city.trim()) {
          newErrors.city = "City is required";
        }
        if (!formData.country.trim()) {
          newErrors.country = "Country is required";
        }
        if (!formData.address.trim()) {
          newErrors.address = "Address is required";
        }
        if (!formData.description.trim()) {
          newErrors.description = "Description is required";
        }
        if (formData.latitude === "" || formData.longitude === "") {
          newErrors.location = "Please select a location on the map";
        }
        break;

      case 2:
        if (!formData.price || parseFloat(formData.price) <= 0) {
          newErrors.price = "A valid price is required";
        }
        if (!formData.rentTime) {
          newErrors.rentTime = "Rent time period is required";
        }
        break;

      case 3:
        if (formData.type === "house") {
          if (!formData.totalRooms) {
            newErrors.totalRooms = "Number of total rooms is required";
          }
          if (!formData.availableRooms) {
            newErrors.availableRooms = "Number of available rooms is required";
          }
        }
        if (!formData.size) {
          newErrors.size = "Property size is required";
        }
        if (!formData.bathrooms) {
          newErrors.bathrooms = "Number of bathrooms is required";
        }
        if (!formData.residentsCount) {
          newErrors.residentsCount = "Residents count is required";
        }
        break;

      case 4:
        if (!formData.termsAndConditions) {
          newErrors.termsAndConditions = "Terms and conditions are required";
        }
        if (!formData.categoryId) {
          newErrors.categoryId = "Category is required";
        }
        break;

      case 5:
        if (formData.images.length === 0 && !isEditing) {
          newErrors.images = "At least one image is required";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const isChecked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: isChecked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Common input class construction function for reuse
  const getInputClassName = (fieldName: string) => {
    return `w-full px-4 py-3 border ${
      errors[fieldName]
        ? "border-red-500 ring-1 ring-red-500"
        : "border-gray-300/60"
    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors glassmorphism-input`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedImages = [...formData.images, ...newFiles];
      setFormData({ ...formData, images: updatedImages });

      // Create preview URLs for the new images
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...newPreviews]);

      // Clear error when user selects images
      if (errors.images) {
        setErrors({ ...errors, images: "" });
      }

      // Reset the input value to allow selecting the same file again
      e.target.value = "";
    }
  };

  // Remove specific image
  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });

    // Also remove the preview
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index]); // Clean up the URL
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
  };

  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      previewImages.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewImages]);

  const handleLocationSelect = (lat: number, lng: number) => {
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });

    // Clear location error when user selects a location
    if (errors.location) {
      setErrors({ ...errors, location: "" });
    }
  };

  // Handle country change to update map position
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    handleInputChange(e);

    // Update map position if country has known coordinates
    if (countryCode && countryCoordinates[countryCode]) {
      setFormData((prev) => ({
        ...prev,
        country: countryCode,
        latitude: countryCoordinates[countryCode][0].toString(),
        longitude: countryCoordinates[countryCode][1].toString(),
      }));
    }
  };

  // Update the mutation implementation to properly handle success and error states
  const { mutate: createProperty, isPending: isCreating } = useMutation({
    mutationFn: (propertyData: any) => {
      return axios.post("/api/properties", propertyData);
    },
    onSuccess: (response) => {
      // Get the newly created property from the response
      const newProperty = response.data.property;

      // Update the properties cache directly
      queryClient.setQueryData(["properties"], (oldData: any) => {
        // If we have old data, append the new property to it
        if (oldData) {
          return [...oldData, newProperty];
        }
        // Otherwise just return a new array with the new property
        return [newProperty];
      });

      // Update the my-properties cache directly too
      queryClient.setQueryData(["my-properties"], (oldData: any) => {
        if (oldData) {
          return [...oldData, newProperty];
        }
        return [newProperty];
      });

      // Also invalidate the queries to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });

      toast.success("Property created successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Error creating property:", error);
      toast.error("Failed to create property. Please try again.");
    },
  });

  const { mutate: updateProperty, isPending: isUpdating } = useMutation({
    mutationFn: (propertyData: any) => {
      return axios.put(`/api/properties/${propertyId}`, propertyData);
    },
    onSuccess: (response) => {
      // Get the updated property from the response
      const updatedProperty = response.data.property;

      // Update the properties cache directly
      queryClient.setQueryData(["properties"], (oldData: any) => {
        // Replace the old property with the updated one
        if (oldData) {
          return oldData.map((property: any) =>
            property.id === updatedProperty.id ? updatedProperty : property
          );
        }
        return oldData;
      });

      // Update the my-properties cache directly too
      queryClient.setQueryData(["my-properties"], (oldData: any) => {
        if (oldData) {
          return oldData.map((property: any) =>
            property.id === updatedProperty.id ? updatedProperty : property
          );
        }
        return oldData;
      });

      // Also update single property cache if it exists
      if (propertyId) {
        queryClient.setQueryData(["property", propertyId], updatedProperty);
      }

      // Also invalidate the queries to ensure fresh data is fetched
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: ["my-properties"] });
      if (propertyId) {
        queryClient.invalidateQueries({ queryKey: ["property", propertyId] });
      }

      toast.success("Property updated successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    },
  });

  // Update the handleSubmit function to use the new mutation pattern
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(step)) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    // Don't need to set isSubmitting manually any more, the mutations handle that
    // setIsSubmitting(true);

    try {
      // Create a regular JavaScript object for JSON submission with proper typing
      const propertyData: any = {
        title: formData.title,
        type: formData.type,
        roomType: formData.roomType,
        city: formData.city,
        country: formData.country,
        address: formData.address,
        description: formData.description,
        price: formData.price,
        rentTime: formData.rentTime,
        paymentTime: formData.paymentTime,
        totalRooms: formData.totalRooms,
        availableRooms: formData.availableRooms,
        roomsToComplete: formData.roomsToComplete,
        size: formData.size,
        floor: formData.floor,
        bathrooms: formData.bathrooms,
        separatedBathroom: formData.separatedBathroom,
        residentsCount: formData.residentsCount,
        availablePersons: formData.availablePersons,
        genderRequired: formData.gender,
        priceIncludeWaterAndElectricity:
          formData.priceIncludeWaterAndElectricity,
        includeFurniture: formData.includeFurniture,
        airConditioning: formData.airConditioning,
        includeWaterHeater: formData.includeWaterHeater,
        parking: formData.parking,
        internet: formData.internet,
        nearToMetro: formData.nearToMetro,
        nearToMarket: formData.nearToMarket,
        elevator: formData.elevator,
        trialPeriod: formData.trialPeriod,
        goodForForeigners: formData.goodForForeigners,
        allowSmoking: formData.allowSmoking,
        termsAndConditions: formData.termsAndConditions,
        categoryId: formData.categoryId,
        latitude: formData.latitude,
        longitude: formData.longitude,
        images: [], // Initialize with empty array, will be populated below
      };

      // Convert all selected images to base64 strings
      if (formData.images.length > 0) {
        // Function to convert File to base64
        const fileToBase64 = (file: File): Promise<string> => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
          });
        };

        // Show loading toast when converting images
        const loadingToast = toast.loading("Processing images...");

        try {
          // Convert each image to base64
          const imagePromises = Array.from(formData.images).map(fileToBase64);
          const base64Images = await Promise.all(imagePromises);

          // Replace the empty array with the base64 strings
          propertyData.images = base64Images;

          toast.dismiss(loadingToast);
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error("Error processing images. Please try again.");
          console.error("Error converting images to base64:", error);
          return;
        }
      } else if (isEditing && previewImages.length > 0) {
        // If editing and we already have image URLs, use those
        propertyData.images = previewImages;
      }

      if (isEditing && propertyId) {
        // Update existing property
        propertyData.propertyId = propertyId;
        updateProperty(propertyData);
      } else {
        // Create new property
        createProperty(propertyData);
      }

      // The modal will be closed in the onSuccess handlers of the mutations
      // The onClose() call has been moved to the onSuccess handlers
    } catch (error) {
      console.error("Error preparing property data:", error);
      toast.error("Failed to prepare property data. Please try again.");
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  // Add custom scrollbar style
  const scrollbarStyle = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(243, 244, 246, 0.3);
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(156, 163, 175, 0.5);
      border-radius: 10px;
    }
    
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.6);
    }
  `;

  // Add css class for glassy input fields
  const glassyInput = `
    .glassmorphism-input {
      background-color: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(4px);
      border-color: rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }
    
    .glassmorphism-input:focus {
      background-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
    }
    
    .glassmorphism-input:hover:not(:focus) {
      background-color: rgba(255, 255, 255, 0.7);
    }
    
    .text-gradient {
      background: linear-gradient(to right, var(--color-primary), var(--color-secondary, #8b5cf6));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    
    .bg-gradient {
      background: linear-gradient(to right, var(--color-primary), var(--color-secondary, #8b5cf6));
    }
  `;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fadeIn space-y-6 p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Property Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={getInputClassName("title")}
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Modern Apartment in Downtown"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-1.5 font-medium">
                  Property Type<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.type === "house"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-300 hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, type: "house" })}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.type === "house"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3
                          className={`font-medium ${
                            formData.type === "house"
                              ? "text-primary"
                              : "text-gray-700"
                          }`}
                        >
                          House
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Entire house or apartment
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.type === "room"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-300 hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, type: "room" })}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          formData.type === "room"
                            ? "bg-primary text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM17 6a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3
                          className={`font-medium ${
                            formData.type === "room"
                              ? "text-primary"
                              : "text-gray-700"
                          }`}
                        >
                          Room
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Private or shared room
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {formData.type === "room" && (
                <div>
                  <label className="block text-gray-700 mb-1.5 font-medium">
                    Room Type<span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.roomType === "single"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, roomType: "single" })
                      }
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.roomType === "single"
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3
                            className={`font-medium ${
                              formData.roomType === "single"
                                ? "text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            Single Occupancy
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Private room for one person
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        formData.roomType === "mixed"
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-gray-300 hover:border-primary/50"
                      }`}
                      onClick={() =>
                        setFormData({ ...formData, roomType: "mixed" })
                      }
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            formData.roomType === "mixed"
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3
                            className={`font-medium ${
                              formData.roomType === "mixed"
                                ? "text-primary"
                                : "text-gray-700"
                            }`}
                          >
                            Shared Room
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Shared with multiple people
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label
                  htmlFor="city"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  City<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`w-full px-4 py-3 border ${
                      errors.city
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., New York, Chicago, San Francisco"
                  />
                  {errors.city && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.city}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="country"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Country<span className="text-red-500">*</span>
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    {formData.country && (
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <ReactCountryFlag
                          countryCode={formData.country}
                          svg
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                          }}
                        />
                      </div>
                    )}
                    <select
                      id="country"
                      name="country"
                      className={`w-full ${
                        formData.country ? "pl-12" : "pl-4"
                      } pr-10 py-3 border ${
                        errors.country
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none bg-white cursor-pointer`}
                      value={formData.country}
                      onChange={handleCountryChange}
                    >
                      <option value="">Select a country</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="CN">China</option>
                      <option value="IN">India</option>
                      <option value="BR">Brazil</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                      <option value="EG">Egypt</option>
                      <option value="TR">Turkey</option>
                      <option value="RU">Russia</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.country && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.country}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Address<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className={`w-full px-4 py-3 border ${
                        errors.address
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="e.g., 123 Main St, Apt 4B"
                    />
                    {errors.address && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Location Map Section */}
              <div>
                <label className="block text-gray-700 mb-1.5 font-medium">
                  Property Location<span className="text-red-500">*</span>
                </label>
                <div
                  className={`w-full h-64 mb-2 border rounded-lg overflow-hidden shadow-sm ${
                    errors.location
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  }`}
                >
                  <MapWithNoSSR
                    initialPosition={
                      formData.latitude && formData.longitude
                        ? [
                            parseFloat(formData.latitude),
                            parseFloat(formData.longitude),
                          ]
                        : [34.052235, -118.243683]
                    }
                    onLocationSelect={handleLocationSelect}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-1 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {formData.country
                    ? "Country location selected. Click on the map to select a more specific location."
                    : "Please select a country first, then click on the map to select a specific location."}
                </p>
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.location}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    className={`w-full px-4 py-3 border ${
                      errors.description
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property... Include details like nearby attractions, transportation options, and special features."
                  />
                  {errors.description && (
                    <div className="absolute top-3 right-3 flex items-start pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    A good description helps potential roommates understand your
                    property better.
                  </p>
                )}
              </div>
            </div>

            {/* Add in-content navigation buttons */}
            <div className="flex justify-end mt-8">
              <NavigationButton type="next" onClick={nextStep} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn space-y-6 p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Pricing Details
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="price"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Rent Amount<span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">
                        {getCurrencySymbol(formData.country || "US")}
                      </span>
                    </div>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      className={`w-full pl-10 pr-4 py-3 border ${
                        errors.price
                          ? "border-red-500 ring-1 ring-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="e.g., 1500"
                      min="0"
                    />
                    {errors.price && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-red-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="rentTime"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Rent Time Period<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="rentTime"
                    name="rentTime"
                    className={`w-full px-4 py-3 border ${
                      errors.rentTime
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                    value={formData.rentTime}
                    onChange={handleInputChange}
                  >
                    <option value="daily">{formatRentTime("daily")}</option>
                    <option value="weekly">{formatRentTime("weekly")}</option>
                    <option value="monthly">{formatRentTime("monthly")}</option>
                    <option value="quarterly">
                      {formatRentTime("quarterly")}
                    </option>
                    <option value="semiannual">
                      {formatRentTime("semiannual")}
                    </option>
                    <option value="annually">
                      {formatRentTime("annually")}
                    </option>
                  </select>
                  {errors.rentTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.rentTime}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    How often the tenant needs to pay rent
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="paymentTime"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Payment Schedule
                </label>
                <select
                  id="paymentTime"
                  name="paymentTime"
                  className={`w-full px-4 py-3 border ${
                    errors.paymentTime
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.paymentTime}
                  onChange={handleInputChange}
                >
                  <option value="daily">{getPaymentTimeLabel("daily")}</option>
                  <option value="weekly">
                    {getPaymentTimeLabel("weekly")}
                  </option>
                  <option value="monthly">
                    {getPaymentTimeLabel("monthly")}
                  </option>
                  <option value="quarterly">
                    {getPaymentTimeLabel("quarterly")}
                  </option>
                  <option value="semiannual">
                    {getPaymentTimeLabel("semiannual")}
                  </option>
                  <option value="annually">
                    {getPaymentTimeLabel("annually")}
                  </option>
                </select>
                {errors.paymentTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.paymentTime}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  How often the payment should be processed
                </p>
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="priceIncludeWaterAndElectricity"
                  name="priceIncludeWaterAndElectricity"
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                  checked={formData.priceIncludeWaterAndElectricity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceIncludeWaterAndElectricity: e.target.checked,
                    })
                  }
                />
                <label
                  htmlFor="priceIncludeWaterAndElectricity"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Price includes utilities (water and electricity)
                </label>
              </div>
            </div>

            {/* Add in-content navigation buttons */}
            <div className="flex justify-between mt-8">
              <NavigationButton type="prev" onClick={prevStep} />
              <NavigationButton type="next" onClick={nextStep} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Property Details
            </h3>

            {/* Only show rooms fields if property type is "house" */}
            {formData.type === "house" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="totalRooms"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Total Rooms<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="totalRooms"
                    name="totalRooms"
                    className={`w-full px-4 py-3 border ${
                      errors.totalRooms
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    placeholder="e.g., 4"
                    min="1"
                  />
                  {errors.totalRooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalRooms}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="availableRooms"
                    className="block text-gray-700 mb-1.5 font-medium"
                  >
                    Available Rooms<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="availableRooms"
                    name="availableRooms"
                    className={`w-full px-4 py-3 border ${
                      errors.availableRooms
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                    value={formData.availableRooms}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    min="0"
                  />
                  {errors.availableRooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.availableRooms}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label
                  htmlFor="size"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Size (sq m)<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="size"
                  name="size"
                  className={`w-full px-4 py-3 border ${
                    errors.size
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 80"
                  min="1"
                />
                {errors.size && (
                  <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="floor"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Floor
                </label>
                <input
                  type="number"
                  id="floor"
                  name="floor"
                  className={`w-full px-4 py-3 border ${
                    errors.floor
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                  min="0"
                />
                {errors.floor && (
                  <p className="text-red-500 text-sm mt-1">{errors.floor}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Bathrooms<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  className={`w-full px-4 py-3 border ${
                    errors.bathrooms
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  min="0"
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bathrooms}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="residentsCount"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Residents Count<span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="residentsCount"
                  name="residentsCount"
                  className={`w-full px-4 py-3 border ${
                    errors.residentsCount
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.residentsCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 4"
                  min="1"
                />
                {errors.residentsCount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentsCount}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
              <div>
                <label
                  htmlFor="availablePersons"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Available Capacity
                </label>
                <input
                  type="number"
                  id="availablePersons"
                  name="availablePersons"
                  className={`w-full px-4 py-3 border ${
                    errors.availablePersons
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.availablePersons}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                  min="0"
                />
                {errors.availablePersons && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availablePersons}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Gender Requirement
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.gender === "male"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-300 hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, gender: "male" })}
                  >
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          formData.gender === "male"
                            ? "text-primary font-medium"
                            : "text-gray-700"
                        }
                      >
                        Male Only
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.gender === "female"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-300 hover:border-primary/50"
                    }`}
                    onClick={() =>
                      setFormData({ ...formData, gender: "female" })
                    }
                  >
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          formData.gender === "female"
                            ? "text-primary font-medium"
                            : "text-gray-700"
                        }
                      >
                        Female Only
                      </span>
                    </div>
                  </div>
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-all ${
                      formData.gender === "any"
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-gray-300 hover:border-primary/50"
                    }`}
                    onClick={() => setFormData({ ...formData, gender: "any" })}
                  >
                    <div className="flex items-center justify-center">
                      <span
                        className={
                          formData.gender === "any"
                            ? "text-primary font-medium"
                            : "text-gray-700"
                        }
                      >
                        Any Gender
                      </span>
                    </div>
                  </div>
                </div>
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div className="flex mt-4">
              <input
                type="checkbox"
                id="separatedBathroom"
                name="separatedBathroom"
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                checked={formData.separatedBathroom}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    separatedBathroom: e.target.checked,
                  })
                }
              />
              <label
                htmlFor="separatedBathroom"
                className="ml-2 block text-sm text-gray-700"
              >
                Property has separated bathrooms
              </label>
            </div>

            {/* Add in-content navigation buttons */}
            <div className="flex justify-between mt-8">
              <NavigationButton type="prev" onClick={prevStep} />
              <NavigationButton type="next" onClick={nextStep} />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Amenities & Features
            </h3>

            <div className="space-y-6">
              {/* Basic Amenities */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Basic Amenities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeFurniture"
                      name="includeFurniture"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.includeFurniture}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          includeFurniture: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="includeFurniture"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Furnished
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="internet"
                      name="internet"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.internet}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          internet: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="internet"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Internet
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="airConditioning"
                      name="airConditioning"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.airConditioning}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          airConditioning: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="airConditioning"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Air Conditioning
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeWaterHeater"
                      name="includeWaterHeater"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.includeWaterHeater}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          includeWaterHeater: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="includeWaterHeater"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Water Heater
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="elevator"
                      name="elevator"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.elevator}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          elevator: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="elevator"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Elevator
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="parking"
                      name="parking"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.parking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          parking: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="parking"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Parking
                    </label>
                  </div>
                </div>
              </div>

              {/* Location Advantages */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Location Advantages
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="nearToMetro"
                      name="nearToMetro"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.nearToMetro}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nearToMetro: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="nearToMetro"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Near Metro/Public Transport
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="nearToMarket"
                      name="nearToMarket"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.nearToMarket}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nearToMarket: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="nearToMarket"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Near Shopping/Market
                    </label>
                  </div>
                </div>
              </div>

              {/* Rental Terms */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Rental Terms</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="trialPeriod"
                      name="trialPeriod"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.trialPeriod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trialPeriod: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="trialPeriod"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Trial Period Available
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="goodForForeigners"
                      name="goodForForeigners"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.goodForForeigners}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          goodForForeigners: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="goodForForeigners"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Suitable for Foreigners
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="allowSmoking"
                      name="allowSmoking"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      checked={formData.allowSmoking}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          allowSmoking: e.target.checked,
                        })
                      }
                    />
                    <label
                      htmlFor="allowSmoking"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Smoking Allowed
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="categoryId"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Property Category<span className="text-red-500">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`w-full px-4 py-3 border ${
                    errors.categoryId
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors appearance-none`}
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label
                  htmlFor="termsAndConditions"
                  className="block text-gray-700 mb-1.5 font-medium"
                >
                  Terms and Conditions<span className="text-red-500">*</span>
                </label>
                <textarea
                  id="termsAndConditions"
                  name="termsAndConditions"
                  rows={4}
                  className={`w-full px-4 py-3 border ${
                    errors.termsAndConditions
                      ? "border-red-500 ring-1 ring-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors`}
                  value={formData.termsAndConditions}
                  onChange={handleInputChange}
                  placeholder="Enter any specific terms or conditions for renting this property..."
                ></textarea>
                {errors.termsAndConditions && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.termsAndConditions}
                  </p>
                )}
              </div>
            </div>

            {/* Add in-content navigation buttons */}
            <div className="flex justify-between mt-8">
              <NavigationButton type="prev" onClick={prevStep} />
              <NavigationButton type="next" onClick={nextStep} />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fadeIn p-5 rounded-lg bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Property Images
            </h3>
            <p className="text-gray-600 mb-4">
              Upload clear images of your property to attract potential tenants.
              You can upload multiple images.
            </p>

            <div className="mb-4">
              <div
                className={`border-2 border-dashed ${
                  errors.images
                    ? "border-red-400 bg-red-50"
                    : "border-gray-300 bg-gray-50"
                } rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100 transition-all`}
                onClick={() => document.getElementById("images")?.click()}
              >
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="mt-1 text-sm text-gray-600">
                  Click to upload images or drag and drop
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}
            </div>

            {(formData.images.length > 0 || previewImages.length > 0) && (
              <div>
                <h4 className="font-medium text-gray-800 mb-2">
                  Preview ({formData.images.length || previewImages.length})
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.images.length > 0
                    ? Array.from(formData.images).map((image, index) => (
                        <div
                          key={index}
                          className="relative h-24 rounded-md overflow-hidden"
                        >
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
                          >
                            <X className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      ))
                    : previewImages.map((src, index) => (
                        <div
                          key={index}
                          className="relative h-24 rounded-md overflow-hidden"
                        >
                          <img
                            src={src}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                </div>
              </div>
            )}

            {/* Add in-content navigation buttons */}
            <div className="flex justify-between mt-8">
              <NavigationButton type="prev" onClick={prevStep} />
              <NavigationButton
                type="next"
                onClick={(e) => {
                  if (e) {
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
                isLoading={isCreating || isUpdating}
                disabled={isCreating || isUpdating}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Enhance footer navigation buttons
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <style jsx global>
        {scrollbarStyle}
      </style>
      <style jsx global>
        {glassyInput}
      </style>
      <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-white/20">
        <div className="p-6 border-b border-gray-200/70 flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent">
          <h2 className="text-2xl font-semibold text-gradient">
            {isEditing ? "Edit Property" : "Add New Property"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-8 px-6 pt-6">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 5 ? "flex-1" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    validateStep(step) && step > stepNumber
                      ? setStep(stepNumber)
                      : null
                  }
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                    step >= stepNumber
                      ? "bg-gradient text-white"
                      : "bg-gray-200/70 backdrop-blur-sm text-gray-600"
                  } ${
                    step > stepNumber
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-default"
                  }`}
                >
                  {stepNumber}
                </button>
                {stepNumber < 5 && (
                  <div
                    className={`flex-1 h-1.5 mx-2 rounded transition-all duration-300 ${
                      step > stepNumber ? "bg-gradient" : "bg-gray-200/70"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 text-xs font-medium text-gray-600">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Details</span>
            <span>Amenities</span>
            <span>Images</span>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-3 custom-scrollbar">
          <form onSubmit={handleSubmit}>{renderStep()}</form>
        </div>

        {/* Footer navigation - can be hidden since we have in-content navigation now */}
        {/* <div className="p-6 border-t border-gray-200/70 flex justify-between bg-gradient-to-r from-transparent to-primary/10">
          <button
            type="button"
            onClick={step > 1 ? prevStep : onClose}
            className="px-6 py-2.5 border border-gray-300/80 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium backdrop-blur-sm shadow-sm flex items-center gap-2"
          >
            {step > 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {step > 1 ? "Previous" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={step < 5 ? nextStep : handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-all duration-300 font-medium shadow-md flex items-center gap-2"
          >
            {step < 5 ? "Next" : isEditing ? "Save Changes" : "Create Property"}
            {step < 5 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default AddPropertyModal;
