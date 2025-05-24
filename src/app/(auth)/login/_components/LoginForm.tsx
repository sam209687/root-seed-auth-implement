// src/app/login-client-form.tsx
"use client";

import { CustomButton } from "@/components/re-useable-componants/CustomButton";
import { CustomForm } from "@/components/re-useable-componants/CustomForm";
import { CustomFormField } from "@/components/re-useable-componants/CustomFormField";
import { FormCard } from "@/components/re-useable-componants/FormCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { signIn, getSession } from "next-auth/react"; // Import getSession
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { UserRole, User } from '@/lib/models/User';
import { toast } from "sonner";
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginClientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const signInResult = await signIn('credentials', {
                redirect: false, // Prevent NextAuth from redirecting automatically
                email: data.email,
                password: data.password,
            });

            if (signInResult?.error) {
                toast.error('Login Failed', {
                    description: signInResult.error,
                });
            } else if (signInResult?.ok) {
                // Login successful. Now, explicitly fetch the updated session.
                const updatedSession = await getSession();

                if (updatedSession && updatedSession.user) {
                    // Type assertion to ensure role property is recognized
                    const currentUser = updatedSession.user as User;

                    toast.success('Login Successful!', {
                        description: `Welcome, ${currentUser.email}. Redirecting...`,
                    });

                    // Redirect based on user role and default status
                    if (currentUser.role === UserRole.Admin) {
                        // Assuming you have /admin/change-password and /admin/dashboard
                        if (currentUser.isDefaultAdmin) {
                            router.push('/admin/change-password');
                        } else {
                            router.push('/admin/dashboard');
                        }
                    } else if (currentUser.role === UserRole.Cashier) {
                        // Assuming you have /cashier/change-password and /cashier/dashboard
                        if (currentUser.isDefaultCashier) {
                            router.push('/cashier/change-password');
                        } else {
                            router.push('/cashier/dashboard');
                        }
                    } else {
                        // Fallback for other roles or if role is not perfectly defined
                        router.push('/dashboard'); // Keep generic dashboard as a fallback
                    }
                } else {
                    toast.error('Login Error', {
                        description: 'Could not retrieve user session after login. Please refresh or try again.',
                    });
                    router.push('/'); // Fallback to login page
                }
            }
        } catch (error) {
            console.error("Login submission error:", error);
            toast.error('An unexpected error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

  return (
    <FormCard title="Login" description="Enter your credentials to access the POS system.">
      <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">
        <CustomFormField
          name="email"
          label="Email"
          placeholder="name@example.com"
          type="email"
        />
        <CustomFormField
          name="password"
          label="Password"
          placeholder="********"
          type="password"
        />
        <CustomButton type="submit" className="w-full" isLoading={isLoading}>
          Sign In
        </CustomButton>
        <div className="text-center text-sm mt-4">
          <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
            Forgot your password?
          </Link>
        </div>
      </CustomForm>
    </FormCard>
  );
}






// // src/app/login-client-form.tsx
// "use client";

// import { CustomButton } from "@/components/re-useable-componants/CustomButton";
// import { CustomForm } from "@/components/re-useable-componants/CustomForm";
// import { CustomFormField } from "@/components/re-useable-componants/CustomFormField";
// import { FormCard } from "@/components/re-useable-componants/FormCard";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler } from "react-hook-form";
// import { z } from "zod";
// import { signIn, useSession } from "next-auth/react";

// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { UserRole, User } from '@/lib/models/User';
// import { toast } from "sonner";
// import Link from 'next/link'; // Import Link for forgot password

// const loginSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z.string().min(1, { message: "Password is required." }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export function LoginClientForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const { data: session } = useSession(); // Use useSession hook

//   const form = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
//         setIsLoading(true);
//         try {
//             const signInResult = await signIn('credentials', {
//                 redirect: false, // Prevent NextAuth from redirecting automatically
//                 email: data.email,
//                 password: data.password,
//             });

//             if (signInResult?.error) {
//                 toast.error('Login Failed', {
//                     description: signInResult.error,
//                 });
//             } else if (signInResult?.ok) {
//                 // Manually trigger a session update after successful login
//                 // This ensures `useSession` gets the latest data quickly.
//                 // However, for redirection, it's often more reliable to use
//                 // server-side redirection after sign-in for initial loads,
//                 // or rely on `useSession` updating shortly.

//                 // For immediate redirection based on the *new* session data after a client-side sign-in,
//                 // a full page refresh or server-side redirect is sometimes best.
//                 // If we assume `signIn` is successful, the `session` state will eventually update.
//                 // For direct redirection, we'll rely on the `signIn` success and client-side router.

//                 // Because `session` from `useSession()` might not be updated *immediately*
//                 // after `signIn` resolves, we'll try to infer the role from the success of `signInResult`.
//                 // A more robust approach for client-side redirection might involve making an API call
//                 // to get user details post-login, or relying on the server-side redirect in page.tsx after a full refresh.
//                 // For this example, we'll rely on the `session` updating or redirecting to a page that will fetch the latest session.

//                 // To ensure the most up-to-date user data for redirection on the client-side
//                 // after a redirect: false signIn, you often need to refetch the session,
//                 // or let the page component with `useSession` re-render.
//                 // Alternatively, redirect to the dashboard, and let the dashboard itself handle
//                 // further role-based redirects if necessary using `auth()`.

//                 // For simplicity here, upon successful `signInResult.ok`, we will redirect to a common
//                 // dashboard, and then the server-side `src/app/page.tsx` will handle the actual
//                 // role-based redirection if the user navigates back or refreshes, or subsequent
//                 // pages will use `auth()` to get the correct session.

//                 toast.success('Login Successful!', {
//                     description: `Welcome! Redirecting...`,
//                 });

//                 // Instead of client-side role check here, we'll redirect to a common dashboard
//                 // and let the server component `src/app/page.tsx` (or other server components)
//                 // handle the role-based redirection on subsequent loads/navigates.
//                 // If you need immediate client-side role-based redirect, you'd need to fetch user
//                 // details separately or ensure `signIn` returns sufficient data.
//                 router.push('/dashboard'); // Redirect to a general dashboard or directly to '/' for the server component to handle.
//             }
//         } catch (error) {
//             console.error("Login submission error:", error);
//             toast.error('An unexpected error occurred during login.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//   return (
//     <FormCard title="Login" description="Enter your credentials to access the POS system.">
//       <CustomForm form={form} onSubmit={onSubmit} className="space-y-4">
//         <CustomFormField
//           name="email"
//           label="Email"
//           placeholder="name@example.com"
//           type="email"
//         />
//         <CustomFormField
//           name="password"
//           label="Password"
//           placeholder="********"
//           type="password"
//         />
//         <CustomButton type="submit" className="w-full" isLoading={isLoading}>
//           Sign In
//         </CustomButton>
//         <div className="text-center text-sm mt-4">
//           <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
//             Forgot your password?
//           </Link>
//         </div>
//       </CustomForm>
//     </FormCard>
//   );
// }





