Migrate to Prisma + NextAuth + Zod

Summary:
- Migrate data layer to Prisma (SQLite for development)
- Add NextAuth credentials provider with Prisma adapter
- Add Zod validation for key auth and session endpoints
- Remove legacy MySQL scripts and db helpers
- Add Prisma seed and `db:setup` script

Tests performed:
- Ran `npm run db:setup` (Prisma generate + db push + seed)
- Smoke-tested `/api/test` and several auth/session endpoints

Notes:
- Development DB: SQLite (`prisma/dev.db`). Production planned for Postgres.
