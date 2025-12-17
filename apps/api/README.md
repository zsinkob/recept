API app instructions

Install dependencies (from repo root):

```bash
pnpm install --filter @recept/api...
```

Generate Prisma client and run migrations:

```bash
cd apps/api
pnpm prisma:generate
pnpm prisma:migrate
pnpm run dev
```

API will run on port 3000 by default.
