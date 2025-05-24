import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateOTP(): string {
  // Generate a 6-digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// for offline otp generation
export function generateOtp(): string {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit number
  return otp.toString();
}

