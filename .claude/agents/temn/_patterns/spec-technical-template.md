# {Feature Name} - Technical Specification

---

## Architecture

```
{file structure - 10 lines max}
```

---

## API

| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/{resource} | GET | {purpose} |
| /api/{resource} | POST | {purpose} |
| /api/{resource}/{id} | GET | {purpose} |

---

## UI Components

| Feature | Component | Notes |
|---------|-----------|-------|
| {feature area} | `<uwc-{name}>` | {usage notes} |

---

## Data Models

| Field | Type | Description |
|-------|------|-------------|
| {field} | {type} | {description} |

---

## NFRs

| Category | Target |
|----------|--------|
| Performance | < 500ms P95 |
| Accessibility | WCAG 2.2 AA |
| Bundle size | < 200KB gzip |

---

## Security

- **Auth:** {method}
- **Encryption:** {requirements}
- **Compliance:** {frameworks}

---

## Testing

| Type | Coverage | Focus |
|------|----------|-------|
| Unit | > 80% | {areas} |
| Integration | {coverage} | {areas} |
| E2E | Critical paths | {key workflows} |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| {risk description} | High/Med/Low | {approach} |

---

## Assumptions

- {key assumption}
