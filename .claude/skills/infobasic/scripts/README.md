# InfoBasic Code Validator

A Python script that validates T24 InfoBasic (.b) files against naming conventions, structure rules, and anti-patterns defined in the infobasic skill.

## Usage

```bash
python validate_infobasic.py <file.b>
python validate_infobasic.py <directory>
python validate_infobasic.py <file.b> --strict
```

### Options

- `--strict` - Enable stricter validation rules (recommended for production code)

## Validation Rules

The validator checks your code against:

### Naming Conventions (N###)

- **N001**: Parameter naming - Should use `i<Name>`, `o<Name>`, or `io<Name>` prefixes
- **N002**: Variable naming - Local variables should use camelCase

### Structure Rules (S###)

- **S001**: Must define SUBROUTINE or FUNCTION
- **S002**: SUBROUTINE should use three-phase structure (initialise → process → finalise)
- **S003**: Must end with END statement

### Include Files (I###)

- **I001**: FUNCTION should include $USING directives
- **I002**: Consider adding $INSERT directives for common variables
- **I003**: $USING module names should be UPPERCASE with dots

### Error Handling (E###)

- **E001**: Service calls should check for errors afterwards
- **E002**: Response objects should set serviceName field

### Anti-Patterns (A###)

- **A001**: Hard-coded field positions (e.g., `record<2>`) - Use field equates instead
- **A003**: Unreleased file locks - Ensure F.RELEASE is called
- **A004**: Raw jBC file I/O - Use T24 framework APIs (EB.API, DAS layer)
- **A006**: Deep nesting - Max nesting depth should be 3 levels

## Examples

### Single File Validation

```bash
python validate_infobasic.py mycode.b
```

Output:

```
======================================================================
FILE: mycode.b
======================================================================

[ERROR] Line 28 (A004): Using raw jBC file I/O instead of T24 framework APIs
  Code: OPEN 'F.CURRENCY' TO F.CURRENCY ELSE
  Suggestion: Use framework services (EB.API, DAS layer) instead

======================================================================
SUMMARY: 1 file(s) checked
  Errors:   1
  Warnings: 0
```

### Directory Validation

```bash
python validate_infobasic.py ~/transact/source
```

Validates all `.b` files in the directory and subdirectories.

### Strict Mode

```bash
python validate_infobasic.py mycode.b --strict
```

Enables additional checks for:

- Missing SUBROUTINE structure
- Missing $USING directives
- Missing $INSERT directives
- Missing error handling
- Deep nesting

## Exit Codes

- `0` - No errors found (warnings and info messages don't affect exit code)
- `1` - Errors were found (or validation failed)

## What Gets Validated

1. **Parameter Naming** - Check function/subroutine parameters use correct prefixes
2. **Variable Naming** - Check local variables follow naming conventions
3. **Structure** - Check for proper SUBROUTINE/FUNCTION definition and END statement
4. **Include Files** - Check for required $USING and $INSERT directives
5. **Error Handling** - Check for ETEXT checks after service calls
6. **Anti-Patterns** - Check for common mistakes like hard-coded positions, unreleased locks

## Severity Levels

- **ERROR** (Red) - Critical issues that must be fixed
- **WARNING** (Yellow) - Important issues that should be fixed
- **INFO** (Blue) - Recommendations and suggestions

## Tips for Clean Code

1. **Always use parameter prefixes** - Makes it immediately clear what's input vs output
2. **Check errors after service calls** - Prevent silent failures
3. **Use field equates** - Makes code more maintainable and self-documenting
4. **Use T24 APIs** - Ensures auditing, security, and multi-tenancy support
5. **Keep nesting shallow** - Use early returns instead of deep IF nesting
6. **Release file locks** - Always pair F.READ with F.RELEASE to prevent deadlocks

## Integration with CI/CD

Use in build pipelines:

```bash
#!/bin/bash
python validate_infobasic.py ./source --strict
if [ $? -ne 0 ]; then
    echo "Code validation failed"
    exit 1
fi
```

## Requirements

- Python 3.6+
- No external dependencies (uses only standard library)
