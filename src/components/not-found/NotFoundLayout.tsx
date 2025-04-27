import { ReactNode } from "react";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

interface NotFoundLayoutProps {
  children: ReactNode;
}

export default function NotFoundLayout({ children }: NotFoundLayoutProps) {
  return (
    <main className="container mx-auto py-8">
      <Suspense
        fallback={
          <div>
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        }
      >
        <div className="w-full max-w-2xl mx-auto">{children}</div>
      </Suspense>
    </main>
  );
}
