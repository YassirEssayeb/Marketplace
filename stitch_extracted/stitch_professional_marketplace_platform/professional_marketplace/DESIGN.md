---
name: Professional Marketplace
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 48px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is anchored in trust, efficiency, and premium clarity. It is designed for a high-end marketplace where professional buyers and sellers interact. The aesthetic follows a **Corporate Modern** approach—balancing the structural reliability of enterprise software with the fluid, accessible feel of modern consumer tech.

The visual language prioritizes "information breathing room," utilizing generous white space to reduce cognitive load. The emotional response is one of confidence and stability, achieved through a disciplined color application and high-precision alignment.

## Colors

The palette is built on a foundation of "High-Contrast Professionalism."

- **Deep Navy (#0F172A):** Used for primary navigation, headings, and heavy structural elements to establish authority.
- **Electric Blue (#2563EB):** Reserved exclusively for high-impact calls to action (CTAs), focus states, and progress indicators. It serves as the "active" energy of the interface.
- **Crisp White (#FFFFFF) & Slate Greys:** The background is pure white to maximize the "clean" aesthetic. We utilize a range of slate grays (from #F8FAFC for surface fills to #475569 for secondary text) to create a soft, legible hierarchy that avoids the harshness of pure black text.

## Typography

This design system utilizes **Inter** for all roles to maintain a systematic and utilitarian feel. The hierarchy relies on weight and letter spacing rather than font variety. 

For display and headline roles, we use tighter letter spacing and semi-bold/bold weights to create a "locked-in" professional look. For body text, a standard 1.5–1.6 line height ensures long-form legibility during product research. Labels and small metadata should use medium weights to ensure they don't disappear against the white background.

## Layout & Spacing

The design system follows a **Fixed Grid** model for desktop, centered within a 1280px container. This provides a sense of containment and order. 

- **Grid:** A 12-column system is used for desktop, collapsing to 4 columns on mobile. 
- **Spacing Scale:** Based on a 4px baseline. Most common layouts should use increments of 16px (4 units) or 24px (6 units) to maintain a rhythmic vertical flow.
- **Whitespace:** Emphasize "Vertical Rhythm" by ensuring section headers have at least 64px of top margin to clearly separate marketplace categories or sections.

## Elevation & Depth

To achieve a "premium" feel, we avoid heavy drop shadows in favor of **Ambient Depth** and **Subtle Outlines**.

- **Shadows:** Use multi-layered, low-opacity shadows. For example, a "Level 1" shadow should be a light gray blur (e.g., `0px 2px 4px rgba(15, 23, 42, 0.05)`). This feels integrated into the surface rather than floating above it.
- **Borders:** Use 1px solid borders in Slate-200 (#E2E8F0) for cards and input fields. This provides structure without the visual noise of dark lines.
- **Tonal Layers:** Use a very light gray (#F8FAFC) for background sections to distinguish them from the main #FFFFFF content cards.

## Shapes

The design system utilizes **Soft** roundedness (0.25rem / 4px base). This choice reflects a professional and precise character, avoiding the overly "playful" nature of pill-shaped elements while remaining more approachable than sharp 90-degree corners.

- **Standard Elements:** 4px radius (Buttons, Input fields).
- **Large Elements:** 8px radius (Cards, Modals).
- **Avatars:** Fully circular (100%) to provide a humanizing contrast to the geometric layout.

## Components

### Buttons
- **Primary:** Deep Navy background with White text. Bold, precise.
- **Action/CTA:** Electric Blue background. Used for "Buy Now" or "Post Listing."
- **Secondary:** White background with a 1px Slate-200 border and Navy text.

### Cards
Cards are the primary container for marketplace items. They should feature a 1px #E2E8F0 border, no shadow in their default state, and a subtle "Level 1" shadow on hover to indicate interactivity.

### Input Fields
Inputs should be clean with a 1px Slate-200 border. On focus, the border transitions to Electric Blue with a subtle blue glow (2px spread, 15% opacity).

### Chips & Badges
Used for categories and status. Chips should use a light gray background (#F1F5F9) with Slate-700 text. Status badges (e.g., "Verified") can use a light tint of the status color with a 1px border.

### Search Bar
The central marketplace search bar should be prominent, utilizing a larger height (56px) and a subtle shadow to draw the user's focus immediately upon landing.