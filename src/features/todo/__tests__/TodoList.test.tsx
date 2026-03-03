import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TodoList } from '../components/TodoList'
import { describe, it, expect } from 'vitest'

describe('TodoList', () => {
  it('renders the todo list component with heading', () => {
    render(<TodoList />)
    expect(screen.getByRole('heading', { name: /todo list/i })).toBeDefined()
    expect(screen.getByText(/stay organized/i)).toBeDefined()
  })

  it('displays empty state when no todos exist', () => {
    render(<TodoList />)
    expect(screen.getByText(/no todos yet/i)).toBeDefined()
  })

  it('allows adding a new todo via button click', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement
    const button = screen.getByRole('button', { name: /add todo/i })

    await user.type(input, 'Learn React')
    await user.click(button)

    expect(screen.getByText('Learn React')).toBeDefined()
    expect(input.value).toBe('')
  })

  it('allows adding a new todo via Enter key', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...') as HTMLInputElement

    await user.type(input, 'Learn TypeScript')
    await user.keyboard('{Enter}')

    expect(screen.getByText('Learn TypeScript')).toBeDefined()
    expect(input.value).toBe('')
  })

  it('prevents adding empty todos', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const button = screen.getByRole('button', { name: /add todo/i })
    await user.click(button)

    expect(screen.getByText(/no todos yet/i)).toBeDefined()
  })

  it('allows toggling todo completion status', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: /add todo/i })

    await user.type(input, 'Test todo')
    await user.click(button)

    const checkbox = screen.getByRole('checkbox', { name: /mark.*test todo/i }) as HTMLInputElement
    expect(checkbox.checked).toBe(false)

    await user.click(checkbox)
    expect(checkbox.checked).toBe(true)

    const todoText = screen.getByText('Test todo')
    expect(todoText.className).toContain('line-through')
  })

  it('filters todos by search term', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const addInput = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByRole('button', { name: /add todo/i })

    // Add two todos
    await user.type(addInput, 'Learn React')
    await user.click(addButton)

    await user.type(addInput, 'Learn Node.js')
    await user.click(addButton)

    // Search for React
    const searchInput = screen.getByPlaceholderText('Search todos by text...')
    await user.type(searchInput, 'React')

    // Verify filtering
    expect(screen.getByText('Learn React')).toBeDefined()
    expect(screen.queryByText('Learn Node.js')).toBeNull()
    expect(screen.getByText(/showing 1 of 2/i)).toBeDefined()
  })

  it('allows deleting a todo', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const button = screen.getByRole('button', { name: /add todo/i })

    await user.type(input, 'Delete me')
    await user.click(button)

    expect(screen.getByText('Delete me')).toBeDefined()

    const deleteButton = screen.getByRole('button', { name: /delete "delete me"/i })
    await user.click(deleteButton)

    expect(screen.queryByText('Delete me')).toBeNull()
    expect(screen.getByText(/no todos yet/i)).toBeDefined()
  })

  it('displays summary statistics', async () => {
    const user = userEvent.setup()
    render(<TodoList />)

    const input = screen.getByPlaceholderText('Add a new todo...')
    const addButton = screen.getByRole('button', { name: /add todo/i })

    // Add three todos
    await user.type(input, 'Todo 1')
    await user.click(addButton)

    await user.type(input, 'Todo 2')
    await user.click(addButton)

    await user.type(input, 'Todo 3')
    await user.click(addButton)

    // Check summary - use getAllByText since "3" appears multiple times
    const threeTexts = screen.getAllByText('3')
    expect(threeTexts.length).toBeGreaterThan(0) // Total and Remaining both show 3
    expect(screen.getByText('0')).toBeDefined() // Completed

    // Complete one todo
    const checkboxes = screen.getAllByRole('checkbox')
    await user.click(checkboxes[0])

    // Verify summary updated (this tests state management)
    const twoTexts = screen.getAllByText('2')
    expect(twoTexts.length).toBeGreaterThan(0)
  })

  it('has proper accessibility labels', () => {
    render(<TodoList />)

    expect(screen.getByLabelText('New todo input')).toBeDefined()
    expect(screen.getByLabelText('Add todo button')).toBeDefined()
    expect(screen.getByLabelText('Search todos input')).toBeDefined()
  })
})
