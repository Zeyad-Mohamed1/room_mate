"use client";

import { useState } from "react";
import { MapPinIcon, MessageCircle } from "lucide-react";
import MapModal from "@/components/shared/MapModal";
import { CONTACT } from "@/config/contact";
import Tooltip from "@/components/ui/tooltip";

export default function MapButton() {
  const [isOpen, setIsOpen] = useState(false);

  const openWhatsApp = () => {
    // Use WhatsApp number from config
    window.open(`https://wa.me/${CONTACT.WHATSAPP_NUMBER}`, "_blank");
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-6 z-30 flex flex-col space-y-6">
      {/* WhatsApp Button */}
      <Tooltip text="Contact Us via WhatsApp" position="left">
        <button
          onClick={openWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white p-4 sm:p-5 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center justify-center relative animate-float after:absolute after:inset-0 after:rounded-full after:border-4 after:border-green-300 after:animate-ping after:opacity-75"
          aria-label="Contact via WhatsApp"
        >
          <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </Tooltip>

      {/* Map Button */}
      <Tooltip text="View Properties Map" position="left">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 sm:p-5 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 flex items-center justify-center relative animate-float after:absolute after:inset-0 after:rounded-full after:border-4 after:border-blue-300 after:animate-pulse after:opacity-75"
          aria-label="View properties map"
        >
          <MapPinIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </Tooltip>

      <MapModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
