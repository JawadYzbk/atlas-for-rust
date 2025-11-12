# Changelog

All notable changes to RustLink will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive testing infrastructure with Vitest and Cypress
- Unit tests for EntityControlService and DataStore modules
- E2E tests for critical user workflows
- ESLint and Prettier configuration for code quality
- Security documentation (SECURITY.md)
- Deployment guide (DEPLOYMENT_GUIDE.md)
- Contributing guidelines (CONTRIBUTING.md)
- Comprehensive code review report (COMPREHENSIVE_CODE_REVIEW.md)

### Security
- Identified critical security vulnerabilities requiring immediate attention
- Documented security roadmap and remediation plan
- Added security policy and vulnerability reporting guidelines

### Documentation
- Created comprehensive code review covering security, quality, and testing
- Added detailed deployment guide for all platforms
- Documented security best practices
- Created contribution guidelines

---

## [2.2.0] - 2024-XX-XX

### Added
- Map grid system with 150m grid squares and coordinate labels (A1, B2, etc.)
- Zoom-responsive grid visibility and sizing
- Dynamic label management for grid coordinates
- Enhanced vending machine search with real-time filtering
- Buy/Sell toggle for vending machine search
- Sorting by name, stock, and price
- Zero stock filter for vending machines
- Modern gradient UI for vending machine search
- New map markers:
  - Player marker (PNG and SVG)
  - Generic marker (SVG)
  - Hackable crates
  - Cargo ship
  - Chinook helicopter
  - Explosions
  - Patrol helicopter
  - Traveling vendors
- Team member markers with online/offline/dead states
- In-game time display with day/night indicator
- Server statistics (player count, wipe time)
- Team chat messaging
- Smart device control (switches, alarms, storage monitors)

### Changed
- Updated README with recent enhancements and features

### Fixed
- Various bug fixes and stability improvements

---

## [2.1.0] - Previous Release

### Added
- Smart alarm notifications
- Entity pairing system
- Device control modal
- FCM push notification integration
- Expo push token management

### Changed
- Improved notification handling
- Enhanced UI/UX for device management

---

## [2.0.0] - Initial Major Release

### Added
- Electron desktop application framework
- Vue.js frontend with TailwindCSS
- Rust+ protocol implementation with Protocol Buffers
- Interactive map with Leaflet
- Server connection management
- Multiple server support
- Authentication with Rust+ companion app
- Real-time updates via WebSocket
- Notification center
- Data persistence with Electron Store
- Rust item database (6,655 items)
- Item images (1,457 images)

### Features
- Connect to multiple Rust servers
- View server map with markers
- Track team members in real-time
- Receive push notifications
- Manage smart devices
- Search vending machines
- View server statistics

---

## Upcoming Changes

See [TODO.md](TODO.md) for planned improvements and roadmap.

---

## Security Notices

### Critical Security Issues (Identified November 2025)

The following critical security vulnerabilities were identified in version 2.2.0 and require immediate attention:

1. **Electron Context Isolation Disabled** - Allows XSS to RCE escalation
2. **Cross-Site Scripting (XSS)** - Multiple v-html vulnerabilities
3. **Certificate Validation Disabled** - MITM attack vulnerability
4. **Plaintext Credential Storage** - Tokens stored unencrypted

See [SECURITY.md](SECURITY.md) for detailed information and remediation plan.

### Dependency Vulnerabilities

- **111 known vulnerabilities** in dependencies as of November 2025
- Critical updates needed for Axios, Electron, and build tools
- See [COMPREHENSIVE_CODE_REVIEW.md](COMPREHENSIVE_CODE_REVIEW.md) for details

---

## Migration Guides

### Upgrading from 2.1.x to 2.2.x

No breaking changes. Drop-in replacement.

### Future Breaking Changes

The following breaking changes are planned for version 3.0.0:

1. **Electron Context Isolation** - Will remove `window.ipcRenderer` access
2. **Vue 3 Migration** - Requires updates to custom components
3. **Dependency Updates** - May require Node.js 18+

---

## Contributors

- Liam Cottle - Original author
- Jawad Yazbek - Maintainer
- Community contributors

Thank you to all contributors who help improve RustLink!

---

## Links

- [GitHub Repository](https://github.com/JawadYzbk/rustLink)
- [Issue Tracker](https://github.com/JawadYzbk/rustLink/issues)
- [Discussions](https://github.com/JawadYzbk/rustLink/discussions)

---

[Unreleased]: https://github.com/JawadYzbk/rustLink/compare/v2.2.0...HEAD
[2.2.0]: https://github.com/JawadYzbk/rustLink/releases/tag/v2.2.0
[2.1.0]: https://github.com/JawadYzbk/rustLink/releases/tag/v2.1.0
[2.0.0]: https://github.com/JawadYzbk/rustLink/releases/tag/v2.0.0
