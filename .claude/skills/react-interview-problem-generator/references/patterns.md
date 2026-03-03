# Code Patterns & Architecture

Conventions and patterns used in all generated code.

## Project Structure

### Feature-Based Organization

Every generated problem lives in `src/features/[problem-name]/` with its own:

```
src/features/[feature-name]/
├── components/          # React components for this feature
├── hooks/              # Custom hooks (state, side effects)
├── types.ts            # TypeScript interfaces/types
├── __tests__/          # Unit tests (co-located with code)
├── index.ts            # Barrel export
└── [optional]
    └── utils/          # Feature-specific utilities
```

**Why this structure?**
- Everything related to a feature is in one place
- Easy to add, remove, or refactor a whole feature
- Scalable: new problems just add a new folder
- Tests are near the code they test

### Page Wrapper Pattern

Each feature gets a routable page:

```
src/pages/
├── TodoPage.tsx         # Wrapper for /practice/todo
├── DebounceSearchPage.tsx
├── PhoneFormatterPage.tsx
└── ...
```

The page is simple and just imports the feature:

```typescript
// src/pages/TodoPage.tsx
import { TodoList } from '@features/todo'

export const TodoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TodoList />
    </div>
  )
}
```

### Barrel Exports Pattern

Each feature exports its public API via `index.ts`:

```typescript
// src/features/todo/index.ts
export { TodoList } from './components/TodoList'
export { useTodos } from './hooks/useTodos'
export type { Todo } from './types'
```

**Benefits:**
- Clean imports: `import { TodoList, useTodos } from '@features/todo'`
- Hide internal structure: consumers don't care about `/components/`
- Easy refactoring: change structure without breaking imports
- Consistency across features

---

## React Patterns

### Custom Hooks for State Management

State logic lives in custom hooks, not components:

```typescript
// ✅ Good: Logic in hook
// src/features/todo/hooks/useTodos.ts
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }])
  }, [])

  return { todos, addTodo }
}

// Component just uses the hook
import { useTodos } from '../hooks/useTodos'

export const TodoList = () => {
  const { todos, addTodo } = useTodos()
  // render...
}
```

vs.

```typescript
// ❌ Avoid: Logic in component
export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }])
  }
  // ...
}
```

**Why?**
- Reusable across multiple components
- Testable in isolation
- Easier to understand component vs. logic
- Follows React conventions

### useCallback for Stable References

Pass callbacks to child components or APIs wrapped in `useCallback`:

```typescript
// ✅ Good: Callback wrapped in useCallback
export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = useCallback((text: string) => {
    setTodos((prev) => [...prev, { id: Date.now(), text, completed: false }])
  }, []) // dependency array (usually empty for setters)

  return { addTodo }
}
```

**Why?**
- Prevents unnecessary re-renders of memoized child components
- Prevents effect dependencies from changing every render
- Expected in interview questions (shows understanding)

### Dependency Arrays

Always include correct dependencies in `useEffect` and `useCallback`:

```typescript
// ✅ Good: Correct dependencies
const searchTodos = useCallback(
  (term: string) => {
    return todos.filter((t) => t.text.toLowerCase().includes(term.toLowerCase()))
  },
  [todos], // Depends on todos array
)

useEffect(() => {
  const timer = setTimeout(() => {
    onSearch(debouncedTerm)
  }, 300)
  return () => clearTimeout(timer)
}, [debouncedTerm, onSearch]) // Both are dependencies
```

**Why?**
- Prevents bugs (stale closures, race conditions)
- ESLint plugin warns about missing deps
- Interview question topic: shows understanding of effects

### Controlled Inputs

Form inputs should be controlled components:

```typescript
// ✅ Good: Controlled input
const [input, setInput] = useState('')

return (
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Add a todo..."
  />
)
```

Not:
```typescript
// ❌ Avoid: Uncontrolled
const inputRef = useRef<HTMLInputElement>(null)
// Access via inputRef.current.value
```

**Why?**
- React owns the state
- Predictable behavior
- Can validate/transform input before setting state
- Standard React pattern

---

## TypeScript Patterns

### Type Definitions in Feature

Each feature has a `types.ts` file:

```typescript
// src/features/todo/types.ts
export interface Todo {
  id: number
  text: string
  completed: boolean
}

export interface TodoFilters {
  searchTerm: string
  showCompleted: boolean
}
```

**Why separate file?**
- One source of truth for feature types
- Easy to import types: `import type { Todo } from '@features/todo'`
- Clear API for consumers

### React Component Types

Components use TypeScript generics and `React.FC`:

```typescript
// ✅ Good
interface TodoListProps {
  onAdd?: (todo: Todo) => void
  maxItems?: number
}

export const TodoList: React.FC<TodoListProps> = ({
  onAdd,
  maxItems = 100,
}) => {
  // ...
}
```

Not:
```typescript
// ❌ Avoid: No types for props
export const TodoList = ({ onAdd, maxItems }) => {
  // ...
}
```

### Never Use `any`

If you don't know the type, use generics or wider types:

```typescript
// ✅ Good: Generic
function useLocalStorage<T>(key: string): [T | null, (value: T) => void] {
  const [value, setValue] = useState<T | null>(null)
  // ...
}

// ✅ Good: Union type
function handleChange(value: string | number | boolean) {
  // ...
}

// ❌ Avoid
function handleChange(value: any) {
  // ...
}
```

---

## Styling Patterns

### Tailwind CSS

All components use Tailwind for styling:

```typescript
export const TodoList = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Todo List</h1>

      <div className="flex gap-2 mb-6">
        <input className="flex-1 px-4 py-2 border rounded" />
        <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {/* items */}
      </ul>
    </div>
  )
}
```

**Tailwind classes used:**
- Layout: `flex`, `grid`, `gap-*`, `p-*`, `m-*`
- Typography: `text-*`, `font-*`
- Colors: `bg-*`, `text-*`, `border-*`
- States: `hover:`, `focus:`, `disabled:`
- Responsiveness: `md:`, `lg:` (added as needed)

Not CSS-in-JS or separate `.css` files—Tailwind inline.

### Responsive Design

Use Tailwind breakpoints for mobile-first design:

```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

---

## Accessibility Patterns

### Semantic HTML

Use semantic elements, not `<div>` for everything:

```typescript
// ✅ Good: Semantic
return (
  <section>
    <h1>Todo List</h1>
    <input aria-label="New todo input" />
    <button>Add</button>
    <ul>
      <li>Todo item</li>
    </ul>
  </section>
)
```

Not:
```typescript
// ❌ Avoid: Generic divs
return (
  <div>
    <div>Todo List</div>
    <div><input /></div>
    <div><button>Add</button></div>
    <div>
      <div>Todo item</div>
    </div>
  </div>
)
```

### ARIA Labels

All interactive elements must have labels:

```typescript
// ✅ Good: Proper labels
<input aria-label="Search todos" placeholder="Search..." />
<button aria-label='Delete "Learn React"'>Delete</button>

// ✅ Also good: Label element
<label htmlFor="search">Search:</label>
<input id="search" placeholder="Search..." />
```

### Semantic Roles

Use roles to help accessibility tools:

```typescript
// ✅ Good: Proper roles
<button role="button">Click me</button>
<div role="alert">Error message</div>
<input role="searchbox" />

// Don't need explicit role if semantic:
<button>Click me</button> {/* Already has role="button" */}
<input type="text" /> {/* Already has role="textbox" */}
```

---

## Error Handling Patterns

### Try-Catch for APIs

Wrap fetch/API calls:

```typescript
export const fetchListings = async () => {
  try {
    const res = await fetch('/api/listings')
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    return await res.json()
  } catch (error) {
    console.error('Fetch failed:', error)
    throw error
  }
}
```

### Optional Chaining & Nullish Coalescing

Handle missing data safely:

```typescript
// ✅ Good: Safe navigation
const count = data?.items?.length ?? 0
const name = user?.profile?.name || 'Anonymous'

// ❌ Avoid: Unsafe
const count = data.items.length // Crashes if data or items is null
```

---

## Performance Patterns

### React.memo for List Items

Prevent unnecessary re-renders:

```typescript
interface TodoItemProps {
  todo: Todo
  onDelete: (id: number) => void
}

export const TodoItem = React.memo<TodoItemProps>(
  ({ todo, onDelete }) => (
    <li className="flex gap-2">
      <span>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  ),
)

// Set display name for debugging
TodoItem.displayName = 'TodoItem'
```

### useMemo for Expensive Computations

Only for actually expensive work:

```typescript
// ✅ Only if filtering large arrays is slow
const filteredTodos = useMemo(
  () => todos.filter((t) => t.text.includes(searchTerm)),
  [todos, searchTerm],
)

// ❌ Don't over-memoize
const doubled = useMemo(() => count * 2, [count]) // Unnecessary
```

---

## Import Patterns

### Use Path Aliases

Configure in `vite.config.ts`:

```typescript
// ✅ Good: Clear and consistent
import { TodoList } from '@features/todo'
import { Button } from '@components'
import { formatDate } from '@utils/date'

// ❌ Avoid: Relative paths (hard to refactor)
import { TodoList } from '../../../features/todo/components/TodoList'
```

### Organize Imports

```typescript
// Pattern: External → Project → Relative
import React, { useState } from 'react'
import { render } from '@testing-library/react'

import { TodoList } from '@features/todo'
import { Button } from '@components'

import { useTodos } from './hooks/useTodos'
import type { Todo } from './types'
```

---

## Comments & Documentation

### Explain Why, Not What

```typescript
// ✅ Good: Explains reasoning
// Use useCallback to prevent TodoItem from re-rendering unnecessarily
// since it's memoized and compares callback identity
const handleDelete = useCallback((id: number) => {
  setTodos((prev) => prev.filter((t) => t.id !== id))
}, [])

// ❌ Avoid: Just describes code
// Delete the todo
const handleDelete = (id: number) => {
  setTodos((prev) => prev.filter((t) => t.id !== id))
}
```

### JSDoc for Public APIs

```typescript
/**
 * Custom hook for managing todo list state
 * @returns Object containing todos and actions
 */
export const useTodos = () => {
  // ...
}
```

---

## Testing Patterns

### Test File Naming

```
src/features/todo/
├── components/TodoList.tsx
├── __tests__/
│   ├── TodoList.test.ts        // Tests for TodoList
│   └── useTodos.test.ts        # Tests for useTodos hook
└── hooks/useTodos.ts
```

### Test Organization

```typescript
describe('TodoList', () => {
  // Group related tests
  describe('rendering', () => {
    it('renders without error', () => {})
    it('displays empty state', () => {})
  })

  describe('adding todos', () => {
    it('allows adding a new todo', () => {})
    it('clears input after adding', () => {})
  })
})
```

---

## Summary Checklist

When reviewing generated code, verify:

- [ ] Feature-based structure (`src/features/[name]/`)
- [ ] Barrel exports (`index.ts`)
- [ ] Custom hooks for state management
- [ ] useCallback for stable references
- [ ] Correct useEffect dependencies
- [ ] TypeScript strict mode (no `any`)
- [ ] Types in separate `types.ts`
- [ ] Tailwind for styling (no CSS files)
- [ ] Semantic HTML
- [ ] ARIA labels on interactive elements
- [ ] Tests co-located in `__tests__/`
- [ ] Comments explain "why" not "what"
- [ ] Path aliases (`@features/`, `@components/`, etc.)

All generated code follows these patterns!
