# DAS (Data Access Service) Patterns Reference

## Table of Contents

1. [DAS Overview](#das-overview)
2. [DAS Subroutine Structure](#das-subroutine-structure)
3. [DAS Query Building](#das-query-building)
4. [Calling DAS Services](#calling-das-services)
5. [DAS Include Files](#das-include-files)
6. [Common DAS Operations](#common-das-operations)
7. [Error Handling in DAS](#error-handling-in-das)

---

## DAS Overview

DAS (Data Access Service) is the standard pattern for all database operations in T24. It provides:

- **Abstraction**: Separates business logic from data access
- **Multi-tenancy**: TABLE.SUFFIX support for company-specific data
- **Consistency**: Standardized query interface
- **Maintainability**: Centralized data access logic

**Golden Rule**: Never access files directly - always use DAS.

---

## DAS Subroutine Structure

### Standard DAS Template

```basic
$PACKAGE PP.ServiceName
SUBROUTINE DAS.PP.TABLENAME(THE.LIST, THE.ARGS, TABLE.SUFFIX)
*-----------------------------------------------------------------------------
* @author developer@company.com
* @stereotype das
* @package PP.ServiceName
* <p>Data Access Service for PP.TABLENAME table</p>
* @param OUT   THE.LIST     - Result list from query
* @param INOUT THE.ARGS     - Query arguments
* @param IN    TABLE.SUFFIX - Company suffix for multi-tenancy
*!
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_DAS.PP.TABLENAME
    $INSERT I_DAS.PP.TABLENAME.NOTES
    $INSERT I_DAS

    GOSUB BUILD.DATA
    RETURN

*-----------------------------------------------------------------------------
*** <region name=BUILD.DATA>
BUILD.DATA:
*** <desc>Build query based on command type</desc>
    MY.TABLE = 'PP.TABLENAME' : TABLE.SUFFIX

    BEGIN CASE
        CASE MY.CMD = dasPPTableNameGetByStatus
            MY.FIELDS = 'StatusCode'
            MY.OPERANDS = 'EQ'
            MY.DATA = THE.ARGS<1>
            MY.JOINS = ''

        CASE MY.CMD = dasPPTableNameGetByCompanyAndFT
            MY.FIELDS = 'CompanyID' : @FM : 'FTNumber'
            MY.OPERANDS = 'EQ' : @FM : 'EQ'
            MY.DATA = THE.ARGS<1> : @FM : THE.ARGS<2>
            MY.JOINS = 'AND'

        CASE MY.CMD = dasPPTableNameGetByDateRange
            MY.FIELDS = 'ProcessDate' : @FM : 'ProcessDate'
            MY.OPERANDS = 'GE' : @FM : 'LE'
            MY.DATA = THE.ARGS<1> : @FM : THE.ARGS<2>
            MY.JOINS = 'AND'

        CASE OTHERWISE
            ERROR.MSG = 'UNKNOWN.QUERY'
    END CASE
    RETURN
*** </region>
END
```

---

## DAS Query Building

### MY.\* Variables

| Variable      | Purpose                  | Example                            |
| ------------- | ------------------------ | ---------------------------------- |
| `MY.TABLE`    | Target table with suffix | `'PP.PAYMENT' : TABLE.SUFFIX`      |
| `MY.CMD`      | Query command constant   | `dasPPPaymentGetByStatus`          |
| `MY.FIELDS`   | Fields to query on       | `'StatusCode' : @FM : 'CompanyID'` |
| `MY.OPERANDS` | Comparison operators     | `'EQ' : @FM : 'GE'`                |
| `MY.DATA`     | Query values             | `'621' : @FM : startDate`          |
| `MY.JOINS`    | Join operators           | `'AND'` or `'OR'`                  |

### Operand Types

| Operand | Meaning              | Example                    |
| ------- | -------------------- | -------------------------- |
| `EQ`    | Equals               | `StatusCode EQ '621'`      |
| `NE`    | Not equals           | `StatusCode NE 'DELETED'`  |
| `GE`    | Greater or equal     | `ProcessDate GE startDate` |
| `LE`    | Less or equal        | `ProcessDate LE endDate`   |
| `GT`    | Greater than         | `Amount GT '1000'`         |
| `LT`    | Less than            | `Amount LT '5000'`         |
| `LK`    | Like (pattern match) | `Reference LK 'PAY...'`    |
| `UL`    | Unlike               | `Reference UL 'TEST...'`   |

### Multi-Field Queries

```basic
CASE MY.CMD = dasPPPaymentComplexQuery
    * Query: StatusCode = '621' AND CompanyID = 'GB0010001' AND ProcessDate >= startDate
    MY.FIELDS = 'StatusCode' : @FM : 'CompanyID' : @FM : 'ProcessDate'
    MY.OPERANDS = 'EQ' : @FM : 'EQ' : @FM : 'GE'
    MY.DATA = THE.ARGS<1> : @FM : THE.ARGS<2> : @FM : THE.ARGS<3>
    MY.JOINS = 'AND' : @FM : 'AND'
```

### OR Conditions

```basic
CASE MY.CMD = dasPPPaymentGetPendingOrProcessing
    * Query: StatusCode = '620' OR StatusCode = '621'
    MY.FIELDS = 'StatusCode' : @FM : 'StatusCode'
    MY.OPERANDS = 'EQ' : @FM : 'EQ'
    MY.DATA = '620' : @FM : '621'
    MY.JOINS = 'OR'
```

---

## Calling DAS Services

### Standard DAS Call Pattern

```basic
* Initialize arguments
THE.ARGS = ''
THE.ARGS<1> = statusCode
THE.ARGS<2> = companyID

* Set the command type
THE.ARGS<DAS.FUNC.ARG> = dasPPPaymentGetByStatusAndCompany

* Call DAS
THE.LIST = ''
TABLE.SUFFIX = ''
CALL DAS.PP.PAYMENT(THE.LIST, THE.ARGS, TABLE.SUFFIX)

* Check for errors
IF THE.LIST EQ '' THEN
    * No results found
    GOSUB handleNoResults
END ELSE
    * Process results
    resultCount = DCOUNT(THE.LIST, @FM)
    FOR idx = 1 TO resultCount
        recordKey = THE.LIST<idx>
        GOSUB processRecord
    NEXT idx
END
```

### With Company Suffix (Multi-Tenancy)

```basic
* For multi-company deployments
TABLE.SUFFIX = '.' : companyMnemonic

* Call DAS with suffix
CALL DAS.PP.PAYMENT(THE.LIST, THE.ARGS, TABLE.SUFFIX)
```

### Reading Records After DAS

```basic
* After getting list from DAS, read the actual records
FN.PP.PAYMENT = 'F.PP.PAYMENT' : TABLE.SUFFIX
F.PP.PAYMENT = ''
CALL OPF(FN.PP.PAYMENT, F.PP.PAYMENT)

FOR idx = 1 TO DCOUNT(THE.LIST, @FM)
    recordKey = THE.LIST<idx>
    R.PP.PAYMENT = ''
    ERR.PP.PAYMENT = ''

    CALL F.READ(FN.PP.PAYMENT, recordKey, R.PP.PAYMENT, F.PP.PAYMENT, ERR.PP.PAYMENT)

    IF ERR.PP.PAYMENT EQ '' THEN
        * Record read successfully
        GOSUB processPaymentRecord
    END ELSE
        * Handle read error
        GOSUB handleReadError
    END
NEXT idx
```

---

## DAS Include Files

### I_DAS.PP.TABLENAME Structure

```basic
* Include file: I_DAS.PP.TABLENAME
* Defines constants for DAS commands

EQUATE dasPPTableNameGetByStatus TO 'PP.TABLENAME.GET.BY.STATUS'
EQUATE dasPPTableNameGetByCompany TO 'PP.TABLENAME.GET.BY.COMPANY'
EQUATE dasPPTableNameGetByDateRange TO 'PP.TABLENAME.GET.BY.DATE.RANGE'
EQUATE dasPPTableNameComplexQuery TO 'PP.TABLENAME.COMPLEX.QUERY'
```

### I_DAS Standard Include

```basic
* Standard DAS include provides:
* DAS.FUNC.ARG - Position for function argument
* Other DAS framework constants
```

### I_DAS.PP.TABLENAME.NOTES

```basic
* Contains additional notes and documentation for DAS queries
* May include query optimization hints
* Documents expected THE.ARGS structure for each command
```

---

## Common DAS Operations

### GET Single Record

```basic
* DAS to get single record by key
CASE MY.CMD = dasPPPaymentGetById
    MY.FIELDS = '@ID'
    MY.OPERANDS = 'EQ'
    MY.DATA = THE.ARGS<1>
    MY.JOINS = ''
```

### SELECT by Status

```basic
CASE MY.CMD = dasPPPaymentSelectByStatus
    MY.FIELDS = 'StatusCode'
    MY.OPERANDS = 'EQ'
    MY.DATA = THE.ARGS<1>
    MY.JOINS = ''
```

### SELECT with Multiple Criteria

```basic
CASE MY.CMD = dasPPPaymentSelectForProcessing
    * Get payments ready for processing
    * Status = 'PENDING' AND Amount > 0 AND ProcessDate <= TODAY
    MY.FIELDS = 'StatusCode' : @FM : 'Amount' : @FM : 'ProcessDate'
    MY.OPERANDS = 'EQ' : @FM : 'GT' : @FM : 'LE'
    MY.DATA = 'PENDING' : @FM : '0' : @FM : TODAY
    MY.JOINS = 'AND' : @FM : 'AND'
```

### Pattern Matching (LIKE)

```basic
CASE MY.CMD = dasPPPaymentSelectByReferencePattern
    * Find all payments where reference starts with 'SEPA'
    MY.FIELDS = 'PaymentReference'
    MY.OPERANDS = 'LK'
    MY.DATA = 'SEPA...'
    MY.JOINS = ''
```

---

## Error Handling in DAS

### Standard Error Pattern

```basic
BUILD.DATA:
    MY.TABLE = 'PP.TABLENAME' : TABLE.SUFFIX

    BEGIN CASE
        CASE MY.CMD = dasPPTableNameValidQuery
            MY.FIELDS = 'StatusCode'
            MY.OPERANDS = 'EQ'
            MY.DATA = THE.ARGS<1>
            MY.JOINS = ''

        CASE OTHERWISE
            * Unknown query - set error
            ERROR.MSG = 'UNKNOWN.QUERY'
    END CASE
    RETURN
```

### Caller Error Handling

```basic
* Call DAS
CALL DAS.PP.PAYMENT(THE.LIST, THE.ARGS, TABLE.SUFFIX)

* Check for errors in THE.ARGS
IF THE.ARGS<DAS.ERROR.POS> NE '' THEN
    errorMessage = THE.ARGS<DAS.ERROR.POS>
    GOSUB handleDASError
    RETURN
END

* Check for empty results
IF THE.LIST EQ '' THEN
    * No matching records - may or may not be an error depending on context
    GOSUB handleNoResults
    RETURN
END

* Process results
GOSUB processResults
```

### Logging DAS Operations

```basic
* Log before DAS call
CALL TPSLogging("DAS Call","ServiceImpl.method","Command: ":MY.CMD:", Args: ":THE.ARGS,"")

* Call DAS
CALL DAS.PP.PAYMENT(THE.LIST, THE.ARGS, TABLE.SUFFIX)

* Log results
resultCount = DCOUNT(THE.LIST, @FM)
CALL TPSLogging("DAS Result","ServiceImpl.method","Records found: ":resultCount,"")
```

---

## DAS Best Practices

1. **Always initialize THE.LIST and THE.ARGS** before calling DAS
2. **Set TABLE.SUFFIX** correctly for multi-company deployments
3. **Handle empty results** gracefully - not always an error
4. **Use defined constants** from I_DAS.\* includes, not magic strings
5. **Log DAS operations** for debugging and audit
6. **Check for UNKNOWN.QUERY** error in caller
7. **Keep queries simple** - complex logic belongs in business layer
8. **Document query parameters** in I_DAS.\*.NOTES include

---

## Project-Specific Examples: ST_CurrencyConfig DAS Layer

The ST_CurrencyConfig component provides DAS layer services for accessing currency-related T24 tables.

### Example 1: Query CURRENCY Table by Code

**File:** `ST_CurrencyConfig/Source/Private/GET.CURRENCY.RECORD.b`

```jbc
SUBROUTINE GET.CURRENCY.RECORD(ioCcyCompMne, ioRatesId, ioRatesRecord, ioErrMsg, ioTableSuffix)
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_CURRENCY_FIELDS
    $INSERT I_DAS.CURRENCY

    ioErrMsg = ''
    ioRatesRecord = ''

    ;* PHASE 1: VALIDATE INPUT
    IF ioCcyCompMne = '' THEN
        ioErrMsg = 'CURRENCY.CODE.REQUIRED'
        RETURN
    END

    ;* PHASE 2: BUILD DAS QUERY
    MY.TABLE = 'CURRENCY'
    MY.FIELDS = CURRENCY.ID:@FM:CURRENCY.CODE:@FM:CURRENCY.NAME
    MY.FIELDS := @FM:CURRENCY.MARKET:@FM:CURRENCY.BUY.RATE:@FM:CURRENCY.SELL.RATE

    ;* Query for specific currency code
    MY.OPERANDS = ''
    MY.OPERANDS<1,1> = 'EQ'                  ;* Operator
    MY.OPERANDS<1,2> = CURRENCY.ID           ;* Field to match
    MY.OPERANDS<1,3> = ioCcyCompMne          ;* Search value

    MY.DATA = ''
    MY.JOINS = ''

    ;* PHASE 3: EXECUTE DAS QUERY
    CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, ioTableSuffix, queryResult)

    IF queryResult = 'UNKNOWN.QUERY' THEN
        ioErrMsg = 'DAS.QUERY.FAILED'
        RETURN
    END

    ;* PHASE 4: PROCESS RESULTS
    IF queryResult = '' THEN
        ioErrMsg = 'CURRENCY.NOT.FOUND'
        RETURN
    END

    ;* Extract record from result
    ioRatesRecord = queryResult<1>
    ioRatesId = ioRatesRecord<CURRENCY.ID>

RETURN
END
```

**Key Points:**

- Query single table (CURRENCY)
- Single condition (EQ)
- Multiple fields returned
- Error handling for UNKNOWN.QUERY and no results

### Example 2: Query CURRENCY.MARKET with Multiple Conditions

**File:** `DAS.CURRENCY.MARKET.b` (private method)

```jbc
SUBROUTINE DAS.CURRENCY.MARKET(iMarketId, iCurrencyCode, ioTableSuffix, oMarketRecord)
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_CURRENCY_MARKET_FIELDS
    $INSERT I_DAS.CURRENCY.MARKET

    oMarketRecord = ''

    ;* PHASE 1: VALIDATE INPUT
    IF iMarketId = '' OR iCurrencyCode = '' THEN
        ETEXT = 'REQUIRED.MARKET.PARAMETERS'
        RETURN
    END

    ;* PHASE 2: BUILD QUERY - TWO CONDITIONS (AND)
    MY.TABLE = 'CURRENCY.MARKET'

    ;* Define fields to retrieve
    MY.FIELDS = MARKET.ID:@FM:MARKET.CURRENCY:@FM:MARKET.SPREAD.ROUTINE
    MY.FIELDS := @FM:MARKET.BUY.RATE:@FM:MARKET.SELL.RATE:@FM:MARKET.MID.RATE

    ;* Build WHERE clause: marketId = value AND currency = value
    MY.OPERANDS = ''

    ;* First condition: MARKET.ID = iMarketId
    MY.OPERANDS<1,1> = 'EQ'
    MY.OPERANDS<1,2> = MARKET.ID
    MY.OPERANDS<1,3> = iMarketId

    ;* Second condition: MARKET.CURRENCY = iCurrencyCode (AND)
    MY.OPERANDS<2,1> = 'EQ'
    MY.OPERANDS<2,2> = MARKET.CURRENCY
    MY.OPERANDS<2,3> = iCurrencyCode

    MY.DATA = ''
    MY.JOINS = ''

    ;* PHASE 3: EXECUTE DAS
    CALL DAS.CURRENCY.MARKET(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, ioTableSuffix, queryResult)

    IF queryResult = 'UNKNOWN.QUERY' THEN
        ETEXT = 'DAS.QUERY.FAILED'
        RETURN
    END

    ;* PHASE 4: PROCESS RESULTS
    IF queryResult = '' THEN
        ;* No market found - not necessarily an error
        RETURN
    END

    ;* Extract single record
    oMarketRecord = queryResult<1>

RETURN
END
```

**Key Points:**

- Multiple conditions in single query
- Both conditions are AND operations
- Complex field list
- Empty result is valid (market may not exist)

### Example 3: Query with Pattern Matching

**File:** `DAS.CURRENCY.GROUP.b` (private method)

```jbc
SUBROUTINE DAS.CURRENCY.GROUP(iGroupNamePattern, ioTableSuffix, oGroupRecords)
    $INSERT I_COMMON
    $INSERT I_EQUATE
    $INSERT I_CURRENCY_GROUP_FIELDS
    $INSERT I_DAS.CURRENCY.GROUP

    oGroupRecords = ''

    ;* PHASE 1: VALIDATE INPUT
    IF iGroupNamePattern = '' THEN
        ETEXT = 'GROUP.PATTERN.REQUIRED'
        RETURN
    END

    ;* PHASE 2: BUILD QUERY - PATTERN MATCHING
    MY.TABLE = 'CURRENCY.GROUP'

    ;* Define fields
    MY.FIELDS = GROUP.ID:@FM:GROUP.DESCRIPTION:@FM:GROUP.CURRENCIES

    ;* Use LK (LIKE) operator for pattern matching
    MY.OPERANDS = ''
    MY.OPERANDS<1,1> = 'LK'                  ;* LIKE operator for pattern
    MY.OPERANDS<1,2> = GROUP.DESCRIPTION
    MY.OPERANDS<1,3> = iGroupNamePattern     ;* Can include wildcards (*)

    MY.DATA = ''
    MY.JOINS = ''

    ;* PHASE 3: EXECUTE DAS
    CALL DAS.CURRENCY.GROUP(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, ioTableSuffix, queryResult)

    IF queryResult = 'UNKNOWN.QUERY' THEN
        ETEXT = 'DAS.QUERY.FAILED'
        RETURN
    END

    ;* PHASE 4: PROCESS RESULTS - MULTIPLE RECORDS
    IF queryResult = '' THEN
        ;* No groups matched pattern
        RETURN
    END

    ;* All results are returned field-marked
    oGroupRecords = queryResult

RETURN
END
```

**Calling Pattern:**

```jbc
;* Find all groups with 'MAJOR' in description
pattern = '*MAJOR*'
CALL DAS.CURRENCY.GROUP(pattern, TABLE.SUFFIX, groupRecords)

;* Access returned records
FOR i = 1 TO DCOUNT(groupRecords, @FM)
    group = groupRecords<i>
    groupId = group<GROUP.ID>
    groupDesc = group<GROUP.DESCRIPTION>
    ;* Process group...
NEXT i
```

**Key Points:**

- Pattern matching with LK operator
- Wildcards supported in search value
- Multiple records returned (field-marked)
- Iteration through results

### Example 4: DAS Service in Component Definition

**File:** `ST_CurrencyConfig/Definition/ST.CurrencyConfig.component`

```
public method GetCurrencyRecord (
    INOUT CcyCompMne string,
    INOUT RatesId string,
    INOUT RatesRecord string,
    INOUT ErrMsg string
)
{
    jBC: GET.CURRENCY.RECORD
}

public method DasCurrency (
    INOUT TheList string,
    INOUT TheArgs string,
    INOUT TableSuffix string
)
{
    jBC: DAS.CURRENCY
}

public method DasCurrencyMarket (
    INOUT TheList string,
    INOUT TheArgs string,
    INOUT TableSuffix string
)
{
    jBC: DAS.CURRENCY.MARKET
}
```

**Usage from API Layer:**

```jbc
FUNCTION ST.GET.RATE(buyCurrency, sellCurrency)
    $USING EB.API
    $USING ST.CurrencyConfig
    $USING EB.SystemTables

    rate = ''

    ;* Validate parameters
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

RETURN rate

PROCESS:
    ;* Use DAS service from config component
    ratesId = ''
    ratesRecord = ''
    errorMsg = ''
    TABLE.SUFFIX = ''

    ST.CurrencyConfig.GetCurrencyRecord(buyCurrency, ratesId, ratesRecord, errorMsg)

    IF errorMsg THEN
        ebErrorParam = 'EB-CURRENCY.NOT.FOUND'
        ebErrorParam<-1> = errorMsg
        EB.API.setException(ebErrorParam)
        RETURN
    END

    ;* Extract rate from record
    rate = ratesRecord<CURRENCY.BUY.RATE>
RETURN

END
```

**Key Points:**

- DAS service called from API layer through component
- Error handling at API boundary
- Field equates used to access record data
- Result properly validated

### Example 5: Field Equate Include Structure

**File:** `ST_CurrencyConfig/Data/Public/I_CURRENCY_FIELDS.d`

```jbc
* Currency field equates
CURRENCY.ID = 1
CURRENCY.CODE = 2
CURRENCY.NAME = 3
CURRENCY.MARKET = 12
CURRENCY.BUY.RATE = 16
CURRENCY.SELL.RATE = 17
CURRENCY.MID.RATE = 14
CURRENCY.QUOTATION.CODE = 5
CURRENCY.QUOTATION.PIPS = 6

* Derived aliases for clarity
CURRENCY.RATE = CURRENCY.MID.RATE    ;* Default rate is mid rate
CURRENCY.DECIMAL.PLACES = 4           ;* Standard forex decimals
```

**Usage:**

```jbc
$INSERT I_CURRENCY_FIELDS

;* Access field by equate
currencyRecord = R.CURRENCY
code = currencyRecord<CURRENCY.CODE>
rate = currencyRecord<CURRENCY.BUY.RATE>

;* Build response
response<CURRENCY.CODE> = code
response<CURRENCY.RATE> = rate
```

---

## Common DAS Error Scenarios

### Scenario 1: Record Not Found

```jbc
;* Expected behavior: Empty result is valid
CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, TABLE.SUFFIX, result)

IF result = 'UNKNOWN.QUERY' THEN
    ;* DAS error - query syntax wrong
    ETEXT = 'DAS.ERROR'
    RETURN
END

IF result = '' THEN
    ;* Record not found - valid empty result
    ;* Continue processing or return empty
    RETURN
END

;* Record found - process it
record = result<1>
```

### Scenario 2: Multiple Records with Limits

```jbc
;* Query might return many records - consider pagination/limits
CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, TABLE.SUFFIX, result)

;* Count results
recordCount = DCOUNT(result, @FM)

IF recordCount > 100 THEN
    ;* Too many results - add more restrictive query
    ETEXT = 'TOO.MANY.RESULTS'
    RETURN
END

;* Process all results
FOR i = 1 TO recordCount
    record = result<i>
    ;* Process record
NEXT i
```

### Scenario 3: Multi-Tenancy (TABLE.SUFFIX)

```jbc
;* TABLE.SUFFIX supports multi-tenancy
;* Different companies might have their own data tables
;* Suffix is appended to table names

TABLE.SUFFIX = 'COMPANY001'    ;* Optional suffix for multi-company

;* Query with suffix
CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS, MY.DATA, MY.JOINS, TABLE.SUFFIX, result)

;* DAS internally uses: CURRENCY.COMPANY001 if suffix provided
;*                    CURRENCY if no suffix
```

---

## Summary: DAS Pattern Usage

**Start Here:**

1. Define MY.TABLE (single table name)
2. Define MY.FIELDS (colon-separated field list)
3. Build MY.OPERANDS (WHERE clause)
4. Call DAS service
5. Check for UNKNOWN.QUERY error
6. Process results (could be empty)

**For Complex Queries:**

- Use multiple conditions (MY.OPERANDS<2,_>, MY.OPERANDS<3,_>)
- Use pattern matching (LK operator)
- Use range queries (GE, LE, GT, LT)
- Filter results in application code if needed

**Always Remember:**

- DAS is ALWAYS better than direct file I/O
- Handle empty results gracefully
- Check for query errors
- Use field equates, not magic numbers
- Validate input parameters
