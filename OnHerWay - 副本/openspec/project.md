# Project Context

## Purpose
Life Puzzle Map & Her Way Community is a single-page, interactive visualization of personal growth. It presents life experiences as puzzle pieces on a draggable/zoomable map and offers a community exploration view plus insight summaries.

## Tech Stack
- React 19 + React DOM 19
- TypeScript
- Vite (module-based build/dev server)
- Tailwind CSS via CDN (utility classes in JSX)
- Google Fonts (Inter, Noto Serif SC)
- Node.js/npm for local dev and build

## Project Conventions

### Code Style
- Functional React components with explicit prop interfaces
- Named exports for components; default export for `App`
- Enums/interfaces in `types.ts`, static mock data in `constants.ts`
- Utility-first classes in `className`; inline `style` for transforms/animations
- Inline `<style>` blocks for component-scoped keyframes when needed

### Architecture Patterns
- Single-page app; view switching is controlled by `ViewMode` state in `App.tsx`
- Layered UI panels with absolute/fixed positioning and CSS transitions
- Interaction logic (drag/zoom) handled in component state; no external state store
- Mock data stored locally; no API or persistence yet
- Components live in `components/`, shared types/constants at project root

### Testing Strategy
- No automated tests yet; manual QA via `npm run dev`
- Add tests if/when behavior becomes more complex or data-driven

### Git Workflow
- Not documented yet; align on branch/PR conventions with the team

## Domain Context
- Each puzzle represents a life experience, difficulty, or goal with distinct colors
- Users can explore their own map, browse community puzzles, and view insight summaries
- UI copy mixes English and Chinese, so keep a bilingual tone when editing text

## Important Constraints
- Full-screen immersive UI; avoid introducing page scroll in the body
- Performance matters for drag/zoom interactions on the map
- Tailwind is loaded via CDN; do not assume a build-time Tailwind pipeline

## External Dependencies
- Tailwind CSS CDN (`https://cdn.tailwindcss.com`)
- Google Fonts (Inter, Noto Serif SC)
- Avatar/placeholder images from `https://i.pravatar.cc` and `https://picsum.photos`
- Optional env var `GEMINI_API_KEY` injected in `vite.config.ts` (currently unused in code)
