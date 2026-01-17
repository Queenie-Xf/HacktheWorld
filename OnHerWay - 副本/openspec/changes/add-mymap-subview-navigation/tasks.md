# Implementation Tasks

## Task 1: Create MyMapSubView type and state in App.tsx
- [x] **Goal**: Add type definition and state management for MY_MAP sub-views

**Steps**:
1. Create `MyMapSubView` type in `types.ts`: `'map' | 'plan' | 'resources' | 'network'`
2. Add `myMapSubView` state in App.tsx with default value `'map'`
3. Add `setMyMapSubView` setter function

**Validation**: State compiles without TypeScript errors

**Dependencies**: None

**Estimated complexity**: Trivial

---

## Task 2: Update VerticalRightMenu to accept sub-view navigation props
- [x] **Goal**: Extend VerticalRightMenu component to handle AI call + divider + 4 nav buttons

**Steps**:
1. Update `VerticalRightMenuProps` interface to include:
   - `activeSubView: 'map' | 'plan' | 'resources' | 'network'`
   - `onSubViewChange: (view: 'map' | 'plan' | 'resources' | 'network') => void`
   - `pendingActionsCount?: number` (for badge on Action List button)
2. Keep AI call button at top (existing implementation)
3. Add horizontal divider below AI call button:
   - `<div className="h-[1px] bg-white/20 w-8 my-2"></div>`
4. Add 4 navigation buttons below divider in this order:
   - Button 1: Map icon (puzzle grid/squares)
   - Button 2: Resources icon (star constellation/network)
   - Button 3: Plan icon (checklist/clipboard)
   - Button 4: Network icon (people/users)
5. Apply active state styling to nav buttons when `activeSubView === button.id`:
   - Use Layout's pattern: `scale-110`, `bg-brand-yellow/10`, spinning border, yellow glow
   - DO NOT apply active state to AI call button (it's an action, not navigation)
6. Add tooltips: "拼图地图", "能力星图", "行动清单", "建联交流"
7. Wire nav button `onClick` to call `onSubViewChange(view)`

**Validation**:
- AI call button at top, divider visible, 4 nav buttons below
- Hover shows tooltips
- Nav button clicks fire `onSubViewChange` callback
- AI call button click fires `onCallStart` callback
- Only nav buttons show active state, AI button never does

**Dependencies**: Task 1

**Estimated complexity**: Medium

---

## Task 3: Implement conditional sub-view rendering in App.tsx MY_MAP layer
- [x] **Goal**: Show MapCanvas or OHW components based on `myMapSubView` state

**Steps**:
1. In the MY_MAP layer (lines 462-470), wrap MapCanvas in conditional:
   ```tsx
   {myMapSubView === 'map' && <MapCanvas puzzles={...} />}
   ```
2. Add conditional renders for OHW components:
   ```tsx
   {myMapSubView === 'plan' && (
     <OhwPlanView
       actions={ohwActions}
       onCompleteAction={handleCompleteOhwAction}
       onShareAction={handleShareOhwAction}
       onAskAction={handleAskOhwAction}
       onNavigateToChat={...}
     />
   )}
   {myMapSubView === 'resources' && (
     <OhwResourceView profile={ohwProfile} completedActions={...} />
   )}
   {myMapSubView === 'network' && (
     <OhwNetworkView userProfile={ohwProfile} />
   )}
   ```
3. Ensure Sidebar remains visible in all sub-views (stays outside the conditional)
4. Update VerticalRightMenu render to pass new props:
   ```tsx
   <VerticalRightMenu
     activeSubView={myMapSubView}
     onSubViewChange={setMyMapSubView}
     pendingActionsCount={ohwActions.filter(a => a.status === 'pending').length}
     onCallStart={...}
   />
   ```

**Validation**:
- Default shows MapCanvas
- Clicking Action List shows PlanView
- Clicking Resources shows ResourceView
- Clicking Networking shows NetworkView
- Clicking Map returns to MapCanvas

**Dependencies**: Tasks 1, 2

**Estimated complexity**: Medium

---

## Task 4: Handle OHW component callbacks in MY_MAP context
- [x] **Goal**: Ensure OHW component actions work correctly from MY_MAP sub-views

**Steps**:
1. For PlanView's `onNavigateToChat` callback:
   - Option A: Switch `myMapSubView` to a new 'chat' sub-view and render MentorChatView
   - Option B: Keep current behavior (switch to INSIGHT_SUMMARY view)
   - **Decision**: Use Option B for minimal scope, consistent with existing flow
2. Verify that:
   - `handleCompleteOhwAction` marks actions as completed
   - `handleShareOhwAction` creates posts and navigates to community
   - `handleAskOhwAction` creates question posts
3. Test that sharing actions from MY_MAP navigates to INSIGHT_SUMMARY community view

**Validation**: All OHW interactions work identically whether accessed from MY_MAP or INSIGHT_SUMMARY

**Dependencies**: Task 3

**Estimated complexity**: Small

---

## Task 5: Add visual transitions between sub-views
- [x] **Goal**: Smooth fade transitions when switching sub-views

**Steps**:
1. Wrap each conditional sub-view render in a transition container:
   ```tsx
   <div className={`absolute inset-0 transition-opacity duration-500 ${
     myMapSubView === 'map' ? 'opacity-100' : 'opacity-0 pointer-events-none'
   }`}>
     <MapCanvas ... />
   </div>
   ```
2. Apply same pattern to plan, resources, network sub-views
3. Ensure z-index layering: all sub-views at same level, controlled by opacity/pointer-events

**Validation**: Smooth fade transitions, no visual glitches, no layout shift

**Dependencies**: Task 3

**Estimated complexity**: Small

---

## Task 6: Manual QA and edge case testing
- [x] **Goal**: Verify all navigation flows, data integrity, and cross-view synchronization

**Steps**:
1. Test complete AI call flow from MY_MAP:
   - Start call from right menu
   - Complete call with transcription
   - Verify post-call returns to MY_MAP (not INSIGHT_SUMMARY)
   - Check if actions generated from call appear in PlanView
2. **Test data synchronization between MY_MAP and INSIGHT_SUMMARY**:
   - Add action in INSIGHT_SUMMARY InsightSummaryView
   - Navigate to MY_MAP → click Action List button
   - Verify new action appears in MY_MAP PlanView
   - Complete action in MY_MAP
   - Navigate back to INSIGHT_SUMMARY → check action shows as completed
   - Verify pending actions count updates in both views
3. **Test reverse synchronization**:
   - Add/complete action in MY_MAP PlanView
   - Navigate to INSIGHT_SUMMARY
   - Verify changes appear in INSIGHT_SUMMARY action list
4. Test sub-view switching:
   - Map → Plan → Resources → Network → Map (full cycle)
   - Verify no data loss between switches
   - Check active button styling updates correctly
5. Test action completion flow:
   - Add action in PlanView (via MY_MAP)
   - Complete action
   - Switch to ResourceView
   - Verify XP updated and action shows in completed list
6. Test sharing from MY_MAP:
   - Complete action in PlanView (MY_MAP)
   - Click "分享动态"
   - Verify navigates to INSIGHT_SUMMARY community view
   - Post appears in feed
7. Test mobile viewport:
   - 5 buttons + divider fit without overflow
   - Tooltips readable
   - Touch targets adequate

**Validation**: All flows work, data synchronized correctly across views, no regressions

**Dependencies**: Tasks 1-5

**Estimated complexity**: Medium

---

## Notes
- All OHW components (PlanView, ResourceView, NetworkView) already exist and are fully functional
- No changes needed to OHW component internals
- This change adds a second access path to these components (via MY_MAP) while preserving the original path (via INSIGHT_SUMMARY)
- Consider future enhancement: Add 'chat' sub-view to MY_MAP to fully replace INSIGHT_SUMMARY navigation
