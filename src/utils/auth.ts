import { useUserStore } from "@/store/useUserStore";
import { getSession } from "next-auth/react";

/**
 * Check if the current user is an admin
 * @returns {boolean} True if the user is an admin, false otherwise
 */
export const isAdmin = (): boolean => {
  const user = useUserStore.getState().user;
  return !!user?.isAdmin;
};

/**
 * Check if a user is an admin (server-side)
 * @returns {Promise<boolean>} Promise that resolves to true if the user is an admin, false otherwise
 */
export const isAdminServer = async (): Promise<boolean> => {
  const session = await getSession();
  return !!session?.user?.isAdmin;
};

/**
 * React hook to check if the current user is an admin
 * @returns {boolean} True if the user is an admin, false otherwise
 */
export const useIsAdmin = (): boolean => {
  const user = useUserStore((state) => state.user);
  return !!user?.isAdmin;
};
