# Change: Update Insight Recommended Actions Generation

## Why
当前【自我洞察】页面的【推荐给你的最小行动】部分需要两层内容：
1. **AI 生成的 3 个推荐行动** - 基于洞察维度 + 聊天记录动态生成（目前缺失）
2. **社区推荐拼图** - 显示与该洞察相关的社区帖子（目前使用静态 mock 数据）

同时，原来在 `ChatView.tsx` 聊天消息下方显示的【推荐的第一步 (3选1)】需要移除，替换为引导用户跳转到【自我洞察】页面的提示。

## What Changes
- **ChatView.tsx**：
  - 移除聊天消息下方的 `suggestedActions` 卡片展示
  - 替换为"已帮你生成洞察和行动推荐"提示文案 + 跳转到【自我洞察】界面的按钮

- **geminiService.ts**：
  - 修改现有的 `generateActionsForInsight` 函数，增加聊天记录参数
  - 基于洞察内容 + 聊天记录生成 3 个推荐行动

- **InsightSummaryView.tsx**：
  - 当用户点击某个洞察维度时，调用 `generateActionsForInsight` 生成针对该维度的 3 个推荐行动
  - **使用与 ChatView 中 `suggestedActions` 完全相同的输出格式和卡片样式**
  - 在【推荐给你的最小行动】区域，先显示 AI 生成的 3 个行动卡片，再显示社区推荐拼图
  - 添加加载状态和错误处理

## Impact
- Affected specs: insight-summary (MODIFIED), mentor-flow (MODIFIED)
- Affected code:
  - `onHerWay/components/ChatView.tsx` - 替换 suggestedActions 展示为跳转提示
  - `onHerWay/services/geminiService.ts` - 修改 `generateActionsForInsight` 函数签名
  - `components/InsightSummaryView.tsx` - 集成 AI 生成的推荐行动，复用 ChatView 的卡片样式
