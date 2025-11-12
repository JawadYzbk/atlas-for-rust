# Contributing to RustLink

Thank you for considering contributing to RustLink! This document provides guidelines and instructions for contributing.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Process](#development-process)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Submitting Changes](#submitting-changes)
7. [Reporting Bugs](#reporting-bugs)
8. [Requesting Features](#requesting-features)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Expected Behavior

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js v16.x or v18.x (LTS)
- npm v8.x or higher
- Git
- Basic knowledge of Vue.js, Electron, and JavaScript

### Setup Development Environment

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/rustLink.git
   cd rustLink
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/JawadYzbk/rustLink.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run development server:
   ```bash
   npm run electron:serve
   ```

---

## Development Process

### Branching Strategy

- `master` - Stable production code
- `develop` - Active development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Creating a Feature Branch

```bash
git checkout develop
git pull upstream develop
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
git fetch upstream
git rebase upstream/develop
```

---

## Coding Standards

### JavaScript Style Guide

We use ESLint and Prettier for code consistency. Configuration is in `.eslintrc.js` and `.prettierrc.js`.

#### Key Rules

- **No `var`** - Use `const` or `let`
- **Prefer const** - Use `const` by default, `let` only when reassigning
- **Arrow functions** - Prefer arrow functions for callbacks
- **Template literals** - Use backticks for string interpolation
- **Async/await** - Prefer async/await over raw promises
- **Destructuring** - Use object/array destructuring where appropriate

#### Good Examples

```javascript
// Good: Use const, arrow functions, template literals
const getUserData = async userId => {
  const response = await fetch(`/api/users/${userId}`);
  const { name, email } = await response.json();
  return { name, email };
};

// Bad: Uses var, function declaration, string concatenation
var getUserData = function(userId) {
  return fetch('/api/users/' + userId).then(function(response) {
    return response.json().then(function(data) {
      return { name: data.name, email: data.email };
    });
  });
};
```

### Vue.js Conventions

#### Component Structure

```vue
<template>
  <!-- Template content -->
</template>

<script>
export default {
  name: 'ComponentName',
  components: {},
  props: {},
  data() {},
  computed: {},
  watch: {},
  methods: {},
  mounted() {},
};
</script>

<style scoped>
/* Component-specific styles */
</style>
```

#### Prop Validation

Always validate props:

```javascript
props: {
  server: {
    type: Object,
    required: true,
    validator(value) {
      return value.id && value.ip && value.port;
    }
  },
  isActive: {
    type: Boolean,
    default: false
  }
}
```

#### Event Naming

Use kebab-case for custom events:

```javascript
// Good
this.$emit('update-server', serverData);

// Bad
this.$emit('updateServer', serverData);
```

### File Naming

- **Components:** PascalCase (e.g., `DeviceControlModal.vue`)
- **Services:** PascalCase (e.g., `EntityControlService.js`)
- **Utilities:** camelCase (e.g., `formatHelpers.js`)
- **Tests:** Match source file with `.test.js` suffix (e.g., `EntityControlService.test.js`)

### Comments

- Write self-documenting code - prefer clear naming over comments
- Add comments for complex logic
- Use JSDoc for functions and classes

```javascript
/**
 * Toggles an entity's state
 * @param {number} entityId - The entity ID to toggle
 * @returns {Promise<boolean>} The new entity state
 * @throws {Error} If entity not found or toggle fails
 */
async toggleEntity(entityId) {
  // Implementation
}
```

---

## Testing Guidelines

### Test Coverage Requirements

- **Minimum:** 70% code coverage
- **Goal:** 80%+ code coverage
- **Critical code:** 100% coverage (authentication, security, data stores)

### Writing Unit Tests

Use Vitest for unit tests:

```javascript
import { describe, it, expect, beforeEach } from 'vitest';
import EntityControlService from '@/js/services/EntityControlService';

describe('EntityControlService', () => {
  let service;

  beforeEach(() => {
    service = new EntityControlService(mockProtospec, mockClient);
  });

  it('should toggle entity from true to false', async () => {
    service.getEntityInfo = vi.fn().mockResolvedValue({
      payload: { value: true }
    });

    const newValue = await service.toggleEntity(123456);

    expect(newValue).toBe(false);
  });
});
```

### Writing E2E Tests

Use Cypress for E2E tests:

```javascript
describe('Server Connection', () => {
  it('should connect to server successfully', () => {
    cy.visit('/');
    cy.get('[data-testid="server-connect-btn"]').click();
    cy.contains('Connected').should('be.visible');
  });
});
```

### Running Tests

```bash
# Unit tests
npm run test:unit

# E2E tests
npm run test:e2e

# All tests
npm run test

# Coverage report
npm run test:unit -- --coverage
```

### Test Best Practices

- **Test behavior, not implementation**
- **One assertion per test** (when possible)
- **Use descriptive test names** - `it('should do X when Y happens')`
- **Mock external dependencies**
- **Clean up after tests** - Use `beforeEach`/`afterEach`
- **Test edge cases** - Empty arrays, null values, errors

---

## Submitting Changes

### Before Submitting

1. **Run all tests:**
   ```bash
   npm run test
   ```

2. **Lint your code:**
   ```bash
   npm run lint:fix
   ```

3. **Format code:**
   ```bash
   npm run format
   ```

4. **Update documentation** if needed

5. **Add tests** for new features

### Commit Message Format

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, no logic change)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process, dependencies, tooling

#### Examples

```
feat(map): add grid system with coordinate labels

Implements a 150m grid system with A-Z, 0-30 coordinate labels.
Grid visibility and label size are zoom-responsive.

Closes #45
```

```
fix(security): enable Electron context isolation

Enables contextIsolation and disables enableRemoteModule to
prevent XSS to RCE escalation. Refactors preload script to
use contextBridge API.

BREAKING CHANGE: Removes window.ipcRenderer access
```

### Pull Request Process

1. **Update your branch:**
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout your-feature-branch
   git rebase develop
   ```

2. **Push to your fork:**
   ```bash
   git push origin your-feature-branch
   ```

3. **Create Pull Request:**
   - Go to GitHub and create a PR from your branch to `develop`
   - Fill out the PR template completely
   - Link related issues
   - Add screenshots/videos for UI changes

4. **PR Requirements:**
   - All tests must pass
   - Code must be linted
   - Coverage must not decrease
   - At least one approval from maintainer
   - No merge conflicts

5. **After PR is merged:**
   ```bash
   git checkout develop
   git pull upstream develop
   git branch -d your-feature-branch
   ```

---

## Reporting Bugs

### Before Reporting

1. Check existing issues to avoid duplicates
2. Verify the bug exists in the latest version
3. Try to reproduce in a clean environment

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
 - OS: [e.g. Windows 10, macOS 11.2, Ubuntu 20.04]
 - RustLink Version: [e.g. 2.2.0]
 - Electron Version: [e.g. 11.0.0]

**Additional context**
Any other relevant information.

**Logs**
```
Paste relevant logs here
```
```

---

## Requesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm frustrated when [...]

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions or features you've considered.

**Additional context**
Screenshots, mockups, or examples.
```

---

## Security Issues

**DO NOT** report security vulnerabilities in public issues.

Instead, please report them responsibly:
- See [SECURITY.md](SECURITY.md) for reporting instructions
- Email maintainers directly

---

## Project Structure

```
rustLink/
├── src/
│   ├── components/        # Vue components
│   ├── js/
│   │   ├── datastore/    # Data persistence
│   │   ├── ipc/          # IPC communication
│   │   └── services/     # Business logic
│   ├── assets/           # Images, fonts
│   ├── lang/             # Translations
│   ├── App.vue           # Root component
│   ├── main.js           # Vue initialization
│   ├── background.js     # Electron main process
│   └── preload.js        # Electron preload
├── public/               # Static assets
├── tests/
│   ├── unit/            # Unit tests
│   ├── e2e/             # E2E tests
│   └── setup.js         # Test configuration
├── docs/                # Documentation
└── tools/               # Build tools
```

---

## Additional Resources

- [Vue.js Guide](https://vuejs.org/guide/)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://docs.cypress.io/)

---

## Questions?

- Create a [Discussion](https://github.com/JawadYzbk/rustLink/discussions)
- Ask in issues with `question` label
- Check existing documentation

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to RustLink! 🎉
