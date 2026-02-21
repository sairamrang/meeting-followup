# FUNCTION Pattern Reference

## Overview

FUNCTION subroutines are used to implement callable routines that **return a value directly** and are typically published as API methods through Component Isolation Definitions. This contrasts with SUBROUTINE which uses output parameters for results.

> **Use FUNCTION when:** Creating API methods that return a single value or structured object
> **Use SUBROUTINE when:** Creating internal utilities or methods needing multiple output parameters

---

## FUNCTION vs SUBROUTINE Comparison

| Aspect                   | FUNCTION                                        | SUBROUTINE                                         |
| ------------------------ | ----------------------------------------------- | -------------------------------------------------- |
| **Keyword**              | `FUNCTION name(...)`                            | `SUBROUTINE name(...)`                             |
| **Return Method**        | `RETURN value` statement                        | Output parameters + `RETURN`                       |
| **API Usage**            | Published as methods                            | Internal helper routines                           |
| **Component Definition** | Maps directly to published API methods          | Called from other routines                         |
| **Calling Pattern**      | Not directly CALLed; invoked via API layer      | `CALL routine.name(param1, param2, output)`        |
| **Return Type**          | Single value (any type)                         | Multiple via parameters                            |
| **Use Case**             | API endpoints, calculations that return results | Complex multi-step processes with multiple outputs |

---

## FUNCTION Structure Template

```jbc
FUNCTION ST.SUBROUTINE.NAME(inputParam1, inputParam2)
    $USING EB.API              ;* Required T24 framework imports
    $USING ST.ExchangeRate     ;* Project-specific service imports
    $USING EB.SystemTables     ;* System utilities import

    ;* Initialize return value
    returnValue = ''

    ;* Parameter validation using EB.API
    parameterNames = 'inputParam1':@FM:'inputParam2'
    parameterValues = inputParam1:@FM:inputParam2
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    ;* Handle validation errors
    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN returnValue

PROCESS:
    ;* Main business logic - set returnValue
    ;* Check for errors after service calls
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
    END
RETURN

END
```

---

## Key Characteristics

### 1. Return Value Assignment

FUNCTION returns a single value via the `RETURN` statement:

```jbc
FUNCTION ST.CALCULATE.RATE(buyCurrency, sellCurrency)
    $USING ST.ExchangeRate

    exchangeRate = ''

    ;* ... validation and processing ...

    ST.ExchangeRate.CalcErateLocal(buyCurrency, sellCurrency, exchangeRate)

RETURN exchangeRate    ;* Returns the calculated rate value
END
```

The return value can be:

- A scalar value (number, string, date)
- A multi-value field
- An empty string (for errors)

### 2. Module Imports with $USING

FUNCTION routines use `$USING` directive to import modules:

```jbc
FUNCTION ST.CALCULATE.EXCHANGE.RATE(localAmount, dealCurrency, dealAmount)
    $USING EB.API              ;* T24 framework for parameter handling
    $USING ST.ExchangeRate     ;* Project service layer
    $USING EB.SystemTables     ;* System error handling

    ;* ... rest of function
```

> **Note:** $USING is used for **modules/packages** (EB.API, ST.ExchangeRate), not file includes. Use `$INSERT` for literal file inclusion (I_COMMON, I_EQUATE).

### 3. Parameter Validation Pattern

All FUNCTION routines must validate input parameters:

```jbc
FUNCTION ST.VALIDATE.DATA(currencyCode, amount)
    $USING EB.API

    result = ''

    ;* Build parameter list for validation
    parameterNames = 'currencyCode':@FM:'amount'
    parameterValues = currencyCode:@FM:amount

    ;* Check for empty parameters
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ;* Set error - prevents execution of PROCESS
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN result
```

**Parameter Validation Breakdown:**

- `parameterNames` - Field-marked list of parameter names for error messages
- `parameterValues` - Corresponding field-marked list of parameter values
- `emptyParameters` - Output showing which parameters were empty
- `EB.API.checkEmptyParameters()` - Framework function that validates

### 4. Error Handling Pattern

FUNCTION routines handle errors using EB.API.setException:

```jbc
FUNCTION ST.CALCULATE.RATE(buyCurrency, sellCurrency)
    $USING EB.API
    $USING ST.ExchangeRate
    $USING EB.SystemTables

    exchangeRate = ''

    ;* ... validation (see above) ...

    GOSUB PROCESS

RETURN exchangeRate

PROCESS:
    ;* Call service layer
    ST.ExchangeRate.CalcErateLocal(buyCurrency, sellCurrency, exchangeRate)

    ;* Check for errors from service call
    IF EB.SystemTables.getEtext() THEN
        ;* Service returned an error
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()  ;* Error description
        EB.API.setException(ebErrorParam)
        ;* Return empty value on error (don't return partial result)
        exchangeRate = ''
    END
RETURN
```

**Error Structure (ebErrorParam):**

- `ebErrorParam<1>` - Main error code (e.g., 'EB-EMPTY.PARAMETER', 'EB-INTERNAL.ERROR')
- `ebErrorParam<-1>` - Error details (list of empty parameters, error message, etc.)

---

## Real-World Example: ST.CALCULATE.EXCHANGE.RATE

From the ST_CurrencyApi component:

```jbc
FUNCTION ST.CALCULATE.EXCHANGE.RATE(localAmount, dealCurrency, dealAmount)
    $USING EB.API
    $USING ST.ExchangeRate
    $USING EB.SystemTables

    exchangeRate = ''

    ;* Step 1: Validate input parameters
    parameterNames = 'localAmount':@FM:'dealCurrency':@FM:'dealAmount'
    parameterValues = localAmount:@FM:dealCurrency:@FM:dealAmount
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ;* Parameter validation failed
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        ;* Parameters valid - proceed to business logic
        GOSUB PROCESS
    END

RETURN exchangeRate

PROCESS:
    ;* Step 2: Call service layer
    ST.ExchangeRate.CalcErateLocal(localAmount, dealCurrency, dealAmount, exchangeRate)

    ;* Step 3: Check for service errors
    IF EB.SystemTables.getEtext() THEN
        ;* Service encountered an error
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
    END
RETURN

END
```

**Execution Flow:**

1. Receive input parameters (localAmount, dealCurrency, dealAmount)
2. Validate parameters using EB.API.checkEmptyParameters
3. If validation fails: Set exception, return empty string
4. If validation passes: Call service layer routine (ST.ExchangeRate.CalcErateLocal)
5. Check for service layer errors using EB.SystemTables.getEtext()
6. If service error: Set exception, clear result
7. Return exchangeRate (either calculated value or empty)

---

## Component Isolation Definition Mapping

FUNCTION routines are published as API methods through Component Isolation Definitions (.component files).

**Component Definition:**

```
published method calculateExchangeRate : number (
    IN localAmount number,        ;* Maps to 1st parameter
    IN dealCurrency string,       ;* Maps to 2nd parameter
    IN dealAmount number          ;* Maps to 3rd parameter
)
{
    jBC: ST.CALCULATE.EXCHANGE.RATE   ;* Maps to FUNCTION name
}
```

**Mapping Rules:**

- Method parameters (IN/OUT) map to FUNCTION parameters in order
- Method return type maps to FUNCTION return value
- Constants (CONSTANT) are passed as literal values
- MEMBER references access object properties

### Data Structure Types in Component Definitions

Complex return types are defined as classes in the component:

```
published method calculateBuyAmount : ST.CurrencyApi:ExchangeAmount (
    IN buyCurrency string,
    IN sellCurrency string,
    IN sellAmount number,
    IN currencyMarket string,
    IN exchangeRate number,
    IN historyDate date,
    CONSTANT "BUY"
)
{
    jBC: ST.CALCULATE.EXCHANGE.AMOUNT
}
```

Here, `ST.CurrencyApi:ExchangeAmount` is a data structure containing:

- buyAmountLcy (buy amount in local currency)
- buyAmountFcy (buy amount in foreign currency)
- (other fields as defined in the component)

The FUNCTION must return a multi-value field matching this structure.

---

## Returning Structured Data

When a FUNCTION returns a complex object, it returns a multi-value field:

```jbc
FUNCTION ST.GET.EXCHANGE.RATES(buyCurrency, sellCurrency)
    $USING EB.API
    $USING ST.CurrencyData

    exchangeData = ''

    ;* ... validation ...

    GOSUB PROCESS

RETURN exchangeData

PROCESS:
    ;* Build multi-value structure
    ST.CurrencyData.GetRatesByPair(buyCurrency, sellCurrency, buyRate, sellRate)

    ;* Return structured data with multi-value fields
    exchangeData = buyRate:@FM:sellRate:@FM:TodayDate()

RETURN
END
```

Component expects:

```
published method getExchangeRates : ST.CurrencyApi:RatesData (
    IN buyCurrency string,
    IN sellCurrency string
)
{
    jBC: ST.GET.EXCHANGE.RATES
}
```

Where RatesData structure includes fields for buy rate, sell rate, and date.

---

## Common Patterns

### Pattern 1: Calculate and Return Single Value

```jbc
FUNCTION ST.CONVERT.AMOUNT(sourceAmount, exchangeRate)
    $USING EB.API

    convertedAmount = ''

    parameterNames = 'sourceAmount':@FM:'exchangeRate'
    parameterValues = sourceAmount:@FM:'exchangeRate'
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        convertedAmount = sourceAmount * exchangeRate
    END

RETURN convertedAmount
END
```

### Pattern 2: Call Service and Return Result

```jbc
FUNCTION ST.GET.CURRENCY.DATA(currencyCode)
    $USING EB.API
    $USING ST.CurrencyService
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
    ST.CurrencyService.GetCurrency(currencyCode, currencyRecord)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        currencyRecord = ''
    END
RETURN
END
```

### Pattern 3: Return Structured Multi-Value Data

```jbc
FUNCTION ST.CALCULATE.RATES(buyCurrency, sellCurrency, date)
    $USING EB.API
    $USING ST.RateCalculator
    $USING EB.SystemTables

    rateData = ''

    ;* Validation
    parameterNames = 'buyCurrency':@FM:'sellCurrency':@FM:'date'
    parameterValues = buyCurrency:@FM:sellCurrency:@FM:date
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN rateData

PROCESS:
    ;* Get individual rates
    ST.RateCalculator.GetBuyRate(buyCurrency, sellCurrency, date, buyRate)
    ST.RateCalculator.GetSellRate(buyCurrency, sellCurrency, date, sellRate)
    ST.RateCalculator.GetMidRate(buyCurrency, sellCurrency, date, midRate)

    ;* Build return structure with multi-value fields
    rateData = buyRate:@FM:sellRate:@FM:midRate:@FM:date

    ;* Check for errors
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        rateData = ''
    END
RETURN
END
```

---

## Anti-Patterns to Avoid

### ❌ Returning Partial Data on Error

```jbc
;* WRONG: Returns invalid data when error occurs
FUNCTION ST.CALCULATE(param1, param2)
    result = param1 * param2

    IF param2 = 0 THEN
        EB.API.setException('EB-DIVISION.ERROR')
        ;* But result is still returned with partial calculation!
    END

RETURN result
END
```

**Better:**

```jbc
;* CORRECT: Clear result on error
FUNCTION ST.CALCULATE(param1, param2)
    result = ''

    IF param2 = 0 THEN
        EB.API.setException('EB-DIVISION.ERROR')
    END ELSE
        result = param1 / param2
    END

RETURN result
END
```

### ❌ Forgetting Error Check After Service Call

```jbc
;* WRONG: Doesn't check service errors
FUNCTION ST.GET.DATA(id)
    data = ''
    ST.Service.GetRecord(id, data)
    ;* What if ST.Service.GetRecord failed?
RETURN data
END
```

**Better:**

```jbc
;* CORRECT: Always check ETEXT after service calls
FUNCTION ST.GET.DATA(id)
    $USING EB.SystemTables
    $USING ST.Service

    data = ''
    ST.Service.GetRecord(id, data)

    IF EB.SystemTables.getEtext() THEN
        EB.API.setException('EB-SERVICE.ERROR')
        data = ''
    END

RETURN data
END
```

### ❌ Returning Unvalidated Parameters Directly

```jbc
;* WRONG: Returns parameter without validation
FUNCTION ST.PROCESS(input)
RETURN input
END
```

**Better:**

```jbc
;* CORRECT: Validate parameters before use
FUNCTION ST.PROCESS(input)
    $USING EB.API

    result = ''

    EB.API.checkEmptyParameters('input', input, emptyParameters)

    IF emptyParameters THEN
        EB.API.setException('EB-EMPTY.PARAMETER')
    END ELSE
        ;* Process validated input
        result = input
    END

RETURN result
END
```

---

## Key Takeaways

1. **FUNCTION returns a value** - Use RETURN with a value, not just RETURN
2. **Always validate parameters** - Use EB.API.checkEmptyParameters first
3. **Always check for errors** - Call EB.SystemTables.getEtext() after service calls
4. **Clear result on error** - Don't return partial data when exceptions occur
5. **Use $USING for modules** - Import packages with $USING, not $INSERT
6. **Map to component definitions** - FUNCTION routines are published as API methods
7. **Return structured data as multi-value** - Complex return types use @FM delimiters
