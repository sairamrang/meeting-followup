# Cost Tracking Setup for Windows

Quick reference for setting up and verifying cost tracking on Windows.

## Prerequisites

✅ **Git Bash** - Already installed (included with Git for Windows)
✅ **Claude Code** - Running on Windows with Git Bash available

## How Claude Code Uses Bash on Windows

**Important:** Claude Code on Windows automatically uses Git Bash (or configured bash) to execute hook scripts.

- Claude Code detects Git Bash via environment variable `CLAUDE_CODE_GIT_BASH_PATH`
- Default location: `C:\Program Files\git\bin\bash.exe`
- Hooks scripts run in bash environment even though you're on Windows
- This is why our `.sh` script with bash shebang (`#!/bin/bash`) works natively

**You don't need WSL** - Git Bash is sufficient for hook scripts!

## Current Status

✅ Hook script created: `.claude/hooks/cost-tracker.sh`
✅ Hook configured: `.claude/settings.local.json`
✅ CSV file initialized: `.claude/costs/command-costs.csv`
✅ No additional dependencies needed (no jq required)

## How to Verify It Works

### Step 1: Test the Hook Manually

Open Git Bash (or use Claude Code's terminal) and run:

```bash
echo '{"tool_name":"SlashCommand","tool_input":{"command":"/temn:uux-dev test test"}, "session_id":"test123"}' | bash .claude/hooks/cost-tracker.sh
```

**Expected output:**
```json
{
  "decision": "allow",
  "additionalContext": "Command execution logged. Run /cost to see session costs, then use /temn:log-costs to update the CSV with cost data."
}
```

### Step 2: Check Files Were Created

```bash
# Check CSV has entry
cat .claude/costs/command-costs.csv

# Check pending metadata
cat .claude/costs/.pending/*.json
```

**Expected:** CSV should have a row with "test-component test-feature" and PENDING costs

### Step 3: Restart Claude Code

**Important:** Hooks are loaded when Claude Code starts. You must restart for new hooks to activate.

1. Close Claude Code completely
2. Reopen Claude Code
3. Navigate to your project

### Step 4: Run a Real Command

Try any `/temn:*` command, for example:

```
/temn:uux-dev my-component my-feature
```

**Look for:** Message saying "Command execution logged. Run /cost..."

### Step 5: Verify CSV Updated

```bash
cat .claude/costs/command-costs.csv
```

Should see a new row with your actual command.

## Windows-Specific Notes

### Git Bash vs PowerShell vs CMD

- **Git Bash** ✅ - Hook scripts work natively (recommended)
- **PowerShell** ⚠️ - Hook scripts run via bash, need Git Bash installed
- **CMD** ❌ - Does not support bash scripts directly

**Claude Code on Windows uses Git Bash** for running hook scripts automatically.

### File Paths

Windows paths work fine:
- ✅ `c:\Users\...\ai-uux-sample\.claude\hooks\cost-tracker.sh`
- ✅ Relative path: `.claude/hooks/cost-tracker.sh` (used in config)
- ✅ Forward slashes work in Git Bash: `.claude/hooks/cost-tracker.sh`

### Line Endings

The hook script uses Unix line endings (LF). Git Bash handles this automatically.

If you edit the file in Windows Notepad, it may convert to CRLF. Use:
- VS Code (preserves LF)
- Git Bash vi/nano
- Notepad++ with Unix mode

## Troubleshooting

### Hook Doesn't Fire

1. ✅ **Restart Claude Code** - Most common issue
2. Check hook is registered:
   ```bash
   cat .claude/settings.local.json | grep -A 10 "hooks"
   ```
3. Verify bash is available:
   ```bash
   bash --version
   ```
4. Check Claude Code can find Git Bash:
   ```bash
   # Check if environment variable is set
   echo $CLAUDE_CODE_GIT_BASH_PATH
   # or on Windows PowerShell:
   # $env:CLAUDE_CODE_GIT_BASH_PATH
   ```

### Spaces in Project Path (Known Issue)

⚠️ **Known Claude Code bug**: Hooks fail if your project path contains spaces (e.g., `C:\My Projects\ai-uux-sample`).

**Your project path:**
```
c:\Users\daguirre\OneDrive - Temenos\Documents\AI\ai-uux-sample
```

✅ **Has space in "OneDrive - Temenos"** - This may cause hook execution issues!

**Workarounds:**
1. **Use symbolic link** without spaces:
   ```cmd
   mklink /D C:\projects\ai-uux-sample "c:\Users\daguirre\OneDrive - Temenos\Documents\AI\ai-uux-sample"
   cd C:\projects\ai-uux-sample
   ```
2. **Clone to path without spaces** (if using git)
3. **Wait for Claude Code fix** (Issue #5648 on GitHub)

**To test if this affects you:**
- Run manual hook test (Step 1 above)
- If that works but automatic hooks don't fire, path spaces are likely the issue

### CSV Not Created

1. Test hook manually (see Step 1 above)
2. Check for errors:
   ```bash
   echo '{"tool_name":"SlashCommand","tool_input":{"command":"/temn:uux-dev test test"}, "session_id":"test123"}' | bash .claude/hooks/cost-tracker.sh 2>&1
   ```

### "No Such File or Directory"

Check working directory:
```bash
pwd
# Should be in project root (ai-uux-sample)

ls .claude/hooks/cost-tracker.sh
# Should show the file
```

### Date Command Issues

The hook uses `date -u` which should work in Git Bash. If issues occur:
```bash
date -u +"%Y-%m-%dT%H:%M:%SZ"
# Should output: 2025-10-31T18:30:00Z
```

## Quick Commands Reference

```bash
# View CSV
cat .claude/costs/command-costs.csv

# View pending entries
ls .claude/costs/.pending/
cat .claude/costs/.pending/*.json

# Count tracked commands
wc -l .claude/costs/command-costs.csv

# View latest entry
tail -1 .claude/costs/command-costs.csv

# Clear test data (start fresh)
rm .claude/costs/command-costs.csv
rm .claude/costs/.pending/*.json
```

## Next Steps

1. ✅ Hook is set up and tested
2. ✅ Restart Claude Code to activate
3. ✅ Run `/temn:*` commands - they'll be logged automatically
4. 📊 Run `/cost` to see session costs
5. 💾 Run `/temn:log-costs` to fill in actual cost data

## Architecture Summary

```
┌─────────────────────────────────────────┐
│  User runs: /temn:uux-dev component     │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  Claude Code executes slash command     │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  PostToolUse hook fires (automatic)     │
│  Runs: .claude/hooks/cost-tracker.sh    │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  Hook logs to CSV with PENDING costs    │
│  Creates .pending/*.json metadata       │
└────────────────┬────────────────────────┘
                 │
                 v
┌─────────────────────────────────────────┐
│  User runs /cost (manual)               │
│  User runs /temn:log-costs (manual)     │
│  CSV updated with real cost data        │
└─────────────────────────────────────────┘
```

The system is fully Windows-compatible using Git Bash! 🎉
