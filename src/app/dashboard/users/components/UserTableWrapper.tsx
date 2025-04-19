"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import UserTable from "./UserTable";
import SearchBar from "./SearchBar";
import { User, UsersResponse } from "../types";
import { toast } from "react-hot-toast";
import { useUserStore } from "@/store/useUserStore";

const UserTableWrapper = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  // Use the useTransition hook to avoid blocking the UI during updates
  const [isPending, startTransition] = useTransition();
  // Get current user from store
  const currentUser = useUserStore((state) => state.user);

  // Separate data fetching from state updates
  const fetchData = async (search: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/api/users?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return (await response.json()) as UsersResponse;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
      return { users: [] };
    }
  };

  // Memoized fetch function that handles the loading state
  const fetchUsers = useCallback(
    async (search: string = "") => {
      // Only show loading if we don't have any data yet
      const shouldShowLoading = users.length === 0;
      if (shouldShowLoading) {
        setIsLoading(true);
      }

      // Fetch data without blocking the UI
      startTransition(async () => {
        const data = await fetchData(search);
        setUsers(data.users);
        setIsLoading(false);
      });
    },
    [users.length]
  );

  // Initialize data when search params change
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchTerm(initialSearch);
    fetchUsers(initialSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handle search
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      fetchUsers(term);
    },
    [fetchUsers]
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <UserTable
          users={users}
          isLoading={isLoading || isPending}
          onDeleteSuccess={() => fetchUsers(searchTerm)}
          currentUserId={currentUser?.id}
        />
      </div>
    </div>
  );
};

export default UserTableWrapper;
