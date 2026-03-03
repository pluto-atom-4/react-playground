## React Frontend Problems for Full Stack Engineer

### State Management & Hooks (High likelihood – Tests user interactions, like personalized flows)

1. [Implement a Todo List with Filtering](https://leetcode.com/problems/design-front-end-component/) (or similar custom: Build a searchable todo app).
    - Why: Matches reports of "search/filter UI" for data like home listings; tests useState/useEffect for dynamic updates.
    - Tips: Use useState for list/filter; add debouncing for search. Explain re-renders and memoization.
2. [Debounce Input Handler](https://www.greatfrontend.com/questions/javascript/debounce) (Custom: Implement useDebounce hook for search).
    - Why: Common for optimizing real-time searches (e.g., property filters); aligns with performance in consumer apps.
    - Tips: Use useEffect + setTimeout; clean up. Discuss why debounce over throttle.
3. [Phone Number Input Formatter](https://www.greatfrontend.com/questions/user-interface/phone-number-input).
     - Why: Tests controlled inputs and validation (e.g., form fields for user data); practical for UI craftsmanship.
     - Tips: Use useState for value; regex for formatting. Handle backspace/edges.

### Components & Rendering (Common – Focus on reusable UI, like dashboards)

4. [Build a Counter with Undo/Redo](https://leetcode.com/problems/design-front-end-component/) (Variant: State history component).
     - Why: Tests component composition and state history (e.g., user actions in buying flows); reported in behavioral-tech blends.
     - Tips: Use useReducer + array for history; explain reducer patterns.
5. [Infinite Scroll List](https://www.greatfrontend.com/questions/user-interface/infinite-scroller) (e.g., Load more listings).
     - Why: Scalable for data-heavy UIs (e.g., home searches); ties to GraphQL fetching.
     - Tips: Use IntersectionObserver + useEffect; mock API calls.
6. [Accordion Component](https://www.greatfrontend.com/questions/user-interface/accordion) (Collapsible sections).
     - Why: Common for multi-product experiences; tests props, controlled state.
     - Tips: Use useState for open index; support multi-open.

### Performance & Optimization (Likely in senior roles – For scalable architecture)

7. [Memoize Expensive Component](https://leetcode.com/problems/design-front-end-component/) (e.g., Optimize list render).
     - Why: Emphasizes craftsmanship; reports mention avoiding re-renders in UIs.
     - Tips: Use React.memo/useCallback; explain when to use.
8. [Lazy Load Images](https://www.greatfrontend.com/questions/user-interface/lazy-image).
     - Why: For image-heavy apps (e.g., property photos); performance in consumer team.
     - Tips: Use loading="lazy" + placeholder; IntersectionObserver fallback.
9. [Context API Provider](https://www.greatfrontend.com/questions/user-interface/context-api) (Global state for theme/auth).
     - Why: For multi-product personalization; alternative to Redux.
     - Tips: Create context + provider; avoid over-renders.

### Integration & Advanced (For full-stack tie-ins, e.g., GraphQL)

10. [Data Fetching Component](https://www.greatfrontend.com/questions/user-interface/data-fetching) (e.g., Fetch + display listings via GraphQL).
    - Why: End-to-end ownership; reports include JSON fetching/rendering.
    - Tips: Use useEffect + fetch; handle loading/error.
11. [Excel-like Spreadsheet UI](https://leetcode.com/problems/design-excel-sum-formula/) (Variant: React grid with formulas).
      - Why: Directly reported (getters/setters with summation); tests dynamic UI.
      - Tips: 2D array state; parse formulas recursively.
12. [Game of Life Simulator](https://leetcode.com/problems/game-of-life/) (React board renderer).
     - Why: Reported simulation; add React for interactive grid UI.
     - Tips: Use useState for board; interval for updates.

---
### Preparation Tips

- Practice Focus: 60% on hooks/components (core for UI delight); use TypeScript for typesafety (job prefers). Integrate DSA (e.g., search in UI).
- Patterns: Explain lifecycle, re-renders, keys; tie to Opendoor mission (e.g., fast user flows).
- Resources: GreatFrontend/InterviewBit for UI tasks; Glassdoor for custom variants.
- Difficulty: Medium; expect follow-ups (e.g., optimize for 10k items).

---
### Note:

From 2025-2026 candidate reports on Glassdoor, Levels.fyi, and Prepfully, Opendoor's full-stack technical screens (e.g., pair-programming in CoderPad) often blend frontend React tasks with DSA or backend integration. 

Frontend problems focus on React/TypeScript for UI components, state management, hooks, and performance in user-centered apps (e.g., personalized home-buying flows). 

Expect 1-2 problems per screen, emphasizing clean code, explanation, and real-world scalability (e.g., handling listings data via GraphQL). 

Custom tasks like "spreadsheet UI with getters/setters" or "search/filter UI" map to React patterns, often involving JSON data rendering or simulations like Conway's Game of Life as interactive components.

Here's a curated list of 12 highly possible React frontend problems (prioritized by relevance to Opendoor reports). Grouped by pattern, with why likely, LeetCode-style links (or equivalents), and tips. Use TypeScript/JS in practice; focus on hooks, components, and optimization.
