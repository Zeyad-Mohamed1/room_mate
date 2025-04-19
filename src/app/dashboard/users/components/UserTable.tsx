"use client";

import { useState } from "react";
import { Edit, Trash2, ChevronUp, ChevronDown, Info } from "lucide-react";
import { User } from "../types";
import DeleteUserDialog from "./DeleteUserDialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onDeleteSuccess: () => void;
  currentUserId?: string;
}

const UserTable = ({
  users,
  isLoading,
  onDeleteSuccess,
  currentUserId,
}: UserTableProps) => {
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof User>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    // Dialog component will handle the delete operation
    onDeleteSuccess();
    setIsDeleteDialogOpen(false);
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA === undefined || fieldB === undefined) return 0;

    const comparison =
      typeof fieldA === "string" && typeof fieldB === "string"
        ? fieldA.localeCompare(fieldB)
        : String(fieldA).localeCompare(String(fieldB));

    return sortDirection === "asc" ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading users...</p>
      </div>
    );
  }

  // Table header component with sorting
  const SortableTableHead = ({
    field,
    label,
    className,
  }: {
    field: keyof User;
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
  );

  return (
    <div className="overflow-x-auto w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead field="id" label="#" className="w-12" />
            <SortableTableHead field="name" label="Name" className="w-1/5" />
            <SortableTableHead field="email" label="Email" className="w-1/4" />
            <SortableTableHead field="isAdmin" label="Role" className="w-24" />
            <SortableTableHead
              field="createdAt"
              label="Created At"
              className="w-1/5"
            />
            <TableHead className="text-right w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.length > 0 ? (
            sortedUsers.map((user, index) => (
              <TableRow key={user.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell className="font-medium">
                  <div className="truncate max-w-[200px]">{user.name}</div>
                </TableCell>
                <TableCell className="text-gray-500">
                  <div className="truncate max-w-[200px]">{user.email}</div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.isAdmin
                        ? "bg-purple-100 text-purple-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(user.createdAt)}
                </TableCell>
                <TableCell className="text-right whitespace-nowrap">
                  <button
                    className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                    aria-label={`Edit ${user.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {user.id === currentUserId ? (
                    <Tooltip>
                      <TooltipContent>
                        <div className="flex items-center gap-1">
                          <Info className="h-4 w-4" />
                          <span>You cannot delete your own account</span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <button
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                      onClick={() => handleDeleteClick(user)}
                      aria-label={`Delete ${user.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Delete User Confirmation Dialog */}
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        user={userToDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default UserTable;
