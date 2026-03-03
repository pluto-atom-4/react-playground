import { renderHook, act } from '@testing-library/react'
import { useTodos } from '../useTodos'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

describe('useTodos', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  describe('initialization', () => {
    it('initializes with empty todos array', () => {
      const { result } = renderHook(() => useTodos())
      expect(result.current.todos).toEqual([])
    })

    it('provides all required methods', () => {
      const { result } = renderHook(() => useTodos())
      expect(typeof result.current.addTodo).toBe('function')
      expect(typeof result.current.deleteTodo).toBe('function')
      expect(typeof result.current.toggleComplete).toBe('function')
      expect(typeof result.current.searchTodos).toBe('function')
    })
  })

  describe('addTodo', () => {
    it('adds a single todo with generated id', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Learn React')
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0]).toMatchObject({
        text: 'Learn React',
        completed: false,
      })
      expect(typeof result.current.todos[0].id).toBe('number')
    })

    it('adds multiple todos in sequence', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
        result.current.addTodo('Task 2')
        result.current.addTodo('Task 3')
      })

      expect(result.current.todos).toHaveLength(3)
      expect(result.current.todos[0].text).toBe('Task 1')
      expect(result.current.todos[1].text).toBe('Task 2')
      expect(result.current.todos[2].text).toBe('Task 3')
    })

    it('trims whitespace from todo text', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('  Learn TypeScript  ')
      })

      expect(result.current.todos[0].text).toBe('Learn TypeScript')
    })

    it('does not add empty or whitespace-only todos', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('')
        result.current.addTodo('   ')
        result.current.addTodo('\t\n')
      })

      expect(result.current.todos).toHaveLength(0)
    })

    it('generates unique ids for each todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Todo 1')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Todo 2')
      })

      const ids = result.current.todos.map(t => t.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(2)
    })
  })

  describe('deleteTodo', () => {
    it('removes a todo by id', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task to delete')
      })

      const todoId = result.current.todos[0].id

      act(() => {
        result.current.deleteTodo(todoId)
      })

      expect(result.current.todos).toHaveLength(0)
    })

    it('removes correct todo when multiple exist', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 2')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 3')
      })

      const secondTodoId = result.current.todos[1].id

      act(() => {
        result.current.deleteTodo(secondTodoId)
      })

      expect(result.current.todos).toHaveLength(2)
      expect(result.current.todos[0].text).toBe('Task 1')
      expect(result.current.todos[1].text).toBe('Task 3')
    })

    it('handles deletion of non-existent id gracefully', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
      })

      act(() => {
        result.current.deleteTodo(99999)
      })

      expect(result.current.todos).toHaveLength(1)
    })

    it('can delete all todos one by one', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
        result.current.addTodo('Task 2')
      })

      const ids = result.current.todos.map(t => t.id)

      act(() => {
        ids.forEach(id => {
          result.current.deleteTodo(id)
        })
      })

      expect(result.current.todos).toHaveLength(0)
    })
  })

  describe('toggleComplete', () => {
    it('toggles todo completion status from false to true', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task')
      })

      const todoId = result.current.todos[0].id

      act(() => {
        result.current.toggleComplete(todoId)
      })

      expect(result.current.todos[0].completed).toBe(true)
    })

    it('toggles todo completion status from true to false', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task')
      })

      const todoId = result.current.todos[0].id

      act(() => {
        result.current.toggleComplete(todoId)
        result.current.toggleComplete(todoId)
      })

      expect(result.current.todos[0].completed).toBe(false)
    })

    it('toggles only the specified todo', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 2')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 3')
      })

      const secondTodoId = result.current.todos[1].id

      act(() => {
        result.current.toggleComplete(secondTodoId)
      })

      expect(result.current.todos[0].completed).toBe(false)
      expect(result.current.todos[1].completed).toBe(true)
      expect(result.current.todos[2].completed).toBe(false)
    })

    it('preserves todo text when toggling completion', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Important Task')
      })

      const originalText = result.current.todos[0].text
      const todoId = result.current.todos[0].id

      act(() => {
        result.current.toggleComplete(todoId)
      })

      expect(result.current.todos[0].text).toBe(originalText)
    })

    it('preserves todo id when toggling completion', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task')
      })

      const originalId = result.current.todos[0].id

      act(() => {
        result.current.toggleComplete(originalId)
      })

      expect(result.current.todos[0].id).toBe(originalId)
    })

    it('handles toggle on non-existent id gracefully', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task')
      })

      act(() => {
        result.current.toggleComplete(99999)
      })

      expect(result.current.todos).toHaveLength(1)
      expect(result.current.todos[0].completed).toBe(false)
    })
  })

  describe('searchTodos', () => {
    it('returns all todos when search term is empty', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('React')
        result.current.addTodo('TypeScript')
        result.current.addTodo('Testing')
      })

      const searchResults = result.current.searchTodos('')
      expect(searchResults).toHaveLength(3)
    })

    it('returns all todos when search term is whitespace only', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Item 1')
        result.current.addTodo('Item 2')
      })

      const searchResults = result.current.searchTodos('   ')
      expect(searchResults).toHaveLength(2)
    })

    it('finds todos with exact match', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Learn React')
        result.current.addTodo('Learn TypeScript')
      })

      const searchResults = result.current.searchTodos('React')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].text).toBe('Learn React')
    })

    it('finds todos with case-insensitive search', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Learn REACT')
        result.current.addTodo('Learn typescript')
      })

      const searchResults = result.current.searchTodos('react')
      expect(searchResults).toHaveLength(1)
      expect(searchResults[0].text).toBe('Learn REACT')
    })

    it('finds todos with partial match', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Learn React Basics')
        result.current.addTodo('React Testing')
        result.current.addTodo('TypeScript Guide')
      })

      const searchResults = result.current.searchTodos('React')
      expect(searchResults).toHaveLength(2)
      expect(searchResults[0].text).toBe('Learn React Basics')
      expect(searchResults[1].text).toBe('React Testing')
    })

    it('returns empty array when no todos match', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Learn React')
        result.current.addTodo('Learn TypeScript')
      })

      const searchResults = result.current.searchTodos('Vue')
      expect(searchResults).toHaveLength(0)
    })

    it('finds all todos when search matches all', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task')
        result.current.addTodo('Another Task')
        result.current.addTodo('Task List')
      })

      const searchResults = result.current.searchTodos('Task')
      expect(searchResults).toHaveLength(3)
    })

    it('preserves todo properties in search results', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Important Task')
        result.current.addTodo('Regular Item')
      })

      const firstTodo = result.current.todos[0]
      const searchResults = result.current.searchTodos('Important')

      expect(searchResults[0].id).toBe(firstTodo.id)
      expect(searchResults[0].completed).toBe(firstTodo.completed)
      expect(searchResults[0].text).toBe(firstTodo.text)
    })
  })

  describe('integration scenarios', () => {
    it('performs add, search, toggle, and delete in sequence', () => {
      const { result } = renderHook(() => useTodos())

      // Add todos
      act(() => {
        result.current.addTodo('Learn React')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Learn TypeScript')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Learn Testing')
      })

      expect(result.current.todos).toHaveLength(3)

      // Search
      const searchResults = result.current.searchTodos('Learn')
      expect(searchResults).toHaveLength(3)

      // Toggle first todo
      act(() => {
        result.current.toggleComplete(result.current.todos[0].id)
      })

      expect(result.current.todos[0].completed).toBe(true)

      // Delete middle todo
      act(() => {
        result.current.deleteTodo(result.current.todos[1].id)
      })

      expect(result.current.todos).toHaveLength(2)
      expect(result.current.todos[0].completed).toBe(true)
      expect(result.current.todos[1].text).toBe('Learn Testing')
    })

    it('maintains state consistency across multiple operations', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        result.current.addTodo('Task 1')
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 2')
      })

      const task1Id = result.current.todos[0].id
      const task2Id = result.current.todos[1].id

      act(() => {
        result.current.toggleComplete(task1Id)
      })

      act(() => {
        vi.advanceTimersByTime(1)
      })

      act(() => {
        result.current.addTodo('Task 3')
      })

      act(() => {
        result.current.toggleComplete(task2Id)
      })

      expect(result.current.todos).toHaveLength(3)
      expect(result.current.todos[0].completed).toBe(true)
      expect(result.current.todos[1].completed).toBe(true)
      expect(result.current.todos[2].completed).toBe(false)
    })

    it('handles rapid consecutive operations', () => {
      const { result } = renderHook(() => useTodos())

      act(() => {
        for (let i = 1; i <= 10; i++) {
          result.current.addTodo(`Task ${i}`)
          vi.advanceTimersByTime(10) // Ensure unique IDs by advancing time
        }
      })

      expect(result.current.todos).toHaveLength(10)

      // Toggle todos in separate act blocks to avoid ID collision issues
      act(() => {
        result.current.toggleComplete(result.current.todos[0].id)
      })
      act(() => {
        result.current.toggleComplete(result.current.todos[1].id)
      })
      act(() => {
        result.current.toggleComplete(result.current.todos[2].id)
      })
      act(() => {
        result.current.toggleComplete(result.current.todos[3].id)
      })
      act(() => {
        result.current.toggleComplete(result.current.todos[4].id)
      })

      console.log("Toggled first 5 todos to completed.", result.current.todos.map((todo)=> `${todo.id} ${todo.text} ${todo.completed}`).join(", "));

      const completedCount = result.current.todos.filter(
        t => t.completed
      ).length
      expect(completedCount).toBe(5)
    })
  })
})
