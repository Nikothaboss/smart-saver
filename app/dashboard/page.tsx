import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">
          You are signed in as {session.user.email || session.user.name}
        </p>
        <Button asChild>
          <Link href="/api/auth/signout">Sign out</Link>
        </Button>
      </div>
    </div>
  );
}
