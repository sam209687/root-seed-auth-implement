// // src/components/re-useable-componants/CustomForm.tsx
// import React from 'react';
// import { FieldValues } from 'react-hook-form'; // Ensure this is imported

// // Define the props for your CustomForm component
// interface CustomFormProps<TFieldValues extends FieldValues = FieldValues> extends React.ComponentPropsWithoutRef<'form'> {
//   // === THIS IS THE CRUCIAL LINE ===
//   // It MUST be React.FormEventHandler<HTMLFormElement>;
//   // This type correctly represents a function that handles a standard form event.
//   onSubmit: React.FormEventHandler<HTMLFormElement>;
  
//   className?: string; // Keep this if you use it for styling
//   children: React.ReactNode; // Ensure children prop is defined
//   // If you have any other props directly on CustomFormProps, list them here.
// }

// // Make sure this component is named CustomForm and is exported
// export function CustomForm<TFieldValues extends FieldValues = FieldValues>({
//   onSubmit,
//   className,
//   children,
//   ...props // Allows passing any other native form attributes (e.g., id, target)
// }: CustomFormProps<TFieldValues>) {
//   return (
//     // Ensure that the onSubmit prop is passed directly to the native <form> element
//     <form onSubmit={onSubmit} className={className} {...props}>
//       {children}
//     </form>
//   );
// }

// src/components/re-useable-componants/CustomForm.tsx
import React from 'react';
import {
  FieldValues,
  UseFormReturn, // Import UseFormReturn to type the 'form' prop
  FormProvider // Import FormProvider
} from 'react-hook-form';

interface CustomFormProps<TFieldValues extends FieldValues = FieldValues> extends React.ComponentPropsWithoutRef<'form'> {
  // Your existing onSubmit prop:
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  className?: string;
  children: React.ReactNode;
  // This is the new/existing prop you pass from ForgotPasswordPage
  form: UseFormReturn<TFieldValues>; // Type the 'form' prop
}

export function CustomForm<TFieldValues extends FieldValues = FieldValues>({
  onSubmit,
  className,
  children,
  form, // Destructure the 'form' prop
  ...props
}: CustomFormProps<TFieldValues>) {
  return (
    // Wrap the <form> with FormProvider, passing the 'form' instance
    <FormProvider {...form}> {/* <-- ADD THIS LINE */}
      <form onSubmit={onSubmit} className={className} {...props}>
        {children}
      </form>
    </FormProvider> 
  );
}