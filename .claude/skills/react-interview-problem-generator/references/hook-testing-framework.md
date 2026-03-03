# Hook Testing Framework - Universal Guide

## Overview

This guide provides a universal framework for testing custom React hooks using Vitest and @testing-library/react. It covers concepts, patterns, and best practices applicable to all hook types.

For **hook-type-specific implementations**, see:
- **useTodos-hook-testing-guide.md** — Detailed walkthrough for CRUD hooks using useTodos example
- **vitest-patterns.md** — Pattern templates for different hook types
- **coverage-checklist.md** — Coverage validation for different hook types
- **custom-hook-testing/** — Hook-type-specific guidelines

## Key Concepts

### 1. renderHook
The `renderHook` function from @testing-library/react allows you to test React hooks in isolation without rendering a full component.

```typescript
import { renderHook } from '@testing-library/react'
import { useMyHook } from './useMyHook'

const { result } = renderHook(() => useMyHook())
```

### 2. act() Wrapper
Always wrap state updates in `act()` to ensure React batches updates and the hook state updates properly.

```typescript
import { act } from '@testing-library/react'

act(() => {
  result.current.updateMethod(value)
})
```

### 3. Assertion Pattern
After state updates, assert that the new state is correct:

```typescript
act(() => {
  result.current.addItem('New Item')
})

expect(result.current.items).toHaveLength(1)
expect(result.current.items[0].text).toBe('New Item')
```

## Universal Inspection Order

All hooks should be tested in this logical order:

### 1. **Initialization**
- Verify the hook starts with correct default state
- Check that all methods/functions are available
- Validate type signatures

### 2. **Primary Operations**
- Test the main functionality (what the hook is for)
- This varies by hook type:
  - CRUD: Add/Create operations
  - Async: Data loading
  - Formatter: Input transformation
  - History: State tracking
  - Context: Value reading

### 3. **Secondary Operations**
- Test supporting functionality:
  - CRUD: Delete, Update, Toggle
  - Async: Error handling, Refetch
  - Formatter: Validation, Cleanup
  - History: Undo, Redo
  - Context: Value updating

### 4. **Query/Filter Operations**
- Test data retrieval and filtering:
  - CRUD: Search, Filter
  - Async: Data access patterns
  - Formatter: Output format
  - History: History access
  - Context: Derived values

### 5. **Edge Cases**
- Test boundary conditions
- Test error scenarios
- Test with invalid inputs
- Test state consistency

### 6. **Integration Scenarios**
- Test multiple operations together
- Test operation sequences
- Test state consistency across multiple operations

## Test Organization

Organize tests using nested `describe` blocks by operation type:

```typescript
describe('useMyHook', () => {
  describe('initialization', () => {
    it('starts with correct default state', () => { ... })
    it('provides all required methods', () => { ... })
  })

  describe('primary operation', () => {
    it('performs main functionality', () => { ... })
  })

  describe('secondary operations', () => {
    it('operation 1', () => { ... })
    it('operation 2', () => { ... })
  })

  describe('edge cases', () => {
    it('handles edge case 1', () => { ... })
    it('handles edge case 2', () => { ... })
  })

  describe('integration', () => {
    it('combines operations correctly', () => { ... })
  })
})
```

## Best Practices

### 1. Test One Thing Per Test
```typescript
✅ it('adds a todo', () => { ... })
   it('validates input', () => { ... })
❌ it('adds a todo and validates input', () => { ... })
```

### 2. Use Descriptive Names
```typescript
✅ it('removes item by id and leaves others unchanged')
❌ it('deletes item')
```

### 3. Always Use act() for State Updates
```typescript
✅ act(() => {
     result.current.updateState(value)
   })

❌ result.current.updateState(value)
```

### 4. Setup/Teardown When Needed
```typescript
describe('my hook', () => {
  let initialValue
  
  beforeEach(() => {
    initialValue = { /* setup */ }
  })
  
  it('test', () => { /* use initialValue */ })
})
```

### 5. Test Behavior, Not Implementation
```typescript
✅ expect(result.current.items).toHaveLength(1)
❌ expect(result.current.setItems).toHaveBeenCalled()
```

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific hook tests
pnpm test useMyHook

# Run with UI
pnpm test -- --ui

# Run with coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch

# Single test
pnpm test -- -t "should add an item"
```

## Common Assertions

```typescript
// Arrays/Collections
expect(result.current.items).toHaveLength(n)
expect(result.current.items).toEqual([...])
expect(result.current.items).toContain(item)

// Objects/Properties
expect(result.current.item).toMatchObject({ id: 1 })
expect(result.current.text).toBe('value')
expect(result.current.completed).toBe(true)

// Type checks
expect(typeof result.current.method).toBe('function')

// Array operations
expect(filtered).toHaveLength(expectedLength)
expect(filtered.every(i => i.prop)).toBe(true)
expect(filtered.some(i => i.id === targetId)).toBe(true)
```

## Hook Type Variations

Different hook types require different testing approaches:

### CRUD Hooks (state management)
- Focus on: Create, Read, Update, Delete, Search operations
- Example: useTodos, useItems, useUsers
- See: `useTodos-hook-testing-guide.md`, `custom-hook-testing/crud-hooks.md`

### Async Hooks (data fetching)
- Focus on: Loading states, Error handling, Refetch
- Example: useFetch, useAPI, useQuery
- See: `custom-hook-testing/async-hooks.md`

### Formatter Hooks (input transformation)
- Focus on: Input validation, Output format, Edge cases
- Example: usePhoneFormatter, useCurrencyFormatter
- See: `custom-hook-testing/formatter-hooks.md`

### History Hooks (undo/redo)
- Focus on: State history, Undo, Redo operations
- Example: useHistory, useUndo, useTimeline
- See: `custom-hook-testing/history-hooks.md`

### Context Hooks (global state)
- Focus on: Reading context, Updating context, Provider integration
- Example: useTheme, useAuth, useAppState
- See: `custom-hook-testing/context-hooks.md`

## Coverage Goals

Aim for these coverage levels in your hook tests:

| Metric | Target |
|--------|--------|
| Statements | 80%+ |
| Branches | 75%+ |
| Functions | 85%+ |
| Lines | 80%+ |

View coverage:
```bash
pnpm test -- --coverage
open coverage/index.html
```

## Summary

1. **Use renderHook()** to isolate hook logic
2. **Wrap updates in act()** for proper batching
3. **Test in inspection order**: Init → Primary → Secondary → Query → Edge → Integration
4. **Organize with describe blocks** by operation type
5. **Follow best practices** for clear, maintainable tests
6. **Aim for 80%+ coverage** of statements and lines

For detailed examples, see:
- `useTodos-hook-testing-guide.md` — Complete walkthrough for CRUD hooks
- `templates/useTodos.test.ts` — 451-line production example
- `custom-hook-testing/` — Hook-type-specific guides
