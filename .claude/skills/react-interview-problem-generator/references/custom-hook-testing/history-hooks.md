# History/Undo-Redo Hooks Testing Guide

## Overview

This guide shows how to test history-based hooks like useHistory, useUndo, useUndoRedo, etc.

**Structure**: Same as other guides - follow the template structure and adapt for history.

**See also**:
- `../hook-testing-framework.md` — Universal testing concepts
- `crud-hooks.md` — CRUD pattern (follow same structure)

## History Hook Structure

```typescript
const useHistory = <T>(initialValue: T) => {
  const [value, setValue] = useState(initialValue)
  const [history, setHistory] = useState([initialValue])
  const [pointer, setPointer] = useState(0)
  
  const push = useCallback((newValue: T) => {
    setHistory(prev => [...prev.slice(0, pointer + 1), newValue])
    setPointer(prev => prev + 1)
    setValue(newValue)
  }, [pointer])
  
  const undo = useCallback(() => {
    if (pointer > 0) {
      setPointer(prev => prev - 1)
      setValue(history[pointer - 1])
    }
  }, [pointer, history])
  
  const redo = useCallback(() => {
    if (pointer < history.length - 1) {
      setPointer(prev => prev + 1)
      setValue(history[pointer + 1])
    }
  }, [pointer, history])
  
  return { value, history, push, undo, redo, canUndo: pointer > 0, canRedo: pointer < history.length - 1 }
}
```

## Inspection Order

### 1. Initialization
- Starts with initial value
- History includes initial value
- Pointer at start
- Methods available

### 2. Push/Add Operations
- Adds value to history
- Updates current value
- Increments pointer
- Replaces future history on new push after undo

### 3. Undo Operations
- Reverts to previous state
- Updates pointer
- Doesn't remove from history
- Handles boundary (can't undo past start)

### 4. Redo Operations
- Moves forward in history
- Updates pointer
- Restores previous state
- Handles boundary (can't redo past end)

### 5. State Validation
- History integrity maintained
- Pointer valid at all times
- canUndo/canRedo flags correct

### 6. Integration
- Push-Undo-Redo sequences
- Multiple undos in sequence
- New push after undo clears future

## Test Template

```typescript
describe('useHistory', () => {
  describe('initialization', () => {
    it('starts with initial value', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(result.current.value).toBe(0)
    })
    
    it('initializes history with initial value', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(result.current.history).toEqual([0])
    })
    
    it('starts with pointer at 0', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(result.current.pointer).toBe(0)
    })
    
    it('provides push, undo, redo methods', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(typeof result.current.push).toBe('function')
      expect(typeof result.current.undo).toBe('function')
      expect(typeof result.current.redo).toBe('function')
    })
  })
  
  describe('push operation', () => {
    it('adds value to history', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
      })
      
      expect(result.current.history).toContain(1)
      expect(result.current.history).toHaveLength(2)
    })
    
    it('updates current value', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
      })
      
      expect(result.current.value).toBe(1)
    })
    
    it('increments pointer', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
      })
      
      expect(result.current.pointer).toBe(1)
    })
    
    it('adds multiple values in sequence', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
        result.current.push(3)
      })
      
      expect(result.current.history).toEqual([0, 1, 2, 3])
      expect(result.current.pointer).toBe(3)
    })
  })
  
  describe('undo operation', () => {
    it('reverts to previous value', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
      })
      
      expect(result.current.value).toBe(2)
      
      act(() => {
        result.current.undo()
      })
      
      expect(result.current.value).toBe(1)
    })
    
    it('decrements pointer', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
      })
      
      act(() => {
        result.current.undo()
      })
      
      expect(result.current.pointer).toBe(0)
    })
    
    it('cannot undo past start', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.undo()
      })
      
      expect(result.current.value).toBe(0)
      expect(result.current.pointer).toBe(0)
    })
    
    it('sets canUndo flag correctly', () => {
      const { result } = renderHook(() => useHistory(0))
      
      expect(result.current.canUndo).toBe(false)
      
      act(() => {
        result.current.push(1)
      })
      
      expect(result.current.canUndo).toBe(true)
    })
  })
  
  describe('redo operation', () => {
    it('moves forward in history', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
        result.current.undo()
      })
      
      expect(result.current.value).toBe(1)
      
      act(() => {
        result.current.redo()
      })
      
      expect(result.current.value).toBe(2)
    })
    
    it('increments pointer', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.undo()
      })
      
      expect(result.current.pointer).toBe(0)
      
      act(() => {
        result.current.redo()
      })
      
      expect(result.current.pointer).toBe(1)
    })
    
    it('cannot redo past end', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.redo()
      })
      
      expect(result.current.value).toBe(1)
    })
    
    it('sets canRedo flag correctly', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.undo()
      })
      
      expect(result.current.canRedo).toBe(true)
      
      act(() => {
        result.current.redo()
      })
      
      expect(result.current.canRedo).toBe(false)
    })
  })
  
  describe('undo-redo cycle', () => {
    it('performs undo-redo cycle', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
      })
      expect(result.current.value).toBe(1)
      
      act(() => {
        result.current.undo()
      })
      expect(result.current.value).toBe(0)
      
      act(() => {
        result.current.redo()
      })
      expect(result.current.value).toBe(1)
    })
    
    it('clears future history on push after undo', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
        result.current.push(3)
      })
      
      act(() => {
        result.current.undo()
        result.current.undo()
      })
      
      act(() => {
        result.current.push(10)
      })
      
      // History should be [0, 1, 10] not [0, 1, 2, 10]
      expect(result.current.history).toEqual([0, 1, 10])
    })
  })
  
  describe('edge cases', () => {
    it('handles multiple undos in sequence', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
        result.current.push(3)
      })
      
      act(() => {
        result.current.undo()
        result.current.undo()
      })
      
      expect(result.current.value).toBe(1)
      expect(result.current.pointer).toBe(1)
    })
    
    it('maintains history integrity throughout operations', () => {
      const { result } = renderHook(() => useHistory(0))
      
      act(() => {
        result.current.push(1)
        result.current.push(2)
        result.current.push(3)
        result.current.undo()
        result.current.undo()
        result.current.redo()
      })
      
      // History should still be intact
      expect(result.current.history.length).toBeGreaterThan(0)
      expect(result.current.pointer >= 0).toBe(true)
      expect(result.current.pointer < result.current.history.length).toBe(true)
    })
  })
})
```

## Coverage Goals

- Initialization with correct state and history
- Push adds to history and updates value
- Undo reverts state
- Redo moves forward
- Boundary conditions (can't undo/redo past limits)
- canUndo/canRedo flags accurate
- Multiple operations in sequence
- Future history cleared on push after undo
- History integrity maintained

## Key Patterns

### Push-Undo Sequence
```typescript
act(() => {
  result.current.push(1)
})
expect(result.current.value).toBe(1)

act(() => {
  result.current.undo()
})
expect(result.current.value).toBe(0)
```

### Complete Undo-Redo Cycle
```typescript
act(() => {
  result.current.push(1)
  result.current.undo()
  result.current.redo()
})
expect(result.current.value).toBe(1)
```

### Check Flags
```typescript
expect(result.current.canUndo).toBe(true/false)
expect(result.current.canRedo).toBe(true/false)
```

## Tips

1. Test that pointer stays valid throughout
2. Verify history is never modified (only appended)
3. Test boundary conditions explicitly
4. Check flags match pointer position
5. Test that new push after undo clears future
6. Verify state consistency across operations

See `crud-hooks.md` for detailed CRUD example.
