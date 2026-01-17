# MY MAP Sub-View Navigation

**Capability**: Users can navigate between puzzle map, action list, skill resources, and networking views from the vertical right menu in MY_MAP.

**Scope**: app-navigation

## ADDED Requirements

### Requirement: The system SHALL support sub-view navigation within MY_MAP via vertical right menu
The system SHALL extend the vertical right menu in MY_MAP view to include navigation buttons for Map, Action List, Skill Resources, and Networking sub-views, enabling users to switch between these pages without leaving MY_MAP.

#### Scenario: User sees all navigation options in MY_MAP right menu
**Given** the user is viewing ViewMode.MY_MAP
**When** the vertical right menu renders
**Then** the menu displays 5 buttons plus 1 divider in this order from top to bottom:
**And** button 1: "AI 通话" (AI Call) icon - action button
**And** divider: horizontal line `h-[1px] bg-white/20 w-8 my-2`
**And** button 2: "拼图地图" (Puzzle Map) icon - navigation button
**And** button 3: "能力星图" (Skill Resources) icon - navigation button
**And** button 4: "行动清单" (Action List) icon - navigation button
**And** button 5: "建联交流" (Networking) icon - navigation button
**And** all buttons match the glassmorphic circular style from Layout navigation
**And** only navigation buttons (2-5) can show active state styling

#### Scenario: User switches to Action List sub-view from puzzle map
**Given** the user is viewing the default puzzle map canvas in MY_MAP
**When** the user clicks the "行动清单" button (4th button) in the right menu
**Then** the puzzle map canvas fades out
**And** the PlanView component renders showing the user's action items
**And** the "行动清单" button displays active state (yellow glow, spinning border)
**And** the "拼图地图" button returns to inactive state
**And** the "AI 通话" button remains in normal state (never shows active styling)

#### Scenario: User returns to puzzle map from Action List
**Given** the user is viewing PlanView in MY_MAP
**When** the user clicks the "拼图地图" button
**Then** the PlanView fades out
**And** the MapCanvas re-renders with puzzles
**And** the "拼图地图" button shows active state
**And** the map zoom/drag state is preserved

### Requirement: Vertical menu SHALL include visual divider separating AI call from navigation buttons
The system SHALL render a horizontal divider line below the AI call button to visually separate the action button from the navigation buttons.

#### Scenario: Divider appears between AI call and navigation sections
**Given** the user is viewing MY_MAP
**When** the vertical right menu renders
**Then** a horizontal line appears below the AI call button
**And** the divider has styling `h-[1px] bg-white/20 w-8 my-2`
**And** the divider spans most of the menu width with margin on both sides
**And** navigation buttons (Map, Resources, Actions, Networking) appear below the divider

### Requirement: MY_MAP SHALL conditionally render sub-view components based on active navigation
The system SHALL render MapCanvas, PlanView, ResourceView, or NetworkView within MY_MAP layer depending on which navigation button is active in the vertical right menu.

#### Scenario: Default sub-view is puzzle map canvas
**Given** the user navigates to ViewMode.MY_MAP from LANDING or another view
**When** MY_MAP renders for the first time
**Then** MapCanvas is displayed by default
**And** the "拼图地图" button shows active state
**And** Sidebar component is visible on the left

#### Scenario: OHW components render with correct props in MY_MAP context
**Given** the user clicks "行动清单", "能力星图", or "建联交流" button
**When** the corresponding OHW component renders (PlanView, ResourceView, NetworkView)
**Then** the component receives the same props as it would in INSIGHT_SUMMARY view
**And** actions, profile, and posts data flow correctly
**And** component callbacks (onCompleteAction, onShareAction, etc.) work as expected

#### Scenario: Switching sub-views preserves data and state
**Given** the user has pending actions in the action list
**When** the user switches from PlanView to ResourceView and back to PlanView
**Then** all pending actions are still visible
**And** completed actions remain marked as completed
**And** no data is lost during navigation

#### Scenario: Actions are synchronized between MY_MAP and INSIGHT_SUMMARY
**Given** the user adds an action in INSIGHT_SUMMARY view
**When** the user navigates to MY_MAP and opens the action list (PlanView)
**Then** the newly added action appears in the MY_MAP action list
**And** the action data (title, description, status, difficulty) matches exactly
**When** the user completes the action in MY_MAP
**And** navigates back to INSIGHT_SUMMARY action list
**Then** the action shows as completed in INSIGHT_SUMMARY
**And** the pending actions count badge updates correctly in both views

### Requirement: Active sub-view button SHALL display visual feedback matching Layout pattern
The system SHALL apply active state styling (yellow glow background, animated spinning border, yellow dot) to the currently selected sub-view button in the vertical right menu, identical to Layout's left sidebar active state.

#### Scenario: Active button shows yellow glow and spinning border
**Given** the user is viewing any sub-view in MY_MAP
**When** the corresponding navigation button is active
**Then** the button background is `bg-brand-yellow/10`
**And** an animated spinning border with yellow dot appears around the button
**And** the button icon color is `text-brand-yellow` with drop shadow
**And** the button scales to `scale-110`

#### Scenario: Only one button shows active state at a time
**Given** the user clicks a different sub-view button
**When** the new sub-view renders
**Then** the previously active button returns to inactive state (gray icon, no glow)
**And** the newly clicked button shows active state
**And** the transition is smooth (duration-500)

## MODIFIED Requirements

### Requirement: AI call button behavior (from add-vertical-right-menu spec)
The AI call button (phone icon) SHALL remain at the bottom of the vertical right menu and SHALL NOT show active state styling, as it triggers a modal rather than navigating to a sub-view.

#### Scenario: AI call button does not change state when sub-views switch
**Given** the user is viewing any sub-view in MY_MAP
**When** the user clicks the AI call button
**Then** VoiceCallModal opens as before
**And** the AI call button does NOT show yellow glow or active state
**And** the current sub-view's navigation button remains active

## REMOVED Requirements

None. This is additive functionality; existing MY_MAP canvas and INSIGHT_SUMMARY navigation remain unchanged.
