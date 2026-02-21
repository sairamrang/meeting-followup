# Tech Stack: Java + Spring Boot

**Product Type:** Backend API / Microservice
**Category:** RESTful API, Microservices Architecture
**Stack ID:** java-spring
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Stack Overview

This tech stack is for building backend services and REST APIs using:
- **Java 17+ (LTS)** for type-safe, enterprise-grade development
- **Spring Boot 3.x** for rapid application development
- **Spring Data JPA** for database access
- **Spring Security** for authentication and authorization
- **Maven** for dependency management

**Use when:**
- Building RESTful APIs
- Creating microservices
- Need enterprise features (security, transactions, caching)
- Require database integration with ORM
- Building domain-driven design (DDD) architectures

---

## Technology Stack

### Core Framework
- **Java 17 LTS (or Java 21 LTS)** - Programming language
- **Spring Boot 3.2+** - Application framework
- **Spring Framework 6.x** - Core container and dependency injection

### Data Access
- **Spring Data JPA** - JPA repository abstraction
- **Hibernate** - ORM implementation
- **PostgreSQL / MySQL** - Relational database
- **Flyway / Liquibase** - Database migrations

### Security
- **Spring Security** - Authentication and authorization
- **OAuth 2.0 / JWT** - Token-based authentication
- **BCrypt** - Password hashing

### API
- **Spring Web MVC** - REST controller framework
- **OpenAPI 3.0 (Springdoc)** - API documentation
- **Jackson** - JSON serialization

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **TestContainers** - Database testing with containers
- **REST Assured** - API testing

### Build Tool
- **Maven 3.9+** - Dependency management and build
- Alternative: **Gradle 8.x**

### Code Quality
- **Checkstyle** - Code style checking
- **SpotBugs** - Static analysis
- **SonarQube** - Code quality platform
- **JaCoCo** - Code coverage

---

## Architecture Patterns

### Layered Architecture
```
src/main/java/com/temenos/product/
├── domain/                 # Domain layer (entities, value objects)
│   ├── model/
│   │   ├── Account.java
│   │   └── Transaction.java
│   └── repository/
│       ├── AccountRepository.java
│       └── TransactionRepository.java
├── application/            # Application layer (use cases, DTOs)
│   ├── dto/
│   │   ├── CreateAccountRequest.java
│   │   └── AccountResponse.java
│   └── service/
│       ├── AccountService.java
│       └── TransactionService.java
├── infrastructure/         # Infrastructure layer (adapters, config)
│   ├── adapter/
│   │   └── ExternalApiAdapter.java
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   └── DatabaseConfig.java
│   └── exception/
│       └── GlobalExceptionHandler.java
└── presentation/           # Presentation layer (controllers)
    └── controller/
        └── AccountController.java
```

### Domain Model (Entity)
```java
@Entity
@Table(name = "accounts")
@Getter
@Setter
@NoArgsConstructor
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AccountType type;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal balance;

    @Column(nullable = false)
    private AccountStatus status;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Version
    private Long version;  // Optimistic locking

    // Business methods
    public void deposit(BigDecimal amount) {
        validateAmount(amount);
        this.balance = this.balance.add(amount);
    }

    public void withdraw(BigDecimal amount) {
        validateAmount(amount);
        if (this.balance.compareTo(amount) < 0) {
            throw new InsufficientFundsException(this.balance, amount);
        }
        this.balance = this.balance.subtract(amount);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Amount must be positive");
        }
    }
}
```

### Repository Pattern
```java
@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    Optional<Account> findByUserId(String userId);

    List<Account> findByStatus(AccountStatus status);

    @Query("SELECT a FROM Account a WHERE a.balance > :minBalance")
    List<Account> findAccountsWithMinBalance(@Param("minBalance") BigDecimal minBalance);

    @Query("SELECT a FROM Account a " +
           "JOIN FETCH a.transactions " +
           "WHERE a.id = :id")
    Optional<Account> findByIdWithTransactions(@Param("id") String id);
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
    private final AccountMapper accountMapper;

    public AccountResponse createAccount(CreateAccountRequest request) {
        // Validate
        validateCreateRequest(request);

        // Create entity
        Account account = Account.builder()
            .userId(request.getUserId())
            .type(request.getType())
            .balance(BigDecimal.ZERO)
            .status(AccountStatus.ACTIVE)
            .build();

        // Save
        account = accountRepository.save(account);

        // Publish event
        eventPublisher.publish(new AccountCreatedEvent(account.getId()));

        // Map to DTO
        return accountMapper.toResponse(account);
    }

    @Transactional(readOnly = true)
    public AccountResponse getAccount(String id) {
        Account account = accountRepository.findById(id)
            .orElseThrow(() -> new AccountNotFoundException(id));
        return accountMapper.toResponse(account);
    }

    public void transfer(String sourceId, String targetId, BigDecimal amount) {
        // Lock accounts in consistent order to prevent deadlocks
        String firstId = sourceId.compareTo(targetId) < 0 ? sourceId : targetId;
        String secondId = sourceId.compareTo(targetId) < 0 ? targetId : sourceId;

        Account first = accountRepository.findById(firstId)
            .orElseThrow(() -> new AccountNotFoundException(firstId));
        Account second = accountRepository.findById(secondId)
            .orElseThrow(() -> new AccountNotFoundException(secondId));

        Account source = firstId.equals(sourceId) ? first : second;
        Account target = firstId.equals(targetId) ? first : second;

        // Execute transfer
        source.withdraw(amount);
        target.deposit(amount);

        // Save both accounts
        accountRepository.saveAll(List.of(source, target));

        // Publish event
        eventPublisher.publish(new TransferCompletedEvent(sourceId, targetId, amount));
    }
}
```

### REST Controller
```java
@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
@Validated
public class AccountController {
    private final AccountService accountService;

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String id) {
        AccountResponse account = accountService.getAccount(id);
        return ResponseEntity.ok(account);
    }

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody CreateAccountRequest request) {
        AccountResponse account = accountService.createAccount(request);
        return ResponseEntity
            .created(URI.create("/api/v1/accounts/" + account.getId()))
            .body(account);
    }

    @PostMapping("/{id}/deposit")
    public ResponseEntity<Void> deposit(
            @PathVariable String id,
            @Valid @RequestBody DepositRequest request) {
        accountService.deposit(id, request.getAmount());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/withdraw")
    public ResponseEntity<Void> withdraw(
            @PathVariable String id,
            @Valid @RequestBody WithdrawRequest request) {
        accountService.withdraw(id, request.getAmount());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/transfer")
    public ResponseEntity<Void> transfer(
            @Valid @RequestBody TransferRequest request) {
        accountService.transfer(
            request.getSourceId(),
            request.getTargetId(),
            request.getAmount()
        );
        return ResponseEntity.noContent().build();
    }
}
```

---

## Configuration

### application.yml
```yaml
spring:
  application:
    name: account-service

  datasource:
    url: jdbc:postgresql://localhost:5432/accounts
    username: ${DB_USERNAME:postgres}
    password: ${DB_PASSWORD:password}
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: validate  # Use Flyway for migrations
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        jdbc:
          batch_size: 20
        order_inserts: true
        order_updates: true

  flyway:
    enabled: true
    baseline-on-migrate: true
    locations: classpath:db/migration

  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${JWT_ISSUER_URI:http://localhost:8080/auth}

server:
  port: 8080
  error:
    include-message: always
    include-binding-errors: always

logging:
  level:
    root: INFO
    com.temenos: DEBUG
    org.hibernate.SQL: DEBUG

springdoc:
  api-docs:
    path: /api-docs
  swagger-ui:
    path: /swagger-ui.html
```

### pom.xml (Key Dependencies)
```xml
<properties>
    <java.version>17</java.version>
    <spring-boot.version>3.2.0</spring-boot.version>
</properties>

<dependencies>
    <!-- Spring Boot Starters -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Database -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>

    <!-- OpenAPI Documentation -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

---

## Security Configuration

### JWT Authentication
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api-docs/**", "/swagger-ui/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/api/v1/accounts/**").hasRole("USER")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2
                .jwt(jwt -> jwt
                    .jwtAuthenticationConverter(jwtAuthenticationConverter())
                )
            );

        return http.build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
            new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtAuthenticationConverter =
            new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(
            grantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }
}
```

---

## Exception Handling

### Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleAccountNotFound(
            AccountNotFoundException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .code("ACCOUNT_NOT_FOUND")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(InsufficientFundsException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientFunds(
            InsufficientFundsException ex) {
        ErrorResponse error = ErrorResponse.builder()
            .code("INSUFFICIENT_FUNDS")
            .message(ex.getMessage())
            .timestamp(LocalDateTime.now())
            .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidation(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .collect(Collectors.toMap(
                FieldError::getField,
                FieldError::getDefaultMessage
            ));

        ValidationErrorResponse error = ValidationErrorResponse.builder()
            .code("VALIDATION_ERROR")
            .message("Validation failed")
            .errors(errors)
            .timestamp(LocalDateTime.now())
            .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

---

## Testing Standards

### Unit Test
```java
@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private EventPublisher eventPublisher;

    @InjectMocks
    private AccountService accountService;

    @Test
    void createAccount_validRequest_success() {
        // Arrange
        CreateAccountRequest request = CreateAccountRequest.builder()
            .userId("user123")
            .type(AccountType.SAVINGS)
            .build();

        Account savedAccount = Account.builder()
            .id("acc123")
            .userId("user123")
            .type(AccountType.SAVINGS)
            .balance(BigDecimal.ZERO)
            .build();

        when(accountRepository.save(any(Account.class)))
            .thenReturn(savedAccount);

        // Act
        AccountResponse response = accountService.createAccount(request);

        // Assert
        assertNotNull(response.getId());
        assertEquals("user123", response.getUserId());
        assertEquals(AccountType.SAVINGS, response.getType());
        verify(eventPublisher).publish(any(AccountCreatedEvent.class));
    }
}
```

### Integration Test
```java
@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class AccountControllerIT {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withDatabaseName("test")
        .withUsername("test")
        .withPassword("test");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AccountRepository accountRepository;

    @BeforeEach
    void setUp() {
        accountRepository.deleteAll();
    }

    @Test
    @WithMockUser(roles = "USER")
    void createAccount_validRequest_returns201() throws Exception {
        String requestBody = """
            {
                "userId": "user123",
                "type": "SAVINGS"
            }
            """;

        mockMvc.perform(post("/api/v1/accounts")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andExpect(jsonPath("$.userId").value("user123"))
            .andExpect(jsonPath("$.type").value("SAVINGS"));
    }
}
```

---

## Quality Standards

### Code Coverage
- **Minimum:** >80% line coverage
- **Preferred:** >90% for service layer
- **Critical paths:** 100% coverage

### Performance
- **Response time:** P95 < 500ms for GET, < 2s for POST/PUT
- **Throughput:** Handle 1000 requests/second per instance
- **Database:** < 10 queries per request (avoid N+1)

### API Standards
- **Versioning:** URL versioning (`/api/v1/`)
- **HTTP Methods:** Follow REST semantics (GET, POST, PUT, DELETE)
- **Status Codes:** Use appropriate HTTP status codes
- **Pagination:** Support pagination for list endpoints
- **Filtering:** Support filtering and sorting

---

## Verification Checklist

- [ ] Java 17+ LTS used
- [ ] Spring Boot 3.x
- [ ] Layered architecture (domain, application, infrastructure, presentation)
- [ ] Repository pattern for data access
- [ ] Service layer with @Transactional
- [ ] REST controllers with proper HTTP methods and status codes
- [ ] Global exception handling
- [ ] JWT authentication configured
- [ ] Database migrations (Flyway/Liquibase)
- [ ] OpenAPI documentation
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests with TestContainers
- [ ] Lombok for boilerplate reduction
- [ ] No N+1 queries
- [ ] Optimistic locking for concurrent updates

---

## Related Documents

- [Java Coding Standards](../../standards/coding-conventions/java-coding-standards.md)
- [Quality Standards](../../standards/quality-standards.md)
- [Security Standards](../../standards/security-standards.md)
- [Workflow Standards](../../standards/workflow-standards.md)

---

## Resources

- **Spring Boot Documentation:** https://docs.spring.io/spring-boot/docs/current/reference/html/
- **Spring Data JPA:** https://docs.spring.io/spring-data/jpa/docs/current/reference/html/
- **Spring Security:** https://docs.spring.io/spring-security/reference/
- **OpenAPI:** https://springdoc.org/

---

**Maintained By:** Temenos Backend Guild
**Support:** backend-support@temenos.com
