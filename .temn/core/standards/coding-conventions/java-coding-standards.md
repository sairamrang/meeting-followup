# Java Coding Standards

**Owner:** Temenos Backend Guild
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines coding standards for Java projects across all Temenos products.

---

## Java Version

**Minimum Version:** Java 17 LTS
**Preferred Version:** Java 21 LTS

**Reasoning:** LTS versions provide long-term support and stability for enterprise applications.

---

## Project Structure

### Maven Project Layout
```
project-root/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/temenos/product/
│   │   │       ├── domain/          # Domain models
│   │   │       ├── repository/      # Data access
│   │   │       ├── service/         # Business logic
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── dto/             # Data transfer objects
│   │   │       ├── exception/       # Custom exceptions
│   │   │       └── config/          # Configuration
│   │   └── resources/
│   │       ├── application.yml      # Configuration
│   │       ├── db/migration/        # Flyway migrations
│   │       └── static/              # Static resources
│   └── test/
│       ├── java/
│       │   └── com/temenos/product/
│       │       ├── integration/     # Integration tests
│       │       └── unit/            # Unit tests
│       └── resources/
│           └── application-test.yml
├── pom.xml
└── README.md
```

### Package Naming
```
com.temenos.{product}.{module}.{layer}

Examples:
com.temenos.corebanking.account.domain
com.temenos.corebanking.account.service
com.temenos.payments.transfer.repository
```

---

## Naming Conventions

### Classes and Interfaces
```java
// PascalCase for classes
public class AccountService { }
public class UserRepository { }

// PascalCase for interfaces (no 'I' prefix)
public interface PaymentService { }
public interface UserRepository { }

// Exception classes end with 'Exception'
public class AccountNotFoundException extends RuntimeException { }

// Abstract classes may start with 'Abstract' or 'Base'
public abstract class AbstractEntity { }
public abstract class BaseService { }
```

### Methods and Variables
```java
// camelCase for methods and variables
public void calculateInterest() { }
private int accountBalance;

// Boolean methods: use is/has/can prefix
public boolean isActive() { }
public boolean hasPermission() { }
public boolean canWithdraw() { }
```

### Constants
```java
// SCREAMING_SNAKE_CASE for constants
public static final int MAX_RETRY_ATTEMPTS = 3;
public static final String API_BASE_URL = "https://api.example.com";
private static final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
```

### Packages
```java
// lowercase, no underscores
package com.temenos.corebanking.account.service;
```

---

## Code Organization

### Class Structure
```java
public class UserService {
    // 1. Constants
    private static final int MAX_LOGIN_ATTEMPTS = 3;

    // 2. Static fields
    private static final Logger LOGGER = LoggerFactory.getLogger(UserService.class);

    // 3. Instance fields (prefer final)
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 4. Constructor
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 5. Public methods
    public User findById(String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    // 6. Protected methods
    protected void validateUser(User user) {
        // Validation logic
    }

    // 7. Private methods
    private String hashPassword(String password) {
        return passwordEncoder.encode(password);
    }

    // 8. Getters and setters (if needed)
    public UserRepository getUserRepository() {
        return userRepository;
    }
}
```

---

## Type Safety

### Avoid Raw Types
```java
// Bad: Raw type
List users = new ArrayList();
Map config = new HashMap();

// Good: Generic types
List<User> users = new ArrayList<>();
Map<String, Object> config = new HashMap<>();
```

### Use Optional
```java
// Good: Use Optional for potentially null values
public Optional<User> findByEmail(String email) {
    return userRepository.findByEmail(email);
}

// Usage
Optional<User> userOpt = userService.findByEmail("test@example.com");
userOpt.ifPresent(user -> System.out.println(user.getName()));
String name = userOpt.map(User::getName).orElse("Unknown");
```

### Null Annotations
```java
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;

public class UserService {
    @NonNull
    public User findById(@NonNull String id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new UserNotFoundException(id));
    }

    @Nullable
    public User findByEmail(@NonNull String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}
```

---

## Methods

### Method Length
- **Ideal:** < 20 lines
- **Maximum:** 50 lines
- **Exception:** Complex algorithms with clear comments

### Method Parameters
```java
// Maximum 3-4 parameters
public void createAccount(String userId, String accountType, BigDecimal initialBalance) {
    // Implementation
}

// If more parameters, use builder pattern or DTO
public void createAccount(CreateAccountRequest request) {
    // Implementation
}
```

### Return Early
```java
// Good: Early returns reduce nesting
public boolean isEligibleForLoan(User user) {
    if (user == null) {
        return false;
    }
    if (user.getAge() < 18) {
        return false;
    }
    if (user.getCreditScore() < 600) {
        return false;
    }
    return true;
}

// Bad: Nested conditions
public boolean isEligibleForLoan(User user) {
    if (user != null) {
        if (user.getAge() >= 18) {
            if (user.getCreditScore() >= 600) {
                return true;
            }
        }
    }
    return false;
}
```

---

## Classes and Interfaces

### Single Responsibility Principle
Each class should have one reason to change:
```java
// Good: Focused responsibility
public class AccountService {
    public Account createAccount(CreateAccountRequest request) { }
    public Account getAccount(String id) { }
    public void closeAccount(String id) { }
}

// Bad: Multiple responsibilities
public class AccountService {
    public Account createAccount() { }
    public void sendEmail() { }  // Email responsibility
    public void generateReport() { }  // Reporting responsibility
}
```

### Immutable Objects
```java
// Prefer immutable objects
public final class Money {
    private final BigDecimal amount;
    private final String currency;

    public Money(BigDecimal amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public String getCurrency() {
        return currency;
    }

    // No setters - immutable
}

// Or use records (Java 14+)
public record Money(BigDecimal amount, String currency) { }
```

### Builder Pattern
```java
// For objects with many optional fields
public class User {
    private final String id;
    private final String name;
    private final String email;
    private final String phone;
    private final Address address;

    private User(Builder builder) {
        this.id = builder.id;
        this.name = builder.name;
        this.email = builder.email;
        this.phone = builder.phone;
        this.address = builder.address;
    }

    public static class Builder {
        private String id;
        private String name;
        private String email;
        private String phone;
        private Address address;

        public Builder id(String id) {
            this.id = id;
            return this;
        }

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder email(String email) {
            this.email = email;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}

// Usage
User user = new User.Builder()
    .id("123")
    .name("John Doe")
    .email("john@example.com")
    .build();
```

---

## Exception Handling

### Exception Types
```java
// Use specific exceptions
public class AccountNotFoundException extends RuntimeException {
    public AccountNotFoundException(String accountId) {
        super("Account not found: " + accountId);
    }
}

public class InsufficientFundsException extends BusinessException {
    public InsufficientFundsException(BigDecimal balance, BigDecimal amount) {
        super(String.format("Insufficient funds: balance=%s, required=%s",
            balance, amount));
    }
}
```

### Try-Catch
```java
// Catch specific exceptions
try {
    Account account = accountService.getAccount(accountId);
    accountService.withdraw(account, amount);
} catch (AccountNotFoundException e) {
    LOGGER.error("Account not found: {}", accountId, e);
    throw new ApiException("Account not found", HttpStatus.NOT_FOUND);
} catch (InsufficientFundsException e) {
    LOGGER.warn("Insufficient funds for account: {}", accountId);
    throw new ApiException("Insufficient funds", HttpStatus.BAD_REQUEST);
}

// Never catch Exception or Throwable
// Bad: Catching generic Exception
catch (Exception e) {
    // Too broad
}
```

### Try-with-Resources
```java
// Always use try-with-resources for AutoCloseable
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
    // Process line
} catch (IOException e) {
    LOGGER.error("Error reading file", e);
}
```

---

## Collections

### Prefer Interfaces
```java
// Good: Interface type
List<User> users = new ArrayList<>();
Set<String> ids = new HashSet<>();
Map<String, Account> accounts = new HashMap<>();

// Bad: Implementation type
ArrayList<User> users = new ArrayList<>();
```

### Immutable Collections
```java
// Java 9+ immutable collections
List<String> names = List.of("Alice", "Bob", "Charlie");
Set<String> roles = Set.of("ADMIN", "USER");
Map<String, Integer> ages = Map.of("Alice", 30, "Bob", 25);

// Or use Collections utility
List<String> names = Collections.unmodifiableList(Arrays.asList("Alice", "Bob"));
```

### Streams
```java
// Use streams for functional operations
List<String> activeUserNames = users.stream()
    .filter(User::isActive)
    .map(User::getName)
    .sorted()
    .collect(Collectors.toList());

// Parallel streams for large collections (with caution)
long count = users.parallelStream()
    .filter(User::isActive)
    .count();
```

---

## Dependency Injection

### Constructor Injection (Preferred)
```java
@Service
public class AccountService {
    private final AccountRepository accountRepository;
    private final AuditService auditService;

    // Constructor injection (preferred)
    public AccountService(
            AccountRepository accountRepository,
            AuditService auditService) {
        this.accountRepository = accountRepository;
        this.auditService = auditService;
    }
}
```

### Field Injection (Avoid)
```java
// Avoid field injection (harder to test)
@Service
public class AccountService {
    @Autowired
    private AccountRepository accountRepository;  // Avoid

    @Autowired
    private AuditService auditService;  // Avoid
}
```

---

## Logging

### Logger Declaration
```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AccountService {
    private static final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
}
```

### Log Levels
```java
// ERROR: Something failed
LOGGER.error("Failed to create account for user: {}", userId, exception);

// WARN: Something unexpected but recoverable
LOGGER.warn("Account {} is dormant", accountId);

// INFO: Important business events
LOGGER.info("Account {} created for user: {}", accountId, userId);

// DEBUG: Detailed debugging info
LOGGER.debug("Validating account data: {}", accountData);

// TRACE: Very detailed debugging
LOGGER.trace("Entering method: createAccount");
```

### Parameterized Logging
```java
// Good: Parameterized logging (efficient)
LOGGER.info("User {} logged in from {}", userId, ipAddress);

// Bad: String concatenation (inefficient)
LOGGER.info("User " + userId + " logged in from " + ipAddress);
```

---

## Testing

### Test Class Naming
```java
// Unit tests: ClassNameTest
public class AccountServiceTest { }

// Integration tests: ClassNameIT
public class AccountServiceIT { }
```

### Test Method Naming
```java
// Pattern: methodName_condition_expectedResult
@Test
public void createAccount_validData_success() {
    // Arrange
    CreateAccountRequest request = new CreateAccountRequest("user123", "SAVINGS");

    // Act
    Account account = accountService.createAccount(request);

    // Assert
    assertNotNull(account.getId());
    assertEquals("SAVINGS", account.getType());
}

@Test
public void withdraw_insufficientFunds_throwsException() {
    // Arrange
    Account account = createAccountWithBalance(BigDecimal.valueOf(100));

    // Act & Assert
    assertThrows(InsufficientFundsException.class, () -> {
        accountService.withdraw(account, BigDecimal.valueOf(200));
    });
}
```

### Test Structure (AAA Pattern)
```java
@Test
public void transfer_validAccounts_success() {
    // Arrange: Set up test data
    Account source = createAccountWithBalance(BigDecimal.valueOf(1000));
    Account target = createAccountWithBalance(BigDecimal.valueOf(0));
    BigDecimal amount = BigDecimal.valueOf(500);

    // Act: Execute the operation
    transferService.transfer(source, target, amount);

    // Assert: Verify results
    assertEquals(BigDecimal.valueOf(500), source.getBalance());
    assertEquals(BigDecimal.valueOf(500), target.getBalance());
}
```

---

## Spring Boot Specific

### REST Controllers
```java
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String id) {
        Account account = accountService.findById(id);
        return ResponseEntity.ok(AccountResponse.from(account));
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request) {
        Account account = accountService.createAccount(request);
        return ResponseEntity
            .created(URI.create("/api/v1/accounts/" + account.getId()))
            .body(AccountResponse.from(account));
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            AccountNotFoundException e) {
        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(e.getMessage()));
    }
}
```

### Service Layer
```java
@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final EventPublisher eventPublisher;

    public Account createAccount(CreateAccountRequest request) {
        // Validate
        validateAccountRequest(request);

        // Create entity
        Account account = Account.builder()
            .userId(request.getUserId())
            .type(request.getType())
            .balance(BigDecimal.ZERO)
            .build();

        // Save
        account = accountRepository.save(account);

        // Publish event
        eventPublisher.publish(new AccountCreatedEvent(account.getId()));

        return account;
    }
}
```

### Repository Layer
```java
@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUserId(String userId);

    List<Account> findByStatus(AccountStatus status);

    @Query("SELECT a FROM Account a WHERE a.balance > :minBalance")
    List<Account> findAccountsWithMinBalance(@Param("minBalance") BigDecimal minBalance);
}
```

---

## Code Style

### Formatting
- **Indentation:** 4 spaces
- **Line length:** 120 characters (soft limit)
- **Braces:** Opening brace on same line
- **Blank lines:** Between methods, logical blocks

```java
public class Example {
    public void method() {
        if (condition) {
            // Code
        } else {
            // Code
        }
    }
}
```

### Comments
```java
// Good: Explain "why", not "what"
// Use exponential backoff to avoid overwhelming the external API
retryWithBackoff(apiCall);

// Bad: Obvious comment
// Increment counter
counter++;

// JavaDoc for public APIs
/**
 * Calculates the interest for an account.
 *
 * @param principal the principal amount
 * @param rate the interest rate (as decimal, e.g., 0.05 for 5%)
 * @param years the number of years
 * @return the total interest amount
 * @throws IllegalArgumentException if rate is negative
 */
public BigDecimal calculateInterest(
        BigDecimal principal,
        BigDecimal rate,
        int years) {
    // Implementation
}
```

---

## Best Practices

### Prefer Composition Over Inheritance
```java
// Good: Composition
public class UserService {
    private final EmailService emailService;
    private final NotificationService notificationService;
}

// Avoid: Deep inheritance hierarchies
public class UserService extends BaseService
        extends AbstractService extends GenericService {
    // Too many layers
}
```

### Use Enums
```java
// Good: Type-safe enum
public enum AccountStatus {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    CLOSED
}

// Bad: String constants
public class AccountStatus {
    public static final String ACTIVE = "ACTIVE";
    public static final String INACTIVE = "INACTIVE";
}
```

### Avoid Magic Numbers
```java
// Bad: Magic numbers
if (user.getAge() > 18) {
    // ...
}

// Good: Named constants
private static final int MINIMUM_AGE = 18;

if (user.getAge() > MINIMUM_AGE) {
    // ...
}
```

---

## Verification Checklist

- [ ] Java 17+ features used appropriately
- [ ] No raw types (all generics parameterized)
- [ ] Optional used for potentially null values
- [ ] Constructor injection used (not field injection)
- [ ] Immutable objects where possible
- [ ] Try-with-resources for AutoCloseable
- [ ] SLF4J for logging (not System.out)
- [ ] Specific exceptions (not generic Exception)
- [ ] Test coverage >80%
- [ ] Code formatted with Checkstyle/Spotless
- [ ] No SonarQube critical violations

---

## Related Documents

- [Quality Standards](../quality-standards.md) - Testing and code quality
- [Security Standards](../security-standards.md) - Secure coding practices
- [Workflow Standards](../workflow-standards.md) - Git workflow and CI/CD

---

**Note:** Use Checkstyle, SpotBugs, and SonarQube to enforce these standards automatically.
