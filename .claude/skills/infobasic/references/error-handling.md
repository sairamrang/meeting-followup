# Error Handling Patterns Reference

## Table of Contents

1. [Response Structure Pattern](#response-structure-pattern)
2. [Error Code Conventions](#error-code-conventions)
3. [ETEXT Pattern](#etext-pattern)
4. [Error Logging](#error-logging)
5. [History Log Pattern](#history-log-pattern)
6. [Validation Patterns](#validation-patterns)
7. [Exit Point Pattern](#exit-point-pattern)

---

## Response Structure Pattern

### Standard Response Structure

```basic
* Set failure response
oResponse<PaymentResponse.returnCode> = 'FAILURE'
oResponse<PaymentResponse.serviceName> = 'ServiceImpl.methodName'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageType> = 'FATAL_ERROR'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageCode> = 'WF00001'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageText> = ''
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageInfo> = additionalInfo
```

### Success Response

```basic
* Set success response
oResponse<PaymentResponse.returnCode> = 'SUCCESS'
oResponse<PaymentResponse.serviceName> = 'ServiceImpl.methodName'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageType> = 'INFO'
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageCode> = ''
oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageText> = ''
```

### Response Message Types

| Type          | Usage                                         |
| ------------- | --------------------------------------------- |
| `FATAL_ERROR` | Unrecoverable error, processing stops         |
| `ERROR`       | Recoverable error, may continue with warnings |
| `WARNING`     | Non-blocking issue, processing continues      |
| `INFO`        | Informational message                         |

### Multiple Error Messages

```basic
* Adding multiple error messages
messageIndex = 1

* First error
oResponse<PaymentResponse.responseMessages, messageIndex, ResponseMessage.messageCode> = 'VAL00001'
oResponse<PaymentResponse.responseMessages, messageIndex, ResponseMessage.messageType> = 'ERROR'
messageIndex += 1

* Second error
oResponse<PaymentResponse.responseMessages, messageIndex, ResponseMessage.messageCode> = 'VAL00002'
oResponse<PaymentResponse.responseMessages, messageIndex, ResponseMessage.messageType> = 'ERROR'
messageIndex += 1
```

---

## Error Code Conventions

### Error Code Format

Pattern: `<PREFIX><NUMBER>`

- **PREFIX**: 2-4 character service/component identifier
- **NUMBER**: 5-digit sequential number (padded with zeros)

### Standard Error Prefixes

| Prefix | Service/Component             |
| ------ | ----------------------------- |
| `WF`   | Payment Workflow Service      |
| `PFW`  | Payment Framework Service     |
| `CLR`  | Clearing Framework Service    |
| `BAI`  | Balance Interface Service     |
| `RNS`  | Routing & Settlement Service  |
| `ART`  | Automated Repair Tool Service |
| `FEE`  | Fee Calculation Service       |
| `MAP`  | Message Mapping Service       |
| `ESB`  | ESB Inward/Outward Service    |
| `VAL`  | Validation errors             |
| `DAS`  | Data Access errors            |
| `SYS`  | System errors                 |

### Error Code Examples

```basic
* Workflow errors
'WF00001'  ;* Missing payment ID
'WF00002'  ;* Invalid status transition
'WF00003'  ;* Payment not found

* Balance Interface errors
'BAI00001' ;* Account not found
'BAI00002' ;* Insufficient balance
'BAI00003' ;* Account blocked

* Validation errors
'VAL00001' ;* Missing mandatory field
'VAL00002' ;* Invalid date format
'VAL00003' ;* Amount exceeds limit
```

### Error Code File Pattern

Error codes stored in: `Data/Public/F.PP.ERRORCODE!<CODE>.d`

```basic
* Reading error code details
errorCodeID = 'F.PP.ERRORCODE!' : errorCode
FN.PP.ERRORCODE = 'F.PP.ERRORCODE'
F.PP.ERRORCODE = ''
CALL OPF(FN.PP.ERRORCODE, F.PP.ERRORCODE)

R.PP.ERRORCODE = ''
ERR.PP.ERRORCODE = ''
CALL F.READ(FN.PP.ERRORCODE, errorCodeID, R.PP.ERRORCODE, F.PP.ERRORCODE, ERR.PP.ERRORCODE)

IF ERR.PP.ERRORCODE EQ '' THEN
    errorDescription = R.PP.ERRORCODE<PP.ERRORCODE.DESCRIPTION>
    errorSeverity = R.PP.ERRORCODE<PP.ERRORCODE.SEVERITY>
END
```

---

## ETEXT Pattern

### Using ETEXT for Error Flow Control

```basic
process:
    ETEXT = ''

    GOSUB validateInput
    IF ETEXT THEN RETURN

    GOSUB fetchData
    IF ETEXT THEN RETURN

    GOSUB processBusinessLogic
    IF ETEXT THEN RETURN

    GOSUB saveResults
    RETURN
```

### Setting ETEXT

```basic
validateInput:
    IF iPaymentID EQ '' THEN
        ETEXT = 'WF00001'  ;* Missing payment ID
        GOSUB setErrorResponse
        RETURN
    END

    IF iAmount LE 0 THEN
        ETEXT = 'VAL00003'  ;* Invalid amount
        GOSUB setErrorResponse
        RETURN
    END
    RETURN
```

### ETEXT with Additional Info

```basic
validateAccount:
    IF accountNotFound THEN
        ETEXT = 'BAI00001'
        errorInfo = 'Account: ' : accountNumber
        GOSUB setErrorResponseWithInfo
        RETURN
    END
    RETURN

setErrorResponseWithInfo:
    oResponse<PaymentResponse.returnCode> = 'FAILURE'
    oResponse<PaymentResponse.serviceName> = responseDetails.serviceName
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageCode> = ETEXT
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageType> = 'FATAL_ERROR'
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageInfo> = errorInfo
    RETURN
```

---

## Error Logging

### TPSLogging for Errors

```basic
* Log error occurrence
CALL TPSLogging("Error","ServiceImpl.method","ErrorCode: ":ETEXT:", PaymentID: ":paymentID,"")

* Log error with stack context
CALL TPSLogging("Error Details","ServiceImpl.method","Context: ":errorContext:", Data: ":errorData,"")
```

### Detailed Error Logging

```basic
handleError:
    * Build error context
    errorContext = ''
    errorContext<1> = 'PaymentID: ' : paymentID
    errorContext<2> = 'Status: ' : currentStatus
    errorContext<3> = 'Operation: ' : operationType
    errorContext<4> = 'Error: ' : ETEXT

    * Log comprehensive error
    CALL TPSLogging("Error","ServiceImpl.method",CONVERT(@FM, ' | ', errorContext),"")

    * Set response
    GOSUB setErrorResponse
    RETURN
```

---

## History Log Pattern

### PPT History Log Structure

```basic
* Write to history log for audit trail
historyRecord = ''
historyRecord<PPTHistory.companyID> = companyID
historyRecord<PPTHistory.ftNumber> = ftNumber
historyRecord<PPTHistory.eventType> = 'ERR'  ;* INF/ERR/WRN
historyRecord<PPTHistory.eventDescription> = 'Payment processing failed'
historyRecord<PPTHistory.errorCode> = ETEXT
historyRecord<PPTHistory.additionalInfo> = errorDetails
historyRecord<PPTHistory.eventDateTime> = TIMEDATE()
historyRecord<PPTHistory.userId> = OPERATOR

GOSUB writeHistoryLog
```

### Event Types

| Type  | Usage                             |
| ----- | --------------------------------- |
| `INF` | Informational - normal operations |
| `ERR` | Error - failures and exceptions   |
| `WRN` | Warning - potential issues        |

### History Log Subroutine

```basic
writeHistoryLog:
    * Generate unique history ID
    historyKey = companyID : '*' : ftNumber : '*' : TIMEDATE()

    * Write history record
    FN.PPT.HISTORY = 'F.PPT.HISTORY' : TABLE.SUFFIX
    F.PPT.HISTORY = ''
    CALL OPF(FN.PPT.HISTORY, F.PPT.HISTORY)

    WRITE historyRecord TO F.PPT.HISTORY, historyKey

    CALL TPSLogging("History","ServiceImpl.method","Written history: ":historyKey,"")
    RETURN
```

---

## Validation Patterns

### Mandatory Field Validation

```basic
validateMandatoryFields:
    * Check all mandatory fields
    IF iPaymentID EQ '' THEN
        ETEXT = 'VAL00001'
        errorField = 'PaymentID'
        GOSUB setValidationError
        RETURN
    END

    IF iAmount EQ '' THEN
        ETEXT = 'VAL00001'
        errorField = 'Amount'
        GOSUB setValidationError
        RETURN
    END

    IF iCurrency EQ '' THEN
        ETEXT = 'VAL00001'
        errorField = 'Currency'
        GOSUB setValidationError
        RETURN
    END
    RETURN

setValidationError:
    oResponse<PaymentResponse.returnCode> = 'FAILURE'
    oResponse<PaymentResponse.serviceName> = responseDetails.serviceName
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageCode> = ETEXT
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageType> = 'ERROR'
    oResponse<PaymentResponse.responseMessages, 1, ResponseMessage.messageInfo> = 'Field: ' : errorField
    RETURN
```

### Format Validation

```basic
validateFormats:
    * Validate date format (YYYYMMDD)
    IF LEN(iDate) NE 8 OR NOT(NUM(iDate)) THEN
        ETEXT = 'VAL00002'
        errorField = 'Date'
        errorInfo = 'Expected YYYYMMDD, got: ' : iDate
        GOSUB setFormatError
        RETURN
    END

    * Validate amount is numeric
    IF NOT(NUM(iAmount)) THEN
        ETEXT = 'VAL00004'
        errorField = 'Amount'
        errorInfo = 'Non-numeric amount: ' : iAmount
        GOSUB setFormatError
        RETURN
    END
    RETURN
```

### Business Rule Validation

```basic
validateBusinessRules:
    * Check amount limits
    IF iAmount GT maxTransactionLimit THEN
        ETEXT = 'VAL00003'
        errorInfo = 'Amount ' : iAmount : ' exceeds limit ' : maxTransactionLimit
        GOSUB setBusinessRuleError
        RETURN
    END

    * Check valid currency
    LOCATE iCurrency IN validCurrencies<1> SETTING currPos ELSE
        ETEXT = 'VAL00005'
        errorInfo = 'Invalid currency: ' : iCurrency
        GOSUB setBusinessRuleError
        RETURN
    END
    RETURN
```

---

## Exit Point Pattern

### Clean Exit with Error

```basic
exitPoint:
    * Log exit status
    IF ETEXT THEN
        CALL TPSLogging("Exit with Error","ServiceImpl.method","Error: ":ETEXT,"")
    END ELSE
        CALL TPSLogging("Exit Success","ServiceImpl.method","","")
    END

    * Clean up resources
    GOSUB finalise

    * Return to caller
    GOSUB flowOut
    RETURN

flowOut:
    RETURN TO flowOut
```

### Multiple Exit Points

```basic
process:
    GOSUB validateInput
    IF ETEXT THEN
        GOTO exitPoint
    END

    GOSUB fetchData
    IF NOT(dataFound) THEN
        GOTO exitPoint
    END

    GOSUB processData
    IF ETEXT THEN
        GOTO exitPoint
    END

    * Success path
    oResponse<PaymentResponse.returnCode> = 'SUCCESS'

exitPoint:
    GOSUB logCompletion
    GOSUB finalise
    RETURN
```

---

## Error Recovery Patterns

### Retry Pattern

```basic
processWithRetry:
    maxRetries = 3
    retryCount = 0
    processSuccess = 0

    LOOP
    WHILE retryCount LT maxRetries AND NOT(processSuccess)
        retryCount += 1
        ETEXT = ''

        GOSUB attemptProcess

        IF ETEXT EQ '' THEN
            processSuccess = 1
        END ELSE
            * Log retry attempt
            CALL TPSLogging("Retry","ServiceImpl.method","Attempt ":retryCount:" failed: ":ETEXT,"")
            SLEEP 1  ;* Wait before retry
        END
    REPEAT

    IF NOT(processSuccess) THEN
        ETEXT = 'SYS00001'  ;* Max retries exceeded
        GOSUB setErrorResponse
    END
    RETURN
```

### Rollback Pattern

```basic
processWithRollback:
    * Save state before operations
    GOSUB saveCurrentState

    * Attempt operations
    GOSUB performOperations

    IF ETEXT THEN
        * Rollback on error
        GOSUB restorePreviousState
        CALL TPSLogging("Rollback","ServiceImpl.method","Rolled back due to: ":ETEXT,"")
    END
    RETURN

saveCurrentState:
    savedStatus = currentRecord<PaymentRecord.statusCode>
    savedAmount = currentRecord<PaymentRecord.amount>
    RETURN

restorePreviousState:
    currentRecord<PaymentRecord.statusCode> = savedStatus
    currentRecord<PaymentRecord.amount> = savedAmount
    RETURN
```
