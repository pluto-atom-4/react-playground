# CRUD Hooks Testing Guide

## Overview

This guide shows how to test CRUD (Create, Read, Update, Delete) based hooks like useTodos, useItems, useUsers, etc.

**Foundation**: This guide adapts the patterns shown in `useTodos-hook-testing-guide.md` and `templates/useTodos.test.ts` to other CRUD hooks.

**See also**: 
- `../useTodos-hook-testing-guide.md` — Detailed useTodos walkthrough
- `../templates/useTodos.test.ts` — Complete 451-line example
- `../hook-testing-framework.md` — Universal testing concepts

## Critical Implementation Notes

### ID Generation & Timing

**Important**: When testing CRUD hooks that use `Date.now()` for ID generation, be aware of timestamp collisions in rapid tests:

❌ **This causes ID collisions** (same timestamp for multiple adds):
```typescript
act(() => {
  result.current.addItem('Item 1')
  result.current.addItem('Item 2')  // May get same ID as Item 1
})
```

✅ **This ensures unique IDs** (separate timestamps):
```typescript
act(() => {
  result.current.addItem('Item 1')
})

act(() => {
  result.current.addItem('Item 2')  // Different timestamp, unique ID
})
```

**Solution**: When testing operations that depend on unique IDs (delete by ID, toggle by ID), separate `act()` blocks ensure different timestamps. This is especially important for:
- Tests that verify deletion of specific items
- Tests that toggle state on specific items by ID
- Integration tests that mix add + delete operations

**Better Alternative** (if you control the hook implementation):
Use a counter instead of `Date.now()` for more predictable IDs:
```typescript
const useMyHook = () => {
  const [items, setItems] = useState<Item[]>([])
  const [nextId, setNextId] = useState(1)
  
  const addItem = useCallback((text: string) => {
    setItems((prev) => [...prev, { id: nextId, text }])
    setNextId((prev) => prev + 1)
  }, [nextId])
  // ...
}
```

## CRUD Hook Structure

CRUD hooks typically have this structure:

```typescript
const useMyHook = () => {
  const [items, setItems] = useState<Item[]>([])
  
  const addItem = useCallback((text: string) => { ... }, [])
  const deleteItem = useCallback((id: number) => { ... }, [])
  const updateItem = useCallback((id: number, updates: Partial<Item>) => { ... }, [])
  const searchItems = useCallback((term: string) => { ... }, [items])
  
  return { items, addItem, deleteItem, updateItem, searchItems }
}
```

## Test Organization

Organize tests by operation type, mirroring the useTodos pattern:

```typescript
describe('useMyHook', () => {
  describe('initialization', () => {
    // Default state tests
  })
  
  describe('add operation', () => {
    // Create/Add tests
  })
  
  describe('delete operation', () => {
    // Remove tests
  })
  
  describe('update operation', () => {
    // Modify tests
  })
  
  describe('search operation', () => {
    // Query/Filter tests
  })
  
  describe('integration scenarios', () => {
    // Multiple operations together
  })
})
```

## Inspection Order

Follow this order when testing CRUD hooks:

### 1. Initialization Tests (2-3 tests)
```typescript
describe('initialization', () => {
  it('initializes with empty items array', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.items).toEqual([])
  })
  
  it('provides all required methods', () => {
    const { result } = renderHook(() => useMyHook())
    expect(typeof result.current.addItem).toBe('function')
    expect(typeof result.current.deleteItem).toBe('function')
    expect(typeof result.current.updateItem).toBe('function')
    expect(typeof result.current.searchItems).toBe('function')
  })
})
```

### 2. Add/Create Operation Tests (5-7 tests)
```typescript
describe('add operation', () => {
  it('adds a single item', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('New Item')
    })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].text).toBe('New Item')
  })
  
  it('validates input before adding', () => {
    const { result } = renderHook(() => useMyHook())
    act(() => {
      result.current.addItem('')
    })
    expect(result.current.items).toHaveLength(0)
  })
  
  // More tests for multiple adds, trimming, unique IDs, etc.
})
```

### 3. Delete/Remove Operation Tests (4-5 tests)
```typescript
describe('delete operation', () => {
  it('removes an item by id', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('Item 1')
    })
    
    const itemId = result.current.items[0].id
    
    act(() => {
      result.current.deleteItem(itemId)
    })
    
    expect(result.current.items).toHaveLength(0)
  })
  
  // More tests for multiple items, non-existent ID, etc.
})
```

### 4. Update/Modify Operation Tests (6-8 tests)
```typescript
describe('update operation', () => {
  it('updates an item', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('Original')
    })
    
    const itemId = result.current.items[0].id
    
    act(() => {
      result.current.updateItem(itemId, { text: 'Updated' })
    })
    
    expect(result.current.items[0].text).toBe('Updated')
  })
  
  it('preserves item properties during update', () => {
    // Verify ID and other fields stay unchanged
  })
  
  // More tests for toggle operations, multiple updates, etc.
})
```

### 5. Search/Filter Operation Tests (6-8 tests)
```typescript
describe('search operation', () => {
  it('returns all items when search is empty', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('Item 1')
      result.current.addItem('Item 2')
    })
    
    const filtered = result.current.searchItems('')
    expect(filtered).toHaveLength(2)
  })
  
  it('filters items by search term', () => {
    const { result } = renderHook(() => useMyHook())
    
    act(() => {
      result.current.addItem('Apple')
      result.current.addItem('Banana')
    })
    
    const filtered = result.current.searchItems('Apple')
    expect(filtered).toHaveLength(1)
    expect(filtered[0].text).toBe('Apple')
  })
  
  it('searches case-insensitively', () => {
    // Test 'apple' matches 'APPLE'
  })
  
  // More tests for partial matches, no matches, special chars, etc.
})
```

### 6. Integration Scenario Tests (2-4 tests)
```typescript
describe('integration scenarios', () => {
  it('handles multiple operations in sequence', () => {
    const { result } = renderHook(() => useMyHook())
    
    // Add items
    act(() => {
      result.current.addItem('Item 1')
      result.current.addItem('Item 2')
      result.current.addItem('Item 3')
    })
    expect(result.current.items).toHaveLength(3)
    
    // Search
    const filtered = result.current.searchItems('Item 1')
    expect(filtered).toHaveLength(1)
    
    // Update
    act(() => {
      result.current.updateItem(result.current.items[0].id, { text: 'Updated' })
    })
    
    // Delete
    act(() => {
      result.current.deleteItem(result.current.items[1].id)
    })
    
    expect(result.current.items).toHaveLength(2)
  })
  
  // More integration tests
})
```

## Coverage Checklist

For CRUD hooks, target these coverage areas:

### State & Initialization
- [ ] Hook initializes with empty items array
- [ ] Hook initializes with empty object/map (if applicable)
- [ ] All methods are available and callable
- [ ] Type signatures are correct

### Add/Create
- [ ] Add single item
- [ ] Add multiple items
- [ ] Input validation (empty, whitespace)
- [ ] Unique ID generation
- [ ] Text trimming/cleanup
- [ ] Max item limits (if applicable)

### Delete/Remove
- [ ] Delete by ID
- [ ] Delete when multiple exist
- [ ] Delete non-existent ID (gracefully)
- [ ] Delete all items one-by-one
- [ ] Correct items removed

### Update/Modify
- [ ] Update specific item by ID
- [ ] Update only target (others unchanged)
- [ ] Preserve item ID
- [ ] Preserve other properties
- [ ] Toggle/boolean operations
- [ ] Non-existent ID handling

### Search/Filter
- [ ] Empty search returns all
- [ ] Search finds matches
- [ ] Case-insensitive search
- [ ] Partial matching
- [ ] No matches found
- [ ] Property preservation
- [ ] Special characters

### Edge Cases
- [ ] Empty input
- [ ] Whitespace-only input
- [ ] Very long input
- [ ] Special characters
- [ ] Operations on empty list
- [ ] Rapid consecutive operations
- [ ] State consistency

## Common Patterns

### Adding a Todo-Like Item
```typescript
act(() => {
  result.current.addItem('Task name')
})

expect(result.current.items).toHaveLength(1)
expect(result.current.items[0]).toMatchObject({
  text: 'Task name',
  completed: false
})
```

### Searching/Filtering
```typescript
const filtered = result.current.searchItems('keyword')

expect(filtered).toHaveLength(expectedCount)
expect(filtered.every(i => i.text.includes('keyword'))).toBe(true)
```

### Preserving Properties During Update
```typescript
const originalId = result.current.items[0].id
const originalText = result.current.items[0].text

act(() => {
  result.current.updateItem(originalId, { completed: true })
})

expect(result.current.items[0].id).toBe(originalId)
expect(result.current.items[0].text).toBe(originalText)
expect(result.current.items[0].completed).toBe(true)
```

## Tips for CRUD Hook Tests

1. **Always use act()** for state updates
2. **Test in order**: Initialize → Add → Delete → Update → Search → Integrate
3. **Group tests by operation** using describe blocks
4. **Use descriptive test names** that explain what's being tested
5. **Test both happy path and edge cases**
6. **Verify state consistency** across operations
7. **Check property preservation** after updates
8. **Test error handling** for invalid inputs

## Summary

To test any CRUD hook:
1. Follow the inspection order: Init → Add → Delete → Update → Search → Integrate
2. Use the test organization structure with describe blocks
3. Adapt code examples from `useTodos-hook-testing-guide.md`
4. Refer to `templates/useTodos.test.ts` for detailed patterns
5. Use the coverage checklist to ensure comprehensive testing

See `../useTodos-hook-testing-guide.md` for the complete, detailed walkthrough.
