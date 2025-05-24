// src/lib/constants.ts
// In a real application, you'd use a robust caching solution like Redis
// for OTPs to handle expiry and distributed environments.
// For this local development phase, a simple in-memory map will suffice.
export const otpStore = new Map<string, { code: string; expiry: number }>(); // Map<email, {code, expiry_timestamp}>

export const OTP_EXPIRY_SECONDS = 300; // 5 minutes