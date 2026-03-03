# Context/Provider Hooks Testing Guide

## Overview

This guide shows how to test context-based hooks like useTheme, useAuth, useAppState, etc.

**Structure**: Same as other guides - follow the template structure and adapt for context.

**See also**:
- `../hook-testing-framework.md` — Universal testing concepts
- `crud-hooks.md` — CRUD pattern (follow same structure)

## Context Hook Structure

```typescript
// Context definition
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// Hook to use context
const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Provider component
export const ThemeProvider: React.FC = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  
  const toggleTheme = useCallback(() => {
    setIsDark(prev => !prev)
  }, [])
  
  const value = { isDark, toggleTheme }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

## Testing Strategy

Context hooks need **wrapper component** to provide context:

```typescript
const wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
)

const { result } = renderHook(() => useTheme(), { wrapper })
```

## Inspection Order

### 1. Initialization
- Context available inside provider
- Initial values correct
- Methods available

### 2. Reading Values
- Reads current context value
- Updates when context changes

### 3. Updating Values
- Methods update context correctly
- All consumers see update
- Updates propagate to multiple hooks

### 4. Error Handling
- Throws outside provider
- Clear error message
- No silent failures

### 5. Multiple Hook Instances
- Each instance reads same context
- Updates affect all instances
- No cross-instance interference

### 6. Integration
- Hook used within real component
- Provider wraps component tree
- Context passes through nested components

## Test Template

```typescript
describe('useTheme', () => {
  describe('initialization', () => {
    it('provides initial theme value inside provider', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result } = renderHook(() => useTheme(), { wrapper })
      
      expect(result.current.isDark).toBe(false)
    })
    
    it('provides toggle method', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result } = renderHook(() => useTheme(), { wrapper })
      
      expect(typeof result.current.toggleTheme).toBe('function')
    })
  })
  
  describe('reading values', () => {
    it('reads current context value', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result } = renderHook(() => useTheme(), { wrapper })
      
      expect(result.current.isDark).toBe(false)
    })
    
    it('reflects context changes', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result } = renderHook(() => useTheme(), { wrapper })
      
      expect(result.current.isDark).toBe(false)
      
      act(() => {
        result.current.toggleTheme()
      })
      
      expect(result.current.isDark).toBe(true)
    })
  })
  
  describe('updating values', () => {
    it('toggles theme correctly', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result } = renderHook(() => useTheme(), { wrapper })
      
      expect(result.current.isDark).toBe(false)
      
      act(() => {
        result.current.toggleTheme()
      })
      
      expect(result.current.isDark).toBe(true)
      
      act(() => {
        result.current.toggleTheme()
      })
      
      expect(result.current.isDark).toBe(false)
    })
  })
  
  describe('error handling', () => {
    it('throws error when used outside provider', () => {
      // Suppress error output in test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within ThemeProvider')
      
      consoleSpy.mockRestore()
    })
    
    it('provides helpful error message', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
      
      try {
        renderHook(() => useTheme())
      } catch (e: any) {
        expect(e.message).toContain('ThemeProvider')
      }
      
      consoleSpy.mockRestore()
    })
  })
  
  describe('multiple hook instances', () => {
    it('allows multiple hooks to read same context', () => {
      const wrapper = ({ children }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )
      
      const { result: result1 } = renderHook(() => useTheme(), { wrapper })
      const { result: result2 } = renderHook(() => useTheme(), { wrapper })
      
      expect(result1.current.isDark).toBe(result2.current.isDark)
    })
    
    it('updates propagate to all hook instances', () => {
      let updateTrigger: () => void = () => {}
      
      const TestProvider = ({ children }: any) => {
        const [isDark, setIsDark] = useState(false)
        updateTrigger = () => setIsDark(!isDark)
        
        return (
          <ThemeContext.Provider value={{ isDark, toggleTheme: updateTrigger }}>
            {children}
          </ThemeContext.Provider>
        )
      }
      
      const wrapper = ({ children }: any) => (
        <TestProvider>{children}</TestProvider>
      )
      
      const { result: result1 } = renderHook(() => useTheme(), { wrapper })
      const { result: result2 } = renderHook(() => useTheme(), { wrapper })
      
      act(() => {
        updateTrigger()
      })
      
      expect(result1.current.isDark).toBe(true)
      expect(result2.current.isDark).toBe(true)
    })
  })
  
  describe('integration with component', () => {
    it('works within a component', () => {
      const TestComponent = () => {
        const { isDark } = useTheme()
        return <div>{isDark ? 'dark' : 'light'}</div>
      }
      
      const { container } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(container.textContent).toContain('light')
    })
    
    it('propagates through component tree', () => {
      const DeepComponent = () => {
        const { isDark } = useTheme()
        return <div>{isDark ? 'dark' : 'light'}</div>
      }
      
      const MiddleComponent = () => {
        return <DeepComponent />
      }
      
      const { container } = render(
        <ThemeProvider>
          <MiddleComponent />
        </ThemeProvider>
      )
      
      expect(container.textContent).toContain('light')
    })
  })
})
```

## Coverage Goals

- Hook available inside provider
- Initial values correct
- Methods callable and functional
- Context updates propagate to all consumers
- Throws error outside provider with helpful message
- Multiple hook instances read same context
- Updates visible to all instances
- Works with nested components
- Provider can be at any level in tree

## Key Patterns

### Basic Hook Test with Wrapper
```typescript
const wrapper = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
)
const { result } = renderHook(() => useTheme(), { wrapper })
```

### Update and Assert
```typescript
act(() => {
  result.current.toggleTheme()
})
expect(result.current.isDark).toBe(true)
```

### Error Handling
```typescript
const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
expect(() => {
  renderHook(() => useTheme())
}).toThrow('useTheme must be used within ThemeProvider')
consoleSpy.mockRestore()
```

### Component Integration
```typescript
const TestComponent = () => {
  const { isDark } = useTheme()
  return <div>{isDark ? 'dark' : 'light'}</div>
}

const { container } = render(
  <ThemeProvider>
    <TestComponent />
  </ThemeProvider>
)
```

## Tips

1. Always use wrapper component for context hooks
2. Test error case (hook outside provider)
3. Test multiple hook instances read same context
4. Test that updates propagate to all consumers
5. Test with real components when possible
6. Mock console.error when testing error cases
7. Verify wrapper structure prevents silent failures
8. Test nested component trees

See `crud-hooks.md` for detailed CRUD example.
