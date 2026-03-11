# Story 9.1: Keystatic Content Schema & Collections

Status: ready-for-dev

## Story

As the site operator,
I want a complete CMS schema in Keystatic that covers all content types,
so that I can manage activities, seminars, events, restaurant info, venue details, and site settings autonomously without developer intervention.

## Acceptance Criteria

1. Keystatic admin (`/keystatic`) displays all collections: activities, seminars, events
2. Keystatic admin displays all singletons: restaurant, venue, settings
3. Each content type includes i18n fields: `title_en`, `title_es`, `description_en`, `description_es` (in addition to the FR default fields)
4. **Activities collection** has fields: title (text), slug (slug), description (text/multiline), price (number), age_min (number), duration (text), group_size (text), images (array of images), MDX body (document field)
5. **Seminars collection** has fields: title (text), slug (slug), description (text/multiline), inclusions (array of text items), price (text), images (array of images), MDX body (document field)
6. **Events collection** has fields: title (text), date (date), description (text/multiline), images (optional array of images)
7. **Restaurant singleton** has fields: menu sections (array of objects with section name + dishes array), producer entries (array with name, description, image), general info text (document field)
8. **Venue singleton** has fields: capacity_seated (number), capacity_standing (number), equipment (array of text items), description (document field), images (array of images)
9. **Settings singleton** has fields: opening_hours (structured or text), seasonal_message (text), googleMapsUrl (url/text), phone (text), email (text), address (text/multiline)
10. Sample content files exist in `src/content/` for at least 2-3 activities, 3 seminars, and 1 event
11. Content is queryable via the `astro:content` API in page components

## Tasks / Subtasks

- [ ] Update `keystatic.config.ts` — Activities collection (AC: #1, #3, #4)
  - [ ] Define collection with `path: 'src/content/activities/*'` and `slugField: 'title'`
  - [ ] Add fields: `title` (text, required), `description` (text, multiline), `price` (number), `age_min` (number), `duration` (text), `group_size` (text)
  - [ ] Add i18n fields: `title_en` (text), `title_es` (text), `description_en` (text, multiline), `description_es` (text, multiline)
  - [ ] Add `images` field (array of image fields with `directory: 'src/assets/activities'`)
  - [ ] Add `body` field using `fields.markdoc()` or `fields.document()` for rich MDX content
  - [ ] Set appropriate labels and descriptions for each field so the operator understands their purpose

- [ ] Update `keystatic.config.ts` — Seminars collection (AC: #1, #3, #5)
  - [ ] Define collection with `path: 'src/content/seminars/*'` and `slugField: 'title'`
  - [ ] Add fields: `title` (text, required), `description` (text, multiline), `price` (text — "from 59 EUR/pers"), `inclusions` (array of child text fields)
  - [ ] Add i18n fields: `title_en`, `title_es`, `description_en`, `description_es`
  - [ ] Add `images` field (array of images)
  - [ ] Add `body` field for rich content

- [ ] Update `keystatic.config.ts` — Events collection (AC: #1, #3, #6)
  - [ ] Define collection with `path: 'src/content/events/*'` and `slugField: 'title'`
  - [ ] Add fields: `title` (text, required), `date` (date field), `description` (text, multiline)
  - [ ] Add i18n fields: `title_en`, `title_es`, `description_en`, `description_es`
  - [ ] Add optional `images` field (array of images)

- [ ] Update `keystatic.config.ts` — Restaurant singleton (AC: #2, #3, #7)
  - [ ] Define singleton with `path: 'src/content/restaurant/'`
  - [ ] Add `menu_sections` field: array of objects, each with `section_name` (text), `section_name_en` (text), `section_name_es` (text), and `dishes` array
  - [ ] Each dish object: `name` (text), `name_en` (text), `name_es` (text), `description` (text), `description_en` (text), `description_es` (text), `price` (number)
  - [ ] Add `producers` field: array of objects with `name` (text), `description` (text), `description_en` (text), `description_es` (text), `image` (image)
  - [ ] Add `body` document field for general restaurant info/story

- [ ] Update `keystatic.config.ts` — Venue singleton (AC: #2, #3, #8)
  - [ ] Define singleton with `path: 'src/content/venue/'`
  - [ ] Add fields: `capacity_seated` (number), `capacity_standing` (number)
  - [ ] Add `equipment` field: array of text items (projector, sound system, etc.)
  - [ ] Add i18n fields for descriptions: `description_en`, `description_es`
  - [ ] Add `images` field (array of images)
  - [ ] Add `body` document field for detailed venue description

- [ ] Update `keystatic.config.ts` — Settings singleton (AC: #2, #9)
  - [ ] Define singleton with `path: 'src/content/settings/'`
  - [ ] Add fields: `phone` (text), `email` (text), `address` (text, multiline)
  - [ ] Add `opening_hours` field: array of objects with `day` (text) and `hours` (text) — or a single multiline text field for flexibility
  - [ ] Add `seasonal_message` (text) and `seasonal_message_en` (text), `seasonal_message_es` (text)
  - [ ] Add `googleMapsUrl` (url or text field)
  - [ ] Add `site_name` (text), `site_description` (text, multiline) for SEO defaults

- [ ] Create Astro content collection config (AC: #11)
  - [ ] Update `src/content/config.ts` (or `src/content.config.ts` for Astro 5) to define Zod schemas matching Keystatic fields
  - [ ] Define schemas for: activities, seminars, events collections
  - [ ] Define schemas for: restaurant, venue, settings singletons (if using content collections for singletons)
  - [ ] Ensure types are generated correctly with `astro sync`

- [ ] Create sample content files (AC: #10)
  - [ ] Create 2-3 activity entries in `src/content/activities/` (e.g., pedal-boats, tree-climbing, mini-golf)
  - [ ] Create 3 seminar entries in `src/content/seminars/` (e.g., journee-nature, team-building, seminaire-premium)
  - [ ] Create 1 event entry in `src/content/events/` (e.g., fete-du-lac-2026)
  - [ ] Populate restaurant singleton with sample menu sections and a few dishes
  - [ ] Populate settings singleton with placeholder contact info and hours
  - [ ] Include at least FR text in all entries; add EN/ES for 1-2 entries to test i18n

- [ ] Verify Keystatic admin renders correctly (AC: #1, #2)
  - [ ] Run `pnpm dev` and navigate to `/keystatic`
  - [ ] Confirm all 3 collections are listed and navigable
  - [ ] Confirm all 3 singletons are listed and editable
  - [ ] Create/edit a test entry to verify all field types work (text, number, date, array, document, image)
  - [ ] Verify saved content appears as files in `src/content/`

## Dev Notes

### Project Structure Notes

- Keystatic config: `keystatic.config.ts` (project root)
- Content directory: `src/content/` — all CMS-managed content stored as files here
- Content config: `src/content/config.ts` or `src/content.config.ts` (Astro 5 uses the latter)
- Asset images: `src/assets/` subdirectories per content type (activities, seminars, etc.)

### Keystatic Schema Patterns

**Collection definition:**
```typescript
activities: collection({
  label: 'Activities',
  slugField: 'title',
  path: 'src/content/activities/*',
  format: { contentField: 'body' },
  schema: {
    title: fields.slug({ name: { label: 'Title (FR)' } }),
    title_en: fields.text({ label: 'Title (EN)' }),
    title_es: fields.text({ label: 'Title (ES)' }),
    description: fields.text({ label: 'Description (FR)', multiline: true }),
    description_en: fields.text({ label: 'Description (EN)', multiline: true }),
    description_es: fields.text({ label: 'Description (ES)', multiline: true }),
    price: fields.number({ label: 'Price (EUR)' }),
    age_min: fields.number({ label: 'Minimum age' }),
    duration: fields.text({ label: 'Duration (e.g. "1h30")' }),
    group_size: fields.text({ label: 'Group size (e.g. "2-8 persons")' }),
    images: fields.array(
      fields.image({ label: 'Image', directory: 'src/assets/activities', publicPath: '/src/assets/activities/' }),
      { label: 'Images', itemLabel: (props) => props.value?.filename || 'Image' }
    ),
    body: fields.markdoc({ label: 'Content' }),
  },
})
```

**Singleton definition:**
```typescript
settings: singleton({
  label: 'Site Settings',
  path: 'src/content/settings/',
  schema: {
    phone: fields.text({ label: 'Phone number' }),
    email: fields.text({ label: 'Email address' }),
    // ...
  },
})
```

### Important Notes

- **Keystatic storage mode:** Currently `local` mode. This story keeps it in local mode — Story 9.2 handles the migration to `github` mode
- **Content format:** Collections with a `body` field use `format: { contentField: 'body' }` which stores content as MDX/Markdoc files with YAML frontmatter
- **Image handling:** Keystatic stores images in the specified `directory` and references them by path. Astro's image optimization can process images from `src/assets/`
- **Nested arrays:** For the restaurant menu (sections → dishes), use `fields.array()` with `fields.object()` children. Keystatic supports nested array/object structures
- **Field labels matter:** The operator (Corentin's brother) will use the Keystatic admin daily. Labels should be clear, in English or French, with helpful descriptions where the field purpose isn't obvious

### Relationship to Other Stories

- **Enables Story 7.1:** Settings singleton provides contact info and googleMapsUrl for the contact page
- **Enables Story 8.2:** i18n fields on all content types allow `getLocalizedField()` to work
- **Prerequisite for Story 9.2:** Schema must be complete before migrating to GitHub storage mode

### References

- Keystatic docs: https://keystatic.com/docs
- Keystatic fields API: https://keystatic.com/docs/fields
- Astro content collections: https://docs.astro.build/en/guides/content-collections/
- Existing `keystatic.config.ts` for current schema baseline

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
