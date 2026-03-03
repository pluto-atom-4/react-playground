import { useState } from 'react'
import { TodoList } from '@features/todo'
import './App.css'

type Problem = 'home' | 'todo' | 'search' | 'infinite-scroll' | 'counter' | 'accordion'

function App() {
  const [currentProblem, setCurrentProblem] = useState<Problem>('home')

  const problems: { id: Problem; name: string; description: string }[] = [
    { id: 'home', name: 'Home', description: 'Select a problem to practice' },
    { id: 'todo', name: 'Todo List', description: 'State management with filtering' },
    { id: 'search', name: 'Debounced Search', description: 'Search with debounce hook' },
    { id: 'infinite-scroll', name: 'Infinite Scroll', description: 'Load more on scroll' },
    { id: 'counter', name: 'Counter Undo/Redo', description: 'State history management' },
    { id: 'accordion', name: 'Accordion', description: 'Collapsible sections' },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-2">React Interview Practice</h1>
        <p className="text-gray-400">Playground for OpenDoor full-stack engineer problems</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            {problems.map((problem) => (
              <button
                key={problem.id}
                onClick={() => setCurrentProblem(problem.id)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  currentProblem === problem.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {problem.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {currentProblem === 'home' && (
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome to React Interview Practice</h2>
              <p className="text-gray-400 mb-6">
                This playground is designed to help you practice interview-style React problems.
                Select a problem from the left to get started.
              </p>
              <div className="bg-gray-700 rounded p-4 text-sm text-gray-300">
                <p className="mb-2">
                  <strong>💡 Tip:</strong> Each problem lives in <code>src/features/[problem-name]/</code>
                </p>
                <p className="mb-2">
                  <strong>📚 Docs:</strong> Check out <code>problem-statements.md</code> for detailed problem descriptions
                </p>
                <p>
                  <strong>🚀 Next:</strong> Pick a problem and start implementing!
                </p>
              </div>
            </div>
          )}

          {currentProblem === 'todo' && <TodoList />}

          {currentProblem !== 'home' && currentProblem !== 'todo' && (
            <div className="bg-gray-800 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">
                {problems.find((p) => p.id === currentProblem)?.name}
              </h2>
              <p className="text-gray-400">
                Implement the {currentProblem} problem here. Create components in{' '}
                <code>src/features/{currentProblem}/</code>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
