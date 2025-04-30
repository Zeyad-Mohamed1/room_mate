"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import dynamic from "next/dynamic";
import { useCurrentUser } from "@/hooks/useCurrentUser";

// Dynamically import MapButton with no SSR
const MapButton = dynamic(() => import("@/components/shared/MapButton"), {
  ssr: false,
});

function QueryProviderContent({ children }: { children: React.ReactNode }) {
  // This will automatically update the Zustand store based on the user state
  useCurrentUser();

  return <>{children}</>;
}

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QueryProviderContent>{children}</QueryProviderContent>
      <MapButton />
    </QueryClientProvider>
  );
}
