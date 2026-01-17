# Add Horizontal Menu Bar to On Her Way Views

## Why
Users currently navigate between AI Chat, Action Plan, and Skill Resources using the vertical sidebar (desktop) or bottom navigation (mobile). These are the three most important user workflows in the On Her Way experience, yet they are buried among other navigation items. By surfacing them in a dedicated horizontal menu bar below TopNav, we make these primary actions more discoverable and faster to access.

## Summary
Add a horizontal menu bar below the TopNav in the On Her Way (ViewMode.INSIGHT_SUMMARY) section, containing quick-access buttons for AI Chat, Action Plan, and Skill Resources. This simplifies navigation by surfacing the three most important user workflows without requiring the vertical sidebar navigation.

## Motivation
Currently, users must use the vertical sidebar (desktop) or bottom navigation bar (mobile) to access AI Chat, Action Plan (行动清单), and Skill Resources (能力星图). By adding a horizontal menu bar directly below the TopNav:

1. **Faster access to primary workflows**: AI Chat, Action Plan, and Skill Resources are the core user journeys
2. **Better visual hierarchy**: Menu bar sits prominently at the top, signaling importance
3. **Simplified chat UX**: Removes the always-visible input box in chat view, making the button-click interaction clearer

## Goals
- Add a horizontal menu bar component below TopNav in ViewMode.INSIGHT_SUMMARY
- Include three buttons: AI Chat (AI聊天), Action Plan (行动清单), Skill Resources (能力星图)
- Style buttons consistently with existing Layout navigation items
- Remove the chat input box from the default chat view (user clicks "AI聊天" button to enter chat)
- Keep other navigation items (自我洞察, 社区动态, 建联交流, 我的档案) in the existing vertical sidebar/bottom nav

## Non-Goals
- Do not modify navigation for ViewMode.MY_MAP or ViewMode.COMMUNITY
- Do not remove the existing vertical/bottom navigation bar (it still contains 自我洞察, 社区动态, etc.)
- Do not change the TopNav structure

## Open Questions
- Should the menu bar be sticky (fixed position) or scroll with content?
- Should the active menu item highlight match the vertical nav style (yellow glow)?
- Mobile layout: should the menu bar appear above or below the mobile bottom nav?

## Success Metrics
- Users can navigate to AI Chat, Action Plan, and Skill Resources via the horizontal menu bar
- Chat view no longer shows an input box by default; users must click "AI聊天" to enter chat
- No regression in existing navigation functionality (自我洞察, 社区动态, etc. still accessible via sidebar/bottom nav)
