import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "Alice",
      email: "alice@example.com",
      accounts: {
        create: [
          {
            accountNumber: "********1234",
            accountType: "Checking",
            balance: 15000.25,
            currency: "NOK",
            transactions: {
              create: [
                {
                  date: new Date("2023-08-15"),
                  description: "Grocery Store",
                  amount: -75.5,
                  currency: "NOK",
                },
                {
                  date: new Date("2023-08-16"),
                  description: "Salary",
                  amount: 30000,
                  currency: "NOK",
                },
              ],
            },
          },
          {
            accountNumber: "********5678",
            accountType: "Savings",
            balance: 5000.0,
            currency: "NOK",
            transactions: {
              create: [
                {
                  date: new Date("2023-08-17"),
                  description: "Transfer from Checking",
                  amount: 5000.0,
                  currency: "NOK",
                },
              ],
            },
          },
        ],
      },
      goals: {
        create: {
          title: "Vacation Fund",
          targetAmount: 20000,
          currentAmount: 5000,
        },
      },
      rewards: {
        create: {
          title: "Savings Streak Badge",
          unlocked: true,
        },
      },
    },
  });

  console.log(`Seeded user ${user.name} with email ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
