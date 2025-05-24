// src/lib/models/User.ts
import { ObjectId } from 'mongodb';

export enum UserRole {
  Admin = 'admin',
  Cashier = 'cashier',
  // Add other roles if needed
}

export interface User {
  _id?: ObjectId;
  email: string;
  password?: string;
  role: 'admin' | 'cashier';
  isDefaultAdmin?: boolean; // <--- This is the correct line
  isDefaultCashier?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string | null;
  cashierId?: string | null;
   // --- New fields for Forgot Password ---
  otp?: string;
  otpExpires?: Date;
}