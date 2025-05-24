// src/app/cashier/_components/CashierSidebar.tsx
'use client'; // This component will be used in client context (e.g., inside layout)

import { Sidebar, MenuItem } from '@/components/sidebar/Sidebar'; // Import Sidebar and MenuItem interface
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart,
  FileText,
} from 'lucide-react';

// Define the specific menu items for the Cashier dashboard
const cashierMenus: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/cashier/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'POS',
    url: '/cashier/pos',
    icon: ShoppingCart,
  },
  {
    title: 'Sales Report',
    url: '/cashier/sales-report',
    icon: BarChart,
  },
  {
    title: 'Daily Transactions',
    url: '/cashier/transactions',
    icon: FileText, // Reusing FileText icon for transactions
  },
];

export function CashierSidebar() {
  return (
    <Sidebar menus={cashierMenus} />
  );
}