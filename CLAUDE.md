# Il Mio Ricettario - AI Developer Reference

> **Status**: Phase 1 MVP - Production Ready | **Updated**: 2026-01-29

## Quick Reference

| Resource | Purpose |
|----------|---------|
| [AGENTS.md](AGENTS.md) | Gotchas and patterns (debug >30min) |
| [README.md](README.md) | User documentation and setup |
| [docs/](docs/) | Design documents (DD1, DD2, DD3) |

---

## Project Overview

Digital recipe book with AI-powered PDF extraction. Text-focused, privacy-first, optimized for actual cooking use. Italian cuisine focus with seasonal ingredient classification.

**Target users**: Home cooks digitizing recipe collections, users with PDF cookbooks.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16.1.6, React 18.2, TypeScript 5.3, Tailwind CSS 3.4 |
| Backend | Firebase Auth + Firestore, Claude API (claude-sonnet-4-5) |
| Key Utils | `nosleep.js` (wake lock), `ingredient-scaler.ts` (quantity scaling) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/           # Login, Register
│   ├── (dashboard)/      # Ricette, Categorie, Cotture, Estrattore
│   └── api/              # extract-recipes, suggest-category
├── components/
│   ├── ui/               # Button, Card, Dialog, Sheet, etc.
│   ├── recipe/           # RecipeForm, RecipeCard, CategorySelector
│   └── layout/           # Header, Sidebar, BottomNavigation
├── lib/
│   ├── constants/        # seasons.ts (centralized season constants)
│   ├── firebase/         # firestore.ts, categories.ts, cooking-sessions.ts
│   ├── hooks/            # useAuth, useRecipes
│   └── utils/            # recipe-parser.ts, ingredient-scaler.ts, search.ts
└── types/                # Recipe, Ingredient, Step, Category, CookingSession
```

---

## Critical Patterns

**See [AGENTS.md](AGENTS.md) for all gotchas.** Key patterns:

### Navigation Breakpoint
- **Desktop**: >= 1440px (sidebar always visible)
- **Mobile Portrait**: Bottom nav (4 tabs)
- **Mobile Landscape**: Hamburger + sliding sidebar

**CRITICAL**: Use `max-lg:portrait:` not `portrait:` to avoid desktop conflicts.

### Firebase Data
- Use `null` for optional fields (never `undefined`)
- All queries must filter by `userId`

### Cooking Sessions
- Setup screen pattern (no useEffect creation)
- Auto-delete at 100% progress

---

## Recent Changes (Dec 2025 - Jan 2026)

### Recipe Search & Multiple Seasons (Jan 2026)
- **Recipe search**: Client-side title search with Italian character support (à, è, ì, ò, ù)
- **Unicode NFD normalization**: Accent-insensitive matching for Italian cuisine
- **Multiple seasons**: Recipes can now have multiple season tags (e.g., Pasta e Fagioli = autunno + inverno)
- **Lazy migration**: Backward-compatible migration from single `season` to `seasons[]` array
- **Centralized constants**: Season icons/labels in single source (`lib/constants/seasons.ts`)

### Cooking Mode Enhancements
- **Setup screen pattern**: Prevents duplicate session creation
- **Servings selection**: Real-time ingredient scaling with Italian decimal format (1,5 kg)
- **Auto-deletion**: Sessions delete at 100% completion

### Navigation Refactor
- Orientation-based navigation (portrait/landscape/desktop)
- Breakpoint changed from 1024px to **1440px**
- New components: `BottomNavigation`, `MoreSheet`

### Security Updates
- Package overrides: `glob >= 10.4.6`, `undici >= 6.21.2`

---

## Environment Variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Client + Server | Firebase config (6 vars) |
| `ANTHROPIC_API_KEY` | Server Only | Claude AI API |

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (localhost:3000) |
| `npm run build` | Production build |
| `npm run test` | Run Jest tests |
| `npm run lint` | ESLint |

---

## Database Collections

```
users/{uid}           # User profiles
recipes/{id}          # Recipes (userId field for ownership)
categories/{id}       # User categories
subcategories/{id}    # Nested under categories
cooking_sessions/{id} # Active cooking progress
```

All documents require `userId` field. Security rules enforce ownership.

---

## API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `POST /api/extract-recipes` | PDF -> Claude -> Markdown (max 4.4MB) |
| `POST /api/suggest-category` | Recipe -> Category + Season suggestion |

---

## Resources

- **Gotchas**: [AGENTS.md](AGENTS.md) - Critical patterns that cause >30min debug
- **User Docs**: [README.md](README.md) - Installation, usage, features
- **Comments**: [COMMENTS.md](COMMENTS.md) - Code commenting guidelines
- **Design**: [docs/](docs/) - DD1 (MVP), DD2 (Advanced), DD3 (AI)
