import { Outlet, Navigate, useLocation } from "react-router-dom";
import { AuthenticatedLayout } from "@admin/components/layout/authenticated-layout";
import { useAuthStore } from "@admin/stores/auth-store";

export default function Layout() {
  const { auth } = useAuthStore();
  const location = useLocation();

  console.log("Layout - isAuthenticated:", auth.isAuthenticated);
  console.log("Layout - user:", auth.user);
  console.log("Layout - accessToken:", auth.accessToken);

  // Redirect to sign-in if not authenticated
  if (!auth.isAuthenticated) {
    console.log("Layout - Redirecting to sign-in");
    return <Navigate to="/admin/sign-in" state={{ from: location }} replace />;
  }

  console.log("Layout - Rendering Outlet");

  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
}
