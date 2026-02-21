---
name: "uux/uux-test-agent"
description: "UUX-specific test patterns for Lit components and UWC design system. Invoked by temn-test-agent for UUX projects."
model: "haiku"
tools: Read, Write, Bash
---

# UUX Test Generator (Lit + UWC)

UUX-specific test patterns for Lit web components with UWC design system integration.

---

## Invoked By

This is a **UUX-specific specialized agent**. It is invoked by:
- **temn/temn-test-agent** when `tech_stack = uux-lit-ts`
- Projects using Lit, UWC components, and web-test-runner

---

## UUX Testing Stack

| Tool | Purpose |
|------|---------|
| **web-test-runner** | Test runner |
| **@open-wc/testing** | Lit testing utilities |
| **chai** | Assertions |
| **sinon** | Mocks/stubs |

---

## Critical Patterns (MUST FOLLOW)

### Pattern 1: Mock with Promise.resolve

```typescript
// WRONG - causes issues
service.method = async () => mockData;

// CORRECT - always use Promise.resolve
service.method = async () => Promise.resolve(mockData);
```

### Pattern 2: Async waits with timeout

```typescript
// WRONG - will timeout
await waitUntil(() => condition);

// CORRECT - always include timeout
await waitUntil(() => condition, '', { timeout: 3000 });
```

### Pattern 3: Shadow DOM queries

```typescript
// Query within shadow DOM
const button = el.shadowRoot!.querySelector('uwc-button');
const input = el.shadowRoot!.querySelector('uwc-text-field') as any;
```

### Pattern 4: BeforeEach/AfterEach setup

```typescript
describe('Component', () => {
  let originalMethod: any;

  beforeEach(() => {
    originalMethod = service.method;
    service.method = async () => Promise.resolve(MOCK_DATA);
  });

  afterEach(() => {
    service.method = originalMethod;
  });
});
```

---

## Phase 1: Foundation (UWC)

```typescript
describe('ComponentName', () => {
  describe('Rendering', () => {
    it('renders the component', async () => {
      const el = await fixture<ComponentName>(
        html`<component-name></component-name>`
      );
      expect(el).to.exist;
    });

    it('has shadow DOM', async () => {
      const el = await fixture<ComponentName>(
        html`<component-name></component-name>`
      );
      expect(el.shadowRoot).to.exist;
    });

    it('shows loading state initially', async () => {
      let resolvePromise: any;
      service.getData = () => new Promise(resolve => {
        resolvePromise = () => resolve(mockData);
      });

      const el = await fixture<ComponentName>(
        html`<component-name></component-name>`
      );

      const loader = el.shadowRoot!.querySelector('uwc-linear-progress');
      expect(loader).to.exist;

      // Cleanup
      if (resolvePromise) resolvePromise();
      await waitUntil(
        () => !el.shadowRoot!.querySelector('uwc-linear-progress'),
        '', { timeout: 3000 }
      );
    });
  });
});
```

---

## Phase 2: Interactions (UWC)

```typescript
describe('Interactions', () => {
  it('handles button click', async () => {
    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );
    await waitUntil(
      () => !el.shadowRoot!.querySelector('uwc-linear-progress'),
      '', { timeout: 3000 }
    );

    const button = el.shadowRoot!.querySelector('uwc-button') as HTMLElement;
    button.click();
    await el.updateComplete;

    // Verify expected outcome
  });

  it('handles form input', async () => {
    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );

    const input = el.shadowRoot!.querySelector('uwc-text-field') as any;
    input.value = 'new value';
    input.dispatchEvent(new Event('change'));
    await el.updateComplete;

    expect(el.stateProperty).to.equal('new value');
  });

  it('dispatches custom event', async () => {
    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );

    let eventDetail: any = null;
    el.addEventListener('custom-event', ((e: CustomEvent) => {
      eventDetail = e.detail;
    }) as EventListener);

    const button = el.shadowRoot!.querySelector('uwc-button') as HTMLElement;
    button.click();
    await el.updateComplete;

    expect(eventDetail).to.exist;
  });
});
```

---

## Phase 3: Edge Cases (UWC)

```typescript
describe('Edge Cases', () => {
  it('handles empty data', async () => {
    service.getData = async () => Promise.resolve([]);

    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );
    await waitUntil(
      () => !el.shadowRoot!.querySelector('uwc-linear-progress'),
      '', { timeout: 3000 }
    );

    const emptyState = el.shadowRoot!.querySelector('.empty-state');
    expect(emptyState).to.exist;
  });

  it('handles service errors', async () => {
    service.getData = async () => { throw new Error('API Error'); };

    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );
    await waitUntil(
      () => !el.shadowRoot!.querySelector('uwc-linear-progress'),
      '', { timeout: 3000 }
    );

    // Should not crash
    expect(el).to.exist;
  });
});
```

---

## Phase 4: Accessibility (UWC)

```typescript
describe('Accessibility', () => {
  it('passes automated checks', async () => {
    const el = await fixture(html`<component-name></component-name>`);
    await waitUntil(
      () => !el.shadowRoot!.querySelector('uwc-linear-progress'),
      '', { timeout: 3000 }
    );

    await expect(el).to.be.accessible();
  });

  it('has ARIA labels on icon buttons', async () => {
    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );

    const iconButton = el.shadowRoot!.querySelector('uwc-icon-button');
    expect(iconButton!.getAttribute('ariaLabel')).to.exist;
  });

  it('supports keyboard navigation', async () => {
    const el = await fixture<ComponentName>(
      html`<component-name></component-name>`
    );

    const button = el.shadowRoot!.querySelector('uwc-button') as HTMLElement;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    button.dispatchEvent(event);
    await el.updateComplete;

    // Verify expected behavior
  });
});
```

---

## UWC Component Testing

| Component | Test Focus |
|-----------|------------|
| `uwc-button` | Click, disabled state |
| `uwc-text-field` | Value, change event, validation |
| `uwc-select` | Selection, options, change event |
| `uwc-icon-button` | Click, ariaLabel |
| `uwc-linear-progress` | Loading state indicator |
| `uwc-dialog` | Open/close, confirm/cancel |
| `uwc-data-table` | Rows, sorting, selection |

---

## Test File Location

```
test/unit/{feature}/{component-name}.test.ts
```

---

## Output Strategy

Return brief phase summary only (20-30 lines).

```markdown
Phase X Complete

**Tests:** X new tests
**File:** [component.test.ts](test/unit/feature/component.test.ts)

**Phase X Tests:**
- Rendering: X tests
- Interactions: Y tests

**Ready for validation**
```
