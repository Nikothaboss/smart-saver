# 🧠 Smart Saver – Developer Setup Guide

Welcome to **Smart Saver** – a budgeting and savings app built with **Next.js**, **Prisma**, **PostgreSQL**, and full test coverage.

This guide covers everything you need to get started with development, including database setup, Prisma tools, test runners, and authentication setup.

---

## 🎟️ Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL via Docker
- **ORM**: Prisma
- **UI**: shadcn/ui (optional polish)
- **Testing**: Vitest (with UI mode)
- **Package Manager**: pnpm
- **Auth**: GitHub OAuth via NextAuth.js

---

### 🌐 Hosted Version

A hosted version of the application is available at:
[Smart Saver - Hosted Version](https://smart-saver-three.vercel.app/)

---

## 🚀 Getting Started

### 1. Clone the repo and install dependencies

```bash
pnpm install
```

Or run the full dev bootstrap script:

```bash
pnpm bootstrap
```

This will:

- Start Docker containers
- Install dependencies
- Reset and migrate the database
- Seed sample data
- Start the Next.js dev server

### 2. Start the Database (Docker)

```bash
docker compose up -d
```

This starts a container running Postgres on port `5432` with the default user `postgres:postgres`.

### 3. Set up your environment

Create a `.env` file in the root with your database and GitHub credentials:

```ini
# PostgreSQL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/smart_saver"

# GitHub OAuth - Required for login
GITHUB_ID="<your-github-client-id>"
GITHUB_SECRET="<your-github-client-secret>"

# NextAuth config
NEXTAUTH_SECRET="<generated-secret>" # generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

> ⚠️ You'll need to [register a GitHub OAuth app](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app) and set the redirect URL to `http://localhost:3000/api/auth/callback/github`

### 4. Run migrations and generate Prisma Client

```bash
pnpm migrate
```

Or run individually:

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Seed the database

```bash
pnpm seed
```

Make sure your Postgres container is running before seeding.

---

## 🔐 Authentication

Smart Saver uses [NextAuth.js](https://next-auth.js.org/) for authentication with GitHub as a provider.

### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new **OAuth App**:
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization Callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and **Client Secret** to your `.env` file:

```ini
GITHUB_ID=your-client-id
GITHUB_SECRET=your-client-secret
```

### Accessing the user session in API routes

To get the authenticated user in backend logic or API routes:

```ts
import { auth } from "@/lib/auth";
const session = await auth();

if (!session?.user?.email) {
  return new Response("Unauthorized", { status: 401 });
}
```

Use the session data to access the user email or ID and scope access accordingly.

---

### 📘 Swagger API Docs

Interactive API documentation is available at [`/swagger`](http://localhost:3000/docs) and the raw OpenAPI spec can be accessed at [`/api/docs`](http://localhost:3000/api/docs).

The docs are automatically generated from JSDoc comments within the API route files.

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

Test coverage includes:

- Service logic for goals, rewards, transactions
- All HTTP endpoints used by the frontend
- Auth-protected API routes

---

## 🛠 Dev Tools

### Open Prisma Studio

```bash
pnpm studio
```

Studio will open at [http://localhost:5555](http://localhost:5555)

---

## ✅ Project Structure

```bash
smart-saver/
├── app/                   # Next.js App
│   ├── page.tsx (root)    # Login page
│   ├── dashboard/         # Authenticated user dashboard
│   ├── swagger/           # Swagger docs
│   └── api/               # API route handlers
├── lib/
│   ├── prisma.ts          # Shared Prisma client
│   ├── auth.ts            # NextAuth config and callbacks
│   └── services/          # Business logic by model
├── prisma/
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.ts            # DB seed script
├── tests/                 # Vitest unit/integration tests
│   ├── services/
│   └── api/
├── scripts/
│   └── dev-bootstrap.sh   # Bootstrap script
├── .env                   # DB and auth config
└── README.md              # This file
```

---
