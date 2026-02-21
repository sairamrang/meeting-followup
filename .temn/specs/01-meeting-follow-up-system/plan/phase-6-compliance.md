# Phase 6: Compliance & Verification

Spec: [Acceptance Criteria](../spec-functional.md#acceptance-criteria) | [Security](../spec-technical.md#security) | [GDPR](../spec-technical.md#analytics-privacy)

**Dependencies:** Phases 1-5 completed ✓

---

## Task 6.1: End-to-End Verification - All Acceptance Criteria {#task-61}

**File:** `packages/frontend/tests/e2e/acceptance-criteria.spec.ts`

Verify all 8 ACs from functional spec:

- [ ] **AC-001: Follow-Up Creation Time**
  - [ ] E2E: Create follow-up from scratch → Publish in <10 min
  - [ ] Measure actual time, verify <600 seconds
  - [ ] Test with slow network (throttle to 3G)

- [ ] **AC-002: Auto-Save Reliability**
  - [ ] Edit field → wait 30s → verify "Saved" indicator
  - [ ] Reload page → verify data persisted
  - [ ] Network error during save → retry and succeed

- [ ] **AC-003: URL Uniqueness Validation**
  - [ ] Publish with URL /followup/acme-corp-jan-27-2026
  - [ ] Try to publish another with same URL
  - [ ] Verify error "URL already exists"
  - [ ] Accept suggested /followup/acme-corp-jan-27-2026-2

- [ ] **AC-004: Public Page Access**
  - [ ] Publish follow-up
  - [ ] As unauthenticated user: visit public URL
  - [ ] Verify page loads without login
  - [ ] Verify all sections render correctly
  - [ ] Test on mobile (375px viewport)

- [ ] **AC-005: Analytics Real-Time Update**
  - [ ] Creator: open analytics dashboard
  - [ ] Prospect: visit published follow-up
  - [ ] Creator: wait 1 min, verify analytics updated
  - [ ] Verify unique visitor count incremented

- [ ] **AC-006: Resource Download Tracking**
  - [ ] Upload PDF to follow-up
  - [ ] Publish
  - [ ] As prospect: click download
  - [ ] Verify file downloads
  - [ ] Creator: verify analytics show 1 download

- [ ] **AC-007: Mobile Responsiveness**
  - [ ] Visit follow-up on 375px width (iPhone SE)
  - [ ] Verify no horizontal scroll
  - [ ] Verify sections stack vertically
  - [ ] Verify buttons tappable (44px min)
  - [ ] Test on tablet (768px), desktop (1920px)

- [ ] **AC-008: Edit After Publish**
  - [ ] Publish follow-up
  - [ ] Click Edit
  - [ ] Modify content (add next step, edit recap)
  - [ ] Save changes
  - [ ] As prospect: reload page
  - [ ] Verify changes appear immediately

**Acceptance Mapping:** Validates all 8 ACs

---

## Task 6.2: Comprehensive Business Rules Verification {#task-62}

**File:** `packages/backend/tests/integration/business-rules.spec.ts`

Verify all 8 business rules:

- [ ] **BR-001: URL Uniqueness**
  - [ ] Generate slug, verify unique
  - [ ] Collision → append -2, -3
  - [ ] Test with unicode characters, special chars

- [ ] **BR-002: Draft Ownership**
  - [ ] User A creates draft
  - [ ] User B cannot see draft
  - [ ] User B cannot edit or delete User A's draft
  - [ ] Test auth middleware

- [ ] **BR-003: Published Page Visibility**
  - [ ] Create draft (not visible publicly)
  - [ ] Publish (publicly visible)
  - [ ] Unauthenticated user can access
  - [ ] robots.txt check (no exclusion by default)

- [ ] **BR-004: File Upload Limits**
  - [ ] Upload 10MB file → success
  - [ ] Upload 10.1MB file → 413 error
  - [ ] Upload 11 files → 10th succeeds, 11th fails
  - [ ] Verify total user storage quota enforced

- [ ] **BR-005: Auto-Save Behavior**
  - [ ] Edit field → wait 30s → verify save
  - [ ] No changes → no save (confirmed in logs)
  - [ ] Network error → retry 3x, then error prompt
  - [ ] Visual indicator transitions: idle → Saving → Saved

- [ ] **BR-006: Analytics Privacy**
  - [ ] Verify no raw IP stored in DB
  - [ ] Verify IP hashed (SHA-256)
  - [ ] Verify no names/emails in analytics events
  - [ ] Verify 12-month data retention policy

- [ ] **BR-007: Content Library Updates**
  - [ ] Admin updates library item
  - [ ] Follow-up without override → updated automatically
  - [ ] Follow-up with override → not updated

- [ ] **BR-008: Meeting Date Validation**
  - [ ] Try future date → error
  - [ ] Try today → success
  - [ ] Try 30 days ago → success with warning
  - [ ] Try 31 days ago → success but show warning banner

**Acceptance Mapping:** Validates all business rules

---

## Task 6.3: GDPR Compliance Verification {#task-63}

**File:** `packages/backend/tests/compliance/gdpr.spec.ts`

- [ ] **Data Collection:**
  - [ ] Verify only necessary data collected (no names/emails in analytics)
  - [ ] Verify privacy notice on follow-up pages

- [ ] **Data Retention:**
  - [ ] Configure 12-month retention policy
  - [ ] Implement cleanup job: DELETE FROM analytics_events WHERE timestamp < NOW() - interval '12 months'
  - [ ] Run manually and verify data deleted

- [ ] **Data Export:**
  - [ ] Implement: GET /api/user/data-export
  - [ ] Returns all user's follow-ups + analytics in JSON
  - [ ] User can request export, receive within 30 days

- [ ] **Data Deletion (Right to Be Forgotten):**
  - [ ] Implement: DELETE /api/user/delete
  - [ ] Deletes all user's data: follow-ups, files, analytics, events
  - [ ] Verify hard delete (not soft delete)

- [ ] **Consent:**
  - [ ] Display cookie/tracking notice on first visit
  - [ ] Allow users to opt-out of analytics

- [ ] **Transparency:**
  - [ ] Create /privacy-policy page
  - [ ] Create /terms-of-service page
  - [ ] Link in footer on all pages

**Acceptance Mapping:** BR-006 (analytics privacy)

---

## Task 6.4: Security Compliance Verification {#task-64}

**File:** `packages/backend/tests/compliance/security.spec.ts`

- [ ] **OWASP Top 10 Check:**
  - [ ] A01: Broken Access Control - verify ownership checks
  - [ ] A02: Cryptographic Failures - verify HTTPS, JWT signing
  - [ ] A03: Injection - verify SQL injection tests (Zod validation)
  - [ ] A04: Insecure Design - verify threat modeling documented
  - [ ] A05: Security Misconfiguration - verify CSP, CORS, headers
  - [ ] A06: Vulnerable Components - npm audit, dependency scanning
  - [ ] A07: Authentication Failures - verify JWT expiration, refresh
  - [ ] A08: Software & Data Integrity - verify signed URLs for files
  - [ ] A09: Logging & Monitoring - verify error logging
  - [ ] A10: SSRF - verify no server-side requests to untrusted URLs

- [ ] **Headers Security:**
  - [ ] Verify Content-Security-Policy header (prevent XSS)
  - [ ] Verify X-Frame-Options: DENY (prevent clickjacking)
  - [ ] Verify X-Content-Type-Options: nosniff
  - [ ] Verify Strict-Transport-Security: max-age=31536000 (HSTS)

- [ ] **File Upload Security:**
  - [ ] Magic number validation (not just extension)
  - [ ] Scan uploaded files for malware (optional: ClamAV)
  - [ ] Store files in private bucket, serve via signed URLs
  - [ ] Verify filename sanitization (no path traversal)

- [ ] **Authentication & Authorization:**
  - [ ] JWT validation on all protected endpoints
  - [ ] Verify user can only access their own data
  - [ ] Verify admin roles enforced for library management
  - [ ] Rate limiting enabled (100 req/min)

**Acceptance Mapping:** Security NFR

---

## Task 6.5: Sign-Off & Launch Readiness {#task-65}

**Files:**
- `.github/workflows/launch-checklist.md`
- `LAUNCH_VERIFICATION.md`

- [ ] **Code Quality:**
  - [ ] >80% test coverage (run coverage report)
  - [ ] 0 TypeScript errors
  - [ ] 0 ESLint warnings
  - [ ] All dependencies up-to-date

- [ ] **Performance:**
  - [ ] Lighthouse score ≥95 on all pages
  - [ ] API P95 response time <500ms
  - [ ] Page load time <2s (P95)
  - [ ] Auto-save latency <200ms

- [ ] **Accessibility:**
  - [ ] WCAG 2.2 AA compliance verified
  - [ ] 0 axe-core critical/serious issues
  - [ ] Keyboard navigation tested
  - [ ] Screen reader tested (VoiceOver/NVDA)

- [ ] **Security:**
  - [ ] 0 OWASP High/Critical vulnerabilities
  - [ ] npm audit clean
  - [ ] Secrets not hardcoded (use env vars)
  - [ ] File upload validation complete

- [ ] **Monitoring:**
  - [ ] Sentry configured with alerts
  - [ ] Vercel Analytics tracking
  - [ ] Uptime monitoring active
  - [ ] OKR tracking dashboards ready

- [ ] **Documentation:**
  - [ ] README.md complete (setup, architecture, testing)
  - [ ] API docs (OpenAPI/Swagger)
  - [ ] Runbook for operations
  - [ ] Privacy policy & terms of service

- [ ] **Deployment:**
  - [ ] Staging environment tested
  - [ ] Database migrations tested on staging
  - [ ] Vercel deployment configured
  - [ ] GitHub Actions CI/CD passing

- [ ] **Sign-Off:**
  - [ ] Product Manager approval (feature complete)
  - [ ] Tech Lead approval (quality gates met)
  - [ ] Security team approval (compliance verified)
  - [ ] Operations team approval (monitoring ready)

**Acceptance Mapping:** MVP Launch Gate

---

**Phase 6 Complete When:**
- [x] All 5 tasks completed
- [x] All 8 ACs verified passing
- [x] All 8 BRs verified passing
- [x] GDPR compliance verified
- [x] Security compliance verified
- [x] Launch checklist signed off
- [x] **MVP LAUNCH READY** ✅

**Effort Estimate:** 1 week (QA lead + tech lead for sign-off)

**Next:** Phase 2 enhancements (P1 requirements)

---

## Post-Launch Monitoring

**Week 1 After Launch:**
- Monitor Sentry for errors
- Check OKR metrics (creation time, engagement rate)
- User feedback collection
- Bug triage and hotfixes

**Week 2-4:**
- Performance optimization based on analytics
- User feature requests
- Plan Phase 2 enhancements
