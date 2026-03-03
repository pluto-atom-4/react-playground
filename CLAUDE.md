# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **React interview practice playground** for Opendoor full-stack engineer interviews. It's a Vite + React + TypeScript single-page application designed to practice frontend problems organized by feature.

## Setup & Commands

### Initial Setup

This project uses **pnpm** as the package manager. After initializing with Vite:

```bash
# Initial setup (one time)
pnpm create vite my-react-practice --template react-ts
cd my-react-practice

# Install dependencies
pnpm install

# Add recommended tooling
pnpm add -D prettier eslint-config-prettier eslint-plugin-prettier
pnpm add -D tailwindcss postcss autoprefixer
pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

### Development Commands

- **Start dev server**: `pnpm dev` (runs at `http://localhost:5173`)
- **Build for production**: `pnpm build`
- **Preview production build**: `pnpm preview`
- **Lint**: `pnpm lint` (configure ESLint after adding it)
- **Format code**: `pnpm format` (configure Prettier after adding it)

## Project Architecture

### Folder Structure

```
src/
├── assets/              # Images, fonts, icons (imported in code)
├── components/          # Shared UI components (Button, Card, Loader, etc.)
│   └── index.ts        # Barrel exports for clean imports
├── features/            # Problem-specific implementations (one folder per problem)
│   ├── todo/           # Todo List problem
│   ├── search/         # Debounced search problem
│   ├── infinite-scroll/# Infinite scroll problem
│   └── [more features]/
├── hooks/               # Global custom hooks (useFetch, useDebounce, etc.)
├── pages/               # Top-level route views (Home.tsx, Practice.tsx)
├── services/            # API utilities and fetch wrappers
├── types/               # Global TypeScript interfaces
├── utils/               # Pure utility functions (formatDate, debounce, etc.)
├── App.tsx              # Root component
├── main.tsx             # Entry point
└── index.css            # Global styles
```

### Key Architectural Patterns

- **Feature-based isolation**: Each interview problem lives in `src/features/[problem-name]/` with its own components, hooks, and types. This makes it easy to delete, add, or refactor individual problems.
- **Shared components**: Reusable UI components in `src/components/` (avoid duplication across features).
- **Custom hooks**: Problem-specific hooks (e.g., `useTodos`, `useDebounce`) live in feature folders; global hooks in `src/hooks/`.
- **Import aliases**: Use path aliases in `vite.config.ts` for cleaner imports:
  - `@/` → `src/`
  - `@components/` → `src/components/`
  - `@features/` → `src/features/`

### TypeScript & Type Safety

- Entire codebase should be written in TypeScript (`.ts` and `.tsx` files).
- Feature-level types: Define interfaces in `src/features/[name]/types.ts`.
- Global types: Add to `src/types/index.ts`.
- Strict mode enabled in `tsconfig.json` for type safety.

## Development Workflow

### Adding a New Interview Problem

1. Create a new folder in `src/features/[problem-name]/` (e.g., `features/phone-formatter/`).
2. Implement the component(s), hooks, and types in that folder.
3. Add a route or conditional render in `App.tsx` or `pages/Practice.tsx`.
4. Test locally with `pnpm dev`.
5. Commit with a descriptive message: `git commit -m "feat: implement [problem name]"`.
6. When ready for CoderPad interviews, copy the relevant component/hook code directly.

### Running a Single Problem

- Start the dev server: `pnpm dev`
- Navigate in the browser or modify `App.tsx`/`Practice.tsx` to show only the problem you're working on.

## Interview Problem Categories

Refer to `problem-statements.md` for the 12 problems organized by category:

- **State Management & Hooks** (3 problems): Todo list, Debounce, Phone formatter
- **Components & Rendering** (3 problems): Counter with undo/redo, Infinite scroll, Accordion
- **Performance & Optimization** (3 problems): Memoization, Lazy loading, Context API
- **Integration & Advanced** (3 problems): Data fetching, Spreadsheet UI, Game of Life

## Configuration Files

- **vite.config.ts**: Vite setup with React plugin and path aliases.
- **tsconfig.json**: TypeScript strict mode configuration.
- **tsconfig.node.json**: TypeScript config for Vite config file.
- **.eslintrc.cjs**: ESLint rules (configure after setup).
- **.prettierrc**: Prettier formatting rules (configure after setup).

## Performance Considerations

- Use `React.memo()` to prevent unnecessary re-renders in large lists.
- Use `useCallback()` for stable function references passed as props.
- Use `useEffect()` cleanup functions to avoid memory leaks.
- For infinite scroll: Use `IntersectionObserver` API instead of scroll event listeners.
- Debounce/throttle expensive operations (search, API calls).

## Notes for Future Context

- This is a **practice/learning repo**, not production code. Focus on clean implementation and understanding patterns over perfection.
- Each problem can be tested independently in the browser by routing to it.
- Git history should reflect one meaningful commit per feature/problem.
- The project can be cloned, and future problems can be added to the same `features/` directory structure.

## Known Issues & Prevention

### Cross-Platform Path Artifacts
**Issue**: On Linux systems with WSL2 or file sync from Windows, malformed directories can be created with Windows paths as literal directory names (e.g., `C:\Users\nobu\.claude\plugins\...`).

**Solution Implemented**:
- `.gitignore` has been configured to prevent committing directories with Windows path patterns
- Patterns blocked: `C:/`, `C:\`, `*Users*`, `*\.claude/`
- The proper Claude Code plugins directory is at `~/.claude/plugins/marketplaces/claude-plugins-official/` on the system, not in the project root

**Prevention for Future Instances**:
- Always use relative paths in the project (prefer imports with `@/` aliases)
- Don't copy system-wide plugin directories into the project
- If you encounter such a directory, delete it and ensure `.gitignore` rules are in place
