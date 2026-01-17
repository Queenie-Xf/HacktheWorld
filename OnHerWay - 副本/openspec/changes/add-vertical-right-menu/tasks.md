# Implementation Tasks

## Task 1: Create VerticalRightMenu component
- [x] **Goal**: Build the new component with glassmorphic styling matching Layout.tsx

**Steps**:
1. Create `components/VerticalRightMenu.tsx`
2. Define interface accepting `onCallStart: () => void` callback
3. Implement JSX structure:
   - Outer container: `fixed right-0 top-1/2 -translate-y-1/2` positioning
   - Inner glass panel: `glass-panel-heavy rounded-full py-6 px-3` (matching Layout line 185)
   - Button list container: `flex flex-col items-center gap-6`
4. Add AI call button:
   - Use phone icon SVG from TopNav.tsx (lines 71-73)
   - Apply button classes from Layout.tsx (lines 193-224): circular, hover scale, glow effects
   - Wire `onClick` to `onCallStart` prop
5. Export component as named export

**Validation**: Component renders with correct glassmorphic styling and responds to clicks ✓

**Dependencies**: None

**Estimated complexity**: Small (single component creation)

---

## Task 2: Conditionally render VerticalRightMenu in App.tsx
- [x] **Goal**: Show right menu only in MY WAY view, pass AI call handler

**Steps**:
1. Open `App.tsx`
2. Import `VerticalRightMenu` component
3. Add conditional render after TopNav:
   ```tsx
   {viewMode === ViewMode.MY_MAP && (
     <VerticalRightMenu onCallStart={() => {
       setCallReturnViewMode(viewMode);
       setIsCallActive(true);
     }} />
   )}
   ```
4. Ensure z-index layering: right menu should be above map but below modals

**Validation**: Right menu appears in MY WAY, disappears in COMMUNITY/INSIGHT_SUMMARY ✓

**Dependencies**: Task 1

**Estimated complexity**: Small (straightforward integration)

---

## Task 3: Update TopNav to conditionally hide chat controls in MY WAY
- [x] **Goal**: Remove "聊聊..." input and AI call button from TopNav when ViewMode is MY_MAP

**Steps**:
1. Open `TopNav.tsx`
2. Add `currentView` prop (already exists, confirm usage)
3. Wrap chat controls section (lines 52-75) in conditional:
   ```tsx
   {currentView !== ViewMode.MY_MAP && (
     <div className="flex items-center space-x-3">
       {/* existing chat input and call button */}
     </div>
   )}
   ```
4. Ensure view switcher (lines 25-49) remains visible in all views

**Validation**:
- MY WAY view: TopNav shows only view switcher ✓
- COMMUNITY view: TopNav shows view switcher + chat controls ✓
- AI call works from right menu in MY WAY ✓

**Dependencies**: Task 2

**Estimated complexity**: Small (simple conditional rendering)

---

## Task 4: Add hover tooltips to right menu buttons
- [x] **Goal**: Provide labels like Layout's left nav (line 220-223)

**Steps**:
1. Open `VerticalRightMenu.tsx`
2. Add tooltip div to AI call button:
   ```tsx
   <div className="absolute right-full mr-4 px-3 py-1 glass-panel rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
     <span className="text-xs font-bold tracking-widest uppercase text-white">AI 通话</span>
     <div className="absolute top-1/2 left-full w-4 h-[1px] bg-white/20"></div>
   </div>
   ```
3. Add `group` class to button wrapper

**Validation**: Hovering AI call button shows "AI 通话" tooltip to the left ✓

**Dependencies**: Task 1

**Estimated complexity**: Trivial (copy existing pattern)

---

## Task 5: Manual QA across viewports
- [x] **Goal**: Ensure no regressions, consistent behavior

**Steps**:
1. Run `npm run dev` ✓
2. Test MY WAY view:
   - Right menu visible on right edge ✓
   - TopNav shows only view switcher (no chat controls) ✓
   - Clicking AI call button opens VoiceCallModal ✓
   - Hover shows tooltip ✓
3. Test COMMUNITY view:
   - Right menu NOT visible ✓
   - TopNav shows full controls (view switcher + chat input + AI call button) ✓
4. Test INSIGHT_SUMMARY view:
   - Right menu NOT visible ✓
   - TopNav shows full controls ✓
5. Test mobile viewport (narrow screen):
   - Right menu positioning doesn't break layout ✓
   - Buttons remain accessible ✓
6. Test z-index layering:
   - Right menu appears above map elements ✓
   - Modals (VoiceCallModal) appear above right menu ✓

**Validation**: All scenarios pass, no visual or interaction regressions ✓

**Dependencies**: Tasks 1-4

**Estimated complexity**: Medium (comprehensive testing)

---

## Task 6: Code review and style consistency check
- [x] **Goal**: Ensure code follows project conventions

**Steps**:
1. Verify TypeScript interfaces are explicit (no `any` types) ✓
2. Check className usage matches Tailwind utility-first pattern ✓
3. Confirm component uses named export (not default) ✓
4. Ensure indentation and formatting match existing files ✓
5. Verify no console errors or warnings in browser console ✓

**Validation**: Code passes linting, matches project style guide ✓

**Dependencies**: Tasks 1-5

**Estimated complexity**: Small (review and polish)

---

## Notes
- All tasks can be completed sequentially
- No parallel work required (each task builds on previous)
- Total estimated time: ~2-3 hours for implementation + testing
- No breaking changes to existing functionality outside MY WAY view
