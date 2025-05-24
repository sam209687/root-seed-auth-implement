// src/app/(admin)/admin/dashboard/_components/CustomerDemographicsChart.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface CustomerData {
  gender: string;
  count: number;
}

interface CustomerDemographicsChartProps {
  customerData: CustomerData[];
  isDarkMode: boolean;
  pieChartColors: string[];
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
}

export const CustomerDemographicsChart: React.FC<CustomerDemographicsChartProps> = ({
  customerData,
  isDarkMode,
  pieChartColors,
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
      style={{ backgroundColor: cardBg, borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'transparent' }}
    >
      <CardHeader>
        <CardTitle style={{ color: textColor }}>Customer Demographics</CardTitle>
        <CardDescription style={{ color: textColor }}>Gender distribution of customers</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={customerData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={120}
              fill={pieChartColors[0]} // Default fill, cells override
              dataKey="count"
              label={({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = 25 + innerRadius + (outerRadius - innerRadius);
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill={textColor}
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                    {customerData[index].gender} ({value})
                  </text>
                );
              }}
            >
              {customerData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: cardBg, borderColor: 'transparent', color: textColor }}
              labelStyle={{ color: textColor }}
              itemStyle={{ color: textColor }}
              formatter={(value: number, name: string, props: any) => [`${value}`, props.payload.gender]}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};