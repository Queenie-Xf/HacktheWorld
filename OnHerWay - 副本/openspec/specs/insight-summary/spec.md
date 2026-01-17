# insight-summary Specification

## Purpose
TBD - created by archiving change add-insight-ai-summary. Update Purpose after archive.
## Requirements
### Requirement: AI Insight Summarization
The system SHALL analyze chat history and generate personalized insight summaries in three categories using AI.

#### Scenario: Generate flag/goal insights
- **WHEN** the user opens the Self-Insight (自我洞察) view
- **AND** chat history is available
- **THEN** the system analyzes the chat history
- **AND** generates a first-person summary for "你可能想立的flag" category
- **AND** the summary reflects goals or intentions expressed in conversations

#### Scenario: Generate question insights
- **WHEN** the user opens the Self-Insight view
- **AND** chat history contains topics the user showed uncertainty about
- **THEN** the system generates a first-person summary for "你可能想提问" category
- **AND** the summary reflects questions or doubts the user might want to explore

#### Scenario: Generate experience insights
- **WHEN** the user opens the Self-Insight view
- **AND** chat history contains experiences or lessons learned
- **THEN** the system generates a first-person summary for "你可以分享的行动经验" category
- **AND** the summary reflects actionable experiences the user can share with others

### Requirement: First-Person Perspective
All AI-generated insight summaries SHALL be written in first-person perspective (using 我) to feel personal and relatable.

#### Scenario: First-person language in summaries
- **WHEN** the AI generates any insight summary
- **THEN** the text uses first-person pronouns (我想..., 我可以..., 我的...)
- **AND** the tone is personal and self-reflective

### Requirement: Loading and Error States
The InsightSummaryView SHALL handle loading and error states gracefully during AI summarization.

#### Scenario: Loading state during summarization
- **WHEN** the AI is processing chat history
- **THEN** a loading indicator is displayed in the insight cards
- **AND** the user understands content is being generated

#### Scenario: Error handling for API failures
- **WHEN** the AI summarization API fails
- **THEN** the system displays an appropriate error message
- **AND** falls back to placeholder content or retry option

### Requirement: AI-Generated Recommended Actions
The system SHALL generate personalized recommended actions based on the selected insight dimension and chat history.

#### Scenario: User selects an insight dimension
- **WHEN** the user clicks on an insight card (flag, question, or experience)
- **THEN** the system generates 3 recommended actions targeting that insight
- **AND** the actions are based on both the insight content and chat history
- **AND** a loading indicator is displayed while actions are being generated

#### Scenario: Three difficulty levels for actions
- **WHEN** recommended actions are generated
- **THEN** exactly 3 actions are returned
- **AND** one action is "Low Friction" (< 15 mins)
- **AND** one action is "Research" (~ 30 mins)
- **AND** one action is "Active" (~ 60 mins)

#### Scenario: Action generation uses insight context
- **WHEN** the user selects the "你可能想立的flag" insight
- **THEN** the generated actions help the user take first steps toward that goal
- **WHEN** the user selects the "你可能想提问" insight
- **THEN** the generated actions help the user explore or resolve that question
- **WHEN** the user selects the "你可以分享的行动经验" insight
- **THEN** the generated actions help the user share or build on that experience

#### Scenario: Error handling for action generation
- **WHEN** the action generation API fails
- **THEN** the system displays an appropriate error message
- **AND** the user can retry by clicking the insight again

### Requirement: Two-Layer Recommendation Display
The InsightSummaryView SHALL display AI-generated actions above community-recommended puzzles.

#### Scenario: Display order of recommendations
- **WHEN** the user selects an insight dimension
- **THEN** the "推荐的第一步 (3选1)" section is displayed first with AI-generated ActionItem cards
- **AND** the "社区推荐" section is displayed below with community PuzzlePiece components

#### Scenario: Community puzzles remain visible
- **WHEN** the recommendation area is displayed
- **THEN** the community puzzles from other users are shown below the AI actions
- **AND** the puzzles are relevant to the selected insight dimension

