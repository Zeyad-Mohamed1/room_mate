import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function PropertyNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <Search className="h-12 w-12 text-red-500" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-gray-600 mb-6">
          The property you are looking for does not exist or has been removed.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <Link
            href="/search"
            className="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <Search className="h-5 w-5" />
            Search Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
