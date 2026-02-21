# Spec Design Guidelines

> Extracted from Anthropic's frontend-design skill. Used by temn-spec-render only.
> Source: https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design

---

## Avoid "AI Slop"

❌ **Don't use:**
- Excessive centered layouts
- Purple gradients
- Uniform rounded corners everywhere
- Inter font (or generic system fonts)
- Clichéd color schemes
- Predictable layouts

---

## Typography

✅ **Do:**
- Choose distinctive, characterful fonts
- High-contrast font pairings (weight 100-200 or 800-900)
- Pair display font with refined body font

**For spec viewer:**
```css
/* Example */
--font-display: 'Instrument Sans', sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
```

---

## Color & Theme

✅ **Do:**
- Commit to cohesive aesthetic
- Use CSS variables for consistency
- Dominant color with sharp accents (not evenly distributed)

**For spec viewer (professional/document style):**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
  --muted: 210 40% 96%;
  --border: 214.3 31.8% 91.4%;
}
```

---

## Layout

✅ **Do:**
- Generous negative space
- Clear visual hierarchy
- Intentional alignment (not everything centered)
- Responsive design

**For spec viewer:**
- Max width container (~900px)
- Clear section separation
- Tabbed navigation for sections
- Sticky header with metadata

---

## Components (shadcn/ui)

**Required for spec viewer:**
- `Tabs` - Section navigation
- `Card` - Content containers
- `Badge` - Status indicators
- `Table` - Requirements tables
- `ScrollArea` - Long content
- `Separator` - Visual breaks

---

## Spec-Specific Guidelines

### Header
- Feature name prominent (text-4xl)
- Badges for version, status, quality score
- Clean, not cluttered

### Content Sections
- Use cards for each section
- Clear headings
- Tables for structured data (requirements, NFRs)
- Code blocks for technical content

### Diagrams
- Full width within container
- Subtle background (muted)
- Rounded corners (but not excessive)

### Images
- Max width 100%
- Subtle border or shadow
- Caption if needed

### Print Styles
- Hide navigation
- Single column
- Page breaks between sections
