import { signIn, signOut, getSession } from "next-auth/react";
import { useUserStore } from "@/store/useUserStore";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age?: string;
  gender?: string;
  nationality?: string;
  occupation?: string;
  smoker?: boolean;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  age?: string;
  gender?: string;
  nationality?: string;
  occupation?: string;
  smoker: boolean;
  createdAt: string;
  updatedAt: string;
}

export const authService = {
  async register(userData: RegisterData) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    // Login after successful registration
    await this.login({
      email: userData.email,
      password: userData.password,
    });

    return data;
  },

  async login(loginData: LoginData) {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: loginData.email,
        password: loginData.password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Get session to update user store
      const session = await getSession();
      if (session?.user) {
        const { setUser } = useUserStore.getState();
        setUser({
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          phone: session.user.phone,
          age: session.user.age,
          gender: session.user.gender,
          nationality: session.user.nationality,
          occupation: session.user.occupation,
          smoker: session.user.smoker,
          image: session.user.image || "",
          isAdmin: session.user.isAdmin || false,
        });
      }

      return { success: true };
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  },

  async logout() {
    try {
      const { clearUser } = useUserStore.getState();
      // First clear the user from the store
      clearUser();
      // Then sign out from NextAuth
      await signOut({ redirect: false });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  isAuthenticated(): boolean {
    return useUserStore.getState().isAuthenticated;
  },
};
