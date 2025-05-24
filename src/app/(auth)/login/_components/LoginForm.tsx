// // src/app/(auth)/login/_components/LoginForm.tsx
// "use client";

// import { CustomButton } from "@/components/re-useable-componants/CustomButton";
// import { CustomForm } from "@/components/re-useable-componants/CustomForm";
// import { CustomFormField } from "@/components/re-useable-componants/CustomFormField";
// import { FormCard } from "@/components/re-useable-componants/FormCard";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
// import { z } from "zod";
// import { signIn, getSession } from "next-auth/react";
// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import { UserRole, User } from '../../../../lib/models/User';
// import { toast } from "sonner";
// import Link from 'next/link';

// const loginSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z.string().min(1, { message: "Password is required." }),
// });

// type LoginFormValues = z.infer<typeof loginSchema>;

// export function LoginForm() { // Assuming this is named LoginForm or LoginClientForm
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);

//   const formMethods = useForm<LoginFormValues>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const { handleSubmit, formState: { errors } } = formMethods;

//    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
//         setIsLoading(true);
//         try {
//             const signInResult = await signIn('credentials', {
//                 redirect: false,
//                 email: data.email,
//                 password: data.password,
//             });

//             if (signInResult?.error) {
//                 toast.error('Login Failed', {
//                     description: signInResult.error,
//                 });
//             } else if (signInResult?.ok) {
//                 const updatedSession = await getSession();

//                 if (updatedSession && updatedSession.user) {
//                     const currentUser = updatedSession.user as User;

//                     toast.success('Login Successful!', {
//                         description: `Welcome, ${currentUser.email}. Redirecting...`,
//                     });

//                     if (currentUser.role === UserRole.Admin) {
//                         if (currentUser.isDefaultAdmin) {
//                             router.push('/admin/change-password');
//                         } else {
//                             router.push('/admin/dashboard');
//                         }
//                     } else if (currentUser.role === UserRole.Cashier) {
//                         if (currentUser.isDefaultCashier) {
//                             router.push('/cashier/change-password');
//                         } else {
//                             router.push('/cashier/dashboard');
//                         }
//                     } else {
//                         router.push('/dashboard');
//                     }
//                 } else {
//                     toast.error('Login Error', {
//                         description: 'Could not retrieve user session after login. Please refresh or try again.',
//                     });
//                     router.push('/');
//                 }
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
//       <FormProvider {...formMethods}>
//         {/* THIS IS THE CRUCIAL LINE */}
//         <CustomForm onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           <CustomFormField
//             name="email"
//             label="Email"
//             placeholder="name@example.com"
//             type="email"
//           />
//           <CustomFormField
//             name="password"
//             label="Password"
//             placeholder="********"
//             type="password"
//           />
//           <CustomButton type="submit" className="w-full" isLoading={isLoading}>
//             Sign In
//           </CustomButton>
//           <div className="text-center text-sm mt-4">
//             <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300">
//               Forgot your password?
//             </Link>
//           </div>
//         </CustomForm>
//       </FormProvider>
//     </FormCard>
//   );
// }


// src/app/(auth)/login/_components/LoginForm.tsx
"use client";

import { CustomButton } from "../../../../components/re-useable-componants/CustomButton";
import { CustomForm } from "../../../../components/re-useable-componants/CustomForm";
import { CustomFormField } from "../../../../components/re-useable-componants/CustomFormField";
import { FormCard } from "../../../../components/re-useable-componants/FormCard";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form"; // Removed FormProvider import as CustomForm now handles it
import { z } from "zod";
import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { UserRole, User } from '../../../../lib/models/User';
import { toast } from "sonner";
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() { // Assuming this is named LoginForm or LoginClientForm
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize useForm
  const formMethods = useForm<LoginFormValues>({ // Renamed 'form' to 'formMethods' for clarity, but 'form' is fine too
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Destructure handleSubmit and formState from formMethods
  const { handleSubmit, formState: { errors } } = formMethods;

   const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setIsLoading(true);
        try {
            const signInResult = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (signInResult?.error) {
                toast.error('Login Failed', {
                    description: signInResult.error,
                });
            } else if (signInResult?.ok) {
                const updatedSession = await getSession();

                if (updatedSession && updatedSession.user) {
                    const currentUser = updatedSession.user as User;

                    toast.success('Login Successful!', {
                        description: `Welcome, ${currentUser.email}. Redirecting...`,
                    });

                    if (currentUser.role === UserRole.Admin) {
                        if (currentUser.isDefaultAdmin) {
                            router.push('/admin/change-password');
                        } else {
                            router.push('/admin/dashboard');
                        }
                    } else if (currentUser.role === UserRole.Cashier) {
                        if (currentUser.isDefaultCashier) {
                            router.push('/cashier/change-password');
                        } else {
                            router.push('/cashier/dashboard');
                        }
                    } else {
                        router.push('/dashboard');
                    }
                } else {
                    toast.error('Login Error', {
                        description: 'Could not retrieve user session after login. Please refresh or try again.',
                    });
                    router.push('/');
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
      {/* === CRUCIAL CHANGE: Pass the 'formMethods' to the 'form' prop of CustomForm === */}
      <CustomForm form={formMethods} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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