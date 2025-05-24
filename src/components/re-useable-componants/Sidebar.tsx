"use client";

    import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '../../lib/utils';
import { Home, Settings, LogOut, Menu, X, Users, ShoppingBag, DollarSign, Package, ShoppingCart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { UserRole } from '../../lib/models/User';
import { signOut } from 'next-auth/react';
import { Button } from '../ui/button';

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  role?: UserRole[]; // Optional: roles that can see this item
}

interface SidebarProps {
  header: string;
  navItems: NavItem[];
  currentUserEmail?: string;
  currentUserRole?: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ header, navItems, currentUserEmail, currentUserRole }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: '0%', opacity: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
    exit: { x: '-100%', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } },
  };
    const overlayVariants = {
hidden: { opacity: 0 },
visible: { opacity: 1, transition: { duration: 0.3 } },
exit: { opacity: 0, transition: { duration: 0.3 } },
};

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item =>
    !item.role || (currentUserRole && item.role.includes(currentUserRole))
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-purple-800 to-purple-950 text-white shadow-lg p-6 flex flex-col z-50",
          "transform transition-transform duration-300 ease-in-out",
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0' // Hidden on mobile by default, visible on desktop
        )}
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold tracking-wide">{header}</h2>
          <button
            className="p-2 rounded-md hover:bg-purple-700 transition-colors lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-3">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex items-center p-3 rounded-lg hover:bg-purple-700 transition-colors group">
                  <item.icon className="w-5 h-5 mr-3 text-purple-200 group-hover:text-white transition-colors" />
                  <span className="font-medium text-lg">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6 border-t border-purple-700">
          {currentUserEmail && (
            <div className="text-sm text-purple-200 mb-4">
              Logged in as: <br />
              <span className="font-semibold text-white">{currentUserEmail}</span>
              {currentUserRole && <span className="block text-xs italic opacity-75">({currentUserRole})</span>}
            </div>
          )}
          <Button
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </motion.aside>
    </>
  );
};

// Example Nav Items (Can be passed as props)
export const adminNavItems: NavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: Home, role: [UserRole.Admin] },
  { href: '/admin/users', label: 'Users', icon: Users, role: [UserRole.Admin] },
  { href: '/admin/products', label: 'Products', icon: Package, role: [UserRole.Admin] },
  { href: '/admin/sales', label: 'Sales', icon: DollarSign, role: [UserRole.Admin] },
  { href: '/admin/settings', label: 'Settings', icon: Settings, role: [UserRole.Admin] },
];

export const cashierNavItems: NavItem[] = [
  { href: '/cashier/dashboard', label: 'POS', icon: ShoppingCart, role: [UserRole.Cashier] },
  { href: '/cashier/history', label: 'Sales History', icon: DollarSign, role: [UserRole.Cashier] },
  { href: '/cashier/settings', label: 'Settings', icon: Settings, role: [UserRole.Cashier] },
];
