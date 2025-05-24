// src/app/(admin)/admin/dashboard/_components/SalesOverviewChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SalesData {
  month: string;
  sales: number;
  revenue: number;
}

interface SalesOverviewChartProps {
  salesData: SalesData[];
  isDarkMode: boolean;
  primaryColor: string;
  accentColor: string;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
  currencyFormatter: Intl.NumberFormat;
}

export const SalesOverviewChart: React.FC<SalesOverviewChartProps> = ({
  salesData,
  isDarkMode,
  primaryColor,
  accentColor,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
  currencyFormatter,
}) => {
  const textColor = isDarkMode ? darkTextColor : lightTextColor;
  const cardBg = isDarkMode ? darkCardColor : lightCardColor;
  const gridStroke = isDarkMode ? 'hsl(0, 0%, 20%)' : 'hsl(0, 0%, 90%)';

  return (
    <Card
      className="shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: cardBg, borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'transparent' }}
    >
      <CardHeader>
        <CardTitle style={{ color: textColor }}>Sales Overview</CardTitle>
        <CardDescription style={{ color: textColor }}>Monthly sales and revenue</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="month" tick={{ fill: textColor }} tickLine={false} />
            <YAxis
              tick={{ fill: textColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => currencyFormatter.format(value)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: cardBg, borderColor: 'transparent', color: textColor }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
              formatter={(value: number) => currencyFormatter.format(value)}
            />
            <Legend
              wrapperStyle={{ color: textColor }}
              formatter={(value: string) => <span style={{ color: textColor }}>{value}</span>}
            />
            <Bar dataKey="sales" fill={primaryColor} name="Sales" />
            <Bar dataKey="revenue" fill={accentColor} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};