import type { NavState } from "@/app/types";

/**
 * Translates the app-wide NavState navigation intents (the contract every page
 * component and layout uses via its `onNav` prop) into real router URLs.
 *
 * Guest mode maps the pages a guest may reach onto the /guest branch; all
 * tenant-only pages always live under /tenant, where the route guard redirects
 * unauthenticated visitors to /login.
 */
export function navStateToPath(nav: NavState, guest: boolean): string {
  const base = guest ? "/guest" : "/tenant";
  switch (nav.page) {
    case "dashboard": return guest ? "/guest" : "/tenant/dashboard";
    case "pay-rent": return "/tenant/payments";
    case "payment-success": return "/tenant/payments/success";
    case "report-issue": return "/tenant/maintenance/report";
    case "issue-success": return "/tenant/maintenance/success";
    case "move-out": return "/tenant/move-out";
    case "moveout-confirm": return "/tenant/move-out/confirm";
    case "contact-agent": return "/tenant/contact-agent";
    case "house-detail": return `${base}/listings/${nav.houseId ?? "1"}`;
    case "ai-suggestions": return `/tenant/ai-suggestions/${nav.suggestionType ?? "similar"}`;
    case "notifications": return "/tenant/notifications";
    case "profile": return "/tenant/profile";
    case "rate-us": return `${base}/feedback`;
    case "about": return `${base}/about`;
    case "inbox": return "/tenant/inbox";
  }
}
