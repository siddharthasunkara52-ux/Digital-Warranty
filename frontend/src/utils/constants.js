export const APP_NAME = "WarrantyTracker";

export const API_BASE = "http://localhost:5000";


export const STATUS_COLORS = {
  Active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  Expired: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-500",
  },
  "Near Expiry": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};


export const FILTER_OPTIONS = [
  { value: "All", label: "All Statuses" },
  { value: "Active", label: "Active" },
  { value: "Near Expiry", label: "Near Expiry" },
  { value: "Expired", label: "Expired" },
];


export const CATEGORY_OPTIONS = [
  "Electronics",
  "Appliances",
  "Furniture",
  "Automotive",
  "Software",
  "Other",
];
