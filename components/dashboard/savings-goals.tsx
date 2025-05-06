"use client";

import type { Goal } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Trophy } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface SavingsGoalsProps {
  goals: Goal[];
}

export default function SavingsGoals({ goals }: SavingsGoalsProps) {
  const [open, setOpen] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalAmount, setNewGoalAmount] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h3 className="text-lg font-medium">Please log in to view goals</h3>
        <p className="text-sm text-muted-foreground">
          Log in to your account to manage your savings goals.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("no-NO", {
      style: "currency",
      currency: "NOK",
    }).format(amount);
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const handleAddGoal = async () => {
    try {
      const userId = session.user.id;
      console.log("User ID", userId);

      const response = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newGoalTitle,
          targetAmount: Number.parseFloat(newGoalAmount),
          userId, // ✅ required by your schema
        }),
      });

      if (response.ok) {
        toast("Goal created successfully!", {});
        setOpen(false);
        setNewGoalTitle("");
        setNewGoalAmount("");
        router.refresh();
      } else {
        const error = await response.json();
        toast(error?.message || "Failed to create goal. Please try again.");
      }
    } catch (error) {
      toast("An unexpected error occurred.");
    }
  };

  const handleContribute = async (goalId: string, amount: number) => {
    try {
      const response = await fetch(`/api/goals/${goalId}/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (response.ok) {
        const goal = goals.find((g) => g.id === goalId);
        const newAmount = (goal?.currentAmount || 0) + amount;
        const progress = calculateProgress(newAmount, goal?.targetAmount || 1);

        // Trigger confetti if progress is 100%
        if (progress === 100) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        toast("Contribution added successfully!");
        router.refresh();
      } else {
        toast("Failed to add contribution. Please try again.");
      }
    } catch (error) {
      toast("An unexpected error occurred.");
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl">Savings Goals</CardTitle>
          <CardDescription>
            Track your progress towards financial goals
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Goal</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Savings Goal</DialogTitle>
              <DialogDescription>
                Set a new financial goal to work towards. Make it specific and
                achievable!
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="goal-title">Goal Title</Label>
                <Input
                  id="goal-title"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  placeholder="e.g., New Laptop, Vacation, Emergency Fund"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal-amount">Target Amount (NOK)</Label>
                <Input
                  id="goal-amount"
                  type="number"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  placeholder="10000"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddGoal}>Create Goal</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-2  stroke-amber-300" />
            <h3 className="text-lg font-medium">No goals yet</h3>
            <p className="text-sm text-muted-foreground">
              Create your first savings goal to start tracking your progress!
            </p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(
              goal.currentAmount,
              goal.targetAmount
            );
            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} of{" "}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">{progress}%</span>
                    {progress === 100 && (
                      <Trophy className="h-4 w-4 text-yellow-500 inline ml-1" />
                    )}
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex justify-end gap-2 mt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleContribute(goal.id, 500)}
                  >
                    +500 kr
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleContribute(goal.id, 1000)}
                  >
                    +1000 kr
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
