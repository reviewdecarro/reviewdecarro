# Repository Guidelines

## Project Structure & Module Organization
This is a Turborepo monorepo. The main workspaces are `apps/api` for the NestJS backend and `apps/web` for the Next.js frontend. Shared packages live under `packages/`, including `@repo/eslint-config`, `@repo/typescript-config`, and `@repo/ui`. Keep feature code inside the owning app or package; avoid cross-app imports unless they come from a shared package. App-specific guidance may exist in nested `AGENTS.md` files, such as `apps/web/AGENTS.md`.

## Build, Test, and Development Commands
Use the root scripts for repo-wide tasks:
- `pnpm dev` runs all app `dev` scripts through Turbo.
- `pnpm build` builds the full workspace graph.
- `pnpm lint` runs ESLint across the repo.
- `pnpm test` runs all test suites.
- `pnpm test:e2e` runs end-to-end tests.
- `pnpm format` formats `ts`, `tsx`, and `md` files with Prettier.

For focused work, use app-level commands, for example `pnpm --filter app lint`, `pnpm --filter app build`, or `pnpm --filter api test`.

## Coding Style & Naming Conventions
The codebase uses TypeScript, ESLint, and Prettier. Follow the existing style in each area: 2-space indentation in most files, double quotes in the web app, and camelCase for variables and functions. React components use PascalCase file names like `ReviewCard.tsx`. Prefer explicit imports, small modules, and colocated UI helpers.

## Testing Guidelines
Backend tests use Jest. Web validation is mostly linting and build checks unless a feature adds dedicated tests. Name tests by behavior and keep them close to the code they cover. Run the narrowest useful command first, then widen to the root scripts when changes cross app boundaries.

## Commit & Pull Request Guidelines
Recent commits use short conventional prefixes such as `chore:`, `fix(...)`, and `refactor(...)`. Keep commit messages imperative and scoped. Pull requests should describe the change, list the affected app or package, and include screenshots for UI work. Mention any commands you ran, especially `lint` and targeted `build` or `test` checks.

## Agent Notes
Do not overwrite unrelated local changes. Keep edits narrowly scoped to the requested area, and check for package-specific instructions before making changes in that subtree.
