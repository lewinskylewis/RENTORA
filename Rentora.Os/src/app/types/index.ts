// ─── Shared application types ─────────────────────────────────────────────────

export type PageType =
  | "dashboard"
  | "pay-rent"
  | "report-issue"
  | "move-out"
  | "contact-agent"
  | "house-detail"
  | "ai-suggestions"
  | "notifications"
  | "payment-success"
  | "issue-success"
  | "moveout-confirm"
  | "profile"
  | "rate-us"
  | "about"
  | "inbox";

export interface NavState {
  page: PageType;
  houseId?: string;
  suggestionType?: "similar" | "cheaper" | "upgrade";
}

export interface MaintenanceTicket {
  id: string;
  title: string;
  status: "pending" | "in-progress" | "resolved";
  date: string;
}

export interface VacantHouse {
  id: string;
  name: string;
  image: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  location: string;
  distance: string;
  amenities: string[];
  availability: string;
  isPromoted?: boolean;
  rating?: number;
  description?: string;
  sqft?: number;
  floor?: number;
  totalFloors?: number;
  deposit?: number;
  agent?: { name: string; avatar: string; phone: string };
}

export interface ChatMessage {
  id: string;
  sender: "me" | "agent";
  text: string;
  time: string;
}

export type AuthState = "auth" | "guest" | "app";
