// src/app/(admin)/admin/dashboard/_components/OverviewCards.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Wallet, ShoppingCart, Users, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface OverviewCardProps {
  title: string;
  description: string;
  value: string;
  changeText: string;
  changeType: 'increase' | 'decrease';
  icon: React.ElementType;
  iconColor: string;
  isDarkMode: boolean;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
  title,
  description,
  value,
  changeText,
  changeType,
  icon: Icon,
  iconColor,
  isDarkMode,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
}) => {
  const textColor = isDarkMode ? darkTextColor : lightTextColor;
  const cardBg = isDarkMode ? darkCardColor : lightCardColor;

  return (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{
        backgroundColor: cardBg,
        borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'transparent',
      }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: textColor }}>
          <Icon className="w-6 h-6" style={{ color: iconColor }} />
          {title}
        </CardTitle>
        <CardDescription style={{ color: textColor }}>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-bold" style={{ color: iconColor }}>
          {value}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {changeType === 'increase' ? (
            <ArrowUpRight className="w-4 h-4 text-green-500" />
          ) : (
            <ArrowDownRight className="w-4 h-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${changeType === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {changeText}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

interface OverviewCardsProps {
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
  currencyFormatter: Intl.NumberFormat;
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  isDarkMode,
  primaryColor,
  accentColor,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
  currencyFormatter,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <OverviewCard
        title="Total Revenue"
        description="All time revenue"
        value={currencyFormatter.format(58750)}
        changeText="+20.1% from last month"
        changeType="increase"
        icon={Wallet}
        iconColor={primaryColor}
        isDarkMode={isDarkMode}
        darkCardColor={darkCardColor}
        darkTextColor={darkTextColor}
        lightCardColor={lightCardColor}
        lightTextColor={lightTextColor}
      />
      <OverviewCard
        title="Total Sales"
        description="Total number of sales"
        value="2540"
        changeText="-5.2% from last month"
        changeType="decrease"
        icon={ShoppingCart}
        iconColor={accentColor}
        isDarkMode={isDarkMode}
        darkCardColor={darkCardColor}
        darkTextColor={darkTextColor}
        lightCardColor={lightCardColor}
        lightTextColor={lightTextColor}
      />
      <OverviewCard
        title="Total Customers"
        description="Number of unique customers"
        value="1250"
        changeText="+8.7% from last month"
        changeType="increase"
        icon={Users}
        iconColor={primaryColor}
        isDarkMode={isDarkMode}
        darkCardColor={darkCardColor}
        darkTextColor={darkTextColor}
        lightCardColor={lightCardColor}
        lightTextColor={lightTextColor}
      />
      <OverviewCard
        title="Total Products"
        description="Number of products"
        value="58"
        changeText="+2.3% from last month"
        changeType="increase"
        icon={Package}
        iconColor={accentColor}
        isDarkMode={isDarkMode}
        darkCardColor={darkCardColor}
        darkTextColor={darkTextColor}
        lightCardColor={lightCardColor}
        lightTextColor={lightTextColor}
      />
    </div>
  );
};