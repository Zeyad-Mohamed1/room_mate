"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowLeft, Search, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PropertyCard from "@/components/shared/PropertyCard";
import { PaymentTime, RentTime, PropertyType, RoomType } from "@prisma/client";
import Image from "next/image";

// Define filter state interface
interface FilterState {
    search: string;
    categoryId: string;
    priceMin: number;
    priceMax: number;
    propertyType: PropertyType[];
    roomType: RoomType[];
    city: string;
    country: string;
    totalRooms: string[];
    bathrooms: string[];
    genderRequired: string;
    paymentTime: PaymentTime[];
    rentTime: RentTime[];
    airConditioning: boolean;
    internet: boolean;
    parking: boolean;
    separatedBathroom: boolean;
    priceIncludeWaterAndElectricity: boolean;
    allowSmoking: boolean;
    includeFurniture: boolean;
    includeWaterHeater: boolean;
    nearToMetro: boolean;
    nearToMarket: boolean;
    elevator: boolean;
    trialPeriod: boolean;
    goodForForeigners: boolean;
    [key: string]: string | string[] | number | boolean | PropertyType[] | PaymentTime[] | RentTime[];
}

// Utility function to create URL search params
const createSearchParams = (filters: FilterState) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                value.forEach(item => params.append(key, item.toString()));
            } else if (typeof value === 'boolean') {
                params.append(key, value ? 'true' : 'false');
            } else {
                params.append(key, value.toString());
            }
        }
    });

    return params;
};

export default function FiltersPageClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Mobile filters visibility
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Pagination
    const ITEMS_PER_PAGE = 21;
    const [currentPage, setCurrentPage] = useState(1);

    // Filter states
    const [filters, setFilters] = useState<FilterState>({
        search: searchParams.get('search') || '',
        categoryId: searchParams.get('categoryId') || '',
        priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : 0,
        priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : 10000,
        propertyType: searchParams.getAll('propertyType') as PropertyType[],
        roomType: searchParams.getAll('roomType') as RoomType[],
        city: searchParams.get('city') || '',
        country: searchParams.get('country') || '',
        totalRooms: searchParams.getAll('totalRooms'),
        bathrooms: searchParams.getAll('bathrooms'),
        genderRequired: searchParams.get('genderRequired') || '',
        paymentTime: searchParams.getAll('paymentTime') as PaymentTime[],
        rentTime: searchParams.getAll('rentTime') as RentTime[],

        // Boolean filters
        airConditioning: searchParams.get('airConditioning') === 'true',
        internet: searchParams.get('internet') === 'true',
        parking: searchParams.get('parking') === 'true',
        separatedBathroom: searchParams.get('separatedBathroom') === 'true',
        priceIncludeWaterAndElectricity: searchParams.get('priceIncludeWaterAndElectricity') === 'true',
        allowSmoking: searchParams.get('allowSmoking') === 'true',
        includeFurniture: searchParams.get('includeFurniture') === 'true',
        includeWaterHeater: searchParams.get('includeWaterHeater') === 'true',
        nearToMetro: searchParams.get('nearToMetro') === 'true',
        nearToMarket: searchParams.get('nearToMarket') === 'true',
        elevator: searchParams.get('elevator') === 'true',
        trialPeriod: searchParams.get('trialPeriod') === 'true',
        goodForForeigners: searchParams.get('goodForForeigners') === 'true',
    });

    const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
    const [isFiltering, setIsFiltering] = useState(false);

    // Fetch properties using React Query
    const { data: properties = [], isLoading: propertiesLoading } = useQuery({
        queryKey: ["properties"],
        queryFn: () => fetch("/api/properties").then((res) => res.json()),
    });

    // Fetch categories using React Query
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => fetch("/api/categories").then((res) => res.json()),
    });

    // Extract categories from response
    const categories = categoriesData?.categories || [];

    // Room count options
    const roomCountOptions = ["1", "2", "3", "4", "5+"];
    const bathroomOptions = ["1", "2", "3+"];

    // Options for payment time
    const paymentTimeOptions = [
        { value: "daily" as PaymentTime, label: "Daily" },
        { value: "weekly" as PaymentTime, label: "Weekly" },
        { value: "monthly" as PaymentTime, label: "Monthly" },
        { value: "quarterly" as PaymentTime, label: "Quarterly" },
        { value: "semiannual" as PaymentTime, label: "Semi-Annual" },
        { value: "annually" as PaymentTime, label: "Annually" },
    ];

    // Options for rent time (same as payment time but different context)
    const rentTimeOptions = [
        { value: "daily" as RentTime, label: "Daily" },
        { value: "weekly" as RentTime, label: "Weekly" },
        { value: "monthly" as RentTime, label: "Monthly" },
        { value: "quarterly" as RentTime, label: "Quarterly" },
        { value: "semiannual" as RentTime, label: "Semi-Annual" },
        { value: "annually" as RentTime, label: "Annually" },
    ];

    // Gender options
    const genderOptions = [
        { value: "male", label: "Male Only" },
        { value: "female", label: "Female Only" },
        { value: "any", label: "Any Gender" },
    ];

    // Close mobile filters when applying filters
    const toggleMobileFilters = () => {
        setMobileFiltersOpen(!mobileFiltersOpen);
    };

    // Apply filters
    useEffect(() => {
        if (properties.length > 0) {
            setIsFiltering(true);

            const filtered = properties.filter((property: any) => {
                // Search text filter
                if (filters.search && !matchesSearchText(property, filters.search)) {
                    return false;
                }

                // Category filter
                if (filters.categoryId && property.categoryId !== filters.categoryId) {
                    return false;
                }

                // Price range filter
                const price = parseFloat(property.price || '0');
                if (price < filters.priceMin || price > filters.priceMax) {
                    return false;
                }

                // Property type filter
                if (filters.propertyType.length > 0 && !filters.propertyType.includes(property.type)) {
                    return false;
                }

                // Room type filter
                if (filters.roomType.length > 0 && !filters.roomType.includes(property.roomType)) {
                    return false;
                }

                // Location filters
                if (filters.city && !property.city?.toLowerCase().includes(filters.city.toLowerCase())) {
                    return false;
                }

                if (filters.country && !property.country?.toLowerCase().includes(filters.country.toLowerCase())) {
                    return false;
                }

                // Total rooms filter
                if (filters.totalRooms.length > 0 && !filters.totalRooms.includes(property.totalRooms)) {
                    return false;
                }

                // Bathrooms filter
                if (filters.bathrooms.length > 0 && !filters.bathrooms.includes(property.bathrooms)) {
                    return false;
                }

                // Gender preference filter
                if (filters.genderRequired && property.genderRequired !== filters.genderRequired) {
                    return false;
                }

                // Payment time filter
                if (filters.paymentTime.length > 0 && !filters.paymentTime.includes(property.paymentTime)) {
                    return false;
                }

                // Rent time filter
                if (filters.rentTime.length > 0 && !filters.rentTime.includes(property.rentTime)) {
                    return false;
                }

                // Boolean filters
                if (filters.airConditioning && !property.airConditioning) return false;
                if (filters.internet && !property.internet) return false;
                if (filters.parking && !property.parking) return false;
                if (filters.separatedBathroom && !property.separatedBathroom) return false;
                if (filters.priceIncludeWaterAndElectricity && !property.priceIncludeWaterAndElectricity) return false;
                if (filters.allowSmoking && !property.allowSmoking) return false;
                if (filters.includeFurniture && !property.includeFurniture) return false;
                if (filters.includeWaterHeater && !property.includeWaterHeater) return false;
                if (filters.nearToMetro && !property.nearToMetro) return false;
                if (filters.nearToMarket && !property.nearToMarket) return false;
                if (filters.elevator && !property.elevator) return false;
                if (filters.trialPeriod && !property.trialPeriod) return false;
                if (filters.goodForForeigners && !property.goodForForeigners) return false;

                // If all filters pass
                return true;
            });

            setFilteredProperties(filtered);

            // Reset to page 1 when filters change
            setCurrentPage(1);
            setIsFiltering(false);
        }
    }, [properties, filters]);

    // Apply filters automatically when they change
    useEffect(() => {
        // Add a small debounce to avoid too many URL updates
        const timer = setTimeout(() => {
            const params = createSearchParams(filters);
            router.push(`/filters?${params.toString()}`, { scroll: false });
        }, 500);

        return () => clearTimeout(timer);
    }, [filters, router]);

    // Helper to check if property matches search text
    const matchesSearchText = (property: any, searchText: string) => {
        const lowerQuery = searchText.toLowerCase();
        return (
            property.title?.toLowerCase().includes(lowerQuery) ||
            property.description?.toLowerCase().includes(lowerQuery) ||
            property.city?.toLowerCase().includes(lowerQuery) ||
            property.address?.toLowerCase().includes(lowerQuery)
        );
    };

    // Update a specific filter
    const updateFilter = (key: keyof FilterState, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Toggle array filter (for multi-select filters)
    const toggleArrayFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => {
            const currentValues = [...(prev[key] as string[])];
            const index = currentValues.indexOf(value);

            if (index >= 0) {
                currentValues.splice(index, 1);
            } else {
                currentValues.push(value);
            }

            return {
                ...prev,
                [key]: currentValues
            };
        });
    };

    // Toggle boolean filter
    const toggleBooleanFilter = (key: keyof FilterState) => {
        setFilters(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Reset all filters
    const resetAllFilters = () => {
        setFilters({
            search: '',
            categoryId: '',
            priceMin: 0,
            priceMax: 10000,
            propertyType: [],
            roomType: [],
            city: '',
            country: '',
            totalRooms: [],
            bathrooms: [],
            genderRequired: '',
            paymentTime: [],
            rentTime: [],
            airConditioning: false,
            internet: false,
            parking: false,
            separatedBathroom: false,
            priceIncludeWaterAndElectricity: false,
            allowSmoking: false,
            includeFurniture: false,
            includeWaterHeater: false,
            nearToMetro: false,
            nearToMarket: false,
            elevator: false,
            trialPeriod: false,
            goodForForeigners: false,
        });
        setCurrentPage(1);
    };

    // Apply filters and update URL
    const applyFilters = () => {
        const params = createSearchParams(filters);
        router.push(`/filters?${params.toString()}`);
        // Close mobile filters on apply
        setMobileFiltersOpen(false);
    };

    // Navigate back to home
    const goBack = () => {
        router.push('/');
    };

    // Get category placeholder
    const getCategoryPlaceholder = (name: string) => {
        return name.charAt(0).toUpperCase();
    };

    // Count active filters
    const countActiveFilters = () => {
        let count = 0;

        if (filters.search) count++;
        if (filters.categoryId) count++;
        if (filters.priceMin > 0) count++;
        if (filters.priceMax < 10000) count++;
        if (filters.propertyType.length > 0) count++;
        if (filters.roomType.length > 0) count++;
        if (filters.city) count++;
        if (filters.country) count++;
        if (filters.totalRooms.length > 0) count++;
        if (filters.bathrooms.length > 0) count++;
        if (filters.genderRequired) count++;
        if (filters.paymentTime.length > 0) count++;
        if (filters.rentTime.length > 0) count++;

        // Boolean filters
        Object.entries(filters).forEach(([key, value]) => {
            if (typeof value === 'boolean' && value === true) {
                count++;
            }
        });

        return count;
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
    const paginatedProperties = filteredProperties.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when changing pages
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const renderPaginationControls = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Previous button
        pages.push(
            <button
                key="prev"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                aria-label="Previous page"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
        );

        // First page if not included in range
        if (startPage > 1) {
            pages.push(
                <button
                    key={1}
                    onClick={() => handlePageChange(1)}
                    className={`px-3 py-1 rounded-md`}
                >
                    1
                </button>
            );

            if (startPage > 2) {
                pages.push(<span key="ellipsis1" className="px-2">...</span>);
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-md ${currentPage === i ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                >
                    {i}
                </button>
            );
        }

        // Last page if not included in range
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="ellipsis2" className="px-2">...</span>);
            }

            pages.push(
                <button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-3 py-1 rounded-md`}
                >
                    {totalPages}
                </button>
            );
        }

        // Next button
        pages.push(
            <button
                key="next"
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-2 py-1 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                aria-label="Next page"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        );

        return pages;
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 py-6">
            {/* Header section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 sm:gap-3">
                    <button
                        onClick={goBack}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold">Advanced Filters</h1>
                    {countActiveFilters() > 0 && (
                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                            {countActiveFilters()} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleMobileFilters}
                        className="lg:hidden flex items-center px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium"
                    >
                        <SlidersHorizontal className="h-4 w-4 mr-1" />
                        {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
                    </button>
                    <button
                        onClick={resetAllFilters}
                        className="text-primary text-sm font-medium hover:underline flex items-center"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Filter sidebar - With transition for mobile */}
                <div
                    className={`lg:block lg:col-span-1 bg-white rounded-lg shadow-md h-min overflow-hidden transition-all duration-300 ease-in-out ${mobileFiltersOpen
                        ? 'max-h-[4000px] opacity-100 mb-6'
                        : 'max-h-0 opacity-0 lg:max-h-[4000px] lg:opacity-100'
                        }`}
                >
                    <div className="p-4 sm:p-6 space-y-5 sm:space-y-6 max-h-[80vh] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
                        {/* Search */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Search</h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search properties..."
                                    value={filters.search}
                                    onChange={(e) => updateFilter('search', e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                {filters.search && (
                                    <button
                                        onClick={() => updateFilter('search', '')}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Category</h3>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category: { id: string; name: string; icon?: string }) => (
                                    <button
                                        key={category.id}
                                        onClick={() => updateFilter('categoryId', filters.categoryId === category.id ? '' : category.id)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs ${filters.categoryId === category.id
                                            ? "bg-primary text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {category.icon ? (
                                            <Image
                                                src={category.icon}
                                                width={16}
                                                height={16}
                                                alt={category.name}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <span className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-bold text-primary">
                                                {getCategoryPlaceholder(category.name)}
                                            </span>
                                        )}
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Price Range</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.priceMin}
                                        onChange={(e) => updateFilter('priceMin', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Min"
                                    />
                                    <span>to</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={filters.priceMax}
                                        onChange={(e) => updateFilter('priceMax', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Max"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Options */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Payment Options</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Payment Time</p>
                                    <div className="flex flex-wrap gap-2">
                                        {paymentTimeOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => toggleArrayFilter('paymentTime', option.value)}
                                                className={`px-3 py-1 text-xs rounded-full ${filters.paymentTime.includes(option.value)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Rent Time</p>
                                    <div className="flex flex-wrap gap-2">
                                        {rentTimeOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => toggleArrayFilter('rentTime', option.value)}
                                                className={`px-3 py-1 text-xs rounded-full ${filters.rentTime.includes(option.value)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.priceIncludeWaterAndElectricity}
                                            onChange={() => toggleBooleanFilter('priceIncludeWaterAndElectricity')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Price includes utilities</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Property Details</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Property Type</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => toggleArrayFilter('propertyType', 'house')}
                                            className={`px-3 py-1 text-xs rounded-full ${filters.propertyType.includes("house")
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            House
                                        </button>
                                        <button
                                            onClick={() => toggleArrayFilter('propertyType', 'room')}
                                            className={`px-3 py-1 text-xs rounded-full ${filters.propertyType.includes("room")
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            Room
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Room Type</p>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => toggleArrayFilter('roomType', 'single')}
                                            className={`px-3 py-1 text-xs rounded-full ${filters.roomType.includes("single")
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            Single
                                        </button>
                                        <button
                                            onClick={() => toggleArrayFilter('roomType', 'mixed')}
                                            className={`px-3 py-1 text-xs rounded-full ${filters.roomType.includes("mixed")
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            Mixed
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Number of Rooms</p>
                                    <div className="flex flex-wrap gap-2">
                                        {roomCountOptions.map(count => (
                                            <button
                                                key={count}
                                                onClick={() => toggleArrayFilter('totalRooms', count)}
                                                className={`px-3 py-1 text-xs rounded-full ${filters.totalRooms.includes(count)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Number of Bathrooms</p>
                                    <div className="flex flex-wrap gap-2">
                                        {bathroomOptions.map(count => (
                                            <button
                                                key={count}
                                                onClick={() => toggleArrayFilter('bathrooms', count)}
                                                className={`px-3 py-1 text-xs rounded-full ${filters.bathrooms.includes(count)
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {count}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.separatedBathroom}
                                            onChange={() => toggleBooleanFilter('separatedBathroom')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Separated Bathroom</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Preferences */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Preferences</h3>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Gender Preference</p>
                                    <div className="flex flex-wrap gap-2">
                                        {genderOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => updateFilter('genderRequired',
                                                    filters.genderRequired === option.value ? '' : option.value)}
                                                className={`px-3 py-1 text-xs rounded-full ${filters.genderRequired === option.value
                                                        ? "bg-primary text-white"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.goodForForeigners}
                                            onChange={() => toggleBooleanFilter('goodForForeigners')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Good for Foreigners</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.allowSmoking}
                                            onChange={() => toggleBooleanFilter('allowSmoking')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Allow Smoking</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.trialPeriod}
                                            onChange={() => toggleBooleanFilter('trialPeriod')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Trial Period Available</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Location</h3>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={filters.city}
                                    onChange={(e) => updateFilter('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <input
                                    type="text"
                                    placeholder="Country"
                                    value={filters.country}
                                    onChange={(e) => updateFilter('country', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />

                                <div className="pt-2 space-y-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.nearToMetro}
                                            onChange={() => toggleBooleanFilter('nearToMetro')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Near to Metro</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={filters.nearToMarket}
                                            onChange={() => toggleBooleanFilter('nearToMarket')}
                                            className="rounded-md text-primary focus:ring-primary"
                                        />
                                        <span className="text-sm">Near to Market</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="font-medium mb-3 text-gray-700">Amenities</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.airConditioning}
                                        onChange={() => toggleBooleanFilter('airConditioning')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Air Conditioning</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.internet}
                                        onChange={() => toggleBooleanFilter('internet')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Internet</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.parking}
                                        onChange={() => toggleBooleanFilter('parking')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Parking</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.includeFurniture}
                                        onChange={() => toggleBooleanFilter('includeFurniture')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Furniture</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.includeWaterHeater}
                                        onChange={() => toggleBooleanFilter('includeWaterHeater')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Water Heater</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={filters.elevator}
                                        onChange={() => toggleBooleanFilter('elevator')}
                                        className="rounded-md text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm">Elevator</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Properties Results */}
                <div className="lg:col-span-3">
                    {propertiesLoading || isFiltering ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-xl shadow-soft animate-pulse h-64 sm:h-80"
                                />
                            ))}
                        </div>
                    ) : filteredProperties.length > 0 ? (
                        <div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                <p className="text-gray-500">{filteredProperties.length} properties found</p>
                                <p className="text-gray-500 text-sm">
                                    Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProperties.length)} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredProperties.length)} of {filteredProperties.length}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {paginatedProperties.map((property: any) => (
                                    <PropertyCard
                                        key={property.id}
                                        id={property.id}
                                        title={property.title || "Unnamed Property"}
                                        price={property.price || "Price not available"}
                                        paymentTime={(property.paymentTime as PaymentTime) || "monthly"}
                                        location={`${property.city || ""}, ${property.country || ""}`}
                                        type={property.type}
                                        roomType={property.roomType}
                                        imageUrl={property.images?.[0] || "/placeholder-property.jpg"}
                                        amenities={[
                                            property.airConditioning ? "Air Conditioning" : "",
                                            property.internet ? "Internet" : "",
                                            property.parking ? "Parking" : "",
                                        ].filter(Boolean)}
                                        persons={Number(property.availablePersons) || 1}
                                        bathrooms={Number(property.bathrooms) || 1}
                                        genderPreference={
                                            (property.genderRequired as "male" | "female" | "any") || "any"
                                        }
                                        countryCode={
                                            property.country?.substring(0, 2).toLowerCase() || "us"
                                        }
                                        slug={property.slug || ""}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-6 sm:mt-8 gap-1 overflow-x-auto px-2 py-1">
                                    {renderPaginationControls()}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-gray-500 text-lg mb-2">
                                No properties found matching your criteria
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                Try adjusting your filters or search term
                            </p>
                            <button
                                onClick={resetAllFilters}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 