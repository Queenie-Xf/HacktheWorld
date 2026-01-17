## ADDED Requirements

### Requirement: Text Input Alternative
The VoiceCallModal SHALL provide a text input field that allows users to send messages to the AI mentor without using a microphone.

#### Scenario: User sends text message during active session
- **WHEN** user types a message in the text input field
- **AND** user presses Enter or clicks the send button
- **THEN** the message is sent to the AI mentor via the Live API
- **AND** the message is added to the transcription history with "User:" prefix
- **AND** the text input field is cleared

#### Scenario: Text input available during listening state
- **WHEN** the session is active and status is "listening"
- **THEN** the text input field is visible and enabled
- **AND** user can type and send messages

#### Scenario: Text input available during speaking state
- **WHEN** the AI mentor is speaking (status is "speaking")
- **THEN** the text input field remains visible and enabled
- **AND** user can still type and queue messages

### Requirement: Text Input UI Design
The text input SHALL match the existing VoiceCallModal visual design.

#### Scenario: Text input styling
- **WHEN** the text input is rendered
- **THEN** it uses dark theme colors consistent with space-950/900 palette
- **AND** it has brand color accents (yellow/blue) for focus states
- **AND** it includes a visible send button with appropriate icon
