"use client";

import type { Transaction } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  ShoppingBag,
  Home,
  Car,
  Utensils,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

export default function RecentTransactions({
  transactions,
}: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(date));
  };

  // Get icon based on transaction description
  const getTransactionIcon = (description: string, amount: number) => {
    const desc = description.toLowerCase();
    if (desc.includes("coffee") || desc.includes("cafe")) return Coffee;
    if (desc.includes("grocery") || desc.includes("store")) return ShoppingBag;
    if (desc.includes("rent") || desc.includes("mortgage")) return Home;
    if (desc.includes("transport") || desc.includes("gas")) return Car;
    if (desc.includes("restaurant") || desc.includes("food")) return Utensils;
    return amount > 0 ? ArrowUpRight : ArrowDownLeft;
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your latest financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Wallet className="h-12 w-12 text-muted-foreground mb-2 stroke-amber-800 " />
            <h3 className="text-lg font-medium">No recent transactions</h3>
            <p className="text-sm text-muted-foreground">
              Thats some saving right there!
            </p>
          </div>
        ) : (
          transactions.map((transaction) => {
            const amount = transaction.amount;
            const Icon = getTransactionIcon(transaction.description, amount);
            const desc = transaction.description.toLowerCase();

            return (
              <div key={transaction.id} className="flex items-center gap-4">
                <div
                  className={cn(
                    "p-2 rounded-full",
                    amount > 0
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                      : desc.includes("coffee") || desc.includes("cafe")
                      ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                      : desc.includes("grocery") || desc.includes("store")
                      ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-white"
                      : desc.includes("rent") || desc.includes("mortgage")
                      ? "bg-gradient-to-r from-purple-400 to-indigo-500 text-white"
                      : desc.includes("transport") || desc.includes("gas")
                      ? "bg-gradient-to-r from-teal-400 to-green-500 text-white"
                      : desc.includes("restaurant") || desc.includes("food")
                      ? "bg-gradient-to-r from-rose-400 to-pink-500 text-white"
                      : "bg-gradient-to-r from-red-400 to-rose-500 text-white"
                  )}
                >
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)}
                  </p>
                </div>
                <div
                  className={cn(
                    "text-sm font-medium",
                    amount > 0 ? "text-green-600" : "text-red-600"
                  )}
                >
                  {amount > 0 ? "+" : ""}
                  {formatCurrency(amount)}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
