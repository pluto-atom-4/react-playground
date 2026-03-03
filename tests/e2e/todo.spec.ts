import { test, expect } from '@playwright/test'

test.describe('Todo List - Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/practice/todo')
    await page.waitForLoadState('networkidle')
  })

  test('component loads and displays empty state', async ({ page }) => {
    await expect(page.locator('text=Todo List')).toBeVisible()
    await expect(page.locator('text=Stay organized')).toBeVisible()
    await expect(page.locator('text=No todos yet')).toBeVisible()
  })

  test('user can add a todo', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const button = page.locator('button:has-text("Add")')

    await input.fill('Learn React Hooks')
    await button.click()

    await expect(page.locator('text=Learn React Hooks')).toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('user can add multiple todos', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const button = page.locator('button:has-text("Add")')

    // Add first todo
    await input.fill('Learn React')
    await button.click()

    // Add second todo
    await input.fill('Build a project')
    await button.click()

    // Add third todo
    await input.fill('Practice testing')
    await button.click()

    await expect(page.locator('text=Learn React')).toBeVisible()
    await expect(page.locator('text=Build a project')).toBeVisible()
    await expect(page.locator('text=Practice testing')).toBeVisible()

    // Verify summary shows 3 todos
    await expect(page.locator('text=Total')).toBeVisible()
  })

  test('user can mark todo as complete', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const button = page.locator('button:has-text("Add")')

    // Add a todo
    await input.fill('Test todo')
    await button.click()

    // Find and click checkbox
    const checkbox = page.locator('input[type="checkbox"]').first()
    await checkbox.click()

    // Verify it's checked
    await expect(checkbox).toBeChecked()

    // Verify todo has strike-through style
    const todoText = page.locator('text=Test todo')
    const todoParent = todoText.locator('..')
    await expect(todoParent).toContainText('Test todo')
  })

  test('user can search and filter todos', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const addButton = page.locator('button:has-text("Add")')

    // Add multiple todos with different keywords
    await input.fill('Learn React Basics')
    await addButton.click()

    await input.fill('Learn React Advanced')
    await addButton.click()

    await input.fill('Learn Node.js')
    await addButton.click()

    // Search for "React"
    const searchInput = page.locator('input[placeholder="Search todos by text..."]')
    await searchInput.fill('React')

    // Verify filtering - React todos visible
    await expect(page.locator('text=Learn React Basics')).toBeVisible()
    await expect(page.locator('text=Learn React Advanced')).toBeVisible()

    // Node.js should not be visible (case insensitive search)
    await expect(page.locator('text=Learn Node.js')).not.toBeVisible()

    // Verify search count shows correct filtering
    await expect(page.locator('text=Showing 2 of 3')).toBeVisible()
  })

  test('user can delete a todo', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const addButton = page.locator('button:has-text("Add")')

    // Add a todo
    await input.fill('Todo to delete')
    await addButton.click()

    // Verify it's there
    await expect(page.locator('text=Todo to delete')).toBeVisible()

    // Delete it
    const deleteButton = page.locator('button:has-text("Delete")').first()
    await deleteButton.click()

    // Verify it's gone
    await expect(page.locator('text=Todo to delete')).not.toBeVisible()
    await expect(page.locator('text=No todos yet')).toBeVisible()
  })

  test('user can add todo via Enter key', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')

    await input.fill('Add with Enter key')
    await input.press('Enter')

    await expect(page.locator('text=Add with Enter key')).toBeVisible()
    await expect(input).toHaveValue('')
  })

  test('user can complete multiple workflows in sequence', async ({ page }) => {
    const input = page.locator('input[placeholder="Add a new todo..."]')
    const addButton = page.locator('button:has-text("Add")')
    const searchInput = page.locator('input[placeholder="Search todos by text..."]')

    // Workflow 1: Add todos
    await input.fill('Morning: Exercise')
    await addButton.click()

    await input.fill('Afternoon: Code')
    await addButton.click()

    await input.fill('Evening: Read')
    await addButton.click()

    // Workflow 2: Complete a todo
    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.click()
    await expect(firstCheckbox).toBeChecked()

    // Workflow 3: Search
    await searchInput.fill('Code')
    await expect(page.locator('text=Afternoon: Code')).toBeVisible()
    await expect(page.locator('text=Morning: Exercise')).not.toBeVisible()

    // Workflow 4: Clear search and delete
    await searchInput.fill('')
    const deleteButtons = page.locator('button:has-text("Delete")')
    const firstDeleteButton = deleteButtons.first()
    await firstDeleteButton.click()

    // Verify todo is deleted
    await expect(page.locator('text=Morning: Exercise')).not.toBeVisible()
  })
})
