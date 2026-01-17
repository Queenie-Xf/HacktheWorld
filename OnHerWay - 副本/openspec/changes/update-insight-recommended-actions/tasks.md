## 1. Implementation

- [x] 1.1 Update `ChatView.tsx` to replace suggestedActions with navigation prompt
  - [x] 1.1.1 Remove ActionCard display for suggestedActions
  - [x] 1.1.2 Add "已帮你生成洞察和行动推荐" text prompt
  - [x] 1.1.3 Add button to navigate to Self-Insight view
  - [x] 1.1.4 Add `onNavigateToInsight` callback prop
- [x] 1.2 Modify `generateActionsForInsight` function in `geminiService.ts`
  - [x] 1.2.1 Add optional `chatHistory` parameter
  - [x] 1.2.2 Update prompt to include chat context when available
  - [x] 1.2.3 Keep existing return type `Promise<ActionItem[]>`
- [x] 1.3 Update `InsightSummaryView.tsx` to display AI-generated actions above community puzzles
  - [x] 1.3.1 Add state for generated actions and loading/error states
  - [x] 1.3.2 Call `generateActionsForInsight` when user selects an insight dimension
  - [x] 1.3.3 Display "推荐的第一步 (3选1)" section using same card style as ChatView suggestedActions
  - [x] 1.3.4 Reuse getDifficultyColor and ActionCard styling from ChatView
  - [x] 1.3.5 Keep existing PuzzlePiece components below as "社区推荐" section
  - [x] 1.3.6 Display loading indicator while actions are being generated
  - [x] 1.3.7 Handle error states gracefully

## 2. Verification

- [x] 2.1 Verify ChatView shows navigation prompt instead of action cards
- [x] 2.2 Verify navigation button takes user to Self-Insight view
- [x] 2.3 Verify actions are generated based on selected insight and chat history
- [x] 2.4 Verify 3 actions are generated with different difficulty levels
- [x] 2.5 Verify AI action cards use same styling as ChatView suggestedActions
- [x] 2.6 Verify AI actions appear above community puzzles
- [x] 2.7 Verify loading state displays correctly when switching insights
- [x] 2.8 Verify community puzzles still display correctly below AI actions
