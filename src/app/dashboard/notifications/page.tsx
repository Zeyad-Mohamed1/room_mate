import { Metadata } from "next";
import NotificationsContent from "./components/NotificationsContent";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications | Dashboard",
  description: "Manage and send notifications to users",
};

export default function NotificationsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notifications Management</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        }
      >
        <NotificationsContent />
      </Suspense>
    </div>
  );
}
