import { Metadata } from "next";
import MyOffersContent from "./components/MyOffersContent";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
export const metadata: Metadata = {
  title: "My Offers | Room Mate",
  description: "View and manage all offers you've submitted.",
};

export default function MyOffersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      }
    >
      <MyOffersContent />
    </Suspense>
  );
}
