# TypeScript Coding Standards

**Owner:** Temenos Frontend Guild
**Version:** 1.0
**Last Updated:** 2025-01-11

---

## Purpose

This document defines coding standards for TypeScript projects across all Temenos products.

---

## TypeScript Configuration

### Compiler Options (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "allowSyntheticDefaultImports": true
  }
}
```

### Strict Mode
**Requirement:** Always use strict mode (`"strict": true`)

This enables:
- `noImplicitAny`: No implicit `any` types
- `strictNullChecks`: Null and undefined handled explicitly
- `strictFunctionTypes`: Function parameter contravariance
- `strictBindCallApply`: Type-check bind, call, apply
- `strictPropertyInitialization`: Class properties initialized
- `noImplicitThis`: `this` type must be explicit

---

## File Organization

### File Naming
- **Kebab-case:** `recurring-payment-form.ts`
- **Component files:** `my-component.ts`
- **Test files:** `my-component.test.ts` or `my-component.spec.ts`
- **Type files:** `types.ts` or `my-component.types.ts`
- **Constants:** `constants.ts`

### Directory Structure
```
src/
├── components/           # Reusable components
│   ├── base/            # Primitive components
│   └── composite/       # Composite components
├── services/            # Business logic services
├── utils/               # Utility functions
├── types/               # Type definitions
├── constants/           # Constants
├── styles/              # Global styles
└── main.ts              # Entry point
```

### File Structure
```typescript
// 1. Imports (grouped and sorted)
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

// 2. Types and interfaces
interface PaymentData {
  amount: number;
  currency: string;
}

// 3. Constants
const MAX_AMOUNT = 100000;

// 4. Main class/function
@customElement('my-component')
export class MyComponent extends LitElement {
  // Implementation
}

// 5. Helper functions (private to module)
function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
```

---

## Naming Conventions

### Variables and Functions
```typescript
// camelCase for variables and functions
const userName = 'John';
let accountBalance = 1000;

function calculateInterest(principal: number, rate: number): number {
  return principal * rate;
}

// Boolean variables: use is/has/can prefix
const isActive = true;
const hasPermission = false;
const canEdit = true;
```

### Constants
```typescript
// SCREAMING_SNAKE_CASE for constants
const MAX_RETRY_ATTEMPTS = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

### Classes and Interfaces
```typescript
// PascalCase for classes and interfaces
class UserAccount {
  // ...
}

interface PaymentRequest {
  amount: number;
  currency: string;
}

// Use 'I' prefix only if needed to avoid naming conflicts
interface IPaymentService {
  // ...
}
```

### Type Aliases
```typescript
// PascalCase for type aliases
type UserId = string;
type PaymentStatus = 'pending' | 'completed' | 'failed';
type Callback<T> = (value: T) => void;
```

### Enums
```typescript
// PascalCase for enum name, SCREAMING_SNAKE_CASE for values
enum TransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER'
}

// Or use const enum for tree-shaking
const enum Status {
  PENDING = 0,
  ACTIVE = 1,
  INACTIVE = 2
}
```

---

## Type Annotations

### Explicit Types
Prefer explicit types for function parameters and return values:
```typescript
// Good: Explicit types
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

// Bad: Implicit any
function calculateTotal(price, quantity) {
  return price * quantity;
}
```

### Type Inference
Let TypeScript infer types for local variables when obvious:
```typescript
// Good: Inference is clear
const userName = 'John';  // string
const age = 30;          // number
const isActive = true;   // boolean

// Good: Explicit when not obvious
const users: User[] = [];
const config: Config = loadConfig();
```

### Avoid `any`
Never use `any` unless absolutely necessary:
```typescript
// Bad: any type
function processData(data: any): any {
  return data.toString();
}

// Good: Explicit type or generic
function processData<T>(data: T): string {
  return String(data);
}

// Good: Unknown when type is truly unknown
function processData(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }
  return String(data);
}
```

### Null and Undefined
Handle null and undefined explicitly:
```typescript
// Good: Explicit null handling
function findUser(id: string): User | null {
  const user = users.find(u => u.id === id);
  return user ?? null;
}

// Good: Optional chaining
const email = user?.profile?.email;

// Good: Nullish coalescing
const displayName = user.name ?? 'Anonymous';
```

---

## Functions

### Function Declarations
```typescript
// Named function
function calculateTax(amount: number, rate: number): number {
  return amount * rate;
}

// Arrow function
const calculateTax = (amount: number, rate: number): number => {
  return amount * rate;
};

// Arrow function (concise)
const calculateTax = (amount: number, rate: number): number => amount * rate;
```

### Function Parameters
```typescript
// Destructuring parameters
function createUser({ name, email, age }: {
  name: string;
  email: string;
  age: number;
}): User {
  // ...
}

// Or with interface
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
}

function createUser(params: CreateUserParams): User {
  // ...
}

// Default parameters
function fetchData(url: string, timeout: number = 5000): Promise<Response> {
  // ...
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Return Types
Always specify return types for public functions:
```typescript
// Good: Explicit return type
function getUser(id: string): User | null {
  // ...
}

async function fetchUser(id: string): Promise<User> {
  // ...
}

// Exception: Inference for simple one-liners
const double = (n: number) => n * 2;
```

---

## Classes

### Class Structure
```typescript
export class UserService {
  // 1. Private static properties
  private static instance: UserService;

  // 2. Public static properties
  public static readonly VERSION = '1.0.0';

  // 3. Private instance properties
  private users: User[] = [];

  // 4. Public instance properties
  public isInitialized = false;

  // 5. Constructor
  constructor(private apiClient: ApiClient) {
    this.initialize();
  }

  // 6. Public static methods
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService(new ApiClient());
    }
    return UserService.instance;
  }

  // 7. Public instance methods
  public async getUser(id: string): Promise<User> {
    return this.apiClient.get(`/users/${id}`);
  }

  // 8. Private instance methods
  private initialize(): void {
    this.isInitialized = true;
  }
}
```

### Access Modifiers
```typescript
class Account {
  // Public: Accessible from anywhere (default)
  public id: string;

  // Private: Only accessible within class
  private balance: number;

  // Protected: Accessible in class and subclasses
  protected createdAt: Date;

  // Readonly: Cannot be reassigned
  public readonly accountNumber: string;

  constructor(id: string, accountNumber: string) {
    this.id = id;
    this.accountNumber = accountNumber;
    this.balance = 0;
    this.createdAt = new Date();
  }

  public getBalance(): number {
    return this.balance;
  }

  private calculateInterest(): number {
    return this.balance * 0.05;
  }
}
```

### Getters and Setters
```typescript
class User {
  private _age: number = 0;

  // Getter
  get age(): number {
    return this._age;
  }

  // Setter with validation
  set age(value: number) {
    if (value < 0 || value > 150) {
      throw new Error('Invalid age');
    }
    this._age = value;
  }
}
```

---

## Interfaces and Types

### Interfaces
```typescript
// Interface for object shape
interface User {
  id: string;
  name: string;
  email: string;
  age?: number;  // Optional property
  readonly createdAt: Date;  // Readonly property
}

// Extending interfaces
interface Admin extends User {
  permissions: string[];
  role: 'admin' | 'superadmin';
}

// Index signature
interface Dictionary {
  [key: string]: any;
}
```

### Type Aliases
```typescript
// Union types
type Status = 'pending' | 'active' | 'inactive';

// Intersection types
type Admin = User & {
  permissions: string[];
  role: string;
};

// Function types
type Callback = (error: Error | null, result: any) => void;

// Conditional types
type NonNullable<T> = T extends null | undefined ? never : T;
```

### Interface vs Type
**Prefer interfaces for:**
- Object shapes
- Classes
- Extensibility (can be extended/merged)

**Prefer types for:**
- Union types
- Intersection types
- Mapped types
- Utility types

---

## Generics

### Generic Functions
```typescript
// Generic function
function identity<T>(value: T): T {
  return value;
}

// Generic with constraint
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Multiple type parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}
```

### Generic Classes
```typescript
class Container<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }
}

const numberContainer = new Container<number>();
numberContainer.add(1);
```

### Generic Constraints
```typescript
// Constraint: must have length property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

// Constraint: must extend base class
class BaseEntity {
  id: string;
}

function saveEntity<T extends BaseEntity>(entity: T): Promise<void> {
  // Can access entity.id
}
```

---

## Async/Await

### Promises
```typescript
// Async function
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  return response.json();
}

// Error handling
async function fetchUser(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Parallel execution
async function fetchMultiple(): Promise<[User[], Post[]]> {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts()
  ]);
  return [users, posts];
}
```

---

## Error Handling

### Try-Catch
```typescript
function parseJSON(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error('Invalid JSON:', error.message);
    }
    throw error;
  }
}
```

### Custom Errors
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

function validateAge(age: number): void {
  if (age < 0 || age > 150) {
    throw new ValidationError('Invalid age', 'age', age);
  }
}
```

---

## Imports and Exports

### Import Statements
```typescript
// Named imports
import { User, Admin } from './types';

// Default import
import React from 'react';

// Namespace import
import * as utils from './utils';

// Side-effect import
import './styles.css';

// Type-only import (TypeScript 3.8+)
import type { User } from './types';
```

### Export Statements
```typescript
// Named exports
export function calculateTax(amount: number): number {
  return amount * 0.2;
}

export const TAX_RATE = 0.2;

// Default export
export default class UserService {
  // ...
}

// Re-exports
export { User, Admin } from './types';
export * from './utils';
```

---

## Code Style

### Formatting
- **Indentation:** 2 spaces
- **Line length:** 80-120 characters (soft limit)
- **Quotes:** Single quotes for strings, double quotes for JSX
- **Semicolons:** Use semicolons
- **Trailing commas:** Use for multiline (easier diffs)

```typescript
const user = {
  name: 'John',
  email: 'john@example.com',  // Trailing comma
};
```

### Comments
```typescript
// Good: Explain "why", not "what"
// Use exponential backoff to avoid overwhelming the server
await retry(fetchData, { maxAttempts: 3, backoff: true });

// Bad: Obvious comment
// Increment counter
counter++;

// JSDoc for public APIs
/**
 * Fetches user data from the API
 * @param id - The user ID
 * @returns Promise resolving to user data
 * @throws {NotFoundError} If user does not exist
 */
async function fetchUser(id: string): Promise<User> {
  // ...
}
```

---

## Best Practices

### Immutability
```typescript
// Prefer const
const users = [];

// Avoid mutations
const newUsers = [...users, newUser];  // Good
users.push(newUser);  // Avoid

// Immutable updates
const updatedUser = { ...user, name: 'New Name' };
```

### Destructuring
```typescript
// Object destructuring
const { name, email } = user;

// Array destructuring
const [first, second] = items;

// Rest operator
const { id, ...rest } = user;
```

### Template Literals
```typescript
// Use template literals for string interpolation
const message = `Hello, ${user.name}!`;

// Multiline strings
const query = `
  SELECT *
  FROM users
  WHERE id = ${id}
`;
```

### Optional Chaining
```typescript
// Safe property access
const email = user?.profile?.email;

// Safe method call
const result = obj.method?.();

// Safe array access
const first = arr?.[0];
```

### Nullish Coalescing
```typescript
// Use ?? for null/undefined checks
const name = user.name ?? 'Anonymous';

// vs || which treats 0, '', false as falsy
const count = user.count ?? 0;  // Good: 0 is valid
const count = user.count || 0;  // Bad: 0 becomes 0
```

---

## Verification Checklist

- [ ] Strict mode enabled (`"strict": true`)
- [ ] No `any` types (use `unknown` or generics)
- [ ] Explicit return types for public functions
- [ ] Null/undefined handled explicitly
- [ ] Consistent naming conventions (camelCase, PascalCase)
- [ ] File names in kebab-case
- [ ] Imports organized and sorted
- [ ] No unused variables or imports
- [ ] Code formatted with Prettier
- [ ] ESLint passing with no errors

---

## Related Documents

- [Quality Standards](../quality-standards.md) - Testing and code quality
- [Security Standards](../security-standards.md) - Secure coding practices
- [Workflow Standards](../workflow-standards.md) - Git workflow and CI/CD

---

**Note:** Use Prettier and ESLint to enforce these standards automatically.
