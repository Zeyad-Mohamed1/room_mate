"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";
import dynamic from "next/dynamic";
import { ComponentType } from "react";
import { Loader2 } from "lucide-react";

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
}

type PropertyType = "house" | "room";
type RoomType = "mixed" | "single";
type RentTime =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annually";
type Gender = "male" | "female" | "any";

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
  paymentTime: RentTime;
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

const AddPropertyModal = ({ onClose }: AddPropertyModalProps) => {
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

  // Validate form based on current step
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: FormErrors = {};

    if (stepNumber === 1) {
      if (!formData.title.trim())
        newErrors.title = "Property title is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.country) newErrors.country = "Country is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (formData.type === "room" && !formData.roomType) {
        newErrors.roomType = "Room type is required";
      }
      // Validate location
      if (!formData.latitude || !formData.longitude) {
        newErrors.location = "Please select a location on the map";
      }
    } else if (stepNumber === 2) {
      if (!formData.price.trim()) newErrors.price = "Price is required";
      if (!formData.gender) newErrors.gender = "Gender preference is required";
      if (formData.totalRooms && isNaN(Number(formData.totalRooms))) {
        newErrors.totalRooms = "Total rooms must be a number";
      }
      if (formData.availableRooms && isNaN(Number(formData.availableRooms))) {
        newErrors.availableRooms = "Available rooms must be a number";
      }
    } else if (stepNumber === 3) {
      if (formData.size && isNaN(Number(formData.size))) {
        newErrors.size = "Size must be a number";
      }
      if (formData.floor && isNaN(Number(formData.floor))) {
        newErrors.floor = "Floor must be a number";
      }
      if (formData.bathrooms && isNaN(Number(formData.bathrooms))) {
        newErrors.bathrooms = "Bathrooms must be a number";
      }
      if (formData.residentsCount && isNaN(Number(formData.residentsCount))) {
        newErrors.residentsCount = "Residents count must be a number";
      }
      if (
        formData.availablePersons &&
        isNaN(Number(formData.availablePersons))
      ) {
        newErrors.availablePersons = "Available persons must be a number";
      }
    } else if (stepNumber === 5) {
      if (formData.images.length === 0) {
        newErrors.images = "At least one image is required";
      }
      if (!formData.categoryId) {
        newErrors.categoryId = "Category is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(5)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images first to get their URLs
      const imageUrls: string[] = [];

      if (formData.images.length > 0) {
        // Upload each image
        for (const imageFile of formData.images) {
          const uploadFormData = new FormData();
          uploadFormData.append("file", imageFile);

          try {
            // Upload image to our API
            const uploadResponse = await axios.post(
              "/api/upload",
              uploadFormData
            );
            imageUrls.push(uploadResponse.data.url);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError);
            // Continue with other images if one fails
            continue;
          }
        }
      }

      // Prepare data for API without the File objects
      const propertyData = {
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
        images: imageUrls,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      // Submit the property data to API
      const response = await axios.post("/api/properties", propertyData);

      // Show success message
      toast.success("Property added successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting property:", error);
      toast.error("Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Basic Information
            </h3>
            <div className="mb-4">
              <label
                htmlFor="title"
                className="block text-gray-700 mb-2 font-medium"
              >
                Property Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`w-full px-4 py-3 border ${
                  errors.title ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Cozy Studio Apartment in Downtown"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="country"
                className="block text-gray-700 mb-2 font-medium"
              >
                Country
              </label>
              <div className="relative">
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
                    formData.country ? "pl-12" : "px-4"
                  } py-3 border ${
                    errors.country ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
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
              </div>
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="city"
                className="block text-gray-700 mb-2 font-medium"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                className={`w-full px-4 py-3 border ${
                  errors.city ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g., New York, Chicago, San Francisco"
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* Location Map Section */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">
                Property Location
              </label>
              <div
                className={`w-full h-64 mb-2 border rounded-lg overflow-hidden ${
                  errors.location ? "border-red-500" : "border-gray-300"
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
              <p className="text-sm text-gray-500 mb-1">
                {formData.country
                  ? "Country location selected. Click on the map to select a more specific location."
                  : "Please select a country first, then click on the map to select a specific location."}
              </p>
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-gray-700 mb-2 font-medium"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                className={`w-full px-4 py-3 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g., 123 Main St, Apt 4B"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-700 mb-2 font-medium"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className={`w-full px-4 py-3 border ${
                  errors.description ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Pricing & Availability
            </h3>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-gray-700 mb-2 font-medium"
              >
                Price
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  id="price"
                  name="price"
                  className={`w-full pl-8 pr-4 py-3 border ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 800"
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="gender"
                className="block text-gray-700 mb-2 font-medium"
              >
                Gender Preference
              </label>
              <div className="grid grid-cols-3 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.gender === "male"
                      ? "border-primary bg-gradient-subtle"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
                  onClick={() => setFormData({ ...formData, gender: "male" })}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 ${
                        formData.gender === "male"
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-center font-medium ${
                      formData.gender === "male"
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    Male
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.gender === "female"
                      ? "border-primary bg-gradient-subtle"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
                  onClick={() => setFormData({ ...formData, gender: "female" })}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 ${
                        formData.gender === "female"
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-center font-medium ${
                      formData.gender === "female"
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    Female
                  </p>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    formData.gender === "any"
                      ? "border-primary bg-gradient-subtle"
                      : "border-gray-300 hover:border-primary/50"
                  }`}
                  onClick={() => setFormData({ ...formData, gender: "any" })}
                >
                  <div className="flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 ${
                        formData.gender === "any"
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p
                    className={`text-center font-medium ${
                      formData.gender === "any"
                        ? "text-primary"
                        : "text-gray-700"
                    }`}
                  >
                    Any
                  </p>
                </div>
              </div>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="rentTime"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Rent Time
                </label>
                <select
                  id="rentTime"
                  name="rentTime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.rentTime}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannual">Semi-annual</option>
                  <option value="annually">Annually</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="paymentTime"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Payment Time
                </label>
                <select
                  id="paymentTime"
                  name="paymentTime"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  value={formData.paymentTime}
                  onChange={handleInputChange}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="semiannual">Semi-annual</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>

            {formData.type === "house" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="totalRooms"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Total Rooms
                  </label>
                  <input
                    type="text"
                    id="totalRooms"
                    name="totalRooms"
                    className={`w-full px-4 py-3 border ${
                      errors.totalRooms ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      formData.type === "house" ? "bg-gray-100" : ""
                    }`}
                    value={formData.totalRooms}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                    readOnly={formData.type === "house"}
                  />
                  {errors.totalRooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.totalRooms}
                    </p>
                  )}
                  {formData.type === "house" && (
                    <p className="text-gray-500 text-xs mt-1">
                      For single room listings, this value is fixed at 1
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="availableRooms"
                    className="block text-gray-700 mb-2 font-medium"
                  >
                    Available Rooms
                  </label>
                  <input
                    type="text"
                    id="availableRooms"
                    name="availableRooms"
                    className={`w-full px-4 py-3 border ${
                      errors.availableRooms
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      formData.type === "house" ? "bg-gray-100" : ""
                    }`}
                    value={
                      formData.type === "house" ? "1" : formData.availableRooms
                    }
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                    readOnly={formData.type === "house"}
                  />
                  {errors.availableRooms && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.availableRooms}
                    </p>
                  )}
                  {formData.type === "house" && (
                    <p className="text-gray-500 text-xs mt-1">
                      For single room listings, this value is fixed at 1
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Property Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="size"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Size (sq ft)
                </label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className={`w-full px-4 py-3 border ${
                    errors.size ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 500"
                />
                {errors.size && (
                  <p className="text-red-500 text-sm mt-1">{errors.size}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="floor"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Floor
                </label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  className={`w-full px-4 py-3 border ${
                    errors.floor ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., 3"
                />
                {errors.floor && (
                  <p className="text-red-500 text-sm mt-1">{errors.floor}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="bathrooms"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Bathrooms
                </label>
                <input
                  type="text"
                  id="bathrooms"
                  name="bathrooms"
                  className={`w-full px-4 py-3 border ${
                    errors.bathrooms ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                />
                {errors.bathrooms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.bathrooms}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Bathroom Type
                </label>
                <div className="flex items-center h-12 px-4 border border-gray-300 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="separatedBathroom"
                      className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                      checked={formData.separatedBathroom}
                      onChange={handleInputChange}
                    />
                    <span className="text-gray-700">Separated Bathroom</span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="residentsCount"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Current Residents Count
                </label>
                <input
                  type="text"
                  id="residentsCount"
                  name="residentsCount"
                  className={`w-full px-4 py-3 border ${
                    errors.residentsCount ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.residentsCount}
                  onChange={handleInputChange}
                  placeholder="e.g., 2"
                />
                {errors.residentsCount && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.residentsCount}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="availablePersons"
                  className="block text-gray-700 mb-2 font-medium"
                >
                  Available Persons
                </label>
                <input
                  type="text"
                  id="availablePersons"
                  name="availablePersons"
                  className={`w-full px-4 py-3 border ${
                    errors.availablePersons
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  value={formData.availablePersons}
                  onChange={handleInputChange}
                  placeholder="e.g., 1"
                />
                {errors.availablePersons && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.availablePersons}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Amenities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="priceIncludeWaterAndElectricity"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.priceIncludeWaterAndElectricity}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">
                    Price includes water and electricity
                  </span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="includeFurniture"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.includeFurniture}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Furniture included</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="airConditioning"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.airConditioning}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Air conditioning</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="includeWaterHeater"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.includeWaterHeater}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Water heater included</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="parking"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.parking}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Parking available</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="internet"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.internet}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Internet included</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="nearToMetro"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.nearToMetro}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Near to metro</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="nearToMarket"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.nearToMarket}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Near to market</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="elevator"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.elevator}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Elevator available</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="trialPeriod"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.trialPeriod}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Trial period available</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="goodForForeigners"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.goodForForeigners}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Good for foreigners</span>
                </label>
              </div>

              <div className="p-4 border border-gray-300 rounded-lg hover:border-primary/50 transition-colors">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="allowSmoking"
                    className="w-4 h-4 mr-2 text-primary focus:ring-primary"
                    checked={formData.allowSmoking}
                    onChange={handleInputChange}
                  />
                  <span className="text-gray-700">Allow smoking</span>
                </label>
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="roomsToComplete"
                className="block text-gray-700 mb-2 font-medium"
              >
                Rooms to Complete
              </label>
              <input
                type="text"
                id="roomsToComplete"
                name="roomsToComplete"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                value={formData.roomsToComplete}
                onChange={handleInputChange}
                placeholder="e.g., 2"
              />
              <p className="text-sm text-gray-500 mt-1">
                Number of additional roommates needed
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-fadeIn">
            <h3 className="text-xl font-semibold mb-6 text-gradient">
              Additional Information
            </h3>
            <div className="mb-6">
              <label
                htmlFor="categoryId"
                className="block text-gray-700 mb-2 font-medium"
              >
                Property Category
              </label>
              <select
                id="categoryId"
                name="categoryId"
                className={`w-full px-4 py-3 border ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                value={formData.categoryId}
                onChange={handleInputChange}
              >
                {categories.length === 0 ? (
                  <option value="">Loading categories...</option>
                ) : (
                  Array.isArray(categories) &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
              )}
            </div>

            <div className="mb-6">
              <label
                htmlFor="termsAndConditions"
                className="block text-gray-700 mb-2 font-medium"
              >
                Terms and Conditions
              </label>
              <textarea
                id="termsAndConditions"
                name="termsAndConditions"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                value={formData.termsAndConditions}
                onChange={handleInputChange}
                placeholder="Enter any specific terms and conditions for your property..."
              ></textarea>
            </div>

            <div className="mb-6">
              <label
                htmlFor="images"
                className="block text-gray-700 mb-2 font-medium"
              >
                Property Images
              </label>
              <div
                className={`border-2 border-dashed ${
                  errors.images ? "border-red-500" : "border-gray-300"
                } rounded-lg p-6 text-center transition-colors`}
              >
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label htmlFor="images" className="cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-600 mb-1">Click to add an image</p>
                  <p className="text-sm text-gray-500">Add images one by one</p>
                </label>
              </div>
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">{errors.images}</p>
              )}

              {previewImages.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-700 mb-2 font-medium">
                    Selected Images:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previewImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-75 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto shadow-soft">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-center justify-center mb-6">
          <div className="w-10 h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-xl mr-3">
            RF
          </div>
          <h2 className="text-2xl font-bold text-gradient">Add New Property</h2>
        </div>

        <div className="mb-8">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${
                  stepNumber < 5 ? "flex-1" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber
                      ? "bg-gradient text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? "bg-gradient" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Pricing</span>
            <span>Details</span>
            <span>Amenities</span>
            <span>Images</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStep()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Previous
              </button>
            )}

            {step < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="ml-auto px-5 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-soft flex items-center"
              >
                Next
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="ml-auto px-5 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium shadow-soft flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
