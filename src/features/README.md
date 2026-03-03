# Features

Each feature folder contains a complete, isolated problem implementation.

## Structure

```
features/
├── todo/
│   ├── TodoList.tsx          # Main component
│   ├── TodoItem.tsx          # Subcomponent
│   ├── useTodos.ts           # Custom hook
│   ├── types.ts              # Local types/interfaces
│   └── index.ts              # Barrel export
├── search/
├── infinite-scroll/
└── [more features]/
```

## How to Add a New Feature

1. Create a new folder: `mkdir src/features/[feature-name]`
2. Implement your components, hooks, and types
3. Export from `src/features/[feature-name]/index.ts` (barrel file)
4. Import and render in `src/App.tsx`
5. Run `pnpm dev` to test locally

## Example: Todo List

```typescript
// src/features/todo/types.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// src/features/todo/useTodos.ts
import { useState } from 'react';
import { Todo } from './types';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  // ... implementation
  return { todos, addTodo, removeTodo, toggleTodo };
}

// src/features/todo/TodoList.tsx
import { useTodos } from './useTodos';

export function TodoList() {
  const { todos, addTodo, removeTodo } = useTodos();
  // ... JSX
}

// src/features/todo/index.ts
export { TodoList } from './TodoList';
```

Then in `App.tsx`:

```typescript
import { TodoList } from '@features/todo';
```
