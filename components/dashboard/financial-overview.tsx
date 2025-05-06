"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

interface FinancialOverviewProps {
  totalBalance: number;
  totalSavings: number;
  totalSpending: number;
}

export default function FinancialOverview({
  totalBalance,
  totalSavings,
  totalSpending,
}: FinancialOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
    }).format(amount);
  };

  return (
    <Card className="col-span-1 md:col-span-3">
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>Your financial summary for this month</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Balance
                    </p>
                    <Wallet className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                    {formatCurrency(totalBalance)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all accounts
                  </p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Savings
                    </p>
                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(totalSavings)}
                  </div>
                  <p className="text-xs text-green-500">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-0 shadow-md">
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between space-y-0 pb-2">
                    <p className="text-sm font-medium leading-none text-muted-foreground">
                      Total Spending
                    </p>
                    <ArrowDownRight className="h-4 w-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-rose-700 dark:text-rose-400">
                    {formatCurrency(totalSpending)}
                  </div>
                  <p className="text-xs text-rose-500">-5% from last month</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="income">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Income details will be shown here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expenses">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  Expense details will be shown here
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
