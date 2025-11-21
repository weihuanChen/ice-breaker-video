# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and API routes (`app/api`), including video, shorts, and tag views.
- `components/`: Reusable UI blocks; files use kebab-case while exported components stay PascalCase.
- `lib/`: Data access and types. `lib/drizzle.ts` holds the Postgres client plus table definitions; `lib/queries/` contains query helpers.
- `public/`: Static assets (icons, manifests, images). Update here for branding.
- `docs/`: Internal notes on data and performance. Add performance experiments or schema notes here.
- Root configs: `tailwind.config.js`, `postcss.config.js`, `next.config.js`, and `tsconfig.json` shape styling, bundling, and path aliases (`@/` to project root).

## Build, Test, and Development Commands
- `pnpm dev`: Start the dev server with hot reload.
- `pnpm build`: Create an optimized production build.
- `pnpm start`: Serve the built app locally.
- `pnpm lint`: Run Next/ESLint with TypeScript checks; fix warnings before opening a PR.
- Environment: `.env.development` is auto-loaded (see README). Set `POSTGRES_URL` and related Postgres creds before any data-dependent work.

## Coding Style & Naming Conventions
- TypeScript across the app; 2-space indentation; prefer async/await and small, pure helpers.
- Components and hooks in PascalCase (`VideoCard`, `useTags`); route files and utilities in kebab-case (`load-more-videos.tsx`, `tag-filter.tsx`).
- Use the `@/` alias for imports and keep server components/data fetching in `app/` while isolating pure logic in `lib/`.
- Tailwind for styling; group utilities logically and lean on `class-variance-authority`/`tailwind-merge` to manage variants.

## Testing Guidelines
- No automated test suite currently. At minimum, run `pnpm lint`.
- When adding logic-heavy code, add unit/integration tests using your preferred runner (e.g., Vitest/Jest + RTL) with `*.test.ts(x)` near the source.
- For database behavior, test against a disposable Postgres instance or mocked layer; document fixtures in `docs/` if they are reused.

## Commit & Pull Request Guidelines
- Git history uses conventional prefixes (`feat:`, `fix:`). Follow that pattern with a concise, imperative summary (e.g., `feat: add tag search filters`).
- PRs should include: what changed and why, how to run/verify, screenshots for UI updates, and callouts for schema or env var changes. Mention if data migrations touch `lib/drizzle.ts`.

## Security & Configuration Tips
- Keep secrets out of the repo; `.env*` files are ignored. Rotate credentials if shared.
- Postgres is required for most pages. Prefer pooled URLs in `.env.production`/deployment settings, and avoid committing generated data dumps.
