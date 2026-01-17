## ADDED Requirements

### Requirement: Chat Action Navigation to Self-Insight
When the AI generates suggested actions during chat, the ChatView SHALL display a navigation prompt instead of action cards, directing users to the Self-Insight view.

#### Scenario: Actions available after chat
- **WHEN** the AI mentor response includes suggested actions
- **THEN** the ChatView displays "已帮你生成洞察和行动推荐" text
- **AND** a button to navigate to the Self-Insight view is shown
- **AND** the individual action cards are NOT displayed in the chat

#### Scenario: User navigates to insight view
- **WHEN** the user clicks the navigation button
- **THEN** the user is taken to the Self-Insight (自我洞察) view
- **AND** the user can see their personalized insights and recommended actions there
