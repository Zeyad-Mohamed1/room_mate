"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Building,
  ExternalLink,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { getAllProperties, deleteProperty } from "@/actions/admin-properties";
import { Badge } from "@/components/ui/badge";

export default function PropertiesContent() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Query to fetch all properties
  const {
    data: properties = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: getAllProperties,
  });

  // Mutation to delete a property
  const deletePropertyMutation = useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast.success("Property deleted successfully");
      setConfirmDeleteOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property");
    },
  });

  // Handle delete property
  const handleDeleteProperty = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setConfirmDeleteOpen(true);
  };

  // Confirm delete property
  const confirmDeleteProperty = () => {
    if (propertyToDelete) {
      deletePropertyMutation.mutate(propertyToDelete);
    }
  };

  // Filter properties by search term
  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        const searchString =
          `${property.title} ${property.city} ${property.owner?.name} ${property.owner?.email}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
      })
    : [];

  // Show error if there was an error fetching properties
  if (isError) {
    return (
      <Card className="border-red-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-red-500 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Error Loading Properties
          </CardTitle>
          <CardDescription>
            There was an error loading the properties data. This might be due to
            a server issue or insufficient permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="flex items-center"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search properties..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Building className="h-4 w-4" />
          <span>
            {Array.isArray(properties) ? properties.length : 0} Properties
          </span>
        </div>
      </div>

      {/* Properties Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Property</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Stats</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <div className="flex items-start gap-2">
                        <span className="font-medium truncate max-w-[200px]">
                          {property.title || "Untitled Property"}
                        </span>
                        <Badge variant="outline" className="ml-1 text-xs">
                          {property.type === "house" ? "House" : "Room"}
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {property.price
                          ? `${property.price} / ${property.paymentTime}`
                          : "Price not set"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{property.owner?.name || "Unknown"}</span>
                      <span className="text-xs text-gray-500">
                        {property.owner?.email || "No email"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {property.category?.name || "Uncategorized"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{property.city || "Unknown"}</span>
                      <span className="text-xs text-gray-500">
                        {property.country || "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 text-xs">
                      <Badge variant="outline" className="text-xs">
                        {property._count?.favorites || 0} Favorites
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {property._count?.offers || 0} Offers
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(property.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/properties/${property.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-primary rounded-md transition-colors"
                        title="View property"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property.id)}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-md transition-colors"
                        title="Delete property"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-gray-50 border rounded-lg p-8 text-center">
          <Building className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-500 mb-1">
            No properties found
          </h3>
          <p className="text-gray-400 mb-4">
            {searchTerm
              ? "No properties match your search criteria"
              : "There are no properties in the system yet"}
          </p>
          {searchTerm && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchTerm("")}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Property</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot
              be undone and will remove all associated offers, bookings, and
              ratings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeleteProperty}
              disabled={deletePropertyMutation.isPending}
            >
              {deletePropertyMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Property
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
