---
name: Postgres + Drizzle Next.js Starter
slug: postgres-drizzle
description: Simple Next.js template that uses a Postgres database and Drizzle as the ORM.
framework: Next.js
useCase: Starter
css: Tailwind
database: Postgres
deployUrl: https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-drizzle&project-name=postgres-drizzle&repository-name=postgres-drizzle&demo-title=Vercel%20Postgres%20%2B%20Drizzle%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%20and%20Drizzle%20as%20the%20ORM.&demo-url=https%3A%2F%2Fpostgres-drizzle.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-drizzle.vercel.app%2Fopengraph-image.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D
demoUrl: https://postgres-drizzle.vercel.app/
relatedTemplates:
  - postgres-starter
  - postgres-prisma
  - postgres-kysely
---

# Postgres + Drizzle Next.js Starter

Simple Next.js template that uses a Postgres database and [Drizzle](https://github.com/drizzle-team/drizzle-orm) as the ORM.

## Demo

https://postgres-drizzle.vercel.app/

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fexamples%2Ftree%2Fmain%2Fstorage%2Fpostgres-drizzle&project-name=postgres-drizzle&repository-name=postgres-drizzle&demo-title=Vercel%20Postgres%20%2B%20Drizzle%20Next.js%20Starter&demo-description=Simple%20Next.js%20template%20that%20uses%20Vercel%20Postgres%20as%20the%20database%20and%20Drizzle%20as%20the%20ORM.&demo-url=https%3A%2F%2Fpostgres-drizzle.vercel.app%2F&demo-image=https%3A%2F%2Fpostgres-drizzle.vercel.app%2Fopengraph-image.png&products=%5B%7B%22type%22%3A%22integration%22%2C%22group%22%3A%22postgres%22%7D%5D)

### Clone and Deploy

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [pnpm](https://pnpm.io/installation) to bootstrap the example:

```bash
pnpm create next-app --example https://github.com/vercel/examples/tree/main/storage/postgres-drizzle
```

Next, run Next.js in development mode:

```bash
pnpm dev
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples) ([Documentation](https://nextjs.org/docs/deployment)).

## Environment Configuration

### Development Environment (.env.development)

The application automatically loads environment variables from `.env.development` at startup. Create this file in the root directory with your development database credentials:

```env
POSTGRES_URL='postgresql://username:password@host/database?sslmode=require'
POSTGRES_URL_NON_POOLING=''
POSTGRES_USER='username'
POSTGRES_HOST='host'
POSTGRES_PASSWORD='password'
POSTGRES_DATABASE='database'
REVALIDATE_SECRET='your-dev-secret-key'
```

**Note:** The `.env.development` file is automatically loaded by `dotenv` configuration in `lib/drizzle.ts` when the application starts. This file is ignored by git for security purposes.
