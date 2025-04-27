import prisma from "@/lib/prisma";
import { HomePageProvider } from "@/app/components/home/HomePageContext";
import HeaderWithSearchContext from "./HeaderWithSearchContext";

// Fetch categories for the header filter
async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function HeaderWithCategories() {
  const categories = await getCategories();

  return (
    <HomePageProvider>
      <HeaderWithSearchContext categories={categories} />
    </HomePageProvider>
  );
}
