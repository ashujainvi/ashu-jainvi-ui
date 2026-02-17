# Style Guide

This document outlines the design principles, patterns, and conventions used in this project.

## Table of Contents

1. [Design Methodology](#design-methodology)
2. [Folder Structure](#folder-structure)
3. [Styling Approach](#styling-approach)
4. [Typography System](#typography-system)
5. [Color System](#color-system)
6. [Component Guidelines](#component-guidelines)

---

## Design Methodology

This project follows **[Atomic Design](https://atomicdesign.bradfrost.com/)** principles by Brad Frost. Components are organized hierarchically from smallest to largest:

### Atoms
The foundational building blocks that cannot be broken down further without losing meaning.
- **Examples:** Pill, buttons, inputs, labels
- **Location:** `src/atoms/`
- **Purpose:** Reusable, single-purpose UI elements

### Molecules
Simple combinations of atoms that work together as a unit.
- **Examples:** Card, search form
- **Location:** `src/molecules/`
- **Purpose:** Small functional components following single responsibility principle

### Organisms
Complex UI components composed of molecules, atoms, or other organisms that form distinct interface sections.
- **Examples:** FeatureCard, Nav, Footer
- **Location:** `src/organisms/`
- **Purpose:** Standalone, context-aware sections of the interface

### Templates
Page-level layouts that place organisms into a structure and define content hierarchy.
- **Location:** Layout components in `src/styles/modules/`
- **Purpose:** Define the skeleton and content structure

### Pages
Specific instances of templates with real representative content.
- **Location:** `src/pages/`
- **Purpose:** Final user-facing interfaces with actual content

---

## Folder Structure

```
src/
  atoms/                  # Smallest UI elements
    Pill/
  molecules/              # Simple combinations of atoms
    Card/
  organisms/              # Complex, distinct UI sections
    FeatureCard/
    Nav/
    Footer/
  pages/                  # Complete pages with real content
    Home/
  styles/                 # Global styles and design tokens
    typography.css        # Typography system with @layer
    modules/              # Reusable layout patterns
      container.module.css
  assets/                 # Images, icons, fonts
```

---

## Styling Approach

### CSS-First, Tailwind-Powered

We use **Tailwind CSS v4** with a CSS-first approach:

1. **Design tokens defined in `@theme`** (in `src/index.css`)
2. **Component styles use `@apply`** to apply Tailwind utilities
3. **Minimal inline Tailwind utilities in JSX** - only for one-off spacing or layout
4. **CSS Modules for component-specific styles**

### Key Principles

#### ✅ DO: Use `@apply` in CSS
```css
@layer components {
  .title2 {
    font-size: 3.5rem;
    @apply text-primary-darker text-center;
  }
}
```

#### ✅ DO: Define design tokens in `@theme`
```css
@theme {
  --color-primary: var(--color-red);
  --color-primary-darker: var(--color-red-darker);
}
```

#### ❌ DON'T: Scatter utility classes throughout JSX
```tsx
// Bad - color/typography utilities in JSX
<h2 className="title2 text-primary-darker text-center">

// Good - absorbed into CSS
<h2 className="title2">
```

#### ❌ DON'T: Use conflicting Tailwind utility names
```css
/* Bad - conflicts with Tailwind's built-in 'overline' utility */
.overline { ... }

/* Good - unique name */
.text-overline { ... }
```

### CSS Architecture

- **Global styles:** `src/index.css`
- **Typography:** `src/styles/typography.css` (uses `@layer components`)
- **Component styles:** CSS Modules (`*.module.css`)
- **Reference theme tokens:** Use `@reference "../../index.css"` in CSS modules

---

## Typography System

Typography classes are defined in `src/styles/typography.css` using `@layer components`.

### Heading Classes

| Class | Size (Mobile → Tablet → Desktop) | Default Color |
|-------|----------------------------------|---------------|
| `.display` | text-5xl → text-7xl → text-9xl | `text-primary` |
| `.title1` | text-3xl → text-5xl → text-7xl | `text-primary-darker` |
| `.title2` | text-xl → text-3xl → text-5xl | `text-primary-darker` |
| `.title3` | text-base → text-xl → text-3xl | `text-primary` |
| `.title4` | text-base → text-lg → text-xl | `text-primary` |

### Text Classes

| Class | Purpose | Default Color |
|-------|---------|---------------|
| `.caption` | Body text, descriptions | `text-secondary-light` |
| `.text-overline` | Section labels (uppercase) | `text-secondary text-center` |

### Color Overrides

When a heading needs a different color, use Tailwind utilities (they override `@layer components`):

```tsx
<h3 className="title2 text-primary">My craft</h3>
```

### Usage

```tsx
// ✅ Good - semantic class names
<h1 className="display">Ashu Jainvi</h1>
<h2 className="title2">Visual Artist</h2>
<p className="caption">Description text here</p>

// ❌ Bad - mixing style concerns
<h2 className="text-3xl font-bold text-red-500">
```

---

## Color System

Colors are defined in two places for Tailwind integration:

### 1. CSS Custom Properties (`:root` in `index.css`)

```css
:root {
  /* Base colors */
  --color-red: #e31329;
  --color-red-dark: #a10515;
  --color-red-darker: #3B050B;
  --color-yellow: #f5c58c;
  --color-yellow-light: #FFE4C4;
  
  --color-primary: var(--color-red);
  --color-primary-dark: var(--color-red-dark);
  --color-primary-darker: var(--color-red-darker);
  --color-secondary: var(--color-yellow);
  --color-secondary-light: var(--color-yellow-light);
  
  /* UI colors */
  --color-bg-primary: var(--color-gray-1);
  --color-bg-secondary: var(--color-gray-2);
  --color-text-primary: var(--color-gray-4);
  --color-border-primary: var(--color-gray-3);
}
```

### 2. Tailwind Theme Tokens (`@theme` in `index.css`)

```css
@theme {
  --color-primary: var(--color-primary);
  --color-primary-dark: var(--color-red-dark);
  --color-primary-darker: var(--color-red-darker);
  --color-secondary: var(--color-secondary);
  --color-secondary-light: var(--color-yellow-light);
}
```

This enables:
- **CSS usage:** `var(--color-primary)`
- **Tailwind utilities:** `text-primary`, `bg-primary`, etc.
- **Single source of truth:** Change colors in one place

### Color Usage

```tsx
// ✅ Good - Tailwind utility or typography class
<span className="text-primary">Red text</span>
<h2 className="title2">Uses text-primary-darker by default</h2>

// ✅ Good - CSS variable in module
.card {
  background-color: var(--color-bg-primary);
}

// ❌ Bad - hardcoded color
<div style={{ color: '#e31329' }}>
```

---

## Component Guidelines

### Creating New Components

#### 1. Determine Atomic Level

Ask: "Can this be broken down further without losing functionality?"
- **Yes** → It's an organism or molecule
- **No** → It's an atom

#### 2. Component Structure

```
src/[atoms|molecules|organisms]/ComponentName/
  ComponentName.tsx           # Component logic
  ComponentName.module.css    # Scoped styles (if needed)
  ComponentName.stories.tsx   # Storybook stories
```

#### 3. Styling Strategy

**Choose based on complexity:**

- **Simple atoms:** May not need CSS module, use typography classes
- **Molecules/organisms:** Use CSS modules with `@apply`
- **One-off spacing:** Inline Tailwind utilities (e.g., `mt-4`, `gap-6`)



### Component Composition

**Build from smaller parts:**

```tsx
// ✅ Good - composing from smaller components
<FeatureCard>  {/* organism */}
  <Card>       {/* molecule */}
    <Pill />   {/* atom */}
  </Card>
</FeatureCard>

// ❌ Bad - monolithic component
<BigFeatureCardWithEverythingInside />
```

### Props and Variants

Use TypeScript interfaces and controlled variants:

```tsx
interface CardProps {
  children: ReactNode;
  shape?: 'ellipse' | 'rectangle';  // ✅ Specific variants
}

// ❌ Avoid: variant?: string (too loose)
```

---

## Design Tokens Reference

### Spacing Scale

Use Tailwind's default spacing (`mt-4`, `gap-6`, `p-12`) or define custom in `@theme`.

### Breakpoints

Tailwind defaults:
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Border Radius

```css
@theme {
  --radius-5xl: 3.5rem;
}
```

Usage: `rounded-5xl` or `@apply rounded-5xl`

---

## Summary

### Core Principles

1. **Follow Atomic Design** - organize components by complexity
2. **CSS-first with Tailwind** - use `@apply` in CSS, not JSX
3. **Centralize design tokens** - define in `@theme` and `:root`
4. **Typography classes** - use semantic names, responsive by default
5. **Single responsibility** - each component does one thing well

### When to Update This Guide

- Adding new atomic components
- Introducing new design patterns
- Changing color/typography systems
- Establishing new conventions

---

**Last Updated:** February 16, 2026
