# Horizontal Menu Navigation

## ADDED Requirements

### Requirement: The system SHALL display a Horizontal Menu Bar Component

The On Her Way section (ViewMode.INSIGHT_SUMMARY) SHALL display a horizontal menu bar below the TopNav, containing quick-access buttons for the three primary workflows: AI Chat, Action Plan, and Skill Resources.

#### Scenario: Menu bar is visible in On Her Way section

**Given** the app is in ViewMode.INSIGHT_SUMMARY
**When** the page loads
**Then** a horizontal menu bar appears below TopNav
**And** the menu bar contains three buttons: "AI聊天", "行动清单", "能力星图"
**And** the menu bar uses glass panel styling consistent with Layout navigation

#### Scenario: Menu bar is not visible in other view modes

**Given** the app is in ViewMode.MY_MAP or ViewMode.COMMUNITY
**When** the page loads
**Then** the horizontal menu bar does not appear

### Requirement: Menu Bar buttons SHALL enable navigation between views

Users SHALL be able to navigate between AI Chat, Action Plan, and Skill Resources views by clicking the corresponding menu bar button.

#### Scenario: User clicks AI Chat button

**Given** the horizontal menu bar is visible
**When** the user clicks the "AI聊天" button
**Then** the active view changes to 'chat'
**And** the ChatView is displayed
**And** the "AI聊天" button shows active state (yellow glow)

#### Scenario: User clicks Action Plan button

**Given** the horizontal menu bar is visible
**When** the user clicks the "行动清单" button
**Then** the active view changes to 'plan'
**And** the PlanView is displayed
**And** the "行动清单" button shows active state (yellow glow)

#### Scenario: User clicks Skill Resources button

**Given** the horizontal menu bar is visible
**When** the user clicks the "能力星图" button
**Then** the active view changes to 'resources'
**And** the ResourceView is displayed
**And** the "能力星图" button shows active state (yellow glow)

### Requirement: The system SHALL provide Active State Visual Feedback

The currently active menu item SHALL be visually distinguished from inactive items.

#### Scenario: Active menu button styling

**Given** the user is viewing AI Chat (activeView === 'chat')
**When** the horizontal menu bar renders
**Then** the "AI聊天" button displays a yellow glow border
**And** the button icon is colored yellow
**And** the button has a subtle background highlight
**And** other buttons remain in inactive state (gray)

### Requirement: The Action Plan button SHALL display a Pending Actions Badge

The Action Plan button SHALL display a badge indicating the count of pending actions.

#### Scenario: Badge shows pending count

**Given** there are 3 pending actions
**When** the horizontal menu bar renders
**Then** the "行动清单" button displays a badge with "3"
**And** the badge uses brand-orange background
**And** the badge is positioned at top-right of button

#### Scenario: Badge hidden when no pending actions

**Given** there are 0 pending actions
**When** the horizontal menu bar renders
**Then** the "行动清单" button does not display a badge

### Requirement: The menu bar SHALL adapt to Responsive Layout

The horizontal menu bar SHALL adapt to mobile and desktop screen sizes.

#### Scenario: Desktop layout

**Given** the viewport width is ≥768px (md breakpoint)
**When** the horizontal menu bar renders
**Then** buttons are displayed in a horizontal row
**And** buttons show both icon and full label text
**And** the menu bar is positioned below TopNav and above the content area

#### Scenario: Mobile layout

**Given** the viewport width is <768px
**When** the horizontal menu bar renders
**Then** buttons are displayed in a horizontal row (compact)
**And** buttons show icon and abbreviated label
**And** the menu bar is positioned below TopNav
**And** the menu bar does not overlap with bottom navigation

## MODIFIED Requirements

### Requirement: ChatView SHALL control Chat Input Box Visibility (modifies mentor-flow)

The ChatView SHALL not display the message input box by default; users must navigate to the chat view via the "AI聊天" button to see the input.

#### Scenario: Chat input visible when in chat view

**Given** the user clicks "AI聊天" button
**When** the ChatView loads
**Then** the message input box is visible
**And** the user can type and send messages

#### Scenario: Chat input hidden when not in chat view

**Given** the activeView is 'insight' or 'plan' or 'resources'
**When** the user views the content
**Then** no chat input box is visible

### Requirement: The horizontal menu bar SHALL coexist with existing Navigation

The horizontal menu bar SHALL coexist with the existing vertical sidebar and bottom navigation, which continue to provide access to other views (自我洞察, 社区动态, 建联交流, 我的档案).

#### Scenario: Vertical nav remains functional

**Given** the horizontal menu bar is visible
**When** the user clicks a vertical sidebar item (e.g., "自我洞察")
**Then** the corresponding view loads
**And** both navigation systems remain visible
**And** the horizontal menu bar reflects the active state if applicable

#### Scenario: Bottom nav remains functional on mobile

**Given** the horizontal menu bar is visible on mobile
**When** the user clicks a bottom nav item (e.g., "社区动态")
**Then** the corresponding view loads
**And** both navigation systems remain visible
