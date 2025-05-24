// src/app/(admin)/admin/_components/ChangePasswordForm.tsx
"use client";

import { CustomButton } from "../../../../components/re-useable-componants/CustomButton";
import { CustomForm } from "../../../../components/re-useable-componants/CustomForm";
import { CustomFormField } from "../../../../components/re-useable-componants/CustomFormField";
import { FormCard } from "../../../../components/re-useable-componants/FormCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Correct import for useSession

const changePasswordSchema = z.object({
  newPassword: z.string()
    .min(8, { message: "Password must be at least 8 characters." })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character." }),
  confirmNewPassword: z.string(),
  otp: z.string().length(6, { message: "OTP must be 6 digits." }).regex(/^\d+$/, { message: "OTP must contain only digits." }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match.",
  path: ["confirmNewPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm() {
  const router = useRouter();
  const { data: session, status } = useSession(); // 'data' is the session object, 'status' is 'loading', 'authenticated', 'unauthenticated'
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0); // For OTP resend timer

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
      otp: "",
    },
  });

  useEffect(() => {
    // Redirect if not authenticated or not the default admin
    // This effect runs when status changes.
    // If status is 'unauthenticated' OR if 'session' exists but isn't the default admin, redirect.
    if (status !== "loading") { // Check if session status is no longer loading
      if (!session || !session.user || session.user.role !== "admin" || !session.user.isDefaultAdmin) {
        router.push("/");
      }
    }
  }, [session, status, router]); // Depend on session and status

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);


  const sendOtp = async () => {
    setIsLoading(true);
    try {
      // Ensure session and email are available before sending OTP
      if (!session || !session.user || !session.user.email) {
        toast.error("Authentication Error", {
          description: "Could not retrieve user email for OTP.",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session.user.email }), // Send OTP to the logged-in default admin's email
      });

      const data = await response.json();
      if (response.ok) {
        setOtpSent(true);
        setCountdown(60); // 60-second cooldown for OTP resend
        toast.success("OTP Sent!", {
          description: "A 6-digit code has been sent to your email.",
        });
      } else {
        toast.error("Failed to send OTP", {
          description: data.message || "Please try again.",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("An unexpected error occurred while sending OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      if (!session || !session.user || !session.user.email) {
        toast.error("Authentication Error", {
          description: "Could not retrieve user email for password update.",
        });
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session.user.email, // Ensure we're updating the correct user
          newPassword: data.newPassword,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password Changed!", {
          description: "Your password has been updated successfully.",
        });
        // Redirect to admin dashboard after successful change
        router.push("/admin/dashboard");
      } else {
        toast.error("Password Change Failed", {
          description: result.message || "Invalid OTP or an error occurred.",
        });
      }
    } catch (error) {
      console.error("Password change submission error:", error);
      toast.error("An unexpected error occurred during password change.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <FormCard title="Loading..." description="Checking authentication status.">
          <p>Please wait...</p>
        </FormCard>
      </main>
    );
  }

  // Only render the form if session is loaded and user is authenticated and default admin
  // This check complements the useEffect redirection
  if (!session || !session.user || session.user.role !== "admin" || !session.user.isDefaultAdmin) {
    // This state should ideally be short-lived as useEffect will redirect
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <FormCard title="Access Denied" description="You do not have permission to view this page. Redirecting...">
          <p>Redirecting to login...</p>
        </FormCard>
      </main>
    );
  }


  return (
    <FormCard
      title="Change Default Password"
      description="Please set a new secure password for your administrator account and verify with OTP."
    >
      <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">
        <CustomFormField
          name="newPassword"
          label="New Password"
          placeholder="********"
          type="password"
        />
        <CustomFormField
          name="confirmNewPassword"
          label="Confirm New Password"
          placeholder="********"
          type="password"
        />
        <div className="flex gap-2">
          <CustomFormField
            name="otp"
            label="OTP"
            placeholder="6-digit code"
            type="text"
            className="flex-grow"
          />
          <CustomButton
            type="button"
            onClick={sendOtp}
            isLoading={isLoading && !otpSent} // Only show loading when initially sending OTP
            disabled={otpSent && countdown > 0} // Disable if OTP sent and countdown active
            variant="outline"
            className="self-end"
          >
            {otpSent && countdown > 0 ? `Resend (${countdown}s)` : "Send OTP"}
          </CustomButton>
        </div>
        <CustomButton type="submit" className="w-full" isLoading={isLoading}>
          Change Password
        </CustomButton>
      </CustomForm>
    </FormCard>
  );
}