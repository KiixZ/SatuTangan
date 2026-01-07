import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import ErrorBoundary from "@admin/components/error-boundary";
import { ThemeProvider } from "@admin/context/theme-provider";
import { FontProvider } from "@admin/context/font-provider";
import { DirectionProvider } from "@admin/context/direction-provider";

// Lazy load admin pages
const AdminDashboard = lazy(() => import("./Dashboard"));
const AdminSignIn = lazy(() => import("./SignIn"));
const AdminLayout = lazy(() => import("./Layout"));
const AdminCampaigns = lazy(() => import("./Campaigns"));
const AdminUsers = lazy(() => import("./Users"));
const AdminBanners = lazy(() => import("./Banners"));
const AdminCategories = lazy(() => import("./Categories"));
const AdminVerifications = lazy(() => import("./Verifications"));
const AdminWithdrawals = lazy(() => import("./Withdrawals"));
const AdminReports = lazy(() => import("./Reports"));
const AdminSettings = lazy(() => import("./Settings"));
const AdminContent = lazy(() => import("./Content"));

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
      staleTime: 10 * 1000,
    },
  },
});

export function AdminApp() {
  console.log("AdminApp rendered");
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <FontProvider>
            <DirectionProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Auth routes */}
                  <Route path="sign-in" element={<AdminSignIn />} />

                  {/* Protected admin routes */}
                  <Route element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="campaigns" element={<AdminCampaigns />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="banners" element={<AdminBanners />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route
                      path="verifications"
                      element={<AdminVerifications />}
                    />
                    <Route path="withdrawals" element={<AdminWithdrawals />} />
                    <Route path="reports" element={<AdminReports />} />
                    <Route path="content" element={<AdminContent />} />
                    <Route path="settings/*" element={<AdminSettings />} />
                  </Route>

                  {/* Redirect unknown routes to sign-in */}
                  <Route
                    path="*"
                    element={<Navigate to="/admin/sign-in" replace />}
                  />
                </Routes>
              </Suspense>
              <Toaster richColors position="top-right" />
            </DirectionProvider>
          </FontProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
