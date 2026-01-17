## 1. Component Implementation

- [ ] 1.1 Create HorizontalMenuBar component in `onHerWay/components/HorizontalMenuBar.tsx`
  - [ ] 1.1.1 Define props interface (activeView, setActiveView, pendingActionsCount)
  - [ ] 1.1.2 Create three button items: AI Chat, Action Plan, Skill Resources
  - [ ] 1.1.3 Add SVG icons for each button (reuse from Layout or create new)
  - [ ] 1.1.4 Implement active state styling (yellow glow, border, icon color)
  - [ ] 1.1.5 Add pending actions badge for Action Plan button
  - [ ] 1.1.6 Style with glass-panel and responsive classes
  - [ ] 1.1.7 Export component

- [ ] 1.2 Integrate HorizontalMenuBar into App.tsx
  - [ ] 1.2.1 Import HorizontalMenuBar component
  - [ ] 1.2.2 Add HorizontalMenuBar below TopNav, conditionally rendered for ViewMode.INSIGHT_SUMMARY
  - [ ] 1.2.3 Pass ohwActiveView, setOhwActiveView, and pendingActionsCount props
  - [ ] 1.2.4 Adjust layout to accommodate menu bar (padding/margin)

- [ ] 1.3 Update ChatView to conditionally hide input box
  - [ ] 1.3.1 Add conditional rendering for input box (only show when activeView === 'chat')
  - [ ] 1.3.2 Ensure input box is hidden by default when user is not in chat view
  - [ ] 1.3.3 Preserve existing input functionality when in chat view

## 2. Styling and Visual Polish

- [ ] 2.1 Match HorizontalMenuBar styling with existing Layout navigation
  - [ ] 2.1.1 Use glass-panel-heavy for background
  - [ ] 2.1.2 Apply border-white/10 and shadow effects
  - [ ] 2.1.3 Add hover states (scale, bg opacity change)
  - [ ] 2.1.4 Ensure active state matches Layout (yellow glow, rotating border dot)

- [ ] 2.2 Implement responsive behavior
  - [ ] 2.2.1 Desktop: full labels, horizontal row, sticky below TopNav
  - [ ] 2.2.2 Mobile: compact labels, horizontal row, positioned above content
  - [ ] 2.2.3 Ensure no overlap with bottom navigation on mobile

## 3. Testing and Validation

- [ ] 3.1 Manual testing: navigation flows
  - [ ] 3.1.1 Verify clicking "AI聊天" navigates to ChatView
  - [ ] 3.1.2 Verify clicking "行动清单" navigates to PlanView
  - [ ] 3.1.3 Verify clicking "能力星图" navigates to ResourceView
  - [ ] 3.1.4 Verify active state highlights correct button

- [ ] 3.2 Manual testing: badge display
  - [ ] 3.2.1 Verify badge shows pending actions count
  - [ ] 3.2.2 Verify badge hides when count is 0
  - [ ] 3.2.3 Verify badge animates (bounce) on new pending action

- [ ] 3.3 Manual testing: coexistence with existing navigation
  - [ ] 3.3.1 Verify vertical sidebar navigation still works
  - [ ] 3.3.2 Verify bottom navigation still works on mobile
  - [ ] 3.3.3 Verify switching between views via different nav systems

- [ ] 3.4 Manual testing: responsive behavior
  - [ ] 3.4.1 Test on desktop viewport (≥768px)
  - [ ] 3.4.2 Test on mobile viewport (<768px)
  - [ ] 3.4.3 Verify menu bar does not break layout on small screens

- [ ] 3.5 Manual testing: ChatView input box
  - [ ] 3.5.1 Verify input box is hidden when not in chat view
  - [ ] 3.5.2 Verify input box appears when navigating to chat view
  - [ ] 3.5.3 Verify input functionality unchanged

## 4. Documentation

- [ ] 4.1 Update AGENTS.md if needed (document new component pattern)
- [ ] 4.2 Add inline comments explaining menu bar integration in App.tsx
