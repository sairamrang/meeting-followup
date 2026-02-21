# EB.API Framework Patterns

## Overview

The EB.API framework provides T24-standard utilities for parameter validation, error handling, and system table access. These framework utilities are essential for building API layer routines that integrate properly with T24's error handling and reporting systems.

**Core EB.API Services:**

- `EB.API.checkEmptyParameters` - Validate required parameters
- `EB.API.setException` - Report errors to caller
- `EB.SystemTables.getEtext` - Check for service layer errors

---

## EB.API.checkEmptyParameters

### Purpose

Validates that required input parameters are not empty. If validation fails, returns which parameters were empty.

### Syntax

```jbc
EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)
```

### Parameters

| Parameter         | Type        | Direction | Description                                               |
| ----------------- | ----------- | --------- | --------------------------------------------------------- |
| `parameterNames`  | multi-value | Input     | Field-marked list of parameter names (for error messages) |
| `parameterValues` | multi-value | Input     | Field-marked list of parameter values to validate         |
| `emptyParameters` | variable    | Output    | Field-marked list of parameter names that were empty      |

### Return Behavior

- **Output in emptyParameters:** If any parameters are empty, emptyParameters contains field-marked list of those parameter names
- **No Return Value:** Does not return a value itself; sets the emptyParameters output

### Usage Pattern

```jbc
FUNCTION ST.PROCESS.DATA(currencyCode, amount, effectiveDate)
    $USING EB.API

    result = ''

    ;* Build parameter lists using @FM (field mark)
    parameterNames = 'currencyCode':@FM:'amount':@FM:'effectiveDate'
    parameterValues = currencyCode:@FM:amount:@FM:effectiveDate

    ;* Validate parameters
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    ;* Check if any parameters were empty
    IF emptyParameters THEN
        ;* emptyParameters now contains field-marked list of empty param names
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        ;* All parameters present - safe to proceed
        GOSUB PROCESS
    END

RETURN result

PROCESS:
    ;* Process using validated parameters
RETURN
END
```

### Real Example

From ST.CALCULATE.EXCHANGE.RATE:

```jbc
parameterNames = 'localAmount':@FM:'dealCurrency':@FM:'dealAmount'
parameterValues = localAmount:@FM:dealCurrency:@FM:dealAmount
EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

IF emptyParameters THEN
    ;* emptyParameters might be:
    ;*   'dealCurrency'           (if only dealCurrency was empty)
    ;*   'localAmount'^'amount'   (if both localAmount and amount were empty)
    ebErrorParam = 'EB-EMPTY.PARAMETER'
    ebErrorParam<-1> = emptyParameters
    EB.API.setException(ebErrorParam)
END
```

### Key Points

- Use @FM (field mark) to delimit parameter names and values
- Parameter names should be descriptive (used in error messages)
- Order of parameter names must match order of parameter values
- Always check emptyParameters immediately after calling
- If ANY parameter is empty, the entire emptyParameters field will be populated

---

## EB.API.setException

### Purpose

Reports an error to the API caller. Sets an exception that the caller's error handler can detect and process.

### Syntax

```jbc
EB.API.setException(errorParameter)
```

### Parameters

| Parameter        | Type        | Direction | Description                                 |
| ---------------- | ----------- | --------- | ------------------------------------------- |
| `errorParameter` | multi-value | Input     | Error structure with error code and details |

### Error Structure

The errorParameter is a multi-value field:

```jbc
errorParameter<1>      ;* Error code (e.g., 'EB-EMPTY.PARAMETER', 'EB-INVALID.VALUE')
errorParameter<-1>     ;* Error details/additional information
```

### Standard Error Codes

| Error Code                  | Meaning                           | Use When                         |
| --------------------------- | --------------------------------- | -------------------------------- |
| `EB-EMPTY.PARAMETER`        | Required parameter is missing     | Parameter validation fails       |
| `EB-INVALID.VALUE`          | Parameter value is invalid format | Business rule validation fails   |
| `EB-INTERNAL.ERROR`         | Service layer returned error      | Service call fails (check ETEXT) |
| `EB-RECORD.NOT.FOUND`       | Required record doesn't exist     | Database lookup fails            |
| `EB-PERMISSION.DENIED`      | User lacks required permission    | Authorization check fails        |
| `EB-BUSINESS.RULE.VIOLATED` | Business rule constraint failed   | Business validation fails        |

### Usage Pattern 1: Parameter Validation Error

```jbc
FUNCTION ST.VALIDATE.AMOUNT(amount, currency)
    $USING EB.API

    result = ''

    parameterNames = 'amount':@FM:'currency'
    parameterValues = amount:@FM:currency
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ;* Simple error response - just code and empty parameters
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB VALIDATE
    END

RETURN result

VALIDATE:
    ;* Validate amount is positive
    IF amount <= 0 THEN
        ;* Business rule violation - set detailed error
        ebErrorParam = 'EB-INVALID.VALUE'
        ebErrorParam<-1> = 'Amount must be greater than zero'
        EB.API.setException(ebErrorParam)
    END ELSE
        result = 'VALID'
    END
RETURN
END
```

### Usage Pattern 2: Service Layer Error

```jbc
FUNCTION ST.GET.CURRENCY.RATE(currencyCode, exchangeDate)
    $USING EB.API
    $USING ST.RateService
    $USING EB.SystemTables

    exchangeRate = ''

    ;* Parameter validation
    parameterNames = 'currencyCode':@FM:'exchangeDate'
    parameterValues = currencyCode:@FM:exchangeDate
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN exchangeRate

PROCESS:
    ;* Call service layer
    ST.RateService.GetRate(currencyCode, exchangeDate, exchangeRate)

    ;* Check for service layer errors
    serviceError = EB.SystemTables.getEtext()
    IF serviceError THEN
        ;* Service returned error - report it
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = serviceError
        EB.API.setException(ebErrorParam)
        exchangeRate = ''
    END
RETURN
END
```

### Usage Pattern 3: Database Record Not Found

```jbc
FUNCTION ST.READ.CURRENCY(currencyCode)
    $USING EB.API
    $USING EB.SystemTables

    currencyRecord = ''

    parameterNames = 'currencyCode'
    parameterValues = currencyCode
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN currencyRecord

PROCESS:
    ;* Attempt to read currency record
    CALL OPF('F.CURRENCY', F.CURRENCY)
    F.READ(F.CURRENCY, currencyRecord, currencyCode, readError)

    IF readError THEN
        ;* Record not found
        ebErrorParam = 'EB-RECORD.NOT.FOUND'
        ebErrorParam<-1> = 'Currency code ' : currencyCode : ' not found in CURRENCY table'
        EB.API.setException(ebErrorParam)
        currencyRecord = ''
    END
RETURN
END
```

### Key Points

- Always set exception BEFORE returning from error path
- Error details (emptyParameters<-1>) should be clear and actionable
- Use standard error codes for consistency across APIs
- Single error per API call (don't accumulate multiple errors)
- Empty result on error - don't return partial data

---

## EB.SystemTables.getEtext

### Purpose

Retrieves any error message set by a service layer routine. Returns empty if no error occurred.

### Syntax

```jbc
errorText = EB.SystemTables.getEtext()
```

### Return Value

| Result            | Meaning                          |
| ----------------- | -------------------------------- |
| Empty string `''` | No error; operation succeeded    |
| Non-empty text    | Error message from service layer |

### Usage Pattern

```jbc
FUNCTION ST.CALCULATE.RATE(buyCurrency, sellCurrency)
    $USING ST.RateCalculator
    $USING EB.API
    $USING EB.SystemTables

    calculatedRate = ''

    parameterNames = 'buyCurrency':@FM:'sellCurrency'
    parameterValues = buyCurrency:@FM:sellCurrency
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN calculatedRate

PROCESS:
    ;* Call service layer routine
    ST.RateCalculator.Calculate(buyCurrency, sellCurrency, calculatedRate)

    ;* Check if service layer set an error
    serviceError = EB.SystemTables.getEtext()

    IF serviceError THEN
        ;* Service error occurred - report it
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = serviceError
        EB.API.setException(ebErrorParam)
        calculatedRate = ''
    END
RETURN
END
```

### Key Pattern: Always Check ETEXT After Service Calls

```jbc
;* Template for any service call
GOSUB CALL.SERVICE

;* Immediately after any service call:
IF EB.SystemTables.getEtext() THEN
    ;* Handle error
    ebErrorParam = 'EB-INTERNAL.ERROR'
    ebErrorParam<-1> = EB.SystemTables.getEtext()
    EB.API.setException(ebErrorParam)
    result = ''
END
```

### Multiple Service Calls

When making multiple service calls, check ETEXT after each one:

```jbc
PROCESS:
    ;* First service call
    ST.Service1.DoSomething(param1, result1)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Second service call (only if first succeeded)
    ST.Service2.DoSomethingElse(param2, result2)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* All services succeeded
    finalResult = result1:@FM:result2
RETURN
```

---

## Complete API Layer Template

Here's a complete template combining all EB.API patterns:

```jbc
FUNCTION ST.COMPLETE.EXAMPLE(param1, param2, param3)
    $USING EB.API
    $USING EB.SystemTables
    $USING ST.ServiceLayer

    result = ''

    ;* ============================================================
    ;* INITIALIZATION PHASE
    ;* ============================================================

    ;* ============================================================
    ;* PARAMETER VALIDATION PHASE
    ;* ============================================================
    parameterNames = 'param1':@FM:'param2':@FM:'param3'
    parameterValues = param1:@FM:param2:@FM:param3
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ;* Parameter validation failed
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        ;* Parameters valid - proceed to business logic
        GOSUB BUSINESS.VALIDATION
    END

RETURN result

;* ============================================================
;* BUSINESS VALIDATION
;* ============================================================
BUSINESS.VALIDATION:
    ;* Validate business rules (format, range, etc.)
    IF param1 <= 0 THEN
        ebErrorParam = 'EB-INVALID.VALUE'
        ebErrorParam<-1> = 'param1 must be greater than zero'
        EB.API.setException(ebErrorParam)
    END ELSE IF param2 NOT MATCHING 'A...' THEN
        ebErrorParam = 'EB-INVALID.VALUE'
        ebErrorParam<-1> = 'param2 must start with letter'
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END
RETURN

;* ============================================================
;* BUSINESS LOGIC PHASE
;* ============================================================
PROCESS:
    ;* Call first service
    ST.ServiceLayer.GetData(param1, data1)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Call second service
    ST.ServiceLayer.CalculateValue(data1, param2, calculatedValue)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Build result
    result = calculatedValue:@FM:TodayDate()
RETURN

END
```

---

## Error Handling Decision Tree

```
START: API Call
  |
  +-- Empty Parameters?
  |    |
  |    YES --> Set EB-EMPTY.PARAMETER --> Return empty
  |    |
  |    NO --> Continue
  |
  +-- Business Rule Violation?
  |    |
  |    YES --> Set EB-INVALID.VALUE --> Return empty
  |    |
  |    NO --> Continue
  |
  +-- Call Service Layer
       |
       +-- Service Set Error? (EB.SystemTables.getEtext())
       |    |
       |    YES --> Set EB-INTERNAL.ERROR --> Return empty
       |    |
       |    NO --> Build result --> Return result
```

---

## Key Takeaways

1. **Validate First** - Always call checkEmptyParameters before business logic
2. **Set Exceptions Early** - Don't return from error path without setException
3. **Check ETEXT Always** - After every service call, check getEtext()
4. **Clear on Error** - Return empty string when exception set
5. **Use Standard Codes** - Use EB-prefixed standard error codes
6. **Provide Context** - Error details (emptyParameters<-1>) should explain the problem
7. **One Error Per Call** - Single exception per API invocation
8. **Order Matters** - Parameter validation first, then business logic, then service calls
