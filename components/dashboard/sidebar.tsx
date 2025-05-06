"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PiggyBank,
  BarChart3,
  CreditCard,
  Settings,
  Trophy,
  HelpCircle,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Savings",
    href: "/dashboard/savings",
    icon: PiggyBank,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: CreditCard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Rewards",
    href: "/dashboard/rewards",
    icon: Trophy,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          SaveSmart
        </h2>
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                pathname === item.href
                  ? "bg-gradient-to-r from-violet-500/20 to-indigo-500/20 text-violet-700 dark:text-violet-300 font-medium"
                  : "text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
              )}
            >
              <item.icon
                className={cn(
                  "h-4 w-4",
                  pathname === item.href
                    ? "text-violet-600 dark:text-violet-400"
                    : "text-muted-foreground"
                )}
              />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 mt-auto">
        <div className="space-y-1">
          <Link
            href="/dashboard/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Support
          </Link>
        </div>
      </div>
    </div>
  );
}
