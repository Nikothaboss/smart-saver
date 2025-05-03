# 🧠 Smart Saver – Developer Setup Guide

Welcome to **Smart Saver** – a budgeting and savings app built with **Next.js**, **Prisma**, **PostgreSQL**, and full test coverage.

This guide covers everything you need to get started with development, including database setup, Prisma tools, and test runners.

---

## 🎟️ Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL via Docker
- **ORM**: Prisma
- **UI**: shadcn/ui (optional polish)
- **Testing**: Vitest (with UI mode)
- **Package Manager**: pnpm

---

## 🚀 Getting Started

### 1. Clone the repo and install dependencies

```bash
pnpm install
```

### 2. Start the Database (Docker)

We use Docker to run PostgreSQL locally:

```bash
docker-compose up -d
```

This starts a container running Postgres on port `5432` with the default user `postgres:postgres`.

### 3. Set up your environment

Create a `.env` file in the root:

```ini
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_saver"
```

### 4. Apply schema and generate Prisma Client

Run initial Prisma migration:

```bash
pnpm dlx prisma migrate dev --name init
```

Or, to push the schema without generating a migration:

```bash
pnpm dlx prisma db push
```

Generate the Prisma client:

```bash
pnpm dlx prisma generate
```

### 5. Seed the database

Run the seed script to populate the DB with sample data:

```bash
pnpm seed
```

Make sure your Postgres container is running before seeding.

---

## 🍊 Testing

Run all tests (headless):

```bash
pnpm test
```

Launch Vitest UI mode:

```bash
pnpm test:ui
```

This opens a local browser where you can explore, filter, and debug tests interactively.

---

## 🛠 Dev Tools

### Open Prisma Studio

Launch Prisma Studio to browse your DB:

```bash
pnpm prisma-studio
```

Studio will open at [http://localhost:5555](http://localhost:5555)

---

## ✅ Project Structure

```bash
smart-saver/
├── app/             # Next.js App
│   └── api/         # API route handlers
├── lib/
│   ├── prisma.ts    # Shared Prisma client
│   └── services/    # Business logic by model
├── prisma/
│   ├── schema.prisma # Prisma schema definition
│   └── seed.ts      # DB seed script
├── tests/           # Vitest unit/integration tests
│   ├── services/
│   └── api/
├── .env             # DB connection string
└── README.md        # This file
```

---

## 📄 Scripts

Here's a reference to the available scripts in `package.json`:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "prisma-studio": "pnpm dlx prisma studio",
  "seed": "pnpm dlx prisma db seed",
  "whipe-and-reseed": "pnpm dlx prisma migrate reset",
  "test": "vitest",
  "test:ui": "vitest --ui"
}
```

---
