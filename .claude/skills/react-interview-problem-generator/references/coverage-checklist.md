# Hook Test Coverage Checklist - useTodos Example

## Overview

This checklist helps ensure your hook tests have comprehensive coverage of all important functionality.

**Scope**: This checklist uses the **useTodos hook as an example** for CRUD-based state management hooks.

**For universal coverage concepts**, see: `hook-testing-framework.md`

**For other hook types**, adapt the checklist based on: `custom-hook-testing/` guides

## State Initialization (5 tests)

- [ ] Hook initializes with correct default state
- [ ] Hook initializes with empty collections (arrays, objects)
- [ ] Hook provides all expected methods/functions
- [ ] Hook provides all expected state values
- [ ] Type signatures are correct for state and methods

## Create/Add Operations (6 tests)

- [ ] Adds single item correctly
- [ ] Adds multiple items in sequence
- [ ] Generates unique IDs for items
- [ ] Rejects empty/invalid input
- [ ] Trims whitespace from input
- [ ] Validates input format (if applicable)

## Read/Query Operations (7 tests)

- [ ] Returns all items when no filter applied
- [ ] Filters items by search term
- [ ] Search is case-insensitive (if applicable)
- [ ] Returns empty array when no matches found
- [ ] Supports partial matching
- [ ] Preserves item properties in results
- [ ] Handles special characters in search

## Update/Modify Operations (6 tests)

- [ ] Updates specific item by ID
- [ ] Updates only target item (others unchanged)
- [ ] Preserves item ID during update
- [ ] Preserves other item properties during update
- [ ] Handles toggle/boolean operations correctly
- [ ] Handles non-existent ID gracefully

## Delete/Remove Operations (5 tests)

- [ ] Removes item by ID
- [ ] Removes correct item when multiple exist
- [ ] Handles deletion of non-existent ID
- [ ] Can delete all items one by one
- [ ] Results in empty collection after removing all items

## Edge Cases (8 tests)

- [ ] Handles empty input
- [ ] Handles whitespace-only input
- [ ] Handles very long input
- [ ] Handles special characters
- [ ] Handles operations on empty collection
- [ ] Handles operations with negative/invalid IDs
- [ ] Handles null/undefined values
- [ ] Handles concurrent operations

## State Consistency (6 tests)

- [ ] State remains consistent after add operation
- [ ] State remains consistent after delete operation
- [ ] State remains consistent after update operation
- [ ] Collection length matches actual items
- [ ] All item IDs are unique
- [ ] No data loss during operations

## Integration Scenarios (5 tests)

- [ ] Performs add → search → toggle → delete sequence
- [ ] Maintains state across multiple operations
- [ ] Handles rapid consecutive operations
- [ ] Handles operations in different order
- [ ] Results are predictable and reproducible

## Performance/Optimization (3 tests)

- [ ] Methods are stable (useCallback)
- [ ] Expensive operations don't re-render unnecessarily
- [ ] Large datasets handle efficiently (if applicable)

## Type Safety (3 tests)

- [ ] All return types are correct
- [ ] All parameters accept correct types
- [ ] Type inference works correctly

---

## Coverage by Hook Type

### CRUD Hook (Todo, Task Management)

**Must Cover:**
- [ ] Initialization with empty array
- [ ] Add with validation (trim, empty check)
- [ ] Add multiple items in sequence
- [ ] Generate unique IDs
- [ ] Delete by ID (specific, wrong ID, empty state)
- [ ] Toggle/update (toggle only target, preserve other fields)
- [ ] Search (empty term, partial match, case-insensitive, no match)
- [ ] Integration (add → search → toggle → delete)

**Test Count:** 15-20 tests

### Input Formatter Hook (Phone, Date, Currency)

**Must Cover:**
- [ ] Initialization with empty value
- [ ] Format single input
- [ ] Handle partial input
- [ ] Validate format
- [ ] Remove invalid characters
- [ ] Handle empty string
- [ ] Handle special cases (leading zeros, decimals)
- [ ] Edge cases (max length, min length)

**Test Count:** 10-15 tests

### Async Data Hook (Fetch, API calls)

**Must Cover:**
- [ ] Initialization (loading state, no data)
- [ ] Successful fetch
- [ ] Error handling
- [ ] Refetch capability
- [ ] Loading state transitions
- [ ] Data caching (if applicable)
- [ ] Timeout handling
- [ ] Dependency updates trigger refetch

**Test Count:** 12-18 tests

### State Management Hook (History, Complex State)

**Must Cover:**
- [ ] Initialization with default
- [ ] State updates
- [ ] History tracking
- [ ] Undo operations
- [ ] Redo operations
- [ ] Limits on history (if applicable)
- [ ] Clear history
- [ ] Integration (set → undo → redo cycle)

**Test Count:** 14-20 tests

### Context/Provider Hook

**Must Cover:**
- [ ] Initialization with default context
- [ ] Reading context value
- [ ] Updating context value
- [ ] Multiple consumers stay in sync
- [ ] Throws when used outside provider
- [ ] Persistence (localStorage if applicable)
- [ ] Override default value
- [ ] Cleanup on unmount

**Test Count:** 10-16 tests

---

## Coverage Percentage Goals

| Area | Target |
|------|--------|
| Statements | 80%+ |
| Branches | 75%+ |
| Functions | 85%+ |
| Lines | 80%+ |

## Check Coverage

```bash
# Generate coverage report
pnpm test -- --coverage

# View coverage in browser
open coverage/index.html

# Check specific file coverage
pnpm test -- --coverage src/features/todo/hooks/useTodos.ts
```

## Coverage Report Reading

Look for:
- **Statements**: Every line of code is executed
- **Branches**: Both if/else paths are tested
- **Functions**: Every exported function is called
- **Lines**: Every line is executed

Missing coverage typically indicates:
- Edge cases not tested
- Error paths not validated
- Conditional logic not fully tested

## Improving Coverage

If coverage is below targets:

1. **Add missing edge case tests**
   ```typescript
   it('handles [specific edge case]', () => { ... })
   ```

2. **Test error conditions**
   ```typescript
   it('throws when [condition]', () => {
     expect(() => { ... }).toThrow()
   })
   ```

3. **Test all branches**
   ```typescript
   // Test if branch
   if (condition) { ... }
   
   // Test else branch
   ```

4. **Test with different inputs**
   ```typescript
   it('handles [input type]', () => { ... })
   ```

## Common Coverage Gaps

| Gap | How to Fix |
|-----|-----------|
| Error paths not tested | Add tests that trigger errors |
| Edge cases missing | Test boundary values, empty inputs |
| Branches not covered | Test both true and false conditions |
| Async not waited | Use `waitFor()` and `act()` |
| Callbacks not tested | Test functions that get called |

---

## Quick Self-Assessment

Answer these for your hook test suite:

- [ ] Do I test happy path (normal flow)?
- [ ] Do I test sad path (errors, edge cases)?
- [ ] Do I test input validation?
- [ ] Do I test state consistency?
- [ ] Do I test integrations (multiple ops)?
- [ ] Do I test all public methods?
- [ ] Do I test all state variables?
- [ ] Do I test edge values (empty, max, min)?
- [ ] Are my tests readable and maintainable?
- [ ] Would these tests catch regressions?

If you answered "yes" to all, your tests are comprehensive!

---

## Next Steps

1. **Run coverage**: `pnpm test -- --coverage`
2. **Identify gaps**: Look for red/uncovered lines
3. **Add tests**: Fill gaps with targeted tests
4. **Verify**: Re-run coverage until targets met
5. **Maintain**: Keep tests up-to-date with code changes
