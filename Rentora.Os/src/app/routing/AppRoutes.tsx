import { Navigate, Outlet, Route, Routes, useParams } from "react-router";
import { AppLayout, AgentLayout, AdminLayout, TenantThemeShell } from "@/app/layouts";
import type { Theme } from "@/app/theme";
import type { AuthState, NavState } from "@/app/types";
import { About } from "@/app/features/about";
import { AuthScreen } from "@/app/features/auth";
import { ContactAgent } from "@/app/features/chat";
import { Dashboard } from "@/app/features/dashboard";
import { RateUs } from "@/app/features/feedback";
import { InboxPage } from "@/app/features/inbox";
import { AiSuggestions, HouseDetail } from "@/app/features/listings";
import { IssueSuccess, ReportIssue } from "@/app/features/maintenance";
import { MoveOut, MoveOutConfirm } from "@/app/features/move-out";
import { NotFoundPage } from "@/app/features/not-found";
import { Notifications } from "@/app/features/notifications";
import { PayRent, PaymentSuccess } from "@/app/features/payments";
import { Profile } from "@/app/features/profile";
import { AgentApplication, AgentApplicationStatus } from "@/app/features/onboarding";
import {
  AgentDashboard, Properties, Units, Tenants, Vacancies, Maintenance, Leads, Finance, Reports, Settings,
} from "@/app/features/agent";
import { AdminDashboard, AgentApplicationsPage, AgentsPage, AgenciesPage } from "@/app/features/admin";
import { RequireAuth, RequireAgent, RequireAdmin } from "./guards";

interface AppRoutesProps {
  authState: AuthState;
  onNav: (nav: NavState) => void;
  onAuthed: () => void;
  onGuest: () => void;
  onRequireAuth: () => void;
  onSignOut: () => void;
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCloseSidebar: () => void;
  activeTheme: Theme;
  onThemeChange: (t: Theme) => void;
}

export function AppRoutes({
  authState,
  onNav,
  onAuthed,
  onGuest,
  onRequireAuth,
  onSignOut,
  sidebarOpen,
  onOpenSidebar,
  onCloseSidebar,
  activeTheme,
  onThemeChange,
}: AppRoutesProps) {
  const guest = authState === "guest";

  // Tenant chrome (Sidebar + Header), themed and rendered once per branch.
  const themedChrome = (
    <TenantThemeShell activeTheme={activeTheme}>
      <AppLayout
        sidebarOpen={sidebarOpen}
        onOpenSidebar={onOpenSidebar}
        onCloseSidebar={onCloseSidebar}
        onNav={onNav}
        activeTheme={activeTheme}
        onThemeChange={onThemeChange}
        guest={guest}
        onAuth={onRequireAuth}
        onSignOut={onSignOut}
      >
        <Outlet />
      </AppLayout>
    </TenantThemeShell>
  );

  // Themed shell for standalone tenant pages (login, onboarding) with no chrome.
  const themedBare = (
    <TenantThemeShell activeTheme={activeTheme}>
      <Outlet />
    </TenantThemeShell>
  );

  return (
    <Routes>
      <Route path="/" element={<RootRedirect authState={authState} />} />

      {/* Auth + onboarding — tenant theme, no dashboard chrome. */}
      <Route element={themedBare}>
        <Route path="/login" element={<AuthScreen onAuthed={onAuthed} onGuest={onGuest} />} />
        <Route path="/signup" element={<AuthScreen onAuthed={onAuthed} onGuest={onGuest} />} />
        <Route path="/apply/agent" element={<AgentApplication />} />
        <Route path="/agent-application/status" element={<AgentApplicationStatus />} />
      </Route>

      {/* Guest experience — browse-only; tenant actions redirect to sign-in. */}
      <Route path="/guest" element={guest ? themedChrome : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard onNav={onNav} guest onAuth={onRequireAuth} />} />
        <Route path="listings/:propertyId" element={<HouseDetailRoute onNav={onNav} guest onAuth={onRequireAuth} />} />
        <Route path="about" element={<About onNav={onNav} />} />
        <Route path="feedback" element={<RateUs onNav={onNav} />} />
      </Route>

      {/* Full authenticated tenant experience. */}
      <Route path="/tenant" element={authState === "app" ? themedChrome : <Navigate to="/login" replace />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard onNav={onNav} />} />
        <Route path="payments" element={<PayRent onNav={onNav} />} />
        <Route path="payments/success" element={<PaymentSuccess onNav={onNav} />} />
        <Route path="maintenance/report" element={<ReportIssue onNav={onNav} />} />
        <Route path="maintenance/success" element={<IssueSuccess onNav={onNav} />} />
        <Route path="move-out" element={<MoveOut onNav={onNav} />} />
        <Route path="move-out/confirm" element={<MoveOutConfirm onNav={onNav} />} />
        <Route path="contact-agent" element={<ContactAgent onNav={onNav} />} />
        <Route path="listings/:propertyId" element={<HouseDetailRoute onNav={onNav} />} />
        <Route path="ai-suggestions" element={<Navigate to="similar" replace />} />
        <Route path="ai-suggestions/:suggestionType" element={<AiSuggestionsRoute onNav={onNav} />} />
        <Route path="notifications" element={<Notifications onNav={onNav} />} />
        <Route path="profile" element={<Profile onNav={onNav} />} />
        <Route path="inbox" element={<InboxPage onNav={onNav} />} />
        <Route path="feedback" element={<RateUs onNav={onNav} />} />
        <Route path="about" element={<About onNav={onNav} />} />
      </Route>

      {/* Agent workspace — own fixed zinc/indigo shell, outside the tenant theme.
          Role enforcement in RequireAgent; RLS enforces it again server-side. */}
      <Route element={<RequireAuth />}>
        <Route element={<RequireAgent />}>
          <Route path="/agent" element={<AgentLayout />}>
            <Route index element={<AgentDashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="units" element={<Units />} />
            <Route path="tenants" element={<Tenants />} />
            <Route path="vacancies" element={<Vacancies />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="leads" element={<Leads />} />
            <Route path="finance" element={<Finance />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Admin workspace. */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<Navigate to="/admin" replace />} />
            <Route path="agent-applications" element={<AgentApplicationsPage />} />
            <Route path="agents" element={<AgentsPage />} />
            <Route path="agencies" element={<AgenciesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

/** Lands visitors on the branch matching their current auth mode. */
function RootRedirect({ authState }: { authState: AuthState }) {
  if (authState === "app") return <Navigate to="/tenant/dashboard" replace />;
  if (authState === "guest") return <Navigate to="/guest" replace />;
  return <Navigate to="/login" replace />;
}

/** Binds the :propertyId URL param to HouseDetail's houseId prop. */
function HouseDetailRoute({ onNav, guest = false, onAuth }: { onNav: (nav: NavState) => void; guest?: boolean; onAuth?: () => void }) {
  const { propertyId } = useParams();
  return <HouseDetail houseId={propertyId ?? "1"} onNav={onNav} guest={guest} onAuth={onAuth} />;
}

/** Binds the :suggestionType URL param, falling back to "similar" for unknown values. */
function AiSuggestionsRoute({ onNav }: { onNav: (nav: NavState) => void }) {
  const { suggestionType } = useParams();
  const valid = suggestionType === "cheaper" || suggestionType === "upgrade" ? suggestionType : "similar";
  return <AiSuggestions suggestionType={valid} onNav={onNav} />;
}
