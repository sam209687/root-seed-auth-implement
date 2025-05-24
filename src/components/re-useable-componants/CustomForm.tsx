// src/components/re-useable-componants/CustomForm.tsx
import { FormProvider, useFormContext, UseFormReturn, FieldValues } from "react-hook-form"; // Import FieldValues and UseFormReturn
import React from "react";
// No need for ZodObject or ZodRawShape directly here, as CustomForm handles the RHF part

// Define a generic type `TFormValues` that extends FieldValues
interface CustomFormProps<TFormValues extends FieldValues> {
  // The 'form' prop now expects UseFormReturn with the generic type TFormValues
  form: UseFormReturn<TFormValues>;
  onSubmit: (data: TFormValues) => void; // onSubmit should also use TFormValues
  children: React.ReactNode;
  className?: string;
}

// CustomForm is now a generic component
export function CustomForm<TFormValues extends FieldValues>({ form, onSubmit, children, className }: CustomFormProps<TFormValues>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}