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
import { useSession } from "next-auth/react";
import { UserRole, User } from "../../../../lib/models/User"; // Import User type
import { useOfflineMessages } from '../../../../hooks/useOfflineMessages';
import { MessageType, MessageStatus, Message } from '../../../../lib/models/Message'; // Import Message, MessageType, MessageStatus

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

export function CashierChangePasswordForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpReceived, setOtpReceived] = useState<string | null>(null);
  const { addMessage, subscribeToMessages, unsubscribeFromMessages } = useOfflineMessages();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
      otp: "",
    },
  });

  // Type assertion for session.user to align with your User model
  const currentUser: User | undefined = session?.user as User | undefined;


  useEffect(() => {
    if (status === "loading") return;

    // Redirect if not authenticated, or not a cashier, or not a default cashier
    // Use currentUser for type safety
    if (!currentUser || currentUser.role !== UserRole.Cashier || !currentUser.isDefaultCashier) {
      if (currentUser?.role === UserRole.Cashier && !currentUser.isDefaultCashier) {
        router.push("/cashier/dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [currentUser, status, router]); // Added currentUser to dependencies


  useEffect(() => {
    // Use currentUser for type safety
    if (!currentUser?.cashierId) return;

    // Subscribe to messages relevant to this cashier
    const handleIncomingMessage = (message: Message) => { // Type message as Message
      if (message.type === MessageType.OtpResponse && message.recipientId === currentUser.cashierId) {
        setOtpReceived(message.otp || null); // Ensure otp is string or null
        form.setValue('otp', message.otp || ''); // Auto-populate OTP field, handle undefined
        toast.success("OTP Received!", {
          description: "The admin has sent your OTP. It's now auto-filled.",
        });
      }
    };

    subscribeToMessages(handleIncomingMessage);

    return () => {
      unsubscribeFromMessages(handleIncomingMessage);
    };
  }, [currentUser, form, subscribeToMessages, unsubscribeFromMessages]); // Added currentUser to dependencies


  const requestOtp = async () => {
    // Use currentUser for type safety
    if (!currentUser || !currentUser.cashierId || !currentUser.email) {
      toast.error("Error", { description: "Could not retrieve cashier details to request OTP." });
      return;
    }

    setIsLoading(true);
    try {
      // Create a request message for the admin, using enum for type and status
      const requestMessage: Partial<Message> = { // Type the message
        type: MessageType.OtpRequest, // Use MessageType enum
        senderId: currentUser.cashierId,
        senderName: currentUser.name || currentUser.email,
        timestamp: new Date().toISOString(),
        status: MessageStatus.Pending, // Use MessageStatus enum
      };

      // Add this message to the local message system
      await addMessage(requestMessage);

      setOtpRequested(true);
      toast.info("OTP Request Sent", {
        description: "Your OTP request has been sent to the Admin panel. Please wait for the admin to generate and send it back.",
      });
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Failed to request OTP", {
        description: "An error occurred while sending the request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ChangePasswordFormValues) => {
    setIsLoading(true);
    try {
      // Use currentUser for type safety
      if (!currentUser || !currentUser.email || !currentUser.cashierId) {
        toast.error("Authentication Error", {
          description: "Could not retrieve user email or ID for password update.",
        });
        setIsLoading(false);
        return;
      }

      if (!otpReceived && !data.otp) {
          toast.error("OTP Required", { description: "Please request and enter the OTP to change your password." });
          setIsLoading(false);
          return;
      }

      // Use the OTP from state if auto-filled, otherwise from form
      const otpToUse = otpReceived || data.otp;

      const response = await fetch("/api/cashier/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email, // Use currentUser
          newPassword: data.newPassword,
          otp: otpToUse,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password Changed!", {
          description: "Your password has been updated successfully.",
        });
        router.push("/cashier/dashboard");
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

  // Display access denied message if not an authorized default cashier
  // Use currentUser for type safety
  if (!currentUser || currentUser.role !== UserRole.Cashier || !currentUser.isDefaultCashier) {
    return (
      <main className="flex min-h-screen items-center justify-center p-4">
        <FormCard title="Access Denied" description="You do not have permission to view this page. Redirecting...">
          <p>Redirecting...</p>
        </FormCard>
      </main>
    );
  }

  return (
    <FormCard
      title="Change Default Password"
      description="Please set a new secure password for your cashier account, assisted by admin."
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
        <div className="flex gap-2 items-end">
          <CustomButton
            type="button"
            onClick={requestOtp}
            isLoading={isLoading && !otpRequested}
            disabled={otpRequested || isLoading}
            variant="outline"
            className="flex-grow h-10"
          >
            {otpRequested ? "OTP Requested" : "Request OTP from Admin"}
          </CustomButton>
          {otpReceived && (
            <CustomFormField
                name="otp"
                label="Received OTP"
                placeholder="Auto-filled"
                type="text"
                readOnly // This prop needs to be supported by CustomFormField
                className="flex-grow"
                value={otpReceived}
            />
          )}
           {!otpReceived && otpRequested && (
             <div className="flex-grow self-center text-center text-sm text-muted-foreground">
               Waiting for admin to send OTP...
             </div>
           )}
        </div>
        <CustomButton type="submit" className="w-full" isLoading={isLoading}>
          Change Password
        </CustomButton>
      </CustomForm>
    </FormCard>
  );
}