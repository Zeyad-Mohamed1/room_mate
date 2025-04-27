import BookingsContent from "./components/BookingsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings | RoommateFinder",
  description: "View and manage your active bookings",
};

export default function BookingsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <BookingsContent />
    </div>
  );
}
