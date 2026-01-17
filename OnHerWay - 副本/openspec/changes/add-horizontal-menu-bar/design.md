# Design: Horizontal Menu Bar

## Architecture

### Component Structure
```
App.tsx (ViewMode.INSIGHT_SUMMARY)
  └── TopNav
  └── HorizontalMenuBar (NEW)
      ├── AI Chat Button
      ├── Action Plan Button
      └── Skill Resources Button
  └── OhwLayout (existing vertical nav)
      └── Content Views
```

### Component Responsibilities

**HorizontalMenuBar**:
- New component in `onHerWay/components/HorizontalMenuBar.tsx`
- Receives `activeView` and `setActiveView` props (same as Layout)
- Receives `pendingActionsCount` for badge display on Action Plan button
- Renders three buttons with icons and labels
- Highlights active view with visual treatment (yellow glow, similar to Layout nav)

**App.tsx**:
- Renders HorizontalMenuBar between TopNav and OhwLayout when `viewMode === ViewMode.INSIGHT_SUMMARY`
- Passes `ohwActiveView` and `setOhwActiveView` to HorizontalMenuBar
- Passes `pendingActionsCount` to HorizontalMenuBar

**ChatView** modifications:
- Remove default input box and send button
- User must explicitly click "AI聊天" button in menu bar to enter chat view
- Once in chat view, the input box appears (existing behavior preserved)

### Visual Design

#### Desktop Layout
```
┌─────────────────────────────────────────┐
│            TopNav (existing)             │
├─────────────────────────────────────────┤
│  HorizontalMenuBar                       │
│  [AI聊天] [行动清单·3] [能力星图]        │
├──────┬──────────────────────────────────┤
│ Vert │                                   │
│ Nav  │      Content Area                 │
│ (4+) │      (chat/insight/plan/etc)      │
│      │                                   │
└──────┴──────────────────────────────────┘
```

#### Mobile Layout
```
┌─────────────────────────────────────────┐
│  HorizontalMenuBar                       │
│  [AI聊天] [行动清单·3] [能力星图]        │
├─────────────────────────────────────────┤
│                                          │
│      Content Area                        │
│      (chat/insight/plan/etc)             │
│                                          │
├─────────────────────────────────────────┤
│  Bottom Nav (4 items: 自我洞察, 社区...)  │
└─────────────────────────────────────────┘
```

### Button Styling
- Consistent with Layout navigation buttons
- Glass panel background with border
- Icon + label (horizontal layout)
- Active state: yellow glow border, yellow icon color
- Badge for pending actions count (Action Plan only)
- Hover: scale slightly, bg opacity increase

### State Management
- No new state required
- Reuse existing `ohwActiveView` state from App.tsx
- Menu bar is a controlled component (receives activeView as prop)

## Trade-offs

### Option 1: Sticky Menu Bar (Recommended)
**Pros**:
- Always visible, faster navigation
- Consistent with TopNav behavior

**Cons**:
- Takes up vertical space
- May feel redundant with vertical nav

### Option 2: Scrollable Menu Bar
**Pros**:
- More content area when scrolled

**Cons**:
- Harder to access when scrolled down

**Decision**: Use sticky positioning (fixed below TopNav) for better accessibility.

## Migration Strategy
1. Create HorizontalMenuBar component
2. Add to App.tsx below TopNav, conditionally rendered for ViewMode.INSIGHT_SUMMARY
3. Update ChatView to hide input box when activeView !== 'chat'
4. Test navigation flows to ensure no regressions

## Dependencies
- No new external dependencies
- Uses existing View types and setActiveView pattern
- Reuses Layout navigation styling patterns
