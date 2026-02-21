# CLAUDE_AA.md

This file provides guidance to Claude Code when working with T24 Arrangement Architecture (AA) framework code.

**Location:** This file is part of the AA project in `C:\dev\transact\aa\CLAUDE_AA.md`

## AA Framework Overview

- **Platform:** Temenos T24 Transact - Arrangement Architecture Module
- **Language:** InfoBasic (jBC) - Framework Layer
- **Architecture:** Property class-based, activity lifecycle processing
- **Framework:** AA.Framework (core T24 banking framework)
- **Components:** 75+ specialized modules (AA_Account, AA_Interest, AA_Settlement, etc.)

---

## AA-Specific Patterns

### COMMON Block Usage

AA Framework routines operate within T24 activity processing and use **COMMON blocks** instead of explicit parameters. Data is accessed through T24's shared context rather than function parameters.

```basic
SUBROUTINE AA.ACCOUNT.ADJUST.BILL
    * No explicit parameters - data from COMMON blocks
    * Context automatically available from AA.Framework accessors

    GOSUB SET.ACTIVITY.DETAILS
    GOSUB INITIALISE
    GOSUB PROCESS.ACTION

    IF RET.ERROR THEN
        GOSUB HANDLE.ERROR
    END

    GOSUB UPDATE.LOG
RETURN
END
```

**Why:** AA Framework operates within T24's activity transaction boundary. COMMON blocks provide efficient access to shared context without parameter passing overhead.

### AA.Framework Accessor Methods

AA routines access framework context through standardized accessor methods:

```basic
* Get activity status
R.ACTIVITY.STATUS = AA.Framework.getC_arractivitystatus()["-",1,1]
R.ACTIVITY.FULL.STATUS = AA.Framework.getC_arractivitystatus()

* Get activity details
ARR.ACTIVITY.ID = AA.Framework.getC_arractivityid()
R.ACTIVITY = AA.Framework.getC_arractivityrec()
ACTIVITY.ACTION = AA.Framework.getCurrAction()

* Get arrangement details
ARRANGEMENT.ID = AA.Framework.getArrId()
R.ARR = AA.Framework.getRArrangement()

* Get effective date
EFFECTIVE.DATE = AA.Framework.getActivityEffDate()

* Get balance prefix
BAL.PREFIX = AA.Framework.getBalancePrefix(productLine)
```

**Common Accessors:**

- `getC_arractivitystatus()` - Activity status (UNAUTH/AUTH/REVERSE/DELETE)
- `getC_arractivityid()` - Activity identifier
- `getC_arractivityrec()` - Activity record
- `getCurrAction()` - Current action (CREATE/MODIFY/AUTHORIZE/REVERSE)
- `getArrId()` - Arrangement contract ID
- `getRArrangement()` - Arrangement record
- `getActivityEffDate()` - Activity effective date

### Activity Lifecycle Processing

AA routines must handle different activity **statuses** throughout the arrangement lifecycle:

```basic
SET.ACTIVITY.DETAILS:
    R.ACTIVITY.STATUS = AA.Framework.getC_arractivitystatus()["-",1,1]
    ARR.ACTIVITY.ID = AA.Framework.getC_arractivityid()
    R.ACTIVITY = AA.Framework.getC_arractivityrec()
    ACTIVITY.ACTION = AA.Framework.getCurrAction()
    EFFECTIVE.DATE = AA.Framework.getActivityEffDate()
    RETURN

INITIALISE:
    F.ACCOUNT = ""
    F.AC.PROPERTY.CLASS = ''
    RETURN.ERROR = ""
    RETURN

PROCESS.ACTION:
    BEGIN CASE
        CASE R.ACTIVITY.STATUS = "UNAUTH"
            GOSUB PROCESS.INPUT.ACTION

        CASE R.ACTIVITY.STATUS = 'DELETE'
            GOSUB PROCESS.DELETE.ACTION

        CASE R.ACTIVITY.STATUS = 'AUTH'
            GOSUB PROCESS.AUTHORISE.ACTION

        CASE R.ACTIVITY.STATUS = 'REVERSE'
            GOSUB PROCESS.REVERSE.ACTION

        CASE OTHERWISE
            RETURN.ERROR = "Unknown activity status: " : R.ACTIVITY.STATUS
    END CASE
    RETURN

UPDATE.LOG:
    CALL AA.Framework.LogManager("Action completed", ACTIVITY.ACTION)
    RETURN
```

**Activity Statuses:**

- **UNAUTH** - Unauthorized (input stage, user-entered data)
- **DELETE** - Deletion request (remove/cancel the activity)
- **AUTH** - Authorization (system processing, validate and execute)
- **REVERSE** - Reversal (undo a previous activity)

### AA Error Handling Patterns

AA Framework uses simple error flags and ETEXT for error handling:

```basic
INITIALISE:
    RETURN.ERROR = ""       ;* Simple error flag
    RET.ERROR = ""
    ETEXT = ""              ;* T24 framework error variable
    RETURN

PROCESS.ACTION:
    GOSUB VALIDATE.INPUT
    IF RET.ERROR THEN
        GOSUB HANDLE.ERROR
        RETURN
    END

    GOSUB EXECUTE.LOGIC
    RETURN

VALIDATE.INPUT:
    IF ARRANGEMENT.ID = '' THEN
        RET.ERROR = 'Y'
        RETURN.ERROR = 'Arrangement ID required'
        RETURN
    END

    IF EFFECTIVE.DATE = '' THEN
        RET.ERROR = 'Y'
        RETURN.ERROR = 'Effective date required'
        RETURN
    END
    RETURN

HANDLE.ERROR:
    CALL AA.Framework.LogManager("Error", RETURN.ERROR)
    * Additional error handling
    RETURN
```

**Error Variables:**

- `RET.ERROR` - Error flag (Y/N)
- `RETURN.ERROR` - Error message
- `ETEXT` - T24 framework error (from service calls)

### Property Class Action Patterns

AA components define action routines for property classes. Each action processes activities on that property:

```basic
* Example: AA.ACCOUNT.ADJUST.BILL
* File: Source/Private/AA.ACCOUNT.ADJUST.BILL.b
* Purpose: Adjust account bill amounts (from Account property class)

SUBROUTINE AA.ACCOUNT.ADJUST.BILL
    GOSUB SET.ACTIVITY.DETAILS
    GOSUB INITIALISE
    GOSUB PROCESS.ACTION

    IF RET.ERROR AND NOT(PROCESS.ERROR) THEN
        GOSUB HANDLE.ERROR
    END

    GOSUB UPDATE.LOG
RETURN
END

PROCESS.ACTION:
    BEGIN CASE
        CASE R.ACTIVITY.STATUS = "UNAUTH"
            GOSUB GET.ADJUSTMENT.DETAILS

        CASE R.ACTIVITY.STATUS = 'AUTH'
            GOSUB VALIDATE.BILL.STATE
            IF NOT(RET.ERROR) THEN
                GOSUB ADJUST.BILL.AMOUNT
                GOSUB RAISE.ACCOUNTING.ENTRIES
            END

        CASE R.ACTIVITY.STATUS = 'REVERSE'
            GOSUB REVERSE.ADJUSTMENT
    END CASE
    RETURN
```

**Naming Convention:**

- Format: `AA.[PROPERTY.CLASS].[ACTION].[CONTEXT].b`
- Examples: `AA.ACCOUNT.ADJUST.BILL.b`, `AA.INTEREST.CALCULATE.ACCRUAL.b`

### AA Accounting Entry Patterns

AA routines raise accounting entries to reflect banking transactions:

```basic
RAISE.ACCOUNTING.ENTRIES:
    * Debit due balance
    ACCT.DEBIT = BILL.AMOUNT
    ACCT.CREDIT.ACCOUNT = AC.ALLOCATION.RULE

    GOSUB BUILD.ACCOUNTING.ENTRY

    * Write accounting entry
    CALL AA.Accounting.Manager.CreateEntry(ACCT.ENTRY, acctError)

    IF acctError THEN
        RET.ERROR = 'Y'
        RETURN.ERROR = 'Failed to create accounting entry: ' : acctError
    END

    RETURN
```

### Bill Management Patterns

AA includes comprehensive bill lifecycle management:

```basic
* Bill statuses
EQUATE BILL.DUE = 'DUE'
EQUATE BILL.OVERDUE = 'OVERDUE'
EQUATE BILL.PAID = 'PAID'
EQUATE BILL.WAIVED = 'WAIVED'

GET.BILL.DETAILS:
    BILL.RECORD = R.ACCOUNT<AA.BILLS, bill.index>
    BILL.AMOUNT = BILL.RECORD<AA.BILL.AMOUNT>
    BILL.STATUS = BILL.RECORD<AA.BILL.STATUS>
    BILL.DUE.DATE = BILL.RECORD<AA.BILL.DUE.DATE>
    RETURN

AGE.BILLS:
    * Move bills to overdue status if past due date
    FOR bill.idx = 1 TO DCOUNT(R.ACCOUNT<AA.BILLS>, @VM)
        BILL.REC = R.ACCOUNT<AA.BILLS, bill.idx>
        BILL.DUE = BILL.REC<AA.BILL.DUE.DATE>

        IF BILL.DUE < EFFECTIVE.DATE THEN
            BILL.REC<AA.BILL.STATUS> = BILL.OVERDUE
            R.ACCOUNT<AA.BILLS, bill.idx> = BILL.REC
        END
    NEXT bill.idx
    RETURN
```

---

## AA Best Practices

### Core Rules

1. **Always use AA.Framework accessors** for context data - Don't access COMMON blocks directly
2. **Handle all activity statuses** (UNAUTH/AUTH/REVERSE/DELETE) explicitly
3. **Use COMMON blocks** for shared data within activity processing
4. **Check RET.ERROR and ETEXT** after operations and return early on errors
5. **Follow activity lifecycle** - SET.ACTIVITY.DETAILS → INITIALISE → PROCESS → UPDATE.LOG

### Coding Patterns

6. **Use GOSUB sections** - Not inline code blocks
7. **Initialize variables** - Set to empty string in INITIALISE section
8. **Use $USING** for module imports (AA.Framework, AC._, EB._)
9. **Use $INSERT** for include files (I_F.\*, field equates)
10. **Log important operations** - Use AA.Framework.LogManager for audit trail

### Error Handling

11. **Set RET.ERROR** - Y/N flag for error conditions
12. **Set RETURN.ERROR** - Descriptive error message
13. **Check ETEXT** - Framework error from service calls
14. **Release locks** - Before returning on error (implicit in AA Framework)
15. **Return early** - On any error condition

### Data Access

16. **Use AA.Framework methods** - For reading/writing arrangement data
17. **Reference I_F.\* equates** - For field access (not magic numbers)
18. **Use multi-value access** - For bills, rates, schedules: `RECORD<field, value, subvalue>`
19. **Validate data** - Before processing
20. **Maintain referential integrity** - Between arrangement and related records

---

## Field Equate Conventions

AA uses extensive field equates to avoid magic numbers:

```basic
$INSERT I_F.AA.ACCOUNT    ;* Field equates for AA.ACCOUNT

* Access using equates
accountId = R.ACCOUNT<AA.AC.ACCOUNT.REFERENCE>
currency = R.ACCOUNT<AA.AC.CURRENCY>
status = R.ACCOUNT<AA.AC.RECORD.STATUS>

* Not like this (avoid magic numbers)
* accountId = R.ACCOUNT<27>   ;* Wrong - unclear what field 27 is
* currency = R.ACCOUNT<4>     ;* Wrong - easy to break if structure changes
```

---

## Component Structure

```
AA_ComponentName/
├── Source/
│   ├── Private/                    ;* Implementation files
│   │   ├── AA.MODULE.ACTION.b      ;* Action routines
│   │   ├── AA.MODULE.VALIDATE.b    ;* Validation routines
│   │   ├── AA.MODULE.FIELDS.b      ;* Field definition routine
│   │   └── ...
│   │
│   └── Public/                     ;* Interfaces
│       ├── I_F.AA.MODULE           ;* Field equates (no extension)
│       ├── I_AA.MODULE.FILES       ;* File handle equates
│       └── CONV.AA.MODULE.*.b      ;* Conversion/upgrade routines
│
├── Test/
│   └── UnitTests/                  ;* Unit test files (.tut)
│
├── Definition/
│   └── AA.ComponentName.component  ;* T24 component metadata
│
└── build.xml                       ;* Ant build configuration
```

---

## Common File Operations in AA

### Reading Arrangement Records

```basic
* Read account record (typically within activity processing)
GOSUB SET.ACTIVITY.DETAILS  ;* Get context
ARRANGEMENT.ID = AA.Framework.getArrId()

* Account record is provided by AA Framework
R.ACCOUNT = AA.Framework.getC_arractivityrec()  ;* From context

* Access fields using equates
ACCOUNT.BALANCE = R.ACCOUNT<AA.AC.BALANCE>
ACCOUNT.CURRENCY = R.ACCOUNT<AA.AC.CURRENCY>
```

### Writing Changes (Implicit in Framework)

```basic
* AA Framework handles writing changes
* Modifications to R.ACCOUNT are tracked
* Accounting entries trigger balance updates
* Framework handles locks and commits
```

### Multi-Value Access (Bills, Rates, etc.)

```basic
* Get count of bills
billCount = DCOUNT(R.ACCOUNT<AA.BILLS>, @FM)

* Access specific bill
billIndex = 1
BILL.REC = R.ACCOUNT<AA.BILLS, billIndex>
BILL.AMOUNT = BILL.REC<AA.BILL.AMOUNT>
BILL.STATUS = BILL.REC<AA.BILL.STATUS>

* Iterate through bills
FOR idx = 1 TO billCount
    BILL = R.ACCOUNT<AA.BILLS, idx>
    GOSUB PROCESS.BILL
NEXT idx
```

---

## Reference

- **Generic jBC patterns:** See [InfoBasic Skill](../../../../.claude/skills/infobasic/SKILL.md) for control flow, loops, strings, multi-value fields
- **TPH Service Layer patterns:** See [CLAUDE_TPH.md](./CLAUDE_TPH.md) for payment processing service layer
- **Project structure:** See [CLAUDE.md](../../../../CLAUDE.md) for repository organization and build procedures
- **T24 InfoBasic stack:** See [current-infobasic-stack.md](./current-infobasic-stack.md) for T24 patterns and tech stack overview
- **Existing components:** Study AA_Account, AA_Interest, AA_Settlement for examples
