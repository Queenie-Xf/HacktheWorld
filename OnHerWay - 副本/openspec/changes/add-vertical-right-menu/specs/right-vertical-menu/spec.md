# Right Vertical Menu Navigation

**Capability**: Users can access AI call and quick actions via a vertical menu bar on the right side of the MY WAY map view.

**Scope**: app-navigation

## ADDED Requirements

### Requirement: The system SHALL render a vertical right-side menu bar in MY WAY view
The system SHALL render a vertical menu bar on the right edge of the screen when ViewMode is MY_MAP, styled consistently with the left-side Layout navigation component.

#### Scenario: User views MY WAY map and sees right vertical menu
**Given** the user is viewing ViewMode.MY_MAP
**When** the map view renders
**Then** a vertical menu bar appears on the right edge of the screen
**And** the menu bar contains circular glassmorphic buttons
**And** the menu bar matches the visual style of Layout's left sidebar navigation (glassmorphic background, circular buttons, glow effects)

#### Scenario: User initiates AI call from right menu
**Given** the user is viewing the MY WAY map
**And** the right vertical menu is visible
**When** the user clicks the AI call button (phone icon) in the right menu
**Then** the VoiceCallModal opens
**And** the call flow proceeds as before (voice/text selection, active call UI)

#### Scenario: Right menu does not appear in other views
**Given** the user switches to ViewMode.COMMUNITY or ViewMode.INSIGHT_SUMMARY
**When** the view renders
**Then** the right vertical menu is not visible
**And** navigation uses the existing patterns for those views

### Requirement: TopNav SHALL simplify when right menu is active
The system SHALL remove the "聊聊..." input and AI call button from TopNav when ViewMode is MY_MAP, since these controls move to the right vertical menu.

#### Scenario: TopNav shows only view switcher in MY WAY
**Given** the user is viewing ViewMode.MY_MAP
**When** TopNav renders
**Then** the view switcher ("My Way 拼图" / "Her Way 社区") is visible
**And** the "聊聊..." input box is not rendered
**And** the orange AI call button is not rendered in TopNav
**And** the right vertical menu contains the AI call button instead

#### Scenario: TopNav retains full controls in other views
**Given** the user is viewing ViewMode.COMMUNITY
**When** TopNav renders
**Then** the "聊聊..." input and AI call button remain visible in TopNav
**And** the right vertical menu does not appear

### Requirement: Right menu buttons SHALL match Layout navigation style
The system SHALL style right menu buttons identically to Layout.tsx's left sidebar navigation buttons (lines 193-224): circular, glassmorphic background, hover scale effects, active state glow, and icon-based content.

#### Scenario: User hovers over right menu button
**Given** the right vertical menu is visible
**When** the user hovers over the AI call button
**Then** the button scales up (scale-105 transform)
**And** the background transitions to white/5 opacity
**And** the icon color transitions to white

#### Scenario: Active button shows glow effect
**Given** the user has clicked a button in the right menu
**When** that button's action is active (e.g., call in progress)
**Then** the button displays a yellow glow effect (brand-yellow/10 background)
**And** an animated spinning border appears around the button
**And** a small yellow dot appears at the top of the border (matching Layout line 200)

## MODIFIED Requirements

None. This is purely additive functionality in MY WAY view; existing navigation in other views remains unchanged.

## REMOVED Requirements

None. Existing navigation patterns are preserved in COMMUNITY and INSIGHT_SUMMARY views.
