import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import PropertyList from "@/components/favorites/PropertyList";
import EmptyFavorites from "@/components/favorites/EmptyFavorites";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Your Favorites | RoommateFinder",
  description: "View your saved properties on RoommateFinder",
};

export default async function FavoritesPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/");
  }

  const userId = session.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      favorites: {
        include: {
          category: true,
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  const favorites = user.favorites;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Favorites</h1>

      {favorites.length === 0 ? (
        <EmptyFavorites />
      ) : (
        <PropertyList properties={favorites} />
      )}
    </main>
  );
}
