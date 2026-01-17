# Add Vertical Right-Side Menu Bar to MY WAY Map View

## Why
Users currently navigate between views and initiate AI calls through TopNav's right-side horizontal controls. The "聊聊..." input box and AI call button occupy valuable horizontal space and create a mixed interaction model. By moving these controls into a dedicated vertical menu bar on the right side of the screen, we:
1. **Free up TopNav real estate** for core view switching
2. **Establish consistent navigation patterns** matching the left-side vertical nav aesthetic
3. **Group related AI interaction features** in a single, visually coherent component

## What Changes
In the MY WAY Map view (ViewMode.MY_MAP), replace TopNav's right-side "聊聊..." input and AI call button with a new vertical menu bar positioned on the screen's right edge. This menu bar will adopt the glassmorphic, circular button style from Layout.tsx's left sidebar navigation (line 184-228), creating visual symmetry and consistent interaction patterns.

## Summary
Add a new vertical right-side menu bar component in ViewMode.MY_MAP that contains:
- AI call button (语音通话) with phone icon
- Additional menu items for future quick actions

The button style matches Layout's vertical nav: circular buttons with glassmorphic background, hover effects, active state glow, and icon-based interaction.

## Motivation
Currently, TopNav.tsx (lines 52-75) contains:
- A text input "聊聊..." (chat input box)
- A circular AI call button with orange background

**Problems with current approach:**
1. **Horizontal space consumption**: TopNav right side is crowded
2. **Inconsistent patterns**: Left side has vertical nav (Layout), right side has horizontal controls
3. **Limited scalability**: Hard to add more quick actions without cluttering TopNav

**Benefits of vertical right menu:**
1. **Visual symmetry**: Mirrors the left-side vertical nav from Layout.tsx
2. **Scalability**: Easy to add more quick-action buttons vertically
3. **Consistent aesthetics**: Uses the same glassmorphic, circular button style throughout the app
4. **Better mobile adaptation**: Vertical menus adapt better to narrow screens

## Goals
- Create a new `VerticalRightMenu` component styled like Layout's left sidebar nav
- Position it on the right edge of the screen in ViewMode.MY_MAP
- Include AI call button (phone icon) matching Layout's button style (glassmorphic circle with glow effects)
- Remove "聊聊..." input and AI call button from TopNav in MY WAY view
- Maintain z-index layering to ensure menu doesn't conflict with map interactions

## Non-Goals
- Do not modify navigation in ViewMode.COMMUNITY or ViewMode.INSIGHT_SUMMARY
- Do not change the left-side Layout navigation structure
- Do not alter TopNav's view switcher or left-side title
- Do not implement the "聊聊..." input functionality in this change (focus on menu structure first)

## Open Questions
- Should the menu include additional buttons beyond AI call (e.g., quick settings, notifications)?
- Mobile behavior: Should the vertical menu collapse into the bottom nav or remain visible?
- Should the menu have a logo/branding element at the top like Layout's "O" badge?

## Success Metrics
- AI call button is accessible via the right-side vertical menu in MY WAY view
- TopNav right side is cleaner with only the view switcher
- Button styles match Layout's glassmorphic circular aesthetic
- No regression in AI call functionality (VoiceCallModal still opens correctly)
- Consistent visual language across left and right navigation elements
