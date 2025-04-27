"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { push } = useRouter();
  const { user } = useUserStore();

  useEffect(() => {
    if (!user) {
      push("/");
    }
  }, [user, push]);

  return <>{children}</>;
}
