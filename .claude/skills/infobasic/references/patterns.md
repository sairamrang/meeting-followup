# InfoBasic Code Patterns Reference

## Table of Contents

1. [Control Flow Patterns](#control-flow-patterns)
2. [Loop Patterns](#loop-patterns)
3. [BEGIN CASE Patterns](#begin-case-patterns)
4. [String Operations](#string-operations)
5. [Multi-Value Field Patterns](#multi-value-field-patterns)
6. [Structure Field Access](#structure-field-access)
7. [Logging Patterns](#logging-patterns)
8. [Comment Standards](#comment-standards)

---

## Control Flow Patterns

### Standard GOSUB Flow

```basic
GOSUB initialise
GOSUB localInitialise
GOSUB process
IF ETEXT THEN
    RETURN
END
GOSUB finalise
RETURN
```

### Conditional GOSUB

```basic
IF condition1 THEN
    GOSUB handleCondition1
END ELSE
    GOSUB handleDefault
END
```

### Early Return Pattern

```basic
process:
    GOSUB validateInput
    IF ETEXT THEN RETURN

    GOSUB fetchData
    IF NOT(dataFound) THEN
        GOSUB setNotFoundError
        RETURN
    END

    GOSUB processData
    RETURN
```

### Nested IF (Max 3-4 Levels)

```basic
IF condition1 THEN
    IF condition2 THEN
        IF condition3 THEN
            GOSUB action
        END ELSE
            GOSUB alternateAction
        END
    END
END
```

---

## Loop Patterns

### LOOP/WHILE/REPEAT

```basic
loopCounter = 1
maxIterations = DCOUNT(itemList, @FM)

LOOP
WHILE loopCounter LE maxIterations
    currentItem = itemList<loopCounter>
    GOSUB processItem
    loopCounter += 1
REPEAT
```

### REMOVE Pattern (Efficient Multi-Value Processing)

```basic
moreItems = 1
LOOP
WHILE moreItems
    REMOVE currentItem FROM itemList SETTING positionMarker
    IF currentItem NE '' THEN
        GOSUB processItem
    END
    moreItems = (positionMarker GT 0)
REPEAT
```

### FOR/NEXT Loop

```basic
FOR idx = 1 TO itemCount
    currentItem = itemList<idx>
    GOSUB processItem
NEXT idx
```

### Nested Loop Pattern

```basic
FOR outerIdx = 1 TO outerCount
    FOR innerIdx = 1 TO innerCount
        value = dataArray<outerIdx, innerIdx>
        GOSUB processValue
    NEXT innerIdx
NEXT outerIdx
```

---

## BEGIN CASE Patterns

### Standard BEGIN CASE

```basic
BEGIN CASE
    CASE statusCode EQ '620'
        GOSUB handlePending

    CASE statusCode EQ '621' OR statusCode EQ '622'
        GOSUB handleInProgress

    CASE statusCode EQ '630'
        GOSUB handleComplete

    CASE OTHERWISE
        GOSUB handleUnknownStatus
END CASE
```

### BEGIN CASE with Return Values

```basic
BEGIN CASE
    CASE operationType EQ 'CREATE'
        resultAction = 'INSERT'

    CASE operationType EQ 'UPDATE'
        resultAction = 'MODIFY'

    CASE operationType EQ 'DELETE'
        resultAction = 'REMOVE'

    CASE OTHERWISE
        resultAction = ''
        ETEXT = 'UNKNOWN.OPERATION'
END CASE
```

### Nested BEGIN CASE

```basic
BEGIN CASE
    CASE categoryType EQ 'PAYMENT'
        BEGIN CASE
            CASE subType EQ 'CREDIT'
                GOSUB processCreditPayment
            CASE subType EQ 'DEBIT'
                GOSUB processDebitPayment
            CASE OTHERWISE
                GOSUB processGenericPayment
        END CASE

    CASE categoryType EQ 'TRANSFER'
        GOSUB processTransfer

    CASE OTHERWISE
        GOSUB handleUnknown
END CASE
```

---

## String Operations

### String Concatenation

```basic
fullKey = companyID : '*' : ftNumber
logMessage = 'Processing: ' : fullKey : ' at ' : TIMEDATE()
```

### String Length and Substring

```basic
stringLength = LEN(inputString)
firstThreeChars = inputString[1,3]
lastFiveChars = inputString[stringLength-4,5]
```

### TRIM and CONVERT

```basic
cleanedValue = TRIM(inputValue)
convertedValue = CONVERT(@FM, ',', multiValueField)
```

### CHANGE (Replace)

```basic
modifiedString = CHANGE(originalString, 'OLD', 'NEW')
```

### FIELD Function

```basic
* Extract part of delimited string
firstPart = FIELD(delimitedString, '*', 1)
secondPart = FIELD(delimitedString, '*', 2)
```

---

## Multi-Value Field Patterns

### DCOUNT (Count Values)

```basic
valueCount = DCOUNT(multiValueField, @FM)
subValueCount = DCOUNT(multiValueField<fieldPos>, @VM)
```

### Accessing Multi-Values

```basic
* Single value access
firstValue = record<1>

* Multi-value access (field 5, value 3)
specificValue = record<5,3>

* Sub-value access (field 5, value 3, subvalue 2)
subValue = record<5,3,2>
```

### Building Multi-Value Fields

```basic
* Append to field
record<fieldPos, -1> = newValue

* Set specific position
record<fieldPos, valuePos> = newValue

* Build from loop
outputField = ''
FOR idx = 1 TO itemCount
    IF outputField NE '' THEN
        outputField := @VM
    END
    outputField := processedItems<idx>
NEXT idx
```

### LOCATE Pattern

```basic
LOCATE searchValue IN multiValueField<1> BY 'AL' SETTING foundPos THEN
    * Value found at foundPos
    GOSUB handleFound
END ELSE
    * Value not found, foundPos indicates insertion point
    GOSUB handleNotFound
END
```

---

## Structure Field Access

### Simple Field Access

```basic
* Reading
statusCode = paymentRecord<PaymentRecord.statusCode>
ftNumber = paymentRecord<PaymentRecord.ftNumber>

* Writing
paymentRecord<PaymentRecord.statusCode> = '621'
paymentRecord<PaymentRecord.processedDate> = TODAY
```

### Nested Structure Access

```basic
* Access response message fields
oResponse<PaymentResponse.returnCode> = 'FAILURE'
oResponse<PaymentResponse.serviceName> = serviceName
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageCode> = errorCode
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageType> = 'FATAL_ERROR'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageText> = ''
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageInfo> = additionalInfo
```

### Building Complex Structures

```basic
* Build payment ID structure
iPaymentID = ''
iPaymentID<PaymentID.ftNumber> = ftNumber
iPaymentID<PaymentID.companyID> = companyID
iPaymentID<PaymentID.clearingNature> = clearingNature

* Build transaction context
iTransactionContext = ''
iTransactionContext<TransactionContext.company> = companyID
iTransactionContext<TransactionContext.user> = OPERATOR
iTransactionContext<TransactionContext.application> = 'PP.PAYMENT'
```

---

## Logging Patterns

### Standard TPSLogging Calls

```basic
* At subroutine start
CALL TPSLogging("Start","ServiceImpl.methodName","","")

* Version/modification tracking
CALL TPSLogging("Version","ServiceImpl.methodName","Task-1234567, Date-01-JAN-2024","")

* Input parameter logging
CALL TPSLogging("Input Parameter","ServiceImpl.methodName","iPaymentID : <":iPaymentID:">","")

* Output parameter logging
CALL TPSLogging("Output Parameter","ServiceImpl.methodName","oResponse : <":oResponse:">","")

* Intermediate state logging
CALL TPSLogging("Processing","ServiceImpl.methodName","Status: ":statusCode:"->":newStatus,"")

* At subroutine end
CALL TPSLogging("End","ServiceImpl.methodName","","")
```

### Conditional Logging

```basic
IF debugMode EQ 'Y' THEN
    CALL TPSLogging("Debug","ServiceImpl.methodName","Variable dump: ":debugData,"")
END
```

---

## Comment Standards

### File Header

```basic
$PACKAGE PP.ServiceName
SUBROUTINE ServiceImpl.methodName(iInput, oOutput, responseDetails)
*-----------------------------------------------------------------------------
* @author developer@company.com
* @stereotype subroutine
* @package PP.ServiceName
* <p>Detailed description of what this subroutine does,
* its purpose in the system, and any important notes.</p>
* @param IN  iInput          - Description of input parameter
* @param OUT oOutput         - Description of output parameter
* @param OUT responseDetails - Standard response structure
*!
```

### Section Comments

```basic
*-----------------------------------------------------------------------------
* INITIALIZATION SECTION
*-----------------------------------------------------------------------------
initialise:
    * Setup service common and response structures
    CALL SetServiceCommon
    ...
    RETURN
```

### Modification History

```basic
* Modification History:
* 01-JAN-2024 - Task 1234567 - Initial implementation
* 15-FEB-2024 - Defect 2345678 - Fixed null pointer in validation
* 01-MAR-2024 - Enhancement 3456789 - Added support for new clearing type
```

### Inline Comments

```basic
;* Calculate business days excluding weekends
businessDays = 0
FOR dayIdx = 1 TO totalDays
    dayOfWeek = MOD(startDate + dayIdx, 7)
    IF dayOfWeek GT 0 AND dayOfWeek LT 6 THEN  ;* Mon-Fri only
        businessDays += 1
    END
NEXT dayIdx
```

### Region Markers

```basic
*** <region name=VALIDATION>
validateInput:
*** <desc>Validates all input parameters before processing</desc>
    IF iPaymentID EQ '' THEN
        ETEXT = 'MISSING.PAYMENT.ID'
        RETURN
    END
    ...
    RETURN
*** </region>
```

---

## Field Equate Conventions

Field equates are defined using standard T24 naming prefixes. These prefixes indicate the component or service area that owns the field definition.

### Common Field Equate Prefixes

| Prefix    | Component                 | Usage                                      |
| --------- | ------------------------- | ------------------------------------------ |
| **EB.\*** | Temenos Core (Enterprise) | Core T24 fields (EB.CUR.RANK, EB.CUS.NAME) |
| **AC.\*** | Accounts/Balances         | Account and balance fields                 |
| **FX.\*** | Foreign Exchange          | Currency and exchange rate fields          |
| **SC.\*** | Settlement Clearing       | Clearing and settlement fields             |
| **LD.\*** | Loans & Deposits          | Loan and deposit fields                    |
| **MM.\*** | Money Markets             | Money market related fields                |
| **FT.\*** | Funds Transfer            | Payment and transfer fields                |
| **PD.\*** | Product Definition        | Product configuration fields               |
| **ST.\*** | Custom Temenos Solutions  | Project-specific extensions                |

### Usage Example

```jbc
$INSERT I_CURRENCY_FIELDS        ;* Define equates via include file

;* Access record fields using equates instead of magic numbers
currencyRecord = R.CURRENCY
currencyCode = currencyRecord<EB.CUR.CODE>
currencyName = currencyRecord<EB.CUR.NAME>
rate = currencyRecord<EB.CUR.BUY.RATE>
quotation = currencyRecord<EB.CUR.QUOTATION.CODE>

;* Build multi-value structure using equates
result<CURRENCY.CODE> = currencyCode
result<CURRENCY.NAME> = currencyName
result<CURRENCY.RATE> = rate
```

### Benefits of Using Equates

1. **Self-Documenting Code** - Field names are clear and descriptive
2. **Maintainability** - If record structure changes, update equate definition once
3. **Error Reduction** - No magic numbers = fewer position-related bugs
4. **Code Review** - Reviewers understand intent without documentation
5. **IDE Support** - Better IDE navigation and search capabilities

---

## Caching Patterns

T24 provides two types of caching mechanisms: **Session Cache** and **Transaction Cache**. Understanding when and how to use each is important for performance and data consistency.

### Session Cache

Session cache persists for the duration of the user's session and can be shared across transactions.

```jbc
;* Put value in session cache
System.putCache("CACHE.KEY", cacheValue)

;* Retrieve value from session cache
cachedValue = System.getCache("CACHE.KEY")
```

**Usage Pattern:**

```jbc
;* Check cache first
cachedCurrency = System.getCache("CURRENCY." : currencyCode)

IF cachedCurrency = '' THEN
    ;* Not in cache - fetch from database
    CALL OPF('F.CURRENCY', F.CURRENCY)
    F.READ(F.CURRENCY, currency, currencyCode, readError)

    ;* Put in cache for future use
    System.putCache("CURRENCY." : currencyCode, currency)
ELSE
    ;* Use cached value
    currency = cachedCurrency
END
```

**Best For:**

- Read-only data that doesn't change during session
- Frequently accessed reference data (currencies, rates)
- Configuration values
- Multi-step workflows where same data used repeatedly

**Avoid Session Cache When:**

- Data changes frequently
- Multiple users might modify same record
- Real-time accuracy is required

### Transaction Cache

Transaction cache is scoped to the current transaction and cleared when transaction completes.

```jbc
;* Transaction-scoped caching
CACHE.READ(tableName, recordId, record)

;* Check if record already read in this transaction
IF record = '' THEN
    ;* Not cached - perform F.READ
    CALL OPF('F.CURRENCY', F.CURRENCY)
    F.READ(F.CURRENCY, record, recordId, readError)
END
```

**Usage Pattern:**

```jbc
;* Use CACHE.READ instead of F.READ for transaction cache
CACHE.READ('F.CURRENCY', currencyCode, currencyRecord)

IF currencyRecord = '' THEN
    ETEXT = 'CURRENCY.NOT.FOUND'
    RETURN
END
```

**Best For:**

- Records read multiple times within single transaction
- Temporary computed values
- Avoiding duplicate database reads
- Performance optimization within transaction boundaries

**Characteristics:**

- Automatically cleared at transaction end
- Automatically updated when record modified
- Scope limited to current transaction
- Lower contention than session cache

### Comparison Table

| Aspect      | Session Cache            | Transaction Cache             |
| ----------- | ------------------------ | ----------------------------- |
| Scope       | User session             | Single transaction            |
| Duration    | Until logout             | Until transaction end         |
| Sharing     | Across transactions      | Within transaction only       |
| Updates     | Manual (System.putCache) | Automatic (CACHE.READ)        |
| Concurrency | Potential conflicts      | Isolated                      |
| Real-time   | Not guaranteed           | Guaranteed within transaction |
| Use Case    | Reference data           | Temporary, transaction-scoped |

### Performance Considerations

**When to Cache:**

- Expensive calculations (e.g., exchange rate lookup)
- Frequently accessed data
- Multi-step workflows
- Reference data reads

**When NOT to Cache:**

- Rapidly changing data
- Data shared across users
- Sensitive data needing fresh values
- Single-read operations

### Example: Caching Strategy

```jbc
;* Best practice: Cache with validation
GOSUB GET.CURRENCY.RATE

GET.CURRENCY.RATE:
    ;* Try cache first (session)
    cacheKey = "RATE." : buyCurrency : "." : sellCurrency : "." : exchangeDate
    rate = System.getCache(cacheKey)

    IF rate = '' THEN
        ;* Not in session cache
        ;* Try transaction cache
        CACHE.READ('F.CURRENCY.RATES', cacheKey, rateRecord)

        IF rateRecord = '' THEN
            ;* Not in any cache - fetch from DB
            CALL OPF('F.CURRENCY.RATES', F.CURRENCY.RATES)
            F.READ(F.CURRENCY.RATES, rateRecord, cacheKey, readError)

            IF readError THEN
                ETEXT = 'RATE.NOT.FOUND'
                RETURN
            END
        END

        ;* Put in session cache for future use
        rate = rateRecord<RATE.FIELD>
        System.putCache(cacheKey, rate)
    END
RETURN
```

This pattern combines both cache types:

1. Check session cache (fast, but not guaranteed fresh)
2. Check transaction cache (fresher, transaction-scoped)
3. Read from database (guaranteed fresh)
4. Store in session cache (for future use)
