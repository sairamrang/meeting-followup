#!/bin/bash
# Cost Tracker PostToolUse Hook
# Automatically logs command executions for cost tracking
# Triggered after SlashCommand tool completes
# Note: Uses basic text parsing instead of jq for broader compatibility

# Read JSON input from stdin
INPUT=$(cat)

# Extract relevant fields using grep and sed (no jq dependency)
TOOL_NAME=$(echo "$INPUT" | grep -o '"tool_name"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"tool_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | head -1)
COMMAND=$(echo "$INPUT" | grep -o '"command"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"command"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | head -1)
SESSION_ID=$(echo "$INPUT" | grep -o '"session_id"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"session_id"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/' | head -1)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Fallback values if extraction failed
[ -z "$TOOL_NAME" ] && TOOL_NAME="unknown"
[ -z "$COMMAND" ] && COMMAND="N/A"
[ -z "$SESSION_ID" ] && SESSION_ID="unknown"

# Only process SlashCommand tools (our custom commands)
if [ "$TOOL_NAME" != "SlashCommand" ]; then
  exit 0
fi

# Only process temn: namespace commands
if [[ ! "$COMMAND" =~ ^/temn: ]]; then
  exit 0
fi

# Extract command name and arguments
COMMAND_NAME=$(echo "$COMMAND" | sed 's|^/temn:||' | cut -d' ' -f1)
ARGUMENTS=$(echo "$COMMAND" | cut -d' ' -f2- | sed 's/"//g')

# Skip the log-costs command itself to avoid recursion
if [ "$COMMAND_NAME" = "log-costs" ]; then
  exit 0
fi

# Ensure CSV exists with headers
CSV_FILE=".claude/costs/command-costs.csv"
if [ ! -f "$CSV_FILE" ]; then
  echo "timestamp,command,arguments,status,agents_used,total_cost_usd,duration_api_sec,duration_wall_sec,code_lines_added,code_lines_removed,haiku_input,haiku_output,haiku_cache_read,haiku_cache_write,haiku_cost,sonnet_input,sonnet_output,sonnet_cache_read,sonnet_cache_write,sonnet_cost,opus_input,opus_output,opus_cache_read,opus_cache_write,opus_cost" > "$CSV_FILE"
fi

# Create pending entry file for later cost association
PENDING_DIR=".claude/costs/.pending"
mkdir -p "$PENDING_DIR"
PENDING_FILE="$PENDING_DIR/${TIMESTAMP//[:]/-}.json"

# Store command metadata for later cost entry
cat > "$PENDING_FILE" <<EOF
{
  "timestamp": "$TIMESTAMP",
  "command": "$COMMAND_NAME",
  "arguments": "$ARGUMENTS",
  "session_id": "$SESSION_ID",
  "status": "completed"
}
EOF

# Append placeholder entry to CSV (costs will be filled by log-costs command)
echo "$TIMESTAMP,$COMMAND_NAME,\"$ARGUMENTS\",completed,PENDING,PENDING,PENDING,PENDING,0,0,0,0,0,0,0.0000,0,0,0,0,0.0000,0,0,0,0,0.0000" >> "$CSV_FILE"

# Return JSON to provide context to Claude
cat <<EOF
{
  "decision": "allow",
  "additionalContext": "Command execution logged. Run /cost to see session costs, then use /temn:log-costs to update the CSV with cost data."
}
EOF
