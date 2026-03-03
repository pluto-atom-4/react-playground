import { useState, useCallback } from 'react'
import type { Todo } from '../types'

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = useCallback((text: string) => {
    if (text.trim()) {
      setTodos((prev) => [
        ...prev,
        { id: Date.now(), text: text.trim(), completed: false },
      ])
    }
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
      if (!term.trim()) return todos
      return todos.filter((todo) =>
        todo.text.toLowerCase().includes(term.toLowerCase()),
      )
    },
    [todos],
  )

  return { todos, addTodo, deleteTodo, toggleComplete, searchTodos }
}
