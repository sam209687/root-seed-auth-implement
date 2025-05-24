// src/app/admin/_components/AdminSidebar.tsx
'use client'; // This component will be used in client context (e.g., inside layout)

import { Sidebar, MenuItem } from '@/components/sidebar/Sidebar'; // Import Sidebar and MenuItem interface
import {
  LayoutDashboard,
  PlusCircle,
  Percent,
  Package,
  Users,
  ShoppingCart,
  BarChart,
  FileText,
} from 'lucide-react';

// Define the specific menu items for the Admin dashboard
const adminMenus: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Add Brands',
    url: '/admin/brands/add', // More specific path for adding brands
    icon: PlusCircle,
  },
  {
    title: 'Add Category',
    url: '/admin/categories/add', // More specific path for adding categories
    icon: PlusCircle,
  },
  {
    title: 'Add Products',
    url: '/admin/products/add', // More specific path for adding products
    icon: Package,
  },
  {
    title: 'Add GST/HSN',
    url: '/admin/tax/add', // More specific path for tax
    icon: Percent,
  },
  {
    title: 'Add Unit',
    url: '/admin/units/add', // More specific path for adding units
    icon: Percent,
  },
  {
    title: 'Manage Cashiers',
    url: '/admin/cashiers', // General management page for cashiers
    icon: Users,
  },
  {
    title: 'POS (Admin)', // If Admin can also use POS
    url: '/admin/pos',
    icon: ShoppingCart,
  },
  {
    title: 'Sales Analytics',
    url: '/admin/sales',
    icon: BarChart,
  },
  {
    title: 'Manage Invoices',
    url: '/admin/invoices',
    icon: FileText,
  },
];

export function AdminSidebar() {
  return (
    <Sidebar menus={adminMenus} />
  );
}