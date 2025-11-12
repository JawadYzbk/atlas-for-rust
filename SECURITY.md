# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.2.x   | :white_check_mark: |
| < 2.2   | :x:                |

## Reporting a Vulnerability

We take the security of RustLink seriously. If you believe you have found a security vulnerability, please report it to us responsibly.

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to the maintainers. You should receive a response within 48 hours. If for some reason you do not, please follow up to ensure we received your original message.

Please include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Known Security Issues

### Critical Issues Identified (November 2025)

The following critical security vulnerabilities were identified in version 2.2.0 and earlier:

#### 1. Electron Context Isolation Disabled (CRITICAL)
**Status:** Identified, Fix in Progress
**CVSS Score:** 9.8 (Critical)
**Description:** The application has `contextIsolation: false` and `enableRemoteModule: true` in Electron configuration, which completely removes the security boundary between the renderer process and Node.js APIs.
**Impact:** Any XSS vulnerability can lead to Remote Code Execution (RCE)
**Fix:** Enable context isolation and disable remote module access

#### 2. Cross-Site Scripting (XSS) Vulnerabilities (CRITICAL)
**Status:** Identified, Fix in Progress
**CVSS Score:** 8.8 (High)
**Description:** Multiple Vue components use `v-html` with unsanitized user input
**Impact:** Attackers can inject malicious scripts through server descriptions
**Fix:** Replace v-html with text interpolation or use DOMPurify

#### 3. Certificate Validation Disabled (CRITICAL)
**Status:** Identified, Fix in Progress
**CVSS Score:** 8.1 (High)
**Description:** `rejectUnauthorized: false` in HTTPS agent disables SSL/TLS certificate validation
**Impact:** Vulnerable to Man-in-the-Middle (MITM) attacks
**Fix:** Remove insecure HTTPS agent configuration

#### 4. Plaintext Credential Storage (HIGH)
**Status:** Identified, Fix in Progress
**CVSS Score:** 7.5 (High)
**Description:** Authentication tokens and FCM credentials stored unencrypted on disk
**Impact:** Local attackers can steal credentials from electron-store files
**Fix:** Implement Electron safeStorage API for credential encryption

### Dependency Vulnerabilities

As of November 2025, the application has **111 known dependency vulnerabilities**:
- 7 Critical
- 31 High
- 70 Moderate
- 3 Low

Key vulnerable dependencies:
- Axios 0.21.1 (should update to 1.x)
- Electron 11.0.0 (should update to 28+)
- Multiple transitive dependencies in build tools

## Security Best Practices for Users

Until the security fixes are implemented, users should:

1. **Only connect to trusted servers** - Malicious servers could exploit XSS vulnerabilities
2. **Use on a secure network** - Avoid public WiFi due to MITM vulnerability
3. **Keep the application updated** - Install security patches immediately when available
4. **Protect your credentials** - Be aware that tokens are stored unencrypted
5. **Use antivirus software** - Provides additional protection layer
6. **Review permissions** - Ensure the application only has necessary system access

## Security Roadmap

### Phase 1: Critical Fixes (Weeks 1-2)
- [x] Enable Electron context isolation
- [x] Disable remote module
- [x] Refactor preload script with contextBridge
- [x] Remove certificate validation bypass
- [x] Fix all XSS vulnerabilities
- [ ] Implement credential encryption
- [ ] Update critical dependencies (Axios, Electron)

### Phase 2: Hardening (Weeks 3-4)
- [ ] Implement Content Security Policy (CSP)
- [ ] Add IPC input validation
- [ ] Implement URL whitelist for external links
- [ ] Add rate limiting for IPC messages
- [ ] Implement proper logging (no sensitive data exposure)

### Phase 3: Testing & Validation (Weeks 5-6)
- [ ] Security-focused unit tests
- [ ] Penetration testing
- [ ] Code security scanning (Snyk, SonarQube)
- [ ] Dependency scanning automation (Dependabot)
- [ ] Security audit by third party

### Phase 4: Continuous Security (Ongoing)
- [ ] Automated vulnerability scanning in CI/CD
- [ ] Regular dependency updates
- [ ] Security code review for all PRs
- [ ] Bug bounty program (future consideration)

## Security Contacts

For security-related questions or concerns:
- Create a security advisory on GitHub (preferred)
- Email the maintainers (see README for contact information)

## Acknowledgments

We would like to thank the following individuals for responsibly disclosing security vulnerabilities:

- Claude AI Code Review (November 2025) - Comprehensive security audit

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Electron Security Guidelines](https://www.electronjs.org/docs/latest/tutorial/security)
- [Vue.js Security Best Practices](https://vuejs.org/guide/best-practices/security.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## License

This security policy is licensed under [MIT License](LICENSE).

---

Last Updated: November 12, 2025
