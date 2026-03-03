import React, { useState, useCallback } from 'react'
import { useTodos } from '../hooks/useTodos'

export const TodoList: React.FC = () => {
  const { todos, addTodo, deleteTodo, toggleComplete, searchTodos } =
    useTodos()
  const [input, setInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const handleAddTodo = useCallback(() => {
    if (input.trim()) {
      addTodo(input)
      setInput('')
    }
  }, [input, addTodo])

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo()
    }
  }

  const filteredTodos = searchTodos(searchTerm)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Todo List</h1>
          <p className="text-gray-600">
            Stay organized with a simple, powerful todo manager
          </p>
        </div>

        {/* Add Todo Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Add a New Todo
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              aria-label="New todo input"
            />
            <button
              onClick={handleAddTodo}
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 transition-colors"
              aria-label="Add todo button"
            >
              Add
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Search Todos
          </h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search todos by text..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            aria-label="Search todos input"
          />
          {searchTerm && (
            <p className="text-sm text-gray-600 mt-2">
              Showing {filteredTodos.length} of {todos.length} todos
            </p>
          )}
        </div>

        {/* Todos List Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Your Todos
          </h2>

          {filteredTodos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchTerm ? 'No todos match your search' : 'No todos yet'}
              </p>
              {!searchTerm && (
                <p className="text-gray-500 text-sm mt-1">
                  Add one above to get started!
                </p>
              )}
            </div>
          ) : (
            <ul className="space-y-2" role="list">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  role="listitem"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id)}
                    className="w-5 h-5 text-blue-500 border-gray-300 rounded cursor-pointer"
                    aria-label={`Mark "${todo.text}" as ${
                      todo.completed ? 'incomplete' : 'complete'
                    }`}
                  />
                  <span
                    className={`flex-1 text-base ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 text-red-500 text-sm font-medium rounded hover:bg-red-50 active:bg-red-100 transition-colors"
                    aria-label={`Delete "${todo.text}"`}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Summary */}
          {todos.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-gray-500 text-sm">Total</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {todos.length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {todos.filter((t) => t.completed).length}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Remaining</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {todos.filter((t) => !t.completed).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
