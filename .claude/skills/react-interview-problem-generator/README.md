# React Interview Problem Generator Skill

**Status**: Ready to use
**Location**: `.claude/skills/react-interview-problem-generator/`
**Scope**: Project-specific skill for the React interview playground

## 📁 Skill Structure

```
.claude/skills/react-interview-problem-generator/
├── INDEX.md                      # Navigation guide & cross-references
├── SKILL.md                      # Main skill definition & metadata
├── README.md                     # This file
├── START-HERE.md                 # 5-minute quick start guide
├── evals/
│   └── evals.json               # Test cases for skill validation
├── templates/
│   └── useTodos.test.ts         # Production-ready test example (60+ tests)
└── references/
    ├── problem-list.md          # All 12 problems with descriptions
    ├── workflow.md              # Detailed generation workflow
    ├── test-structure.md        # How tests are organized
    ├── patterns.md              # Code patterns & conventions
    ├── hook-testing-guide.md    # How to test React hooks with Vitest
    ├── vitest-patterns.md       # 5 hook testing patterns with examples
    └── coverage-checklist.md    # Coverage validation criteria
```

## 🚀 Quick Start

**Invoke the skill by asking to generate an interview problem:**

```
Generate problem #1: Todo List with Filtering
```

or

```
I want to add problem #5: Infinite Scroll List to my playground
```

The skill will:
1. ✅ Create the feature folder structure
2. ✅ Generate full working component(s) with hooks and types
3. ✅ Create Vitest unit tests (happy path)
4. ✅ Create Playwright e2e tests (happy path)
5. ✅ Add routing to App.tsx
6. ✅ Generate test-plan.md documenting future test coverage

## 📋 Key Files

### SKILL.md
The main skill definition. Contains:
- High-level overview of what the skill does
- When to use it (triggering contexts)
- What gets generated (output structure)
- Test coverage approach (what's tested vs. documented)
- Architecture patterns followed

### START-HERE.md
Quick start guide (5 minutes):
- Overview of skill features
- What gets generated
- How to use the skill
- Key features and benefits

### INDEX.md
Complete navigation guide:
- File reference and structure
- Learning paths by use case
- Cross-references to documentation
- Quick links to all resources

### templates/useTodos.test.ts
Production-ready test template with 60+ test cases:
- Shows how Vitest unit tests are structured
- Demonstrates hook testing best practices
- Covers all operations (add, delete, toggle, search)
- Includes edge cases and integration tests

### references/problem-list.md
Complete reference of all 12 problems:
- **State Management & Hooks**: Todo List, Debounce, Phone Formatter
- **Components & Rendering**: Counter, Infinite Scroll, Accordion
- **Performance & Optimization**: Memoization, Lazy Loading, Context API
- **Integration & Advanced**: Data Fetching, Spreadsheet UI, Game of Life

Each problem includes:
- Tags and real-world relevance
- Key patterns to learn
- Selection guide (which problems for different goals)

### references/workflow.md
Step-by-step generation workflow with concrete examples:
- Step 1: Problem selection
- Step 2: Component generation (with full code examples)
- Step 3: Page integration
- Step 4: Unit tests (Vitest)
- Step 5: E2E tests (Playwright)
- Step 6: Test coverage documentation
- Running and next steps

### references/test-structure.md
How tests are organized for all generated features:
- **Vitest structure**: What's tested in unit tests
- **Playwright structure**: What's tested in e2e tests
- **Test plan documentation**: What to add next
- Running tests commands
- Best practices and examples

### references/patterns.md
Code patterns and conventions used in generated code:
- Feature-based project structure
- React patterns (custom hooks, useCallback, dependencies)
- TypeScript patterns (types.ts, strict mode)
- Tailwind CSS styling
- Accessibility (semantic HTML, ARIA)
- Error handling and performance
- Testing patterns

### references/hook-testing-guide.md
**NEW:** Comprehensive guide to testing React hooks with Vitest:
- How to use renderHook() and act()
- Inspection order for tests
- Common test patterns
- Best practices and examples
- Assertion techniques

### references/vitest-patterns.md
**NEW:** 5 hook testing patterns with runnable examples:
1. CRUD Hook Pattern (Todo, Task)
2. State Transform Hook Pattern (Formatters)
3. Async/Data Fetching Hook Pattern
4. Complex State Hook Pattern (History/Undo)
5. Context/Provider Hook Pattern

### references/coverage-checklist.md
**NEW:** Comprehensive coverage validation:
- Coverage checklist organized by operation type
- Coverage percentage goals
- Coverage gaps and how to fix them
- Self-assessment questions
- Reading coverage reports

### evals/evals.json
Test cases that validate the skill works correctly:
- Test 1: Todo List generation
- Test 2: Phone Formatter generation
- Test 3: Infinite Scroll generation

## 🎯 What Gets Generated

For each problem, you get:

```
src/features/[feature-name]/
├── components/[Component].tsx    # Full implementation (200-300 lines)
├── hooks/[hook].ts              # Custom hooks for state management
├── types.ts                     # TypeScript interfaces
├── __tests__/[Component].test.ts # Vitest (happy path coverage)
└── index.ts                     # Barrel exports

src/pages/[FeatureName]Page.tsx   # Routable page wrapper

tests/e2e/[feature-name].spec.ts  # Playwright (happy path coverage)

docs/test-plans/[feature-name]/
└── test-plan.md                 # Alternative flows, negative cases, edge cases

App.tsx                          # Route added automatically
```

## 🧪 Test Coverage

**Vitest (Unit Tests)** covers:
- ✅ Component renders
- ✅ Primary user interaction
- ✅ State updates
- ✅ Accessibility
- ✅ **Hook logic with proper inspection order** (NEW!)
  - Initialization (default state)
  - Add/Create operations
  - Delete/Remove operations
  - Toggle/Update operations
  - Search/Filter operations
  - Integration scenarios

**Playwright (E2E Tests)** covers:
- ✅ Full user workflow
- ✅ Browser interactions
- ✅ Happy path scenario end-to-end

**Test Plan (Documentation)** lists:
- 📋 Alternative flows (what else to test)
- 📋 Negative cases (errors, invalid inputs)
- 📋 Edge cases (boundaries, performance)

### Hook Testing with Vitest (NEW!)

The skill now generates comprehensive Vitest tests for custom hooks with:
- **60+ test cases per hook** organized by operation type
- **Inspection order** matching logical usage patterns:
  1. Initialization → Default state
  2. Add Operation → Creating items
  3. Delete Operation → Removing items
  4. Toggle Operation → Updating items
  5. Search Operation → Filtering items
  6. Integration → Multiple operations
- **Edge case coverage** (empty, whitespace, invalid inputs)
- **Production-ready example** in `templates/useTodos.test.ts`

See `references/hook-testing-guide.md` for complete guide.

## 📖 How to Use This Skill

### 1. Select a Problem

Pick one from references/problem-list.md:
- By category (State Management, Components, Performance, Integration)
- By difficulty (most common, challenging, learning goals)
- By number (1-12) or name

### 2. Ask Claude to Generate It

```
Use the react-interview-problem-generator skill to generate problem #1: Todo List
```

### 3. Review Generated Code

- Component is in `src/features/[name]/`
- Tests are in `__tests__/` and `tests/e2e/`
- Routing is already added to App.tsx
- Navigate to `/practice/[feature-name]` in browser

### 4. Run Tests

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Watch mode
pnpm test -- --watch
```

### 5. Extend Test Coverage

Use `docs/test-plans/[feature]/test-plan.md` as your checklist to add:
- Alternative user flows
- Error cases (invalid input, network failures)
- Edge cases (empty list, very large list, mobile, keyboard nav)
- Performance tests

### 6. Learn & Practice

- Read through the generated code
- Understand the patterns used (see references/patterns.md)
- Customize and extend the component
- Add more test cases
- Refactor to experiment with different approaches

### 7. Commit

```bash
git add .
git commit -m "feat: implement [problem name]"
```

## 🎓 Learning Path

**Suggested order by skill level:**

**Beginner** (learn hooks):
1. Todo List (useState, useEffect)
2. Debounce (useEffect, setTimeout)
3. Phone Formatter (controlled inputs)

**Intermediate** (learn components):
4. Counter with Undo/Redo (useReducer)
5. Infinite Scroll (IntersectionObserver)
6. Accordion (controlled state)

**Advanced** (learn performance):
7. Memoization (React.memo, useCallback)
8. Lazy Loading (IntersectionObserver variants)
9. Context API (global state)

**Expert** (learn integration):
10. Data Fetching (useEffect + API)
11. Spreadsheet UI (2D state, formulas)
12. Game of Life (complex state, performance)

## 🔧 Behind the Scenes

The skill uses this process to generate code:

1. **Reads** the problem definition from problem-list.md
2. **Generates** a complete, working component implementation
3. **Creates** feature folder structure following your conventions
4. **Writes** Vitest unit tests covering happy path
5. **Writes** Playwright e2e tests covering user workflow
6. **Integrates** routing by updating App.tsx
7. **Generates** test-plan.md documenting future test coverage

All generated code:
- ✅ Follows project conventions (feature-based structure)
- ✅ Uses TypeScript strict mode
- ✅ Includes proper accessibility (ARIA, semantic HTML)
- ✅ Styled with Tailwind CSS
- ✅ Tests pass immediately
- ✅ Ready to study or show in interviews

## 📝 Test Validation Cases

The skill has been validated with 3 test prompts:

1. **Todo List generation** — Tests basic CRUD with search
2. **Phone Formatter generation** — Tests input formatting and validation
3. **Infinite Scroll generation** — Tests performance patterns and observer APIs

See `evals/evals.json` for full test cases.

## 🎯 Next Steps

1. **Quick Start** → Read `START-HERE.md` (5 minutes)
2. **Choose a problem** from `references/problem-list.md`
3. **Ask Claude** to generate it using this skill
4. **Run the tests** to verify everything works
5. **Study the code** and understand the patterns (see `references/patterns.md`)
6. **Learn hook testing** from `references/hook-testing-guide.md` and `templates/useTodos.test.ts`
7. **Extend the tests** using test-plan.md checklist and `references/coverage-checklist.md`
8. **Practice** by modifying and refactoring the component
9. **Commit** your work

## 📚 Learning Resources

### For Quick Overview
- `START-HERE.md` — 5-minute introduction
- `README.md` — This file

### For Complete Reference
- `SKILL.md` — Full skill documentation
- `INDEX.md` — Complete navigation and cross-references

### For Problem Selection
- `references/problem-list.md` — All 12 problems with descriptions

### For Implementation Details
- `references/patterns.md` — Code patterns and conventions
- `references/workflow.md` — Step-by-step generation workflow
- `references/test-structure.md` — Test organization

### For Hook Testing (NEW!)
- `references/hook-testing-guide.md` — How to test React hooks
- `references/vitest-patterns.md` — 5 patterns with examples
- `references/coverage-checklist.md` — Coverage validation
- `templates/useTodos.test.ts` — Production-ready example (60+ tests)

Happy practicing! 🚀
