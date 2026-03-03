# 🚀 React Interview Problem Generator Skill

## What This Skill Does

Automates **end-to-end implementation** of React interview problems with:
- ✅ Component implementation with TypeScript
- ✅ Custom hook implementation
- ✅ **Vitest unit tests for hooks** (new!)
- ✅ Playwright end-to-end tests  
- ✅ Automatic routing setup
- ✅ Test coverage analysis

## Three-Phase Workflow

### Phase 1: Invoke Skill
```bash
# In GitHub Copilot CLI, use the skill command:
/skill react-interview-problem-generator
```

### Phase 2: Configure & Generate
Specify:
- Problem name (e.g., "todo-list", "debounce", "infinite-scroll")
- Features (add the custom hook and tests)
- Test scope (unit tests for hooks, e2e tests for components)

### Phase 3: Output
The skill generates:
```
src/features/{problem}/
├── components/
│   ├── {Component}.tsx
│   └── __tests__/
│       └── {Component}.test.tsx      # Playwright e2e tests
├── hooks/
│   ├── use{Hook}.ts
│   └── __tests__/
│       └── use{Hook}.test.ts        # NEW: Vitest unit tests
├── types.ts
└── index.ts
```

## Supported Problems (12 Featured)

| Category | Problems |
|----------|----------|
| **State Management** | Todo List, Debounce, Phone Formatter |
| **Components & Rendering** | Counter (Undo/Redo), Infinite Scroll, Accordion |
| **Performance** | Memoization, Lazy Loading, Context API |
| **Integration** | Data Fetching, Spreadsheet UI, Game of Life |

## Key Features

### Custom Hook Unit Tests (NEW!)
The skill now generates **Vitest unit tests** for custom hooks:
- Tests hook state initialization
- Tests callback functions (add, delete, update)
- Tests state transitions
- Validates search/filter functionality
- Organized test suites by operation

**Example for `useTodos` hook:**
```typescript
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { describe, it, expect } from 'vitest'

describe('useTodos', () => {
  it('initializes with empty todos array', () => {
    const { result } = renderHook(() => useTodos())
    expect(result.current.todos).toEqual([])
  })

  it('adds a new todo', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Learn React')
    })
    expect(result.current.todos).toHaveLength(1)
    expect(result.current.todos[0].text).toBe('Learn React')
  })

  it('deletes a todo by id', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task 1')
    })
    const todoId = result.current.todos[0].id
    act(() => {
      result.current.deleteTodo(todoId)
    })
    expect(result.current.todos).toHaveLength(0)
  })

  it('toggles todo completion status', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Task')
    })
    const todoId = result.current.todos[0].id
    act(() => {
      result.current.toggleComplete(todoId)
    })
    expect(result.current.todos[0].completed).toBe(true)
  })

  it('searches todos by text', () => {
    const { result } = renderHook(() => useTodos())
    act(() => {
      result.current.addTodo('Learn React')
      result.current.addTodo('Learn TypeScript')
    })
    const searchResults = result.current.searchTodos('React')
    expect(searchResults).toHaveLength(1)
    expect(searchResults[0].text).toContain('React')
  })
})
```

### Component E2E Tests
Playwright tests covering:
- Component rendering
- User interactions
- Form submissions
- Search/filter workflows
- State persistence

### Automatic Routing
- Adds route to `src/App.tsx`
- Creates page wrapper if needed
- Registers in navigation

## Quick Start

### Step 1: Invoke the Skill
```bash
/skill react-interview-problem-generator
```

### Step 2: Answer Prompts
- **Problem name**: `todo-list`
- **Include custom hook?**: `yes`
- **Generate unit tests?**: `yes`
- **Generate e2e tests?**: `yes`

### Step 3: Review Generated Files
```bash
# Unit tests for hook
src/features/todo/hooks/__tests__/useTodos.test.ts

# E2E tests for component
src/features/todo/components/__tests__/TodoList.test.tsx

# Component implementation
src/features/todo/components/TodoList.tsx
```

### Step 4: Run Tests
```bash
# Run all unit tests
pnpm test

# Run with coverage
pnpm test -- --coverage

# Run specific hook tests
pnpm test useTodos

# Run e2e tests
pnpm test:e2e
```

## Test Coverage (Vite Unit Tests for Hooks)

For each custom hook, the skill generates tests that cover:
- ✅ **Initialization**: Hook starts with correct initial state
- ✅ **Add Operations**: Adding items updates state correctly
- ✅ **Delete Operations**: Removing items works as expected
- ✅ **Toggle/Update**: State mutations preserve other data
- ✅ **Search/Filter**: Query operations return correct results
- ✅ **Edge Cases**: Empty inputs, duplicates, boundary conditions

## Example Inspection Order (useTodos)
1. **todos state**: Verify initial empty array
2. **addTodo**: Test adding single and multiple items
3. **deleteTodo**: Test removal by ID
4. **toggleComplete**: Test status toggling
5. **searchTodos**: Test filtering by text

## Configuration

The skill respects:
- `vitest.config.ts` - Test runner configuration
- `tsconfig.json` - TypeScript settings
- Path aliases (`@features/`, `@components/`, etc.)
- Existing component structure

## Notes

- Tests use **Vitest** for unit testing (performant, Vite-native)
- Tests use **@testing-library/react** for hook testing
- Tests use **Playwright** for e2e browser testing
- All tests are **TypeScript**-based for type safety
- Hook tests validate logic in isolation (no React rendering)
- E2E tests validate user-facing behavior

## Files Structure Reference

```
skill/
├── START-HERE.md                    # This file
├── SKILL.md                         # Full documentation
├── templates/
│   ├── hook.test.ts.template       # Vitest hook test template
│   ├── component.test.tsx.template # Playwright e2e test template
│   ├── component.tsx.template      # Component implementation
│   └── types.ts.template           # Type definitions
└── scripts/
    └── generate.sh                  # Generation script
```

## Key Benefits

1. **Consistent Testing** - All hooks have same test structure
2. **Fast Feedback** - Unit tests run in milliseconds
3. **Type Safety** - Full TypeScript test coverage
4. **Coverage Tracking** - Automated coverage reports
5. **Interview Ready** - Production-quality code examples

## Troubleshooting

**Tests not running?**
```bash
pnpm install
pnpm test
```

**Path aliases not resolved?**
Check that vitest.config.ts has matching paths to vite.config.ts

**Hook test fails?**
Use `act()` wrapper for state updates:
```typescript
act(() => {
  result.current.addItem('value')
})
```

## Next Steps

✅ Run: `/skill react-interview-problem-generator`
✅ Generate your first problem
✅ Review generated tests in `__tests__/` folders
✅ Run: `pnpm test` to verify everything works

---

Ready to generate tests for your interview problem? Use the skill now!
