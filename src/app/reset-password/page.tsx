// src/app/reset-password/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // Import useSearchParams
import { FormCard } from '@/components/re-useable-componants/FormCard';
import { CustomForm } from '@/components/re-useable-componants/CustomForm';
import { CustomFormField } from '@/components/re-useable-componants/CustomFormField';
import { CustomButton } from '@/components/re-useable-componants/CustomButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }), // Hidden field, but useful for schema
  otp: z.string().length(6, { message: "OTP must be 6 digits." }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Please confirm your password." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"], // Path of the error
});

type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email') || ''; // Get email from URL query

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: emailFromUrl, // Pre-fill email from URL
      otp: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Effect to update email field if URL changes or on initial load
  // (Optional, but good for robustness if user navigates back/forward)
  useState(() => {
    if (emailFromUrl && form.getValues('email') !== emailFromUrl) {
      form.setValue('email', emailFromUrl);
    }
  });


  const onSubmit: SubmitHandler<ResetPasswordFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        form.reset(); // Clear form fields
        router.push('/'); // Redirect to login page after successful reset
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Password reset submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <FormCard
          title="Reset Password"
          description="Enter your OTP and set a new password."
        >
          <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">
            {/* Email field (hidden or read-only) */}
            <CustomFormField
              name="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
              readOnly // Make it read-only
              className="bg-gray-100 dark:bg-gray-700 cursor-not-allowed" // Style as read-only
            />
            <CustomFormField
              name="otp"
              label="OTP"
              placeholder="6-digit OTP"
              type="text"
              maxLength={6}
            />
            <CustomFormField
              name="newPassword"
              label="New Password"
              placeholder="••••••••"
              type="password"
            />
            <CustomFormField
              name="confirmPassword"
              label="Confirm New Password"
              placeholder="••••••••"
              type="password"
            />
            <CustomButton type="submit" className="w-full" isLoading={isLoading}>
              Reset Password
            </CustomButton>
          </CustomForm>
          <div className="mt-6 text-center">
            <Link href="/" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
              Back to Login
            </Link>
          </div>
        </FormCard>
      </div>
    </div>
  );
}