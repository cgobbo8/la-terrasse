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

## Icons — Lucide via astro-icon

- Use **Lucide** icons everywhere — no inline SVG for standard icons
- In `.astro` files: `import { Icon } from 'astro-icon/components'` → `<Icon name="lucide:icon-name" class="w-4 h-4" />`
- In `.svelte` files: `import { Phone, ArrowRight } from 'lucide-svelte'` → `<Phone class="w-4 h-4" />`
- Browse available icons at [lucide.dev/icons](https://lucide.dev/icons)
- Brand logos (LogoTerrasse, LogoTerrasseFull, LogoMaskReveal) stay as custom inline SVGs
- Pass `stroke-width="1.5"` when a thinner stroke is needed (default is 2)

## Svelte Islands in Astro

- Cannot pass functions as props to `client:*` islands (not serializable) — pass data objects instead
- `position: fixed` inside a parent with `backdrop-filter` (e.g. `backdrop-blur-sm`) won't work relative to viewport — use a DOM portal (`document.body.appendChild`) to escape
