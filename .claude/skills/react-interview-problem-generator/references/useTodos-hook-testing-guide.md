# useTodos Hook Testing Guide - Detailed Implementation

## Introduction

This guide provides a **complete, detailed walkthrough** for testing the **useTodos hook** - a CRUD-based state management hook that demonstrates comprehensive hook testing practices.

**Scope**: This guide is specific to the **useTodos hook**. 

**For universal concepts**, see:
- `hook-testing-framework.md` — Common testing framework for all hooks

**For other hook types**, see:
- `custom-hook-testing/crud-hooks.md` — How to adapt useTodos patterns
- `custom-hook-testing/async-hooks.md` — Async data hooks
- `custom-hook-testing/formatter-hooks.md` — Input formatter hooks
- `custom-hook-testing/history-hooks.md` — Undo/redo hooks
- `custom-hook-testing/context-hooks.md` — Context/provider hooks

**See also**: 
- Complete implementation: `templates/useTodos.test.ts` (451 lines, 60+ test cases)
- Coverage validation: `coverage-checklist.md` (useTodos-specific)
- Test patterns: `vitest-patterns.md` (CRUD pattern)

## Key Concepts

### 1. renderHook
The `renderHook` function from @testing-library/react allows you to test React hooks in isolation without rendering a full component.

```typescript
import { renderHook } from '@testing-library/react'
import { useMyHook } from './useMyHook'

const { result } = renderHook(() => useMyHook())
```

### 2. act() Wrapper
Always wrap state updates in `act()` to ensure React batches updates and the component renders properly.

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

## Inspection Order

When testing a hook, inspect operations in this order:

### 1. **Todos State** (Initialization)
```typescript
it('initializes with empty todos array', () => {
  const { result } = renderHook(() => useTodos())
  expect(result.current.todos).toEqual([])
})
```

### 2. **Add Operation**
```typescript
it('adds a todo', () => {
  const { result } = renderHook(() => useTodos())
  act(() => {
    result.current.addTodo('Task')
  })
  expect(result.current.todos).toHaveLength(1)
})
```

### 3. **Delete Operation**
```typescript
it('deletes a todo', () => {
  const { result } = renderHook(() => useTodos())
  act(() => {
    result.current.addTodo('Task')
  })
  const id = result.current.todos[0].id
  act(() => {
    result.current.deleteTodo(id)
  })
  expect(result.current.todos).toHaveLength(0)
})
```

### 4. **Toggle Operation**
```typescript
it('toggles todo completion', () => {
  const { result } = renderHook(() => useTodos())
  act(() => {
    result.current.addTodo('Task')
  })
  const id = result.current.todos[0].id
  act(() => {
    result.current.toggleComplete(id)
  })
  expect(result.current.todos[0].completed).toBe(true)
})
```

### 5. **Search Operation**
```typescript
it('searches todos', () => {
  const { result } = renderHook(() => useTodos())
  act(() => {
    result.current.addTodo('Learn React')
    result.current.addTodo('Learn TypeScript')
  })
  const filtered = result.current.searchTodos('React')
  expect(filtered).toHaveLength(1)
})
```

## Common Test Patterns

### Testing State Initialization
```typescript
describe('initialization', () => {
  it('starts with correct default state', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe(initialValue)
    expect(result.current.items).toEqual([])
  })
})
```

### Testing Single Operations
```typescript
describe('add operation', () => {
  it('adds a single item', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('item')
    })
    expect(result.current.items).toHaveLength(1)
  })

  it('validates input before adding', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('')
    })
    expect(result.current.items).toHaveLength(0)
  })
})
```

### Testing Multiple Operations in Sequence
```typescript
it('performs add, update, delete in sequence', () => {
  const { result } = renderHook(() => useMyHook())

  // Add
  act(() => {
    result.current.addItem('Item 1')
  })
  expect(result.current.items).toHaveLength(1)

  // Update
  act(() => {
    result.current.updateItem(result.current.items[0].id, 'Updated')
  })
  expect(result.current.items[0].text).toBe('Updated')

  // Delete
  act(() => {
    result.current.deleteItem(result.current.items[0].id)
  })
  expect(result.current.items).toHaveLength(0)
})
```

### Testing Search/Filter
```typescript
describe('search operations', () => {
  it('filters items by term', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('React Hook')
      result.current.addItem('TypeScript Guide')
    })
    
    const filtered = result.current.search('React')
    expect(filtered).toHaveLength(1)
  })

  it('handles case-insensitive search', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('REACT')
    })
    
    const filtered = result.current.search('react')
    expect(filtered).toHaveLength(1)
  })

  it('returns empty array for no matches', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('Item')
    })
    
    const filtered = result.current.search('NotFound')
    expect(filtered).toHaveLength(0)
  })
})
```

### Testing Edge Cases
```typescript
describe('edge cases', () => {
  it('handles empty input', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('')
    })
    expect(result.current.items).toHaveLength(0)
  })

  it('handles whitespace-only input', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('   ')
    })
    expect(result.current.items).toHaveLength(0)
  })

  it('handles operations on non-existent id', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.deleteItem(99999)
    })
    // Should not throw, should handle gracefully
    expect(result.current.items).toHaveLength(0)
  })
})
```

### Testing State Preservation
```typescript
it('preserves item properties during operations', () => {
  const { result } = renderHook(() => useMyHook())
  
  act(() => {
    result.current.addItem('Task')
  })
  
  const originalId = result.current.items[0].id
  const originalText = result.current.items[0].text
  
  // Perform operation that shouldn't change these
  act(() => {
    result.current.toggleComplete(originalId)
  })
  
  expect(result.current.items[0].id).toBe(originalId)
  expect(result.current.items[0].text).toBe(originalText)
})
```

## Testing Patterns by Hook Type

### State Management Hooks
- Test initial state
- Test state updates
- Test state consistency
- Test rollback/undo operations

### Data Transformation Hooks
- Test input validation
- Test output format
- Test edge cases
- Test performance for large inputs

### Side Effect Hooks (useEffect)
- Use `waitFor()` for async operations
- Mock API calls
- Test cleanup
- Test dependency updates

### Context/Provider Hooks
- Test context value
- Test context updates
- Test consumer components
- Test error boundary integration

## Best Practices

1. **Use descriptive test names**
   ```typescript
   ✅ it('adds a todo with trimmed text')
   ❌ it('adds todo')
   ```

2. **Test one thing per test**
   ```typescript
   ✅ it('adds a todo') { /* test add */ }
      it('deletes a todo') { /* test delete */ }
   ❌ it('adds and deletes a todo') { /* both */ }
   ```

3. **Always use act() for state updates**
   ```typescript
   ✅ act(() => { result.current.update() })
   ❌ result.current.update()
   ```

4. **Setup/Teardown with beforeEach if needed**
   ```typescript
   describe('my hook', () => {
     let mockData
     
     beforeEach(() => {
       mockData = { /* setup */ }
     })
     
     it('test', () => { /* use mockData */ })
   })
   ```

5. **Test behavior, not implementation**
   ```typescript
   ✅ expect(result.current.items).toHaveLength(1)
   ❌ expect(result.current.setItems).toHaveBeenCalled()
   ```

## Common Assertions

```typescript
// Array/Collection
expect(result.current.items).toHaveLength(n)
expect(result.current.items).toEqual([...])
expect(result.current.items).toContain(item)

// Object/Property
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

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test useTodos

# Run with UI
pnpm test -- --ui

# Run with coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch

# Run single test
pnpm test -- -t "should add a todo"
```

## Summary

When testing hooks:
1. Use `renderHook()` to isolate hook logic
2. Wrap state updates in `act()`
3. Assert state changes after updates
4. Test operations in logical order: initialize → add → query → update → delete
5. Test edge cases and error handling
6. Keep tests focused and maintainable
