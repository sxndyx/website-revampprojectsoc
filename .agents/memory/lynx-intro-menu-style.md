---
name: Lynx intro & navigation
description: Current intro/nav model for Lynx Racing (the old gothic title-screen menu is gone) + screenshot bypass.
---

- The old gothic bottom-left **title-screen menu was REMOVED** in the premium redesign. Do not bring back the Grenze Gotisch title screen or boxed neon menu items.
- Intro is now a brief HUD "boot" flash overlay (`HudIntro`) that reveals the app; navigation is a fixed `TopBar` plus a full-screen `MenuOverlay` (MENU button) with text-only links that go acid-green on hover.
- **Screenshot / deep-link tip:** append `?nointro=1` to any URL to skip the boot animation. Needed for shared/deep links and headless automated screenshots — otherwise you just capture the intro.
