import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Loader2 } from "lucide-react";
import NotFoundAnimation from "./NotFoundAnimation";
import { Suspense } from "react";

export default function NotFoundContent() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="mb-8">
          <NotFoundAnimation />
          <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            The page you are looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button asChild variant="default">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </Link>

            <Link href="javascript:history.back()">
              <Button asChild variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
}
