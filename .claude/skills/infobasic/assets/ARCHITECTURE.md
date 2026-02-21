# T24/Temenos Architecture Diagrams

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATION                           │
│                   (Java/REST Client)                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ API Call
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              COMPONENT ISOLATION DEFINITION                      │
│                  (.component file)                              │
│                                                                 │
│  published method calculateExchangeRate : number (...)          │
│  {                                                              │
│      jBC: ST.CALCULATE.EXCHANGE.RATE                            │
│  }                                                              │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Route to jBC
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│              API LAYER (FUNCTION)                               │
│         ST.CALCULATE.EXCHANGE.RATE.b                            │
│                                                                 │
│  ┌─ PHASE 1: Parameter Validation                              │
│  │  ├─ EB.API.checkEmptyParameters()                           │
│  │  └─ EB.API.setException() [on error]                        │
│  │                                                              │
│  └─ PHASE 2: Business Logic                                    │
│     └─ Call Service Layer                                       │
│        └─ Check EB.SystemTables.getEtext()                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Call Service
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│            SERVICE LAYER (EXCHANGE RATE CALCULATION)             │
│         ST.ExchangeRate.CalcErateLocal.b                        │
│                                                                 │
│  ├─ Fetch currency configuration                               │
│  ├─ Calculate rate logic                                        │
│  └─ Return result or error                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Read configuration/data
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│         DAS LAYER (DATA ACCESS SERVICE)                          │
│       ST_CurrencyConfig Component                               │
│                                                                 │
│  ├─ DAS.CURRENCY.b                                             │
│  ├─ GET.CURRENCY.RECORD.b                                      │
│  └─ DAS.CURRENCY.MARKET.b                                      │
│                                                                 │
│  DAS Pattern:                                                   │
│  ├─ Build MY.TABLE, MY.FIELDS, MY.OPERANDS                     │
│  ├─ Call DAS service                                            │
│  └─ Return results or error                                     │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           │ Query database
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│               T24 DATABASE TABLES                                │
│                                                                 │
│  ├─ F.CURRENCY                                                 │
│  ├─ F.CURRENCY.MARKET                                          │
│  ├─ F.CURRENCY.PARAM                                           │
│  └─ F.CCY.HISTORY                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Parameter Validation to Response

```
┌──────────────────┐
│  Input Request   │
│  {               │
│    param1:value1 │
│    param2:value2 │
│  }               │
└────────┬─────────┘
         │
         ▼
    ┌─────────────────────────────────┐
    │ Validate Parameters              │
    │ EB.API.checkEmptyParameters()    │
    └────┬──────────────────────────┬──┘
         │                          │
    NOT EMPTY                    EMPTY
         │                          │
         ▼                          ▼
    ┌──────────┐         ┌─────────────────────┐
    │ Continue │         │ Set Exception       │
    │ to Logic │         │ EB.API.setException │
    └────┬─────┘         └──────────┬──────────┘
         │                          │
         ▼                          ▼
    ┌──────────────────────┐    ┌───────────┐
    │ Call Service Layer   │    │ Return    │
    │ Check ETEXT          │    │ Error     │
    └────┬──────────┬──────┘    └───────────┘
         │          │
        OK       ERROR
         │          │
         ▼          ▼
    ┌───────────┐  ┌─────────────┐
    │ Build     │  │ Set         │
    │ Response  │  │ Exception   │
    └────┬──────┘  │ Return      │
         │         │ Empty       │
         │         └─────────────┘
         ▼
    ┌──────────────┐
    │ Return       │
    │ Result       │
    └──────────────┘
```

## Error Handling Flow

```
START: Function Call
  │
  ├─────────────────────────────────────────────────────┐
  │ PARAMETER VALIDATION                                │
  │                                                     │
  ▼ EB.API.checkEmptyParameters()                       │

  Empty Params Found?                                  │
  ├─ YES ──→ Set EB-EMPTY.PARAMETER Exception         │
  │          Return empty result                       │
  │                                                     │
  └─ NO ──→ Continue                                    │
         │                                              │
         ├─────────────────────────────────────────────┤
         │ BUSINESS VALIDATION                          │
         │                                              │
         ▼ Custom validation rules                      │

         Invalid Value?                                 │
         ├─ YES ──→ Set EB-INVALID.VALUE Exception     │
         │          Return empty result                │
         │                                              │
         └─ NO ──→ Continue                             │
                │                                       │
                ├───────────────────────────────────────┤
                │ CALL SERVICE LAYER                     │
                │                                        │
                ▼ Service.doWork(input, output)         │

                Check EB.SystemTables.getEtext()        │
                ├─ ERROR SET ──→ Set EB-INTERNAL.ERROR  │
                │                Return empty result     │
                │                                        │
                └─ NO ERROR ──→ Continue                │
                       │                                │
                       ▼                                │
                   Build Result
                   Return Success
```

## Component Isolation Structure

```
Component Definition File
(.component)
├── component declaration
│   ├── metamodelVersion
│   └── @APIClass reference
│
├── Properties
│   ├── published member read propertyName : type
│   ├── published member write propertyName : type
│   └── published member readwrite propertyName : type
│
├── Methods
│   ├── published method (API exposed)
│   │   ├── IN parameters
│   │   ├── OUT parameters
│   │   ├── INOUT parameters
│   │   ├── CONSTANT parameters
│   │   └── jBC mapping: { jBC: SUBROUTINE.NAME }
│   │
│   ├── public method (DAS layer)
│   │   └── jBC mapping
│   │
│   ├── private method (internal only)
│   │   └── jBC mapping
│   │
│   └── module method (component-visible)
│       └── jBC mapping
│
├── Data Structures
│   ├── published class StructureName
│   │   ├── field1 : type
│   │   ├── field2 : type
│   │   └── nestedClass : Component:NestedClass
│   │
│   └── return type mapping to multi-value fields
│
└── Table Definitions
    ├── public table TableName
    │   ├── t24: T24.TABLE.NAME
    │   └── fields: { field mappings }
    │
    └── Field equate mappings
```

## Testing Architecture

```
Test File (.tut)
│
├── TESTCASE Definition
│   ├── UTF.setTarget(ROUTINE.NAME)
│   └── UTF.setDescription(description)
│
├── Test Case 1: Parameter Validation
│   ├── UTF.reset()
│   ├── UTF.addParam(emptyValue)
│   ├── UTF.addStub('EB.API.checkEmptyParameters')
│   │   └── Configure stub behavior
│   ├── UTF.runTest()
│   └── UTF.assertEquals()
│
├── Test Case 2: Happy Path
│   ├── UTF.reset()
│   ├── UTF.addParam(validValue)
│   ├── UTF.addStub('SERVICE.LAYER')
│   │   └── Configure successful return
│   ├── UTF.runTest()
│   └── UTF.assertEquals(result, expectedValue)
│
├── Test Case 3: Service Error
│   ├── UTF.reset()
│   ├── UTF.addParam(validValue)
│   ├── UTF.addStub('SERVICE.LAYER')
│   │   └── Configure error return
│   ├── UTF.addStubPropertyChange('EB.SystemTables', 'Etext', 'ERROR')
│   ├── UTF.runTest()
│   └── UTF.assertEquals(exceptionCount, '1')
│
└── Helper Methods
    └── Reusable test logic
```

## Multi-Value Field Structure

```
Single-Value Record
┌─────────────────┐
│ Value1          │  <1>
└─────────────────┘

Multi-Value Field (using @FM - Field Mark)
┌─────────────────┐
│ Value1:@FM:     │  <1>
│ Value2:@FM:     │  <2>
│ Value3          │  <3>
└─────────────────┘

Nested Multi-Value (using @VM - Value Mark)
┌──────────────────────────┐
│ Field1:@FM:              │  <1>
│ (Val1:@VM:Val2):@FM:     │  <2,1> and <2,2>
│ Field3                   │  <3>
└──────────────────────────┘

Building Structure
result = value1:@FM:value2:@FM:value3
result<1> = value1
result<2> = value2
result<3> = value3

Building Nested
nested = subval1:@VM:subval2:@VM:subval3
result = mainfield:@FM:nested:@FM:otherfield
result<2,1> = subval1
result<2,2> = subval2
result<2,3> = subval3
```

## DAS Query Building Pattern

```
BUILD QUERY
│
├─ Define Table
│  └─ MY.TABLE = 'CURRENCY'
│
├─ Define Fields
│  └─ MY.FIELDS = FIELD1:@FM:FIELD2:@FM:FIELD3
│
├─ Define Operands (WHERE clause)
│  ├─ MY.OPERANDS<1,1> = 'EQ'           (operator)
│  ├─ MY.OPERANDS<1,2> = FIELD_EQUATE   (field to query)
│  ├─ MY.OPERANDS<1,3> = 'searchValue'  (search value)
│  │
│  └─ Multiple conditions:
│     ├─ MY.OPERANDS<1,*> (condition 1)
│     └─ MY.OPERANDS<2,*> (condition 2 - AND)
│
├─ Initialize DATA
│  └─ MY.DATA = ''
│
├─ Initialize JOINS
│  └─ MY.JOINS = ''
│
│ EXECUTE QUERY
│ └─ CALL DAS.CURRENCY(MY.TABLE, MY.FIELDS, MY.OPERANDS,
│                      MY.DATA, MY.JOINS, TABLE.SUFFIX, result)
│
│ CHECK RESULT
│ ├─ IF result = 'UNKNOWN.QUERY' → DAS error
│ ├─ IF result = '' → No records found
│ └─ ELSE → Process results
│
└─ EXTRACT FIELDS FROM RESULT
   ├─ record = result<1>
   ├─ field1 = record<FIELD.EQUATE>
   └─ field2 = record<ANOTHER.EQUATE>
```

## Module Import Pattern ($USING)

```
FUNCTION Definition
│
├─ $USING EB.API
│  └─ Access: EB.API.checkEmptyParameters()
│            EB.API.setException()
│
├─ $USING EB.SystemTables
│  └─ Access: EB.SystemTables.getEtext()
│
├─ $USING ST.ExchangeRate
│  └─ Access: ST.ExchangeRate.CalcErateLocal()
│
├─ $USING ST.CurrencyConfig
│  └─ Access: ST.CurrencyConfig.GetCurrencyRecord()
│
└─ $INSERT I_COMMON
   └─ Include: ETEXT, TODAY, OPERATOR, etc.
```
