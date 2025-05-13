"use client";

import { useState } from "react";
import Image from "next/image";
import { Calendar, DollarSign, Mail, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getInitials, getAvatarColor } from "@/lib/utils";
import { formatPriceWithTime } from "@/utils/formatters";
import { PaymentTime } from "@/types";
import { useUserStore } from "@/store/useUserStore";
import { toast } from "react-hot-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

interface PropertyContactSidebarProps {
  price: string;
  owner: OwnerInfo;
  availability: string;
  availableFrom: string;
  paymentTime: PaymentTime;
  propertyId: string;
}

export default function PropertyContactSidebar({
  price,
  owner,
  availability,
  availableFrom,
  paymentTime,
  propertyId,
}: PropertyContactSidebarProps) {
  const [message, setMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [duration, setDuration] = useState("6");
  const [payDeposit, setPayDeposit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, isAuthenticated } = useUserStore();
  const isOwner = user?.id === owner.id;

  const initials = getInitials(owner.name);
  const bgColor = getAvatarColor(owner.name);
  const hasValidImage = owner.image && !owner.image.includes("default");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isAuthenticated) {
        toast.error("You must be logged in to make an offer");
        setIsSubmitting(false);
        return;
      }

      if (isOwner) {
        toast.error("You cannot make an offer on your own property");
        setIsSubmitting(false);
        return;
      }

      // Validate offer price is a valid number
      const numericPrice = parseFloat(offerPrice);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        toast.error("Please enter a valid offer price");
        setIsSubmitting(false);
        return;
      }

      // Validate phone number
      if (!phone.trim()) {
        toast.error("Please enter your phone number");
        setIsSubmitting(false);
        return;
      }

      try {
        const response = await fetch("/api/offers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            propertyId,
            message,
            price: offerPrice,
            phone,
            duration,
            deposit: payDeposit,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit offer");
        }

        toast.success("Offer submitted successfully!");
        setMessage("");
        setOfferPrice("");
        setPhone("");
        setDuration("6");
        setPayDeposit(false);
      } catch (error: any) {
        console.error("Error submitting offer:", error);
        throw error;
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to send. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Price card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <h3 className="text-2xl font-bold flex items-center">
            {formatPriceWithTime(price, paymentTime)}
          </h3>

          <div className="mt-2 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>
              {availability === "available"
                ? `Available from ${availableFrom}`
                : "Currently not available"}
            </span>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 flex items-center justify-center">
              {hasValidImage ? (
                <Image
                  src={owner.image}
                  alt={owner.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div
                  className={`${bgColor} w-full h-full flex items-center justify-center text-white font-bold`}
                >
                  {initials}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium">{owner.name}</h4>
              <p className="text-sm text-gray-500">Property Owner</p>
            </div>
          </div>

          {owner.phone && (
            <div className="flex items-center text-gray-700 mb-2">
              <Phone className="h-4 w-4 mr-2 text-blue-500" />
              <a href={`tel:${owner.phone}`} className="hover:text-blue-600">
                {owner.phone}
              </a>
            </div>
          )}

          <div className="flex items-center text-gray-700">
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            <a href={`mailto:${owner.email}`} className="hover:text-blue-600">
              {owner.email}
            </a>
          </div>
        </div>
      </div>

      {/* Offer form */}
      {!isOwner && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-500" />
              Make an Offer
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="offerPrice"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Offer Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="offerPrice"
                    type="text"
                    placeholder="Enter your offer price"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Duration (months)
                </label>
                <Select
                  value={duration}
                  onValueChange={(value) => setDuration(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Your Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-8"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="payDeposit"
                  checked={payDeposit}
                  onCheckedChange={(checked: boolean) => setPayDeposit(checked)}
                />
                <label
                  htmlFor="payDeposit"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  I am willing to pay a deposit
                </label>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Offer Details
                </label>
                <Textarea
                  id="message"
                  placeholder="I'd like to make an offer for this property..."
                  rows={4}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setMessage(e.target.value)
                  }
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Offer"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>
                By submitting an offer, you agree to our privacy policy and
                terms of service.
              </p>
            </div>
          </div>
        </div>
      )}

      {isOwner && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-center text-center">
            <div className="max-w-sm">
              <h3 className="text-lg font-medium mb-2">
                This is your property
              </h3>
              <p className="text-gray-500 text-sm">
                You cannot make offers on your own property.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
