import FavoritesMain from "./components/main";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Your Favorites | RoommateFinder",
  description: "View your saved properties on RoommateFinder",
};

export default async function FavoritesPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        }
      >
        <FavoritesMain />
      </Suspense>
    </div>
  );
}
