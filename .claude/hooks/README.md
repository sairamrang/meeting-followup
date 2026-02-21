# Claude Code Hooks

This directory contains hook scripts that execute automatically at various points in Claude Code's lifecycle.

## Active Hooks

### PostToolUse: Cost Tracker

**File:** `cost-tracker.sh`

**Purpose:** Automatically log command executions for cost tracking

**Triggers:** After any `/temn:*` slash command completes

**What it does:**
1. Captures command name and arguments
2. Records timestamp and session ID
3. Creates entry in `.claude/costs/command-costs.csv` with PENDING cost values
4. Saves metadata to `.claude/costs/.pending/` for later cost association

**Configuration:** See `.claude/settings.local.json` under `hooks.PostToolUse`

## Hook System Overview

Claude Code hooks are shell commands that run automatically at specific lifecycle events:

- **PreToolUse** - Before a tool executes
- **PostToolUse** - After a tool completes successfully ✓ (used for cost tracking)
- **UserPromptSubmit** - When user submits a message
- **Notification** - When Claude sends an alert
- **Stop** - When AI agent finishes its response
- **SessionStart/SessionEnd** - At session boundaries

## How Hooks Receive Data

Hooks receive JSON via stdin containing:

```json
{
  "session_id": "string",
  "tool_name": "SlashCommand",
  "tool_input": {
    "command": "/temn:uux-dev component feature"
  },
  "tool_response": { /* output */ },
  "transcript_path": "path/to/transcript",
  "cwd": "current/working/directory",
  "permission_mode": "default"
}
```

Hooks can parse this with `jq` or other JSON tools.

## How Hooks Return Data

Hooks can optionally return JSON to provide feedback to Claude:

```json
{
  "decision": "allow",
  "additionalContext": "Optional message to Claude"
}
```

Or to block an action:

```json
{
  "decision": "block",
  "reason": "Explanation for why this was blocked"
}
```

## Testing Hooks

To test a hook manually:

**On Windows (PowerShell or Git Bash):**
```bash
# Git Bash or WSL:
echo '{"tool_name":"SlashCommand","tool_input":{"command":"/temn:uux-dev test test"}, "session_id":"test123"}' | bash .claude/hooks/cost-tracker.sh

# PowerShell:
'{"tool_name":"SlashCommand","tool_input":{"command":"/temn:uux-dev test test"}, "session_id":"test123"}' | bash .claude/hooks/cost-tracker.sh

# Check output
cat .claude/costs/command-costs.csv
cat .claude/costs/.pending/*.json
```

**On Mac/Linux:**
```bash
echo '{"tool_name":"SlashCommand","tool_input":{"command":"/temn:uux-dev test test"}, "session_id":"test123"}' | bash .claude/hooks/cost-tracker.sh

# Check output
cat .claude/costs/command-costs.csv
ls .claude/costs/.pending/
```

**Note:** The cost-tracker hook does NOT require `jq`. It uses standard `grep` and `sed` for JSON parsing.

## Debugging

If hooks aren't working:

1. **Restart Claude Code**: Hooks are loaded at startup - restart after adding new hooks
2. **Check permissions**:
   - **Windows**: Scripts should work as-is with Git Bash (no chmod needed)
   - **Mac/Linux**: Ensure script is executable (`chmod +x .claude/hooks/cost-tracker.sh`)
3. **Check configuration**: Verify `settings.local.json` has correct hook config
4. **Test manually**: Run hook script with sample JSON input (see Testing section above)
5. **Check logs**: Look for hook errors in Claude Code output
6. **Verify matcher**: Ensure `matcher` pattern matches your tool name (should be "SlashCommand")
7. **Look for context message**: Hook adds "Command execution logged..." message after commands
8. **Check CSV file**: Verify `.claude/costs/command-costs.csv` has new entries after running commands

**Verify Setup (Cross-Platform):**
```bash
# Check hook file exists
dir .claude\hooks\cost-tracker.sh    # Windows CMD
ls .claude/hooks/cost-tracker.sh     # Git Bash/Mac/Linux

# Check CSV was created
dir .claude\costs\command-costs.csv  # Windows CMD
cat .claude/costs/command-costs.csv  # Git Bash/Mac/Linux

# Check hook configuration
type .claude\settings.local.json     # Windows CMD
cat .claude/settings.local.json      # Git Bash/Mac/Linux
```

**Common Issues:**
- **Path problems**: Use relative path `.claude/hooks/cost-tracker.sh` (works on Windows/Linux/Mac)
- **No jq required**: Script uses basic bash tools only
- **Bash required**: Windows users need Git Bash or WSL (Claude Code uses bash for hooks)
- **Hook timing**: Hooks only fire when Claude Code executes commands, not during manual testing

## Best Practices

- Keep hooks **fast** - they run inline with Claude's operations
- Use **error handling** - exit gracefully on errors
- **Log minimally** - avoid cluttering user experience
- **Test thoroughly** - ensure hooks work in various scenarios
- **Document behavior** - explain what hooks do and why

## See Also

- **Cost tracking system**: [.claude/costs/README.md](../.claude/costs/README.md)
- **Hook configuration**: [.claude/settings.local.json](../.claude/settings.local.json)
- **Claude Code hooks docs**: https://docs.claude.com/en/docs/claude-code/hooks
