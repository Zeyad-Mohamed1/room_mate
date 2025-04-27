"use client";

import NotFoundContent from "@/components/not-found/NotFoundContent";
import NotFoundLayout from "@/components/not-found/NotFoundLayout";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function NotFound() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      }
    >
      <NotFoundLayout>
        <NotFoundContent />
      </NotFoundLayout>
    </Suspense>
  );
}
