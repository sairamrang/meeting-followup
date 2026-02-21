# Unit Testing Patterns (UTF Framework)

## Overview

The UTF (Unit Test Framework) is T24's built-in testing framework used to create and run unit tests for InfoBasic subroutines. UTF tests are defined in `.tut` files (Test Utility Framework format) and use special UTF methods to control test execution, mock dependencies, and verify behavior.

**Key Concepts:**

- **TESTCASE** - Named test suite containing multiple test scenarios
- **UTF.addParam()** - Supply function input parameters
- **UTF.addStub()** - Mock external dependencies (services, API calls)
- **UTF.runTest()** - Execute the function under test
- **UTF.assertEquals()** - Assert expected values
- **UTF.addStubPropertyChange()** - Mock system property changes

---

## .tut File Structure

### Basic Template

```jbc
TESTCASE routine.name.test
*-----------------------------------------------------------------------------
* Test suite for routine.name
*
* Tests:
*   - Positive case: Normal successful execution
*   - Error case: Parameter validation failure
*   - Service error: Service layer returns error
*
*-----------------------------------------------------------------------------

UTF.setTarget("ROUTINE.NAME")                    ;* Target routine being tested
UTF.setDescription("Test ROUTINE.NAME")          ;* Suite description

GOSUB positiveTestCase                           ;* Success scenario
GOSUB parameterErrorTestCase                     ;* Validation failure
GOSUB serviceErrorTestCase                       ;* Service layer error

RETURN

;* ============================================================
;* TEST CASE 1: Positive / Happy Path
;* ============================================================
positiveTestCase:
    UTF.reset()                                  ;* Clear all state

    ;* Setup input parameters
    param1 = 'value1'
    param2 = 'value2'
    UTF.addParam(param1)
    UTF.addParam(param2)

    ;* Setup stub for dependency
    stub = UTF.addStub('DEPENDENCY.SERVICE')
    UTF.addStubParam(stub, param1, UTF.same())
    UTF.addStubParam(stub, param2, UTF.same())
    UTF.addStubParam(stub, '', 'result_value')
    UTF.ignoreMissingStubs()

    ;* Execute test
    result = UTF.runTest("Test positive case")

    ;* Verify result
    UTF.assertEquals(result, 'result_value')
RETURN

;* ============================================================
;* TEST CASE 2: Parameter Validation Error
;* ============================================================
parameterErrorTestCase:
    UTF.reset()

    ;* Setup empty parameters (will fail validation)
    UTF.addParam('')
    UTF.addParam('')

    ;* Stub parameter validation failure
    stubName = UTF.addStub('EB.API.checkEmptyParameters')
    UTF.addStubParam(stubName, 'param1':@FM:'param2', UTF.same())
    UTF.addStubParam(stubName, '':@FM:'', UTF.same())
    UTF.addStubParam(stubName, '', 'param1':@FM:'param2')  ;* Return list of empty params

    ;* Expect exception to be set
    ebErrorParam = 'EB-EMPTY.PARAMETER'
    ebErrorParam<-1> = 'param1':@FM:'param2'
    exceptionStub = UTF.addStub('EB.API.setException')
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())

    ;* Execute and verify exception was called once
    UTF.runTest("Test parameter error case")
    count = UTF.getNbInvocation(exceptionStub)
    UTF.assertEquals(count, '1')
RETURN

;* ============================================================
;* TEST CASE 3: Service Layer Error
;* ============================================================
serviceErrorTestCase:
    UTF.reset()

    ;* Setup valid input
    param1 = 'value1'
    param2 = 'value2'
    UTF.addParam(param1)
    UTF.addParam(param2)

    ;* Stub service that will fail
    stub = UTF.addStub('DEPENDENCY.SERVICE')
    UTF.addStubParam(stub, param1, UTF.same())
    UTF.addStubParam(stub, param2, UTF.same())
    UTF.addStubParam(stub, '', '')  ;* Service returns empty (error)

    ;* Stub system error flag
    UTF.addStubPropertyChange(stub, 'EB.SystemTables', 'Etext', 'SERVICE.ERROR')

    ;* Expect exception for internal error
    ebErrorParam = 'EB-INTERNAL.ERROR'
    ebErrorParam<-1> = 'SERVICE.ERROR'
    exceptionStub = UTF.addStub('EB.API.setException')
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())
    UTF.ignoreMissingStubs()

    ;* Execute and verify
    result = UTF.runTest("Test service error case")
    UTF.assertEquals(result, '')  ;* Should return empty on error
RETURN

END
```

---

## Core UTF Methods

### UTF.setTarget(routineName)

**Purpose:** Specify which routine is being tested

```jbc
UTF.setTarget("ST.CALCULATE.EXCHANGE.RATE")
```

### UTF.setDescription(description)

**Purpose:** Describe the test suite

```jbc
UTF.setDescription("Test ST.CALCULATE.EXCHANGE.RATE function")
```

### UTF.reset()

**Purpose:** Clear all parameters, stubs, and state before each test case

```jbc
TESTCASE test
    UTF.setTarget("MY.ROUTINE")
    GOSUB testCase1
    GOSUB testCase2
RETURN

testCase1:
    UTF.reset()           ;* Clear for first test
    UTF.addParam('val1')
    result = UTF.runTest("First test")
RETURN

testCase2:
    UTF.reset()           ;* Clear for second test
    UTF.addParam('val2')
    result = UTF.runTest("Second test")
RETURN

END
```

### UTF.addParam(value)

**Purpose:** Add a parameter to pass to the function under test

```jbc
UTF.reset()
UTF.addParam('localAmount')        ;* 1st parameter
UTF.addParam('USD')                ;* 2nd parameter
UTF.addParam('1000')               ;* 3rd parameter
result = UTF.runTest("Test calculate rate")

;* Calls: FUNCTION ST.CALCULATE.EXCHANGE.RATE('localAmount', 'USD', '1000')
```

**Common Patterns:**

```jbc
;* Empty parameter
UTF.addParam('')

;* Numeric value
UTF.addParam('100')

;* String value
UTF.addParam('GBP')

;* Multi-value field
UTF.addParam('value1':@FM:'value2':@FM:'value3')

;* Empty multi-value (multi-dimensional)
UTF.addParam('':@FM:'':.@FM:'')
```

### UTF.addStub(routineName)

**Purpose:** Mock an external dependency or service call

```jbc
stub = UTF.addStub('ST.ExchangeRate.CalcErateLocal')

;* Returns stub name for parameter configuration
;* Prevents actual call to ST.ExchangeRate.CalcErateLocal
;* Allows controlled return values
```

**Using Stub:**

```jbc
;* Create stub for service
stub = UTF.addStub('SERVICE.LAYER.CALL')

;* Configure stub parameters
UTF.addStubParam(stub, inputVal1, UTF.same())
UTF.addStubParam(stub, inputVal2, UTF.same())
UTF.addStubParam(stub, '', 'returnValue')  ;* Output parameter

;* Execute test - service call is intercepted
result = UTF.runTest("Test")
```

### UTF.addStubParam(stubName, expectedValue, returnValue)

**Purpose:** Configure stub parameter matching and return values

```jbc
stub = UTF.addStub('ST.ExchangeRate.CalcErateLocal')

;* Input parameters (must match for stub to trigger)
UTF.addStubParam(stub, 'localAmount', UTF.same())
UTF.addStubParam(stub, 'USD', UTF.same())
UTF.addStubParam(stub, '1000', UTF.same())

;* Output parameter (stub sets this value)
UTF.addStubParam(stub, '', '0.85')  ;* 4th param: return 0.85
```

**Parameter Matching:**

```jbc
;* Exact match required
UTF.addStubParam(stub, '100', UTF.same())

;* Wildcard match (any value accepted)
UTF.addStubParam(stub, '', UTF.anyValue())

;* Not used in stub
UTF.addStubParam(stub, '', 'default_value')
```

### UTF.runTest(description)

**Purpose:** Execute the function under test and return its result

```jbc
UTF.reset()
UTF.addParam('param1')
UTF.addParam('param2')

result = UTF.runTest("Test description of what this tests")

;* Executes the target routine with added parameters
;* Returns the function result
```

### UTF.assertEquals(actual, expected)

**Purpose:** Assert that actual value equals expected value

```jbc
UTF.reset()
UTF.addParam('100')

result = UTF.runTest("Calculate amount")

;* Assert result equals expected
UTF.assertEquals(result, '85')

;* Or with counter
count = UTF.getNbInvocation(stub)
UTF.assertEquals(count, '1')
```

### UTF.assertNotEquals(actual, expected)

**Purpose:** Assert that values are NOT equal

```jbc
result = UTF.runTest("Test something")
UTF.assertNotEquals(result, '')  ;* Assert not empty
```

### UTF.getNbInvocation(stubName)

**Purpose:** Count how many times a stub was called

```jbc
exceptionStub = UTF.addStub('EB.API.setException')
UTF.addStubParam(exceptionStub, 'EB-ERROR', UTF.same())

UTF.runTest("Test error handling")

;* Verify exception was called exactly once
invocations = UTF.getNbInvocation(exceptionStub)
UTF.assertEquals(invocations, '1')
```

### UTF.addStubPropertyChange(stubName, className, propertyName, newValue)

**Purpose:** Mock system property/global variable changes

```jbc
;* Mock system error flag
stub = UTF.addStub('SERVICE.CALL')
UTF.addStubPropertyChange(stub, 'EB.SystemTables', 'Etext', 'ERROR_TEXT')

;* Simulates:
;* CALL EB.SystemTables.setEtext('ERROR_TEXT')
;* EB.SystemTables.getEtext() will return 'ERROR_TEXT'
```

### UTF.ignoreMissingStubs()

**Purpose:** Allow test to continue even if undefined stubs are called

```jbc
UTF.reset()
UTF.addParam('value1')

;* Define some stubs
stub1 = UTF.addStub('PRIMARY.SERVICE')
UTF.addStubParam(stub1, 'value1', UTF.same())
UTF.addStubParam(stub1, '', 'result')

;* Allow undefined stubs to be called without error
UTF.ignoreMissingStubs()

;* Test can call other routines not stubbed
UTF.runTest("Test with partial stubs")
```

---

## Real Example: ST.CALCULATE.EXCHANGE.RATE Tests

### Test File: ST.CALCULATE.EXCHANGE.RATE_01.tut

```jbc
TESTCASE ST.CALCULATE.EXCHANGE.RATE_01
*-----------------------------------------------------------------------------
* Test suite for ST.CALCULATE.EXCHANGE.RATE
*
* Tests three scenarios:
*   1. nullTestCase: Parameter validation failure (empty parameters)
*   2. positiveTestCase: Successful exchange rate calculation
*   3. errorTestCase: Service layer returns error
*
*-----------------------------------------------------------------------------

UTF.setTarget("ST.CALCULATE.EXCHANGE.RATE")
UTF.setDescription("Test ST.CALCULATE.EXCHANGE.RATE")

GOSUB nullTestCase
GOSUB positiveTestCase
GOSUB errorTestCase

RETURN

;* ============================================================
;* TEST 1: Parameter Validation Error
;* ============================================================
nullTestCase:
    UTF.reset()

    ;* All parameters empty - should fail validation
    UTF.addParam('')
    UTF.addParam('')
    UTF.addParam('')

    ;* Stub parameter validation
    parameterNames = "localAmount":@FM:"dealCurrency":@FM:"dealAmount"
    stubName = UTF.addStub('EB.API.checkEmptyParameters')
    UTF.addStubParam(stubName, parameterNames, UTF.same())
    UTF.addStubParam(stubName, '':@FM:'':@FM:'', UTF.same())
    UTF.addStubParam(stubName, '', parameterNames)  ;* Return empty params list

    ;* Expect exception
    ebErrorParam = 'EB-EMPTY.PARAMETER'
    ebErrorParam<-1> = parameterNames
    GOSUB executeExceptionStub
RETURN

;* ============================================================
;* TEST 2: Positive Case - Successful Calculation
;* ============================================================
positiveTestCase:
    UTF.reset()

    ;* Valid input parameters
    lAmount = '1000'
    dCurrency = 'GBP'
    dAmount = '1500'
    UTF.addParam(lAmount)
    UTF.addParam(dCurrency)
    UTF.addParam(dAmount)

    ;* Stub service layer
    stub = UTF.addStub('ST.ExchangeRate.CalcErateLocal')
    UTF.addStubParam(stub, lAmount, UTF.same())
    UTF.addStubParam(stub, dCurrency, UTF.same())
    UTF.addStubParam(stub, dAmount, UTF.same())
    UTF.addStubParam(stub, '', '0.666666667')  ;* Return calculated rate
    UTF.ignoreMissingStubs()

    ;* Execute and verify
    exchRate = UTF.runTest("Test successful exchange rate calculation")
    UTF.assertEquals(exchRate, '0.666666667')
RETURN

;* ============================================================
;* TEST 3: Service Layer Error
;* ============================================================
errorTestCase:
    UTF.reset()

    ;* Valid input parameters
    lAmount = '1000'
    dCurrency = 'GBP'
    dAmount = '1500'
    UTF.addParam(lAmount)
    UTF.addParam(dCurrency)
    UTF.addParam(dAmount)

    ;* Stub service that fails
    stubName = UTF.addStub('ST.ExchangeRate.CalcErateLocal')
    UTF.addStubParam(stubName, lAmount, UTF.same())
    UTF.addStubParam(stubName, dCurrency, UTF.same())
    UTF.addStubParam(stubName, dAmount, UTF.same())
    UTF.addStubParam(stubName, '', UTF.same())  ;* Service returns empty

    ;* Mock system error flag
    UTF.addStubPropertyChange(stubName, 'EB.SystemTables', 'Etext', 'CORE ERROR')
    UTF.ignoreMissingStubs()

    ;* Expect exception for internal error
    ebErrorParam = 'EB-INTERNAL.ERROR'
    ebErrorParam<-1> = 'CORE ERROR'
    GOSUB executeExceptionStub
RETURN

;* ============================================================
;* HELPER: Execute and verify exception
;* ============================================================
executeExceptionStub:
    exceptionStub = UTF.addStub('EB.API.setException')
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())
    UTF.runTest("Test error handling")
    count = UTF.getNbInvocation(exceptionStub)
    UTF.assertEquals(count, '1')  ;* Exception called exactly once
RETURN

END
```

---

## Testing Patterns

### Pattern 1: Testing Happy Path (Success)

```jbc
happyPathTest:
    UTF.reset()

    ;* Setup valid inputs
    UTF.addParam('validInput1')
    UTF.addParam('validInput2')

    ;* Stub dependencies to return success
    stub = UTF.addStub('DEPENDENCY.SERVICE')
    UTF.addStubParam(stub, 'validInput1', UTF.same())
    UTF.addStubParam(stub, 'validInput2', UTF.same())
    UTF.addStubParam(stub, '', 'successResult')
    UTF.ignoreMissingStubs()

    ;* Execute and verify
    result = UTF.runTest("Test successful execution")
    UTF.assertEquals(result, 'successResult')
RETURN
```

### Pattern 2: Testing Parameter Validation

```jbc
paramValidationTest:
    UTF.reset()

    ;* Empty parameter triggers validation error
    UTF.addParam('')
    UTF.addParam('value2')

    ;* Stub validation to return missing parameters
    paramNames = 'param1':@FM:'param2'
    stub = UTF.addStub('EB.API.checkEmptyParameters')
    UTF.addStubParam(stub, paramNames, UTF.same())
    UTF.addStubParam(stub, '':@FM:'value2', UTF.same())
    UTF.addStubParam(stub, '', 'param1')  ;* Return empty param

    ;* Stub exception
    exceptionStub = UTF.addStub('EB.API.setException')
    ebErrorParam = 'EB-EMPTY.PARAMETER'
    ebErrorParam<-1> = 'param1'
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())

    ;* Verify exception called
    UTF.runTest("Test parameter validation")
    count = UTF.getNbInvocation(exceptionStub)
    UTF.assertEquals(count, '1')
RETURN
```

### Pattern 3: Testing Service Layer Error

```jbc
serviceErrorTest:
    UTF.reset()

    ;* Valid inputs
    UTF.addParam('goodInput1')
    UTF.addParam('goodInput2')

    ;* Service returns error
    stub = UTF.addStub('EXTERNAL.SERVICE')
    UTF.addStubParam(stub, 'goodInput1', UTF.same())
    UTF.addStubParam(stub, 'goodInput2', UTF.same())
    UTF.addStubParam(stub, '', '')  ;* Service returns empty

    ;* Mock error flag
    UTF.addStubPropertyChange(stub, 'EB.SystemTables', 'Etext', 'SERVICE_FAILED')

    ;* Stub exception
    exceptionStub = UTF.addStub('EB.API.setException')
    ebErrorParam = 'EB-INTERNAL.ERROR'
    ebErrorParam<-1> = 'SERVICE_FAILED'
    UTF.addStubParam(exceptionStub, ebErrorParam, UTF.same())
    UTF.ignoreMissingStubs()

    ;* Verify function returns empty on error
    result = UTF.runTest("Test service error handling")
    UTF.assertEquals(result, '')
RETURN
```

### Pattern 4: Testing Multiple Service Calls

```jbc
multiServiceTest:
    UTF.reset()

    UTF.addParam('input1')
    UTF.addParam('input2')

    ;* Stub first service
    stub1 = UTF.addStub('SERVICE.ONE')
    UTF.addStubParam(stub1, 'input1', UTF.same())
    UTF.addStubParam(stub1, '', 'result1')

    ;* Stub second service
    stub2 = UTF.addStub('SERVICE.TWO')
    UTF.addStubParam(stub2, 'result1', UTF.same())
    UTF.addStubParam(stub2, 'input2', UTF.same())
    UTF.addStubParam(stub2, '', 'finalResult')

    UTF.ignoreMissingStubs()

    result = UTF.runTest("Test multiple service calls")
    UTF.assertEquals(result, 'finalResult')

    ;* Verify both services were called
    count1 = UTF.getNbInvocation(stub1)
    count2 = UTF.getNbInvocation(stub2)
    UTF.assertEquals(count1, '1')
    UTF.assertEquals(count2, '1')
RETURN
```

---

## File Organization

### Directory Structure

```
Component/
├── Test/
│   ├── UnitTests/              ;* UTF test files
│   │   ├── ROUTINE.NAME_01.tut
│   │   ├── ROUTINE.NAME_02.tut
│   │   └── (test files)
│   └── Integration/            ;* Integration tests (Java)
├── Source/
│   ├── Private/                ;* Implementation
│   │   ├── ROUTINE.NAME.b
│   │   └── ...
│   └── Public/
└── Definition/
    └── Component.component
```

### Naming Conventions

```
ROUTINE.NAME_01.tut    ;* Positive/main cases
ROUTINE.NAME_02.tut    ;* Edge cases
ROUTINE.NAME_03.tut    ;* Error/exception cases
ROUTINE.NAME_ERR.tut   ;* Error-specific tests
```

---

## Running Tests

### Command Line

```bash
;* Run specific test
jtest -f Component/Test/UnitTests/ROUTINE.NAME_01.tut

;* Run all tests in directory
jtest Component/Test/UnitTests/

;* Run with verbose output
jtest -v -f Component/Test/UnitTests/ROUTINE.NAME_01.tut
```

### Integration with Ant Build

Tests can be integrated into `build.xml`:

```xml
<target name="test" depends="compile">
    <exec executable="jtest">
        <arg value="-f"/>
        <arg value="ST_CurrencyApi/Test/UnitTests/*.tut"/>
    </exec>
</target>
```

---

## Key Takeaways

1. **Reset before each test** - Always call UTF.reset() at test case start
2. **Stub all dependencies** - Mock external services and API calls
3. **Test three scenarios** - Happy path, validation error, service error
4. **Verify assertions** - Use assertEquals() to verify results
5. **Count invocations** - Use getNbInvocation() to verify calls
6. **Mock properties** - Use addStubPropertyChange() for system state
7. **Ignore missing stubs** - Use ignoreMissingStubs() for partial mocking
8. **Clear results on error** - Expect empty return when exceptions occur
9. **Test parameter validation first** - Validation is first line of defense
10. **Test service errors** - Always test service layer failure scenarios
