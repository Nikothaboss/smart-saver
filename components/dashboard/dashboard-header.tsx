"use client";

import type { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { Bell, Settings } from "lucide-react";

interface DashboardHeaderProps {
  user: User;
  totalBalance: number;
}

export default function DashboardHeader({
  user,
  totalBalance,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.image || ""} alt={user.name} />
          <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-muted-foreground">
            Let's check your financial health today
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white font-medium rounded-lg px-4 py-2 shadow-md">
          Total Balance:{" "}
          {new Intl.NumberFormat("no-NO", {
            style: "currency",
            currency: "NOK",
          }).format(totalBalance)}
        </div>
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => signOut()}>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
