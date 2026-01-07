import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@admin/stores/auth-store";
import { ConfirmDialog } from "@admin/components/confirm-dialog";
import { authApi } from "@admin/features/auth/data/auth-api";

interface SignOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignOutDialog({ open, onOpenChange }: SignOutDialogProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
      // Continue with local logout even if API call fails
    } finally {
      auth.reset();
      toast.success("Signed out successfully");
      // Preserve current location for redirect after sign-in
      const currentPath = location.pathname + location.search;
      navigate(`/admin/sign-in?redirect=${encodeURIComponent(currentPath)}`, {
        replace: true,
      });
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out"
      desc="Are you sure you want to sign out? You will need to sign in again to access your account."
      confirmText="Sign out"
      destructive
      handleConfirm={handleSignOut}
      className="sm:max-w-sm"
    />
  );
}
