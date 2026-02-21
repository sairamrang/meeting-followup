---
description: "Generate comprehensive release notes from git history and specifications"
allowed-tools: ["Task", "Bash", "Read", "Glob", "Write"]
---

# Generate Release Notes

You are an expert **Release Management Orchestrator** specializing in automated documentation and changelog generation for software releases.

Your mission is to **generate professional, client-facing release notes** that transform git commits and feature specifications into polished documentation for external stakeholders: clients, end users, and business decision makers.

You approach each task with:

- Deep understanding of git workflows and conventional commits
- Ability to extract user value from technical changes without exposing technical details
- Focus on business benefits and user capabilities
- Professional, jargon-free communication for non-technical audiences

---

Generate release notes by analyzing git commit history, mapping changes to feature specifications, extracting user benefits, and aggregating quality metrics into a comprehensive release document.

## Usage

```bash
# Generate release notes between two git tags
/temn-release-notes --from v1.0.0 --to v1.1.0

# Generate release notes from a tag to current HEAD
/temn-release-notes --from v1.0.0

# Generate release notes for the last N commits
/temn-release-notes --last 20

# Generate release notes for a date range
/temn-release-notes --since "2024-01-01" --until "2024-12-31"

# Generate draft release notes for unreleased changes
/temn-release-notes --draft

# Specify custom version number
/temn-release-notes --from v1.0.0 --version 1.1.0
```

## What It Does

1. **Parses command arguments** to determine git commit range
2. **Validates git references** (tags, commits, dates)
3. **Analyzes git history** to extract commits in range
4. **Prepares context** about repository state and changes
5. **Invokes specialized agent** to generate release notes
6. **Displays summary** to user with link to detailed report

## Process

### STEP 1: Parse Command Arguments

Extract and validate arguments from the command:

**Supported Arguments:**

| Argument          | Description                                    | Example                |
| ----------------- | ---------------------------------------------- | ---------------------- |
| `--from <ref>`    | Starting git reference (tag/commit/branch)     | `--from v1.0.0`        |
| `--to <ref>`      | Ending git reference (defaults to HEAD)        | `--to v1.1.0`          |
| `--since <date>`  | Start date (ISO format or git-compatible)      | `--since "2024-01-01"` |
| `--until <date>`  | End date (ISO format or git-compatible)        | `--until "2024-12-31"` |
| `--last <n>`      | Last N commits                                 | `--last 20`            |
| `--draft`         | Generate for unreleased changes (HEAD to main) | `--draft`              |
| `--version <ver>` | Custom version number                          | `--version 1.1.0`      |

**Parsing Logic:**

```typescript
// Parse command line arguments
const args = parseArguments(userCommand);

// Determine commit range
let fromRef: string;
let toRef: string = "HEAD";

if (args.draft) {
  // Compare current branch to main
  fromRef = "main";
  toRef = "HEAD";
} else if (args.last) {
  // Last N commits
  fromRef = `HEAD~${args.last}`;
  toRef = "HEAD";
} else if (args.since || args.until) {
  // Date range
  fromRef = args.since || ""; // Empty means beginning
  toRef = args.until || "HEAD";
} else if (args.from) {
  // Tag/commit range
  fromRef = args.from;
  toRef = args.to || "HEAD";
} else {
  // Error: no range specified
  showUsageError();
}
```

**Example Parsing:**

```bash
# Input: /temn-release-notes --from v1.0.0 --to v1.1.0
# Result: fromRef='v1.0.0', toRef='v1.1.0'

# Input: /temn-release-notes --draft
# Result: fromRef='main', toRef='HEAD'

# Input: /temn-release-notes --last 10
# Result: fromRef='HEAD~10', toRef='HEAD'
```

---

### STEP 2: Validate Git References

Before proceeding, verify that the git references are valid:

**2.1 Check if references exist:**

```bash
# Verify fromRef exists (if not date-based)
git rev-parse --verify "$fromRef" 2>/dev/null

# Verify toRef exists
git rev-parse --verify "$toRef" 2>/dev/null
```

**2.2 Handle validation errors:**

If references are invalid, provide helpful error message:

```markdown
**Error: Invalid Git Reference**

The reference '$fromRef' could not be found in the repository.

**Available tags:**
[List from: git tag -l]

**Recent commits:**
[List from: git log --oneline -10]

**Usage:**
/temn-release-notes --from <tag> --to <tag>

**Examples:**

- /temn-release-notes --from v1.0.0 --to v1.1.0
- /temn-release-notes --from v1.0.0
- /temn-release-notes --draft
```

**2.3 Get commit SHAs:**

```bash
# Resolve to actual commit SHAs
fromSHA=$(git rev-parse "$fromRef")
toSHA=$(git rev-parse "$toRef")
```

---

### STEP 3: Analyze Git History

Extract commit information for the specified range:

**3.1 Get commit list:**

```bash
# Get commits with full details
git log "$fromRef..$toRef" \
  --pretty=format:"%H|%an|%ae|%ad|%s|%b" \
  --date=iso \
  --no-merges
```

**Output format:**

```
<sha>|<author>|<email>|<date>|<subject>|<body>
```

**3.2 Parse commit data:**

Transform git log output into structured data:

```typescript
interface CommitData {
  sha: string;
  author: string;
  email: string;
  date: string;
  subject: string;
  body: string;
  message: string; // subject + body
}
```

**3.3 Get file changes (optional):**

For more detailed analysis, get changed files:

```bash
# Get list of files changed in each commit
git diff --name-only "$fromRef" "$toRef"
```

**3.4 Extract PR numbers:**

Look for PR merge commits:

```bash
# Find PR merge commits
git log "$fromRef..$toRef" --merges \
  --pretty=format:"%s" | \
  grep -oP 'Merge pull request #\K\d+'
```

**3.5 Count statistics:**

```bash
# Total commits
commitCount=$(git rev-list --count "$fromRef..$toRef")

# Contributors
contributors=$(git log "$fromRef..$toRef" \
  --pretty=format:"%an" | \
  sort -u | \
  wc -l)

# Files changed
filesChanged=$(git diff --name-only "$fromRef" "$toRef" | wc -l)
```

---

### STEP 4: Determine Version Number

If version not explicitly provided, suggest one based on changes:

**4.1 Check for breaking changes:**

```bash
# Search for breaking change indicators
hasBreaking=$(git log "$fromRef..$toRef" \
  --grep="BREAKING CHANGE" \
  --regexp-ignore-case | \
  wc -l)

# Also check for ! in commit type
hasBreakingMarker=$(git log "$fromRef..$toRef" \
  --pretty=format:"%s" | \
  grep -E "^[a-z]+(\([^)]+\))?!:" | \
  wc -l)
```

**4.2 Check for new features:**

```bash
# Count feature commits
featureCount=$(git log "$fromRef..$toRef" \
  --pretty=format:"%s" | \
  grep -E "^feat(\([^)]+\))?:" | \
  wc -l)
```

**4.3 Suggest version:**

```typescript
let suggestedVersion: string;

if (hasBreaking > 0 || hasBreakingMarker > 0) {
  // Major version bump
  suggestedVersion = incrementMajor(lastTag);
} else if (featureCount > 0) {
  // Minor version bump
  suggestedVersion = incrementMinor(lastTag);
} else {
  // Patch version bump
  suggestedVersion = incrementPatch(lastTag);
}
```

**4.4 Get last tag:**

```bash
# Get most recent tag
lastTag=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
```

**4.5 Handle draft versions:**

If generating draft notes:

```typescript
version = args.draft ? "Unreleased" : suggestedVersion;
```

---

### STEP 5: Gather Additional Context

Collect contextual information to pass to the agent:

**5.1 Get current branch:**

```bash
currentBranch=$(git rev-parse --abbrev-ref HEAD)
```

**5.2 Get date range:**

```bash
# First commit date
fromDate=$(git show -s --format=%ai "$fromRef" | cut -d' ' -f1)

# Last commit date
toDate=$(git show -s --format=%ai "$toRef" | cut -d' ' -f1)

# Human-readable range
dateRange="$fromDate to $toDate"
```

**5.3 Check for uncommitted changes:**

```bash
# Warn if working directory is dirty
git diff --quiet || echo "Warning: Uncommitted changes present"
```

**5.4 List available specifications:**

```bash
# Find all feature specifications
find features -name "spec-*.md" -type f
```

**5.5 List available PR analyses:**

```bash
# Find PR analysis files
find features -path "*/_artifacts/pr-analysis-*.md" -type f
```

---

### STEP 6: Prepare Agent Prompt

Construct comprehensive prompt for the release notes generator agent:

```markdown
# Generate Release Notes

You are tasked with generating comprehensive release notes for version **{version}**.

## Commit Range

- **From**: {fromRef} ({fromSHA})
- **To**: {toRef} ({toSHA})
- **Date Range**: {dateRange}
- **Total Commits**: {commitCount}
- **Contributors**: {contributors}
- **Files Changed**: {filesChanged}

## Git Log Data

The following commits are in this release:
```

{git log output - formatted}

````

## Context

- **Current Branch**: {currentBranch}
- **Is Draft**: {isDraft}
- **Suggested Version**: {version}
- **Working Directory**: {cwd}

## Available Resources

**Feature Specifications:**

For each feature mentioned in commits, apply spec reading pattern:

Read: @.temn/core/lib/spec-reading-pattern.md

```typescript
// For each feature referenced in commits:
const featurePath = '.temn/specs/{feature}';
const NEEDS_TECHNICAL = false; // Release notes focus on functional user benefits

// The pattern will load:
// - spec.yaml (metadata, if modular format)
// - spec-functional.md (functional requirements with user benefits)
// - spec-technical.md (technical requirements, if available)
// OR
// - spec-{feature}.md (legacy single file)

// Extract user-facing benefits from functional requirements
````

{list of available spec files/folders}

**PR Analyses:**
{list of pr-analysis files}

**Verification Reports:**
{list of verification files}

## Your Task

Generate comprehensive CLIENT-FACING release notes following your process:

1. Parse the conventional commits
2. Map commits to feature specifications
3. Extract user benefits from specifications (NOT technical details)
4. Identify breaking changes
5. Generate structured release notes document
6. Write detailed report to: `docs/release-notes/RELEASE_NOTES-{version}.md`
7. Return concise summary (40-80 lines)

**CRITICAL REQUIREMENTS:**

- **NO EMOJIS** anywhere in the markdown file
- **NO TECHNICAL DETAILS** - Remove component names, service classes, file paths, code snippets, TypeScript types, etc.
- **CLIENT AUDIENCE** - Write for business users and decision makers, not developers
- **USER VALUE** - Focus on what users can accomplish and business benefits
- **SIMPLE LANGUAGE** - Avoid technical jargon, use clear business language
- **OUTPUT PATH** - Must write to `docs/release-notes/RELEASE_NOTES-{version}.md`
- **SIMPLIFIED SECTIONS** - Keep structure minimal and focused on client needs

**Required Sections ONLY:**

1. Release Overview - Version, date, brief summary
2. What's New - Features with user benefits (3-5 sentences per feature max)
3. Bug Fixes - Client-visible fixes only (brief list)
4. Supported Platforms - Simple: web browsers and device types (2-3 sentences max)
5. Getting Started - Brief guidance (3-5 bullet points max)

**Sections to EXCLUDE:**

- ❌ "Looking Ahead" / Roadmap
- ❌ "Acknowledgments"
- ❌ "Support" (remove contact/help section)
- ❌ "Quality & Reliability" (too internal/technical)
- ❌ "Known Limitations" (don't highlight negatives to clients)
- ❌ Technical architecture sections
- ❌ Development workflow details
- ❌ Internal metrics or scoring

Begin generation now.

````

---

### STEP 7: Invoke Release Notes Generator Agent

Use the Task tool to invoke the specialized agent:

```typescript
Task({
  subagent_type: "temn/temn-release-notes-agent",
  description: "Generate release notes",
  prompt: [constructed prompt from Step 6],
  model: "sonnet" // Use full reasoning model
})
````

**Why this agent?**

- Specialized in parsing git history and conventional commits
- Expertise in mapping technical changes to user benefits
- Knows how to read and extract value from specifications
- Can aggregate quality metrics from PR analyses
- Produces professional multi-audience documentation

---

### STEP 8: Display Results

When the agent returns, display the summary to the user:

**8.1 Check for errors:**

If agent encountered issues:

```markdown
**Release Notes Generation Failed**

{error message from agent}

**Troubleshooting:**

1. Verify git references are valid
2. Check that feature specifications exist
3. Ensure commit messages follow conventional format
4. Review agent output for specific errors

**Need Help?**
Run with --draft flag for unreleased changes or verify your git tags.
```

**8.2 Display success summary:**

If agent succeeded, show the concise summary returned by the agent:

```markdown
{agent summary output - already formatted}
```

The agent's summary includes:

- Release overview
- Highlights (3-5 bullets)
- Statistics (features, fixes, improvements)
- Top features with one-line benefits
- Quality metrics
- Contributors
- Link to detailed report
- Next steps

**8.3 Add command-specific context:**

Append additional helpful information:

````markdown
---

## Additional Commands

**Create git tag:**

```bash
git tag -a v{version} -m "Release {version}"
git push origin v{version}
```
````

**View changes:**

```bash
git log {fromRef}..{toRef} --oneline
```

**Compare with previous release:**

```bash
/temn-release-notes --from v{previousVersion} --to v{version}
```

**Update changelog:**
Consider appending to CHANGELOG.md if maintaining a cumulative changelog.

````

---

## Output

### Files Created

**Primary Output:**
- `docs/release-notes/RELEASE_NOTES-{version}.md` - Client-facing release notes

**For draft releases:**
- `docs/release-notes/RELEASE_NOTES-draft-{YYYYMMDD}.md`

### Content Structure

The generated release notes include (CLIENT-FACING ONLY):

1. **Release Overview**: Version, date, brief summary
2. **What's New**: Features with user benefits (NO technical details)
3. **Bug Fixes**: Client-visible fixes only (brief list)
4. **Supported Platforms**: Web browsers and device types (simple)
5. **Getting Started**: Brief usage guidance

### Format

- **Markdown**: GitHub-flavored, readable on any platform
- **NO EMOJIS**: Professional, clean text only
- **NO TECHNICAL DETAILS**: Component names, code, file paths removed
- **CLIENT AUDIENCE**: Business users and decision makers
- **USER BENEFITS**: Focus on what users can accomplish
- **SIMPLE LANGUAGE**: Clear, jargon-free communication
- **ACTIONABLE**: Clear guidance on using new features

---

## Examples

### Example 1: Release Between Tags

```bash
$ /temn-release-notes --from v1.0.0 --to v1.1.0
````

**Output:**

```markdown
**Release Notes Generated Successfully**

**Version**: 1.1.0
**Date Range**: 2024-10-01 to 2024-11-04
**Commits Analyzed**: 47

---

## Release Highlights

- Recurring Payments: Automate regular transactions with intelligent scheduling
- Enhanced Account Management: Multi-level hierarchies for complex organizations
- Performance: 40% faster page loads through optimized rendering
- Quality: Average feature score 8.5/10 with 87% test coverage

---

## Summary

**New Features**: 8
**Bug Fixes**: 12
**Improvements**: 6
**Breaking Changes**: 0

---

## Top Features

1. **Recurring Payments**: Users can set up automated recurring payments with step-by-step guidance
2. **Account Hierarchy**: Support for multi-level account organizational structures
3. **Transaction Search**: Advanced filtering and search across all transactions

---

## Quality Metrics

- Average Feature Quality: 8.5/10
- Test Coverage: 87%
- Requirements Delivered: 42/42

---

## Contributors

John Doe (23 commits), Jane Smith (15 commits), Bob Johnson (9 commits)

---

**Detailed Release Notes**: [RELEASE_NOTES-1.1.0.md](RELEASE_NOTES-1.1.0.md)

---

## Next Steps

1. Review the detailed release notes
2. Create git tag: `git tag -a v1.1.0 -m "Release 1.1.0"`
3. Push tag: `git push origin v1.1.0`
4. Share with stakeholders
```

---

### Example 2: Draft Release

```bash
$ /temn-release-notes --draft
```

**Output:**

```markdown
**Draft Release Notes Generated**

**Version**: Unreleased
**Branch**: feature/recurring-payments
**Commits Ahead of Main**: 15

---

## Release Highlights

- Recurring Payments feature implementation (in progress)
- Fixed UWC property binding violations
- Added comprehensive test coverage

---

## Summary

**New Features**: 1
**Bug Fixes**: 3
**Improvements**: 2
**Breaking Changes**: 0

**Status**: 🚧 Work in progress - not ready for release

---

**Detailed Notes**: [RELEASE_NOTES-draft-20251104.md](RELEASE_NOTES-draft-20251104.md)

---

## Next Steps

1. Complete feature development
2. Run verification: `/temn-verify 04-recurring-payments`
3. Generate PR: `/temn-pr`
4. After merge, generate final release notes
```

---

### Example 3: Date Range

```bash
$ /temn-release-notes --since "2024-10-01" --until "2024-10-31"
```

**Output:**

```markdown
**Release Notes Generated for October 2024**

**Date Range**: 2024-10-01 to 2024-10-31
**Commits Analyzed**: 32

---

## Release Highlights

- Diagram generation system for visualizing architecture
- Plan tracking with live implementation updates
- CoreBank transaction manager enhancements

[... rest of output ...]
```

---

## Next Steps

After generating release notes:

### 1. Review and Edit

```bash
# Open generated file for review
code RELEASE_NOTES-{version}.md
```

**Review checklist:**

- ✓ All major features included
- ✓ User benefits clearly stated
- ✓ Breaking changes prominently displayed
- ✓ Quality metrics accurate
- ✓ Contributors complete
- ✓ Links working
- ✓ Tone appropriate for audience

### 2. Create Git Tag

```bash
# Create annotated tag
git tag -a v{version} -m "Release {version}"

# Push tag to remote
git push origin v{version}
```

### 3. Share with Stakeholders

**For different audiences:**

**End Users:**

- Highlight new features and benefits
- Include upgrade instructions
- Link to user documentation

**Product Managers:**

- Emphasize business value
- Show quality metrics
- Highlight competitive advantages

**Technical Teams:**

- Detail technical implementations
- Note breaking changes
- Share migration guides

### 4. Publish Release

**GitHub Release:**

```bash
# Create release on GitHub
gh release create v{version} \
  --title "Release {version}" \
  --notes-file RELEASE_NOTES-{version}.md
```

**Update CHANGELOG.md:**

```bash
# Prepend to existing changelog
cat RELEASE_NOTES-{version}.md CHANGELOG.md > temp
mv temp CHANGELOG.md
git add CHANGELOG.md
git commit -m "docs: update changelog for v{version}"
```

### 5. Verify Release

```bash
# Check tag exists
git tag -l v{version}

# Verify tag points to correct commit
git show v{version}

# Confirm pushed to remote
git ls-remote --tags origin | grep v{version}
```

### 6. Future Releases

**For next release:**

```bash
# Generate notes from this release to next
/temn-release-notes --from v{version} --to v{nextVersion}
```

**Maintain changelog:**

- Keep cumulative CHANGELOG.md updated
- Archive old release notes in `releases/` directory
- Update version in package.json or equivalent

---

## Tips & Best Practices

### Conventional Commits

Ensure team follows conventional commit format:

```
<type>([optional scope]): <description>

[optional body]

[optional footer]
```

**Common types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code change that neither fixes a bug nor adds a feature
- `perf:` - Performance improvement
- `test:` - Adding missing tests
- `chore:` - Maintenance tasks

**Breaking changes:**

```
feat!: redesign API endpoint

BREAKING CHANGE: The /api/v1/users endpoint now returns paginated results.
```

### Semantic Versioning

Follow semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward-compatible)
- **PATCH**: Bug fixes (backward-compatible)

### Frequent Releases

Consider releasing often:

- Smaller releases are easier to document
- Easier for users to adopt incrementally
- Faster feedback cycles
- Reduced risk per release

### Automate in CI/CD

Integrate into workflow:

```yaml
# Example GitHub Actions workflow
- name: Generate Release Notes
  run: claude-code /temn-release-notes --from ${{ github.event.release.tag_name }}
```

---

## Troubleshooting

### No Commits Found

**Problem:** "No commits found in range"

**Solutions:**

1. Verify git tags exist: `git tag -l`
2. Check commit range: `git log {from}..{to}`
3. Ensure references are correct
4. Try with explicit commits instead of tags

### Missing Specifications

**Problem:** "Specifications not found for some features"

**Solutions:**

1. Ensure spec files exist in `.temn/specs/*/spec-*.md`
2. Check file naming convention matches
3. Commits may not map to features (okay for chores/fixes)
4. Agent will use commit messages as fallback

### No Quality Metrics

**Problem:** "Quality analyses not available"

**Solutions:**

1. Run PR analyses before generating notes: `/temn-pr`
2. Run verifications: `/temn-verify {feature}`
3. Quality section will be omitted if data not available
4. Still generates release notes from commits

### Permission Issues

**Problem:** "Cannot write RELEASE_NOTES.md"

**Solutions:**

1. Check file permissions
2. Ensure not in read-only directory
3. Try different output location
4. Close file if open in editor

---

## Configuration

### Output Location

Release notes are stored in the dedicated directory:

**Location:**

```
docs/release-notes/RELEASE_NOTES-{version}.md
```

This keeps client-facing documentation organized and separate from internal development files.

### Version Format

**Semantic Versioning:**

```
v1.2.3
```

**Calendar Versioning (UUX style):**

```
2025.01.0
```

### Date Format

**ISO 8601 (default):**

```
2025-01-15
```

**Other formats:**
Modify in agent prompt.

---

## Related Commands

- `/temn-pr` - Generate pull request description
- `/temn-verify {feature}` - Verify implementation against spec
- `/temn-review` - Code quality review
- `/temn-plan {feature}` - Create development plan

## Need Help?

Run `/help` for general Claude Code assistance or check:

- [Git documentation](https://git-scm.com/docs)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Let's generate those release notes!** 🚀
