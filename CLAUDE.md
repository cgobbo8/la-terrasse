# Project Rules — La Terrasse Saint-Ferréol

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `chore`, `refactor`, `style`, `docs`, `test`, `perf`, `ci`

Scopes: `menu`, `header`, `homepage`, `restaurant`, `aventure`, `evenements`, `i18n`, `cms`, `layout`, `a11y`, `deps`, etc.

Examples:
- `feat(menu): add multi-column mega menu with featured cards`
- `fix(mobile): portal slide-out panel to body to escape backdrop-blur`
- `chore(deps): update astro to 5.19`

Keep messages short, in English, lowercase after the colon.

## Tailwind CSS v4

- Uses `@tailwindcss/vite` plugin (NOT `@astrojs/tailwind` which requires v3)
- Config via `@theme` directive in `src/styles/global.css` (no `tailwind.config.js`)
- `.svelte` files require `@source "../components/**/*.svelte"` in global.css to be scanned
- Avoid dynamic Tailwind classes in string interpolation (`{cond ? 'class-a' : 'class-b'}`) — use `class:name={cond}` directive or inline `style` for dynamic values
- For colors that vary per pole, use inline `style` attributes with the color hex values

## Svelte Islands in Astro

- Cannot pass functions as props to `client:*` islands (not serializable) — pass data objects instead
- `position: fixed` inside a parent with `backdrop-filter` (e.g. `backdrop-blur-sm`) won't work relative to viewport — use a DOM portal (`document.body.appendChild`) to escape
