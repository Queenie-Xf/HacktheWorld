# Change: Add Text Input to AI Call Interface

## Why
Currently, the VoiceCallModal only supports voice interaction via microphone. Users who cannot or prefer not to use a microphone (e.g., in public spaces, accessibility needs, or no microphone hardware) are unable to interact with the AI mentor. Adding a text input option provides an alternative interaction method.

## What Changes
- Add a text input field to the VoiceCallModal component
- Allow users to send messages by typing instead of (or in addition to) speaking
- Support both input modes simultaneously during an active session
- Text messages integrate with the existing transcription history

## Impact
- Affected specs: voice-call (new capability)
- Affected code: `onHerWay/components/VoiceCallModal.tsx`
- No breaking changes to existing voice functionality
