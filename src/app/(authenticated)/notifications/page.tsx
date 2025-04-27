import NotificationsContent from "./components/NotificationsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notifications | RoommateFinder",
  description: "View and manage your notifications",
};

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationsContent />
    </div>
  );
}
