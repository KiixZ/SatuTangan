import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@admin/stores/auth-store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuthStore();

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.accessToken || !auth.user) {
      // Redirect to sign-in with current location for redirect after login
      const currentPath = location.pathname + location.search;
      navigate(`/admin/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
      return;
    }

    // Check if user has ADMIN role
    if (auth.user.role && !auth.user.role.includes("ADMIN")) {
      // User is authenticated but not an admin
      navigate("/admin/sign-in", { replace: true });
      return;
    }
  }, [auth.accessToken, auth.user, navigate, location]);

  // If not authenticated, don't render anything (will redirect)
  if (!auth.accessToken || !auth.user) {
    return null;
  }

  // If user doesn't have ADMIN role, don't render anything (will redirect)
  if (auth.user.role && !auth.user.role.includes("ADMIN")) {
    return null;
  }

  // User is authenticated and is an admin, render children
  return <>{children}</>;
}
