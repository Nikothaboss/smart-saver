"use client";

import type { Reward } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Target, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardsSectionProps {
  rewards: Reward[];
}

export default function RewardsSection({ rewards }: RewardsSectionProps) {
  // Define some default rewards if none exist
  const defaultRewards = [
    { id: "1", title: "First Savings Goal", unlocked: false, icon: Target },
    { id: "2", title: "Save 5,000 NOK", unlocked: false, icon: TrendingUp },
    { id: "3", title: "Complete Profile", unlocked: true, icon: Star },
    { id: "4", title: "7-Day Streak", unlocked: false, icon: Zap },
    { id: "5", title: "Budget Master", unlocked: false, icon: Trophy },
  ];

  // Combine default rewards with actual rewards
  const allRewards =
    rewards.length > 0
      ? rewards.map((r) => ({
          ...r,
          icon: r.title.includes("Goal")
            ? Target
            : r.title.includes("Save")
            ? TrendingUp
            : r.title.includes("Profile")
            ? Star
            : r.title.includes("Streak")
            ? Zap
            : Trophy,
        }))
      : defaultRewards;

  // Calculate progress
  const unlockedCount = allRewards.filter((r) => r.unlocked).length;
  const totalCount = allRewards.length;
  const progress = Math.round((unlockedCount / totalCount) * 100);

  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Rewards & Achievements</CardTitle>
            <CardDescription>Your financial journey milestones</CardDescription>
          </div>
          <div className="bg-primary/10 text-primary font-medium rounded-full px-3 py-1 text-sm">
            Level {Math.floor(progress / 20) + 1}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            {unlockedCount} of {totalCount} achievements unlocked ({progress}%)
          </p>

          <div className="grid grid-cols-1 gap-3 mt-2">
            {allRewards.map((reward) => {
              const Icon = reward.icon;

              return (
                <div
                  key={reward.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border transition-all",
                    reward.unlocked
                      ? "border-primary/30 bg-primary/5"
                      : "border-muted bg-muted/10 opacity-70"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-full",
                      reward.unlocked
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reward.title}</p>
                  </div>
                  <Badge variant={reward.unlocked ? "default" : "outline"}>
                    {reward.unlocked ? "Unlocked" : "Locked"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
