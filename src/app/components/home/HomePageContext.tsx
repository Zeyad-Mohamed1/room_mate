"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type HomePageContextType = {
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  handleSearch: (query: string, categoryId?: string) => void;
};

const defaultContextValue: HomePageContextType = {
  searchQuery: "",
  selectedCategory: "",
  setSearchQuery: () => {},
  setSelectedCategory: () => {},
  handleSearch: () => {},
};

const HomePageContext = createContext<HomePageContextType>(defaultContextValue);

export const useHomePage = () => useContext(HomePageContext);

export const HomePageProvider = ({ children }: { children: ReactNode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Central search handler that will be shared between components
  const handleSearch = (query: string, categoryId?: string) => {
    setSearchQuery(query);
    setSelectedCategory(categoryId || "");
  };

  return (
    <HomePageContext.Provider
      value={{
        searchQuery,
        selectedCategory,
        setSearchQuery,
        setSelectedCategory,
        handleSearch,
      }}
    >
      {children}
    </HomePageContext.Provider>
  );
};
