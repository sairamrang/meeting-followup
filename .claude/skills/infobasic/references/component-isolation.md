# Component Isolation Definition Reference

## Overview

Component Isolation Definitions (`.component` files) define the published API surface of a component, mapping API methods to their jBC implementations. They serve as the bridge between the object-oriented API layer and the functional jBC subroutine layer.

**Key Concepts:**

- **Component** - Package containing related functionality
- **Published API Methods** - Methods exposed to external callers
- **jBC Mapping** - Maps each API method to its implementation subroutine
- **Data Structures** - Define return types and complex parameter structures
- **Access Control** - Public/private/module visibility rules

---

## Component Definition File Structure

```
component ComponentName
metamodelVersion 1.6
@APIClass namespace.ClassName

@Version 1.0.0

;* Properties (optional)
published member readwrite fieldName : dataType

;* Public methods (API exposed)
published method methodName : returnType (...)

;* Private methods (internal only)
private method helperMethod : void (...)

;* Module methods (component-visible)
module method internalMethod : string (...)

;* Data structures (complex types)
published class StructureName { ... }

;* Table definitions (map to T24 files)
public table TableName {
    t24: T24.TABLE.NAME
    fields: { ... }
}
```

---

## Core Concepts

### 1. Component Declaration

```
component ST.CurrencyApi
metamodelVersion 1.6
@APIClass rates.Currency
@Version 0.0.1
```

**Elements:**

- `component` - Component name (must match directory/filename)
- `metamodelVersion` - Compatibility version (typically 1.6)
- `@APIClass` - Java package and class name for API exposure
- `@Version` - Component version number

### 2. Method Definition Structure

```
published method methodName : returnType (
    IN paramName1 paramType1,
    IN paramName2 paramType2,
    OUT outParam string,
    INOUT inoutParam number,
    CONSTANT "LITERAL_VALUE"
)
{
    jBC: SUBROUTINE.NAME
}
```

**Method Elements:**

- `published/private/module` - Visibility scope
- `method name` - API method name (camelCase)
- `: returnType` - Return value type
- Parameters with direction:
  - `IN` - Input-only (caller provides)
  - `OUT` - Output-only (callee sets)
  - `INOUT` - Bidirectional (both read and write)
- `CONSTANT` - Literal value passed to jBC
- `{ jBC: SUBROUTINE.NAME }` - jBC implementation mapping

### 3. Parameter Types

| Type                   | Java Mapping | Usage               |
| ---------------------- | ------------ | ------------------- |
| `string`               | String       | Text/codes          |
| `number`               | BigDecimal   | Amounts, quantities |
| `date`                 | Calendar     | Date fields         |
| `boolean`              | Boolean      | Flags, yes/no       |
| `Component:Type`       | Custom class | Complex structures  |
| `list<Type>`           | List         | Multiple values     |
| `records.TABLE:Record` | T24 Record   | Database records    |

### 4. Return Type Specification

**Simple Return Types:**

```
method getName : string (IN id string)        ;* Returns string
method getAmount : number (IN id string)      ;* Returns number
method getDate : date (IN id string)          ;* Returns date
method isActive : boolean (IN id string)      ;* Returns boolean
```

**Complex Return Types:**

```
method getRate : ST.CurrencyApi:ForwardRate (...)    ;* Returns custom structure
method getRates : list<ST.CurrencyApi:Rate> (...)    ;* Returns list of structures
method getRecord : records.CURRENCY:Record (...)     ;* Returns T24 record
```

### 5. Method Visibility

| Visibility  | Usage                   | API Accessible |
| ----------- | ----------------------- | -------------- |
| `published` | Public API methods      | Yes            |
| `public`    | DAS and utility methods | Yes            |
| `private`   | Internal helpers        | No             |
| `module`    | Component-internal      | No             |

---

## Real-World Examples

### Example 1: Simple API Method (ST.CurrencyApi)

**Component Definition:**

```
published method calculateExchangeRate : number (
    IN localAmount number,
    IN dealCurrency string,
    IN dealAmount number
)
{
    jBC: ST.CALCULATE.EXCHANGE.RATE
}
```

**Corresponding jBC:**

```jbc
FUNCTION ST.CALCULATE.EXCHANGE.RATE(localAmount, dealCurrency, dealAmount)
    $USING EB.API
    $USING ST.ExchangeRate
    $USING EB.SystemTables

    exchangeRate = ''

    parameterNames = 'localAmount':@FM:'dealCurrency':@FM:'dealAmount'
    parameterValues = localAmount:@FM:dealCurrency:@FM:dealAmount
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
    ST.ExchangeRate.CalcErateLocal(localAmount, dealCurrency, dealAmount, exchangeRate)
    IF EB.SystemTables.getEtext() THEN
        ebErrorParam = 'EB-INTERNAL.ERROR'
        ebErrorParam<-1> = EB.SystemTables.getEtext()
        EB.API.setException(ebErrorParam)
    END
RETURN

END
```

**Mapping:**

- `localAmount` (IN number) → 1st parameter
- `dealCurrency` (IN string) → 2nd parameter
- `dealAmount` (IN number) → 3rd parameter
- Return `: number` → exchangeRate value returned

### Example 2: Complex Return Type (ST.CurrencyApi)

**Component Definition:**

```
published method calculateForwardBidValueRate : ST.CurrencyApi:ForwardRate (
    IN currencyMarket number,
    IN buyCurrency string,
    IN sellCurrency string,
    IN exchangeDate date,
    IN midReval boolean,
    IN interpolate string,
    CONSTANT "BID_RATE"
)
{
    jBC: ST.CALCULATE.FOWARD.RATE
}
```

**Component Data Structure Definition:**

```
published class ForwardRate {
    buyRate : number
    sellRate : number
    baseCurrency : string
    daysSpotDate : number
}
```

**Corresponding jBC Return Structure:**

```jbc
;* The jBC FUNCTION returns multi-value field matching ForwardRate:
;* <1> buyRate
;* <2> sellRate
;* <3> baseCurrency
;* <4> daysSpotDate
result = buyRate:@FM:sellRate:@FM:baseCurrency:@FM:daysSpotDate
RETURN result
```

### Example 3: DAS Layer Method (ST.CurrencyConfig)

**Component Definition:**

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
```

**Usage Pattern:**

- All parameters are `INOUT` - caller provides input, jBC modifies output
- No return type specified (void - methods modify parameters)
- Maps to DAS service layer subroutine

### Example 4: Table Definition

**Component Definition:**

```
public table Currency {
    t24: CURRENCY
    fields:{
        EbCurRank(EB.CUR.RANK) = 1
        EbCurNumericCcyCode(EB.CUR.NUMERIC.CCY.CODE) = 2
        EbCurCcyName(EB.CUR.CCY.NAME) = 3
        EbCurNoOfDecimals(EB.CUR.NO.OF.DECIMALS) = 4
        EbCurQuotationCode(EB.CUR.QUOTATION.CODE) = 5
        EbCurQuotationPips(EB.CUR.QUOTATION.PIPS) = 6
        ...
    }
}
```

**Components:**

- `t24: CURRENCY` - Maps to T24 table name
- `fields:{ ... }` - Define accessible fields with positions
- Format: `PropertyName(EQUATE.NAME) = fieldPosition`

---

## Method Parameter Mapping Rules

### Rule 1: IN Parameters

```
Component Definition:
    IN paramName type

jBC Function Parameter:
    FUNCTION example(paramName, ...)
        ;* Read paramName but don't modify
```

Caller provides value → jBC receives and reads only.

### Rule 2: OUT Parameters

```
Component Definition:
    OUT paramName type

jBC Function Parameter:
    SUBROUTINE example(..., paramName)
        paramName = calculatedValue
        RETURN
```

jBC sets value → Caller receives result.

### Rule 3: INOUT Parameters

```
Component Definition:
    INOUT paramName type

jBC Function Parameter:
    SUBROUTINE example(..., paramName)
        ;* Read existing paramName
        ;* Modify paramName
        paramName = modifiedValue
        RETURN
```

Bidirectional - both can read and write.

### Rule 4: CONSTANT Parameters

```
Component Definition:
    CONSTANT "LITERAL_VALUE"

jBC Function Parameter:
    ;* Passed as additional parameter to jBC
    FUNCTION example(param1, param2, "LITERAL_VALUE")
```

Literal value automatically provided - not from caller.

### Rule 5: MEMBER References

```
Component Definition:
    IN MEMBER propertyName

jBC Function Parameter:
    ;* Accesses published property from same component
    published member readwrite currencyId : string
```

Accesses component property, not a method parameter.

---

## Data Structure Definitions

### Simple Data Structure

```
published class ExchangeAmount {
    buyAmountLcy : number
    buyAmountFcy : number
    sellAmountLcy : number
    sellAmountFcy : number
}
```

**jBC Representation (multi-value):**

```jbc
result = buyAmountLcy:@FM:buyAmountFcy:@FM:sellAmountLcy:@FM:sellAmountFcy
RETURN result
```

**Field Access Order:**

- <1> buyAmountLcy
- <2> buyAmountFcy
- <3> sellAmountLcy
- <4> sellAmountFcy

### Nested Data Structure

```
published class ComplexData {
    mainField : string
    rateInfo : ST.CurrencyApi:RateInfo
    amountInfo : ST.CurrencyApi:AmountInfo
}
```

**jBC Representation (using value marks @VM):**

```jbc
rateInfo = rate1:@VM:rate2:@VM:rate3
amountInfo = amount1:@VM:amount2
result = mainField:@FM:rateInfo:@FM:amountInfo
RETURN result
```

**Field Hierarchy:**

- <1> mainField
- <2, 1> rate1
- <2, 2> rate2
- <2, 3> rate3
- <3, 1> amount1
- <3, 2> amount2

### List Data Structure

```
published method getCurrencyRates : list<ST.CurrencyApi:CurrencyRate> (...)
```

**jBC Representation (using field marks):**

```jbc
;* Build list of structures (each separated by @FM)
GOSUB BUILD.RATES

result = ''
FOR i = 1 TO DCOUNT(rateList, @FM)
    rate = rateList<i>
    IF result = '' THEN
        result = rate
    END ELSE
        result := @FM:rate
    END
NEXT i

RETURN result
```

---

## Component Property Definitions

### Readable Property

```
published member read currencyId : string
```

Can be read by caller, not modified.

### Writable Property

```
published member write currencyId : string
```

Can be written by caller, not read.

### Read-Write Property

```
published member readwrite currencyId : string
```

Both readable and writable by caller.

### Property Usage in Methods

```
published method processWithCurrency : number (
    IN amount number
)
{
    jBC: PROCESS.WITH.PROPERTY
}
```

jBC can read `currencyId` property:

```jbc
FUNCTION PROCESS.WITH.PROPERTY(amount)
    ;* Access component property (set via member definition)
    ;* Member must be set before calling this method
    ;* Property available as local variable
    ...
```

---

## Common Method Patterns

### Pattern 1: Single Input, Single Output

```
published method calculateRate : number (
    IN buyCurrency string,
    IN sellCurrency string
)
{
    jBC: CALCULATE.RATE
}
```

### Pattern 2: Multiple Inputs, Complex Output

```
published method getDetails : ST.Api:DetailInfo (
    IN recordId string,
    IN historyDate date,
    IN marketId string
)
{
    jBC: GET.DETAILS
}
```

### Pattern 3: Input and Output Parameters

```
published method processRecord : void (
    INOUT recordData string,
    OUT processError string
)
{
    jBC: PROCESS.RECORD
}
```

### Pattern 4: List Return

```
published method getAllRates : list<ST.Api:RateRecord> (
    IN currencyCode string,
    IN startDate date,
    IN endDate date
)
{
    jBC: GET.RATE.LIST
}
```

### Pattern 5: Using Member Properties

```
published member readwrite currencyCode : string

published method getRateForCurrency : number (
    IN date date
)
{
    jBC: GET.RATE
}
```

jBC can access currencyCode from the component instance.

---

## Key Mapping Rules Summary

| Component Element      | jBC Equivalent           | Notes                   |
| ---------------------- | ------------------------ | ----------------------- |
| `published method`     | `FUNCTION name`          | API entry point         |
| `: returnType`         | `RETURN value`           | Single return value     |
| `IN param`             | 1st parameter            | Input only              |
| `OUT param`            | Output parameter         | Callee sets             |
| `INOUT param`          | Bi-directional parameter | Both read/write         |
| `CONSTANT "value"`     | Literal parameter        | Auto-provided           |
| `MEMBER property`      | Component property       | Access via object state |
| `: Type`               | Scalar value             | Simple return           |
| `: Component:Type`     | Multi-value field        | Complex structure       |
| `: list<Type>`         | Field-marked list        | Multiple items @FM      |
| `: records.T24:Record` | T24 record field         | Database record         |

---

## Anti-Patterns

### ❌ Mismatched Parameter Count

```jbc
;* WRONG: Component says 3 IN params, jBC function takes 2
published method calculate : number (
    IN param1 number,
    IN param2 number,
    IN param3 number
)
{
    jBC: CALCULATE.RATE    ;* Only takes 2 params!
}
```

### ❌ Wrong Parameter Direction

```jbc
;* WRONG: Component marks param as OUT but jBC reads it
published method process : void (
    OUT resultParam string
)
{
    jBC: PROCESS.DATA  ;* Tries to read resultParam before setting
}
```

### ❌ Returning Wrong Data Structure

```jbc
;* WRONG: Component expects ForwardRate structure, jBC returns scalar
published method getForwardRate : ST.CurrencyApi:ForwardRate (
    IN date date
)
{
    jBC: GET.FORWARD.RATE
}

;* jBC implementation:
FUNCTION GET.FORWARD.RATE(date)
    result = someRate      ;* Only one field instead of multi-value
RETURN result
END
```

### ❌ Forgetting CONSTANT in jBC

```jbc
;* WRONG: Component passes CONSTANT but jBC doesn't handle extra param
published method calculateRate : number (
    IN buyCurrency string,
    IN sellCurrency string,
    CONSTANT "BID_RATE"
)
{
    jBC: CALC.RATE
}

;* jBC implementation:
FUNCTION CALC.RATE(buyCurrency, sellCurrency)
    ;* Missing third parameter for "BID_RATE"!
```

**Better:**

```jbc
FUNCTION CALC.RATE(buyCurrency, sellCurrency, rateType)
    ;* rateType will be "BID_RATE"
```

---

## Key Takeaways

1. **Component files define the API contract** - What caller expects
2. **jBC implementations must match the contract** - Parameter count, types, directions
3. **Method visibility controls API exposure** - Use `published` for API, `private` for internal
4. **Parameter directions are critical** - IN/OUT/INOUT determine data flow
5. **Return types drive structure** - Must return correct shape of data
6. **CONSTANT parameters are automatic** - jBC receives without caller providing
7. **Data structures use multi-value fields** - @FM for top level, @VM for nested
8. **Table definitions map to T24 records** - Provide field equates and positions
9. **MEMBER properties are component state** - Available to all methods in component
10. **Mapping must be exact** - Mismatches cause runtime errors
