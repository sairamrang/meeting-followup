# Design Direction: Meeting Follow-Up System

## Aesthetic Vision: Editorial Confidence

**Core Concept**: Professional storytelling meets modern SaaS. Each follow-up is a narrative, not just a document.

## Design Principles

### 1. Typography as Voice
- **Display**: DM Serif Display (elegant, editorial)
- **Headlines**: Inter Tight (modern, condensed)
- **Body**: Inter (readable, professional)
- **Dramatic scale**: 72px headers → 16px body (4.5x ratio)
- **Weight variation**: 300 → 700 for hierarchy

### 2. Color System: Deep Trust
```css
--primary-900: #0A2463 (Deep navy - authority)
--primary-600: #3E5CB8 (Bright blue - action)
--accent: #FF6B6B (Coral - attention)
--success: #10B981 (Emerald - completion)
--surface: #F8FAFC (Cool white)
--depth: rgba(10, 36, 99, 0.03) (Subtle shadows)
```

### 3. Motion Language
- **Page loads**: Staggered reveals (0.1s delays)
- **Cards**: Lift on hover (translateY + shadow)
- **CTAs**: Subtle scale + glow
- **Transitions**: 300ms ease-out (snappy but smooth)

### 4. Spatial Composition
- **Generous spacing**: 64px vertical rhythm
- **Card depth**: Layered shadows + borders
- **Asymmetric layouts**: Breaking grid intentionally
- **Focal points**: Diagonal flows, scale contrast

### 5. Visual Details
- Gradient meshes on headers
- Subtle noise texture on backgrounds
- Border radius: 12px (modern, not rounded)
- Shadows: Multi-layer (depth, not drop)
- Status indicators: Animated badges

## Key Screens

### Public Viewer (Customer-Facing)
**Goal**: Wow the recipient, make following up feel premium
- Hero section with gradient mesh background
- Large, editorial typography
- Timeline-style next steps with progress indicators
- Floating action button for print
- Smooth scroll animations

### Follow-ups List (Internal)
**Goal**: Make management feel effortless
- Masonry-style cards (Pinterest layout)
- Hover reveals: Quick actions overlay
- Status badges with pulse animation
- Empty states with illustration

### Editor (Creation)
**Goal**: Writing should feel inspiring
- Full-width editor with focus mode
- Floating toolbar that follows scroll
- Real-time preview
- Publishing feels like a launch

## Implementation Notes
- CSS Grid + Flexbox for layouts
- CSS custom properties for theming
- Framer Motion for React animations (when needed)
- Tailwind + custom utilities
- Mobile-first, but desktop-optimized

## Differentiation
What makes this unforgettable:
1. **Dramatic typography** - Not just bigger, but intentionally scaled
2. **Depth through layering** - Cards that float
3. **Motion that tells a story** - Reveals follow reading flow
4. **Professional but warm** - Navy + coral balance
5. **Editorial layout** - Not SaaS-cookie-cutter

**Anti-patterns to avoid**:
- ❌ Generic purple gradients
- ❌ Overly rounded corners (30px+)
- ❌ System fonts (Inter alone)
- ❌ Flat, no-depth designs
- ❌ Predictable grid layouts
