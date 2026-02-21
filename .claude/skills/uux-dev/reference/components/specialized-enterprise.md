# Specialized & Enterprise Components

Domain-specific components designed for financial services and enterprise applications with advanced business requirements.

## Components Overview

| Component | Tag | Primary Use |
|-----------|-----|-------------|
| Hierarchy Field | `<uwc-hierarchy-field>` | Organizational hierarchy selection |
| Hierarchy Control | `<uwc-hierarchy-control>` | Interactive hierarchy tree viewer |
| Period Combobox | `<uwc-period-combobox>` | Quick financial period selection |
| Compact Flagset | `<uwc-compact-flagset>` | Multi-flag display for regulatory compliance |
| File Drag-Drop Area | `<uwc-file-dragdrop-area>` | Drag-and-drop file upload zone |
| Chatbot | `<uwc-chatbot>` | AI chat interface for conversational AI |
| Chart | `<uwc-chart>` | Data visualizations (detailed in Data Display) |
| Dashboard | `<uwc-dashboard>` | Configurable dashboard (detailed in Data Display) |

**Note:** Chart and Dashboard are also documented in [Data Display](data-display.md) as they serve both general and specialized use cases.

---

## uwc-hierarchy-field

Input field for selecting organizational or financial hierarchies (e.g., account hierarchies, cost centers, organizational units).

### Key Features
- Tree-based selection dialog
- Breadcrumb display of selected path
- Search/filter within hierarchy
- Multi-level hierarchy support
- Lazy loading for large hierarchies
- Two density modes (Standard: 56px height, Compact: 40px height)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Account hierarchy selection (GL accounts, cost centers)
- Organizational unit selection
- Department/division selection
- Customer/product hierarchy selection
- Any hierarchical entity selection

### Example
```html
<!-- Basic hierarchy field -->
<uwc-hierarchy-field
  label="Cost Center"
  required
  hierarchyData='{
    "root": {
      "id": "root",
      "label": "Company",
      "children": [
        {
          "id": "ops",
          "label": "Operations",
          "children": [
            {"id": "ops-it", "label": "IT"},
            {"id": "ops-hr", "label": "HR"}
          ]
        },
        {
          "id": "sales",
          "label": "Sales",
          "children": [
            {"id": "sales-us", "label": "US Sales"},
            {"id": "sales-eu", "label": "EU Sales"}
          ]
        }
      ]
    }
  }'>
</uwc-hierarchy-field>

<!-- With search -->
<uwc-hierarchy-field
  label="GL Account"
  searchable
  searchPlaceholder="Search accounts...">
</uwc-hierarchy-field>

<!-- With lazy loading -->
<uwc-hierarchy-field
  label="Customer Hierarchy"
  lazy
  loadChildren="loadHierarchyLevel">
</uwc-hierarchy-field>

<!-- Display selected path as breadcrumb -->
<uwc-hierarchy-field
  label="Organization Unit"
  showBreadcrumb
  value="ops-it">
  <!-- Displays: Company > Operations > IT -->
</uwc-hierarchy-field>

<!-- Compact density -->
<uwc-hierarchy-field
  label="Department"
  density="compact">
</uwc-hierarchy-field>
```

### Best Practices
- Enable search for hierarchies with 20+ nodes
- Use lazy loading for very large hierarchies (1000+ nodes)
- Show breadcrumb of selected path
- Provide clear node labels
- Consider default expanded levels
- Validate selection at appropriate level

### Accessibility
- Use semantic tree structure
- Support keyboard navigation (Arrow keys, Enter, Escape)
- Announce tree expansions
- Provide clear focus indicators
- Search field must be accessible

### Related Components
- [Hierarchy Control](#uwc-hierarchy-control) - View/navigate hierarchy
- [Tree](data-display.md#uwc-tree) - General tree component
- [Autocomplete](form-inputs.md#uwc-autocomplete) - Flat list alternative

---

## uwc-hierarchy-control

Interactive hierarchy tree viewer/navigator for browsing and managing hierarchical data structures.

### Key Features
- Expandable/collapsible tree
- Multi-level hierarchy display
- Node selection and actions
- Drag-and-drop reordering
- Context menu support
- Search/filter
- Node editing inline
- Two density modes (Standard: 40px node height, Compact: 32px node height)

### Density Modes
- **Standard** (desktop): 40px node height
- **Compact** (mobile): 32px node height

### When to Use
- Manage organizational structures
- Browse account hierarchies
- View/edit taxonomy trees
- Category management
- File system browsing
- Product catalog management

### Example
```html
<!-- Basic hierarchy control -->
<uwc-hierarchy-control
  data='{
    "id": "root",
    "label": "Chart of Accounts",
    "children": [
      {
        "id": "assets",
        "label": "Assets",
        "children": [
          {"id": "current-assets", "label": "Current Assets"},
          {"id": "fixed-assets", "label": "Fixed Assets"}
        ]
      },
      {
        "id": "liabilities",
        "label": "Liabilities",
        "children": [
          {"id": "current-liabilities", "label": "Current Liabilities"},
          {"id": "long-term-liabilities", "label": "Long-term Liabilities"}
        ]
      },
      {
        "id": "equity",
        "label": "Equity",
        "children": [
          {"id": "capital", "label": "Capital"},
          {"id": "retained-earnings", "label": "Retained Earnings"}
        ]
      }
    ]
  }'>
</uwc-hierarchy-control>

<!-- With actions -->
<uwc-hierarchy-control
  data="..."
  editable
  allowAdd
  allowDelete
  allowReorder>
</uwc-hierarchy-control>

<!-- With search -->
<uwc-hierarchy-control
  data="..."
  searchable
  searchPlaceholder="Search hierarchy...">
</uwc-hierarchy-control>

<!-- With context menu -->
<uwc-hierarchy-control
  data="..."
  contextMenu="hierarchyMenu">
</uwc-hierarchy-control>

<!-- Compact density -->
<uwc-hierarchy-control
  data="..."
  density="compact">
</uwc-hierarchy-control>
```

### Common Actions
- **Add child**: Add new node under selected
- **Edit**: Rename node inline
- **Delete**: Remove node (with confirmation)
- **Move**: Drag-and-drop reordering
- **Copy**: Duplicate node/subtree

### Best Practices
- Provide context menu for node actions
- Confirm destructive actions (delete)
- Show loading state for lazy loading
- Limit initial expanded levels (2-3)
- Enable search for large hierarchies
- Provide breadcrumb for current location
- Visual feedback for drag-and-drop

### Accessibility
- Use semantic tree structure (`role="tree"`, `role="treeitem"`)
- Support keyboard navigation (Arrow keys, Enter, Space, Home, End)
- Announce expansions and actions
- Clear focus indicators
- Support screen reader navigation

### Related Components
- [Hierarchy Field](#uwc-hierarchy-field) - Hierarchy selection input
- [Tree](data-display.md#uwc-tree) - General tree display
- [Flex Table](data-display.md#uwc-flex-table) - Flat list alternative

---

## uwc-period-combobox

Quick selection dropdown for common financial periods (MTD, QTD, YTD, etc.).

**Note:** This component is also documented in [Date & Time Components](date-time.md#uwc-period-combobox).

### Key Features
- Predefined financial periods
- Custom period support
- Quick selection
- Two density modes (Standard: 56px height, Compact: 40px height)

### Density Modes
- **Standard** (desktop): 56px height
- **Compact** (mobile): 40px height

### When to Use
- Financial report filters
- Dashboard date selection
- Quick period selection (MTD, QTD, YTD)
- Standard fiscal period selection

### Example
```html
<!-- Basic period combobox -->
<uwc-period-combobox
  label="Report Period"
  periods='[
    {"label": "MTD", "value": "month-to-date"},
    {"label": "QTD", "value": "quarter-to-date"},
    {"label": "YTD", "value": "year-to-date"},
    {"label": "Last Quarter", "value": "last-quarter"},
    {"label": "Last Year", "value": "last-year"}
  ]'>
</uwc-period-combobox>

<!-- With fiscal year support -->
<uwc-period-combobox
  label="Fiscal Period"
  fiscalYearStart="04-01"
  periods="...">
</uwc-period-combobox>

<!-- Compact density -->
<uwc-period-combobox
  label="Period"
  density="compact">
</uwc-period-combobox>
```

### Common Periods
- **MTD** (Month-to-Date)
- **QTD** (Quarter-to-Date)
- **YTD** (Year-to-Date)
- **Last Month**
- **Last Quarter**
- **Last Year**
- **Current Fiscal Year**
- **Last Fiscal Year**

### Related Components
- [Date Relative Picker](date-time.md#uwc-date-relative-picker) - Relative date selection
- [Date Period Picker](date-time.md#uwc-date-period-picker) - Custom period definition
- [Select](form-inputs.md#uwc-select) - General dropdown

---

## uwc-compact-flagset

Display multiple boolean flags in compact format, commonly used for regulatory compliance and feature flags.

### Key Features
- Multiple flag display
- Compact visual representation
- Tooltip descriptions
- Color-coded indicators
- Read-only or editable
- Two density modes (Standard: 32px height, Compact: 24px height)

### Density Modes
- **Standard** (desktop): 32px height
- **Compact** (mobile): 24px height

### When to Use
- Regulatory compliance flags (KYC, AML, PEP)
- Feature flags display
- Account status indicators
- Permission flags
- Boolean attributes

### Example
```html
<!-- Basic flagset (read-only) -->
<uwc-compact-flagset
  flags='[
    {"id": "kyc", "label": "KYC", "value": true, "description": "Know Your Customer verified"},
    {"id": "aml", "label": "AML", "value": true, "description": "Anti-Money Laundering cleared"},
    {"id": "pep", "label": "PEP", "value": false, "description": "Politically Exposed Person"},
    {"id": "fatca", "label": "FATCA", "value": true, "description": "FATCA compliant"}
  ]'>
</uwc-compact-flagset>

<!-- Editable flagset -->
<uwc-compact-flagset
  flags="..."
  editable>
</uwc-compact-flagset>

<!-- With custom colors -->
<uwc-compact-flagset
  flags='[
    {"id": "active", "label": "ACT", "value": true, "color": "success"},
    {"id": "suspended", "label": "SUS", "value": false, "color": "warning"},
    {"id": "blocked", "label": "BLK", "value": false, "color": "error"}
  ]'>
</uwc-compact-flagset>

<!-- Compact density -->
<uwc-compact-flagset
  flags="..."
  density="compact">
</uwc-compact-flagset>
```

### Best Practices
- Keep flag labels short (2-4 characters)
- Provide tooltips with full descriptions
- Use consistent color coding
- Group related flags
- Limit to 5-10 flags per set
- Clear true/false visual distinction

### Accessibility
- Provide descriptive tooltips
- Don't rely on color alone
- Support keyboard navigation if editable
- Announce state changes
- Use semantic HTML

### Related Components
- [Badge](feedback-status.md#uwc-badge) - Single status indicator
- [Chip Group](buttons-actions.md#uwc-chip-group) - Multi-select tags
- [Checkbox Group](form-inputs.md#uwc-checkbox-group) - Editable boolean group

---

## uwc-file-dragdrop-area

Large drag-and-drop zone for file uploads with visual feedback.

### Key Features
- Drag-and-drop file upload
- Click to browse files
- Multiple file support
- File type restrictions
- File size validation
- Upload progress display
- Preview thumbnails
- Two density modes

### Density Modes
- **Standard** (desktop): 200px minimum height
- **Compact** (mobile): 150px minimum height

### When to Use
- Document upload areas
- Image/media upload
- Bulk file upload
- Primary file upload interface
- When drag-and-drop UX is desired

### Example
```html
<!-- Basic drag-drop area -->
<uwc-file-dragdrop-area
  label="Upload Documents"
  accept=".pdf,.doc,.docx"
  helperText="Drag files here or click to browse">
</uwc-file-dragdrop-area>

<!-- Multiple files with size limit -->
<uwc-file-dragdrop-area
  label="Upload Images"
  accept="image/*"
  multiple
  maxFiles="10"
  maxSize="5242880"
  helperText="Maximum 10 images, 5MB each">
</uwc-file-dragdrop-area>

<!-- With preview thumbnails -->
<uwc-file-dragdrop-area
  label="Upload Photos"
  accept="image/*"
  multiple
  showPreviews>
</uwc-file-dragdrop-area>

<!-- With upload progress -->
<uwc-file-dragdrop-area
  label="Upload Files"
  multiple
  showProgress
  uploadEndpoint="/api/upload">
</uwc-file-dragdrop-area>

<!-- Compact density -->
<uwc-file-dragdrop-area
  label="Upload"
  density="compact">
</uwc-file-dragdrop-area>
```

### Visual States
- **Default**: Dashed border, upload icon, instructions
- **Drag over**: Highlighted border, visual feedback
- **Uploading**: Progress indicator
- **Success**: Checkmark, file list
- **Error**: Error icon, error message

### Best Practices
- Clearly indicate accepted file types
- Show file size limits
- Provide visual drag-over feedback
- Show upload progress for large files
- Display uploaded file list
- Allow file removal before submission
- Validate files before upload
- Provide error messages for invalid files

### Accessibility
- Keyboard accessible (Tab, Enter to browse)
- Screen reader announces drag-over state
- Provide text alternative to drag-drop
- Clear error messages
- Focus management

### Related Components
- [File Upload](form-inputs.md#uwc-file-upload) - Button-based file upload
- [Linear Progress](feedback-status.md#uwc-linear-progress) - Upload progress

---

## uwc-chatbot

AI-powered chatbot interface for conversational interactions with Temenos AI chat APIs.

### Key Features
- Chat window with message history
- Server Sent Events (SSE) streaming support
- Conversation mode (context-aware)
- Pre-defined prompts
- Parameterized prompts
- Insights generation
- Text and voice input
- Floating chat icon
- Resizable/dockable window
- Two density modes

**Separate Bundle:** Chatbot component is in a separate bundle from core UUX library.

### Density Modes
- **Standard** (desktop): Normal message padding
- **Compact** (mobile): Reduced message padding

### When to Use
- AI-powered Q&A interfaces
- Virtual assistants
- Conversational search
- Customer support chat
- Data query interfaces

### Example
```html
<!-- Load chatbot bundle -->
<script src="https://developer.temenos.com/uux/unified-ux-chatbot.min.js"></script>

<!-- Basic chatbot -->
<uwc-chatbot
  configuration='{
    "authToken": "YOUR_AUTH_TOKEN",
    "streamMode": "chat",
    "sqlExecutionEP": "https://api.example.com/query",
    "title": "Welcome to AI Assistant",
    "subtitle": "How can I help you today?",
    "initialResponse": "Hello! I can help you with queries about your accounts.",
    "showInsights": true,
    "allowTextInput": true,
    "autoOpen": false,
    "chatIcon": {
      "position": {"x": "100px", "y": "100px"},
      "size": {"w": "60px", "h": "60px"},
      "bgColor": "#4A5798",
      "icon": "chat",
      "iconSize": "medium"
    },
    "chatWindow": {
      "title": "AI Assistant",
      "showToolbar": true,
      "isResizable": true,
      "toolbar": ["clearChat", "toggleFullScreen", "toggleDock", "closeChat"]
    },
    "examples": [
      {
        "promptText": "Show me my account balance",
        "includeInStartPage": true
      },
      {
        "promptText": "List transactions for account {{accountNumber}}",
        "includeInStartPage": true,
        "parameters": [
          {
            "name": "accountNumber",
            "type": "Text"
          }
        ]
      }
    ]
  }'>
</uwc-chatbot>

<!-- With predefined prompts -->
<uwc-chatbot
  configuration='{
    ...
    "examples": [
      {"promptText": "What is my account balance?", "includeInStartPage": true},
      {"promptText": "Show recent transactions", "includeInStartPage": true},
      {"promptText": "Transfer money", "includeInStartPage": false},
      {"promptText": "Pay bills", "includeInStartPage": false}
    ]
  }'>
</uwc-chatbot>
```

### Configuration Options

**Stream Modes:**
- **"true"**: Server Sent Events (SSE) for progressive response
- **"false"**: Single response object
- **"chat"**: Conversation mode with context tracking

**Chat Window Options:**
- **Toolbar actions**: clearChat, toggleFullScreen, toggleDock, closeChat
- **Resizable**: Horizontal resize handle
- **Full-screen mode**: With custom insets to show sidebars
- **z-index**: Configurable for layering

**Prompts:**
- Static pre-defined prompts
- Parameterized prompts with {{parameter}} placeholders
- Parameter types: Text, Integer, Decimal, Date, List

### Best Practices
- Provide helpful initial message
- Include common prompts on start page
- Enable insights for richer responses
- Use conversation mode for context-aware chat
- Configure appropriate z-index for modals
- Provide clear close/minimize options
- Consider auto-open for primary use cases

### Accessibility
- Keyboard navigation support
- Screen reader announcements for new messages
- Focus management in chat window
- Clear visual focus indicators
- Skip links for long conversations

### Related Components
- [Text Field](form-inputs.md#uwc-text-field) - Text input alternative
- [Dialog](layout-containers.md#uwc-dialog) - Modal container alternative

---

## uwc-chart

See [Data Display > Chart](data-display.md#uwc-chart) for full documentation.

Data visualization component using HighCharts library. Requires separate license.

### Key Features
- Multiple chart types (line, bar, pie, treemap, sunburst, etc.)
- Interactive legends
- Export capabilities
- Responsive sizing

### When to Use
- Financial dashboards
- KPI visualizations
- Trend analysis
- Comparative reporting

---

## uwc-dashboard

See [Data Display > Dashboard](data-display.md#uwc-dashboard) for full documentation.

Configurable dashboard with draggable, resizable widgets.

### Key Features
- Drag-and-drop layout
- Resizable widgets
- Layout persistence
- Responsive breakpoints

### When to Use
- Executive dashboards
- Analytics views
- KPI monitoring
- User-customizable interfaces

---

## Decision Matrix

| Scenario | Recommended Component |
|----------|----------------------|
| Select from organizational hierarchy | [Hierarchy Field](#uwc-hierarchy-field) |
| Browse/manage hierarchical data | [Hierarchy Control](#uwc-hierarchy-control) |
| Quick financial period selection (MTD, QTD, YTD) | [Period Combobox](#uwc-period-combobox) |
| Display regulatory compliance flags | [Compact Flagset](#uwc-compact-flagset) |
| Drag-and-drop file upload | [File Drag-Drop Area](#uwc-file-dragdrop-area) |
| AI conversational interface | [Chatbot](#uwc-chatbot) |
| Financial data visualization | [Chart](data-display.md#uwc-chart) |
| Customizable analytics dashboard | [Dashboard](data-display.md#uwc-dashboard) |

## Best Practices

### Financial Services Domain
- Use hierarchy components for organizational structures
- Period combobox for standard financial reporting periods
- Compact flagset for compliance indicators
- Chart component for financial visualizations

### Enterprise Integration
- Consider API integration for hierarchies (lazy loading)
- Use chatbot for conversational AI experiences
- Dashboard for executive views and KPI monitoring
- File drag-drop for document management

### Performance
- Lazy load large hierarchies
- Virtual scrolling for deep hierarchies
- Server-side pagination for reports
- Optimize chatbot response streaming

### Accessibility
- All specialized components follow WCAG 2.2 AA
- Keyboard navigation supported
- Screen reader compatibility
- Clear visual focus indicators
- Appropriate ARIA attributes

### Licensing
- **Chart**: Requires HighCharts license for commercial use
- **Chatbot**: Contact Temenos UUX team for usage
- Check with Temenos before deploying these components
