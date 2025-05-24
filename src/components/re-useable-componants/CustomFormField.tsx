// src/components/re-useable-componants/CustomFormField.tsx
import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
// Assuming you are using shadcn/ui components for Input, Label, and Form components
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';


// Define your CustomFormFieldProps interface
// It should extend React.InputHTMLAttributes<HTMLInputElement> to inherit standard input props
export interface CustomFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  placeholder: string;
  type?: React.HTMLInputTypeAttribute; // Allows standard input types like "text", "password", etc.
  // Add the readOnly prop here
  readOnly?: boolean; // <--- ADD THIS LINE
  // You might also have other custom props like `className`
}

export const CustomFormField: React.FC<CustomFormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  readOnly, // <--- DESTRUCTURE THE readOnly PROP HERE
  className, // If you're passing className, make sure to destructure it too
  ...props // This captures any other standard HTML input attributes
}) => {
  const { control } = useFormContext();

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
              readOnly={readOnly} // <--- PASS THE readOnly PROP TO THE UNDERLYING INPUT COMPONENT
              className={className} // Pass className if applicable
              {...field} // These are props from react-hook-form (value, onChange, onBlur, etc.)
              {...props} // Pass any other HTML input attributes
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};