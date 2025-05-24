// // src/components/re-useable-componants/CustomFormField.tsx
// // This file should define and export CustomFormField
// "use client"; // If it uses client-side hooks like useFormContext

// import {
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"; // Assuming shadcn/ui form components
// import { Input } from "@/components/ui/input"; // Assuming shadcn/ui Input
// import { useFormContext } from "react-hook-form"; // For accessing form context

// interface CustomFormFieldProps {
//   name: string;
//   label: string;
//   placeholder: string;
//   type?: string;
//   // Add any other props your CustomFormField might take
// }

// // MAKE SURE THIS FUNCTION IS NAMED 'CustomFormField' and is EXPORTED
// export function CustomFormField({ name, label, placeholder, type = "text" }: CustomFormFieldProps) {
//   const { control, formState: { errors } } = useFormContext();

//   // Safely access the error for this specific field
//   const fieldError = errors[name]?.message as string | undefined;

//   return (
//     <FormField
//       control={control}
//       name={name}
//       render={({ field }) => (
//         <FormItem>
//           <FormLabel>{label}</FormLabel>
//           <FormControl>
//             <Input
//               placeholder={placeholder}
//               type={type}
//               {...field}
//               className={fieldError ? 'border-red-500' : ''} // Example: Add red border on error
//             />
//           </FormControl>
//           {fieldError && <FormMessage className="text-red-500 text-xs mt-1">{fieldError}</FormMessage>} {/* Display the error message */}
//         </FormItem>
//       )}
//     />
//   );
// }

// src/components/re-useable-componants/CustomFormField.tsx
"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form"; // This hook will now find the context

interface CustomFormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
}

export function CustomFormField({ name, label, placeholder, type = "text" }: CustomFormFieldProps) {
  const { control, formState: { errors } } = useFormContext(); // This will no longer be null

  const fieldError = errors[name]?.message as string | undefined;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              placeholder={placeholder}
              type={type}
              {...field}
              className={fieldError ? 'border-red-500' : ''}
            />
          </FormControl>
          {fieldError && <FormMessage className="text-red-500 text-xs mt-1">{fieldError}</FormMessage>}
        </FormItem>
      )}
    />
  );
}