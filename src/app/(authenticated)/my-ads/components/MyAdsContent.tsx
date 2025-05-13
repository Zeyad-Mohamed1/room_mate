"use client";

import { useState } from "react";
import { Property, Offer, Category } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus } from "lucide-react";
import PropertyList from "./PropertyList";
import EmptyState from "./EmptyState";
import AddPropertyModal from "@/components/shared/AddPropertyModal";
import { getMyProperties } from "@/actions/properties";
import { useQuery } from "@tanstack/react-query";

export default function MyAdsContent() {
  const { data: properties, isLoading } = useQuery({
    queryKey: ["my-properties"],
    queryFn: async () => await getMyProperties(),
  });

  console.log(properties);

  const [activeTab, setActiveTab] = useState("all");
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);

  // Filter properties with pending offers
  const propertiesWithOffers = properties?.filter(
    (property) => property?.offers?.length > 0
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Ads</h1>
          <p className="text-gray-600 mt-1">
            Manage your property listings and view offers
          </p>
        </div>
        <button
          onClick={() => setIsAddPropertyModalOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-lg transition-colors self-start md:self-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Property</span>
        </button>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="all">
            All Listings ({properties?.length})
          </TabsTrigger>
          <TabsTrigger value="offers">
            With Offers ({propertiesWithOffers?.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          {properties?.length && properties?.length > 0 ? (
            <PropertyList properties={properties} />
          ) : (
            <EmptyState
              title="No listings found"
              description="You haven't created any property listings yet."
              actionLabel="Add a Property"
              actionOnClick={() => setIsAddPropertyModalOpen(true)}
            />
          )}
        </TabsContent>

        <TabsContent value="offers" className="mt-0">
          {propertiesWithOffers?.length && propertiesWithOffers?.length > 0 ? (
            <PropertyList properties={propertiesWithOffers} />
          ) : (
            <EmptyState
              title="No offers yet"
              description="You haven't received any offers on your listings yet."
              actionLabel="View All Listings"
              actionHref="#"
              actionOnClick={() => setActiveTab("all")}
            />
          )}
        </TabsContent>
      </Tabs>

      {isAddPropertyModalOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyModalOpen(false)}
          isEditing={false}
          propertyId={undefined}
        />
      )}
    </div>
  );
}
