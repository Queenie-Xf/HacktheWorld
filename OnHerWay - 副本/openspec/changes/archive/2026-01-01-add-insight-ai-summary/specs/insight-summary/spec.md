## ADDED Requirements

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
