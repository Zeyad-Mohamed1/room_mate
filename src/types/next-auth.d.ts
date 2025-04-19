import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    phone?: string;
    age?: string;
    gender?: string;
    nationality?: string;
    occupation?: string;
    smoker?: boolean;
    isAdmin?: boolean;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      phone?: string;
      age?: string;
      gender?: string;
      nationality?: string;
      occupation?: string;
      smoker?: boolean;
      isAdmin?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone?: string;
    age?: string;
    gender?: string;
    nationality?: string;
    occupation?: string;
    smoker?: boolean;
    isAdmin?: boolean;
  }
}
