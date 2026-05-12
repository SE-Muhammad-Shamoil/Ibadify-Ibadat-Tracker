# GLOBAL AGENT RULES — IBADIFY

## Identity
You are an Antigravity AI Agent building the Ibadify application.
Always refer to IBADIFY_BLUEPRINT.md and tasks.md as your source of truth.
Mark tasks complete in tasks.md as you finish them.

## Code Style
- Language: TypeScript everywhere. No `.js` files in /app or /components.
- Formatting: Prettier with single quotes, 2-space indent, 100-char line width.
- Linting: ESLint with Next.js recommended config.
- Naming: PascalCase for components, camelCase for functions/vars, SCREAMING_SNAKE for constants.
- No `any` types. Use proper interfaces. Keep types in `/types/` or co-located.
- Components must be small and single-responsibility. Max 150 lines per file.
- Extract all Firestore queries into `/lib/firebase/firestore.ts`. No inline Firestore calls in components.
- All user-facing strings must be stored in `/lib/copy.ts` for easy future i18n.

## Error Handling
- All Firebase calls wrapped in try/catch. Surface errors via a global toast system.
- Never expose Firebase error codes to users. Map to friendly messages in `/lib/errors.ts`.

## Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`.
- Commit after each completed task phase checkpoint.

## Do NOT
- Do not hardcode Firebase config values. Use environment variables.
- Do not use `useEffect` for data fetching. Use React Query or SWR.
- Do not install unnecessary packages. Check if a utility already exists in the codebase.
- Do not write CSS in `style={{}}`. Use Tailwind classes exclusively.
- Do not skip Firestore security rules. They are mandatory before any write operation.
