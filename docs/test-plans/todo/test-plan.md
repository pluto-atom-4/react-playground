# Todo List - Test Plan

## Overview

This document outlines test coverage for the Todo List feature. The **Happy Path** tests have been implemented and pass. This document lists **alternative flows, negative cases, and edge cases** that should be added to improve test coverage.

---

## Happy Path (Implemented ✅)

### Unit Tests (Vitest)
- [x] Component renders without error
- [x] Empty state displays correct message
- [x] User can add a todo via button click
- [x] User can add a todo via Enter key
- [x] Input clears after adding todo
- [x] Empty todos are prevented (whitespace validation)
- [x] User can toggle todo completion status
- [x] Completed todos show visual indication (line-through)
- [x] User can search/filter todos by text
- [x] Search is case-insensitive
- [x] User can delete a todo
- [x] Summary statistics display (Total, Completed, Remaining)
- [x] Accessibility labels present on all inputs and buttons

### E2E Tests (Playwright)
- [x] Page loads and displays heading
- [x] Empty state visible on initial load
- [x] User can add a single todo
- [x] User can add multiple todos in sequence
- [x] User can mark todo as complete
- [x] User can search and filter todos
- [x] User can delete a todo
- [x] User can add todo via Enter key
- [x] User can perform multiple workflows in sequence

---

## Alternative Flows (TODO)

These are different user interactions or scenarios that should be tested:

### Input Variations
- [ ] User adds todo with special characters (!, @, #, $, %, etc.)
- [ ] User adds todo with emoji (😊, 🎉, etc.)
- [ ] User adds todo with very long text (>200 characters)
- [ ] User adds todo with leading/trailing whitespace (should be trimmed)
- [ ] User pastes text into input field
- [ ] User types very fast (stress test: rapid keystrokes)

### Workflow Variants
- [ ] User edits an existing todo (delete + re-add, or modify directly if implemented)
- [ ] User adds a todo, completes it, then deletes it
- [ ] User searches, finds nothing, then clears search
- [ ] User marks multiple todos as complete in sequence
- [ ] User deletes while search is active (filtering still works)
- [ ] User toggles a todo complete → incomplete → complete

### Persistence & State
- [ ] User refreshes page (does state persist? localStorage?)
- [ ] User navigates away and back to page
- [ ] Browser back/forward buttons work correctly
- [ ] State is not shared between tab instances (if localStorage used)

### Sorting & Ordering
- [ ] Todos display in creation order (FIFO)
- [ ] Completed todos stay in list (not moved to bottom)
- [ ] New todos appear at top or bottom (order consistency)
- [ ] Sort by: completion status
- [ ] Sort by: alphabetical order
- [ ] Sort by: date created

### Bulk Operations
- [ ] Mark all todos as complete (bulk action)
- [ ] Delete all completed todos (bulk delete)
- [ ] Clear entire list with confirmation

---

## Negative Cases (TODO)

These test error handling and invalid input scenarios:

### Input Validation
- [ ] User tries to add empty string (should reject)
- [ ] User tries to add only whitespace (should reject)
- [ ] User tries to add todo with length > 1000 characters
- [ ] User tries to add todo with only numbers
- [ ] User tries to add todo with only special characters

### Edge Cases with Empty State
- [ ] Behavior when list is empty (empty state message visible)
- [ ] Search with no todos (empty result message)
- [ ] Delete last todo (transitions to empty state)
- [ ] Toggle completion on empty list (should not crash)

### Search Edge Cases
- [ ] Search with special regex characters: . * + ? [ ] ^ $ ( )
- [ ] Search with very long string (>500 characters)
- [ ] Search with unicode characters (中文, العربية, etc.)
- [ ] Search with leading/trailing spaces
- [ ] Search is case-insensitive (verify)

### Component Errors
- [ ] Component handles missing props gracefully
- [ ] useCallback doesn't cause stale closure bugs
- [ ] State doesn't leak between component instances
- [ ] No memory leaks from event listeners

---

## Edge Cases (TODO)

Boundary conditions and unusual scenarios:

### Data Volume
- [ ] 0 todos (already covered: empty state)
- [ ] 1 todo (single item, all operations)
- [ ] 10 todos (normal use)
- [ ] 100 todos (performance baseline)
- [ ] 1000 todos (stress test: does filtering lag?)
- [ ] 10,000 todos (performance limit, when does UI degrade?)

### Text Content
- [ ] Very short todo: "a" (single character)
- [ ] Very long todo: 500+ characters (text wrapping)
- [ ] Todo with newlines (multiline, if supported)
- [ ] Todo with HTML-like text: "<script>alert('hi')</script>"
- [ ] Todo with URLs: "https://example.com"
- [ ] Todo with markdown: "# Header **bold** *italic*"

### User Interactions
- [ ] User clicks delete on already-deleted todo (race condition)
- [ ] User tries to toggle completion on already-deleted todo
- [ ] User adds todo, adds another while input still focused
- [ ] User rapidly clicks Add button (debounce needed?)
- [ ] User types while deletion is in progress

### Mobile & Accessibility
- [ ] Mobile viewport (375px width, iPhone SE)
- [ ] Tablet viewport (768px width, iPad)
- [ ] Keyboard-only navigation (Tab, Shift+Tab, Enter, Escape)
- [ ] Screen reader compatibility (ARIA roles, labels)
- [ ] Focus management (after add, delete, toggle)
- [ ] High contrast mode
- [ ] Zoom/text scaling at 200%

### Browser & Platform
- [ ] Safari on iOS
- [ ] Firefox on Android
- [ ] Slow network (throttled, 3G)
- [ ] Offline mode (localStorage fallback?)
- [ ] Browser back button behavior
- [ ] Multiple tabs (do they sync?)

---

## Performance Considerations (TODO)

These tests verify the component performs well:

### Rendering Performance
- [ ] No unnecessary re-renders when adding todo
- [ ] Search doesn't cause lag with 100+ todos
- [ ] Toggling completion doesn't cause flicker
- [ ] Delete doesn't cause re-render of other todos

### Memoization Effectiveness
- [ ] useCallback prevents child re-renders (if using memo)
- [ ] Each todo item renders only when its data changes
- [ ] Search doesn't re-render completed todos

### Memory & Cleanup
- [ ] No memory leaks when component unmounts
- [ ] Event listeners are cleaned up properly
- [ ] No stale closures in callbacks
- [ ] Large list (1000 items) doesn't cause memory bloat

### Interaction Speed
- [ ] Add todo completes in <50ms
- [ ] Search filters 1000 todos in <100ms
- [ ] Delete responds immediately
- [ ] UI feels snappy on low-end devices

---

## Accessibility (TODO)

Detailed accessibility testing:

### Screen Readers
- [ ] All interactive elements announced correctly
- [ ] Form labels associated with inputs
- [ ] Empty state announced to screen reader
- [ ] Summary statistics announced with context
- [ ] Error messages are accessible (not just visual)

### Keyboard Navigation
- [ ] Tab moves through interactive elements in logical order
- [ ] Shift+Tab navigates backward
- [ ] Enter triggers buttons and adds todos
- [ ] Space toggles checkboxes
- [ ] Escape closes any modals (if added)

### Visual Accessibility
- [ ] Color is not the only way to identify status (icon + text)
- [ ] Sufficient color contrast (WCAG AA standard)
- [ ] Focus indicators visible on all interactive elements
- [ ] Text is readable at 200% zoom

### Semantic HTML
- [ ] Form inputs use `<input>` elements
- [ ] Buttons use `<button>` elements
- [ ] List uses `<ul>` and `<li>` elements
- [ ] Headings use proper hierarchy (h1, h2, etc.)
- [ ] No divs used for semantic elements

---

## Test Coverage Roadmap

### Phase 1: Core Functionality (Current)
- ✅ Happy path workflows
- ✅ Basic input validation

### Phase 2: Robustness
- [ ] Alternative flows (editing, bulk operations)
- [ ] Negative cases (error handling)
- [ ] Basic edge cases (data volume, text content)

### Phase 3: Experience
- [ ] Mobile & accessibility testing
- [ ] Performance benchmarks
- [ ] Browser compatibility

### Phase 4: Polish
- [ ] Complete accessibility audit
- [ ] Memory leak detection
- [ ] Integration with backend (if applicable)

---

## Running Tests

### Unit Tests (Vitest)
```bash
# Run all tests
pnpm test

# Run tests for todo feature
pnpm test -- TodoList.test.ts

# Watch mode (auto-rerun on change)
pnpm test -- --watch

# With coverage
pnpm test -- --coverage
```

### E2E Tests (Playwright)
```bash
# Run all e2e tests
pnpm test:e2e

# Run todo tests
pnpm test:e2e -- todo.spec.ts

# Headed mode (see browser)
pnpm test:e2e -- --headed

# Debug mode
pnpm test:e2e -- --debug
```

---

## Notes for Future Development

- **Persistence**: Consider localStorage or backend API integration
- **Undo/Redo**: Could extend with action history (see Counter problem for pattern)
- **Collaboration**: Could add sharing/real-time sync features
- **Rich Text**: Could support markdown, due dates, categories, tags
- **Performance**: Consider virtualization for 1000+ item lists

---

## Test Status Summary

| Category | Coverage | Status |
|----------|----------|--------|
| Happy Path | ~80% | ✅ Complete |
| Alternative Flows | ~0% | 📋 TODO |
| Negative Cases | ~30% | 🟡 Partial |
| Edge Cases | ~20% | 🟡 Partial |
| Performance | ~0% | 📋 TODO |
| Accessibility | ~50% | 🟡 Partial |

Next step: Pick one category (e.g., "Alternative Flows") and add tests from that section.
