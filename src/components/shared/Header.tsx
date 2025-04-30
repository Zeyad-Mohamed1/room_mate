"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import AddPropertyModal from "./AddPropertyModal";
import UserMenu from "./UserMenu";
import {
  Search,
  Menu,
  X,
  Plus,
  Heart,
  FileText,
  LayoutDashboard,
  DollarSign,
  Calendar,
  Loader2,
  Home,
} from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { useTabStore } from "./MobileBottomBar";
import { useIsAdmin } from "@/utils/auth";
import NotificationIcon from "./NotificationIcon";
import { useClickAway } from "@/hooks/useClickAway";
import Image from "next/image";

// Property type for search results
type Property = {
  id: string;
  title: string;
  price: number;
  city: string;
  slug: string;
  images: string[];
};

// Props to allow access to search state from parent components
interface HeaderProps {
  onSearch?: (query: string, categoryId?: string) => void;
  categories?: Array<{ id: string; name: string }>;
}

const Header = ({ onSearch, categories = [] }: HeaderProps) => {
  const { isAuthenticated } = useUserStore();
  const isAdmin = useIsAdmin();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = useTabStore((state) => state.activeTab);
  const setActiveTab = useTabStore((state) => state.setActiveTab);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [results, setResults] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  console.log(isAdmin);

  // Initialize search from URL params when component mounts
  useEffect(() => {
    const query = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    setSearchQuery(query);
    setSelectedCategory(category);

    // Trigger search if on homepage and params exist
    if (pathname === "/" && (query || category) && onSearch) {
      onSearch(query, category);
    }
  }, [searchParams, pathname, onSearch]);

  useClickAway(searchRef, () => {
    setIsOpen(false);
  });

  // Fetch search results for dropdown
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/properties/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the search
    const timer = setTimeout(() => {
      if (searchQuery && isOpen) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // If on homepage, filter content there
    if (pathname === "/" && onSearch) {
      onSearch(searchQuery.trim(), selectedCategory);

      // Update URL without navigation
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      window.history.pushState(null, "", newUrl);
    } else {
      // If not on homepage, navigate to homepage with search params
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedCategory) params.set("category", selectedCategory);
      router.push(`/${params.toString() ? `?${params.toString()}` : ""}`);
    }

    setIsOpen(false);
    setIsSearchVisible(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchVisible) {
      setIsSearchVisible(false);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // User navigation items
  const userNavItems = [
    {
      href: "/my-ads",
      label: "My Ads",
      icon: <FileText className="h-5 w-5" />,
      tab: "my-ads",
    },
    {
      href: "/my-offers",
      label: "My Offers",
      icon: <DollarSign className="h-5 w-5" />,
      tab: "my-offers",
    },
    {
      href: "/bookings",
      label: "My Bookings",
      icon: <Calendar className="h-5 w-5" />,
      tab: "bookings",
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: <NotificationIcon />,
      tab: "notifications",
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: <Heart className="h-5 w-5" />,
      tab: "favorites",
    },
  ];

  // Filter dashboard out from dropdown items when needed
  const dropdownNavItems = userNavItems;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl">
              RF
            </div>
            <span className="text-xl sm:text-2xl font-bold text-gradient hidden sm:inline">
              RoommateFinder
            </span>
            <span className="text-xl font-bold text-gradient sm:hidden">
              RF
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div
            className="hidden lg:block flex-1 max-w-2xl mx-8"
            ref={searchRef}
          >
            <form onSubmit={handleSearch}>
              <div className="flex gap-2">
                {/* Category Dropdown */}
                <div className="w-40">
                  <select
                    className="w-full py-2.5 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search for rooms, houses, or locations..."
                    className="w-full py-2.5 px-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                      onClick={() => {
                        setSearchQuery("");
                        setResults([]);
                      }}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Results dropdown */}
              {isOpen && searchQuery && (
                <div className="absolute z-10 mt-1 w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-6 w-6 text-primary animate-spin" />
                      <span className="ml-2 text-gray-600">Searching...</span>
                    </div>
                  ) : results.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto">
                      {results.map((property) => (
                        <Link
                          key={property.id}
                          href={`/property/${property.slug}`}
                          className="block hover:bg-gray-50 transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="flex items-center p-3 border-b border-gray-100">
                            <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                              {property.images && property.images[0] ? (
                                <Image
                                  src={property.images[0]}
                                  alt={property.title}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-xs text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="font-medium text-sm line-clamp-1">
                                {property.title}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {property.city}
                              </p>
                              <p className="text-primary font-medium text-sm mt-1">
                                ${property.price}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                      <div className="p-3 text-center">
                        <button
                          onClick={() => {
                            handleSearch({
                              preventDefault: () => {},
                            } as React.FormEvent);
                          }}
                          className="text-sm text-primary hover:underline"
                        >
                          View all results
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 px-4 text-center">
                      <p className="text-gray-500">No properties found</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Try different keywords or browse all properties
                      </p>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isAdmin && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer flex items-center space-x-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
            <UserMenu
              onLoginClick={() => setIsLoginModalOpen(true)}
              onRegisterClick={() => setIsRegisterModalOpen(true)}
              userNavItems={dropdownNavItems}
            />
            {/* Only show Add Property button if user is authenticated */}
            {isAuthenticated && (
              <button
                onClick={() => setIsAddPropertyModalOpen(true)}
                className="px-4 py-2 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm flex items-center gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Add Property
              </button>
            )}
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex md:hidden items-center">
            {!isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="px-3 py-1.5 border border-primary text-primary rounded-full hover:bg-gradient-subtle transition-colors font-medium text-xs"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="px-3 py-1.5 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-xs"
                >
                  Register
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Search"
                >
                  <Search className="h-6 w-6" />
                </button>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-gray-600 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchVisible && (
          <div className="md:hidden mt-3 animate-fadeIn" ref={searchRef}>
            <form onSubmit={handleSearch} className="space-y-2">
              {/* Category dropdown for mobile */}
              <select
                className="w-full py-2.5 px-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Search input for mobile */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search for rooms, houses, or locations..."
                  className="w-full py-2.5 px-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-soft"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    onClick={() => {
                      setSearchQuery("");
                      setResults([]);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-1.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              {/* Mobile Results Dropdown */}
              {isOpen && searchQuery && (
                <div className="absolute z-50 left-0 right-0 px-4 mt-1">
                  <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        <span className="ml-2 text-gray-600">Searching...</span>
                      </div>
                    ) : results.length > 0 ? (
                      <div className="max-h-[60vh] overflow-y-auto">
                        {results.map((property) => (
                          <Link
                            key={property.id}
                            href={`/property/${property.slug}`}
                            className="block hover:bg-gray-50 transition-colors"
                            onClick={() => {
                              setIsOpen(false);
                              setIsSearchVisible(false);
                            }}
                          >
                            <div className="flex items-center p-3 border-b border-gray-100">
                              <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                {property.images && property.images[0] ? (
                                  <Image
                                    src={property.images[0]}
                                    alt={property.title}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                    <span className="text-xs text-gray-400">
                                      No image
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="ml-3 flex-1">
                                <p className="font-medium text-sm line-clamp-1">
                                  {property.title}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {property.city}
                                </p>
                                <p className="text-primary font-medium text-sm mt-1">
                                  ${property.price}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="p-3 text-center">
                          <button
                            onClick={() => {
                              handleSearch({
                                preventDefault: () => {},
                              } as React.FormEvent);
                              setIsSearchVisible(false);
                            }}
                            className="text-sm text-primary hover:underline"
                          >
                            View all results
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-6 px-4 text-center">
                        <p className="text-gray-500">No properties found</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try different keywords or browse all properties
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Mobile Menu - Only show for authenticated users */}
        {isAuthenticated && isMobileMenuOpen && (
          <div className="md:hidden mt-3 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-4">
              <div className="flex flex-col space-y-3">
                <UserMenu
                  onLoginClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  onRegisterClick={() => {
                    setIsRegisterModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  userNavItems={dropdownNavItems}
                />
                <button
                  onClick={() => {
                    setIsAddPropertyModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-4 py-2.5 bg-gradient text-white rounded-full hover:opacity-90 transition-opacity font-medium shadow-soft text-sm text-center flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Add Property
                </button>
              </div>
              <div className="border-t border-gray-100 pt-4">
                <nav className="flex flex-col space-y-2">
                  {isAdmin && (
                    <Link
                      href="/dashboard"
                      className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer flex items-center space-x-2"
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  )}

                  {/* User-specific mobile navigation */}
                  {userNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-gray-700 hover:text-primary transition-colors py-1 cursor-pointer flex items-center space-x-2"
                      onClick={() => {
                        setActiveTab(item.tab);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {item.tab === "notifications" ? (
                        <NotificationIcon iconClassName="h-4 w-4" />
                      ) : (
                        item.icon
                      )}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {isLoginModalOpen && (
        <LoginModal onClose={() => setIsLoginModalOpen(false)} />
      )}
      {isRegisterModalOpen && (
        <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />
      )}
      {isAddPropertyModalOpen && (
        <AddPropertyModal onClose={() => setIsAddPropertyModalOpen(false)} />
      )}
    </header>
  );
};

export default Header;
