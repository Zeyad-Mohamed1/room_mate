import { Metadata } from "next";
import PropertiesContent from "./components/PropertiesContent";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Properties Management | Dashboard",
  description: "Manage properties in the system",
};

export default function PropertiesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Properties Management</h1>
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        }
      >
        <PropertiesContent />
      </Suspense>
    </div>
  );
}
