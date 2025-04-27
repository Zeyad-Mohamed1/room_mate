import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileBottomBar from "../components/shared/MobileBottomBar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";
import Header from "@/components/shared/Header";
import QueryProvider from "@/components/providers/query-provider";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import HeaderWithCategories from "@/components/shared/HeaderWithCategories";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "RoommateFinder - Find Your Perfect Roommate",
  description: "Find your perfect roommate or room to rent with RoommateFinder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          }
        >
          <AuthProvider>
            <QueryProvider>
              <NotificationsProvider>
                <Toaster />
                <HeaderWithCategories />

                {children}
                <MobileBottomBar />
              </NotificationsProvider>
            </QueryProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
