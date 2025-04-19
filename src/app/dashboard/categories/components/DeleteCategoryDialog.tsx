"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface DeleteCategoryDialogProps {
  categoryId: string;
  categoryName: string;
  propertyCount: number;
  onDeleteSuccess: () => void;
  trigger: React.ReactNode;
}

const DeleteCategoryDialog = ({
  categoryId,
  categoryName,
  propertyCount,
  onDeleteSuccess,
  trigger,
}: DeleteCategoryDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (propertyCount > 0) {
      toast.error(
        "Cannot delete a category with properties. Please reassign or delete the properties first."
      );
      setIsOpen(false);
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(`/api/categories/${categoryId}`);

      if (response.status !== 200) {
        toast.error(response.data.error || "Failed to delete category");
      }

      toast.success("Category deleted successfully");
      onDeleteSuccess();
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while deleting the category");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Delete Category
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>{categoryName}</strong>?
            {propertyCount > 0 && (
              <div className="mt-2 text-red-500">
                This category has {propertyCount}{" "}
                {propertyCount === 1 ? "property" : "properties"} associated
                with it and cannot be deleted.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || propertyCount > 0}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryDialog;
