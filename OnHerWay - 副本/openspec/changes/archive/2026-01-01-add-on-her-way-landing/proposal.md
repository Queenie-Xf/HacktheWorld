# Change: Integrate On Her Way entry and mentor flow

## Why
The app currently opens directly on the Life Puzzle Map. We want users to first see the “On Her Way” branded entry screen, then proceed into the existing home experience with a single “开始探索” call-to-action.

## What Changes
- Use the existing landing flow under `on-her-way/` as the initial entry screen (reuse its UI and “开始探索” CTA).
- Make “开始探索” transition into the existing home screen (current main page).
- Make the home phone button use the existing On Her Way call flow under `on-her-way/` (voice call modal/logic).
- Merge the existing Insight Summary screen with the `on-her-way/` post-call follow-up flow (persona/insight/chat):
  - First completed call generates and confirms a persona.
  - After each call, show AI insight flow and allow continuing the mentor chat.
  - Recommended actions can be published as My Way puzzle pieces via the existing puzzle editor (prefilled).
- No functional changes to the existing My Way map and Her Way community views; the Insight Summary screen becomes the base of the merged post-call experience.

## Impact
- Affected specs: `app-navigation`, `mentor-flow`
- Affected code (expected): `App.tsx`, `types.ts`, `components/TopNav.tsx`, plus reused/extracted pieces from `on-her-way/`
- Dependencies/env: integrating On Her Way call flow requires `GEMINI_API_KEY` and `@google/genai`
- User-facing behavior: initial load changes from home → landing (**BREAKING** for existing expectations)

## Non-Goals
- Remembering a “skip landing” preference (e.g., localStorage)
- Introducing routing or a new navigation framework
- Integrating the full `on-her-way/` app views (plan/community/network/resources/profile) unless requested later
