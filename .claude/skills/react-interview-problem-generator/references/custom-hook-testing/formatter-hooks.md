# Formatter Hooks Testing Guide

## Overview

This guide shows how to test input formatter hooks like usePhoneFormatter, useCurrencyFormatter, useDateFormatter, etc.

**Structure**: Same as other guides - follow the template structure and adapt for formatters.

**See also**:
- `../hook-testing-framework.md` — Universal testing concepts
- `crud-hooks.md` — CRUD pattern (follow same structure)

## Formatter Hook Structure

```typescript
const usePhoneFormatter = () => {
  const [value, setValue] = useState('')
  
  const format = useCallback((input: string) => {
    const cleaned = input.replace(/\D/g, '')
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
  }, [])
  
  const isValid = useCallback((input: string) => {
    return /^\d{10}$/.test(input.replace(/\D/g, ''))
  }, [])
  
  return { value, setValue, format, isValid }
}
```

## Inspection Order

### 1. Initialization
- Starts with empty/default value
- Methods available and callable
- Type signatures correct

### 2. Formatting
- Single character input
- Partial input
- Complete valid input
- Invalid characters handled

### 3. Validation
- Valid format accepted
- Invalid format rejected
- Empty input handling
- Edge cases (leading zeros, special chars)

### 4. State Management
- Value updates correctly
- Multiple consecutive updates
- Value reset/clear

### 5. Integration
- Format then validate
- Multiple operations in sequence
- State consistency

## Test Template

```typescript
describe('usePhoneFormatter', () => {
  describe('initialization', () => {
    it('starts with empty value', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      expect(result.current.value).toBe('')
    })
    
    it('provides format and isValid methods', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      expect(typeof result.current.format).toBe('function')
      expect(typeof result.current.isValid).toBe('function')
    })
  })
  
  describe('formatting', () => {
    it('formats valid phone number', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      const formatted = result.current.format('1234567890')
      expect(formatted).toBe('(123) 456-7890')
    })
    
    it('handles partial input', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      const formatted = result.current.format('123')
      expect(formatted).toBe('(123) ')
    })
    
    it('removes non-digit characters', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      const formatted = result.current.format('123-456-7890')
      expect(formatted).toBe('(123) 456-7890')
    })
  })
  
  describe('validation', () => {
    it('validates correct format', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      expect(result.current.isValid('1234567890')).toBe(true)
    })
    
    it('rejects invalid format', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      expect(result.current.isValid('123')).toBe(false)
    })
    
    it('handles empty input', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      expect(result.current.isValid('')).toBe(false)
    })
  })
  
  describe('edge cases', () => {
    it('handles special characters', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      const formatted = result.current.format('(123) 456-7890')
      expect(formatted).toBe('(123) 456-7890')
    })
    
    it('handles leading zeros', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      const formatted = result.current.format('0001234567')
      expect(formatted).toContain('0001234567')
    })
  })
  
  describe('integration', () => {
    it('formats then validates', () => {
      const { result } = renderHook(() => usePhoneFormatter())
      
      const formatted = result.current.format('1234567890')
      const isValid = result.current.isValid(formatted.replace(/\D/g, ''))
      
      expect(isValid).toBe(true)
    })
  })
})
```

## Coverage Goals

- Initialization with correct defaults
- Formatting single inputs
- Formatting partial inputs
- Formatting with special characters
- Validation of correct format
- Validation of incorrect format
- Edge cases (empty, too long, special chars)
- Error handling for invalid inputs
- Integration of format + validate

## Key Patterns

### Input Validation
```typescript
const isValid = result.current.isValid('test-input')
expect(isValid).toBe(true/false)
```

### Format Verification
```typescript
const formatted = result.current.format('input')
expect(formatted).toBe('expected-format')
```

### State Updates
```typescript
act(() => {
  result.current.setValue('new-value')
})
expect(result.current.value).toBe('new-value')
```

## Tips

1. Test formatting with various input types
2. Verify validation works for valid and invalid inputs
3. Test edge cases (empty, very long, special chars)
4. Check that formatting doesn't lose data
5. Verify state updates correctly
6. Test integration of multiple operations

See `crud-hooks.md` for detailed CRUD example following same structure.
