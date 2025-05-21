
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format a date string to a more readable format
export function formatDate(dateString: string | null): string {
  if (!dateString) return "Never";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Provider status utility functions
export function getStatusColor(status: string): string {
  switch (status) {
    case "operational":
      return "text-green-500";
    case "degraded":
      return "text-yellow-500";
    case "outage":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case "operational":
      return "bg-green-100";
    case "degraded":
      return "bg-yellow-100";
    case "outage":
      return "bg-red-100";
    default:
      return "bg-gray-100";
  }
}

// Calculate estimated cost
export function calculateCost(provider: any, characterCount: number): string {
  const cost = (provider.costPer1000Chars * characterCount / 1000).toFixed(2);
  return `$${cost}`;
}
