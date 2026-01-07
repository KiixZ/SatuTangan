import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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

const formSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Please enter your full name")
      .min(3, "Full name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    phoneNumber: z
      .string()
      .min(1, "Please enter your phone number")
      .regex(/^[0-9+\-\s()]*$/, "Please enter a valid phone number")
      .min(10, "Phone number must be at least 10 digits"),
    password: z
      .string()
      .min(1, "Please enter your password")
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    captcha: z.string().min(1, "Please complete the captcha verification"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export function SignUpForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLFormElement>) {
  const [isLoading, setIsLoading] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
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
      console.log("SignUpForm submitted with data:", data); // Debug log

      // Map field names to match backend expectations
      const registerData = {
        full_name: data.fullName,
        email: data.email,
        phone_number: data.phoneNumber,
        password: data.password,
        captcha: "verified", // Default captcha for now
      };

      console.log("Sending data to backend:", registerData); // Debug log

      // Import and use authService
      const { authService } = await import("@/services/authService");
      const result = await authService.register(registerData);

      console.log("Registration successful:", result); // Debug log

      toast.success("Account created successfully! You can now login.");

      // Redirect to sign in page
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error); // Debug log
      toast.error(
        error.response?.data?.error?.message ||
          "Failed to create account. Please try again.",
      );
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  autoComplete="tel"
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
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
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </form>
    </Form>
  );
}
