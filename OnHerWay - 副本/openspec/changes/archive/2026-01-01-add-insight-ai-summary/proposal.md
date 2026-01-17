# Change: Add AI-powered Insight Summarization

## Why
The 【自我洞察】(Self-Insight) section currently displays static/mock content. Users would benefit from AI-generated summaries based on their actual chat history with the mentor, making the insights personalized and meaningful. The AI should analyze conversations and categorize insights into three types: goals/flags to set, questions to ask, and action experiences to share.

## What Changes
- Add AI summarization service to analyze chat history and extract insights
- Generate summaries for three categories based on conversation context:
  - 【你可能想立的flag】- Goals/flags the user might want to set
  - 【你可能想提问】- Questions the user might want to ask
  - 【你可以分享的行动经验】- Action experiences the user can share
- All summaries should be in first-person perspective (我想..., 我可以...)
- Integrate the summarization into InsightSummaryView to replace static mock data
- Use the existing Gemini API service for AI summarization

## Impact
- Affected specs: insight-summary (new capability)
- Affected code:
  - `services/geminiService.ts` - Add new summarization function
  - `components/InsightSummaryView.tsx` - Integrate AI-generated insights
  - `types.ts` - Add types for insight summaries if needed
