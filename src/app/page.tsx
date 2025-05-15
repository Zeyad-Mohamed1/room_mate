import { Suspense } from "react";
import WelcomeDialog from "@/components/shared/WelcomeDialog";
import PropertySection from "./components/home/PropertySection";
import Footer from "./components/home/Footer";
import { HomePageProvider } from "./components/home/HomePageContext";


export default async function Home() {

  return (
    <HomePageProvider>
      <div className="min-h-screen bg-gray-50">
        <WelcomeDialog />

        <main className="container min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-24 md:pb-12">
          <Suspense fallback={<PropertySectionSkeleton />}>
            <PropertySection />
          </Suspense>
        </main>

        <Footer />
      </div>
    </HomePageProvider>
  );
}

// Skeleton loader for property section
function PropertySectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <div className="w-48 h-10 bg-gray-200 rounded-md animate-pulse mb-2"></div>
          <div className="w-36 h-6 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
        <div className="w-32 h-10 bg-gray-200 rounded-md animate-pulse mt-4 md:mt-0"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-soft animate-pulse h-80"
          />
        ))}
      </div>
    </div>
  );
}
