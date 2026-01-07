import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/context/ThemeProvider";
import { HomePage } from "@/pages/HomePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";

// Lazy load pages for better performance
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import("@/pages/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import("@/pages/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  })),
);
const VerifyEmailPage = lazy(() =>
  import("@/pages/VerifyEmailPage").then((m) => ({
    default: m.VerifyEmailPage,
  })),
);
const CampaignDetailPage = lazy(() =>
  import("@/pages/CampaignDetailPage").then((m) => ({
    default: m.CampaignDetailPage,
  })),
);
const CampaignExplorePage = lazy(() => import("@/pages/CampaignExplorePage"));
const AboutUsPage = lazy(() =>
  import("@/pages/AboutUsPage").then((m) => ({ default: m.AboutUsPage })),
);
const TermsPage = lazy(() =>
  import("@/pages/TermsPage").then((m) => ({ default: m.TermsPage })),
);
const PrivacyPage = lazy(() =>
  import("@/pages/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const FaqPage = lazy(() =>
  import("@/pages/FaqPage").then((m) => ({ default: m.FaqPage })),
);
const ContactPage = lazy(() =>
  import("@/pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const DonationSuccessPage = lazy(() => import("@/pages/DonationSuccessPage"));
const DonationPendingPage = lazy(() => import("@/pages/DonationPendingPage"));
const DonationErrorPage = lazy(() => import("@/pages/DonationErrorPage"));
const CreatorDashboardPage = lazy(() => import("@/pages/CreatorDashboardPage"));
const PrayersPage = lazy(() => import("@/pages/PrayersPage"));
const AdminApp = lazy(() =>
  import("@/pages/admin/AdminApp").then((m) => ({ default: m.AdminApp })),
);

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="satutangan-ui-theme">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/campaigns" element={<CampaignExplorePage />} />
                  <Route
                    path="/campaigns/:id"
                    element={<CampaignDetailPage />}
                  />
                  <Route path="/explore" element={<CampaignExplorePage />} />
                  <Route path="/about" element={<AboutUsPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/prayers" element={<PrayersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                  <Route
                    path="/reset-password/:token"
                    element={<ResetPasswordPage />}
                  />
                  <Route
                    path="/verify-email/:token"
                    element={<VerifyEmailPage />}
                  />
                  <Route
                    path="/donation/success"
                    element={<DonationSuccessPage />}
                  />
                  <Route
                    path="/donation/pending"
                    element={<DonationPendingPage />}
                  />
                  <Route
                    path="/donation/error"
                    element={<DonationErrorPage />}
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute
                        allowedRoles={["DONOR", "CREATOR", "ADMIN"]}
                      >
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/creator/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["CREATOR", "ADMIN"]}>
                        <CreatorDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/admin/*" element={<AdminApp />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
