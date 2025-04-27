import { PaymentTime, RentTime } from "@/types";

/**
 * Formats the payment time for display
 * @param time PaymentTime enum value
 * @returns Formatted string for display
 */
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

/**
 * Formats the rent time for display
 * @param time RentTime enum value
 * @returns Formatted string for display
 */
export const formatRentTime = (time: RentTime): string => {
  switch (time) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "quarterly":
      return "Quarterly";
    case "semiannual":
      return "Semi-Annual";
    case "annually":
      return "Annual";
    case "monthly":
    default:
      return "Monthly";
  }
};

/**
 * Gets the full payment time label
 * @param time PaymentTime enum value
 * @returns Full payment time label
 */
export const getPaymentTimeLabel = (time: PaymentTime): string => {
  switch (time) {
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "quarterly":
      return "Quarterly";
    case "semiannual":
      return "Semi-Annual";
    case "annually":
      return "Annually";
    case "monthly":
    default:
      return "Monthly";
  }
};

/**
 * Formats price with payment time period
 * @param price The price amount as a number or string
 * @param time The payment time period
 * @param currencySymbol The currency symbol to use (defaults to $)
 * @returns Formatted price with time period
 */
export const formatPriceWithTime = (
  price: number | string,
  time: PaymentTime,
  currencySymbol = "$"
): string => {
  // Format the price with commas for thousands
  const formattedPrice =
    typeof price === "number"
      ? price.toLocaleString()
      : parseFloat(price).toLocaleString();

  // Return the formatted string with currency symbol and payment time
  return `${currencySymbol}${formattedPrice}${formatPaymentTime(time)}`;
};
