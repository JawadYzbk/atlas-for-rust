# RustLink - Implementation Roadmap & TODO List

This document outlines the recommended next steps for improving RustLink based on the comprehensive code review conducted in November 2025.

---

## Critical Priority (Weeks 1-2) 🔴

### Security Fixes - IMMEDIATE ACTION REQUIRED

- [ ] **Enable Electron Context Isolation**
  - File: `src/background.js` (lines 38-40, 69-71)
  - Change: `contextIsolation: true`, `enableRemoteModule: false`
  - Impact: Prevents XSS → RCE escalation
  - Effort: 2-4 hours

- [ ] **Refactor Preload Script with contextBridge**
  - File: `src/preload.js`
  - Remove: `window.ipcRenderer = electron.ipcRenderer`
  - Add: Use `contextBridge.exposeInMainWorld()`
  - Impact: Secure IPC communication
  - Effort: 4-6 hours

- [ ] **Fix XSS Vulnerabilities**
  - Files:
    - `src/components/modals/PairServerModal.vue` (line 69)
    - `src/components/modals/ItemModal.vue` (line 27)
    - `src/components/modals/EntityPairingModal.vue` (line 97)
  - Change: Replace `v-html` with text interpolation or DOMPurify
  - Impact: Prevents script injection attacks
  - Effort: 2-3 hours

- [ ] **Remove Certificate Validation Bypass**
  - File: `src/js/ipc/main/ExpoPushTokenManager.js` (line 57)
  - Remove: `rejectUnauthorized: false`
  - Impact: Prevents MITM attacks
  - Effort: 1 hour

- [ ] **Implement Credential Encryption**
  - Files: All DataStore modules
  - Add: Use Electron `safeStorage` API
  - Impact: Protects stored credentials
  - Effort: 6-8 hours

- [ ] **Update Critical Dependencies**
  ```bash
  npm install axios@latest         # 0.21.1 → 1.13.2
  npm install --save-dev electron@latest  # 11.0.0 → 28+
  npm audit fix --force
  ```
  - Impact: Fixes 111 known vulnerabilities
  - Effort: 4-6 hours (including testing)

---

## High Priority (Weeks 3-4) ⚠️

### Testing Infrastructure

- [ ] **Install Testing Dependencies**
  ```bash
  npm install --save-dev vitest @vitest/ui @vue/test-utils jsdom
  npm install --save-dev cypress @testing-library/vue
  npm install --save-dev eslint prettier eslint-plugin-vue
  npm install --save-dev @vue/eslint-config-prettier
  ```
  - Effort: 1 hour

- [ ] **Write Unit Tests**
  - [x] `tests/unit/EntityControlService.test.js` - CREATED
  - [x] `tests/unit/DataStores.test.js` - CREATED
  - [ ] `tests/unit/IPC/ExpoPushTokenManager.test.js`
  - [ ] `tests/unit/IPC/FCMNotificationManager.test.js`
  - [ ] `tests/unit/IPC/RustCompanionManager.test.js`
  - **Target:** 70%+ code coverage
  - Effort: 16-20 hours

- [ ] **Write Component Tests**
  - [ ] `tests/component/DeviceControlModal.test.js`
  - [ ] `tests/component/NotificationCenter.test.js`
  - [ ] `tests/component/VendingMachineSearch.test.js`
  - Effort: 12-16 hours

- [ ] **Write E2E Tests**
  - [x] `tests/e2e/app.cy.js` - CREATED (basic)
  - [ ] `tests/e2e/server-connection.cy.js`
  - [ ] `tests/e2e/device-control.cy.js`
  - [ ] `tests/e2e/notification-handling.cy.js`
  - Effort: 12-16 hours

- [ ] **Set Up CI Test Runs**
  - Update `.github/workflows/build.yml`
  - Add test steps before build
  - Add coverage reporting
  - Effort: 2-3 hours

### Code Quality Improvements

- [ ] **Implement Proper Logging Service**
  - Create: `src/js/services/LoggingService.js`
  - Replace: 167 console.log statements
  - Add: Log levels (DEBUG, INFO, WARN, ERROR)
  - Add: File logging for production
  - Effort: 8-10 hours

- [ ] **Replace `var` with `const`/`let`**
  - Files: All 54 occurrences
  - Tool: Can use automated refactoring
  - Effort: 2-3 hours

- [ ] **Extract Magic Numbers to Constants**
  - Create: `src/constants/NotificationChannels.js`
  - Create: `src/constants/Config.js`
  - Update: All files using magic numbers
  - Effort: 4-6 hours

- [ ] **Add IPC Input Validation**
  - Files: All IPC manager files
  - Add: Schema validation for all IPC handlers
  - Effort: 6-8 hours

---

## Medium Priority (Weeks 5-8) ✅

### Component Refactoring

- [ ] **Refactor RustPlus.vue (1,817 lines)**
  - Extract: `MapView.vue`
  - Extract: `MapMarkers.vue`
  - Extract: `TeamChat.vue`
  - Extract: `EventDock.vue`
  - Extract: `MapControls.vue`
  - Target: All components <300 lines
  - Effort: 16-20 hours

- [ ] **Refactor App.vue (1,635 lines)**
  - Extract: `GlobalNotificationCenter.vue`
  - Extract: `StatusBar.vue`
  - Extract: Notification modal
  - Target: <500 lines
  - Effort: 12-16 hours

- [ ] **Extract Duplicate Code**
  - Create: `src/utils/NotificationHelpers.js`
  - Create: `src/utils/EntityHelpers.js`
  - Remove: Duplicated logic from components
  - Effort: 6-8 hours

### Dependency Updates

- [ ] **Update Remaining Dependencies**
  ```bash
  npm install electron-store@latest      # 7.0.3 → 11.0.2
  npm install protobufjs@latest          # 6.11.4 → 7.5.4
  npm install uuid@latest                # 8.3.2 → 13.0.0
  npm install postcss@latest autoprefixer@latest
  ```
  - Test: All functionality after updates
  - Effort: 6-8 hours

### Additional Security Hardening

- [ ] **Implement Content Security Policy**
  - Add: CSP meta tags in `public/index.html`
  - Add: CSP headers in `src/background.js`
  - Effort: 3-4 hours

- [ ] **Add URL Validation**
  - File: `src/background.js` (line 79)
  - Add: Protocol and domain whitelist
  - Effort: 2-3 hours

- [ ] **Implement JSON Schema Validation**
  - Add: `ajv` dependency
  - Add: Schema validation for all parsed JSON
  - Effort: 4-6 hours

- [ ] **Disable DevTools in Production**
  - File: `src/background.js`
  - Add: Explicit DevTools disable based on NODE_ENV
  - Effort: 1 hour

---

## Low Priority (Weeks 9-12) 📅

### Documentation

- [x] **Create SECURITY.md** - COMPLETED
- [x] **Create DEPLOYMENT_GUIDE.md** - COMPLETED
- [x] **Create CONTRIBUTING.md** - COMPLETED
- [x] **Create CHANGELOG.md** - COMPLETED
- [ ] **Add JSDoc Comments**
  - All service files
  - All IPC managers
  - All DataStore modules
  - Effort: 8-10 hours

- [ ] **Create Architecture Diagrams**
  - IPC communication flow
  - Component hierarchy
  - Data flow diagrams
  - Effort: 4-6 hours

### Code Modernization

- [ ] **Modernize JavaScript**
  - Add: More destructuring
  - Add: Optional chaining (`?.`)
  - Add: Nullish coalescing (`??`)
  - Convert: Function declarations to arrow functions
  - Effort: 6-8 hours

- [ ] **Improve Error Handling**
  - Add: User feedback for validation failures
  - Create: Error boundary components
  - Implement: Global error handler
  - Effort: 6-8 hours

- [ ] **Extract Reusable Components**
  - Create: `Icon.vue` for SVG icons
  - Extract: Repeated UI patterns
  - Effort: 4-6 hours

---

## Future Considerations (3+ months) 🔮

### Major Upgrades

- [ ] **Vue 2 → Vue 3 Migration**
  - Major breaking changes
  - Requires full application testing
  - Effort: 40-60 hours
  - Benefits: Better performance, Composition API, TypeScript support

- [ ] **TypeScript Migration**
  - Gradual migration recommended
  - Start with new files
  - Effort: 60-80 hours
  - Benefits: Type safety, better IDE support, fewer bugs

- [ ] **Multi-platform CI Builds**
  - Add: macOS and Linux build jobs
  - Effort: 4-6 hours

- [ ] **Auto-Updater Implementation**
  - Configure: electron-updater
  - Set up: Update server
  - Effort: 8-12 hours

### Nice to Have

- [ ] **Storybook for Components**
  - Isolated component development
  - Visual testing
  - Effort: 12-16 hours

- [ ] **Visual Regression Testing**
  - Percy or Chromatic integration
  - Effort: 6-8 hours

- [ ] **Telemetry/Analytics** (Optional)
  - Privacy-respecting analytics
  - Usage tracking
  - Effort: 8-12 hours

---

## Metrics Goals

### Code Quality Targets

| Metric | Current | Target | Priority |
|--------|---------|--------|----------|
| Test Coverage | 0% | 70%+ | High |
| Largest File | 1,817 lines | <300 lines | Medium |
| Console.log | 167 | 0 | High |
| var declarations | 54 | 0 | Medium |
| Cyclomatic Complexity | 15 | <10 | Medium |
| npm audit critical | 7 | 0 | Critical |
| npm audit high | 31 | 0 | Critical |

### Security Goals

- [ ] All critical vulnerabilities fixed
- [ ] All high vulnerabilities fixed
- [ ] Context isolation enabled
- [ ] Credentials encrypted
- [ ] Certificate validation enabled
- [ ] XSS vulnerabilities fixed
- [ ] CSP implemented
- [ ] IPC input validated

---

## Estimated Total Effort

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Critical Security | 2 weeks | 40-50 hours |
| Phase 2: Testing & Quality | 2 weeks | 50-60 hours |
| Phase 3: Refactoring | 4 weeks | 60-70 hours |
| Phase 4: Documentation | 2 weeks | 20-30 hours |
| **Total** | **10-12 weeks** | **170-210 hours** |

---

## Progress Tracking

Use GitHub Projects or Issues to track progress:

```bash
# Create issues for each task
# Label with priority (critical, high, medium, low)
# Assign to milestones (Phase 1, Phase 2, etc.)
# Track progress in project board
```

---

## Notes

- **Security fixes should be prioritized above all else**
- Test thoroughly after each change
- Consider creating separate branches for major refactoring
- Get code review for security-critical changes
- Update documentation as you go
- Don't skip testing - it will save time long-term

---

**Last Updated:** November 12, 2025
**Review Date:** After Phase 1 completion
