// src/components/re-useable-componants/CustomButton.tsx
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface CustomButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  isLoading?: boolean;
}

export function CustomButton({ children, isLoading, disabled, ...props }: CustomButtonProps) {
  return (
    <Button disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
}