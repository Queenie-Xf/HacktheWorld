# mentor-flow Specification

## Purpose
TBD - created by archiving change add-on-her-way-landing. Update Purpose after archive.
## Requirements
### Requirement: Persona Confirmation After First Voice Call
After the user completes their first On Her Way voice call, the system SHALL generate a persona and prompt the user to confirm it before entering the post-call experience.

#### Scenario: First call completes
- **GIVEN** this is the user’s first On Her Way voice call
- **WHEN** the user ends the call
- **THEN** a persona confirmation modal is displayed

#### Scenario: User confirms persona
- **GIVEN** a persona confirmation modal is displayed
- **WHEN** the user confirms the persona
- **THEN** the persona is stored for the current session
- **AND** the user proceeds to the merged post-call experience

### Requirement: Post-Call Insight Flow After Non-First Calls
After the user completes an On Her Way voice call (excluding the first-call persona flow), the system SHALL display an AI insight flow summarizing patterns and presenting insights.

#### Scenario: Subsequent call completes
- **GIVEN** this is not the user’s first On Her Way voice call
- **WHEN** the user ends the call
- **THEN** an insight flow overlay is displayed

#### Scenario: User closes insight flow
- **GIVEN** an insight flow overlay is displayed
- **WHEN** the user closes the overlay
- **THEN** the user returns to the merged post-call experience

### Requirement: Mentor Chat Is Available In The Merged Post-Call Experience
The merged post-call experience SHALL provide access to the On Her Way mentor chat so the user can continue the conversation after a call.

#### Scenario: User opens mentor chat
- **GIVEN** the merged post-call experience is displayed
- **WHEN** the user opens mentor chat
- **THEN** a chat interface is displayed

#### Scenario: Chat uses call context
- **GIVEN** the user has completed an On Her Way voice call
- **WHEN** the user opens mentor chat
- **THEN** the chat history includes the voice call transcript (or a summary derived from it) to preserve continuity

### Requirement: Publish Recommended Actions As Life Puzzle Pieces
The system SHALL allow the user to publish a recommended action from the post-call insight flow as a Life Puzzle piece using the existing puzzle editor.

#### Scenario: User converts an action into a puzzle draft
- **GIVEN** the post-call insight flow is displayed with recommended actions
- **WHEN** the user selects a recommended action to publish as a puzzle
- **THEN** the puzzle editor is displayed
- **AND** the editor is prefilled with the action title and description

#### Scenario: Puzzle type is derived from insight type
- **GIVEN** the user starts publishing a recommended action from an insight of type `Problem`
- **WHEN** the puzzle editor opens
- **THEN** the puzzle draft type is `DIFFICULTY`

#### Scenario: Goal insight maps to GOAL puzzle
- **GIVEN** the user starts publishing a recommended action from an insight of type `Goal`
- **WHEN** the puzzle editor opens
- **THEN** the puzzle draft type is `GOAL`

#### Scenario: Strength insight maps to EXPERIENCE puzzle
- **GIVEN** the user starts publishing a recommended action from an insight of type `Strength`
- **WHEN** the puzzle editor opens
- **THEN** the puzzle draft type is `EXPERIENCE`

#### Scenario: Unknown insight type falls back to EXPERIENCE
- **GIVEN** the user starts publishing a recommended action from an insight with an unknown type
- **WHEN** the puzzle editor opens
- **THEN** the puzzle draft type is `EXPERIENCE`

#### Scenario: User publishes the puzzle
- **GIVEN** the puzzle editor is displayed with a prefilled draft
- **WHEN** the user publishes the puzzle
- **THEN** the new puzzle is added to My Way for the current session
- **AND** the user returns to the merged post-call experience

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

