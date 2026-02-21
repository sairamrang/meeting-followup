# Security Standards

**Owner:** Temenos Security Team
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines universal security standards for all Temenos software projects to protect against common vulnerabilities and ensure regulatory compliance.

---

## OWASP Top 10 Protection

### A01: Broken Access Control
**Requirements:**
- Implement authentication for all non-public endpoints
- Enforce authorization checks at API layer (not just UI)
- Use role-based access control (RBAC) or attribute-based access control (ABAC)
- Validate user permissions on every request
- Log all access control failures

**Verification:**
- [ ] All API endpoints require authentication
- [ ] Authorization checks in place (not just client-side)
- [ ] Privilege escalation attacks tested and blocked

### A02: Cryptographic Failures
**Requirements:**
- Use TLS 1.2+ for all data in transit
- Hash passwords with bcrypt, Argon2, or PBKDF2 (never MD5/SHA1)
- Encrypt sensitive data at rest (PII, financial data, credentials)
- Use strong encryption algorithms (AES-256, RSA-2048+)
- Never store secrets in code or version control

**Verification:**
- [ ] All HTTP connections use HTTPS
- [ ] Passwords hashed with strong algorithm
- [ ] No secrets in .env files committed to git
- [ ] Sensitive data encrypted in database

### A03: Injection
**Requirements:**
- Use parameterized queries for all database operations
- Validate and sanitize all user input
- Use ORM frameworks correctly (avoid raw SQL)
- Implement Content Security Policy (CSP) headers
- Escape output to prevent XSS

**Verification:**
- [ ] No string concatenation in SQL queries
- [ ] Input validation on both client and server
- [ ] Output encoding/escaping implemented
- [ ] CSP headers configured

### A04: Insecure Design
**Requirements:**
- Perform threat modeling for sensitive features
- Implement rate limiting and throttling
- Use secure design patterns (least privilege, defense in depth)
- Separate sensitive operations (e.g., authentication, payment)
- Implement business logic validation server-side

**Verification:**
- [ ] Threat model documented for sensitive features
- [ ] Rate limiting implemented (login, API calls)
- [ ] Business rules enforced server-side

### A05: Security Misconfiguration
**Requirements:**
- Remove default credentials and example code
- Disable directory listings and stack traces in production
- Keep dependencies up to date (automated scanning)
- Use security headers (HSTS, X-Frame-Options, X-Content-Type-Options)
- Implement proper CORS configuration

**Verification:**
- [ ] No default credentials in production
- [ ] Security headers configured
- [ ] Debug mode disabled in production
- [ ] Dependencies scanned for vulnerabilities

### A06: Vulnerable and Outdated Components
**Requirements:**
- Scan dependencies weekly (npm audit, Snyk, Dependabot)
- Update dependencies within 30 days of security patches
- Remove unused dependencies
- Pin dependency versions (no wildcards in production)
- Monitor security advisories for used libraries

**Verification:**
- [ ] Dependency scanning automated (CI/CD)
- [ ] No high/critical vulnerabilities in dependencies
- [ ] Dependencies pinned to specific versions

### A07: Identification and Authentication Failures
**Requirements:**
- Implement multi-factor authentication (MFA) for sensitive operations
- Enforce strong password policies (length, complexity, history)
- Implement account lockout after failed attempts (rate limiting)
- Use secure session management (HttpOnly, Secure, SameSite cookies)
- Expire sessions after inactivity (15-30 minutes)

**Verification:**
- [ ] MFA available for users
- [ ] Password policy enforced (min 12 chars)
- [ ] Session cookies have Secure and HttpOnly flags
- [ ] Sessions expire after inactivity

### A08: Software and Data Integrity Failures
**Requirements:**
- Verify integrity of downloaded dependencies (checksums, signatures)
- Implement code signing for releases
- Use CI/CD pipeline with security checks
- Review third-party code before integration
- Implement audit logging for data changes

**Verification:**
- [ ] Dependencies verified (lock files, checksums)
- [ ] CI/CD pipeline includes security scans
- [ ] Audit logs for all data modifications

### A09: Security Logging and Monitoring Failures
**Requirements:**
- Log all security events (login, logout, access control failures, errors)
- Include context in logs (user ID, IP address, timestamp, action)
- Protect log files from tampering (write-only access)
- Implement alerting for suspicious patterns
- Retain logs per regulatory requirements (90-365 days)

**Verification:**
- [ ] Security events logged with context
- [ ] Log files protected from unauthorized access
- [ ] Alerting configured for security events

### A10: Server-Side Request Forgery (SSRF)
**Requirements:**
- Validate and sanitize all URLs from user input
- Use allowlists for external services (not blocklists)
- Implement network segmentation (separate internal/external)
- Disable unused URL schemes (file://, gopher://)
- Use DNS resolution controls

**Verification:**
- [ ] User-provided URLs validated against allowlist
- [ ] Network access restricted (no access to internal IPs)
- [ ] SSRF attacks tested and blocked

---

## Authentication Standards

### Password Requirements
- **Minimum Length:** 12 characters (recommend passphrase)
- **Complexity:** At least 3 of 4 character types (upper, lower, number, symbol)
- **History:** Prevent reuse of last 5 passwords
- **Expiration:** Optional (NIST guidelines recommend against forced expiration)
- **Breach Detection:** Check against known breached password lists (HaveIBeenPwned API)

### Multi-Factor Authentication (MFA)
- **Availability:** MFA available for all users
- **Enforcement:** Required for admin/privileged accounts
- **Methods:** Support TOTP (authenticator apps), SMS, email, or hardware tokens
- **Recovery:** Secure recovery process with identity verification

### Session Management
- **Token Generation:** Use cryptographically secure random tokens
- **Token Storage:** HttpOnly, Secure, SameSite=Strict cookies
- **Session Expiration:** 30 minutes inactivity timeout, 8 hours absolute timeout
- **Logout:** Invalidate session server-side (not just client-side)
- **Concurrent Sessions:** Limit to 3-5 per user (configurable)

---

## API Security

### REST APIs
- **Authentication:** OAuth 2.0 or JWT tokens (not basic auth over HTTP)
- **Rate Limiting:** Per user/IP (e.g., 100 requests/minute)
- **Input Validation:** Validate content-type, payload size, schema
- **Output Encoding:** JSON escape all output
- **Versioning:** Use API versioning (e.g., /api/v1/)

### GraphQL APIs
- **Query Depth Limiting:** Max depth 5-7 to prevent DoS
- **Query Complexity:** Calculate and limit complexity score
- **Batching Limits:** Max 10-20 queries per batch
- **Introspection:** Disable in production
- **Authorization:** Field-level authorization

### WebSocket/SSE
- **Authentication:** Authenticate before upgrading connection
- **Rate Limiting:** Message rate limiting per connection
- **Heartbeat:** Implement ping/pong to detect dead connections
- **Message Validation:** Validate all incoming messages

---

## Data Protection

### Personally Identifiable Information (PII)
- **Encryption:** Encrypt PII at rest (database, logs, backups)
- **Access Control:** Restrict access to PII (need-to-know basis)
- **Masking:** Mask PII in logs and UI (show last 4 digits only)
- **Retention:** Delete PII per data retention policy
- **Consent:** Obtain explicit consent for data collection

### Financial Data
- **PCI-DSS Compliance:** Follow PCI-DSS requirements if handling payment cards
- **Tokenization:** Tokenize payment methods (never store full card numbers)
- **Audit Logging:** Log all financial transactions
- **Reconciliation:** Implement financial reconciliation processes

### Data Minimization
- **Collect Only Necessary Data:** Don't collect data "just in case"
- **Retention Limits:** Delete data when no longer needed
- **Anonymization:** Anonymize data for analytics when possible

---

## Secrets Management

### Development
- **No Secrets in Code:** Never commit secrets to version control
- **Environment Variables:** Use .env files (add to .gitignore)
- **Local Storage:** Use OS keychains (macOS Keychain, Windows Credential Manager)

### Production
- **Secret Management Tools:** Use Vault, AWS Secrets Manager, Azure Key Vault, etc.
- **Rotation:** Rotate secrets every 90 days (or after suspected compromise)
- **Access Control:** Limit secret access to authorized services/users
- **Audit:** Log all secret access

### API Keys & Tokens
- **Scope Limitation:** Use least-privilege scopes
- **Expiration:** Set expiration times (30-90 days)
- **Revocation:** Ability to revoke keys immediately
- **Monitoring:** Monitor API key usage for anomalies

---

## Secure Development Practices

### Code Review
- **Security Focus:** Reviewer checks for security issues
- **Automated Scanning:** Run SAST (Static Application Security Testing) in CI/CD
- **Dependency Scanning:** Check for vulnerable dependencies
- **Secret Scanning:** Prevent secrets from being committed

### Testing
- **Security Testing:** Include security test cases (SQL injection, XSS, CSRF, etc.)
- **Penetration Testing:** Annual pen testing for production systems
- **Bug Bounty:** Consider bug bounty program for public-facing apps

### Third-Party Code
- **License Review:** Verify license compatibility
- **Security Audit:** Review code for security issues
- **Dependency Chain:** Audit entire dependency chain
- **Vendor Assessment:** Assess vendor security practices

---

## Incident Response

### Preparation
- **Incident Response Plan:** Document incident response procedures
- **Contact List:** Maintain list of security contacts
- **Tools Ready:** Have forensics and analysis tools ready

### Detection & Response
- **Monitoring:** Monitor logs and alerts 24/7
- **Triage:** Classify incidents by severity (P1-P4)
- **Containment:** Isolate affected systems immediately
- **Communication:** Notify stakeholders per plan

### Post-Incident
- **Root Cause Analysis:** Identify how incident occurred
- **Remediation:** Fix vulnerabilities
- **Lessons Learned:** Document and share learnings
- **Notification:** Notify affected users per regulatory requirements

---

## Compliance Requirements

### GDPR (General Data Protection Regulation)
- Right to access, rectification, erasure, data portability
- Privacy by design and by default
- Data protection impact assessments (DPIA)
- Breach notification within 72 hours

### SOC 2 (Service Organization Control 2)
- Security, availability, processing integrity, confidentiality, privacy
- Annual audits by independent auditor

### ISO 27001
- Information security management system (ISMS)
- Risk assessment and treatment
- Continuous improvement

---

## Verification Checklist

Use this checklist during security review:

- [ ] OWASP Top 10 protections implemented
- [ ] Authentication and authorization working correctly
- [ ] Password policy enforced (min 12 chars)
- [ ] MFA available
- [ ] All data in transit encrypted (TLS 1.2+)
- [ ] Sensitive data encrypted at rest
- [ ] No secrets in code or version control
- [ ] Input validation on client and server
- [ ] Output encoding/escaping implemented
- [ ] SQL queries use parameterized statements
- [ ] Dependencies scanned (no high/critical vulnerabilities)
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] Rate limiting implemented
- [ ] Security logging enabled
- [ ] Penetration testing completed (if applicable)

---

## Related Documents

- [Quality Standards](quality-standards.md) - Code quality and testing requirements
- [Workflow Standards](workflow-standards.md) - Secure development workflow
- [Coding Conventions](coding-conventions/) - Secure coding practices per language

---

## Security Contacts

- **Security Team:** security@temenos.com
- **Incident Response:** security-incident@temenos.com (24/7)
- **Bug Bounty:** https://hackerone.com/temenos

---

**Note:** Security is everyone's responsibility. When in doubt, ask the security team.
