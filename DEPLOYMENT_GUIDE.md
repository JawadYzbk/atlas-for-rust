# RustLink Deployment Guide

Complete guide for building, testing, and deploying RustLink across multiple platforms.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Building for Production](#building-for-production)
4. [Platform-Specific Builds](#platform-specific-builds)
5. [Testing](#testing)
6. [Continuous Integration](#continuous-integration)
7. [Distribution](#distribution)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v16.x or v18.x (LTS recommended)
- **npm**: v8.x or higher (comes with Node.js)
- **Git**: Latest stable version

### Platform-Specific Requirements

#### Windows
- **Windows 10/11** (64-bit)
- **Windows Build Tools**: Automatically installed by npm
- **Visual Studio Build Tools** (optional, for native modules)

#### macOS
- **macOS 10.13+**
- **Xcode Command Line Tools**: `xcode-select --install`
- **Code signing certificate** (for distribution)

#### Linux
- **Ubuntu 18.04+** / **Debian 10+** / **Fedora 32+**
- **Build essentials**: `sudo apt-get install build-essential`
- **Required libraries**:
  ```bash
  sudo apt-get install libgtk-3-dev libnotify-dev libgconf-2-4 \
    libnss3 libxss1 libasound2 libxtst6 xauth xvfb
  ```

---

## Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JawadYzbk/rustLink.git
cd rustLink
```

### 2. Install Dependencies

```bash
npm install
```

This will install all production and development dependencies, including:
- Vue.js and related tools
- Electron and Electron Builder
- TailwindCSS
- Testing frameworks (Vitest, Cypress)
- Code quality tools (ESLint, Prettier)

### 3. Run Development Server

```bash
npm run electron:serve
```

This starts the Electron app in development mode with:
- Hot module replacement (HMR)
- DevTools enabled
- Source maps for debugging
- Vue DevTools support

The app will automatically reload when you make changes to the source code.

---

## Building for Production

### Build All Platforms

```bash
npm run electron:build -- --mac --win --linux
```

### Build Specific Platform

```bash
# Windows only
npm run electron:build -- --win

# macOS only
npm run electron:build -- --mac

# Linux only
npm run electron:build -- --linux
```

### Build Options

#### Publish to GitHub Releases
```bash
npm run electron:build -- --win --publish=always
```

#### Skip Code Signing
```bash
npm run electron:build -- --win --config.win.certificateFile=""
```

#### Build for Specific Architecture
```bash
# 64-bit only
npm run electron:build -- --win --x64

# ARM64 (Apple Silicon)
npm run electron:build -- --mac --arm64
```

---

## Platform-Specific Builds

### Windows

#### Installer Types
By default, builds both:
- **NSIS Installer** (.exe) - Recommended for most users
- **Portable** (.exe) - No installation required

#### Code Signing (Optional)
For production releases, sign your Windows builds:

1. Obtain a code signing certificate (e.g., from DigiCert, Sectigo)
2. Set environment variables:
   ```bash
   set WIN_CSC_LINK=path\to\certificate.pfx
   set WIN_CSC_KEY_PASSWORD=your_password
   ```
3. Build:
   ```bash
   npm run electron:build -- --win
   ```

#### Output Location
```
dist_electron/
├── RustLink-2.2.0-win-x64.exe     # NSIS installer
├── RustLink-2.2.0-win-portable.exe # Portable version
└── win-unpacked/                   # Unpacked files
```

---

### macOS

#### Requirements
- **macOS 10.13+** for building
- **Apple Developer Account** for code signing and notarization
- **Xcode** and Command Line Tools

#### Code Signing

1. Get your Developer ID certificate from Apple Developer Portal
2. Install certificate in Keychain Access
3. Set environment variables:
   ```bash
   export APPLE_ID="your@apple.id"
   export APPLE_ID_PASSWORD="app-specific-password"
   export APPLE_TEAM_ID="your_team_id"
   ```
4. Build:
   ```bash
   npm run electron:build -- --mac
   ```

#### Notarization
For macOS 10.14.5+, apps must be notarized:

```bash
# Automatically notarize during build
npm run electron:build -- --mac \
  --config.afterSign=./scripts/notarize.js
```

Create `scripts/notarize.js`:
```javascript
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') return;

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'com.jawadyzbk.rustlink',
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
  });
};
```

#### Output Location
```
dist_electron/
├── RustLink-2.2.0-mac.dmg        # DMG installer
├── RustLink-2.2.0-mac.zip        # ZIP archive
└── mac/                           # .app bundle
```

---

### Linux

#### Supported Formats
- **AppImage** - Universal Linux package (recommended)
- **DEB** - Debian/Ubuntu package
- **RPM** - Red Hat/Fedora package
- **Snap** - Snapcraft package (requires additional setup)

#### Build All Linux Formats
```bash
npm run electron:build -- --linux \
  --config.linux.target=AppImage \
  --config.linux.target=deb \
  --config.linux.target=rpm
```

#### Cross-Platform Building
To build Linux packages from Windows/macOS:

```bash
# Install Docker
# Then use electron-builder with Docker
npm run electron:build -- --linux --docker
```

#### Output Location
```
dist_electron/
├── RustLink-2.2.0-x86_64.AppImage  # AppImage
├── rustlink_2.2.0_amd64.deb        # Debian package
├── rustlink-2.2.0.x86_64.rpm       # RPM package
└── linux-unpacked/                  # Unpacked files
```

---

## Testing

### Unit Tests

Run unit tests with Vitest:
```bash
npm run test:unit
```

Watch mode for development:
```bash
npm run test:unit -- --watch
```

Generate coverage report:
```bash
npm run test:unit -- --coverage
```

### E2E Tests

Run end-to-end tests with Cypress:
```bash
# Headless mode
npm run test:e2e

# Interactive mode
npm run test:e2e:open
```

### Linting

Check code quality:
```bash
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Format Code

```bash
npm run format
```

---

## Continuous Integration

### GitHub Actions Workflow

The project includes a CI/CD workflow (`.github/workflows/build.yml`):

```yaml
name: Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:unit
      - run: npm run lint
      - run: npm run electron:build
      - uses: actions/upload-artifact@v3
        with:
          name: ${{ matrix.os }}-build
          path: dist_electron/*
```

### Automated Releases

To create a release:

1. Update version in `package.json`
2. Create and push a git tag:
   ```bash
   git tag v2.2.1
   git push origin v2.2.1
   ```
3. GitHub Actions will automatically:
   - Run tests
   - Build for all platforms
   - Create GitHub release
   - Upload build artifacts

---

## Distribution

### GitHub Releases

1. Build production versions for all platforms
2. Go to GitHub → Releases → Draft a new release
3. Create a new tag (e.g., `v2.2.1`)
4. Add release notes
5. Upload build artifacts:
   - Windows: `.exe` installer
   - macOS: `.dmg` file
   - Linux: `.AppImage`, `.deb`, `.rpm`
6. Publish release

### Auto-Updater (Planned Feature)

To implement auto-updates:

1. Configure update server in `vue.config.js`:
   ```javascript
   builderOptions: {
     publish: [{
       provider: 'github',
       owner: 'JawadYzbk',
       repo: 'rustLink'
     }]
   }
   ```

2. Implement update checker in `src/background.js`:
   ```javascript
   const { autoUpdater } = require('electron-updater');

   autoUpdater.checkForUpdatesAndNotify();
   ```

3. Build with publish flag:
   ```bash
   npm run electron:build -- --publish=always
   ```

---

## Troubleshooting

### Build Issues

#### Issue: "Module not found" errors
**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Electron build fails with "Cannot find module"
**Solution:** Rebuild native modules:
```bash
npm run postinstall
```

#### Issue: macOS code signing fails
**Solution:** Check certificate and credentials:
```bash
security find-identity -v -p codesigning
```

### Runtime Issues

#### Issue: App won't launch on Windows
**Solution:** Install Visual C++ Redistributable:
- Download from Microsoft's website
- Or build with bundled runtime

#### Issue: App crashes on Linux
**Solution:** Install missing dependencies:
```bash
ldd dist_electron/linux-unpacked/rustlink
# Install any missing libraries shown
```

#### Issue: DevTools not opening
**Solution:** Check environment variable:
```bash
export WEBPACK_DEV_SERVER_URL=http://localhost:8080
```

### Performance Issues

#### Issue: Slow build times
**Solution:** Use incremental builds:
```bash
npm run electron:build -- --dir  # Skip packaging
```

#### Issue: Large bundle size
**Solution:** Analyze bundle:
```bash
npm run build -- --report
```

---

## Environment Variables

### Build-Time Variables

```bash
# Node environment
NODE_ENV=production

# Webpack dev server (development only)
WEBPACK_DEV_SERVER_URL=http://localhost:8080

# Code signing (Windows)
WIN_CSC_LINK=path/to/certificate.pfx
WIN_CSC_KEY_PASSWORD=password

# Code signing (macOS)
APPLE_ID=your@apple.id
APPLE_ID_PASSWORD=app-specific-password
APPLE_TEAM_ID=your_team_id

# Publishing
GH_TOKEN=github_personal_access_token
```

### Runtime Variables

```bash
# Enable debug logging
DEBUG=electron*

# Disable hardware acceleration
ELECTRON_DISABLE_HARDWARE_ACCELERATION=1
```

---

## Build Configuration

### Custom Build Configuration

Edit `vue.config.js` to customize:

```javascript
module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "RustLink",
        appId: 'com.jawadyzbk.rustlink',

        // Custom directories
        directories: {
          output: 'dist_electron',
          buildResources: 'build'
        },

        // Files to include
        files: [
          '**/*',
          '!tests/**/*',
          '!docs/**/*'
        ],

        // Windows config
        win: {
          target: ['nsis', 'portable'],
          icon: 'public/images/icon.png'
        },

        // macOS config
        mac: {
          target: ['dmg', 'zip'],
          icon: 'public/images/icon.png',
          hardenedRuntime: true,
          gatekeeperAssess: false,
          entitlements: 'build/entitlements.mac.plist'
        },

        // Linux config
        linux: {
          target: ['AppImage', 'deb', 'rpm'],
          icon: 'public/images/icon.png',
          category: 'Utility'
        }
      }
    }
  }
};
```

---

## Security Considerations

### Before Deployment

- [ ] Update all dependencies to latest secure versions
- [ ] Run security audit: `npm audit`
- [ ] Enable context isolation in Electron
- [ ] Implement Content Security Policy
- [ ] Encrypt sensitive credentials
- [ ] Code sign all distributables
- [ ] Test on clean VM/machine

### Production Checklist

- [ ] Remove all debug logging
- [ ] Disable DevTools in production
- [ ] Validate all user inputs
- [ ] Implement error tracking (Sentry, etc.)
- [ ] Set up crash reporting
- [ ] Test auto-updater
- [ ] Document security practices

---

## Additional Resources

- [Electron Builder Documentation](https://www.electron.build/)
- [Vue CLI Plugin Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/)
- [Electron Documentation](https://www.electronjs.org/docs/latest/)
- [Code Signing Guide](https://www.electron.build/code-signing)

---

## Support

For build and deployment issues:
- Create an issue on GitHub
- Check existing issues for solutions
- Refer to troubleshooting section above

---

**Last Updated:** November 12, 2025
**Version:** 2.2.0
