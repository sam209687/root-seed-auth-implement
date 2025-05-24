// src/app/(admin)/admin/dashboard/_components/AdminDashboardLayout.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../../../../components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

// Import the new sub-components
import { OverviewCards } from './OverviewCards';
import { SalesOverviewChart } from './SalesOverviewChart';
import { TopSellingProductsChart } from './TopSellingProductsChart';
import { CustomerDemographicsChart } from './CustomerDemographicsChart';
import { RecentTransactionsTable } from './RecentTransactionsTable';
import { OtpRequestPanel } from './OtpRequestPanel'; // The new OTP panel

// Mock Data Generators (keep them here or in a separate mock-data.ts)
const generateSalesData = () => {
  const data = [];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < 12; i++) {
    data.push({
      month: months[i],
      sales: Math.floor(Math.random() * 10000) + 5000,
      revenue: Math.floor(Math.random() * 8000) + 3000,
    });
  }
  return data;
};

const generateTopProducts = () => {
  const products = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Webcam', 'Headset'];
  const data = [];
  for (let i = 0; i < products.length; i++) {
    data.push({
      name: products[i],
      sales: Math.floor(Math.random() * 200) + 50,
    });
  }
  return data;
};

const generateCustomerData = () => {
  const data = [];
  const genders = ['Male', 'Female', 'Other'];
  for (let i = 0; i < genders.length; i++) {
    data.push({
      gender: genders[i],
      count: Math.floor(Math.random() * 500) + 100,
    });
  }
  return data;
};

const recentTransactions = [
  { id: '1', customer: 'John Doe', date: '2024-07-28', amount: 120.50, status: 'Completed' },
  { id: '2', customer: 'Jane Smith', date: '2024-07-28', amount: 50.00, status: 'Pending' },
  { id: '3', customer: 'Bob Johnson', date: '2024-07-27', amount: 200.00, status: 'Completed' },
  { id: '4', customer: 'Alice Brown', date: '2024-07-27', amount: 75.25, status: 'Cancelled' },
  { id: '5', customer: 'Mike Davis', date: '2024-07-26', amount: 300.00, status: 'Completed' },
];


export const AdminDashboardLayout = () => {
  const [salesData, setSalesData] = useState(generateSalesData());
  const [topProducts, setTopProducts] = useState(generateTopProducts());
  const [customerData, setCustomerData] = useState(generateCustomerData());
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme colors
  const primaryColor = 'hsl(262.1 83.3% 57.8%)'; // Vibrant purple
  const primaryLighter = 'hsl(262.1 83.3% 65%)';
  const primaryDarker = 'hsl(262.1 83.3% 40%)';
  const accentColor = 'hsl(166.3 85% 42.4%)'; // Teal
  const accentLighter = 'hsl(166.3 85% 50%)';
  const accentDarker = 'hsl(166.3 85% 30%)';
  const cardBgColor = 'hsl(0 0% 98%)'; // Very light gray
  const textColor = 'hsl(213 13.1% 21.6%)'; // Very dark blue

  // Dark mode colors
  const dark = {
    background: 'hsl(218.9 29.6% 11.8%)', // Very dark blue
    card: 'hsl(217.2 32.6% 17.5%)', // Slightly lighter card background
    text: 'hsl(0 0% 95%)', // Very light gray text
    border: 'hsl(215 20.2% 36.3%)',
  };

  // Rechart colors (for pie chart, can be passed down)
  const pieChartColors = [primaryColor, accentColor, '#8884d8', '#82ca9d', '#ffc658'];

  useEffect(() => {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setSalesData(generateSalesData());
      setTopProducts(generateTopProducts());
      setCustomerData(generateCustomerData());
      setLoading(false);
      toast.success('Dashboard data refreshed!', {
        style: {
          backgroundColor: isDarkMode ? dark.card : cardBgColor,
          color: isDarkMode ? dark.text : textColor,
        },
      });
    }, 1500);
  };

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div
      className="p-6 md:p-8"
      style={{
        backgroundColor: isDarkMode ? dark.background : 'hsl(0, 0%, 100%)',
        minHeight: '100vh',
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold"
          style={{ color: isDarkMode ? dark.text : textColor }}
        >
          Dashboard
        </h1>
        <Button
          onClick={refreshData}
          className={cn(
            'bg-gradient-to-r text-white',
            loading
              ? 'from-gray-400 to-gray-500 cursor-not-allowed'
              : `from-[<span class="math-inline">\{primaryColor\}\] to\-\[</span>{primaryDarker}] hover:from-[<span class="math-inline">\{primaryLighter\}\] hover\:to\-\[</span>{primaryColor}]`,
            'transition-all duration-300 shadow-lg hover:shadow-xl',
            'px-6 py-3 rounded-full flex items-center gap-2',
            'font-semibold'
          )}
          disabled={loading}
          // Adjust inline style for dynamic Tailwind class for bg-gradient
          style={{
            background: loading ? 'linear-gradient(to right, gray, gray)' : `linear-gradient(to right, ${primaryColor}, ${primaryDarker})`,
            color: 'white', // Ensure text color is white
          }}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Loading...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </div>

      <AnimatePresence>
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={cardVariants}
          className="space-y-8" // Add space between sections
        >
          <OverviewCards
            isDarkMode={isDarkMode}
            primaryColor={primaryColor}
            accentColor={accentColor}
            darkCardColor={dark.card}
            darkTextColor={dark.text}
            lightCardColor={cardBgColor}
            lightTextColor={textColor}
            currencyFormatter={currencyFormatter}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart
              salesData={salesData}
              isDarkMode={isDarkMode}
              primaryColor={primaryColor}
              accentColor={accentColor}
              darkCardColor={dark.card}
              darkTextColor={dark.text}
              lightCardColor={cardBgColor}
              lightTextColor={textColor}
              currencyFormatter={currencyFormatter}
            />
            <TopSellingProductsChart
              topProducts={topProducts}
              isDarkMode={isDarkMode}
              primaryColor={primaryColor}
              darkCardColor={dark.card}
              darkTextColor={dark.text}
              lightCardColor={cardBgColor}
              lightTextColor={textColor}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <CustomerDemographicsChart
              customerData={customerData}
              isDarkMode={isDarkMode}
              pieChartColors={pieChartColors}
              darkCardColor={dark.card}
              darkTextColor={dark.text}
              lightCardColor={cardBgColor}
              lightTextColor={textColor}
            />
            {/* Integrate the OTP Request Panel here */}
            <OtpRequestPanel
                isDarkMode={isDarkMode}
                darkCardColor={dark.card}
                darkTextColor={dark.text}
                lightCardColor={cardBgColor}
                lightTextColor={textColor}
                primaryColor={primaryColor}
            />
          </div>

          <RecentTransactionsTable
            transactions={recentTransactions}
            isDarkMode={isDarkMode}
            darkCardColor={dark.card}
            darkTextColor={dark.text}
            lightCardColor={cardBgColor}
            lightTextColor={textColor}
            currencyFormatter={currencyFormatter}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};