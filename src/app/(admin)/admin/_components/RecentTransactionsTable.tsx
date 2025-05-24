// src/app/(admin)/admin/dashboard/_components/RecentTransactionsTable.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/table';

interface Transaction {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

interface RecentTransactionsTableProps {
  transactions: Transaction[];
  isDarkMode: boolean;
  darkCardColor: string;
  darkTextColor: string;
  lightCardColor: string;
  lightTextColor: string;
  currencyFormatter: Intl.NumberFormat;
}

export const RecentTransactionsTable: React.FC<RecentTransactionsTableProps> = ({
  transactions,
  isDarkMode,
  darkCardColor,
  darkTextColor,
  lightCardColor,
  lightTextColor,
  currencyFormatter,
}) => {
  const textColor = isDarkMode ? darkTextColor : lightTextColor;
  const cardBg = isDarkMode ? darkCardColor : lightCardColor;
  const tableHeaderBg = isDarkMode ? 'hsl(217.2 32.6% 15%)' : 'hsl(0 0% 95%)'; // Slightly darker for dark mode header

  return (
    <Card
      className="col-span-1 lg:col-span-2 shadow-lg transition-all duration-300 hover:shadow-xl"
      style={{ backgroundColor: cardBg, borderColor: isDarkMode ? 'hsl(215 20.2% 36.3%)' : 'transparent' }}
    >
      <CardHeader>
        <CardTitle style={{ color: textColor }}>Recent Transactions</CardTitle>
        <CardDescription style={{ color: textColor }}>Latest sales activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader style={{ backgroundColor: tableHeaderBg }}>
              <TableRow>
                <TableHead style={{ color: textColor }}>ID</TableHead>
                <TableHead style={{ color: textColor }}>Customer</TableHead>
                <TableHead style={{ color: textColor }}>Date</TableHead>
                <TableHead style={{ color: textColor }} className="text-right">Amount</TableHead>
                <TableHead style={{ color: textColor }} className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell style={{ color: textColor }}>{transaction.id}</TableCell>
                  <TableCell style={{ color: textColor }}>{transaction.customer}</TableCell>
                  <TableCell style={{ color: textColor }}>{transaction.date}</TableCell>
                  <TableCell style={{ color: textColor }} className="text-right">
                    {currencyFormatter.format(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        transaction.status === 'Completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : transaction.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};