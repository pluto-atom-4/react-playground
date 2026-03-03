---
name: react-interview-problem-generator
description: Generate complete React interview problem implementations with tests for the playground. Use this skill when the user wants to add one of the 12 featured problems (Todo List, Debounce, Phone Formatter, Counter with Undo/Redo, Infinite Scroll, Accordion, Memoization, Lazy Loading, Context API, Data Fetching, Spreadsheet UI, Game of Life) to the React playground. The skill scaffolds full working components with TypeScript, creates Vitest unit tests and Playwright e2e tests for happy path scenarios, documents test coverage gaps, and automatically integrates everything into the app with routing.
---

# React Interview Problem Generator

Quickly scaffold complete, working implementations of interview problems with built-in tests and documentation.

## Overview

This skill generates:
- ✅ Full working component(s) with hooks and types
- ✅ Vitest unit tests (happy path + key interactions)
- ✅ Playwright e2e tests (user workflow validation)
- ✅ Automatic routing integration
- ✅ Test coverage documentation (alternative flows, edge cases, errors)

## Quick Start

1. **Select a problem** from the 12 featured questions (see references/problem-list.md)
2. **Generation runs automatically** — creates all files in the feature structure
3. **Tests pass immediately** — both unit and e2e tests for the happy path
4. **Documentation ready** — docs/test-plans/[feature]/test-plan.md lists what to test next
5. **Integrated into app** — navigate to /practice/[feature-name] to see it live

## What Gets Generated

For each problem:
```
src/features/[problem-name]/
  ├── components/[Component].tsx     # Full implementation
  ├── hooks/[hook].ts                # State management hooks
  ├── types.ts                       # TypeScript interfaces
  └── __tests__/[Component].test.ts  # Vitest (happy path)

src/pages/[ProblemName]Page.tsx      # Routable page wrapper

tests/e2e/[feature-name].spec.ts     # Playwright (happy path)

docs/test-plans/[feature-name]/
  └── test-plan.md                   # Future test scenarios

App.tsx                              # Route added automatically
```

## Test Coverage

**Unit Tests (Vitest)** cover:
- Component renders without error
- Primary user interaction works
- State updates correctly
- Basic accessibility checks
- **Custom hook logic** with 60+ test cases organized by operation type

**E2E Tests (Playwright)** cover:
- Full user workflow from page load
- UI responds to interactions
- Happy path scenario end-to-end

**Test Plan (Documentation)** lists:
- Alternative flows (what else should be tested)
- Negative cases (errors, invalid inputs)
- Edge cases (boundaries, performance)

**Hook Testing Guides** (NEW):
- Comprehensive testing frameworks for custom hooks
- Organized by hook type (CRUD, Async, Formatter, History, Context)
- useTodos hook as detailed example template
- Adapter patterns for extending to other hooks

See references/test-structure.md for detailed examples.
See references/hook-testing-guide.md for useTodos hook testing walkthrough.
See references/custom-hook-testing/ for hook-type-specific guidelines.

## Architecture & Patterns

All generated code follows your project conventions:

- **Feature-based**: `src/features/[name]/` with co-located components, hooks, tests
- **TypeScript strict mode**: Full type safety
- **Custom hooks**: Isolated state management
- **Tailwind styling**: Consistent with project theme
- **Barrel exports**: Clean imports via `@features/` aliases
- **Test organization**: `__tests__/` in feature folder

See references/patterns.md for code architecture details.

## After Generation

1. Run tests: `pnpm test` (Vitest) + `pnpm test:e2e` (Playwright)
2. Review the implementation and understand the pattern
3. Extend tests using the test-plan.md checklist
4. Customize the component for practice or learning
5. Commit: `git commit -m "feat: implement [problem name]"`

## Problems Available

See references/problem-list.md for the full list of 12 problems organized by category:
- State Management & Hooks (3 problems)
- Components & Rendering (3 problems)
- Performance & Optimization (3 problems)
- Integration & Advanced (3 problems)

## Reference Files

- **references/workflow.md** — Step-by-step workflow with examples
- **references/problem-list.md** — All 12 problems with descriptions
- **references/test-structure.md** — How tests are organized and what they cover
- **references/patterns.md** — Code patterns, architecture, and conventions
- **references/hook-testing-framework.md** — Universal concepts for testing any custom hook
- **references/custom-hook-testing/** — Hook-type-specific testing guidelines with patterns
  - `crud-hooks.md` — For state management hooks (useTodos, useItems, useUsers, etc.)
    - How to structure CRUD operations
    - Testing add, delete, update, toggle operations
    - Search/filter patterns
  - `async-hooks.md` — For data fetching hooks (useFetch, useAPI, useQuery)
    - Loading state transitions
    - Error handling
    - Refetch and retry patterns
  - `formatter-hooks.md` — For input transformation hooks (usePhoneFormatter, useCurrencyFormatter)
    - Formatting logic validation
    - Input validation testing
    - Edge cases (special chars, boundaries)
  - `history-hooks.md` — For undo/redo hooks (useHistory, useUndo, useTimeline)
    - State history tracking
    - Undo/Redo operations
    - Pointer management
  - `context-hooks.md` — For context/provider hooks (useTheme, useAuth, useAppState)
    - Reading and updating context
    - Provider wrapper pattern
    - Error handling outside provider

---

## Hook Testing Framework

This skill includes comprehensive guides for testing custom React hooks using Vitest.

### For useTodos Hook

The **useTodos hook is used as the detailed example** for hook testing. It demonstrates:
- How to structure unit tests with `renderHook()` and `act()`
- Inspection order: Initialize → Add → Delete → Toggle → Search → Integrate
- How to test CRUD operations on state
- How to test state consistency and edge cases
- How to test with 60+ test cases organized by operation type

See:
- **references/hook-testing-guide.md** — Step-by-step walkthrough for useTodos
- **references/vitest-patterns.md** — useTodos test patterns and examples
- **references/coverage-checklist.md** — useTodos coverage validation
- **templates/useTodos.test.ts** — Complete working test file (451 lines)

### For Other Hook Types

Each hook type has its own testing guide in `references/custom-hook-testing/`:

- **CRUD Hooks** (like useTodos, useItems, useTasks)
  - How to adapt the useTodos patterns
  - Examples: useUsers, useProducts, useNotes

- **Async Hooks** (like useFetch, useAPI)
  - Handling loading states
  - Error handling
  - Refetch patterns

- **Formatter Hooks** (like usePhoneFormatter, useCurrencyFormatter)
  - Input validation testing
  - Output format verification
  - Edge case handling

- **History Hooks** (like useUndo, useHistory)
  - State history tracking
  - Undo/Redo operations
  - State rollback

- **Context Hooks** (like useTheme, useAuth)
  - Reading context values
  - Updating context
  - Provider integration

## How to Use Hook Testing Guides

### Understanding the Hook Testing Framework

The hook testing framework is organized in two parts:

1. **Universal Concepts** (`references/hook-testing-framework.md`)
   - Applies to ALL custom hooks regardless of type
   - Covers renderHook(), act(), inspection order
   - Test organization principles and best practices
   - Common patterns every hook test needs

2. **Hook-Type Guides** (`references/custom-hook-testing/`)
   - Specific patterns for your hook type
   - Covers CRUD, Async, Formatter, History, Context hooks
   - Shows how to adapt universal concepts
   - Each guide includes test templates and examples

### Reading Path by Hook Type

**For CRUD hooks** (useTodos, useItems, useUsers):
1. Read `hook-testing-framework.md` (universal concepts)
2. Read `custom-hook-testing/crud-hooks.md` (CRUD-specific patterns)
3. Study `useTodos-hook-testing-guide.md` (detailed example)
4. Reference `templates/useTodos.test.ts` (complete implementation)
5. Use `vitest-patterns.md` for Pattern 1 (CRUD operations)

**For Async hooks** (useFetch, useAPI, useQuery):
1. Read `hook-testing-framework.md` (universal concepts)
2. Read `custom-hook-testing/async-hooks.md` (async-specific patterns)
3. Reference working async examples in your codebase
4. Use `vitest-patterns.md` for async patterns section

**For Formatter hooks** (usePhoneFormatter, useCurrencyFormatter):
1. Read `hook-testing-framework.md` (universal concepts)
2. Read `custom-hook-testing/formatter-hooks.md` (formatter patterns)
3. Reference template in that guide
4. Create tests for format, validate, transform operations

**For History hooks** (useHistory, useUndo, useTimeline):
1. Read `hook-testing-framework.md` (universal concepts)
2. Read `custom-hook-testing/history-hooks.md` (history patterns)
3. Reference template in that guide
4. Create tests for push, undo, redo operations

**For Context hooks** (useTheme, useAuth, useAppState):
1. Read `hook-testing-framework.md` (universal concepts)
2. Read `custom-hook-testing/context-hooks.md` (context patterns)
3. Pay special attention to provider wrapper pattern
4. Create tests with wrapper component setup

### Step-by-Step Example: Testing a New Hook

If you create a new hook like `useSearch`:

1. **Determine hook type**: Is it CRUD, Async, Formatter, History, or Context?
   - useSearch → CRUD (state management)

2. **Read appropriate guides**:
   - `hook-testing-framework.md` (universal)
   - `custom-hook-testing/crud-hooks.md` (CRUD patterns)

3. **Identify test sections** from guide:
   - Initialization
   - Add/Create operations
   - Search/Filter operations
   - Delete operations
   - State consistency

4. **Adapt template** from guide to your hook

5. **Verify coverage** against inspection order

### Files You'll Reference Most

| File | Purpose | Use When |
|------|---------|----------|
| `hook-testing-framework.md` | Universal concepts | First read for any hook |
| `custom-hook-testing/[type].md` | Hook-type patterns | Creating tests for your hook |
| `useTodos-hook-testing-guide.md` | Detailed CRUD example | Learning by example |
| `templates/useTodos.test.ts` | Complete working code | Need a working reference |
| `vitest-patterns.md` | Common patterns | Looking for specific test patterns |

---

**Next:** Tell me which problem you'd like to implement, or review references/problem-list.md to choose one.
