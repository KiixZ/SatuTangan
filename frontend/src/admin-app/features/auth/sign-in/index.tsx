import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@admin/stores/auth-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@admin/components/ui/card";
import { AuthLayout } from "../auth-layout";
import { UserAuthForm } from "./components/user-auth-form";

export function SignIn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { auth } = useAuthStore();
  const redirect = searchParams.get("redirect");

  // If user is already authenticated, redirect to admin dashboard
  useEffect(() => {
    if (auth.accessToken && auth.user) {
      const targetPath = redirect || "/admin";
      navigate(targetPath, { replace: true });
    }
  }, [auth.accessToken, auth.user, redirect, navigate]);

  // Don't render form if already authenticated
  if (auth.accessToken && auth.user) {
    return null;
  }

  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg tracking-tight">Sign in</CardTitle>
          <CardDescription>
            Enter your email and password below to <br />
            log into your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserAuthForm redirectTo={redirect} />
        </CardContent>
        <CardFooter>
          <p className="text-muted-foreground px-8 text-center text-sm">
            By clicking sign in, you agree to our{" "}
            <a
              href="/terms"
              className="hover:text-primary underline underline-offset-4"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="hover:text-primary underline underline-offset-4"
            >
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
}
