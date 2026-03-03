# Async/Data Fetching Hooks Testing Guide

## Overview

This guide shows how to test async data fetching hooks like useFetch, useAPI, useQuery, etc.

**Note**: This is a template guide. For detailed walkthrough examples, see the CRUD hooks guide (`crud-hooks.md`) which follows the same structure.

**See also**: 
- `../hook-testing-framework.md` — Universal testing concepts
- `../useTodos-hook-testing-guide.md` — CRUD example (follow same structure)

## Async Hook Structure

Async hooks typically have this structure:

```typescript
const useFetch = (url: string) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get(url)
      setData(response)
      setError(null)
    } catch (err) {
      setError(err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  const refetch = useCallback(() => fetch(), [fetch])
  
  return { data, loading, error, fetch, refetch }
}
```

## Test Organization

```typescript
describe('useFetch', () => {
  describe('initialization', () => {
    // Default state tests
  })
  
  describe('data fetching', () => {
    // Loading and success tests
  })
  
  describe('error handling', () => {
    // Error scenario tests
  })
  
  describe('refetch', () => {
    // Refetch operation tests
  })
  
  describe('state transitions', () => {
    // Loading → Success/Error transitions
  })
  
  describe('integration scenarios', () => {
    // Multiple operations together
  })
})
```

## Inspection Order

### 1. Initialization Tests
```typescript
describe('initialization', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    expect(result.current.error).toBeNull()
  })
  
  it('provides fetch and refetch methods', () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    expect(typeof result.current.fetch).toBe('function')
    expect(typeof result.current.refetch).toBe('function')
  })
})
```

### 2. Data Fetching Tests
```typescript
describe('data fetching', () => {
  it('successfully fetches data', async () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.data).toBeDefined()
    expect(result.current.error).toBeNull()
  })
  
  it('transitions through loading state', async () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    
    // Initially loading
    expect(result.current.isLoading).toBe(true)
    
    // Eventually loaded
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})
```

### 3. Error Handling Tests
```typescript
describe('error handling', () => {
  it('handles fetch errors', async () => {
    // Mock API to throw error
    vi.mock('../api', () => ({
      get: vi.fn().mockRejectedValue(new Error('Network error'))
    }))
    
    const { result } = renderHook(() => useFetch('/api/data'))
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
    
    expect(result.current.error).toBeDefined()
    expect(result.current.data).toBeNull()
  })
  
  it('clears error on successful retry', async () => {
    // Setup: First call fails, second succeeds
    const { result } = renderHook(() => useFetch('/api/data'))
    
    // First fetch: error
    await waitFor(() => expect(result.current.error).toBeDefined())
    
    // Refetch: success
    act(() => {
      result.current.refetch()
    })
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
      expect(result.current.error).toBeNull()
    })
  })
})
```

### 4. Refetch Tests
```typescript
describe('refetch', () => {
  it('refetches data on command', async () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const firstData = result.current.data
    
    act(() => {
      result.current.refetch()
    })
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    
    expect(result.current.data).toBeDefined()
    // Data might be same or different depending on API
  })
  
  it('triggers loading state during refetch', async () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    
    act(() => {
      result.current.refetch()
    })
    
    // Should be loading again
    expect(result.current.isLoading).toBe(true)
  })
})
```

### 5. State Transition Tests
```typescript
describe('state transitions', () => {
  it('follows correct state sequence: loading → success', async () => {
    const { result } = renderHook(() => useFetch('/api/data'))
    
    // State 1: Loading
    expect(result.current.isLoading).toBe(true)
    expect(result.current.data).toBeNull()
    
    // State 2: Success
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.data).toBeDefined()
      expect(result.current.error).toBeNull()
    })
  })
  
  it('follows correct state sequence: loading → error', async () => {
    // Mock API to throw error
    // ...
    
    // State 1: Loading
    expect(result.current.isLoading).toBe(true)
    
    // State 2: Error
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.error).toBeDefined()
      expect(result.current.data).toBeNull()
    })
  })
})
```

### 6. Integration Scenarios
```typescript
describe('integration scenarios', () => {
  it('handles fetch, error, and refetch cycle', async () => {
    // Setup: First fail, then succeed
    const { result } = renderHook(() => useFetch('/api/data'))
    
    // Initial fetch fails
    await waitFor(() => {
      expect(result.current.error).toBeDefined()
    })
    
    // Refetch succeeds
    act(() => {
      result.current.refetch()
    })
    
    await waitFor(() => {
      expect(result.current.data).toBeDefined()
      expect(result.current.error).toBeNull()
    })
  })
})
```

## Key Testing Patterns

### Using waitFor for Async Operations
```typescript
await waitFor(() => {
  expect(result.current.isLoading).toBe(false)
})
```

### Mocking API Calls
```typescript
vi.mock('../api', () => ({
  get: vi.fn().mockResolvedValue({ /* data */ })
}))
```

### Testing State Transitions
```typescript
// Check initial state
expect(result.current.isLoading).toBe(true)

// Perform async operation
await waitFor(() => {
  // Check final state
  expect(result.current.isLoading).toBe(false)
})
```

## Coverage Checklist for Async Hooks

- [ ] Initializes with correct loading state
- [ ] Initializes with null data and error
- [ ] Provides fetch and refetch methods
- [ ] Successfully fetches data
- [ ] Clears error on successful fetch
- [ ] Handles fetch errors
- [ ] Provides error details
- [ ] Clears data on error
- [ ] Refetch triggers new fetch
- [ ] Refetch shows loading state
- [ ] State transitions: loading → success
- [ ] State transitions: loading → error
- [ ] State transitions: error → success (refetch)
- [ ] Multiple refetches work correctly
- [ ] Concurrent fetches handled correctly (if applicable)
- [ ] Timeout handling (if applicable)
- [ ] Retry logic (if applicable)

## Tips for Async Hook Tests

1. **Use waitFor()** for async state changes
2. **Mock API calls** with vi.mock() or custom mocks
3. **Test state transitions** not just final state
4. **Check loading states** during operations
5. **Test error scenarios** explicitly
6. **Verify error clearing** on retry
7. **Test refetch operations** separately
8. **Handle timing** with appropriate delays

## Common Async Patterns

### Simple Fetch
```typescript
const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    api.get(url).then(setData).catch(setError).finally(() => setLoading(false))
  }, [url])
  
  return { data, loading, error }
}
```

### Fetch with Refetch
```typescript
const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const doFetch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get(url)
      setData(res)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [url])
  
  useEffect(() => { doFetch() }, [doFetch])
  
  return { data, loading, error, refetch: doFetch }
}
```

## Summary

To test async hooks:
1. Test initialization (loading state, null data)
2. Test successful data fetching with waitFor
3. Test error scenarios with mocked failures
4. Test refetch operations
5. Test state transitions through complete flow
6. Check that errors are cleared on success
7. Verify loading states during operations

See `../hook-testing-framework.md` for universal concepts and `crud-hooks.md` for CRUD-specific examples.
