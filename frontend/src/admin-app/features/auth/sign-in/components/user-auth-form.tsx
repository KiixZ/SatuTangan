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
import { authApi } from "../../data/auth-api";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
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
    console.log("onSubmit called with data:", data);
    console.log("Sending to authApi.login:", {
      email: data.email,
      password: data.password,
    });
    setIsLoading(true);

    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      });

      // Check if user is ADMIN
      if (response.data.user.role !== "ADMIN") {
        toast.error("Access denied. Admin account required.", {
          description: "Only admin users can access this panel.",
          duration: 5000,
        });
        setIsLoading(false);
        return;
      }

      // Set user and access token from API response
      const user = {
        accountNo: response.data.user.id,
        email: response.data.user.email,
        role: [response.data.user.role],
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
      };

      auth.setUser(user);
      auth.setAccessToken(response.data.accessToken);

      toast.success(
        `Welcome back, ${response.data.user.full_name || data.email}!`,
      );

      // Redirect to the stored location or default to admin dashboard
      const targetPath = redirectTo || "/admin";
      navigate(targetPath, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      // Handle different error types
      let errorTitle = "Login Failed";
      let errorMessage = "Invalid email or password";

      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        errorTitle = "Connection Error";
        errorMessage =
          "Cannot connect to server. Please check if backend is running.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.response?.status === 403) {
        errorMessage =
          error.response?.data?.error?.message || "Email not verified";
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorTitle, {
        description: errorMessage,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid gap-3", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
              <Link
                to="/admin/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />
        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="animate-spin" /> : <LogIn />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
