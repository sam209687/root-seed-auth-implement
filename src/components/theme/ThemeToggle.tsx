// src/components/ThemeSwitcher.tsx
"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch'; // Import Shadcn Switch
import { Label } from '@/components/ui/label'; // Assuming you have Label as well for accessibility

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Render nothing on the server
  }

  // Determine if the switch should be checked (dark mode)
  const isChecked = theme === 'dark';

  const handleToggle = () => {
    setTheme(isChecked ? 'light' : 'dark');
  };

  return (
    <div className="flex items-center space-x-2 p-2">
      <Switch
        id="theme-toggle"
        checked={isChecked}
        onCheckedChange={handleToggle}
        aria-label="Toggle theme"
      />
      <Label htmlFor="theme-toggle" className="text-sm font-medium">
        {isChecked ? 'Dark Mode' : 'Light Mode'}
      </Label>
    </div>
  );
}