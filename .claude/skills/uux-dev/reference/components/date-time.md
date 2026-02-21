# Date & Time Components

Advanced date and time selection components for complex temporal scenarios in financial services and enterprise applications. These components go beyond simple date picking to handle relative dates, recurrence patterns, frequency definitions, and multi-period selections.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Date Range Picker | `<uwc-date-range-picker>` | Start and end date selection |
| Date Relative Picker | `<uwc-date-relative-picker>` | Fixed or relative dates (e.g., "Last 30 days") |
| Date Frequency Picker | `<uwc-date-frequency-picker>` | Recurring patterns with frequency |
| Date Recurrence Picker | `<uwc-date-recurrence-picker>` | Complex recurrence rules (e.g., "2nd Tuesday") |
| Date Period Picker | `<uwc-date-period-picker>` | Period during which an event occurs |
| Date Multi-Period Picker | `<uwc-date-multi-period-picker>` | Multiple non-contiguous periods |
| Period Combobox | `<uwc-period-combobox>` | Quick period selection dropdown |

**For simple date selection, see [Date Picker](form-inputs.md#uwc-date-picker) in Form Inputs.**

---

## uwc-date-range-picker

Select a start date and end date to define a contiguous date range.

### Key Features
- Start and end date selection
- Single component for date ranges
- Validation (end date after start date)
- Preset ranges (e.g., "Last 7 days", "This month")
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height per field
- **Compact** (mobile): 40px height per field

### When to Use
- Report date ranges
- Event start and end dates
- Booking periods (hotel, rental)
- Campaign duration

### Example
```html
<!-- Basic date range picker -->
<uwc-date-range-picker
  label="Report Period"
  required>
</uwc-date-range-picker>

<!-- With preset ranges -->
<uwc-date-range-picker
  label="Date Range"
  presets='[
    {"label": "Last 7 days", "value": {"start": "-7d", "end": "today"}},
    {"label": "Last 30 days", "value": {"start": "-30d", "end": "today"}},
    {"label": "This month", "value": {"start": "month-start", "end": "today"}}
  ]'>
</uwc-date-range-picker>

<!-- With min/max dates -->
<uwc-date-range-picker
  label="Event Duration"
  minDate="2025-01-01"
  maxDate="2025-12-31">
</uwc-date-range-picker>

<!-- Compact density -->
<uwc-date-range-picker
  label="Period"
  density="compact">
</uwc-date-range-picker>
```

### Related Components
- [Date Picker](form-inputs.md#uwc-date-picker) - Single date selection
- [Date Period Picker](#uwc-date-period-picker) - Period definition with more options

---

## uwc-date-relative-picker

Select either a fixed date OR a relative date (e.g., "Today", "Yesterday", "Last 30 days").

### Key Features
- Toggle between fixed and relative dates
- Predefined relative date options
- Custom relative date expressions
- Dynamic date resolution
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Financial reports (as-of dates)
- Dashboard date filters
- Data queries with relative dates
- Scenarios where "today" should auto-update

### Example
```html
<!-- Basic relative date picker -->
<uwc-date-relative-picker
  label="As of Date"
  required>
</uwc-date-relative-picker>

<!-- With custom relative options -->
<uwc-date-relative-picker
  label="Report Date"
  relativeOptions='[
    {"label": "Today", "value": "today"},
    {"label": "Yesterday", "value": "-1d"},
    {"label": "Last 7 days", "value": "-7d"},
    {"label": "Last 30 days", "value": "-30d"},
    {"label": "Start of month", "value": "month-start"},
    {"label": "End of month", "value": "month-end"}
  ]'>
</uwc-date-relative-picker>

<!-- Default to relative -->
<uwc-date-relative-picker
  label="Filter Date"
  mode="relative"
  defaultValue="today">
</uwc-date-relative-picker>
```

### Related Components
- [Date Picker](form-inputs.md#uwc-date-picker) - Fixed dates only
- [Period Combobox](#uwc-period-combobox) - Quick period selection

---

## uwc-date-frequency-picker

Define and select a frequency pattern based on a start date and period-based frequency type (daily, weekly, monthly, etc.).

### Key Features
- Start date selection
- Frequency type (daily, weekly, monthly, quarterly, yearly)
- Interval configuration (e.g., every 2 weeks)
- End condition (end date, occurrence count, or never)
- Two density modes

### Density Modes
- **Standard** (desktop): 56px height per field
- **Compact** (mobile): 40px height per field

### When to Use
- Payment schedules
- Meeting recurrence
- Report generation schedules
- Subscription billing cycles

### Example
```html
<!-- Basic frequency picker -->
<uwc-date-frequency-picker
  label="Payment Schedule"
  required>
</uwc-date-frequency-picker>

<!-- Monthly frequency -->
<uwc-date-frequency-picker
  label="Billing Frequency"
  startDate="2025-01-01"
  frequency="monthly"
  interval="1">
</uwc-date-frequency-picker>

<!-- With end condition -->
<uwc-date-frequency-picker
  label="Meeting Schedule"
  startDate="2025-01-15"
  frequency="weekly"
  interval="1"
  endType="occurrences"
  occurrences="12">
</uwc-date-frequency-picker>

<!-- Every 2 weeks -->
<uwc-date-frequency-picker
  label="Report Schedule"
  frequency="weekly"
  interval="2"
  endType="never">
</uwc-date-frequency-picker>
```

### Related Components
- [Date Recurrence Picker](#uwc-date-recurrence-picker) - More complex recurrence rules
- [Date Period Picker](#uwc-date-period-picker) - Period definition

---

## uwc-date-recurrence-picker

Define and select complex recurrence patterns (e.g., "2nd Tuesday of every month", "Last working day of quarter").

### Key Features
- Complex recurrence rules
- Day-of-week selection
- Week-of-month selection (1st, 2nd, 3rd, 4th, last)
- Month/quarter/year patterns
- Holiday and working day handling
- Two density modes

### Density Modes
- **Standard** (desktop): 56px height per field
- **Compact** (mobile): 40px height per field

### When to Use
- Board meeting schedules (e.g., "2nd Tuesday of each month")
- Financial reporting deadlines (e.g., "Last working day of quarter")
- Complex recurring events
- Payroll schedules (e.g., "Last Friday of month")

### Example
```html
<!-- Basic recurrence picker -->
<uwc-date-recurrence-picker
  label="Meeting Schedule"
  required>
</uwc-date-recurrence-picker>

<!-- 2nd Tuesday of each month -->
<uwc-date-recurrence-picker
  label="Board Meeting"
  pattern="monthly"
  weekOfMonth="2"
  dayOfWeek="tuesday"
  startDate="2025-01-01">
</uwc-date-recurrence-picker>

<!-- Last working day of quarter -->
<uwc-date-recurrence-picker
  label="Quarterly Report Due"
  pattern="quarterly"
  dayType="last-working-day"
  startDate="2025-01-01">
</uwc-date-recurrence-picker>

<!-- Every weekday -->
<uwc-date-recurrence-picker
  label="Daily Standup"
  pattern="weekly"
  daysOfWeek='["monday", "tuesday", "wednesday", "thursday", "friday"]'>
</uwc-date-recurrence-picker>
```

### Related Components
- [Date Frequency Picker](#uwc-date-frequency-picker) - Simple frequency patterns
- [Date Period Picker](#uwc-date-period-picker) - Period definition

---

## uwc-date-period-picker

Define a period during which an event should occur, with additional period metadata.

### Key Features
- Start and end date selection
- Period type (daily, weekly, monthly, quarterly, yearly)
- Period name/description
- Period status
- Two density modes

### Density Modes
- **Standard** (desktop): 56px height per field
- **Compact** (mobile): 40px height per field

### When to Use
- Fiscal period definition
- Campaign periods
- Project phases
- Budget periods
- Accounting periods

### Example
```html
<!-- Basic period picker -->
<uwc-date-period-picker
  label="Fiscal Period"
  required>
</uwc-date-period-picker>

<!-- Quarterly period -->
<uwc-date-period-picker
  label="Budget Period"
  periodType="quarterly"
  startDate="2025-01-01"
  endDate="2025-03-31"
  periodName="Q1 2025">
</uwc-date-period-picker>

<!-- Campaign period -->
<uwc-date-period-picker
  label="Campaign Duration"
  periodType="custom"
  startDate="2025-02-01"
  endDate="2025-02-14"
  periodName="Valentine's Day Campaign"
  status="active">
</uwc-date-period-picker>

<!-- Fiscal year -->
<uwc-date-period-picker
  label="Fiscal Year"
  periodType="yearly"
  startDate="2025-04-01"
  endDate="2026-03-31"
  periodName="FY 2025-2026">
</uwc-date-period-picker>
```

### Related Components
- [Date Range Picker](#uwc-date-range-picker) - Simple date range
- [Date Multi-Period Picker](#uwc-date-multi-period-picker) - Multiple periods

---

## uwc-date-multi-period-picker

Select multiple non-contiguous date periods (e.g., "Q1 2025, Q3 2025, Q1 2026").

### Key Features
- Multiple period selection
- Non-contiguous periods
- Add/remove periods dynamically
- Period list display
- Two density modes

### Density Modes
- **Standard** (desktop): 56px height per field
- **Compact** (mobile): 40px height per field

### When to Use
- Multi-period financial analysis
- Comparative reporting (e.g., "Compare Q1 2024 vs Q1 2025")
- Seasonal analysis (e.g., "All summer months")
- Non-contiguous time ranges

### Example
```html
<!-- Basic multi-period picker -->
<uwc-date-multi-period-picker
  label="Report Periods"
  required>
</uwc-date-multi-period-picker>

<!-- Pre-selected periods -->
<uwc-date-multi-period-picker
  label="Comparison Periods"
  periods='[
    {"start": "2024-01-01", "end": "2024-03-31", "name": "Q1 2024"},
    {"start": "2025-01-01", "end": "2025-03-31", "name": "Q1 2025"}
  ]'>
</uwc-date-multi-period-picker>

<!-- With max periods -->
<uwc-date-multi-period-picker
  label="Select Analysis Periods"
  maxPeriods="5"
  helperText="Select up to 5 periods for comparison">
</uwc-date-multi-period-picker>
```

### Related Components
- [Date Period Picker](#uwc-date-period-picker) - Single period
- [Date Range Picker](#uwc-date-range-picker) - Single contiguous range

---

## uwc-period-combobox

Quick period selection dropdown with predefined common periods.

### Key Features
- Predefined period options
- Quick selection
- Common financial periods
- Custom period support
- Two density modes (Standard: 56px, Compact: 40px)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Dashboard date filters
- Quick report period selection
- Standard period selection (MTD, QTD, YTD)
- When space is limited

### Example
```html
<!-- Basic period combobox -->
<uwc-period-combobox
  label="Period"
  required>
</uwc-period-combobox>

<!-- With custom periods -->
<uwc-period-combobox
  label="Report Period"
  periods='[
    {"label": "Today", "value": "today"},
    {"label": "Yesterday", "value": "yesterday"},
    {"label": "Last 7 days", "value": "last-7-days"},
    {"label": "Last 30 days", "value": "last-30-days"},
    {"label": "MTD", "value": "month-to-date"},
    {"label": "QTD", "value": "quarter-to-date"},
    {"label": "YTD", "value": "year-to-date"}
  ]'>
</uwc-period-combobox>

<!-- Financial periods -->
<uwc-period-combobox
  label="Fiscal Period"
  periods='[
    {"label": "Current Quarter", "value": "current-quarter"},
    {"label": "Current Fiscal Year", "value": "current-fy"},
    {"label": "Last Quarter", "value": "last-quarter"},
    {"label": "Last Fiscal Year", "value": "last-fy"}
  ]'>
</uwc-period-combobox>

<!-- Compact density -->
<uwc-period-combobox
  label="Period"
  density="compact">
</uwc-period-combobox>
```

### Related Components
- [Date Relative Picker](#uwc-date-relative-picker) - Fixed or relative dates
- [Select](form-inputs.md#uwc-select) - General dropdown

---

## Decision Matrix

Choose the right date/time component for your scenario:

| Scenario | Recommended Component |
|----------|----------------------|
| Simple date selection (birth date, appointment) | [Date Picker](form-inputs.md#uwc-date-picker) |
| Start and end dates (report range, booking) | [Date Range Picker](#uwc-date-range-picker) |
| "As of" date that can be relative (e.g., "Today") | [Date Relative Picker](#uwc-date-relative-picker) |
| Quick dashboard filter (MTD, QTD, YTD) | [Period Combobox](#uwc-period-combobox) |
| Recurring payments (every 2 weeks) | [Date Frequency Picker](#uwc-date-frequency-picker) |
| Complex recurrence (2nd Tuesday of month) | [Date Recurrence Picker](#uwc-date-recurrence-picker) |
| Fiscal period definition with metadata | [Date Period Picker](#uwc-date-period-picker) |
| Comparative analysis (Q1 2024 vs Q1 2025) | [Date Multi-Period Picker](#uwc-date-multi-period-picker) |
| Inline calendar always visible | [Date Calendar](form-inputs.md#uwc-date-calendar) |

## Best Practices

### Component Selection
- **Start simple**: Use [Date Picker](form-inputs.md#uwc-date-picker) unless you have specific requirements
- **Relative dates**: Use [Date Relative Picker](#uwc-date-relative-picker) for dynamic "as-of" dates
- **Quick filters**: Use [Period Combobox](#uwc-period-combobox) for dashboard filters
- **Recurrence complexity**: Use [Date Frequency Picker](#uwc-date-frequency-picker) for simple patterns, [Date Recurrence Picker](#uwc-date-recurrence-picker) for complex rules

### Validation
- Always validate end date is after start date
- Provide clear error messages for invalid date ranges
- Use min/max dates to constrain valid selections
- Consider working days vs calendar days for financial scenarios

### User Experience
- Provide preset options for common selections
- Show resolved date values for relative dates
- Display period summaries clearly
- Use helper text to explain complex patterns

### Accessibility
- Ensure all date components have clear labels
- Provide keyboard navigation for calendar popups
- Use appropriate date format for user locale
- Support screen reader announcements for date changes

### Density Selection
- Use **Standard** density (56px) for desktop applications with ample space
- Use **Compact** density (40px) for mobile/tablet or high-density interfaces
- Maintain consistent density across all date components in a form

## Common Patterns

### Financial Reporting
```html
<!-- Fiscal period selection with comparison -->
<uwc-date-period-picker
  label="Primary Period"
  periodType="quarterly">
</uwc-date-period-picker>

<uwc-date-multi-period-picker
  label="Comparison Periods"
  maxPeriods="3">
</uwc-date-multi-period-picker>
```

### Dashboard Filters
```html
<!-- Quick date filter -->
<uwc-period-combobox
  label="Period"
  periods='[
    {"label": "Today", "value": "today"},
    {"label": "Last 7 days", "value": "last-7-days"},
    {"label": "MTD", "value": "month-to-date"},
    {"label": "YTD", "value": "year-to-date"}
  ]'>
</uwc-period-combobox>
```

### Recurring Schedules
```html
<!-- Meeting schedule (every 2 weeks on Tuesday) -->
<uwc-date-frequency-picker
  label="Meeting Schedule"
  startDate="2025-01-07"
  frequency="weekly"
  interval="2"
  dayOfWeek="tuesday">
</uwc-date-frequency-picker>

<!-- Board meeting (2nd Tuesday of each month) -->
<uwc-date-recurrence-picker
  label="Board Meeting"
  pattern="monthly"
  weekOfMonth="2"
  dayOfWeek="tuesday">
</uwc-date-recurrence-picker>
```

### Booking/Reservation
```html
<!-- Event duration -->
<uwc-date-range-picker
  label="Event Dates"
  minDate="2025-01-01"
  required>
</uwc-date-range-picker>
```
