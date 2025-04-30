import { useQuery } from "@tanstack/react-query";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { User } from "@/store/useUserStore";

const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await fetch("/api/auth/me");

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const useCurrentUser = () => {
  const { setUser, clearUser } = useUserStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    } else if (data === null && !isLoading) {
      clearUser();
    }
  }, [data, isLoading, setUser, clearUser]);

  return {
    user: data,
    isLoading,
    error,
  };
};
