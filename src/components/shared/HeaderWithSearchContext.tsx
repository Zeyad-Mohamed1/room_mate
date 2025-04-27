"use client";

import Header from "./Header";
import { useHomePage } from "@/app/components/home/HomePageContext";

export default function HeaderWithSearchContext({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const { handleSearch } = useHomePage();

  return <Header onSearch={handleSearch} categories={categories} />;
}
