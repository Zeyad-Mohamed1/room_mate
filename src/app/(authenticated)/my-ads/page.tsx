import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import MyAdsContent from "./components/MyAdsContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Ads | Roommate Finder",
  description:
    "Manage your property listings and view offers from potential roommates",
};

export default async function MyAdsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <MyAdsContent />
    </div>
  );
}
