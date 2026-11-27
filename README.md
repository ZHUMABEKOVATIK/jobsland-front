# Jobsland — Telegram Mini App

A mobile-first web app for the Jobsland Telegram bot. People use it to post job, internship, one-time-task and grant ads to Jobsland channels, and then track the moderation status of each ad.

**Stack:** Vite, React 19 and TypeScript, Chakra UI v3, React Router, react-icons (Lucide set), Motion for animation, i18next. The UI is available in 9 languages.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
```

## Routes

| Route | Page | Navbar |
|---|---|---|
| `/home` | Dashboard: greeting, 4 post types, country of posting, anti-scam note | visible |
| `/home/job`, `/home/internship`, `/home/one_time_task`, `/home/opportunities_grants` | Post form for that type | hidden |
| `/my-posts` | Search, segment filter (All / In Review / Approved / Rejected), cards, pagination | visible |
| `/my-posts/:post_id` | Post detail: status, rejection reason, edit and resend, delete | hidden |
| `/profile` (`/settings` redirects here) | Language, country, appearance, support | visible |

The filter, search text and page number on My Posts are kept in the URL. Going back from a post returns to the same view.

## Telegram integration (`src/lib/telegram.ts`)

- Calls `ready()` and `expand()` on start. The app paints Telegram's header and background in the app's own colors.
- Uses Telegram's native **BackButton** on nested pages. When opened in a regular browser, the app draws its own back button instead.
- Reads the user's name, username, photo and `language_code` from `initDataUnsafe`. The language code picks the first-run language.
- Follows Telegram's light or dark scheme by default. The Profile page can override it.
- Adds haptic feedback on taps, selection changes, success and errors.

Telegram opens the Mini App by URL, so the host has to return `index.html` for every path (SPA fallback).

## Backend

`src/lib/api.ts` is a **mock** that stores posts in `localStorage` and seeds demo posts. To connect the bot backend, replace the bodies of `listPosts`, `getPost`, `createPost`, `resubmitPost` and `deletePost` with real requests. Send `Telegram.WebApp.initData` with each request and validate it on the server.

The support link in `src/lib/user.ts` (`SUPPORT_URL`) is a placeholder.

## i18n

Locales are in `src/i18n/locales/{eng,rus,uzb,kaz,kaa,kgz,tjk,aze,tkm}.ts`. `eng.ts` is the source of truth. Every other locale is typed against it, so a missing key fails the build. Country names are in `src/data/countries.ts`.

## Post types and form fields

Each post type's fields (kind, required, options, layout) are configured in `src/data/categories.ts`. The form, validation and post detail page are all generated from that config.

## Design

- **Palette:** fog canvas, white surfaces, plum-ink text and signal blue (`#5B9BFF` in the navbar). Each post type has its own color: cobalt (job), apricot (internship), mint (task), violet (grants). Tokens are in `src/theme/system.ts` and have light and dark values.
- **Type:** Unbounded for display text and Onest for body text. Both are self-hosted and include the Cyrillic-ext and Latin-ext subsets, so Kazakh, Tajik, Karakalpak and Turkmen letters display correctly.
- **Signature element:** the four post types on the dashboard are drawn as "classified-ad tickets", with notched sides, a perforation line and an oversized cropped icon.
- **Navbar:** a floating dark glass pill, 80px tall with 100px radius, blur(15px) and an `rgba(35,35,35,.85)` background. The active tab has a pill that slides between tabs on a spring.
- Animation respects `prefers-reduced-motion`. Tap targets are at least 44px, and focus outlines are visible.
