// src/app/(admin)/admin/dashboard/_components/TopSellingProductsChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductData {
  name: string;
  sales: number;
}

interface TopSellingProductsChartProps {
  topProducts: ProductData[];
  isDarkMode: boolean;
  primaryColor: string;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
}

export const TopSellingProductsChart: React.FC<TopSellingProductsChartProps> = ({
  topProducts,
  isDarkMode,
  primaryColor,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
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
        <CardTitle style={{ color: textColor }}>Top Selling Products</CardTitle>
        <CardDescription style={{ color: textColor }}>Sales distribution of top products</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topProducts}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
            <XAxis dataKey="name" tick={{ fill: textColor }} tickLine={false} />
            <YAxis tick={{ fill: textColor }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: cardBg, borderColor: 'transparent', color: textColor }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
            />
            <Bar dataKey="sales" fill={primaryColor} name="Sales" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};