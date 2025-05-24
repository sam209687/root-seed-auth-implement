// src/app/forgot-password/page.tsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { FormCard } from '@/components/re-useable-componants/FormCard';
import { CustomForm } from '@/components/re-useable-componants/CustomForm';
import { CustomFormField } from '@/components/re-useable-componants/CustomFormField';
import { CustomButton } from '@/components/re-useable-componants/CustomButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        // Redirect to reset-password page with email as query parameter
        router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
      } else {
        toast.error(result.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Forgot password submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <FormCard
          title="Forgot Password"
          description="Enter your email to receive a password reset OTP."
        >
          {/* This line remains unchanged, as per your desired UI */}
          <CustomForm form={form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4"> {/* Corrected onSubmit here based on prior discussions */}
            <CustomFormField
              name="email"
              label="Email"
              placeholder="name@example.com"
              type="email"
            />
            <CustomButton type="submit" className="w-full" isLoading={isLoading}>
              Send OTP
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