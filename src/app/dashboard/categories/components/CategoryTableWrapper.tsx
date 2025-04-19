"use client";

import { useState, useEffect, useCallback, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import CategoryTable from "./CategoryTable";
import SearchBar from "./SearchBar";
import { Category, CategoriesResponse } from "../types";
import { toast } from "react-hot-toast";

const CategoryTableWrapper = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  // Use the useTransition hook to avoid blocking the UI during updates
  const [isPending, startTransition] = useTransition();

  // Separate data fetching from state updates
  const fetchData = async (search: string) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const response = await fetch(`/api/categories?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      return (await response.json()) as CategoriesResponse;
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
      return { categories: [] };
    }
  };

  // Memoized fetch function that handles the loading state
  const fetchCategories = useCallback(
    async (search: string = "") => {
      // Only show loading if we don't have any data yet
      const shouldShowLoading = categories.length === 0;
      if (shouldShowLoading) {
        setIsLoading(true);
      }

      // Fetch data without blocking the UI
      startTransition(async () => {
        const data = await fetchData(search);
        setCategories(data.categories);
        setIsLoading(false);
      });
    },
    [categories.length]
  );

  // Initialize data when search params change
  useEffect(() => {
    const initialSearch = searchParams.get("search") || "";
    setSearchTerm(initialSearch);
    fetchCategories(initialSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Handle search
  const handleSearch = useCallback(
    (term: string) => {
      setSearchTerm(term);
      fetchCategories(term);
    },
    [fetchCategories]
  );

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-lg shadow">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <CategoryTable
          categories={categories}
          isLoading={isLoading || isPending}
          onDeleteSuccess={() => fetchCategories(searchTerm)}
          onCreateSuccess={() => fetchCategories(searchTerm)}
          onUpdateSuccess={() => fetchCategories(searchTerm)}
        />
      </div>
    </div>
  );
};

export default CategoryTableWrapper;
