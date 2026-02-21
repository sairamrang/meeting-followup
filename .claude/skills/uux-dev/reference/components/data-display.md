# Data Display Components

Components for presenting structured data, visualizations, and code in various formats.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Table (Deprecated) | `<uwc-table>` | Basic table (deprecated) |
| Flex Table | `<uwc-flex-table>` | Advanced data table with sorting, filtering, pagination |
| Tree | `<uwc-tree>` | Hierarchical data structure |
| List | `<uwc-list>` | Simple ordered/unordered lists |
| Grid | `<uwc-grid>` | Card-based responsive grid layout |
| Chart | `<uwc-chart>` | Data visualizations (HighCharts wrapper) |
| Dashboard | `<uwc-dashboard>` | Configurable dashboard with widgets |
| Code Editor | `<uwc-code-editor>` | Syntax-highlighted code editing |

---

## uwc-table (Deprecated)

**Note:** This component is deprecated. Use [Flex Table](#uwc-flex-table) instead.

Basic table component for displaying tabular data. Lacks advanced features like sorting, filtering, and pagination.

### Migration
Replace `<uwc-table>` with `<uwc-flex-table>` for enhanced functionality.

---

## uwc-flex-table

Advanced data table with sorting, filtering, pagination, row selection, and column customization.

### Key Features
- Column sorting (single and multi-column)
- Client-side and server-side filtering
- Pagination (client and server modes)
- Row selection (single and multi-select)
- Sticky header
- Resizable columns
- Column visibility toggle
- Export to CSV/Excel
- Virtual scrolling for large datasets
- Responsive column stacking
- Two density modes (Standard: 56px row height, Compact: 40px row height)

### Density Modes
- **Standard** (desktop): 56px row height
- **Compact** (mobile): 40px row height

### When to Use
- Display large datasets (100+ rows)
- Need sorting and filtering
- User needs to select rows
- Export data requirements
- Financial data grids, transaction lists

### Example

**IMPORTANT:** `uwc-flex-table` uses a `tableSpec` property object, NOT separate `data` and `columns` properties.

```typescript
// In your Lit component
const tableSpec = {
  primaryKeyFieldName: 'id',
  primaryKeyValueType: 'string', // or 'number'

  columnSpecs: [
    {
      label: 'ID',
      fieldName: 'id',
      cssWidthValue: '80px',
    },
    {
      label: 'Name',
      fieldName: 'name',
    },
    {
      label: 'Email',
      fieldName: 'email',
      horizontalAlignment: 'end', // 'start', 'center', 'end'
    },
    {
      label: 'Status',
      fieldName: 'status',
      cssWidthValue: '120px',
    },
  ],

  // Optional: Add record-level actions
  recordLevelActionSpecs: [
    {
      actionId: 'view',
      title: 'View Details',
      icon: 'visibility',
      presentationStyle: 'icon', // 'icon', 'link', or 'menu'
    },
    {
      actionId: 'edit',
      title: 'Edit',
      presentationStyle: 'menu',
    },
    {
      actionId: 'delete',
      title: 'Delete',
      icon: 'delete',
      presentationStyle: 'menu',
    },
  ],

  dataRecords: [
    { id: '1', name: 'John Doe', email: 'john@example.com', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', status: 'Inactive' },
  ],
};

// In your render method
render() {
  return html`
    <uwc-flex-table
      .tableSpec=${tableSpec}
      @recordLevelActionTriggered=${this.handleAction}>
    </uwc-flex-table>
  `;
}

// Handle actions
private handleAction(e: CustomEvent) {
  const { actionId, dataRecord } = e.detail;
  console.log('Action:', actionId, 'Record:', dataRecord);
}
```

**With Internal Pagination:**
```typescript
const tableSpec = {
  primaryKeyFieldName: 'id',
  primaryKeyValueType: 'string',
  columnSpecs: [...],
  dataRecords: [...], // All records - table handles pagination internally
};

html`
  <uwc-flex-table
    .tableSpec=${tableSpec}
    maxRecordsPerPage="20"
    showVisibleRecordRangeStatement
    fillAvailableWidth>
  </uwc-flex-table>
`;
```

**With Row Selection:**
```typescript
const tableSpec = {
  primaryKeyFieldName: 'id',
  primaryKeyValueType: 'string',
  columnSpecs: [...],
  dataRecords: [...],
};

html`
  <uwc-flex-table
    .tableSpec=${tableSpec}
    recordSelectionMode="multi"
    showRecordSelectorColumn
    pipeSeparatedSelectedRecordKeysList="1|3|5"
    @recordSelectionChanged=${this.handleSelectionChange}>
  </uwc-flex-table>
`;
```

**Key Properties:**
- `maxRecordsPerPage` - Enables pagination with specified page size (e.g., "20")
- `showVisibleRecordRangeStatement` - Shows "Showing 1-20 of 100" text
- `fillAvailableWidth` - Makes table take full width of container
- `pagedRecordsSource` - "internal" (default) or "external" for server-side paging
- `showGlobalRecordFilterToolbar` - Shows built-in filter toolbar
- `globalRecordFilterLiveUpdate` - Updates table as user types in filter

### Best Practices
- Use virtual scrolling for 1000+ rows
- Enable filtering for 50+ rows
- Use server-side pagination for very large datasets
- Provide clear column headers
- Use sticky headers for long tables
- Enable column resizing for user flexibility

### Accessibility
- Ensure semantic table structure
- Provide clear column headers
- Support keyboard navigation (Tab, Arrow keys)
- Announce sort changes to screen readers
- Maintain focus when filtering/sorting

### Related Components
- [Tree](#uwc-tree) - Hierarchical data
- [List](#uwc-list) - Simple lists
- [Grid](#uwc-grid) - Card-based layout

---

## uwc-tree

Display hierarchical data in expandable/collapsible tree structure.

### Key Features
- Expandable/collapsible nodes
- Multi-level nesting
- Node selection
- Checkbox selection for nodes
- Lazy loading support
- Custom node templates
- Drag-and-drop reordering
- Two density modes (Standard: 40px node height, Compact: 32px node height)

### Density Modes
- **Standard** (desktop): 40px node height
- **Compact** (mobile): 32px node height

### When to Use
- File/folder navigation
- Organizational hierarchies
- Category trees
- Menu structures
- Nested data visualization

### Example
```html
<!-- Basic tree -->
<uwc-tree
  data='[
    {
      "label": "Root",
      "children": [
        {"label": "Child 1"},
        {
          "label": "Child 2",
          "children": [
            {"label": "Grandchild 1"},
            {"label": "Grandchild 2"}
          ]
        }
      ]
    }
  ]'>
</uwc-tree>

<!-- With checkbox selection -->
<uwc-tree
  data="..."
  selectable
  selectionMode="checkbox">
</uwc-tree>

<!-- With lazy loading -->
<uwc-tree
  data="..."
  lazy
  loadOnExpand>
</uwc-tree>

<!-- Compact density -->
<uwc-tree
  data="..."
  density="compact">
</uwc-tree>
```

### Related Components
- [Flex Table](#uwc-flex-table) - Tabular data
- [Hierarchy Control](specialized-enterprise.md#uwc-hierarchy-control) - Financial hierarchies

---

## uwc-list

Simple list component for displaying ordered or unordered items.

### Key Features
- Ordered and unordered lists
- Interactive list items
- Leading icons
- Trailing actions
- Dividers
- Two-line and three-line items
- Two density modes (Standard: 56px item height, Compact: 40px item height)

### Density Modes
- **Standard** (desktop): 56px item height (single line)
- **Compact** (mobile): 40px item height (single line)

### When to Use
- Navigation menus
- Settings options
- Simple item lists
- Contact lists
- Message threads

### Example
```html
<!-- Basic list -->
<uwc-list>
  <uwc-list-item>Item 1</uwc-list-item>
  <uwc-list-item>Item 2</uwc-list-item>
  <uwc-list-item>Item 3</uwc-list-item>
</uwc-list>

<!-- With icons -->
<uwc-list>
  <uwc-list-item icon="home">Home</uwc-list-item>
  <uwc-list-item icon="settings">Settings</uwc-list-item>
  <uwc-list-item icon="logout">Logout</uwc-list-item>
</uwc-list>

<!-- Two-line items -->
<uwc-list>
  <uwc-list-item
    primaryText="John Doe"
    secondaryText="john@example.com"
    icon="person">
  </uwc-list-item>
  <uwc-list-item
    primaryText="Jane Smith"
    secondaryText="jane@example.com"
    icon="person">
  </uwc-list-item>
</uwc-list>

<!-- With dividers -->
<uwc-list>
  <uwc-list-item>Item 1</uwc-list-item>
  <uwc-list-divider></uwc-list-divider>
  <uwc-list-item>Item 2</uwc-list-item>
  <uwc-list-divider></uwc-list-divider>
  <uwc-list-item>Item 3</uwc-list-item>
</uwc-list>

<!-- Compact density -->
<uwc-list density="compact">
  <uwc-list-item>Item 1</uwc-list-item>
  <uwc-list-item>Item 2</uwc-list-item>
</uwc-list>
```

### Related Components
- [Flex Table](#uwc-flex-table) - Structured data
- [Tree](#uwc-tree) - Hierarchical lists

---

## uwc-grid

Bootstrap-style 12-column responsive grid layout using container/item pattern.

### Key Features
- 12-column grid system
- Container + Item pattern
- Responsive breakpoints (xs, sm, md, lg)
- Configurable spacing (1-5 = 8px intervals)
- Automatic wrapping and responsive reflow

### Grid Pattern

UWC grid uses a **container/item** pattern similar to Bootstrap:

```html
<uwc-grid container spacing="3">
  <uwc-grid item xs="12" md="6" lg="4"><!-- content --></uwc-grid>
  <uwc-grid item xs="12" md="6" lg="4"><!-- content --></uwc-grid>
  <uwc-grid item xs="12" md="6" lg="4"><!-- content --></uwc-grid>
</uwc-grid>
```

### Attributes

**Container Attributes:**
- `container` - Marks the outer grid container (required)
- `spacing="1-5"` - Gap between items (1=8px, 2=16px, 3=24px, 4=32px, 5=40px)

**Item Attributes:**
- `item` - Marks each grid cell (required)
- `xs="1-12"` - Columns on extra small screens (<576px)
- `sm="1-12"` - Columns on small screens (≥576px)
- `md="1-12"` - Columns on medium/tablet (≥768px)
- `lg="1-12"` - Columns on large/desktop (≥992px)

### 12-Column System

Total columns = 12. Items exceeding 12 columns wrap to next row.

**Common responsive layouts:**

| Layout | Mobile (xs) | Tablet (md) | Desktop (lg) | Description |
|--------|-------------|-------------|--------------|-------------|
| 1 column | 12 | 12 | 12 | Always full width |
| 2 columns | 12 | 6 | 6 | Stack on mobile, 2 cols tablet+ |
| 3 columns | 12 | 6 | 4 | Stack on mobile, 2 cols tablet, 3 cols desktop |
| 4 columns | 12 | 6 | 3 | Stack on mobile, 2 cols tablet, 4 cols desktop |

### When to Use
- Dashboard layouts
- Card grids
- Form layouts (Golden Form pattern)
- Responsive content areas
- Any multi-column responsive layout

### Examples

**3-column dashboard cards (responsive):**
```html
<uwc-grid container spacing="2">
  <uwc-grid item xs="12" md="6" lg="4">
    <uwc-card heading="Total Balance">$57,778.50</uwc-card>
  </uwc-grid>
  <uwc-grid item xs="12" md="6" lg="4">
    <uwc-card heading="Available">$57,578.50</uwc-card>
  </uwc-grid>
  <uwc-grid item xs="12" md="6" lg="4">
    <uwc-card heading="Accounts">4</uwc-card>
  </uwc-grid>
</uwc-grid>
```

**2-column layout:**
```html
<uwc-grid container spacing="3">
  <uwc-grid item xs="12" lg="6">
    <uwc-card heading="Accounts Overview">...</uwc-card>
  </uwc-grid>
  <uwc-grid item xs="12" lg="6">
    <uwc-card heading="Recent Transactions">...</uwc-card>
  </uwc-grid>
</uwc-grid>
```

**Form layout (Golden Form pattern):**
```html
<uwc-grid container spacing="3">
  <uwc-grid item xs="12" sm="12" md="8" lg="8">
    <uwc-text-field label="Address" required></uwc-text-field>
  </uwc-grid>
  <uwc-grid item xs="0" sm="0" md="4" lg="4">
    <!-- Blank column for spacing -->
  </uwc-grid>
  <uwc-grid item xs="12" sm="4" md="4" lg="4">
    <uwc-text-field label="City" required></uwc-text-field>
  </uwc-grid>
  <uwc-grid item xs="12" sm="4" md="4" lg="4">
    <!-- Static select - for dynamic value binding, use .options property -->
    <!-- See form-inputs.md#uwc-select for details -->
    <uwc-select label="State" required>
      <uwc-list-item value="CA">California</uwc-list-item>
      <uwc-list-item value="NY">New York</uwc-list-item>
    </uwc-select>
  </uwc-grid>
  <uwc-grid item xs="12" sm="4" md="4" lg="4">
    <uwc-text-field label="Zip Code" required></uwc-text-field>
  </uwc-grid>
</uwc-grid>
```

### Best Practices

- Always use `container` on the outer grid element
- Always use `item` on child grid elements
- Define responsive breakpoints (xs, md, lg minimum)
- Total columns should equal 12 for aligned layouts
- Use `xs="0"` to hide items on mobile
- Use `spacing="2"` (16px) or `spacing="3"` (24px) for most layouts

### Related Components
- [Card](layout-containers.md#uwc-card) - Grid item container
- [Dashboard](#uwc-dashboard) - Sortable grid variant
- [Flex Table](#uwc-flex-table) - Tabular alternative

---

## uwc-chart

Data visualization component using HighCharts library.

### Key Features
- Multiple chart types (line, bar, column, pie, area, scatter, bubble, treemap, sunburst, sankey, gauge)
- Interactive legends
- Zooming and panning
- Data labels
- Export to PNG/SVG/PDF
- Responsive sizing
- Animation
- Multiple series support

**IMPORTANT:** Requires HighCharts license for commercial use. Contact Temenos UUX team before use.

**Separate Bundle:** Chart component is in a separate bundle from core UUX library.

### When to Use
- Financial dashboards
- Data analysis
- KPI visualizations
- Trend analysis
- Comparative analysis

### Example
```html
<!-- Load chart bundle -->
<script src="https://developer.temenos.com/uux/unified-ux-chart.min.js"></script>

<!-- Line chart -->
<uwc-chart
  type="line"
  config='{
    "title": {"text": "Sales Trend"},
    "xAxis": {"categories": ["Jan", "Feb", "Mar", "Apr", "May"]},
    "yAxis": {"title": {"text": "Sales ($)"}},
    "series": [{
      "name": "2025",
      "data": [1000, 1500, 1200, 1800, 2000]
    }]
  }'>
</uwc-chart>

<!-- Column chart -->
<uwc-chart
  type="column"
  data="..."
  config="...">
</uwc-chart>

<!-- Pie chart -->
<uwc-chart
  type="pie"
  config='{
    "title": {"text": "Market Share"},
    "series": [{
      "data": [
        {"name": "Product A", "y": 45},
        {"name": "Product B", "y": 30},
        {"name": "Product C", "y": 25}
      ]
    }]
  }'>
</uwc-chart>

<!-- Treemap chart -->
<uwc-chart type="treemap" config="..."></uwc-chart>

<!-- Sunburst chart -->
<uwc-chart type="sunburst" config="..."></uwc-chart>
```

### Chart Types
- **Line**: Trends over time
- **Column/Bar**: Category comparisons
- **Pie/Donut**: Part-to-whole relationships
- **Area**: Cumulative trends
- **Scatter**: Correlation analysis
- **Bubble**: Three-dimensional data
- **Treemap**: Hierarchical data proportions
- **Sunburst**: Nested hierarchical data
- **Sankey**: Flow diagrams
- **Gauge**: Single metric with target

### Best Practices
- Choose appropriate chart type for data
- Limit colors to 5-7 for clarity
- Provide clear titles and axis labels
- Use tooltips for detailed values
- Consider accessibility (patterns, not just colors)

### Related Components
- [Dashboard](#uwc-dashboard) - Chart container
- [Flex Table](#uwc-flex-table) - Tabular alternative

---

## uwc-dashboard

Configurable dashboard layout with draggable, resizable widgets.

### Key Features
- Drag-and-drop widget placement
- Resizable widgets
- Grid-based layout
- Widget add/remove
- Layout persistence
- Responsive breakpoints
- Two density modes

### Density Modes
- **Standard** (desktop): Normal widget padding
- **Compact** (mobile): Reduced widget padding

### When to Use
- User-customizable dashboards
- KPI monitoring
- Executive dashboards
- Analytics views

### Example
```html
<!-- Basic dashboard -->
<uwc-dashboard
  columns="12"
  rowHeight="100">
  <uwc-dashboard-widget
    title="Sales Chart"
    x="0" y="0" w="6" h="3">
    <uwc-chart type="line" data="..."></uwc-chart>
  </uwc-dashboard-widget>

  <uwc-dashboard-widget
    title="Revenue"
    x="6" y="0" w="3" h="2">
    <div class="kpi">$1.2M</div>
  </uwc-dashboard-widget>

  <uwc-dashboard-widget
    title="Customer List"
    x="0" y="3" w="9" h="4">
    <uwc-flex-table data="..."></uwc-flex-table>
  </uwc-dashboard-widget>
</uwc-dashboard>

<!-- With drag-and-drop -->
<uwc-dashboard
  editable
  draggable
  resizable>
  <!-- Widgets -->
</uwc-dashboard>
```

### Best Practices
- Group related widgets
- Most important info top-left
- Use consistent widget sizes
- Provide default layouts
- Allow user customization
- Save user layout preferences

### Related Components
- [Chart](#uwc-chart) - Dashboard widget content
- [Card](layout-containers.md#uwc-card) - Simple widget alternative

---

## uwc-code-editor

Syntax-highlighted code editor with language support.

### Key Features
- Syntax highlighting (50+ languages)
- Line numbers
- Code folding
- Search and replace
- Multiple themes
- Read-only mode
- Auto-completion
- Bracket matching

### When to Use
- Configuration editing (JSON, YAML, XML)
- Code samples in documentation
- SQL query editors
- Script editing
- API testing tools

### Example
```html
<!-- JavaScript editor -->
<uwc-code-editor
  language="javascript"
  value='function hello() {
  console.log("Hello, World!");
}'
  lineNumbers>
</uwc-code-editor>

<!-- JSON editor -->
<uwc-code-editor
  language="json"
  value='{"name": "John", "age": 30}'
  theme="dark"
  readOnly>
</uwc-code-editor>

<!-- SQL editor -->
<uwc-code-editor
  language="sql"
  placeholder="Enter SQL query..."
  autoComplete>
</uwc-code-editor>
```

### Supported Languages
JavaScript, TypeScript, Python, Java, C#, SQL, HTML, CSS, JSON, XML, YAML, Markdown, and more.

### Best Practices
- Use appropriate language for syntax highlighting
- Enable line numbers for reference
- Provide clear placeholder text
- Use read-only mode for examples
- Consider theme (light/dark) for context

### Related Components
- [Text Area](form-inputs.md#uwc-text-area) - Plain text multi-line input

---

## Decision Matrix

| Scenario | Recommended Component |
|----------|----------------------|
| Tabular data with sorting/filtering | [Flex Table](#uwc-flex-table) |
| Hierarchical file/folder structure | [Tree](#uwc-tree) |
| Simple navigation menu | [List](#uwc-list) |
| Product catalog or image gallery | [Grid](#uwc-grid) |
| Financial charts and graphs | [Chart](#uwc-chart) |
| Customizable analytics dashboard | [Dashboard](#uwc-dashboard) |
| Code/configuration editing | [Code Editor](#uwc-code-editor) |

## Best Practices

### Performance
- Use virtual scrolling for large tables (1000+ rows)
- Lazy load tree nodes for deep hierarchies
- Server-side pagination for very large datasets
- Debounce filter inputs
- Use code splitting for chart library

### Accessibility
- Provide keyboard navigation for all interactive elements
- Use semantic table structure
- Announce dynamic content changes to screen readers
- Ensure sufficient color contrast in charts
- Provide text alternatives for visual data

### User Experience
- Show loading states for async data
- Provide empty states with helpful guidance
- Enable export for data tables
- Allow column customization in tables
- Responsive behavior for mobile devices
