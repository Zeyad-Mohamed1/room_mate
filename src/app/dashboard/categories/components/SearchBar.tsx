"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { usePathname } from "next/navigation";

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

const SearchBar = ({ onSearch, initialValue = "" }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [debouncedTerm, setDebouncedTerm] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Handle input change with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Handle search when debounced term changes
  useEffect(() => {
    // Update URL with search param
    const params = new URLSearchParams();
    if (debouncedTerm) {
      params.set("search", debouncedTerm);
    }

    // Only update URL if we're not removing an empty search parameter
    if (debouncedTerm || initialValue) {
      // Use window.history to update URL without triggering navigation
      const newUrl = `${pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }

    onSearch(debouncedTerm);
  }, [debouncedTerm, onSearch, pathname, initialValue]);

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setDebouncedTerm("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
        placeholder="Search categories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {searchTerm && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleClearSearch}
        >
          <X className="h-5 w-5 text-gray-400 hover:text-gray-500" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
