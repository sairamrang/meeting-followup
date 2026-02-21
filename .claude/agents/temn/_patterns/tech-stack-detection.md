# Tech Stack Detection Patterns

> **Reference file for temn-init** - Contains detection rules for project types, frameworks, and tooling.

---

## Package Management Files

| File | Language/Platform |
|------|-------------------|
| `package.json` | Node.js/JavaScript |
| `pom.xml` | Java/Maven |
| `build.gradle` | Java/Gradle |
| `requirements.txt` | Python |
| `Pipfile` | Python |
| `Cargo.toml` | Rust |
| `go.mod` | Go |
| `Gemfile` | Ruby |
| `pubspec.yaml` | Flutter/Dart |
| `composer.json` | PHP |
| `Package.swift` | Swift |
| `*.csproj` | .NET |

---

## Project Type Detection

### web-app
**Indicators:**
- Dependencies: `vite`, `webpack`, `react`, `vue`, `angular`, `lit`, `svelte`
- Files: `src/index.html`, `index.html`, `public/index.html`
- Directories: `src/components`

### mobile-app
**Indicators:**
- Dependencies: `react-native`, `expo`, `flutter`
- Files: `App.tsx`, `App.js`, `app.json` (with expo), `pubspec.yaml`
- Directories: `ios`, `android`

### backend-api
**Indicators:**
- Dependencies: `express`, `fastify`, `nestjs`, `@nestjs/core`, `fastapi`, `django`, `flask`
- Directories: `src/routes`, `src/api`, `src/controllers`
- NOT present: `src/index.html`, `src/components`

### full-stack
**Indicators:**
- Dependencies: `next`, `remix`, `@remix-run`, `sveltekit`, `nuxt`
- Directories: `pages`, `app`, `routes`

### desktop-app
**Indicators:**
- Dependencies: `electron`, `tauri`
- Files: `tauri.conf.json`, `*.csproj`, `Package.swift`

### cli-tool
**Indicators:**
- package.json field: `bin`
- Directories: `bin`, `cli`

### library
**Indicators:**
- package.json fields: `main`, `exports`
- Directories: `dist`, `lib`

---

## Frontend Frameworks

| Framework | Dependencies | File Patterns |
|-----------|--------------|---------------|
| **Lit** | `lit`, `@lit/reactive-element` | `*.ts` with `from 'lit'` |
| **React** | `react`, `react-dom` | `*.tsx`, `*.jsx` |
| **Vue** | `vue`, `@vue/runtime-core` | `*.vue` |
| **Angular** | `@angular/core` | `*.component.ts` |
| **Svelte** | `svelte` | `*.svelte` |
| **React Native** | `react-native` | `App.tsx` |
| **Flutter** | (pubspec.yaml) | `*.dart` |

---

## Component Libraries

| Library | Dependencies | Usage Pattern |
|---------|--------------|---------------|
| **UUX** | `@unified-ux/uux-web` | `<uwc-*` |
| **Material UI** | `@mui/material`, `@material-ui/core` | `from '@mui'` |
| **Ant Design** | `antd` | `from 'antd'` |
| **Chakra UI** | `@chakra-ui/react` | `from '@chakra-ui'` |
| **Shadcn/ui** | `@radix-ui` | `from '@/components/ui'` |
| **React Native Paper** | `react-native-paper` | `from 'react-native-paper'` |

---

## Backend Frameworks

| Framework | Dependencies/Indicators |
|-----------|-------------------------|
| **Express.js** | `express` |
| **Fastify** | `fastify` |
| **NestJS** | `@nestjs/core`, `@nestjs/common` |
| **Koa** | `koa` |
| **Hapi** | `@hapi/hapi` |
| **FastAPI** | `fastapi` (requirements.txt) |
| **Django** | `django` (requirements.txt) |
| **Flask** | `flask` (requirements.txt) |
| **Spring Boot** | `spring-boot-starter` (pom.xml) |
| **ASP.NET Core** | `Microsoft.AspNetCore` (*.csproj) |
| **Gin** | `gin-gonic` (go.mod) |

---

## State Management

| Pattern | Dependencies | Usage Patterns |
|---------|--------------|----------------|
| **Context API** | (native React) | `createContext`, `useContext` |
| **Redux** | `redux`, `@reduxjs/toolkit` | `createSlice`, `configureStore` |
| **Zustand** | `zustand` | `create.*zustand` |
| **MobX** | `mobx`, `mobx-react` | `observable`, `makeObservable` |
| **Pinia** | `pinia` | `defineStore` |
| **Vuex** | `vuex` | `createStore` |
| **NgRx** | `@ngrx/store` | `createAction`, `createReducer` |
| **DataContext** | (custom) | `DataContext`, `@consume` |

---

## Testing Frameworks

| Framework | Dependencies | Config Files |
|-----------|--------------|--------------|
| **Vitest** | `vitest` | `vitest.config.*` |
| **Jest** | `jest`, `@jest/globals` | `jest.config.*` |
| **Playwright** | `@playwright/test` | `playwright.config.*` |
| **Cypress** | `cypress` | `cypress.config.*` |
| **Web Test Runner** | `@web/test-runner`, `@open-wc/testing` | `web-test-runner.config.*` |
| **pytest** | `pytest` (requirements.txt) | `pytest.ini` |
| **JUnit** | `junit` (pom.xml) | - |

**Test file patterns:**
- `**/*.test.{ts,tsx,js,jsx}`
- `**/*.spec.{ts,tsx,js,jsx}`
- `test/**`, `tests/**`, `__tests__/**`

---

## Build Tools

| Tool | Config Files |
|------|--------------|
| **Vite** | `vite.config.*` |
| **Webpack** | `webpack.config.*` |
| **esbuild** | `esbuild.config.*` |
| **Rollup** | `rollup.config.*` |
| **Next.js** | `next.config.*` |

---

## Architecture Patterns

### feature-based
- `src/features/*`
- `.temn/specs/*/components`
- `.temn/specs/*/services`

### layered
- `src/controllers`
- `src/services`
- `src/repositories`
- `src/models`

### hexagonal
- `src/domain`
- `src/application`
- `src/infrastructure`
- `src/adapters`

### microservices
- `services/*`
- `packages/*/src`
- `apps/*`

### monorepo
- `packages/*`
- `apps/*`
- `lerna.json`
- `nx.json`
- `pnpm-workspace.yaml`

---

## Styling Approaches

| Approach | Indicators |
|----------|------------|
| **Design Tokens** | `**/tokens.css`, `var(--` |
| **CSS-in-JS** | `styled-components`, `@emotion/styled` |
| **Tailwind** | `tailwindcss`, `tailwind.config.*` |
| **SCSS/Sass** | `sass`, `**/*.scss` |
| **CSS Modules** | `**/*.module.css` |

---

## Code Conventions

### File Naming
- **kebab-case**: `my-component.ts`
- **camelCase**: `myComponent.ts`
- **PascalCase**: `MyComponent.ts`
- **snake_case**: `my_component.ts`

### Import Style
Check `tsconfig.json` for `compilerOptions.paths`:
- `@/` alias: `from '@/'`
- `~/` alias: `from '~/'`
- Relative: `from '../'`

### Code Style
Check `.eslintrc.*` and `.prettierrc*` for:
- Quotes: `single` | `double`
- Semicolons: `true` | `false`
- Indentation: `2` | `4` | `tabs`
- Trailing commas: `none` | `es5` | `all`

---

## Detection Algorithm

```
1. Scan for package files (package.json, pom.xml, etc.)
2. Read dependencies from package file
3. Check each project type's indicators
4. Count matches for each type
5. Highest match count = detected type
6. If tie or low confidence → ask user
7. Validate with actual code usage (grep imports)
```

**Confidence Scoring:**
- 9-10: Single clear match, verified by code
- 7-8: Clear match, minor ambiguities
- 5-6: Multiple matches, ask user
- <5: Unable to determine, require user input
