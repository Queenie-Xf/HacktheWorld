# Add MY MAP Sub-View Navigation to Vertical Right Menu

## Why
Currently, after AI calls end, users are directed to the INSIGHT_SUMMARY view where they access 行动清单 (Action List), 能力星图 (Skill Resources), and 建联交流 (Networking) through the left-side vertical navigation (Layout component). However, users in MY_MAP view cannot easily access these post-call features without switching to INSIGHT_SUMMARY. By adding these navigation options to the vertical right menu in MY_MAP, users can:
1. **Stay in context**: Access action lists and resources without leaving MY_MAP
2. **Unified navigation**: Use one consistent menu for all MY_MAP-related sub-views
3. **Seamless flow**: Switch between puzzle map, actions, resources, networking, and AI calls in one place

## What Changes
Extend the vertical right menu in MY_MAP view to support sub-view navigation, allowing users to switch between:
- **拼图地图 (Puzzle Map)**: The default MY_MAP canvas view
- **行动清单 (Action List)**: The OHW PlanView component
- **能力星图 (Skill Resources)**: The OHW ResourceView component
- **建联交流 (Networking)**: The OHW NetworkView component
- **AI 通话 (AI Call)**: Existing phone button

## Summary
Transform the MY_MAP view from a single puzzle canvas into a multi-page experience with:
- 1 action button for AI calls (top position)
- Horizontal divider line
- 4 navigation buttons for sub-views (Map, Resources, Actions, Networking) in order
- Active state indication matching Layout's yellow glow pattern (only for navigation buttons)
- Conditional rendering of the appropriate sub-view based on active button

**Button order from top to bottom:**
1. AI 通话 (AI Call) - action button, no active state
2. ─── Divider line ───
3. 拼图地图 (Puzzle Map) - navigation button with active state
4. 能力星图 (Skill Resources) - navigation button with active state
5. 行动清单 (Action List) - navigation button with active state
6. 建联交流 (Networking) - navigation button with active state

The vertical right menu becomes the primary navigation hub for MY_MAP, replacing the need to use INSIGHT_SUMMARY's left sidebar for post-call features.

## Motivation
**Current pain points:**
1. **Fragmented flow**: Users complete AI calls → navigate to INSIGHT_SUMMARY → use left sidebar → lose context of their puzzle map
2. **Inconsistent patterns**: MY_MAP has right menu, INSIGHT_SUMMARY has left menu
3. **Cognitive load**: Users must learn two different navigation patterns for related features

**Benefits of unified MY_MAP navigation:**
1. **Context preservation**: Stay on puzzle map while accessing actions/resources
2. **Consistent UX**: One vertical menu on the right handles all MY_MAP sub-views
3. **Efficient workflow**: Quick switching between map, actions, resources, networking, and calls
4. **Reduced complexity**: Eliminate need to switch between ViewMode.MY_MAP and ViewMode.INSIGHT_SUMMARY

## Goals
- Keep AI call button at the top of VerticalRightMenu as action trigger (no active state)
- Add horizontal divider line below AI call button for visual separation
- Add 4 navigation buttons below divider in order: Map, Resources, Actions, Networking
- Implement sub-view state management within MY_MAP
- Render OHW components (PlanView, ResourceView, NetworkView) conditionally in MY_MAP
- **Ensure data synchronization**: Actions added in INSIGHT_SUMMARY automatically appear in MY_MAP action list (using shared `ohwActions` state)
- Maintain MapCanvas as default sub-view
- Preserve existing OHW data flow (actions, profile, posts)
- Keep INSIGHT_SUMMARY view intact for users who prefer the original flow

## Non-Goals
- Do not remove INSIGHT_SUMMARY view or its left sidebar navigation
- Do not modify OHW component internals (PlanView, ResourceView, NetworkView)
- Do not change the AI call flow or post-call persona/insight generation
- Do not alter MapCanvas zoom/drag interactions

## Open Questions
- Should the sub-view state persist when switching away from MY_MAP and back?
- Should there be visual indication (badge/count) on the Action List button showing pending actions?
- Mobile behavior: How should the 5 buttons fit on narrow screens?

## Success Metrics
- Users can navigate to Action List, Resources, and Networking from MY_MAP view
- Puzzle Map canvas remains accessible via dedicated button
- AI call button retains existing functionality
- Active sub-view shows yellow glow effect matching Layout pattern
- **Data synchronization**: Actions added in INSIGHT_SUMMARY immediately appear in MY_MAP action list and vice versa
- **State consistency**: Completing actions in MY_MAP updates the count in INSIGHT_SUMMARY, and vice versa
- No data loss when switching between sub-views or between MY_MAP and INSIGHT_SUMMARY
- INSIGHT_SUMMARY view continues to work independently
