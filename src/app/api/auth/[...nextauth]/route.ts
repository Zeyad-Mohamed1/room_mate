import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Find user by email
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Check if user exists
          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }

          // Convert null values to undefined for NextAuth compatibility
          const { password: _, ...userWithoutPassword } = user;

          // Type conversion - transform null to undefined
          return {
            id: userWithoutPassword.id,
            name: userWithoutPassword.name,
            email: userWithoutPassword.email,
            phone: userWithoutPassword.phone || undefined,
            age: userWithoutPassword.age || undefined,
            gender: userWithoutPassword.gender || undefined,
            nationality: userWithoutPassword.nationality || undefined,
            occupation: userWithoutPassword.occupation || undefined,
            smoker: userWithoutPassword.smoker,
            isAdmin: userWithoutPassword.isAdmin,
          };
        } catch (error) {
          console.error("Login error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  pages: {
    signIn: "/", // We'll handle signin in our modal
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.age = user.age;
        token.gender = user.gender;
        token.nationality = user.nationality;
        token.occupation = user.occupation;
        token.smoker = user.smoker;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to the session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string | undefined;
        session.user.age = token.age as string | undefined;
        session.user.gender = token.gender as string | undefined;
        session.user.nationality = token.nationality as string | undefined;
        session.user.occupation = token.occupation as string | undefined;
        session.user.smoker = token.smoker as boolean | undefined;
        session.user.isAdmin = token.isAdmin as boolean | undefined;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
