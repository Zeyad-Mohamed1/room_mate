import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Get initials from name (first letter of first name and last name)
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

// Generate a random but consistent color based on the name
export function getAvatarColor(name: string): string {
  const colors = [
    "bg-primary/80",
    "bg-primary-dark",
    "bg-secondary/90",
    "bg-accent/90",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-slate-600",
    "bg-emerald-600",
  ];

  // Simple hash function to get a consistent index
  const hash = name.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
}
