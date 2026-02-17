# Ashu Jainvi Portfolio UI

A React + TypeScript + Vite portfolio project with Tailwind CSS.

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Component Generation

This project uses `generate-react-cli` to quickly scaffold new components and pages with consistent structure.

### Generate a Component

To create a new component in the `src/components` directory:

```bash
npm run gc <component-name>
```

This will generate the following files in `component` folder:
- `ComponentName.tsx` - Main component file
- `ComponentName.module.css` - CSS module for styling
- `ComponentName.stories.tsx` - Storybook stories file

### Generate a Page

To create a new page in the `src/pages` directory:

```bash
npm run gp <page-name>
```

This will generate the following files in `pages` folder:
- `PageName.tsx` - Main page component
- `PageName.lazy.tsx` - Lazy-loaded version for code splitting
- `PageName.module.css` - CSS module for styling

Both commands will create a dedicated folder for the component/page with all necessary files following the project's structure conventions.
