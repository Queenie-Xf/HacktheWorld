## ADDED Requirements

### Requirement: On Her Way Landing Is Default Entry
The application SHALL display a full-screen “On Her Way” landing screen on initial load, before showing the existing home screen.

#### Scenario: User opens the app
- **WHEN** the user visits the app root URL
- **THEN** the landing screen is displayed
- **AND** the existing home screen is not shown

#### Scenario: User starts exploring
- **GIVEN** the landing screen is displayed
- **WHEN** the user clicks “开始探索”
- **THEN** the application shows the existing home screen (current main page)
- **AND** the landing screen is not shown

### Requirement: Phone Button Starts On Her Way Voice Call Flow From Home
From the existing home screen, the application SHALL provide a phone button that starts the existing “On Her Way” voice call flow.

#### Scenario: User starts a call from home
- **GIVEN** the existing home screen is displayed
- **WHEN** the user clicks the phone button
- **THEN** the On Her Way voice call experience is displayed

#### Scenario: User ends a call
- **GIVEN** the On Her Way voice call experience is displayed
- **WHEN** the user ends or closes the call
- **THEN** the merged post-call experience is displayed
- **AND** the Insight Summary screen is visible as the base screen

#### Scenario: Microphone permission is denied
- **GIVEN** the user starts the On Her Way voice call flow
- **WHEN** the user denies microphone permission
- **THEN** the application displays an error state
- **AND** the user can exit the call flow and return to the previous screen
