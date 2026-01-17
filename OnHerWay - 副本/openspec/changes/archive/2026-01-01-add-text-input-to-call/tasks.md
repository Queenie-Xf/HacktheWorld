## 1. Implementation

- [x] 1.1 Add text input state and ref to VoiceCallModal component
- [x] 1.2 Create text input UI element with send button in the bottom action area
- [x] 1.3 Implement `sendTextMessage` function that uses `session.sendClientContent()` API
- [x] 1.4 Add text input to transcription history when sent
- [x] 1.5 Style the text input to match existing UI design (dark theme, brand colors)
- [x] 1.6 Handle keyboard submit (Enter key) for sending messages

## 2. Verification

- [x] 2.1 Test text input works during active voice session
- [x] 2.2 Test text input works when microphone is not connected
- [x] 2.3 Verify transcription history includes both voice and text messages
- [x] 2.4 Manual QA via `npm run dev`
