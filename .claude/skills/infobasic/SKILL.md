---
name: infobasic
description: Universal InfoBasic (jBASE Basic/jBC) language expert for Temenos T24. Provides core language patterns, control flow, loops, string operations, multi-value fields, and universal coding conventions. Project-specific patterns (AA Framework, TPH Service Layer) are documented in project CLAUDE_*.md files.
---

# InfoBasic Language Skill

Expert guidance for universal InfoBasic (jBASE Basic/jBC) development patterns.

**Note:** This skill documents **universal jBC patterns** applicable across all InfoBasic projects. Project-specific conventions (AA Framework, TPH Service Layer) are documented in separate CLAUDE\_\*.md files in each project.

## Quick Reference

### Universal Naming Conventions

| Type          | Pattern          | Example                          |
| ------------- | ---------------- | -------------------------------- |
| File names    | `FN.<TABLE>`     | `FN.CURRENCY`, `FN.ACCOUNT`      |
| Record reads  | `R.<TABLE>`      | `R.CURRENCY`, `R.ACCOUNT`        |
| Error flags   | `ERR` or `ERROR` | `ERR.READ`, `readError`          |
| Local vars    | `camelCase`      | `transactionRef`, `maxDays`      |
| Constants     | `UPPERCASE`      | `MAX_RETRIES`, `DEFAULT_TIMEOUT` |
| DAS variables | `MY.<NAME>`      | `MY.TABLE`, `MY.FIELDS`          |

### T24 Source File Naming Conventions

**Source Files (Private Implementation):**

- Format: `[PREFIX].[MODULE].[FUNCTION].[CONTEXT].b` (uppercase, dot-separated)
- Examples (AA component):
  - `AA.ACCOUNT.ADJUST.BILL.b`
  - `AA.ACCOUNT.CLOSURE.CHECK.LAST.ACCOUNT.b`
  - `AA.BLOCK.CLOSURE.CROSSVAL.b`
- Naming follows: Component prefix + Module + Action + Context

**Include Files (Public APIs):**

- Format: `I_[PREFIX].[MODULE].[PURPOSE].COMMON` (underscore prefix, no extension)
- Examples (AA component):
  - `I_AA.ACCOUNT.FILES.COMMON` - Field equates
  - `I_AA.ACCOUNT.CLOSURE.FILES.COMMON` - Closure-specific equates
  - `I_AA.PRODUCT.PROPERTY.COMMON` - Property definitions
- Purpose: Share common constants and file definitions

**Conversion Routines (Upgrades):**

- Format: `CONV.[PREFIX].[MODULE].[VERSION].b`
- Examples (AA component):
  - `CONV.AA.BLOCK.CLOSURE.R06.b` - Version R06 upgrade
  - `CONV.AA.ACCOUNT.CLOSED.G16.0.0.b` - Version G16.0.0 upgrade
- Purpose: Handle data/structure migrations between T24 versions

**Note:** Parameter naming conventions and project-specific business logic belong in project CLAUDE\_\*.md files, not in this universal skill.

### $USING vs $INSERT Directives

**$USING** - Import modules/packages (module imports)

```basic
$USING EB.API                    ;* T24 framework API utilities
$USING ST.ExchangeRate           ;* Project service/module
$USING EB.SystemTables           ;* System utilities
```

**Use $USING for:**

- Importing T24 framework modules (EB.API, EB.SystemTables, etc.)
- Importing project service layers and components
- Any module/package imports in FUNCTION routines

**$INSERT** - Include file contents (literal file inclusion)

```basic
$INSERT I_COMMON              ;* System common variables
$INSERT I_EQUATE              ;* Constants and equates
$INSERT I_responseDetails     ;* Response structure
$INSERT I_DAS                 ;* Generic DAS includes
$INSERT I_DAS.<TABLE>         ;* Table-specific DAS
$INSERT I_F.<TABLE>           ;* Field definitions
$INSERT I_<Service>_<Struct>  ;* Service structures
```

**Use $INSERT for:**

- File equates and field definitions (I_F.\*)
- Common variables and constants (I_COMMON, I_EQUATE)
- DAS includes for query building (I_DAS, I_DAS.\*)
- Response/structure definitions
- Any literal file inclusion

**Quick Reference:**

| Use Case         | Directive | Example                  |
| ---------------- | --------- | ------------------------ |
| T24 framework    | $USING    | `$USING EB.API`          |
| Service layer    | $USING    | `$USING ST.ExchangeRate` |
| Field equates    | $INSERT   | `$INSERT I_F.CURRENCY`   |
| Common variables | $INSERT   | `$INSERT I_COMMON`       |
| Constants        | $INSERT   | `$INSERT I_EQUATE`       |
| DAS queries      | $INSERT   | `$INSERT I_DAS`          |

## Detailed References

### Core Language Patterns

- **Code Patterns**: See [references/patterns.md](references/patterns.md) for control flow, loops, BEGIN CASE, conditional logic
- **Function Patterns**: See [references/function-patterns.md](references/function-patterns.md) for FUNCTION vs SUBROUTINE, return patterns
- **String Operations**: See [references/patterns.md](references/patterns.md#string-operations) for concatenation, TRIM, CONVERT, FIELD
- **Multi-Value Fields**: See [references/patterns.md](references/patterns.md#multi-value-field-patterns) for DCOUNT, LOCATE, field access

### Testing & Development

- **Testing Patterns**: See [references/testing-patterns.md](references/testing-patterns.md) for unit test frameworks and patterns
- **Complete Examples**: See [references/complete-examples.md](references/complete-examples.md) for working code examples
- **Build & Deployment**: See [references/build-and-deployment.md](references/build-and-deployment.md) for build processes and deployment

## Key Universal Rules

### Structure Rules (Language Level)

1. **Use GOSUB** for logical code organization
2. **Use BEGIN CASE** for multi-condition branching
3. **Use loops appropriately**: LOOP/WHILE/REPEAT, FOR/NEXT, REMOVE
4. **Keep nesting shallow** - Max 2-3 levels, use early returns for clarity
5. **Return early** on error conditions

### Naming Rules (Language Level)

1. **Use UPPERCASE** for file equates: `FN.CURRENCY`, `AA.STATUS`
2. **Use camelCase** for local processing variables: `transactionRef`, `maxDays`
3. **Use UPPERCASE** for constants: `MAX_RETRIES`, `DEFAULT_DATE`
4. **Avoid magic numbers** - use field equates instead of hard-coded positions
5. **Use descriptive names** - avoid single-letter variables except loop counters

### Error Handling Rules (Language Level)

1. **Always check for errors** after operations (ERR, ERROR variables)
2. **Return early** on error conditions
3. **Initialize variables** before use
4. **Release locks** before returning on error

## T24 File I/O Pattern (Critical for T24)

T24 uses a standardized file I/O pattern for all database operations. This is universal across all T24 projects.

### Standard T24 File Operations

```basic
* Read record
CALL F.READ(FN.ACCOUNT, ACCOUNT.ID, ACCOUNT.REC, F.ACCOUNT, ERR)
IF ERR THEN
    ERROR.MSG = "Cannot read account"
    RETURN
END

* Read for update (locks record)
CALL F.READU(FN.ACCOUNT, ACCOUNT.ID, ACCOUNT.REC, F.ACCOUNT, ERR)
IF ERR THEN
    ERROR.MSG = "Cannot read account for update"
    RETURN
END

* Write record (after F.READU, releases lock)
CALL F.WRITE(FN.ACCOUNT, ACCOUNT.ID, ACCOUNT.REC, F.ACCOUNT)

* Release lock (without writing)
CALL F.RELEASE(FN.ACCOUNT, ACCOUNT.ID)
```

### Key Rules for T24 File I/O

1. **Always use T24 APIs** - Use `CALL F.READ`/`F.READU`, never raw jBC `READ`/`READU`
2. **Always check error variable** - Every read operation returns error status
3. **Use F.READU for updates** - When you plan to modify and write back the record
4. **Release locks on error paths** - Call `F.RELEASE` if you read with lock but won't write
5. **Handle not-found gracefully** - Check error variable before accessing record fields

### File Handle Pattern

```basic
* Define file handles with equates
EQUATE FN.ACCOUNT = "F.ACCOUNT"
EQUATE FN.PAYMENT = "F.PAYMENT"

* Use in operations
CALL F.READ(FN.ACCOUNT, accountId, record, F.ACCOUNT, readError)
CALL F.READU(FN.PAYMENT, paymentId, record, F.PAYMENT, updateError)
```

### Error Handling Example

```basic
* Read with proper error handling
CALL F.READ(FN.ACCOUNT, ACCOUNT.ID, ACCOUNT.REC, F.ACCOUNT, ERR)

IF ERR THEN
    RETURN "ERROR: Cannot read account - " : ERR
END

IF ACCOUNT.REC = '' THEN
    RETURN "ERROR: Account not found"
END

* Process record...
RETURN ''
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Hard-Coded Field Positions vs Using Equates

❌ **WRONG - Hard-coded positions:**

```jbc
currencyRecord = CUSTOMER.RECORD
currencyCode = currencyRecord<2>      ;* What is field 2?
currencyName = currencyRecord<3>      ;* Magic number - unclear
rate = currencyRecord<5>              ;* Will break if record structure changes
```

✓ **CORRECT - Using equates:**

```jbc
$INSERT I_CURRENCY_FIELDS   ;* Includes field equate definitions
currencyRecord = CUSTOMER.RECORD
currencyCode = currencyRecord<CURRENCY.CODE>
currencyName = currencyRecord<CURRENCY.NAME>
rate = currencyRecord<CURRENCY.RATE>
```

**Why:** Equates make code self-documenting and easier to maintain when record structures change.

---

### Anti-Pattern 2: Missing Error Handling After Operations

❌ **WRONG - No error checking:**

```jbc
CALL SomeRoutine(input, output, error)
;* Assume it succeeded - but what if it failed?
result = output * 100
RETURN result
```

✓ **CORRECT - Always check errors:**

```jbc
CALL SomeRoutine(input, output, error)

IF error THEN
    RETURN ''
END

result = output * 100
RETURN result
```

**Why:** Service calls can fail. Always check error variables or return values to detect and handle failures properly.

---

### Anti-Pattern 3: Not Releasing Locks

❌ **WRONG - Lock remains held:**

```jbc
F.READ(F.CURRENCY, record, id, lockError)

IF record = '' THEN
    ;* Record not found - but lock is still held!
    error = 'Record not found'
    RETURN error
END

;* Further processing...
RETURN ''
```

✓ **CORRECT - Always release locks:**

```jbc
F.READ(F.CURRENCY, record, id, lockError)

IF record = '' THEN
    ;* Release lock before returning
    F.RELEASE(F.CURRENCY, id)
    error = 'Record not found'
    RETURN error
END

;* Further processing...

;* Release lock when done
F.RELEASE(F.CURRENCY, id)
RETURN ''
```

**Why:** Unreleased locks block other users and can deadlock the system.

---

### Anti-Pattern 4: Missing Include Files

❌ **WRONG - No include files:**

```jbc
SUBROUTINE PROCESS.DATA(input, output)
    ;* Missing $INSERT I_EQUATE, I_F.TABLE, etc.
    ;* No access to standard equates or field definitions

    value = input<2>  ;* Magic number - what is field 2?
    IF value = '' THEN
        output = 'ERROR'
    END
RETURN
END
```

✓ **CORRECT - Include required files:**

```jbc
SUBROUTINE PROCESS.DATA(input, output)
    $INSERT I_EQUATE               ;* Standard equates
    $INSERT I_F.TABLE              ;* Field definitions

    value = input<TABLE.STATUS>    ;* Self-documenting field access
    IF value = '' THEN
        output = ''
        RETURN
    END

    output = 'SUCCESS'
RETURN
END
```

**Why:** Missing includes lose access to field definitions and equates. Using magic numbers instead of equates is error-prone.

---

### Anti-Pattern 6: Deep Nesting vs Early Returns

❌ **WRONG - Deep nesting (hard to follow):**

```jbc
IF param1 THEN
    IF param2 THEN
        IF param3 THEN
            IF param4 THEN
                ;* Finally at level 4 - what are we doing here?
                result = doSomething()
            END ELSE
                error = 'param4 missing'
            END
        END ELSE
            error = 'param3 missing'
        END
    END ELSE
        error = 'param2 missing'
    END
END ELSE
    error = 'param1 missing'
END
```

✓ **CORRECT - Early returns (clear and readable):**

```jbc
;* Validate and return early on errors
IF NOT param1 THEN
    error = 'param1 missing'
    RETURN error
END

IF NOT param2 THEN
    error = 'param2 missing'
    RETURN error
END

IF NOT param3 THEN
    error = 'param3 missing'
    RETURN error
END

IF NOT param4 THEN
    error = 'param4 missing'
    RETURN error
END

;* All validations passed - do the actual work at top level
result = doSomething()
RETURN result
```

**Why:** Early returns make logic easier to follow and reduce cognitive load. Max nesting should be 2-3 levels.
