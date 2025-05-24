// src/components/sidebar/Sidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react'; // Import signOut
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme/ThemeToggle'; // Import the updated ThemeSwitcher
import {
  ChevronLeft,
  ChevronRight,
  LogOut, // Import LogOut icon for sign-out button
  LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface SidebarProps {
  menus: MenuItem[];
}

export function Sidebar({ menus }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); // Redirect to home/login page after sign out
  };

  return (
    <aside
      className={cn(
        'dark:bg-zinc-950 bg-white text-gray-800 dark:text-gray-200',
        'h-screen p-4 transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64',
        'shadow-md border-r border-gray-200 dark:border-zinc-800'
      )}
    >
      {/* Top Section: Collapse Toggle */}
      <div className='flex items-center justify-end mb-6 pt-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setIsCollapsed(!isCollapsed)}
          className='dark:text-gray-400 dark:hover:bg-zinc-800 text-gray-500 hover:bg-gray-100 cursor-pointer rounded-full transition-colors duration-200'
          aria-label='Toggle Sidebar'
        >
          {isCollapsed ? <ChevronRight className='h-5 w-5' /> : <ChevronLeft className='h-5 w-5' />}
        </Button>
      </div>

      {/* Menu Items */}
      <nav className='flex-grow overflow-y-auto custom-scrollbar'>
        <ul className='space-y-2'>
          {menus.map((menu) => {
            const isActive = pathname === menu.url || (pathname.startsWith(menu.url) && menu.url !== '/');

            return (
              <li key={menu.title}>
                <Link
                  href={menu.url}
                  className={cn(
                    'flex items-center p-2 rounded-lg transition-colors duration-200',
                    isCollapsed ? 'justify-center' : 'justify-start',
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                      : 'text-gray-600 dark:text-gray-400',
                    'hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-emerald-600 dark:hover:text-emerald-400'
                  )}
                >
                  <menu.icon className={cn('w-5 h-5', !isCollapsed && 'mr-2')} />
                  {!isCollapsed && <span className='font-medium text-sm'>{menu.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section: Divider, Theme Toggle, Sign Out */}
      <div className={cn(
        'mt-auto pt-4', // Push to bottom, add top padding
        'border-t border-gray-200 dark:border-zinc-800', // Divider
        'flex flex-col items-start space-y-3', // Column layout, spacing
        isCollapsed ? 'items-center' : 'items-start' // Center items when collapsed
      )}>
        {/* Theme Toggle */}
        <div className={cn('w-full', isCollapsed ? 'justify-center' : 'justify-start')}>
          <ThemeSwitcher /> {/* The switch component */}
        </div>

        {/* Sign Out Button */}
        <Button
          variant='ghost'
          onClick={handleSignOut}
          className={cn(
            'w-full text-left flex items-center p-2 rounded-lg transition-colors duration-200',
            isCollapsed ? 'justify-center' : 'justify-start',
            'text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20'
          )}
        >
          <LogOut className={cn('w-5 h-5', !isCollapsed && 'mr-2')} />
          {!isCollapsed && <span className='font-medium text-sm'>Sign Out</span>}
        </Button>
      </div>
    </aside>
  );
}