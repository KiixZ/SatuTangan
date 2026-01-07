import { StrictMode, lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { DirectionProvider } from "./context/direction-provider";
import { FontProvider } from "./context/font-provider";
import { ThemeProvider } from "./context/theme-provider";
import ErrorBoundary from "./components/error-boundary";
import { AuthenticatedLayout } from "./components/layout/authenticated-layout";
import { ProtectedRoute } from "./components/protected-route";
import "./styles/index.css";

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Lazy load pages
const Dashboard = lazy(() =>
  import("./features/dashboard").then((m) => ({ default: m.Dashboard })),
);
const Users = lazy(() =>
  import("./features/users").then((m) => ({ default: m.Users })),
);
const Campaigns = lazy(() =>
  import("./features/campaigns").then((m) => ({ default: m.Campaigns })),
);
const Categories = lazy(() =>
  import("./features/categories").then((m) => ({ default: m.Categories })),
);
const Banners = lazy(() =>
  import("./features/banners").then((m) => ({ default: m.Banners })),
);
const Verifications = lazy(() =>
  import("./features/verifications").then((m) => ({
    default: m.Verifications,
  })),
);
const Withdrawals = lazy(() =>
  import("./features/withdrawals").then((m) => ({ default: m.Withdrawals })),
);
const Reports = lazy(() =>
  import("./features/reports").then((m) => ({ default: m.Reports })),
);
const Settings = lazy(() =>
  import("./features/settings").then((m) => ({ default: m.Settings })),
);
const Content = lazy(() =>
  import("./features/content").then((m) => ({ default: m.Content })),
);
const SignIn = lazy(() =>
  import("./features/auth/sign-in").then((m) => ({ default: m.SignIn })),
);
const ForgotPassword = lazy(() =>
  import("./features/auth/forgot-password").then((m) => ({
    default: m.ForgotPassword,
  })),
);

function AdminApp() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="categories" element={<Categories />} />
          <Route path="banners" element={<Banners />} />
          <Route path="verifications" element={<Verifications />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="reports" element={<Reports />} />
          <Route path="content" element={<Content />} />
          <Route path="settings/*" element={<Settings />} />
        </Route>
        <Route path="/admin/sign-in" element={<SignIn />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/sign-in"
          element={<Navigate to="/admin/sign-in" replace />}
        />
        <Route
          path="/forgot-password"
          element={<Navigate to="/admin/forgot-password" replace />}
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Suspense>
  );
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ThemeProvider>
              <FontProvider>
                <DirectionProvider>
                  <AdminApp />
                  <Toaster />
                </DirectionProvider>
              </FontProvider>
            </ThemeProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </StrictMode>,
  );
}
