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
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No recent transactions
            </p>
          ) : (
            transactions.map((transaction) => {
              const amount = transaction.amount;
              const Icon = getTransactionIcon(transaction.description, amount);

              return (
                <div key={transaction.id} className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      amount > 0 ? "bg-green-100" : "bg-red-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        amount > 0 ? "text-green-500" : "text-red-500"
                      )}
                    />
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
        </div>
      </CardContent>
    </Card>
  );
}
