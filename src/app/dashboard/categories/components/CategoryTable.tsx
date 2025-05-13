"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Edit, Trash2, ChevronUp, ChevronDown, Plus, Image, X } from "lucide-react";
import { Category } from "../types";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import axios from "axios";

interface CategoryTableProps {
  categories: Category[];
  isLoading: boolean;
  onDeleteSuccess: () => void;
  onCreateSuccess: () => void;
  onUpdateSuccess: () => void;
}

const CategoryTable = ({
  categories,
  isLoading,
  onDeleteSuccess,
  onCreateSuccess,
  onUpdateSuccess,
}: CategoryTableProps) => {
  const [sortField, setSortField] = useState<keyof Category>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState<File | null>(null);
  const [newIconPreview, setNewIconPreview] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [editCategoryIcon, setEditCategoryIcon] = useState<File | null>(null);
  const [editIconPreview, setEditIconPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSort = useCallback(
    (field: keyof Category) => {
      if (field === sortField) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  // Sorting function
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => {
      let compareA: any = a[sortField];
      let compareB: any = b[sortField];

      // Handle date strings
      if (sortField === "createdAt" || sortField === "updatedAt") {
        compareA = new Date(compareA).getTime();
        compareB = new Date(compareB).getTime();
      }

      if (compareA === compareB) return 0;

      if (sortDirection === "asc") {
        return compareA < compareB ? -1 : 1;
      } else {
        return compareA > compareB ? -1 : 1;
      }
    });
  }, [categories, sortField, sortDirection]);

  // Create category
  const handleCreateCategory = useCallback(async () => {
    if (newCategoryName === "") {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);

      if (newCategoryIcon) {
        formData.append("icon", newCategoryIcon);
      }

      await axios.post("/api/categories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category created successfully");
      setNewCategoryName("");
      setNewCategoryIcon(null);
      setNewIconPreview(null);
      setIsCreateDialogOpen(false);
      onCreateSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while creating the category");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [newCategoryName, newCategoryIcon, onCreateSuccess]);

  // Update category
  const handleUpdateCategory = useCallback(async () => {
    if (editCategory?.name === "") {
      toast.error("Category name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editCategory?.name || "");

      if (editCategoryIcon) {
        formData.append("icon", editCategoryIcon);
      }

      await axios.put(`/api/categories/${editCategory?.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Category updated successfully");
      setIsEditDialogOpen(false);
      setEditCategoryIcon(null);
      setEditIconPreview(null);
      onUpdateSuccess();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred while updating the category");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [editCategory, editCategoryIcon, onUpdateSuccess]);

  // Handle name change for create dialog
  const handleNewCategoryNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewCategoryName(e.target.value);
    },
    []
  );

  // Handle name change for edit dialog
  const handleEditCategoryNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditCategory(
        editCategory ? { ...editCategory, name: e.target.value } : null
      );
    },
    [editCategory]
  );

  // Handle icon change for create dialog
  const handleNewCategoryIconChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setNewCategoryIcon(file);
        setNewIconPreview(URL.createObjectURL(file));
      }
    },
    []
  );

  // Handle icon change for edit dialog
  const handleEditCategoryIconChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setEditCategoryIcon(file);
        setEditIconPreview(URL.createObjectURL(file));
      }
    },
    []
  );

  // Clean up previews on unmount
  useEffect(() => {
    return () => {
      if (newIconPreview) URL.revokeObjectURL(newIconPreview);
      if (editIconPreview) URL.revokeObjectURL(editIconPreview);
    };
  }, [newIconPreview, editIconPreview]);

  // Clear edit category fields
  const handleEditCategoryOpen = useCallback((category: Category) => {
    setEditCategory(category);
    setEditCategoryIcon(null);
    setEditIconPreview(category.icon || null);
    setIsEditDialogOpen(true);
  }, []);

  // Table header component with sorting
  const SortableTableHead = useCallback(
    ({
      field,
      label,
      className,
    }: {
      field: keyof Category;
      label: string;
      className?: string;
    }) => (
      <TableHead className={className}>
        <button
          className="flex items-center gap-1 focus:outline-none focus:text-primary"
          onClick={() => handleSort(field)}
        >
          {label}
          {sortField === field &&
            (sortDirection === "asc" ? (
              <ChevronUp className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ))}
        </button>
      </TableHead>
    ),
    [handleSort, sortField, sortDirection]
  );

  // Create Category Dialog
  const CreateCategoryDialog = useMemo(
    () => (
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={handleNewCategoryNameChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Category Icon</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('new-icon-upload')?.click()}
                  className="flex items-center gap-1"
                >
                  <Image className="h-4 w-4" />
                  Upload Icon
                </Button>
                <Input
                  id="new-icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleNewCategoryIconChange}
                />
                {newIconPreview && (
                  <div className="relative h-12 w-12">
                    <img
                      src={newIconPreview}
                      alt="Icon preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        setNewCategoryIcon(null);
                        setNewIconPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCategory}
              disabled={isSubmitting || !newCategoryName.trim()}
            >
              {isSubmitting ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    [
      isCreateDialogOpen,
      newCategoryName,
      newIconPreview,
      isSubmitting,
      handleCreateCategory,
      handleNewCategoryNameChange,
    ]
  );

  // Edit Category Dialog
  const EditCategoryDialog = useMemo(
    () => (
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Category Name</Label>
              <Input
                id="edit-name"
                placeholder="Enter category name"
                value={editCategory?.name || ""}
                onChange={handleEditCategoryNameChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">Category Icon</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('edit-icon-upload')?.click()}
                  className="flex items-center gap-1"
                >
                  <Image className="h-4 w-4" />
                  {editIconPreview ? "Change Icon" : "Upload Icon"}
                </Button>
                <Input
                  id="edit-icon-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleEditCategoryIconChange}
                />
                {editIconPreview && (
                  <div className="relative h-12 w-12">
                    <img
                      src={editIconPreview}
                      alt="Icon preview"
                      className="h-full w-full object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full p-1"
                      onClick={() => {
                        setEditCategoryIcon(null);
                        setEditIconPreview(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateCategory}
              disabled={isSubmitting || !editCategory?.name.trim()}
            >
              {isSubmitting ? "Updating..." : "Update Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
    [
      isEditDialogOpen,
      editCategory,
      editIconPreview,
      isSubmitting,
      handleUpdateCategory,
      handleEditCategoryNameChange,
    ]
  );

  return (
    <div className="overflow-x-auto w-full">
      <div className="flex justify-between items-center p-4 bg-white">
        <h2 className="text-lg font-semibold">Categories</h2>
        <Button
          size="sm"
          className="flex items-center gap-1"
          onClick={() => {
            setNewCategoryName("");
            setNewCategoryIcon(null);
            setNewIconPreview(null);
            setIsCreateDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="id" label="#" className="w-12" />
            <TableHead className="w-16">Icon</TableHead>
            <SortableTableHead field="name" label="Name" className="w-1/3" />
            <SortableTableHead
              field="createdAt"
              label="Created At"
              className="w-1/4"
            />
            <SortableTableHead
              field="updatedAt"
              label="Updated At"
              className="w-1/4"
            />
            <TableHead className="text-right w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                Loading categories...
              </TableCell>
            </TableRow>
          ) : sortedCategories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            sortedCategories.map((category, index) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  {category.icon ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-200 rounded-md flex items-center justify-center">
                      <Image className="h-4 w-4 text-gray-500" />
                    </div>
                  )}
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatDate(category.createdAt)}</TableCell>
                <TableCell>{formatDate(category.updatedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      className="bg-gray-100 hover:bg-gray-200"
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditCategoryOpen(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <DeleteCategoryDialog
                      categoryId={category.id}
                      categoryName={category.name}
                      propertyCount={(category as any)._count?.properties || 0}
                      onDeleteSuccess={onDeleteSuccess}
                      trigger={
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-red-400 hover:bg-red-500 text-white hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {CreateCategoryDialog}
      {EditCategoryDialog}
    </div>
  );
};

export default CategoryTable;
