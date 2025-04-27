// Enums that match Prisma schema
export type PaymentTime =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annually";
export type PropertyType = "house" | "room";
export type RoomType = "mixed" | "single";
export type RentTime =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "semiannual"
  | "annually";
export type Gender = "male" | "female" | "any";

// Utility functions for payment time display
export const formatPaymentTime = (time: PaymentTime): string => {
  switch (time) {
    case "daily":
      return "/day";
    case "weekly":
      return "/week";
    case "quarterly":
      return "/quarter";
    case "semiannual":
      return "/6 months";
    case "annually":
      return "/year";
    case "monthly":
    default:
      return "/month";
  }
};
