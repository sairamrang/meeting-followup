# CLAUDE_TPH.md

This file provides guidance to Claude Code when working with TPH (Temenos Payments Hub) / PP (Payment Processing) service layer code.

**Location:** This file should be placed in the TPH project root directory.

## TPH Technology Stack

- **Platform:** Temenos Payments Hub / T24 Payment Processing
- **Language:** InfoBasic (jBC) - Service Layer
- **Architecture:** Service-oriented, API-driven payment processing
- **Framework:** TPH Service Framework (SetServiceCommon, SetServiceResponse, TPSLogging)

---

## TPH-Specific Patterns

### Parameter Naming Conventions (TPH Service Layer Only)

**Important:** Parameter naming conventions are TPH-specific and should NOT be enforced in generic InfoBasic development. These conventions apply ONLY to TPH service layer code.

| Type          | Pattern     | Example                             |
| ------------- | ----------- | ----------------------------------- |
| Input params  | `i<Name>`   | `iPaymentID`, `iTransactionContext` |
| Output params | `o<Name>`   | `oResponse`, `oErrorMsg`            |
| In/Out params | `io<Name>`  | `ioPaymentRecord`                   |
| Local vars    | `camelCase` | `transactionRef`, `paymentAmount`   |
| DAS variables | `MY.<NAME>` | `MY.TABLE`, `MY.FIELDS`             |

### Service Layer Structure (Three-Phase)

TPH service routines follow a consistent three-phase structure for initialization, processing, and finalization:

```basic
$PACKAGE PP.ServiceName
SUBROUTINE ServiceImpl.methodName(iInput, oOutput, responseDetails)
*-----------------------------------------------------------------------------
* @author developer@company.com
* @stereotype subroutine
* @package PP.ServiceName
* <p>Description of what this subroutine does</p>
* @param IN  iInput          - Input parameter description
* @param OUT oOutput         - Output parameter description
* @param OUT responseDetails - Standard response structure
*!
    $INSERT I_EQUATE
    $INSERT I_responseDetails
    $INSERT I_ServiceName_Structures

    GOSUB initialise
    GOSUB localInitialise
    CALL TPSLogging("Start","ServiceImpl.methodName","","")

    GOSUB process

    CALL TPSLogging("End","ServiceImpl.methodName","","")
    GOSUB finalise
    RETURN

*-----------------------------------------------------------------------------
initialise:
    CALL SetServiceCommon
    responseDetails = ''
    responseDetails.serviceName = "ServiceImpl.methodName"
    ETEXT = ''
    RETURN

localInitialise:
    localVar1 = ''
    localVar2 = ''
    RETURN

process:
    * Main business logic here
    GOSUB validateInput
    IF ETEXT THEN RETURN
    GOSUB executeLogic
    RETURN

validateInput:
    IF iInput EQ '' THEN
        ETEXT = 'ERR001'
        GOSUB setErrorResponse
    END
    RETURN

executeLogic:
    * Implementation
    oOutput = 'SUCCESS'
    RETURN

setErrorResponse:
    oResponse<PaymentResponse.returnCode> = 'FAILURE'
    oResponse<PaymentResponse.serviceName> = responseDetails.serviceName
    oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageCode> = ETEXT
    oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageType> = 'FATAL_ERROR'
    RETURN

finalise:
    CALL SetServiceResponse(responseDetails)
    RETURN
END
```

### TPSLogging Framework

TPSLogging provides comprehensive audit logging for service layer operations:

```basic
* At subroutine start
CALL TPSLogging("Start","ServiceImpl.methodName","","")

* Log input parameters
CALL TPSLogging("Input Parameter","ServiceImpl.methodName","iPaymentID : <":iPaymentID:">","")

* Log processing steps
CALL TPSLogging("Processing","ServiceImpl.methodName","Status: ":statusCode:"->":newStatus,"")

* Log output parameters
CALL TPSLogging("Output Parameter","ServiceImpl.methodName","oResponse : <":oResponse:">","")

* At subroutine end
CALL TPSLogging("End","ServiceImpl.methodName","","")
```

### SetServiceCommon / SetServiceResponse Framework Calls

TPH uses framework calls to manage service context and responses:

```basic
initialise:
    CALL SetServiceCommon
    responseDetails = ''
    responseDetails.serviceName = "ServiceImpl.methodName"
    RETURN

finalise:
    CALL SetServiceResponse(responseDetails)
    RETURN
```

**SetServiceCommon:** Initializes service context and common variables

**SetServiceResponse:** Finalizes and returns the service response

### Structured Response Objects

TPH service layer uses structured response objects with standardized fields:

```basic
oResponse<PaymentResponse.returnCode> = 'SUCCESS'
oResponse<PaymentResponse.serviceName> = serviceName
oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageCode> = errorCode
oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageType> = 'FATAL_ERROR'
oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageText> = ''
oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageInfo> = additionalInfo
```

### DAS (Data Access Service) Patterns

DAS provides a service layer for database operations with built-in multi-tenancy support:

```basic
$INSERT I_DAS
$INSERT I_DAS.PAYMENT

* Build DAS query
MY.TABLE = "F.PAYMENT"
MY.FIELD.1 = "PAYMENT.ID"
MY.VALUE.1 = paymentId
MY.TABLE.SUFFIX = tableId

* Execute query
GOSUB BuildQuery

BEGIN CASE
    CASE resultCode = 'UNKNOWN.QUERY'
        GOSUB HandleUnknownQuery
    CASE resultCode = 'SUCCESS'
        GOSUB ProcessResults
    CASE OTHERWISE
        GOSUB HandleError
END CASE
```

### Error Handling Patterns (TPH Service Layer)

```basic
IF ETEXT THEN
    oResponse<PaymentResponse.returnCode> = 'FAILURE'
    oResponse<PaymentResponse.serviceName> = responseDetails.serviceName
    oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageCode> = ETEXT
    oResponse<PaymentResponse.responseMessages,1,ResponseMessage.messageType> = 'FATAL_ERROR'
    CALL SetServiceResponse(oResponse)
    RETURN
END
```

### Error Code Prefixes (TPH Service Areas)

| Prefix | Service Area         |
| ------ | -------------------- |
| WF     | Workflow             |
| PFW    | Payment Framework    |
| CLR    | Clearing             |
| BAI    | Balance Interface    |
| RNS    | Routing & Settlement |
| ART    | Automated Repair     |
| FEE    | Fee Calculation      |
| MAP    | Message Mapping      |

---

## TPH Best Practices

1. **Always use parameter prefixes (i/o/io)** - Clear input/output contracts in service layer
2. **Always use three-phase structure** - initialise → process → finalise
3. **Always use TPSLogging** - Comprehensive audit trail for service operations
4. **Always set returnCode and serviceName** in responses
5. **Always use SetServiceCommon/SetServiceResponse** - Proper framework integration
6. **Always handle structured responses** - Consistent error information
7. **Always validate input** - Check for empty/missing parameters
8. **Always check ETEXT** - Return early on errors
9. **Use DAS for database operations** - Never direct file I/O in service layer
10. **Log errors with FATAL_ERROR type** - Clear error severity

---

## Reference

- **Generic jBC patterns:** See [InfoBasic Skill](../../../../.claude/skills/infobasic/SKILL.md) for control flow, loops, strings, multi-value fields
- **AA Framework patterns:** See [CLAUDE_AA.md](./CLAUDE_AA.md) for T24 Arrangement Architecture development
- **Project structure:** See [CLAUDE.md](../../../../CLAUDE.md) for repository organization and build procedures
