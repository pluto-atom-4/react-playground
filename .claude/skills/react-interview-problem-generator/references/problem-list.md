# Interview Problems Reference

All 12 problems available in this skill, organized by category.

## State Management & Hooks (3 problems)

### 1. Todo List with Filtering
**Tags**: useState, useEffect, search/filter, list management

Implement a searchable todo app where users can:
- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Search/filter todos by text

**Real-world relevance**: Property search UI, home listing filters

**Key patterns**:
- useState for list state
- Debounce for search performance
- useCallback for stable callbacks

---

### 2. Debounce Input Handler (useDebounce Hook)
**Tags**: useEffect, hooks, performance, real-time search

Implement a custom `useDebounce` hook that:
- Delays expensive operations (API calls, filters)
- Cancels pending operations when input changes
- Returns debounced value after delay

**Real-world relevance**: Property filter search, autocomplete

**Key patterns**:
- useEffect with cleanup
- setTimeout and clearTimeout
- Dependency array management

---

### 3. Phone Number Input Formatter
**Tags**: controlled input, regex, validation, formatting

Implement a phone number input that:
- Formats as user types: `(555) 123-4567`
- Handles backspace and deletion
- Validates input (numbers only, correct length)
- Works as controlled component

**Real-world relevance**: User contact forms, sign-up flows

**Key patterns**:
- useState for input value
- Regex for formatting/validation
- Edge case handling (backspace, paste, deletion)

---

## Components & Rendering (3 problems)

### 4. Counter with Undo/Redo
**Tags**: useReducer, state history, action patterns

Implement a counter with:
- Increment/Decrement buttons
- Undo history (revert to previous counts)
- Redo history (go forward)
- Clear history button

**Real-world relevance**: Action history in forms, editor features

**Key patterns**:
- useReducer for complex state
- Array-based history tracking
- Action dispatching patterns

---

### 5. Infinite Scroll List
**Tags**: IntersectionObserver, API calls, performance, data loading

Implement an infinite scrolling list that:
- Displays initial batch of items
- Loads more items when user scrolls near bottom
- Shows loading indicator while fetching
- Handles network errors gracefully

**Real-world relevance**: Property listings, image galleries, feeds

**Key patterns**:
- IntersectionObserver API (not scroll listeners)
- useEffect for observer setup
- State management for pagination
- Error handling and retries

---

### 6. Accordion Component
**Tags**: controlled state, props, composition, accessibility

Implement an accordion with:
- Multiple collapsible sections
- Only one section open at a time (or configurable)
- Smooth transitions
- Keyboard navigation (arrow keys, Enter)
- Semantic HTML and ARIA attributes

**Real-world relevance**: Help sections, product details, FAQs

**Key patterns**:
- useState for open section tracking
- Props for content and callbacks
- Conditional rendering
- Accessibility-first implementation

---

## Performance & Optimization (3 problems)

### 7. Memoize Expensive Component
**Tags**: React.memo, useCallback, useMemo, re-render prevention

Implement a list with:
- Heavy (slow-to-render) list items
- Memoized item components to prevent unnecessary re-renders
- useCallback for stable callbacks
- Measurable performance improvement

**Real-world relevance**: Large lists, dashboards, data tables

**Key patterns**:
- React.memo for component memoization
- useCallback for callback stability
- useMemo for expensive computations
- When and why to memoize

---

### 8. Lazy Load Images
**Tags**: IntersectionObserver, performance, progressive loading

Implement lazy loading for images that:
- Shows placeholder until image is visible
- Loads image when entering viewport
- Shows loading state and error state
- Fallback for browsers without IntersectionObserver

**Real-world relevance**: Photo-heavy apps, performance optimization

**Key patterns**:
- IntersectionObserver for visibility detection
- useState for loading/error states
- Progressive image loading
- Fallback mechanisms

---

### 9. Context API Provider (Theme/Auth)
**Tags**: createContext, useContext, provider pattern, global state

Implement a theme provider with:
- Light/dark mode toggle
- Persistent theme preference (localStorage)
- useTheme custom hook for consumption
- Multiple consumers reading from context

**Real-world relevance**: Global state for theme, auth, user preferences

**Key patterns**:
- Context creation with TypeScript
- Provider component pattern
- Custom hooks for consuming context
- Avoiding unnecessary re-renders (useMemo)

---

## Integration & Advanced (3 problems)

### 10. Data Fetching Component
**Tags**: fetch, loading states, error handling, async operations

Implement a component that:
- Fetches data from API
- Shows loading state while fetching
- Handles and displays errors
- Refetches on button click
- Proper cleanup on unmount

**Real-world relevance**: API integration, real-world data binding

**Key patterns**:
- useEffect for side effects
- Cleanup functions to prevent memory leaks
- Loading/error/success state management
- Error boundaries (bonus)

---

### 11. Excel-like Spreadsheet UI
**Tags**: 2D state, formula parsing, grid rendering, dynamic computation

Implement a small spreadsheet with:
- Grid of cells (e.g., 5x5)
- Each cell can contain a number or formula
- Formulas support basic operations and SUM()
- Cells update when dependencies change
- Click to edit cells

**Real-world relevance**: Data entry, dashboards, financial tools

**Key patterns**:
- 2D array state management
- Formula parsing and evaluation
- Dependency tracking
- Memoization for recalculation efficiency

---

### 12. Game of Life Simulator
**Tags**: state simulation, interval loops, cellular automaton, grid rendering

Implement Conway's Game of Life with:
- 20x20 grid of cells (alive/dead)
- Start/pause/reset controls
- Rules: birth, survival, death based on neighbors
- Generation counter
- Configurable speed

**Real-world relevance**: Simulations, complex state management, rendering optimization

**Key patterns**:
- 2D grid state
- useInterval custom hook or setInterval in useEffect
- Complex state update logic
- Performance optimization for large grids

---

## Selection Guide

Choose based on:

| Goal | Pick Problems |
|------|---------------|
| Learn hooks | 1, 2, 3, 4 |
| Learn performance | 7, 8, 9 |
| Learn component patterns | 4, 5, 6, 10 |
| Prepare for interviews | 1, 3, 5, 10 (most common) |
| Challenge yourself | 11, 12 |

All problems are designed to be completed in 30-60 minutes during an actual interview.
