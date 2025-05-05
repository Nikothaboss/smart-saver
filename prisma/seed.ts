import db from "@/lib/db/db";
const prisma = db;

async function main() {
  // Create or update the user
  const user = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {
      name: "Alice",
      image: "https://example.com/avatar.png",
      emailVerified: new Date(),
    },
    create: {
      name: "Alice",
      email: "alice@example.com",
      emailVerified: new Date(),
      image: "https://example.com/avatar.png",
    },
  });

  // Create BankAccount 1 with transactions
  await prisma.bankAccount.create({
    data: {
      accountNumber: "********1234",
      accountType: "Checking",
      balance: 15000.25,
      currency: "NOK",
      userId: user.id,
      transactions: {
        create: [
          {
            date: new Date("2023-08-15T00:00:00.000Z"),
            description: "Grocery Store",
            amount: -75.5,
            currency: "NOK",
            userId: user.id,
          },
          {
            date: new Date("2023-08-16T00:00:00.000Z"),
            description: "Salary",
            amount: 30000,
            currency: "NOK",
            userId: user.id,
          },
        ],
      },
    },
  });

  // Create BankAccount 2 with one transaction
  await prisma.bankAccount.create({
    data: {
      accountNumber: "********5678",
      accountType: "Savings",
      balance: 5000.0,
      currency: "NOK",
      userId: user.id,
      transactions: {
        create: [
          {
            date: new Date("2023-08-17T00:00:00.000Z"),
            description: "Transfer from Checking",
            amount: 5000.0,
            currency: "NOK",
            userId: user.id,
          },
        ],
      },
    },
  });

  // Create a Goal
  await prisma.goal.create({
    data: {
      title: "Vacation Fund",
      targetAmount: 20000,
      currentAmount: 5000,
      userId: user.id,
    },
  });

  // Create a Reward
  await prisma.reward.create({
    data: {
      title: "Savings Streak Badge",
      unlocked: true,
      userId: user.id,
    },
  });

  console.log(`✅ Seeded user ${user.name} with email ${user.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
