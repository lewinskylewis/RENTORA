import { Navigate, Outlet, Route, Routes, useParams } from "react-router";
import { AppLayout } from "@/app/layouts";
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

  // Shared app chrome (Sidebar + Header) rendered once for every routed page.
  const chrome = (
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
  );

  return (
    <Routes>
      <Route path="/" element={<RootRedirect authState={authState} />} />
      <Route path="/login" element={<AuthScreen onAuthed={onAuthed} onGuest={onGuest} />} />

      {/* Guest experience — browse-only; tenant actions redirect to sign-in. */}
      <Route path="/guest" element={guest ? chrome : <Navigate to="/login" replace />}>
        <Route index element={<Dashboard onNav={onNav} guest onAuth={onRequireAuth} />} />
        <Route path="listings/:propertyId" element={<HouseDetailRoute onNav={onNav} guest onAuth={onRequireAuth} />} />
        <Route path="about" element={<About onNav={onNav} />} />
        <Route path="feedback" element={<RateUs onNav={onNav} />} />
      </Route>

      {/* Full authenticated tenant experience. */}
      <Route path="/tenant" element={authState === "app" ? chrome : <Navigate to="/login" replace />}>
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
