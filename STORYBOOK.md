# Storybook Guidelines

This document covers how to run Storybook and write stories for **atoms** and **molecules** in this project. For component design principles, see [STYLE_GUIDE.md](STYLE_GUIDE.md).

## Running Storybook

```bash
# Development (localhost:6006)
npm run storybook

# Static build (outputs to storybook-static/)
npm run build-storybook
```

---

## Story File Convention

Every atom and molecule must have a co-located story file:

```
src/atoms/Button/
  Button.tsx
  Button.module.css
  Button.stories.tsx    ← story file
```

- **Filename:** `ComponentName.stories.tsx`
- **Location:** Same directory as the component
- **Auto-generated:** `generate-react-cli` creates story files automatically when you run `npm run gc`

---

## Story Format (CSF3)

All stories use **Component Story Format 3** with TypeScript. Here's the standard template:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import MyComponent from './MyComponent';

const meta: Meta<typeof MyComponent> = {
  title: 'Atoms/MyComponent', // or 'Molecules/MyComponent'
  component: MyComponent,
  tags: ['autodocs'], // generates a Docs page automatically
  argTypes: {
    // define controls for each prop
  },
};

export default meta;
type Story = StoryObj<typeof MyComponent>;

export const Default: Story = {
  args: {
    // default prop values
  },
};
```

### Key rules

- **Always export `meta` as default** — Storybook needs this to register the story.
- **Always include `tags: ['autodocs']`** — generates documentation automatically.
- **Use `StoryObj<typeof Component>`** — provides type-safe args matching the component's props.
- **Name stories as PascalCase exports** — `Primary`, `Secondary`, `NoBorder`, etc.

---

## Title Hierarchy

Use atomic design levels as folder prefixes in the `title` field:

| Level    | Title format                | Example            |
| -------- | --------------------------- | ------------------ |
| Atom     | `'Atoms/ComponentName'`     | `'Atoms/Button'`   |
| Molecule | `'Molecules/ComponentName'` | `'Molecules/Card'` |

This groups components in Storybook's sidebar by their atomic design level.

---

## Writing argTypes

Map each component prop to a control so users can interact with the story in the Storybook UI:

| Prop type                                 | Control              | Example                                        |
| ----------------------------------------- | -------------------- | ---------------------------------------------- |
| Union / enum (`'primary' \| 'secondary'`) | `control: 'select'`  | `options: ['primary', 'secondary']`            |
| `boolean`                                 | `control: 'boolean'` | `showBorder` toggle                            |
| `string`                                  | `control: 'text'`    | `children` text input                          |
| `ReactNode` (complex)                     | `control: 'text'`    | Renders as a string — fine for simple children |

```tsx
argTypes: {
  variant: {
    control: 'select',
    options: ['primary', 'secondary'],
    description: 'Visual style variant',
  },
  disabled: {
    control: 'boolean',
    description: 'Disabled state',
  },
  children: {
    control: 'text',
    description: 'Button label',
  },
},
```

---

## Writing Multiple Stories

Create one story per meaningful state. At minimum, include a `Default` story. Add more for each variant, edge case, or interactive state:

```tsx
export const Primary: Story = {
  args: {
    children: 'Get in touch',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'View Portfolio',
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    disabled: true,
  },
};
```

### Naming conventions

- **`Primary` / `Secondary`** — for variant-based components
- **`NoBorder`** — for toggling a boolean prop off
- **`AsLink`** — for polymorphic rendering modes
- **`WithImage` / `WithContent`** — for optional slot content

---

## Decorators

Decorators wrap every story with shared context. The global `MemoryRouter` decorator is already configured in `.storybook/preview.ts` — any component using `react-router-dom` (like `Button` with `as="link"`) works out of the box.

If a story needs a custom wrapper, add a decorator at the story level:

```tsx
export const InContainer: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 400 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    children: 'Constrained width',
  },
};
```

---

## Reference Examples

### Atom: Button (`src/atoms/Button/Button.stories.tsx`)

Full CSF3 with `select`, `text`, `boolean` controls, 5 stories covering both variants, disabled states, and link rendering.

### Atom: Pill (`src/atoms/Pill/Pill.stories.tsx`)

CSF3 with `select` and `boolean` controls for `variant` and `showBorder`, 3 stories.

### Molecule: Card (`src/molecules/Card/Card.stories.tsx`)

Minimal CSF3 for a wrapper component with `children` prop.

---

## Checklist for New Stories

When adding a story for an atom or molecule:

1. Create `ComponentName.stories.tsx` next to the component (or use `npm run gc`)
2. Set `title` to `'Atoms/Name'` or `'Molecules/Name'`
3. Add `tags: ['autodocs']`
4. Define `argTypes` for every user-facing prop
5. Write a `Default` story, then add one story per variant or notable state
6. Run `npm run storybook` and verify the component renders with working controls
