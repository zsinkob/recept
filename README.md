# Recept (monorepo)

Monorepo for the Recept recipe app.

Quick start:

Install dependencies (pnpm required):

```bash
pnpm install
pnpm run db:up
# then in separate terminals
pnpm --filter apps/api dev
pnpm --filter apps/web dev
```

Database: Postgres via docker-compose on port 5432.
