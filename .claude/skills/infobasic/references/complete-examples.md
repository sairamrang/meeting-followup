# Complete Working Examples

This section provides complete, production-ready examples demonstrating best practices for various T24/InfoBasic patterns.

---

## Example 1: Simple API FUNCTION with Error Handling

**File:** `ST.CALCULATE.EXCHANGE.RATE.b`

A straightforward API function that validates parameters, calls a service layer, and handles errors using the EB.API framework.

```jbc
$PACKAGE ST.CurrencyApi
*----------------------------------------------------------------------
* File: ST.CALCULATE.EXCHANGE.RATE.b
* Purpose: Calculate exchange rate from local to deal currency
*
* Modification History:
*   2025-01-15 - JD - Initial implementation
*----------------------------------------------------------------------

FUNCTION ST.CALCULATE.EXCHANGE.RATE(localAmount, dealCurrency, dealAmount)
    $USING EB.API
    $USING ST.ExchangeRate
    $USING EB.SystemTables

    exchangeRate = ''

    ;* PHASE 1: PARAMETER VALIDATION
    ;* ===========================
    parameterNames = 'localAmount':@FM:'dealCurrency':@FM:'dealAmount'
    parameterValues = localAmount:@FM:dealCurrency:@FM:dealAmount
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ;* Validation failed - set exception and return empty
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE
        ;* Validation passed - proceed to business logic
        GOSUB PROCESS
    END

RETURN exchangeRate

;* PHASE 2: BUSINESS LOGIC
;* ======================
PROCESS:
    ;* Call service layer to calculate exchange rate
    ST.ExchangeRate.CalcErateLocal(localAmount, dealCurrency, dealAmount, exchangeRate)

    ;* Check if service layer encountered error
    IF EB.SystemTables.getEtext() THEN
        ;* Service error occurred - set exception and clear result
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        exchangeRate = ''
    END
RETURN

END
```

**Key Patterns:**

- Simple parameter validation using EB.API.checkEmptyParameters
- Service layer call with error checking using EB.SystemTables.getEtext()
- Exception reporting using EB.API.setException
- Empty return on errors

---

## Example 2: Complex FUNCTION with Multiple Service Calls

**File:** `ST.CALCULATE.EXCHANGE.AMOUNT.b`

A more complex function demonstrating multiple service calls with sequential error checking and structured return value.

```jbc
$PACKAGE ST.CurrencyApi
*----------------------------------------------------------------------
* File: ST.CALCULATE.EXCHANGE.AMOUNT.b
* Purpose: Calculate buy/sell amounts for currency exchange with rates
*
* Modification History:
*   2025-01-15 - JD - Initial implementation
*----------------------------------------------------------------------

FUNCTION ST.CALCULATE.EXCHANGE.AMOUNT(buyCurrency, sellCurrency, sellAmount, currencyMarket, exchangeRate, historyDate, amountType)
    $USING EB.API
    $USING EB.SystemTables
    $USING ST.RateCalculator
    $USING ST.AmountCalculator

    exchangeAmount = ''

    ;* PHASE 1: PARAMETER VALIDATION
    ;* ===========================
    parameterNames = 'buyCurrency':@FM:'sellCurrency':@FM:'sellAmount':@FM:'currencyMarket':@FM:'historyDate'
    parameterValues = buyCurrency:@FM:sellCurrency:@FM:sellAmount:@FM:currencyMarket:@FM:historyDate
    EB.API.checkEmptyParameters(parameterNames, parameterValues, emptyParameters)

    IF emptyParameters THEN
        ebErrorParam = 'EB-EMPTY.PARAMETER'
        ebErrorParam<-1> = emptyParameters
        EB.API.setException(ebErrorParam)
    END ELSE IF NOT(ISNUMBER(sellAmount)) THEN
        ;* Business validation: amount must be numeric
        ebErrorParam = 'EB-INVALID.VALUE'
        ebErrorParam<-1> = 'sellAmount must be a valid number'
        EB.API.setException(ebErrorParam)
    END ELSE
        GOSUB PROCESS
    END

RETURN exchangeAmount

;* PHASE 2: BUSINESS LOGIC
;* ======================
PROCESS:
    ;* Get exchange rate if not provided
    IF exchangeRate = '' THEN
        ST.RateCalculator.GetRate(buyCurrency, sellCurrency, currencyMarket, exchangeRate)

        IF EB.SystemTables.getEtext() THEN
            ebErrorParam = 'EB-INTERNAL.ERROR'
            ebErrorParam<-1> = EB.SystemTables.getEtext()
            EB.API.setException(ebErrorParam)
            RETURN
        END
    END

    ;* Calculate amounts based on type (BUY or SELL)
    ST.AmountCalculator.Calculate(buyCurrency, sellCurrency, sellAmount, exchangeRate, amountType, calcResult)

    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Round amounts according to currency rules
    ST.AmountCalculator.RoundAmount(buyCurrency, calcResult, roundedResult)

    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Build multi-value structure for return
    ;* <1> Buy Amount LCY
    ;* <2> Buy Amount FCY
    ;* <3> Sell Amount LCY
    ;* <4> Sell Amount FCY
    exchangeAmount = roundedResult
RETURN

END
```

**Key Patterns:**

- Multiple sequential service calls with error checking after each
- Business rule validation beyond parameter checking
- Early return on error to prevent further processing
- Return when service fails (prevents partial data return)
- Structured multi-value return value

---

## Example 3: DAS Layer Configuration Service

**File:** `GET.CURRENCY.RECORD.b`

A DAS (Data Access Service) layer function that reads currency configuration from the database with proper error handling.

```jbc
$PACKAGE ST.CurrencyConfig
*----------------------------------------------------------------------
* File: GET.CURRENCY.RECORD.b
* Purpose: Read currency configuration record using DAS pattern
*
* Modification History:
*   2025-01-15 - JD - Initial implementation
*----------------------------------------------------------------------

SUBROUTINE GET.CURRENCY.RECORD(ioData, ioCcyCompMne, ioRatesId, ioRatesRecord, ioErrMsg, ioTableSuffix)
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_CURRENCY_FIELDS

    ioErrMsg = ''
    ioRatesRecord = ''

    ;* PHASE 1: PARAMETER VALIDATION
    ;* ===========================
    IF ioCcyCompMne = '' OR ioRatesId = '' THEN
        ioErrMsg = 'REQUIRED.CURRENCY.PARAMETERS'
        RETURN
    END

    ;* PHASE 2: BUILD DAS QUERY
    ;* =======================
    GOSUB BUILD.DAS.QUERY

    ;* PHASE 3: EXECUTE DAS QUERY
    ;* ==========================
    GOSUB EXECUTE.DAS.QUERY

    ;* PHASE 4: PROCESS RESULTS
    ;* =======================
    GOSUB PROCESS.RESULTS

RETURN

;* ===================================================================
;* BUILD DAS QUERY
;* ===================================================================
BUILD.DAS.QUERY:
    MY.TABLE = 'CURRENCY'
    MY.FIELDS = CURRENCY.ID:@FM:CURRENCY.CODE:@FM:CURRENCY.NAME:@FM:CURRENCY.MARKET

    ;* Query for specific currency
    MY.OPERANDS = ''
    MY.OPERANDS<1,1> = 'EQ'
    MY.OPERANDS<1,2> = CURRENCY.ID
    MY.OPERANDS<1,3> = ioCcyCompMne

    MY.DATA = ''
    MY.JOINS = ''
RETURN

;* ===================================================================
;* EXECUTE DAS QUERY
;* ===================================================================
EXECUTE.DAS.QUERY:
    ;* Call DAS service to query currency records
    CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, ioTableSuffix, queryResult)

    IF queryResult = 'UNKNOWN.QUERY' THEN
        ioErrMsg = 'DAS.QUERY.FAILED'
        RETURN
    END

    ;* Extract result record
    ioRatesRecord = queryResult<1>
RETURN

;* ===================================================================
;* PROCESS RESULTS
;* ===================================================================
PROCESS.RESULTS:
    IF ioRatesRecord = '' THEN
        ioErrMsg = 'CURRENCY.NOT.FOUND'
        RETURN
    END

    ;* Extract specific fields from record
    ioRatesId = ioRatesRecord<CURRENCY.ID>
    currencyCode = ioRatesRecord<CURRENCY.CODE>

    ;* Success - error message remains empty
RETURN

END
```

**Key Patterns:**

- DAS query building with MY.\* variables
- Proper error handling for DAS operations
- Field equates for database access
- Multi-tenancy support via TABLE.SUFFIX
- UNKNOWN.QUERY check in otherwise case

---

## Example 4: Unit Test Example

**File:** `ST.CALCULATE.EXCHANGE.RATE_01.tut`

A complete test suite demonstrating how to test the exchange rate calculation function with various scenarios.

```jbc
TESTCASE ST.CALCULATE.EXCHANGE.RATE_01
*----------------------------------------------------------------------
* Test Suite: ST.CALCULATE.EXCHANGE.RATE
*
* Test Scenarios:
*   1. nullTestCase: Empty parameters (validation failure)
*   2. positiveTestCase: Valid inputs with successful calculation
*   3. errorTestCase: Service layer failure
*
*----------------------------------------------------------------------

UTF.setTarget("ST.CALCULATE.EXCHANGE.RATE")
UTF.setDescription("Test ST.CALCULATE.EXCHANGE.RATE function")

GOSUB nullTestCase
GOSUB positiveTestCase
GOSUB errorTestCase

RETURN

;* ===================================================================
;* TEST CASE 1: Parameter Validation Failure
;* ===================================================================
nullTestCase:
    UTF.reset()

    ;* Setup: All parameters empty
    UTF.addParam('')
    UTF.addParam('')
    UTF.addParam('')

    ;* Stub: Parameter validation
    parameterNames = "localAmount":@FM:"dealCurrency":@FM:"dealAmount"
    stubName = UTF.addStub('EB.API.checkEmptyParameters')
    UTF.addStubParam(stubName, parameterNames, UTF.same())
    UTF.addStubParam(stubName, '':@FM:'':@FM:'', UTF.same())
    UTF.addStubParam(stubName, '', parameterNames)  ;* Return list of empty params

    ;* Expected: Exception with EB-EMPTY.PARAMETER
    ebErrorParam = 'EB-EMPTY.PARAMETER'
    ebErrorParam<-1> = parameterNames
    GOSUB executeExceptionStub
RETURN

;* ===================================================================
;* TEST CASE 2: Positive Case (Success)
;* ===================================================================
positiveTestCase:
    UTF.reset()

    ;* Setup: Valid input parameters
    lAmount = '1000'
    dCurrency = 'GBP'
    dAmount = '1500'
    UTF.addParam(lAmount)
    UTF.addParam(dCurrency)
    UTF.addParam(dAmount)

    ;* Stub: Service layer call
    stub = UTF.addStub('ST.ExchangeRate.CalcErateLocal')
    UTF.addStubParam(stub, lAmount, UTF.same())
    UTF.addStubParam(stub, dCurrency, UTF.same())
    UTF.addStubParam(stub, dAmount, UTF.same())
    UTF.addStubParam(stub, '', '0.666666667')  ;* Return calculated rate
    UTF.ignoreMissingStubs()

    ;* Execute and verify result
    exchRate = UTF.runTest("Test successful exchange rate calculation")
    UTF.assertEquals(exchRate, '0.666666667')
RETURN

;* ===================================================================
;* TEST CASE 3: Service Layer Error
;* ===================================================================
errorTestCase:
    UTF.reset()

    ;* Setup: Valid input
    lAmount = '1000'
    dCurrency = 'GBP'
    dAmount = '1500'
    UTF.addParam(lAmount)
    UTF.addParam(dCurrency)
    UTF.addParam(dAmount)

    ;* Stub: Service fails
    stubName = UTF.addStub('ST.ExchangeRate.CalcErateLocal')
    UTF.addStubParam(stubName, lAmount, UTF.same())
    UTF.addStubParam(stubName, dCurrency, UTF.same())
    UTF.addStubParam(stubName, dAmount, UTF.same())
    UTF.addStubParam(stubName, '', UTF.same())  ;* Service returns empty

    ;* Stub: System error flag set
    UTF.addStubPropertyChange(stubName, 'EB.SystemTables', 'Etext', 'CORE ERROR')
    UTF.ignoreMissingStubs()

    ;* Expected: Exception with error details
    ebErrorParam = 'EB-INTERNAL.ERROR'
    ebErrorParam<-1> = 'CORE ERROR'
    GOSUB executeExceptionStub
RETURN

;* ===================================================================
;* HELPER: Execute test and verify exception
;* ===================================================================
executeExceptionStub:
    exceptionStub = UTF.addStub('EB.API.setException')
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())
    UTF.runTest("Test error handling")

    ;* Verify exception was called exactly once
    count = UTF.getNbInvocation(exceptionStub)
    UTF.assertEquals(count, '1')
RETURN

END
```

**Key Patterns:**

- UTF.reset() before each test case
- Stubbing external dependencies
- Testing three scenarios: happy path, validation, error
- Verifying invocation counts
- Property mocking for error conditions

---

## Example 5: Complete Workflow Service

**File:** `T24CurrencyExchangeServiceImpl.executeExchange.b`

A complete workflow service demonstrating parameter validation, multiple business logic steps, error handling, and logging.

```jbc
$PACKAGE T24.CurrencyExchange
*----------------------------------------------------------------------
* File: T24CurrencyExchangeServiceImpl.executeExchange.b
* Purpose: Complete currency exchange workflow service
*
* Modification History:
*   2025-01-15 - JD - Initial implementation
*----------------------------------------------------------------------

SUBROUTINE T24.CurrencyExchangeServiceImpl.executeExchange(iExchangeRequest, oExchangeResult, oErrorCode)
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $USING EB.API
    $USING EB.SystemTables
    $USING ST.CurrencyConfig
    $USING ST.RateCalculator
    $USING ST.AmountCalculator

    ;* ===================================================================
    ;* PHASE 1: INITIALIZATION
    ;* ===================================================================
    GOSUB initialize

    ;* ===================================================================
    ;* PHASE 2: INPUT VALIDATION
    ;* ===================================================================
    GOSUB validateInput
    IF oErrorCode THEN RETURN

    ;* ===================================================================
    ;* PHASE 3: BUSINESS LOGIC
    ;* ===================================================================
    GOSUB retrieveCurrencyData
    IF oErrorCode THEN RETURN

    GOSUB calculateRates
    IF oErrorCode THEN RETURN

    GOSUB calculateAmounts
    IF oErrorCode THEN RETURN

    GOSUB buildResult
    IF oErrorCode THEN RETURN

    ;* ===================================================================
    ;* PHASE 4: FINALIZATION
    ;* ===================================================================
    GOSUB finalizeExecution

RETURN

;* ===================================================================
;* INITIALIZE
;* ===================================================================
initialize:
    oExchangeResult = ''
    oErrorCode = ''
    CALL SetServiceCommon
RETURN

;* ===================================================================
;* VALIDATE INPUT
;* ===================================================================
validateInput:
    ;* Extract and validate input fields
    buyCurrency = iExchangeRequest<EXCHANGE.BUY.CURRENCY>
    sellCurrency = iExchangeRequest<EXCHANGE.SELL.CURRENCY>
    sellAmount = iExchangeRequest<EXCHANGE.SELL.AMOUNT>

    ;* Validate parameters
    IF buyCurrency = '' OR sellCurrency = '' OR sellAmount = '' THEN
        oErrorCode = 'INVALID.EXCHANGE.REQUEST'
        CALL TPSLogging("Error","validateInput","Missing required fields","")
        RETURN
    END

    ;* Validate amount is numeric
    IF NOT(ISNUMBER(sellAmount)) THEN
        oErrorCode = 'INVALID.AMOUNT.FORMAT'
        CALL TPSLogging("Error","validateInput","Amount must be numeric","")
        RETURN
    END
RETURN

;* ===================================================================
;* RETRIEVE CURRENCY DATA
;* ===================================================================
retrieveCurrencyData:
    ;* Get buy currency details
    ST.CurrencyConfig.GetCurrencyRecord(buyCurrency, buyCurrencyId, buyCurrencyRecord, errorMsg)

    IF errorMsg THEN
        oErrorCode = 'BUY.CURRENCY.NOT.FOUND'
        CALL TPSLogging("Error","retrieveCurrencyData","Cannot find buy currency:" : buyCurrency,"")
        RETURN
    END

    ;* Get sell currency details
    ST.CurrencyConfig.GetCurrencyRecord(sellCurrency, sellCurrencyId, sellCurrencyRecord, errorMsg)

    IF errorMsg THEN
        oErrorCode = 'SELL.CURRENCY.NOT.FOUND'
        CALL TPSLogging("Error","retrieveCurrencyData","Cannot find sell currency:" : sellCurrency,"")
        RETURN
    END
RETURN

;* ===================================================================
;* CALCULATE RATES
;* ===================================================================
calculateRates:
    ;* Get exchange rate
    currencyMarket = iExchangeRequest<EXCHANGE.MARKET>
    historyDate = iExchangeRequest<EXCHANGE.DATE>

    ST.RateCalculator.GetBuyRate(buyCurrency, sellCurrency, currencyMarket, historyDate, buyRate)

    IF EB.SystemTables.getEtext() THEN
        oErrorCode = 'RATE.CALCULATION.FAILED'
        CALL TPSLogging("Error","calculateRates",EB.SystemTables.getEtext(),"")
        RETURN
    END

    ST.RateCalculator.GetSellRate(buyCurrency, sellCurrency, currencyMarket, historyDate, sellRate)

    IF EB.SystemTables.getEtext() THEN
        oErrorCode = 'RATE.CALCULATION.FAILED'
        CALL TPSLogging("Error","calculateRates",EB.SystemTables.getEtext(),"")
        RETURN
    END

    CALL TPSLogging("Info","calculateRates","Buy Rate:" : buyRate : ", Sell Rate:" : sellRate,"")
RETURN

;* ===================================================================
;* CALCULATE AMOUNTS
;* ===================================================================
calculateAmounts:
    ;* Calculate buy amount in local currency
    ST.AmountCalculator.Calculate(buyCurrency, sellCurrency, sellAmount, buyRate, sellRate, buyAmountLcy, buyAmountFcy)

    IF EB.SystemTables.getEtext() THEN
        oErrorCode = 'AMOUNT.CALCULATION.FAILED'
        CALL TPSLogging("Error","calculateAmounts",EB.SystemTables.getEtext(),"")
        RETURN
    END

    ;* Round amounts
    ST.AmountCalculator.RoundAmount(buyCurrency, buyAmountLcy, buyAmountLcyRounded)
    ST.AmountCalculator.RoundAmount(sellCurrency, buyAmountFcy, buyAmountFcyRounded)

    IF EB.SystemTables.getEtext() THEN
        oErrorCode = 'ROUNDING.FAILED'
        CALL TPSLogging("Error","calculateAmounts",EB.SystemTables.getEtext(),"")
        RETURN
    END
RETURN

;* ===================================================================
;* BUILD RESULT
;* ===================================================================
buildResult:
    ;* Build multi-value result structure
    oExchangeResult<EXCHANGE.RESULT.BUY.CURRENCY> = buyCurrency
    oExchangeResult<EXCHANGE.RESULT.SELL.CURRENCY> = sellCurrency
    oExchangeResult<EXCHANGE.RESULT.BUY.RATE> = buyRate
    oExchangeResult<EXCHANGE.RESULT.SELL.RATE> = sellRate
    oExchangeResult<EXCHANGE.RESULT.SELL.AMOUNT> = sellAmount
    oExchangeResult<EXCHANGE.RESULT.BUY.AMOUNT.LCY> = buyAmountLcyRounded
    oExchangeResult<EXCHANGE.RESULT.BUY.AMOUNT.FCY> = buyAmountFcyRounded

    CALL TPSLogging("Info","buildResult","Exchange result built successfully","")
RETURN

;* ===================================================================
;* FINALIZE EXECUTION
;* ===================================================================
finalizeExecution:
    CALL SetServiceResponse
    CALL TPSLogging("End","T24.CurrencyExchangeServiceImpl.executeExchange","Exchange execution complete","")
RETURN

END
```

**Key Patterns:**

- Clear phase separation (Initialize → Validate → Logic → Finalize)
- Early return on errors
- Logging at key points (start, end, errors, key values)
- Field equates for multi-value structure access
- Sequential processing with error checks
- SetServiceCommon and SetServiceResponse framework calls
- Meaningful error codes

---

## Summary of Best Practices

These examples demonstrate:

1. **Parameter Validation** - Check parameters first, fail fast
2. **Error Handling** - Check ETEXT after service calls
3. **Exception Reporting** - Use EB.API.setException for API layer
4. **Multi-Value Structures** - Use @FM/@VM for complex returns
5. **DAS Pattern** - Query building and error checking
6. **Logging** - Strategic logging for debugging
7. **Test Coverage** - Test happy path, validation, and errors
8. **Code Organization** - Logical phases and GOSUB sections
9. **Field Equates** - Use constants, not magic numbers
10. **Early Returns** - Fail fast, don't continue on errors
