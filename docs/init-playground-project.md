# Playground for the React Frontend interview problems

Playground for the highly possible React Frontend problems for OpenDoor Software Engineer - Fullstack.

---
## Yes, using Vite with React + TypeScript is an excellent choice in 2026. Vite offers:

- Extremely fast development server (Hot Module Replacement in <50ms)
- Instant cold starts
- Modern configuration (much simpler than Create React App)
- Built-in support for TypeScript (no extra setup needed)
- Great for single-page applications (SPA) like the one you're preparing for practice or your Travel Recommender project

### Step 1: Initialize the Project with Vite + React + TypeScript

Run one of these commands in your terminal (choose a folder where you want the project):

```bash
# Recommended (uses npm)
npm create vite@latest my-react-practice -- --template react-ts

# Or with yarn
yarn create vite my-react-practice --template react-ts

# Or with pnpm (faster package manager)
pnpm create vite my-react-practice --template react-ts
```
During the process:

- It will create the folder my-react-practice
- Install dependencies automatically
- Generate a modern vite.config.ts (you can extend it later)

After creation:

```bash
cd my-react-practice
npm install          # or yarn / pnpm install
npm run dev          # starts dev server at http://localhost:5173
```

You should immediately see the default Vite + React + TS welcome page.

### Step 2: Recommended Folder Structure for Your Single-Repo SPA

Vite starts with a minimal structure, but for practice (especially for interview-style problems like Todo List, Search with debounce, Infinite Scroll, Data Fetching), I recommend evolving it into a feature-based + pages-based structure. This is clean, scalable, and commonly recommended in 2025–2026 React projects.

Here's a practical starting structure (you can create these folders manually after `npm create vite`):

```
my-react-practice/
├── public/                  # static files (favicon, robots.txt, etc.)
│   └── vite.svg
├── src/
│   ├── assets/              # images, fonts, icons (imported in code)
│   │   └── react.svg
│   ├── components/          # reusable UI pieces (shared across features)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Loader.tsx
│   │   └── index.ts         # barrel file: export * from './Button'
│   ├── features/            # domain/feature folders — best for interview practice
│   │   ├── todo/            # example: Todo List problem
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── useTodos.ts  # custom hook
│   │   │   └── types.ts     # local types/interfaces
│   │   ├── search/          # example: Debounced search bar
│   │   │   ├── SearchBar.tsx
│   │   │   ├── useDebounce.ts
│   │   │   └── SearchResults.tsx
│   │   └── infinite-scroll/ # example: Infinite list
│   │       ├── InfiniteList.tsx
│   │       └── useInfiniteLoad.ts
│   ├── hooks/               # global custom hooks (if not feature-specific)
│   │   └── useFetch.ts
│   ├── pages/               # top-level route views (use react-router if needed)
│   │   ├── Home.tsx
│   │   ├── Practice.tsx     # main page for switching between problems
│   │   └── NotFound.tsx
│   ├── services/            # API utilities, mocks, GraphQL clients
│   │   └── api.ts           # fetch wrappers or Apollo/URQL setup
│   ├── types/               # global TypeScript types/interfaces
│   │   └── index.ts
│   ├── utils/               # pure functions (formatDate, debounce, etc.)
│   ├── App.tsx              # root component (can render router or practice switcher)
│   ├── main.tsx             # entry point (ReactDOM.createRoot)
│   ├── index.css            # global styles (or use tailwind if you add it)
│   └── vite-env.d.ts        # Vite's env type declarations
├── .eslintrc.cjs            # ESLint config (add rules later)
├── .prettierrc              # Prettier config
├── tsconfig.json            # TypeScript config
├── tsconfig.node.json       # for vite.config.ts
├── vite.config.ts           # Vite configuration (plugins, aliases, etc.)
├── package.json
└── README.md
```


Why this structure?

- Feature-based (`features/`) — isolates each practice problem (todo, search, etc.) → easy to delete/add
- Pages — clear entry points (even without router, you can switch via a simple nav in `Practice.tsx`)
- Components — shared UI (Button, Card…) live here, not duplicated
- Types & utils — global and reusable
- Single repo SPA — everything in one Git repo; push to GitHub easily
- Matches modern recommendations (2025–2026): avoids "god folders" like dumping everything in `components/`

### Step 3: Quick Enhancements (Optional but Recommended)

After `npm install`, add these for better DX (especially for interview prep):

```bash
# ESLint + Prettier (Vite template already has basic ESLint)
npm install -D prettier eslint-config-prettier eslint-plugin-prettier

# Optional: Tailwind CSS (great for fast styling in practice)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `vite.config.ts` (add aliases for cleaner imports):

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})
```

Now you can import like: `import { Button } from '@/components'`


### Step 4: How to Use This for Practice

1. Create a new branch per problem: git checkout -b practice/todo-list
2. Build the feature in src/features/todo/
3. Add a route or conditional render in App.tsx or Practice.tsx
4. Test in browser (npm run dev)
5. Commit → push to GitHub
6. When ready for CoderPad: copy the relevant component/hook code into CoderPad (it supports React/TS)

This setup is fast, modern, and interview-friendly.
You can initialize it right now and start adding one problem per day.

---
## To use pnpm as I have other projects with pnpm. Any changes is required to setup the project for practice ?

1. Make sure pnpm is installed globally (if not already from your other projects):

```bash
npm install -g pnpm
# or if you prefer corepack (recommended in Node 16+)
corepack enable
corepack prepare pnpm@latest --activate
```

Check version:

```bash
pnpm --version
```

2. Create the Vite + React + TypeScript project:

```bash
pnpm create vite my-react-practice --template react-ts
```

- This is the exact equivalent of `npm create vite@latest ... -- --template react-ts`.
- The double dash (`--`) is not needed with pnpm in most cases — just use the command above.
- It will prompt you to confirm the project name and template (React + TypeScript).
- pnpm will automatically install dependencies during creation (faster and more efficient than npm).


3. Navigate and start the dev server:

```bash
cd my-react-practice
pnpm install          # optional — already done during creation, but safe to run
pnpm dev              # starts at http://localhost:5173 (or similar)
```

- `pnpm dev` is the same as `npm run dev` — scripts in `package.json` are identical.

4. Other common commands (all work the same):

- Add a dependency: `pnpm add react-router-dom` (or `pnpm add -D eslint-plugin-react`)
- Run build:  `pnpm build`
- Lint/test (if you add them): `pnpm lint`, etc.

---
### Any Adjustments Needed?

- No — the generated project is identical (same`vite.config.ts`, `tsconfig.json`, etc.).
- pnpm-lock.yaml will be created instead of package-lock.json or yarn.lock — that's expected and fine.
- If you already have pnpm in other projects:
  - You can even set pnpm as the preferred manager in `package.json` (optional but nice for consistency):
     ```json
{
  "packageManager": "pnpm@9.12.2"   // or whatever your global version is
}
     ```
     Add this manually after creation (run `pnpm --version` to get the exact version).
- Aliases & paths (from previous suggestion) still work perfectly — edit `vite.config.ts` the same way.
- Tailwind / ESLint / Prettier additions:

```bash
pnpm add -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Or for ESLint + Prettier:

```bash
pnpm add -D eslint prettier eslint-config-prettier eslint-plugin-prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-react eslint-plugin-react-hooks
```

---
### Quick Verification After Setup

- Run `pnpm dev` → see the Vite + React + TS starter page.
- Open `src/App.tsx` → it's already in TypeScript.
- You're ready to add folders like `features/todo/`, `pages/`, etc., as previously outlined.

This keeps everything consistent with your existing pnpm-based projects. No extra configuration or workarounds needed — Vite + pnpm is a very smooth combo in 2026.

If you run into any prompt/error during `pnpm create vite`, share it and I can help debug. Once set up, start adding one practice problem (e.g., a debounced search component in `features/search/`) and commit to Git. Good luck with your prep!

