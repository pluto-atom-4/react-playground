# Vitest Hook Test Patterns - By Hook Type

## Overview

This guide provides test pattern templates for different types of custom React hooks.

**Note**: Pattern 1 (CRUD) uses the **useTodos hook as a detailed example**. See `useTodos-hook-testing-guide.md` for complete walkthrough.

For universal testing concepts, see: `hook-testing-framework.md`

## Pattern 1: CRUD Hook (Create, Read, Update, Delete)

**Used for**: Todo, Task, Item management hooks
**Example**: useTodos, useItems, useUsers

**useTodos Example** (detailed in `useTodos-hook-testing-guide.md`):
```typescript
import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { describe, it, expect } from 'vitest'

describe('useTodos', () => {
  describe('read - todos state', () => {
    it('initializes with empty array', () => {
      const { result } = renderHook(() => useTodos())
      expect(result.current.todos).toEqual([])
    })
  })

  describe('create - add operations', () => {
    it('adds a new item', () => {
      const { result } = renderHook(() => useItemManager())
      act(() => {
        result.current.addItem('Item 1')
      })
      expect(result.current.items).toHaveLength(1)
    })

    it('validates input', () => {
      const { result } = renderHook(() => useItemManager())
      act(() => {
        result.current.addItem('')
      })
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('update - toggle operations', () => {
    it('toggles item property', () => {
      const { result } = renderHook(() => useItemManager())
      act(() => {
        result.current.addItem('Item')
      })
      const id = result.current.items[0].id
      act(() => {
        result.current.toggleItem(id)
      })
      expect(result.current.items[0].completed).toBe(true)
    })
  })

  describe('delete - remove operations', () => {
    it('removes item by id', () => {
      const { result } = renderHook(() => useItemManager())
      act(() => {
        result.current.addItem('Item')
      })
      const id = result.current.items[0].id
      act(() => {
        result.current.deleteItem(id)
      })
      expect(result.current.items).toHaveLength(0)
    })
  })

  describe('search - filter operations', () => {
    it('filters items by term', () => {
      const { result } = renderHook(() => useItemManager())
      act(() => {
        result.current.addItem('React')
        result.current.addItem('Vue')
      })
      const filtered = result.current.search('React')
      expect(filtered).toHaveLength(1)
    })
  })
})
```

## Pattern 2: State Transform Hook (Input → Output)

Used for: Phone Formatter, Debounce, Validation hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useFormatter } from '../useFormatter'
import { describe, it, expect } from 'vitest'

describe('useFormatter', () => {
  describe('initialization', () => {
    it('starts with empty value', () => {
      const { result } = renderHook(() => useFormatter())
      expect(result.current.value).toBe('')
    })
  })

  describe('input transformation', () => {
    it('formats input correctly', () => {
      const { result } = renderHook(() => useFormatter())
      act(() => {
        result.current.setValue('1234567890')
      })
      expect(result.current.formattedValue).toBe('(123) 456-7890')
    })

    it('handles partial input', () => {
      const { result } = renderHook(() => useFormatter())
      act(() => {
        result.current.setValue('123')
      })
      expect(result.current.formattedValue).toBe('(123)')
    })

    it('validates format', () => {
      const { result } = renderHook(() => useFormatter())
      act(() => {
        result.current.setValue('abc')
      })
      expect(result.current.isValid).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('handles empty string', () => {
      const { result } = renderHook(() => useFormatter())
      act(() => {
        result.current.setValue('')
      })
      expect(result.current.formattedValue).toBe('')
    })

    it('removes invalid characters', () => {
      const { result } = renderHook(() => useFormatter())
      act(() => {
        result.current.setValue('123-456-7890')
      })
      expect(result.current.value).toBe('1234567890')
    })
  })
})
```

## Pattern 3: Async/Data Fetching Hook

Used for: API calls, data loading hooks

```typescript
import { renderHook, act, waitFor } from '@testing-library/react'
import { useFetchData } from '../useFetchData'
import { describe, it, expect, vi } from 'vitest'

describe('useFetchData', () => {
  describe('initialization', () => {
    it('starts in loading state', () => {
      const { result } = renderHook(() => useFetchData())
      expect(result.current.isLoading).toBe(true)
      expect(result.current.data).toBeNull()
    })
  })

  describe('successful fetch', () => {
    it('loads data successfully', async () => {
      const { result } = renderHook(() => useFetchData())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.data).toBeDefined()
      expect(result.current.error).toBeNull()
    })
  })

  describe('error handling', () => {
    it('handles fetch error', async () => {
      vi.mock('../api', () => ({
        fetchData: vi.fn().mockRejectedValue(new Error('Network error'))
      }))
      
      const { result } = renderHook(() => useFetchData())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeNull()
    })
  })

  describe('refetch', () => {
    it('refetches data on command', async () => {
      const { result } = renderHook(() => useFetchData())
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      const firstData = result.current.data
      
      act(() => {
        result.current.refetch()
      })
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(result.current.data).toBeDefined()
    })
  })
})
```

## Pattern 4: Complex State Hook (History/Undo)

Used for: Counter with Undo/Redo, rich editor hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useHistory } from '../useHistory'
import { describe, it, expect } from 'vitest'

describe('useHistory', () => {
  describe('initialization', () => {
    it('starts with initial value', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(result.current.value).toBe(0)
    })

    it('initializes with empty history', () => {
      const { result } = renderHook(() => useHistory(0))
      expect(result.current.history).toEqual([0])
    })
  })

  describe('state changes', () => {
    it('updates value and adds to history', () => {
      const { result } = renderHook(() => useHistory(0))
      act(() => {
        result.current.setValue(1)
      })
      expect(result.current.value).toBe(1)
      expect(result.current.history).toContain(1)
    })
  })

  describe('undo', () => {
    it('reverts to previous state', () => {
      const { result } = renderHook(() => useHistory(0))
      act(() => {
        result.current.setValue(1)
        result.current.setValue(2)
      })
      act(() => {
        result.current.undo()
      })
      expect(result.current.value).toBe(1)
    })

    it('cannot undo past initial state', () => {
      const { result } = renderHook(() => useHistory(0))
      act(() => {
        result.current.undo()
      })
      expect(result.current.value).toBe(0)
    })
  })

  describe('redo', () => {
    it('moves forward in history', () => {
      const { result } = renderHook(() => useHistory(0))
      act(() => {
        result.current.setValue(1)
        result.current.setValue(2)
      })
      act(() => {
        result.current.undo()
        result.current.redo()
      })
      expect(result.current.value).toBe(2)
    })
  })

  describe('integration', () => {
    it('performs undo-redo cycle', () => {
      const { result } = renderHook(() => useHistory(0))
      act(() => {
        result.current.setValue(1)
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
  })
})
```

## Pattern 5: Context/Provider Hook

Used for: Theme, Auth, Settings hooks

```typescript
import { renderHook, act } from '@testing-library/react'
import { useTheme, ThemeProvider } from '../useTheme'
import { describe, it, expect } from 'vitest'

describe('useTheme', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  )

  describe('initialization', () => {
    it('starts with default theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })
      expect(result.current.theme).toBe('light')
    })
  })

  describe('theme switching', () => {
    it('toggles theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })
      act(() => {
        result.current.toggle()
      })
      expect(result.current.theme).toBe('dark')
    })

    it('sets specific theme', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })
      act(() => {
        result.current.setTheme('dark')
      })
      expect(result.current.theme).toBe('dark')
    })
  })

  describe('persistence', () => {
    it('persists theme preference', () => {
      const { result } = renderHook(() => useTheme(), { wrapper })
      act(() => {
        result.current.setTheme('dark')
      })
      
      // Re-render
      const { result: result2 } = renderHook(() => useTheme(), { wrapper })
      expect(result2.current.theme).toBe('dark')
    })
  })
})
```

## Testing Checklist

For any custom hook test:

- ✅ **Initialization**: Does the hook start with correct default state?
- ✅ **Primary Operations**: Do the main methods work correctly?
- ✅ **State Updates**: Does state change appropriately after operations?
- ✅ **State Consistency**: Do related state values stay consistent?
- ✅ **Edge Cases**: Does the hook handle empty, null, or invalid inputs?
- ✅ **Validation**: Does input validation work as expected?
- ✅ **Sequential Operations**: Do multiple operations in sequence work correctly?
- ✅ **Integration**: Do multiple operations together maintain correct state?
- ✅ **Error Handling**: Does the hook gracefully handle errors?
- ✅ **Type Safety**: Are types correct in TypeScript?

## Running Tests

```bash
# All tests
pnpm test

# Specific pattern
pnpm test hook-testing-guide

# With coverage
pnpm test -- --coverage

# Watch mode
pnpm test -- --watch
```
