import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import FinancialOverview from "@/components/dashboard/financial-overview";
import SavingsGoals from "@/components/dashboard/savings-goals";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import RewardsSection from "@/components/dashboard/rewards-section";
import SpendingAnalysis from "@/components/dashboard/spending-analysis";
import db from "@/lib/db/db";

const prisma = db;

export default async function DashboardPage() {
  const session = await auth();

  // if (!session?.user?.email) {
  //   redirect("/");
  // }

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { email: "alice@example.com" },
    include: {
      bankAccounts: true,
      goals: true,
      rewards: true,
      transactions: {
        orderBy: { date: "desc" },
        take: 5,
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  // Calculate total balance across all accounts
  const totalBalance = user.bankAccounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  // Calculate total savings (sum of all goals' current amounts)
  const totalSavings = user.goals.reduce(
    (sum, goal) => sum + goal.currentAmount,
    0
  );

  // Calculate total spending (sum of negative transactions in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentTransactions = await prisma.transaction.findMany({
    where: {
      userId: user.id,
      date: { gte: thirtyDaysAgo },
      amount: { lt: 0 },
    },
  });

  const totalSpending = Math.abs(
    recentTransactions.reduce((sum, tx) => sum + tx.amount, 0)
  );

  // Get spending by category (using description as a simple proxy for category)
  const spendingByCategory = recentTransactions.reduce((acc, tx) => {
    // Simple categorization based on description keywords
    let category = "Other";
    if (tx.description.toLowerCase().includes("grocery"))
      category = "Groceries";
    else if (tx.description.toLowerCase().includes("restaurant"))
      category = "Dining";
    else if (tx.description.toLowerCase().includes("transport"))
      category = "Transport";
    else if (tx.description.toLowerCase().includes("entertainment"))
      category = "Entertainment";

    acc[category] = (acc[category] || 0) + Math.abs(tx.amount);
    return acc;
  }, {} as Record<string, number>);

  // Format for chart
  const spendingChartData = Object.entries(spendingByCategory).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader user={user} totalBalance={totalBalance} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <FinancialOverview
          totalBalance={totalBalance}
          totalSavings={totalSavings}
          totalSpending={totalSpending}
        />

        <SavingsGoals goals={user.goals} />

        <RecentTransactions transactions={user.transactions} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <SpendingAnalysis spendingData={spendingChartData} />
        <RewardsSection rewards={user.rewards} />
      </div>
    </div>
  );
}
