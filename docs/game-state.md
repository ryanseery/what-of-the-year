# Game State Management

## Current Approach: Granular Hooks

Right now, screens compose multiple hooks:

```tsx
const { session, isLoading: sessionLoading, error: sessionError } = useSession(sessionId);
const { round, isLoading: roundLoading, error: roundError } = useRound(sessionId, roundNumber);
const { players, isHost, isLoading: playersLoading, error: playersError } = usePlayers(sessionId);
const {
  selections,
  isLoading: selectionsLoading,
  error: selectionsError,
} = useSelections(sessionId, roundNumber);

const loading = sessionLoading || roundLoading || playersLoading || selectionsLoading;
const error = sessionError || roundError || playersError || selectionsError;
```

## Proposed Approach: Unified Hook

```tsx
const { session, round, players, selections, isHost, loading, error } = useGameState(
  sessionId,
  roundNumber,
);
```

---

## Pros of Unified Hook

### Developer Experience

- **Single import** - Less boilerplate, fewer lines of code
- **Consistent patterns** - Loading and error states handled uniformly
- **Less repetition** - Don't repeat `sessionId` and `roundNumber` params across hooks
- **Easier onboarding** - New devs only learn one hook

### Architecture

- **Cross-cutting concerns** - Easier to add logging, analytics, debugging wrappers
- **Coordinated updates** - Can batch related Firestore queries or add caching strategies
- **Single source of truth** - Game state logic lives in one place
- **Derived state** - Can compute things like `isGameOver`, `currentPlayerTurn`, etc. once

### Maintenance

- **Centralized changes** - Update game logic in one place
- **Easier to refactor** - When schema changes, update one hook
- **Type safety** - Single return type ensures all consumers get consistent data

---

## Cons of Unified Hook

### Performance

- **Over-fetching** - Lobby only needs `session` and `players`, but would get `round` and `selections` too
- **Unnecessary re-renders** - Changes to `selections` would re-render components that only care about `players`
- **Always-on subscriptions** - Can't conditionally subscribe based on what screen needs

### Flexibility

- **Less composable** - Can't mix and match (e.g., just `useSession` + `usePlayers`)
- **Harder to optimize** - Granular hooks let screens subscribe to only what they need
- **Inflexible API** - Different screens need different data at different times

### Maintainability

- **God hook** - Risk of becoming bloated with too many responsibilities
- **Harder to test** - Testing individual pieces (just player logic) becomes harder
- **Tight coupling** - All game state logic coupled together instead of separated by concern
- **Harder to debug** - When something breaks, harder to isolate which piece

### Real-time Subscriptions

- **Firestore costs** - More active listeners = more reads = higher costs
- **Can't skip subscriptions** - Round screen needs all data, but lobby doesn't need `round`
- **Memory usage** - More subscriptions active simultaneously

---

## Recommendation: Hybrid Approach

Keep granular hooks for **flexibility and performance**, but add **convenience wrappers** for common patterns:

### Option 1: Composite Hook (Best of Both Worlds)

```tsx
// For screens that need everything (Round screen)
export function useGameState(sessionId: string, roundNumber: number) {
  const session = useSession(sessionId);
  const round = useRound(sessionId, roundNumber);
  const players = usePlayers(sessionId);
  const selections = useSelections(sessionId, roundNumber);

  return {
    session: session.session,
    round: round.round,
    players: players.players,
    selections: selections.selections,
    isHost: players.isHost,
    loading: session.isLoading || round.isLoading || players.isLoading || selections.isLoading,
    error: session.error || round.error || players.error || selections.error,
  };
}

// For screens that need less (Lobby screen)
export function useLobbyState(sessionId: string) {
  const session = useSession(sessionId);
  const players = usePlayers(sessionId);

  return {
    session: session.session,
    players: players.players,
    isHost: players.isHost,
    loading: session.isLoading || players.isLoading,
    error: session.error || players.error,
  };
}
```

**Pros:**

- Screens can choose: use `useGameState` for convenience or compose hooks for optimization
- No performance penalty - only subscribes to what's used
- Granular hooks remain testable and reusable
- Easy to add new composite hooks for specific screens

**Cons:**

- More API surface area (both granular and composite hooks)
- Need to maintain both patterns

### Option 2: Keep Current Approach

The current approach is **actually quite good** for a real-time app:

- **Performance-first** - Only subscribe to what you need
- **Clear dependencies** - Easy to see what data each screen uses
- **Firestore-optimized** - Minimizes real-time listener costs
- **Testable** - Each hook tests independently

The "boilerplate" is actually **explicit data dependencies**, which is valuable for understanding data flow.

---

## Decision Factors

Choose **unified hook** if:

- Most screens need the same data
- Convenience > performance
- Small user base (Firestore costs low)
- Rapid prototyping phase

Choose **granular hooks** if:

- Performance matters (real-time subscriptions = cost)
- Different screens need very different data
- Need fine-grained control over subscriptions
- Codebase will grow and need flexibility

Choose **hybrid approach** if:

- Want convenience without losing flexibility
- Willing to maintain both patterns
- Want to optimize screen-by-screen

---

## Current Recommendation

**Stick with granular hooks** for now because:

1. **Firestore costs** - Each listener = ongoing reads. Over-subscribing gets expensive fast.
2. **Real-time perf** - Unnecessary subscriptions cause unnecessary re-renders
3. **It's working** - The current pattern is clear and maintainable
4. **Can always refactor** - Easy to add a wrapper later if boilerplate becomes painful

The repetition you're seeing is **good repetition** - it makes data dependencies explicit and keeps performance optimal for a real-time multiplayer app.

If the boilerplate bothers you, add the **hybrid approach** - best of both worlds with zero downsides.
