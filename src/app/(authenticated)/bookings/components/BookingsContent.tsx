"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserBookings, updateBookingStatus } from "@/actions/bookings";
import { formatDistance } from "date-fns";
import {
  Calendar,
  MapPin,
  Home,
  Check,
  Clock,
  DollarSign,
  Ban,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { BookingStatus } from "@prisma/client";
import { RatingStars } from "@/components/ui/rating-stars";
import RatingModal from "@/components/bookings/RatingModal";

export default function BookingsContent() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<string>("confirmed");
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);

  // Query to fetch bookings
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: getUserBookings,
  });

  // Mutation to update booking status
  const updateStatusMutation = useMutation({
    mutationFn: ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => updateBookingStatus(bookingId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Booking status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update booking status");
    },
  });

  // Handle cancelling a booking
  const handleCancelBooking = (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      updateStatusMutation.mutate({ bookingId, status: "cancelled" });
    }
  };

  // Handle opening the rating modal
  const handleOpenRatingModal = (bookingId: string) => {
    setRatingBookingId(bookingId);
  };

  // Handle closing the rating modal
  const handleCloseRatingModal = () => {
    setRatingBookingId(null);
  };

  // Handle successful rating submission
  const handleRatingSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["bookings"] });
  };

  // Get booking by ID
  const getBookingById = (bookingId: string) => {
    return bookings?.find((booking) => booking.id === bookingId);
  };

  // Filter bookings by status
  const getFilteredBookings = (status: BookingStatus) => {
    return bookings?.filter((booking) => booking.status === status) || [];
  };

  // Group bookings by status for tabs
  const confirmedBookings = getFilteredBookings("confirmed");
  const cancelledBookings = getFilteredBookings("cancelled");

  return (
    <div className="max-w-5xl mx-auto">
      <Tabs
        defaultValue="confirmed"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="w-full mb-6">
          <TabsTrigger value="confirmed" className="flex-1">
            Confirmed{" "}
            {confirmedBookings.length > 0 && (
              <span className="ml-1 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium">
                {confirmedBookings.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="cancelled" className="flex-1">
            Cancelled{" "}
            {cancelledBookings.length > 0 && (
              <span className="ml-1 bg-red-50 text-red-600 rounded-full px-2 py-0.5 text-xs font-medium">
                {cancelledBookings.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Confirmed Bookings */}
        <TabsContent value="confirmed">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : confirmedBookings.length > 0 ? (
            <div className="space-y-6">
              {confirmedBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image
                        src={booking.property.images[0] || "/placeholder.jpg"}
                        alt={booking.property.title || "Property"}
                        className="object-cover"
                        fill
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-2">
                            {booking.property.title || "Unnamed Property"}
                          </h3>

                          <div className="flex items-center text-gray-600 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {booking.property.address},{" "}
                              {booking.property.city},{" "}
                              {booking.property.country}
                            </span>
                          </div>

                          <div className="flex items-center text-gray-600 mb-3">
                            <Home className="h-4 w-4 mr-1" />
                            <span className="text-sm">
                              {booking.property.type} •{" "}
                              {booking.property.category.name}
                            </span>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-medium text-blue-800 mb-2">
                              Booking Details
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">
                                  Booked on:{" "}
                                  {new Date(
                                    booking.createdAt
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">
                                  Amount: ${booking.totalAmount}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                <span className="text-sm">
                                  Status:{" "}
                                  <span className="font-medium text-green-600">
                                    Confirmed
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2">
                          <Link
                            href={`/property/${booking.property.slug}`}
                            className="text-blue-600 text-sm hover:underline"
                          >
                            View Property
                          </Link>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => handleOpenRatingModal(booking.id)}
                          >
                            <Star className="h-4 w-4 mr-1 fill-amber-400" />
                            Rate Property
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={updateStatusMutation.isPending}
                          >
                            <Ban className="h-4 w-4 mr-1" />
                            Cancel Booking
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-500">
                No confirmed bookings
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                You don't have any confirmed bookings yet
              </p>
            </div>
          )}
        </TabsContent>

        {/* Cancelled Bookings */}
        <TabsContent value="cancelled">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : cancelledBookings.length > 0 ? (
            <div className="space-y-6">
              {cancelledBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden opacity-75"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-1/3 relative h-48 md:h-auto">
                      <Image
                        src={booking.property.images[0] || "/placeholder.jpg"}
                        alt={booking.property.title || "Property"}
                        className="object-cover"
                        fill
                      />
                      <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                        <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Cancelled
                        </span>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="p-4 md:p-6 flex-1">
                      <h3 className="text-xl font-semibold mb-2">
                        {booking.property.title || "Unnamed Property"}
                      </h3>

                      <div className="flex items-center text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {booking.property.address}, {booking.property.city},{" "}
                          {booking.property.country}
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-3">
                        <Home className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {booking.property.type} •{" "}
                          {booking.property.category.name}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium text-red-800 mb-2">
                          Booking Details
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-sm">
                              Booked on:{" "}
                              {new Date(booking.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                            <span className="text-sm">
                              Amount: ${booking.totalAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Link
                        href={`/property/${booking.property.slug}`}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        View Property
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Ban className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-500">
                No cancelled bookings
              </h3>
              <p className="text-gray-400 text-sm mt-1">
                You don't have any cancelled bookings
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {ratingBookingId && (
        <RatingModal
          isOpen={!!ratingBookingId}
          onClose={handleCloseRatingModal}
          bookingId={ratingBookingId}
          propertyTitle={getBookingById(ratingBookingId)?.property.title || ""}
          onSuccess={handleRatingSuccess}
        />
      )}
    </div>
  );
}
