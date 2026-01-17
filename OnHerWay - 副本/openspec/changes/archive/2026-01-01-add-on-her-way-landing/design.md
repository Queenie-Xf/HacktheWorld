## Context
This repo currently contains two separate Vite/React apps:
- The Life Puzzle Map app at the repo root (opens directly into the map experience).
- An `on-her-way/` app that includes the desired landing screen (`LandingView`) and the “On Her Way” voice call flow (`VoiceCallModal` + `services/audioUtils.ts`).

The change goal is to make the root app open on the On Her Way landing screen, transition into the existing Life Puzzle Map home when the user clicks “开始探索”, and make the home phone button trigger the existing On Her Way voice call experience. After the call ends, the app should merge the existing Life Puzzle Map “Insight Summary” with the original `on-her-way/` post-call flow (persona/insight/chat).

## Goals / Non-Goals
- Goals:
  - Reuse the existing `on-her-way` landing UI (as provided) for the initial entry screen.
  - Reuse the existing `on-her-way` voice call flow for the home phone button.
  - Merge the existing Life Puzzle Map Insight Summary screen with the `on-her-way/` post-call experience (persona modal, AI insight flow, and mentor chat).
  - Keep the existing Life Puzzle Map home behavior unchanged (map/community) except for the new entry step and the updated post-call experience.
- Non-Goals:
  - Converting the app to a router-based, multi-route architecture.
  - Integrating the full “on-her-way” multi-view app navigation (plan/community/network/resources/profile) unless requested later.

## Decisions
- Decision: Extract and reuse selected `on-her-way` components in the root app.
  - Rationale: importing across two separate Vite apps (with duplicate `node_modules` and overlapping component names) adds build/typing complexity. Extracting the needed pieces into the root app keeps a single build output and a single source-of-truth UI.
  - Scope: `LandingView`, `VoiceCallModal`, and the post-call components needed for persona/insight/chat (`PersonaModal`, `InsightFlow`, `ChatView`) plus their minimal dependencies (e.g., `audioUtils.ts`, `geminiService.ts`, `@google/genai`).

- Decision: Keep navigation state-driven (no router).
  - Rationale: the root app already uses `ViewMode` state to swap layered screens; landing can be introduced as an additional state with minimal disruption.

- Decision: Keep LandingView’s Three.js dependency as a global script (matching `on-her-way/index.html`) unless we later migrate to an npm import.
  - Rationale: the current LandingView expects `window.THREE`. Preserving this avoids rewriting the landing implementation.

- Decision: Use the existing Life Puzzle Map puzzle editor as the “action capture” surface for On Her Way recommendations.
  - Rationale: the map experience already contains a publish-oriented editor (`PuzzleEditorModal`). Reusing it creates a concrete bridge from “AI recommended first move” → “my puzzle piece” without adding a new data model first.
  - Mapping:
    - On Her Way insight type `Problem` → `PuzzleType.DIFFICULTY`
    - On Her Way insight type `Goal` → `PuzzleType.GOAL`
    - On Her Way insight type `Strength` → `PuzzleType.EXPERIENCE`
    - Default fallback → `PuzzleType.EXPERIENCE`

## Risks / Trade-offs
- Global Tailwind theme tokens: `LandingView` relies on Tailwind custom colors/classes defined in `on-her-way/index.html`. Merging those tokens into the root `index.html` could subtly affect existing styling if names overlap.
- Mic permission/runtime failures: the voice call flow requires `navigator.mediaDevices.getUserMedia` and a valid `GEMINI_API_KEY`. The UX must handle permission denial and service unavailability gracefully.
- Type/model duplication: the root app and `on-her-way` app have separate type systems (e.g., `PuzzleData` vs `ChatMessage`/`AnalysisResult`). Bridging them should be minimal and explicit.

## Migration Plan
1. Introduce a landing state in the root app and render the reused `LandingView` first.
2. Wire “开始探索” to transition into the existing home screen.
3. Replace the current phone overlay with the reused `VoiceCallModal`.
4. On call end, show the merged post-call experience:
   - First call: persona generation + confirmation modal.
   - Each call: AI insight flow overlay.
   - Base screen: Life Puzzle Map Insight Summary, with access to continue mentor chat.
5. Validate build and do manual QA for entry → home → phone call → persona/insight/chat → exit.

## Open Questions
- Should newly published puzzles persist across reloads (e.g., local state only vs localStorage/backend)?
