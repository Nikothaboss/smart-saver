"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

interface SpendingData {
  name: string;
  value: number;
}

interface SpendingAnalysisProps {
  spendingData: SpendingData[];
}

export default function SpendingAnalysis({
  spendingData,
}: SpendingAnalysisProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const COLORS = [
    "#4F46E5", // indigo-600
    "#0EA5E9", // sky-500
    "#10B981", // emerald-500
    "#F59E0B", // amber-500
    "#EC4899", // pink-500
    "#8B5CF6", // violet-500
    "#EF4444", // red-500
    "#14B8A6", // teal-500
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
    }).format(amount);
  };

  const onPieEnter = (_: unknown, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="col-span-1 border-0 shadow-md overflow-hidden">
      <CardHeader className="relative z-10">
        <CardTitle>Spending Analysis</CardTitle>
        <CardDescription>Where your money is going this month</CardDescription>
      </CardHeader>
      <CardContent>
        {spendingData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No spending data available</p>
          </div>
        ) : (
          <div className="h-64">
            <ChartContainer
              config={{
                spending: {
                  label: "Spending",
                  color: "hsl(var(--chart-1))",
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {spendingData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        stroke={activeIndex === index ? "#fff" : "transparent"}
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                Total Spending: {formatCurrency(totalSpending)}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {spendingData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-xs">
                      {item.name}: {formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
