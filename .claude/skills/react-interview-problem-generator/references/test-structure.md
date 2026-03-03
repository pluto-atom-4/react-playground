# Test Structure Guide

How tests are organized and what each type covers.

## Overview

Each generated problem includes three layers of testing:

1. **Vitest Unit Tests** — Component logic and state management
2. **Playwright E2E Tests** — User workflows and browser interaction
3. **Test Plan Documentation** — Future test coverage roadmap

---

## Vitest Unit Tests

**Location**: `src/features/[feature]/__tests__/[Component].test.ts`

**Purpose**: Test component logic, rendering, and state changes in isolation.

### Standard Test Structure

All unit tests follow this pattern:

```typescript
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from '../components/MyComponent'
import { describe, it, expect } from 'vitest'

describe('MyComponent', () => {
  // Test 1: Does it render?
  it('renders without error', () => {
    render(<MyComponent />)
    expect(screen.getByRole('heading', { name: /my component/i })).toBeDefined()
  })

  // Test 2: Can users interact with it?
  it('handles primary user interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    const button = screen.getByRole('button', { name: 'Action' })
    await user.click(button)

    expect(screen.getByText('Result')).toBeDefined()
  })

  // Test 3: Does state update correctly?
  it('updates state on interaction', async () => {
    const user = userEvent.setup()
    render(<MyComponent />)

    const input = screen.getByLabelText('Input')
    await user.type(input, 'test')

    expect(input).toHaveValue('test')
  })

  // Test 4: Is it accessible?
  it('has proper accessibility labels', () => {
    render(<MyComponent />)
    expect(screen.getByLabelText('Input Label')).toBeDefined()
    expect(screen.getByRole('button', { name: 'Action' })).toBeDefined()
  })
})
```

### Coverage Checklist

Each unit test file covers:

- [ ] Component renders without crashing
- [ ] Component displays expected UI elements
- [ ] Primary user interaction works (click, type, etc.)
- [ ] State updates in response to interaction
- [ ] Secondary interaction works (filter, search, etc.)
- [ ] Accessibility: `aria-label` or `aria-labelledby` present
- [ ] Accessibility: Interactive elements have semantic roles (button, input, etc.)
- [ ] Edge case: Empty state handled
- [ ] Proper TypeScript types (no `any`)

### Example: Counter with Undo/Redo

```typescript
describe('Counter with Undo/Redo', () => {
  it('renders counter at initial value', () => {
    render(<Counter initialValue={0} />)
    expect(screen.getByText('0')).toBeDefined()
  })

  it('increments on + button click', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={0} />)
    const incrementButton = screen.getByRole('button', { name: /\+/ })

    await user.click(incrementButton)
    expect(screen.getByText('1')).toBeDefined()
  })

  it('decrements on - button click', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={5} />)
    const decrementButton = screen.getByRole('button', { name: /-/ })

    await user.click(decrementButton)
    expect(screen.getByText('4')).toBeDefined()
  })

  it('undoes previous action', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={0} />)

    const incrementButton = screen.getByRole('button', { name: /\+/ })
    const undoButton = screen.getByRole('button', { name: /undo/i })

    await user.click(incrementButton) // 0 → 1
    expect(screen.getByText('1')).toBeDefined()

    await user.click(undoButton) // 1 → 0
    expect(screen.getByText('0')).toBeDefined()
  })

  it('redoes undone action', async () => {
    const user = userEvent.setup()
    render(<Counter initialValue={0} />)

    const incrementButton = screen.getByRole('button', { name: /\+/ })
    const undoButton = screen.getByRole('button', { name: /undo/i })
    const redoButton = screen.getByRole('button', { name: /redo/i })

    await user.click(incrementButton) // 0 → 1
    await user.click(undoButton) // 1 → 0
    await user.click(redoButton) // 0 → 1

    expect(screen.getByText('1')).toBeDefined()
  })
})
```

---

## Playwright E2E Tests

**Location**: `tests/e2e/[feature-name].spec.ts`

**Purpose**: Test realistic user workflows in a real browser environment.

### Standard Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('MyFeature - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the feature
    await page.goto('http://localhost:5173/practice/my-feature')
    // Wait for page to be ready
    await page.waitForLoadState('networkidle')
  })

  test('user can perform main workflow', async ({ page }) => {
    // Step 1: Find elements
    const input = page.locator('input[placeholder="..."]')
    const button = page.locator('button:has-text("Add")')

    // Step 2: Perform action
    await input.fill('test data')
    await button.click()

    // Step 3: Verify result
    await expect(page.locator('text=Result')).toBeVisible()
  })

  test('user can perform secondary workflow', async ({ page }) => {
    // Similar pattern for another user scenario
  })
})
```

### Coverage Checklist

Each e2e test file covers:

- [ ] Page loads successfully
- [ ] All UI elements are visible
- [ ] Primary workflow from start to finish
- [ ] Secondary interaction workflow
- [ ] User can view results
- [ ] No console errors
- [ ] Loading states handled
- [ ] Interactions feel natural (human-like timing)

### Example: Infinite Scroll

```typescript
test.describe('Infinite Scroll - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/practice/infinite-scroll')
    await page.waitForLoadState('networkidle')
  })

  test('initial items load and display', async ({ page }) => {
    const items = page.locator('[data-testid="scroll-item"]')
    await expect(items.first()).toBeVisible()

    const count = await items.count()
    expect(count).toBeGreaterThan(0)
  })

  test('more items load when user scrolls to bottom', async ({ page }) => {
    const items = page.locator('[data-testid="scroll-item"]')
    const initialCount = await items.count()

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500) // Wait for API call

    const newCount = await items.count()
    expect(newCount).toBeGreaterThan(initialCount)
  })

  test('loading indicator shows while fetching', async ({ page }) => {
    const loader = page.locator('[data-testid="loader"]')

    // Scroll to trigger load
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(loader).toBeVisible()

    // Loader disappears when done
    await page.waitForTimeout(1000)
    await expect(loader).not.toBeVisible()
  })
})
```

---

## Test Plan Documentation

**Location**: `docs/test-plans/[feature-name]/test-plan.md`

**Purpose**: Document what tests exist, what tests should exist, and why.

### Structure

```markdown
# [Feature Name] - Test Plan

## Happy Path (Implemented ✅)

- [x] Specific test case 1
- [x] Specific test case 2
- [x] Specific test case 3

## Alternative Flows (TODO)

- [ ] User interaction variant A
- [ ] User interaction variant B
- [ ] Different component state
- [ ] Keyboard shortcuts
- [ ] Mouse and keyboard together

## Negative Cases (TODO)

- [ ] Invalid input (empty, wrong type, too long)
- [ ] API failure (network error, timeout)
- [ ] Edge case: missing required data
- [ ] Concurrent actions (rapid clicks, etc.)

## Edge Cases (TODO)

- [ ] Boundary: 0 items
- [ ] Boundary: 1000 items
- [ ] Boundary: very long text
- [ ] Mobile viewport
- [ ] Accessibility: keyboard-only navigation
- [ ] Accessibility: screen reader

## Performance (TODO)

- [ ] Large dataset (1000+ items)
- [ ] Repeated interactions (stress test)
- [ ] Memory leaks (cleanup validation)
```

### Example: Todo List Test Plan

```markdown
# Todo List - Test Plan

## Happy Path (Implemented ✅)

- [x] Component renders
- [x] User can add a todo
- [x] User can search todos
- [x] User can mark complete
- [x] User can delete
- [x] Accessibility labels present

## Alternative Flows (TODO)

- [ ] User adds todo via Enter key (not button)
- [ ] User adds multiple todos in sequence
- [ ] User edits existing todo
- [ ] User clears completed todos
- [ ] User sorts todos (by date, alphabetical)
- [ ] User persists todos to localStorage
- [ ] User exports todos as JSON

## Negative Cases (TODO)

- [ ] Adding empty todo (should reject)
- [ ] Adding whitespace-only todo
- [ ] Todo text too long (>500 chars)
- [ ] Delete while searching
- [ ] Search with special characters
- [ ] Network error (if syncing)

## Edge Cases (TODO)

- [ ] 0 todos (empty state UI)
- [ ] 1000+ todos (performance)
- [ ] Very long todo text (wrapping)
- [ ] Unicode / emoji handling
- [ ] Mobile viewport (touch interactions)
- [ ] Keyboard-only navigation
- [ ] Screen reader navigation
- [ ] Browser back button (routing)

## Performance (TODO)

- [ ] Search doesn't lag with 100+ todos
- [ ] Memoization prevents unnecessary renders
- [ ] useCallback ensures stable references
- [ ] useEffect cleanup prevents memory leaks
```

---

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
pnpm test

# Run tests in watch mode (auto-rerun on change)
pnpm test -- --watch

# Run tests for a specific file
pnpm test -- TodoList.test.ts

# Run with coverage report
pnpm test -- --coverage
```

### E2E Tests (Playwright)

```bash
# Run all e2e tests
pnpm test:e2e

# Run tests in headed mode (see browser)
pnpm test:e2e -- --headed

# Run a specific test file
pnpm test:e2e -- todo.spec.ts

# Debug a specific test
pnpm test:e2e -- --debug
```

---

## Test Best Practices

### Query Priority (Vitest)

Always prefer in this order:
1. **By role** — `getByRole('button', { name: 'Save' })`
2. **By label** — `getByLabelText('Username')`
3. **By placeholder** — `getByPlaceholderText('Enter text')`
4. **By test ID** — `getByTestId('submit-btn')` (last resort)

❌ Avoid:
- Querying by class name
- Querying by CSS selectors
- Using `querySelector`

### Async Handling (Vitest)

Always use `userEvent` for interactions, not `fireEvent`:

```typescript
// ✅ Good
const user = userEvent.setup()
await user.click(button)
await user.type(input, 'text')

// ❌ Avoid
fireEvent.click(button)
```

### Playwright Best Practices

Always wait for elements before interacting:

```typescript
// ✅ Good
await page.waitForLoadState('networkidle')
await expect(page.locator('text=Loaded')).toBeVisible()

// ❌ Avoid
await page.goto(url)
await page.click(button) // May race condition
```

---

## What "Happy Path" Means

Happy path tests cover:
- The **most common** user scenario
- **Ideal conditions** (valid inputs, fast network, etc.)
- **Primary feature** (not edge cases or errors)

Example for Todo List:
- ✅ User adds a valid todo
- ✅ User searches for a todo
- ✅ User deletes a todo
- ❌ User adds invalid/empty todo (covered in "Negative Cases")
- ❌ User on slow network (covered in "Performance")

All generated tests are happy path only. The test-plan.md lists what else to add.
