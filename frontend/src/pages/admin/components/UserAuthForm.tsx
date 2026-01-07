import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@admin/stores/auth-store";
import { cn } from "@admin/lib/utils";
import { Button } from "@admin/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@admin/components/ui/form";
import { Input } from "@admin/components/ui/input";
import { PasswordInput } from "@admin/components/password-input";
import { authApi } from "@admin/features/auth/data/auth-api";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(7, "Password must be at least 7 characters long"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string;
}

export function UserAuthForm({
  className,
  redirectTo,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { auth } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      if (response.data) {
        // Check if user is ADMIN
        if (response.data.user.role !== "ADMIN") {
          toast.error("Access denied. Admin account required.");
          setIsLoading(false);
          return;
        }

        // Set user and access token
        const user = {
          accountNo: response.data.user.id,
          email: response.data.user.email,
          role: [response.data.user.role],
          exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
        };

        auth.setUser(user);
        auth.setAccessToken(response.data.accessToken);

        console.log("After setUser and setAccessToken:");
        console.log("auth.user:", auth.user);
        console.log("auth.accessToken:", auth.accessToken);
        console.log("auth.isAuthenticated:", auth.isAuthenticated);

        toast.success(
          `Welcome back, ${response.data.user.full_name || data.email}!`,
        );

        // Redirect to the page user was trying to access or dashboard
        const redirectPath = redirectTo || "/admin";
        console.log("Navigating to:", redirectPath);
        navigate(redirectPath, { replace: true });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.error?.message || "Invalid email or password";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-4", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Link
                  to="/admin/forgot-password"
                  className="text-sm font-medium text-muted-foreground hover:opacity-75"
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="********"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? (
            "Signing in..."
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
