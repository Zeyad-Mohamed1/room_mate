"use client";

import { Property, Offer, Category } from "@prisma/client";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import {
  Edit,
  Trash,
  MapPin,
  ChevronDown,
  ChevronUp,
  BedDouble,
  Home,
  MessageCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import OffersList from "./OffersList";
import AddPropertyModal from "@/components/shared/AddPropertyModal";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface OfferWithUser extends Offer {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface PropertyWithRelations extends Property {
  offers: OfferWithUser[];
  category: Category;
}

interface PropertyListProps {
  properties: PropertyWithRelations[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const queryClient = useQueryClient();
  const [expandedProperties, setExpandedProperties] = useState<
    Record<string, boolean>
  >({});
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(
    null
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [propertyList, setPropertyList] =
    useState<PropertyWithRelations[]>(properties);

  useEffect(() => {
    setPropertyList(properties);
  }, [properties]);

  const togglePropertyExpansion = (propertyId: string) => {
    setExpandedProperties((prev) => ({
      ...prev,
      [propertyId]: !prev[propertyId],
    }));
  };

  const handleEditProperty = (propertyId: string) => {
    setEditingPropertyId(propertyId);
  };

  const { mutate: deletePropertyMutation } = useMutation({
    mutationFn: (propertyId: string) => {
      return axios.delete(`/api/properties/${propertyId}`);
    },
  });

  const handleDeleteProperty = async (propertyId: string) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [propertyId]: true }));

      deletePropertyMutation(propertyId, {
        onSuccess: (response) => {
          toast.success("Property deleted successfully");
          // Remove the property from the local state
          setPropertyList((prevList) =>
            prevList.filter((property) => property.id !== propertyId)
          );
          setShowDeleteConfirm(null);
          queryClient.invalidateQueries({ queryKey: ["my-properties"] });
          queryClient.invalidateQueries({ queryKey: ["properties"] });
        },
        onError: (error: any) => {
          console.error("Error deleting property:", error);
          toast.error(
            error.response?.data?.error || "Failed to delete property"
          );
        },
        onSettled: () => {
          setIsDeleting((prev) => ({ ...prev, [propertyId]: false }));
        },
      });
    } catch (error: any) {
      console.error("Error deleting property:", error);
      toast.error(error.response?.data?.error || "Failed to delete property");
      setIsDeleting((prev) => ({ ...prev, [propertyId]: false }));
    }
  };

  return (
    <>
      <div className="space-y-6">
        {propertyList.length > 0 ? (
          propertyList.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl shadow-soft overflow-hidden transition-all duration-300 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <div className="relative h-48 md:h-auto md:w-1/3 md:max-w-[300px]">
                  <Image
                    src={property.images?.[0] || "/placeholder-property.jpg"}
                    alt={property.title || "Property"}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover"
                    priority={false}
                  />
                </div>

                {/* Property Content */}
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gradient text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          {property.type === "house" ? (
                            <Home className="h-3 w-3" />
                          ) : (
                            <BedDouble className="h-3 w-3" />
                          )}
                          {property.type === "house" ? "House" : "Room"}
                        </div>
                        <div className="text-primary text-sm font-semibold">
                          {property.price && `$${property.price}/month`}
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-1">
                        {property.title || "Unnamed Property"}
                      </h3>

                      <p className="text-gray-600 text-sm mb-3 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-primary flex-shrink-0" />
                        <span className="truncate">
                          {property.city}, {property.country}
                        </span>
                      </p>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                        {property.description || "No description available"}
                      </p>

                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1 text-primary" />
                          {property.offers?.length}{" "}
                          {property.offers?.length === 1 ? "offer" : "offers"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => handleEditProperty(property.id)}
                        className="flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      {showDeleteConfirm === property.id ? (
                        <div className="flex flex-col gap-2 p-3 bg-red-50 rounded-md border border-red-100">
                          <div className="flex items-center text-red-600 text-xs mb-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Confirm deletion?
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="flex-1 bg-red-600 text-white text-xs py-1 px-2 rounded hover:bg-red-700 disabled:opacity-50 flex justify-center items-center"
                              onClick={() => handleDeleteProperty(property.id)}
                              disabled={!!isDeleting[property.id]}
                            >
                              {isDeleting[property.id] ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                "Yes"
                              )}
                            </button>
                            <button
                              className="flex-1 bg-gray-200 text-gray-800 text-xs py-1 px-2 rounded hover:bg-gray-300"
                              onClick={() => setShowDeleteConfirm(null)}
                            >
                              No
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="flex items-center justify-center rounded-md bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
                          onClick={() => setShowDeleteConfirm(property.id)}
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {property?.offers?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        className="flex items-center text-primary font-medium text-sm"
                        onClick={() => togglePropertyExpansion(property.id)}
                      >
                        {expandedProperties[property.id] ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Hide Offers
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            View {property.offers?.length}{" "}
                            {property.offers?.length === 1 ? "Offer" : "Offers"}
                          </>
                        )}
                      </button>

                      {expandedProperties[property.id] && (
                        <div className="mt-4">
                          <OffersList
                            propertyId={property.id}
                            offers={property.offers}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-8 text-gray-500">No properties found</p>
        )}
      </div>

      {/* Edit Property Modal */}
      {editingPropertyId && (
        <AddPropertyModal
          propertyId={editingPropertyId}
          isEditing={true}
          onClose={() => setEditingPropertyId(null)}
        />
      )}
    </>
  );
}
