import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MobileBottomBar from "../components/shared/MobileBottomBar";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/providers/AuthProvider";

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
        <AuthProvider>
          <Toaster />
          {children}
          <MobileBottomBar />
        </AuthProvider>
      </body>
    </html>
  );
}
