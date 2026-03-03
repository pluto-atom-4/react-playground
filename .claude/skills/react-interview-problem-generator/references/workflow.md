# Generation Workflow

Step-by-step walkthrough of how the skill generates and integrates a new interview problem.

## Step 1: Problem Selection

You provide the problem number (1-12) or name from the problem list.

**Example input:**
```
Generate problem #1: Todo List with Filtering
```

The skill looks up the problem details from problem-list.md.

---

## Step 2: Component Generation

The skill generates a complete, working component in the feature-based structure.

### Directory Structure Created

```
src/features/todo/
├── components/
│   └── TodoList.tsx              # Main component (200-300 lines)
├── hooks/
│   └── useTodos.ts               # Custom hook for state management
├── types.ts                       # TypeScript interfaces
├── __tests__/
│   └── TodoList.test.ts           # Vitest unit tests
└── index.ts                       # Barrel export for clean imports
```

### Component Example: Todo List

**`src/features/todo/components/TodoList.tsx`**
```typescript
import React, { useState, useCallback } from 'react'
import { useTodos } from '../hooks/useTodos'
import { Todo } from '../types'

export const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleComplete, searchTodos } = useTodos()
  const [searchTerm, setSearchTerm] = useState('')
  const [input, setInput] = useState('')

  const handleAddTodo = useCallback(() => {
    if (input.trim()) {
      addTodo(input)
      setInput('')
    }
  }, [input, addTodo])

  const filteredTodos = searchTodos(searchTerm)

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      {/* Input section */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded"
          aria-label="New todo input"
        />
        <button
          onClick={handleAddTodo}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
      </div>

      {/* Search section */}
      <div className="mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search todos..."
          className="w-full px-4 py-2 border rounded"
          aria-label="Search todos"
        />
      </div>

      {/* List section */}
      <ul className="space-y-2">
        {filteredTodos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 p-3 border rounded hover:bg-gray-50"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleComplete(todo.id)}
              aria-label={`Mark "${todo.text}" as complete`}
            />
            <span
              className={`flex-1 ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-3 py-1 text-red-500 hover:bg-red-50 rounded"
              aria-label={`Delete "${todo.text}"`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filteredTodos.length === 0 && (
        <p className="text-center text-gray-400 py-8">
          {searchTerm ? 'No todos match your search' : 'No todos yet. Add one!'}
        </p>
      )}
    </div>
  )
}
```

**`src/features/todo/hooks/useTodos.ts`**
```typescript
import { useState, useCallback, useMemo } from 'react'
import { Todo } from '../types'

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ])
  }, [])

  const deleteTodo = useCallback((id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const toggleComplete = useCallback((id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    )
  }, [])

  const searchTodos = useCallback(
    (term: string) => {
      return todos.filter((todo) =>
        todo.text.toLowerCase().includes(term.toLowerCase()),
      )
    },
    [todos],
  )

  return { todos, addTodo, deleteTodo, toggleComplete, searchTodos }
}
```

**`src/features/todo/types.ts`**
```typescript
export interface Todo {
  id: number
  text: string
  completed: boolean
}
```

**`src/features/todo/index.ts`**
```typescript
export { TodoList } from './components/TodoList'
export { useTodos } from './hooks/useTodos'
export type { Todo } from './types'
```

---

## Step 3: Page Integration

A routable page wrapper is created:

**`src/pages/TodoPage.tsx`**
```typescript
import { TodoList } from '@features/todo'

export const TodoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TodoList />
    </div>
  )
}
```

And registered in `App.tsx`:

```typescript
import { TodoPage } from './pages/TodoPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* existing routes */}
        <Route path="/practice/todo" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  )
}
```

---

## Step 4: Unit Tests (Vitest)

**`src/features/todo/__tests__/TodoList.test.ts`**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '../components/TodoList'
import { describe, it, expect } from 'vitest'

describe('TodoList', () => {
  it('renders the todo list component', () => {
    render(<TodoList />)
    expect(screen.getByRole('heading', { name: /todo list/i })).toBeDefined()
  })

  it('allows adding a new todo', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Learn React')
    await user.click(button)

    expect(screen.getByText('Learn React')).toBeDefined()
  })

  it('allows toggling todo completion', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Test todo')
    await user.click(button)

    const checkbox = screen.getByRole('checkbox', { name: /test todo/i })
    expect(checkbox).not.toBeChecked()

    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('filters todos by search term', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const addInput = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByRole('button', { name: 'Add' })

    await user.type(addInput, 'Learn React')
    await user.click(addButton)

    await user.type(addInput, 'Learn Node')
    await user.click(addButton)

    const searchInput = screen.getByPlaceholderText('Search todos...')
    await user.type(searchInput, 'React')

    expect(screen.getByText('Learn React')).toBeDefined()
    expect(screen.queryByText('Learn Node')).toBeNull()
  })

  it('allows deleting a todo', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: 'Add' })

    await user.type(input, 'Delete me')
    await user.click(button)

    const deleteButton = screen.getByRole('button', { name: /delete "delete me"/i })
    await user.click(deleteButton)

    expect(screen.queryByText('Delete me')).toBeNull()
  })

  it('shows accessible labels for all interactive elements', async () => {
    render(<TodoList />)

    expect(screen.getByLabelText('New todo input')).toBeDefined()
    expect(screen.getByLabelText('Search todos')).toBeDefined()
  })
})
```

**What's tested:**
- ✅ Component renders
- ✅ Adding a todo
- ✅ Toggling completion
- ✅ Searching/filtering
- ✅ Deleting a todo
- ✅ Accessibility (labels, roles)

---

## Step 5: E2E Tests (Playwright)

**`tests/e2e/todo.spec.ts`**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Todo List - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/practice/todo')
  })

  test('user can add a todo', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const button = page.locator('button:has-text("Add")')

    await input.fill('Learn React')
    await button.click()

    await expect(page.locator('text=Learn React')).toBeVisible()
  })

  test('user can search and filter todos', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const addButton = page.locator('button:has-text("Add")')

    // Add multiple todos
    await input.fill('Learn React')
    await addButton.click()

    await input.fill('Learn Node')
    await addButton.click()

    // Search for React
    const searchInput = page.locator('input[placeholder="Search todos..."]')
    await searchInput.fill('React')

    // Verify filtering
    await expect(page.locator('text=Learn React')).toBeVisible()
    await expect(page.locator('text=Learn Node')).not.toBeVisible()
  })

  test('user can mark todo as complete and delete it', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const addButton = page.locator('button:has-text("Add")')

    // Add a todo
    await input.fill('Test todo')
    await addButton.click()

    // Mark as complete
    const checkbox = page.locator('input[type="checkbox"]').first()
    await checkbox.click()
    await expect(checkbox).toBeChecked()

    // Delete it
    const deleteButton = page.locator('button:has-text("Delete")').first()
    await deleteButton.click()

    await expect(page.locator('text=Test todo')).not.toBeVisible()
  })
})
```

**What's tested:**
- ✅ Adding a todo
- ✅ Searching and filtering
- ✅ Completing and deleting
- ✅ Real browser interaction (start to finish)

---

## Step 6: Test Coverage Documentation

**`docs/test-plans/todo/test-plan.md`**

```markdown
# Todo List - Test Plan

## Happy Path (Implemented ✅)

- [x] Component renders without error
- [x] User can add a new todo
- [x] User can search/filter todos
- [x] User can mark todo as complete
- [x] User can delete a todo
- [x] Accessibility: inputs have proper labels and roles

## Alternative Flows (TODO)

- [ ] User adds a todo via Enter key (vs. button click)
- [ ] User edits an existing todo
- [ ] User clears all todos at once
- [ ] User persists todos to localStorage
- [ ] User can undo/redo actions
- [ ] User adds a todo with special characters
- [ ] User adds a todo with emoji

## Negative Cases (TODO)

- [ ] User tries to add an empty todo (should be rejected)
- [ ] User tries to add a todo that's too long (validation)
- [ ] Search is case-insensitive
- [ ] Deleting non-existent todo (should not crash)
- [ ] Rapid consecutive additions (stress test)

## Edge Cases (TODO)

- [ ] Empty list displays appropriate message
- [ ] 1000+ todos render with acceptable performance
- [ ] Very long todo text wraps correctly
- [ ] Mobile viewport (narrow screen)
- [ ] Focus management (keyboard navigation)
- [ ] Screen reader navigation (semantic HTML)
- [ ] Back button behavior (routing)

## Performance Considerations (TODO)

- [ ] Search doesn't cause noticeable lag with 100+ todos
- [ ] Memoization prevents unnecessary re-renders
- [ ] useCallback improves callback stability
- [ ] Virtual scrolling for large lists (future enhancement)
```

---

## Full File Output Summary

After generation, your project structure looks like:

```
src/
  features/
    todo/
      components/TodoList.tsx
      hooks/useTodos.ts
      types.ts
      __tests__/TodoList.test.ts
      index.ts
  pages/
    TodoPage.tsx
  App.tsx (updated)

tests/
  e2e/
    todo.spec.ts

docs/
  test-plans/
    todo/
      test-plan.md
```

---

## Running the Generated Code

**Start the dev server:**
```bash
pnpm dev
```

**Run unit tests:**
```bash
pnpm test
```

**Run e2e tests:**
```bash
pnpm test:e2e
```

**Navigate in browser:**
Visit `http://localhost:5173/practice/todo` to see the component running live.

---

## Next Steps

1. ✅ All happy path tests should pass
2. Review the component and understand the pattern
3. Add tests from the test-plan.md checklist
4. Customize and extend the component for practice
5. Commit: `git commit -m "feat: implement todo list"`

You can now move on to the next problem or refine this one!
