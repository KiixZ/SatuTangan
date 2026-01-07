import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/password-input";
import { MathCaptcha } from "@/components/ui/math-captcha";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(1, "Please enter your password")
    .min(8, "Password must be at least 8 characters long"),
  captcha: z.string().min(1, "Please complete the captcha"),
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
  const [captchaValue, setCaptchaValue] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const navigate = useNavigate();
  const { login, refetchUser } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      captcha: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    // Validate captcha before submission
    if (!isCaptchaValid) {
      toast.error("Please complete the captcha correctly");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting login...", data.email);

      // Call actual login API
      await login(data.email, data.password);

      console.log("Login successful, refetching user...");

      // Refetch user data to update navbar
      refetchUser();

      // Wait a bit for state to update
      await new Promise((resolve) => setTimeout(resolve, 100));

      toast.success(`Welcome back!`);

      console.log("Redirecting to:", redirectTo || "/");

      // Redirect to the stored location or default to home
      const targetPath = redirectTo || "/";
      navigate(targetPath, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);

      let errorMessage = "Invalid email or password";

      if (error.response?.status === 401) {
        errorMessage =
          "Invalid email or password. Please check your credentials.";
      } else if (error.response?.status === 403) {
        errorMessage =
          error.response?.data?.error?.message ||
          "Email not verified. Please check your email.";
      } else if (
        error.code === "ERR_NETWORK" ||
        error.message === "Network Error"
      ) {
        errorMessage =
          "Cannot connect to server. Please check if backend is running.";
      } else if (error.response?.data?.error?.message) {
        errorMessage = error.response.data.error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
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
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoComplete="email"
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
            <FormItem className="relative">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Link
                to="/forgot-password"
                className="text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75"
              >
                Forgot password?
              </Link>
            </FormItem>
          )}
        />

        <MathCaptcha
          value={captchaValue}
          onChange={(value) => {
            setCaptchaValue(value);
            form.setValue("captcha", value);
          }}
          onValidationChange={setIsCaptchaValid}
          error={form.formState.errors.captcha?.message}
        />

        <Button className="mt-2" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              <LogIn />
              Sign in
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
