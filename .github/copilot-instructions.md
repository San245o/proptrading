# Copilot Instructions for Proptrading Platform

## Project Architecture
- **Framework**: Next.js 14+ (App Router). Use Server Components by default; add `"use client"` only when interactivity (hooks) is needed.
- **Styling**: Tailwind CSS with custom glassmorphism theme.
  - Dark mode default (`color-scheme: dark` in `globals.css`).
  - Colors: Use specific hex codes `#101114` (bg), `#1a1d24` (cards) rather than generic gray-900 to match the "ink" theme.
  - Effects: `backdrop-blur`, `bg-white/5` for glass effect.
- **Icons**: Use generic SVGs in `components/dashboard/icons.tsx`. Do not install external icon libraries (e.g. lucide-react) unless requested.
- **Directory Structure**:
  - `app/dashboard/**`: Dashboard-specific pages and layouts.
  - `components/dashboard/**`: Dashboard-specific UI components (Sidebar, widgets).
  - `components/ui/**`: Shared UI components (Charts, Cards).
  - `app/data/**`: Static data and configuration.

## Developer Workflows
- **New Pages**: Create in `app/` directory. If it's part of the dashboard, put in `app/dashboard/`.
- **Navigation**: Use `next/link`.
- **Images**: Use Unsplash placeholders for prototypes.
- **Mock Data**: Define interfaces and mock data constants within the file or in `app/data/` for lists.

## specific Conventions
- **Sidebar**: Fixed width (w-20), icon-only with hovering tooltips. Mobile: Hamburger menu with overlay.
- **Dashboard Widgets**: Use `Card` component for consistency.
- **Typography**: Inter font. Use `text-gray-400` for labels, `text-white` for values.
- **Charts**: Use CSS-based visualizations (width relative percentages) or `recharts` if installed (currently using CSS-based in `AccountsPage`).

## Key Files
- `app/globals.css`: Global styles, CSS variables, and background gradients.
- `app/dashboard/layout.tsx`: Main dashboard layout with Sidebar.
- `components/dashboard/Sidebar.tsx`: Navigation logic.
- `app/data/steps.ts`: Configuration for landing page steps.

## coding Guidelines
- Prefer functional components with strict TypeScript types.
- For lists of data, use `.map()` on a constant array.
- Use `animate-fade-in` utility for page transitions (if defined) or standard CSS transitions.
- Ensure all interactive elements (buttons, inputs) have `:hover` and `:focus` states consistent with the theme (e.g., `hover:bg-white/10`).
