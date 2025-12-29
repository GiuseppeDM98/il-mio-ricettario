# AI Agent Guidelines for Il Mio Ricettario

This document provides instructions for AI agents working on **Il Mio Ricettario**, a Next.js 14 recipe management app with Firebase backend and AI-powered features (Claude 4.5 for PDF extraction). Follow these principles when proposing new code or modifying existing code.

**Last Updated:** 2025-12-29

---

## Project Overview

**Il Mio Ricettario** is a modern, intelligent digital recipe book web application built with Next.js 14 and Firebase. It provides users with a private, organized space to manage their cooking recipes with advanced AI-powered features.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript 5
- **Backend**: Firebase (Auth, Firestore, Hosting)
- **Styling**: Tailwind CSS with HSL-based design system
- **Testing**: Jest with jsdom environment
- **Validation**: Zod schemas
- **Key Libraries**: Radix UI components, lucide-react icons, uuid

### Architecture Pattern
- **App Router structure**: Route groups `(auth)` and `(dashboard)` with separate layouts
- **Context-based auth**: `AuthProvider` wraps the app, `useAuth()` hook for access
- **Custom hooks pattern**: `useRecipes()`, `useAuth()`, `useToast()` for state management
- **Firebase service layer**: Separate files in `lib/firebase/` for firestore, auth, categories, storage
- **Type-safe**: All domain models defined in `src/types/index.ts`

---

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Production build (standalone output)
npm run lint         # ESLint check
npm test             # Run Jest tests
npx tsc --noEmit     # TypeScript check
```

### Firebase Operations
```bash
firebase login                      # Authenticate
firebase deploy --only firestore:rules   # Deploy security rules
firebase deploy --only hosting           # Deploy app
```

### Environment Setup
- Create `.env.local` with Firebase config (see README.md)
- Never commit `.env.local` or Firebase credentials
- Root redirect `/` → `/ricette` configured in [next.config.js](next.config.js:7-14)

---

## Critical Codebase Patterns

### 1. Authentication Flow
- All auth logic in [lib/context/auth-context.tsx](src/lib/context/auth-context.tsx)
- New users automatically get default categories via `initializeDefaultCategories()` ([lib/firebase/categories.ts](src/lib/firebase/categories.ts:26-39))
- Protected routes use `ProtectedRoute` component that checks auth state
- Access auth with `const { user, signIn, signOut } = useAuth()`

### 2. Data Ownership Model
- **Every** Firestore document has a `userId` field
- Security rules enforce ownership: users can only read/write their own data ([firebase/firestore.rules](firebase/firestore.rules:9-11))
- All Firestore queries MUST filter by `userId` (see [lib/firebase/firestore.ts](src/lib/firebase/firestore.ts:49-55))

### 3. Recipe Data Structure
Recipes use a **flat array of ingredients** with optional `section` field for grouping:
```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  section?: string | null;  // Groups ingredients (e.g., "Per la pasta")
}
```
- Form UI uses hierarchical `IngredientSection[]` structure ([recipe-form.tsx](src/components/recipe/recipe-form.tsx:18-22))
- Conversion: hierarchical → flat happens on submit ([recipe-form.tsx](src/components/recipe/recipe-form.tsx:178-190))
- Conversion: flat → hierarchical on load ([recipe-form.tsx](src/components/recipe/recipe-form.tsx:107-149))

Similar pattern for `Step.section` to group preparation steps:
```typescript
interface Step {
  id: string;
  order: number;                 // Global step order (1, 2, 3...)
  description: string;
  duration?: number | null;
  section?: string | null;       // Groups steps (e.g., "Per la pasta")
  sectionOrder?: number;         // Original section order from PDF (preserves document order)
}
```
- **sectionOrder**: Preserves the original order of sections as they appear in the PDF document
- Sections are displayed in the order they appear in the original document, not alphabetically
- This ensures the recipe flow matches the original author's intent

Recipes also include AI-powered categorization and seasonality:
```typescript
interface Recipe {
  // ... all fields above
  season?: 'primavera' | 'estate' | 'autunno' | 'inverno' | 'tutte_stagioni';
  aiSuggested?: boolean;  // true if category/season were suggested by AI
  // ...
}
```
- **season**: Italian seasonal classification based on ingredients
- **aiSuggested**: Indicates if category/season were auto-suggested (for transparency)

### 4. Firebase Timestamps
- Use `serverTimestamp()` for all `createdAt`/`updatedAt` fields
- TypeScript type is `Timestamp` from `firebase/firestore`
- Never manually create timestamps

### 5. Firebase Optional Fields
- **IMPORTANT**: Firebase Firestore does NOT accept `undefined` values in documents
- Always use `null` instead of `undefined` for optional fields
- This applies to all optional fields in `Ingredient`, `Step`, `CookingSession`, and other domain models
- Example:
  ```typescript
  // ❌ WRONG - Will cause Firebase error
  { section: section || undefined }
  { servings: servings || undefined }

  // ✅ CORRECT - Firebase compatible
  { section: section || null }
  { servings: servings || null }
  ```
- When parsing recipes from PDF, the parser automatically uses `null` for empty optional fields
- When creating cooking sessions, use `null` if servings is not provided

### 6. AI Categorization Pattern

The app implements AI-powered categorization and seasonal classification for recipes extracted from PDFs. This follows a specific architecture pattern:

#### API Separation Pattern
- **Extraction API** (`/api/extract-recipes`): Handles PDF parsing with Claude AI
- **Suggestion API** (`/api/suggest-category`): Provides category and season suggestions based on recipe content
- **Separation rationale**: Independent testing, modification, and caching strategies

#### Italian Seasonal Ingredients Database
The suggestion API includes a curated database of Italian seasonal ingredients:
```typescript
const ITALIAN_SEASONAL_INGREDIENTS = {
  primavera: ['asparagi', 'carciofi', 'fave', 'piselli', 'fragole', ...],
  estate: ['pomodori', 'melanzane', 'zucchine', 'peperoni', 'basilico', ...],
  autunno: ['zucca', 'funghi', 'castagne', 'radicchio', 'cavolo', ...],
  inverno: ['cavolo nero', 'cavolfiore', 'finocchi', 'agrumi', ...]
};
```
- Ensures culturally accurate seasonality for Italian cuisine
- No external dependencies required

#### Client-Side Flow
1. User uploads PDF → Extract recipes
2. For each extracted recipe → Call AI suggestion endpoint with:
   - Recipe title
   - Ingredient list
   - User's existing categories
3. AI returns: `{ categoryName, season, isNewCategory }`
4. Pre-populate form with suggestions (user can modify)
5. On save: if new category, auto-create with generated icon/color

#### Automatic Category Creation
See [lib/firebase/categories.ts](src/lib/firebase/categories.ts):
- `generateColorFromName()`: Hash-based consistent color generation
- `generateIconFromName()`: Pattern matching for appropriate icons (e.g., "Primi" → 🍝)
- `createCategoryIfNotExists()`: Checks existence (case-insensitive) or creates new

#### UI Pattern
- Show "✨ Suggerito da AI" badge when displaying AI suggestions
- Pre-select suggested values but keep fully editable
- Default season to "Tutte le stagioni" if undetermined
- Store `aiSuggested: true` in recipe for transparency

#### Season Display
- **Recipe cards**: Icon badge in top-right corner (🌸 ☀️ 🍂 ❄️ 🌍)
- **Recipe detail**: Prominent badge with icon and label
- **Recipe list**: Filter buttons with seasonal icons and counts
- **Recipe form**: Iconic button selector for season choice

### 7. Component Patterns
- **UI components** in `components/ui/`: Button, Input, Card, Dialog, Sheet (Radix-based)
- **Feature components** in `components/{feature}/`: auth, recipe, layout
- Use `cn()` utility from [lib/utils/cn.ts](src/lib/utils/cn.ts) for conditional classes
- Mobile-first: test responsive behavior at breakpoints `sm:`, `md:`, `lg:`

**Mobile optimization best practices**:
- **Responsive layout**: Use `flex-col` → `sm:flex-row` for mobile-to-desktop transitions
- **Font scaling**: Use responsive font sizes (e.g., `text-xs` → `sm:text-sm`, `text-lg` → `sm:text-xl`)
- **Button sizing**: Use `flex-1` on mobile for equal distribution, `sm:flex-none` on desktop for auto-width
- **Padding/spacing**: Scale padding for different screen sizes (e.g., `p-3` → `sm:p-4`)
- **Text truncation**: Use `truncate`, `break-words`, `min-w-0` to prevent overflow
- **Navigation**: Hamburger menu in header on mobile (`md:hidden`), sidebar on desktop (`hidden md:block`)

### 8. Mobile Optimization Patterns

When creating or updating UI components, follow these responsive design patterns used throughout the app:

#### Layout Patterns
```tsx
// Vertical on mobile, horizontal on desktop
<div className="flex flex-col sm:flex-row gap-3">

// Hide on mobile, show on desktop
<div className="hidden md:block">

// Show on mobile, hide on desktop
<div className="md:hidden">
```

#### Button Patterns
```tsx
// Equal width on mobile, auto-width on desktop
<Button className="flex-1 sm:flex-none">

// Full width on mobile, auto on desktop
<Button className="w-full sm:w-auto">

// Responsive text size
<Button className="text-xs sm:text-sm">
```

#### Text Patterns
```tsx
// Responsive font sizes
<h1 className="text-lg sm:text-xl md:text-2xl">

// Prevent text overflow
<span className="truncate">         // Single line ellipsis
<span className="break-words">      // Multi-line word break
<div className="min-w-0">           // Allow flex children to shrink below content size
```

#### Spacing Patterns
```tsx
// Responsive padding
<div className="p-3 sm:p-4 md:p-6">

// Responsive gap
<div className="gap-2 sm:gap-4">

// Responsive margin
<div className="mb-3 sm:mb-4 md:mb-6">
```

#### Form Patterns
```tsx
// Stacked on mobile, side-by-side on desktop
<div className="flex flex-col sm:flex-row gap-4">
  <Input className="flex-grow" />
  <Button className="w-full sm:w-auto" />
</div>
```

#### Navigation Patterns (Updated 2025-12-29)

**Three-Mode Responsive Navigation**:
- **Desktop (≥1440px)**: Sidebar always visible, no hamburger, no bottom nav
- **Mobile Portrait (<1440px + portrait)**: Bottom navigation (4 fixed tabs), sidebar hidden, no hamburger
- **Mobile Landscape (<1440px + landscape)**: Hamburger menu + sliding sidebar, no bottom nav

**Critical Pattern**: Always use `max-lg:` prefix with orientation variants to prevent desktop conflicts

#### Bottom Navigation Pattern (Mobile Portrait)
```tsx
// Fixed position bottom nav - portrait only
<nav className={cn(
  'lg:hidden max-lg:landscape:hidden',
  'max-lg:portrait:flex max-lg:portrait:fixed',
  'max-lg:portrait:bottom-0 max-lg:portrait:left-0 max-lg:portrait:right-0',
  'max-lg:portrait:z-50 max-lg:portrait:border-t max-lg:portrait:bg-white'
)}>
  {tabs.map(tab => (
    <Link href={tab.href} className="flex flex-1 flex-col items-center">
      <Icon />
      <span>{tab.label}</span>
    </Link>
  ))}
</nav>
```

#### Responsive Sidebar Pattern (Desktop + Landscape)
```tsx
<aside className={cn(
  // Desktop: always visible, static position
  'lg:w-64 lg:flex-shrink-0 lg:block lg:relative lg:border-r',

  // Mobile portrait: completely hidden
  'max-lg:portrait:hidden',

  // Mobile landscape: fixed with slide animation
  'max-lg:landscape:fixed max-lg:landscape:inset-y-0 max-lg:landscape:left-0',
  'max-lg:landscape:z-50 max-lg:landscape:w-64',
  'max-lg:landscape:transition-transform max-lg:landscape:duration-300',

  isOpen ? 'max-lg:landscape:translate-x-0' : 'max-lg:landscape:-translate-x-full'
)}>
```

**Reference implementations**:
- [src/components/layout/bottom-navigation.tsx](src/components/layout/bottom-navigation.tsx) - Bottom nav component
- [src/components/layout/sidebar.tsx](src/components/layout/sidebar.tsx) - Responsive sidebar
- [src/components/layout/more-sheet.tsx](src/components/layout/more-sheet.tsx) - Sheet from bottom

### 9. Cooking Mode Patterns (Updated 2025-12-28)

**Setup Screen Pattern**:
- Cooking mode has TWO phases: Setup → Cooking
- Setup screen shown on first visit (no existing session)
- Resume sessions skip setup (load directly to cooking mode)

```typescript
// State management
const [isSetupMode, setIsSetupMode] = useState(true);

// Check for existing session
useEffect(() => {
  const session = await getCookingSession(recipeId, userId);
  if (session) {
    // Resume: skip setup
    setIsSetupMode(false);
    loadSessionData(session);
  } else {
    // First visit: show setup
    setIsSetupMode(true);
  }
}, []);

// Create session ONLY when user clicks "Avvia"
const handleStartCooking = async () => {
  await createCookingSession(recipeId, userId, servings);
  setIsSetupMode(false);
};
```

**Why this pattern?**
- Prevents duplicate session creation (bug fixed 2025-12-28)
- Provides intentional setup step before cooking
- Better UX (user commits to servings selection)

**Ingredient Scaling Pattern**:
```typescript
// Real-time scaling via useEffect
useEffect(() => {
  if (recipe && servings > 0) {
    const scaled = recipe.ingredients.map(ing => ({
      ...ing,
      quantity: ing.quantity
        ? scaleQuantity(ing.quantity, recipe.servings || 4, servings)
        : '',
    }));
    setScaledIngredients(scaled);
  }
}, [recipe, servings]);
```

**Auto-deletion Pattern**:
```typescript
// In toggle handlers (ingredient/step)
const progress = (checkedItems.length / totalItems);
if (progress >= 1.0) {
  await deleteCookingSession(sessionId);
  router.push('/cotture-in-corso');
}
```

### 10. Styling System
- Design tokens via CSS variables in HSL format (see [tailwind.config.ts](tailwind.config.ts:11-54))
- Primary color: Red theme (#ef4444 variants)
- Use semantic colors: `bg-primary`, `text-muted-foreground`, `border`
- Avoid hardcoded colors; extend theme if needed

### 11. Responsive Navigation Patterns (Added 2025-12-29)

**Breakpoint Strategy:**
- **Desktop threshold**: `lg` (1440px) instead of `md` (768px)
- Tablets in landscape (768-1440px) are treated as mobile
- Uses CSS orientation media queries for portrait/landscape detection

**Critical Tailwind Pattern:**
Always use `max-lg:` prefix with orientation variants to avoid desktop conflicts.

```tsx
// ✅ CORRECT - Desktop monitors (landscape) won't be affected
className="max-lg:portrait:flex max-lg:landscape:hidden"

// ❌ WRONG - Would apply to desktop monitors too
className="portrait:flex landscape:hidden"
```

**Navigation Components:**

| Component | Visibility | Purpose |
|-----------|------------|---------|
| `BottomNavigation` | `max-lg:portrait:flex` | Mobile portrait only |
| Hamburger (Header) | `max-lg:landscape:flex` | Mobile landscape only |
| Sidebar | `lg:block` (always) + `max-lg:landscape:` (toggle) | Desktop always, landscape with backdrop |

**State Management:**
- Dashboard layout is CLIENT component (uses `useState` for sidebar/sheet state)
- Header and Sidebar receive props (`sidebarOpen`, `onSidebarToggle`, `isOpen`, `onClose`)
- State resets on orientation change via `useEffect` + `window.matchMedia()`

**Example Layout Pattern:**
```tsx
'use client';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1440 || window.matchMedia('(orientation: portrait)').matches) {
        setSidebarOpen(false); // Close sidebar if not landscape mobile
      }
      if (window.innerWidth >= 1440 || window.matchMedia('(orientation: landscape)').matches) {
        setMoreSheetOpen(false); // Close sheet if not portrait mobile
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ... rest of component
}
```

**Main Content Padding:**
```tsx
<main className={cn(
  'flex-1',
  'lg:p-6',                          // Desktop padding
  'max-lg:portrait:p-4 max-lg:portrait:pb-20',  // Portrait: extra bottom for nav
  'max-lg:landscape:p-4'              // Landscape: standard padding
)}>
```

---

## Project-Specific Conventions

### File Naming
- React components: PascalCase files, e.g., `RecipeForm.tsx` → component `RecipeForm`
- Utilities/hooks: camelCase, e.g., `useRecipes.ts`, `validation.ts`
- Route folders: kebab-case with dynamic segments `[id]`

### TypeScript Usage
- All types centralized in [src/types/index.ts](src/types/index.ts)
- Use Zod schemas for validation ([lib/utils/validation.ts](src/lib/utils/validation.ts))
- Prefer interfaces for domain models, types for utilities
- Enable strict null checks; avoid `any`

### Import Aliases
- Use `@/` for all imports: `import { Recipe, Season } from '@/types'`
- Configured in `tsconfig.json` and `jest.config.js`
- Common imports:
  ```typescript
  import { Recipe, Season, Category, Subcategory } from '@/types';
  import { useAuth } from '@/lib/context/auth-context';
  import { useRecipes } from '@/lib/hooks/useRecipes';
  import { SeasonSelector } from '@/components/recipe/season-selector';
  ```

### Error Handling
- Use try-catch in async operations
- Display user-facing errors via `toast()` from [lib/hooks/use-toast.ts](src/lib/hooks/use-toast.ts)
- Log errors with `console.error()` for debugging

### UUID Generation
- Use `uuid` library: `import { v4 as uuidv4 } from 'uuid'`
- Generate client-side IDs for ingredients/steps (see [recipe-form.tsx](src/components/recipe/recipe-form.tsx:10))

---

## Common Errors to Avoid

### Error 1: Duplicate Cooking Sessions (FIXED 2025-12-28)

**Symptom**: Two cooking sessions created when entering cooking mode
- One with original servings (e.g., 4)
- Another with user-selected servings

**Root Cause**: Session auto-created in `useEffect` on page load, then updated/re-created when user changed servings.

**Solution**: Implemented setup screen pattern
```typescript
// ❌ WRONG - Auto-creates session immediately
useEffect(() => {
  let session = await getCookingSession(recipeId, userId);
  if (!session) {
    await createCookingSession(recipeId, userId, defaultServings);
  }
}, []);

// ✅ CORRECT - Setup screen prevents auto-creation
useEffect(() => {
  const session = await getCookingSession(recipeId, userId);
  if (session) {
    // Resume: skip setup, load session
    setIsSetupMode(false);
    loadSessionData(session);
  } else {
    // First visit: show setup screen
    setIsSetupMode(true);
  }
}, []);

// Session created ONLY when user clicks "Avvia"
const handleStartCooking = async () => {
  await createCookingSession(recipeId, userId, servings);
  setIsSetupMode(false);
};
```

**Prevention**:
- Always use setup screen pattern for cooking mode
- Never auto-create sessions in useEffect
- Create sessions only in response to explicit user action

### Error 2: Firebase `undefined` Values

**Symptom**: Firestore error when creating/updating documents

**Root Cause**: Firebase does NOT accept `undefined` values in documents

**Solution**: Always use `null` for optional fields
```typescript
// ❌ WRONG
await updateDoc(docRef, {
  servings: servings || undefined, // Error!
});

// ✅ CORRECT
await updateDoc(docRef, {
  servings: servings || null,
});
```

**Prevention**:
- Use `null` instead of `undefined` for all optional fields
- Check all function parameters before passing to Firebase
- TypeScript type: `servings?: number` → pass `number | null` to Firebase

### Error 3: Incorrect Quantity Scaling Format

**Symptom**: Ingredient quantities like "1 1/2 , 5 kg" appear confusing

**Root Cause**: Decimal separators not normalized, fractions hard to read

**Solution**: Use decimal notation with Italian format
```typescript
// ❌ WRONG - Fraction notation
"3 ¾ l"  // Hard to read

// ✅ CORRECT - Decimal notation with comma
"3,75 l" // Clear and consistent
```

**Implementation**: See `src/lib/utils/ingredient-scaler.ts`
- Normalizes spaces around decimal separators
- Converts all quantities to decimal (2 decimal places)
- Uses comma separator for Italian locale

**Prevention**:
- Use `scaleQuantity()` utility for all quantity transformations
- Always format numbers with comma separator for Italian locale
- Avoid fraction notation (½, ¼, ¾) in final output

### Error 4: Orientation Variants Without max-lg: Prefix (Added 2025-12-29)

**Symptom**: Desktop navigation behaves incorrectly, bottom nav or hamburger appear on desktop

**Root Cause**: Using `portrait:` or `landscape:` without `max-lg:` prefix applies to ALL screen sizes, including desktop monitors (which are typically landscape).

**Solution**: ALWAYS prefix orientation variants with `max-lg:`

```tsx
// ❌ WRONG - Applies to desktop monitors too
<nav className="portrait:flex landscape:hidden">

// ✅ CORRECT - Only applies to screens <1440px
<nav className="max-lg:portrait:flex max-lg:landscape:hidden">
```

**Prevention**:
- Code review checklist: All `portrait:` and `landscape:` must have `max-lg:` prefix
- Pattern: `max-lg:portrait:` = "screens <1440px AND portrait orientation"
- Pattern: `max-lg:landscape:` = "screens <1440px AND landscape orientation"

### Error 5: Sheet Component Missing Description (Radix UI Warning) (Added 2025-12-29)

**Symptom**: Console warning "Missing `Description` or `aria-describedby={undefined}` for {DialogContent}"

**Root Cause**: Radix UI Dialog/Sheet primitives require either `SheetDescription` or `aria-describedby` for accessibility.

**Solution**: Always include `SheetDescription`, use `sr-only` class if visual description not needed

```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

<SheetContent>
  <SheetHeader>
    <SheetTitle>Title</SheetTitle>
    <SheetDescription className="sr-only">
      Description for screen readers
    </SheetDescription>
  </SheetHeader>
  {/* content */}
</SheetContent>
```

**Prevention**:
- Always import `SheetDescription` when using Sheet
- Add to component template/snippet
- Use `sr-only` class for hidden but accessible descriptions

### Error 6: iPad Mini Landscape Treated as Desktop (FIXED 2025-12-29)

**Symptom**: iPad Mini in landscape orientation (1024px) shows desktop sidebar instead of mobile hamburger menu

**Root Cause**: Device width exactly matches Tailwind's default `lg` breakpoint (1024px)
- Tailwind: `lg:` = `min-width: 1024px`
- iPad Mini landscape: exactly 1024px wide
- Result: `lg:` classes apply → sidebar visible, hamburger hidden

**Solution**: Increase responsive breakpoint from 1024px to 1440px

```typescript
// tailwind.config.ts
theme: {
  extend: {
    screens: {
      lg: '1440px',  // Override default 1024px
    },
  }
}

// src/app/(dashboard)/layout.tsx
// Update JavaScript checks
if (window.innerWidth >= 1440 || ...) {  // Changed from 1024
```

**Prevention**:
- Choose breakpoints that don't match common device widths exactly
- 1440px is a safer threshold that separates tablets (≤1366px) from desktop
- Document breakpoint rationale in config comments
- Test on actual devices or accurate emulators (iPad Mini, iPad Pro, laptops)

**Impact**:
- ✅ iPad Mini landscape (1024px): Now mobile landscape (hamburger visible)
- ✅ Tablets up to 1439px: Correctly treated as mobile
- ✅ Laptops 1366px: Now mobile landscape (improved UX)
- ✅ Desktop ≥1440px: Desktop mode unchanged

---

## Testing Strategy

### Current Setup
- Jest configured with `next/jest` wrapper
- Test environment: jsdom (see [jest.config.js](jest.config.js))
- Existing test example: [components/layout/header.test.tsx](src/components/layout/header.test.tsx)

### When Writing Tests
- Place tests next to components: `Component.test.tsx`
- Use `@testing-library/react` for component tests
- Use `@testing-library/jest-dom` matchers
- Mock Firebase calls (avoid real API calls in tests)

---

## Phase-Based Development

The project follows a 3-phase roadmap (see README.md):

### Phase 1 (MVP - Completed)
- ✅ Auth (Email + Google OAuth)
- ✅ Recipe CRUD with ingredients/steps
- ✅ Categories/subcategories
- ✅ Mobile-responsive UI with optimized category management
- ✅ Cooking mode (screen wake lock via nosleep.js)
- ✅ **NEW (2025-12-28)**: Setup screen for cooking mode (prevents duplicate sessions)
- ✅ **NEW (2025-12-28)**: Servings selection with real-time ingredient scaling
- ✅ **NEW (2025-12-28)**: Auto-deletion of completed cooking sessions (100% progress)
- ✅ **NEW (2025-12-28)**: Favicon (SVG format, book + fork design)
- ✅ PDF extraction with Claude AI
- ✅ AI-powered auto-categorization with automatic category creation
- ✅ Seasonal classification based on Italian ingredients
- ✅ Season filters in recipe list
- ✅ Combined filters (category + subcategory + season)
- ✅ App loading animation with spinner
- ✅ Hamburger menu navigation in header (mobile)

### Phase 2 (Planned)
- Advanced search & filters
- URL import (e.g., GialloZafferano)
- Technique notes system
- Recipe-technique linking

### Phase 3 (AI Features)
- Recipe enhancement suggestions
- Smart ingredient substitutions
- Cooking tips generation

**Important**: When adding features, check which phase they belong to. Don't implement Phase 3 features if Phase 2 dependencies aren't ready.

---

## Design Philosophy

From README.md:
> Un ricettario pulito e text-based, senza immagini. Il focus è sul contenuto - ingredienti, procedimenti e tecniche.

- **No image uploads** in current design (Phase 1)
- Prioritize fast loading and mobile UX
- Use emojis for visual cues (categories, UI elements)
- Keep UI minimal and functional for kitchen use

---

## General Principles

### Readability and Maintainability
- Use descriptive names for variables, functions, and classes
- Avoid ambiguous abbreviations
- Write code that is self-documenting where possible
- Structure code for clarity and ease of understanding

### SOLID Principles
- **Single Responsibility Principle**: Each class/function should have one clear purpose
  - ✅ Example: `createCategoryIfNotExists()` does exactly what its name says - checks and creates
  - ✅ Example: Each Firebase service file handles one domain (recipes, categories, auth)
- **Open/Closed Principle**: Code should be open for extension but closed for modification
  - ✅ Example: Helper functions `generateIconFromName()`, `generateColorFromName()` allow extending icon/color mapping without modifying core logic
- **Liskov Substitution Principle**: Subtypes must be substitutable for their base types
  - Not heavily applicable in this codebase (limited inheritance)
- **Interface Segregation Principle**: Keep interfaces focused and minimal
  - ✅ Example: `Ingredient`, `Step`, `Category` interfaces are minimal and focused
- **Dependency Inversion Principle**: Depend on abstractions, not concretions
  - ✅ Example: Firebase service layer abstracts Firestore operations from UI components

### DRY (Don't Repeat Yourself)
- Avoid code duplication
- Extract common logic into reusable functions or modules
- Use abstraction to eliminate redundancy
- ✅ Example: CRUD patterns in Firebase services reuse consistent patterns
- ✅ Example: `createCategoryIfNotExists()` prevents duplicating category existence checks

### Compact Functions
- Keep functions short and focused on a single task
- A function should do one thing and do it well
- If a function becomes too long, consider breaking it into smaller functions
- ✅ Example: Most functions in this codebase are 10-30 lines
- ⚠️ Exception: `parseRecipeSection()` is ~150 lines but well-sectioned with comments

### Error Handling
- Implement robust and informative error handling
- Provide meaningful error messages
- Handle edge cases and unexpected inputs gracefully
- Use appropriate error handling mechanisms for the language
- ✅ Example: Parser continues with next recipe if one fails (graceful degradation)
- ⚠️ Current implementation uses basic `console.error()` - could be enhanced with structured error types

### Testing
- Provide unit tests for new features
- Ensure tests are comprehensive and cover edge cases
- Write tests that are maintainable and easy to understand
- Follow testing best practices for the language/framework

### Style Conventions
- Follow the established conventions for the specific programming language
- Maintain consistent indentation, spacing, and formatting
- Adhere to the project's existing code style
- Use linters and formatters where available

---

## Comment Guidelines

**IMPORTANT: All comments must be written in English.**

Comments are essential for reducing the reader's cognitive load and explaining information that is not obvious from the code itself. Use comments strategically to make the codebase more accessible and maintainable.

### Project Comment Style

This codebase uses three primary comment patterns:

1. **JSDoc-style function headers** (`/** */`) for public functions with examples
2. **Guide comments** (`//`) to separate logical sections
3. **Inline explanations** (`//`) for complex logic within functions

### Recommended Comment Types

#### 1. Function Comments
Document the interface of functions, classes, and modules.

**Purpose:**
- Allow readers to treat code as a black box
- Describe what the function does, its parameters, and return values
- Document preconditions, postconditions, and side effects

**Placement:** At the beginning of functions, classes, or macros

**Example from this codebase:**
```typescript
/**
 * Parse ingredient line into structured format
 */
function parseIngredientLine(line: string, section: string | null): Ingredient | null {
  // implementation
}

/**
 * Convert text to Title Case (only first letter capitalized)
 * Examples:
 *   "PATATE AL FORNO" → "Patate al forno"
 *   "BISCOTTI LINZER" → "Biscotti linzer"
 *   "Sablé ai lamponi" → "Sablé ai lamponi" (unchanged)
 */
function toTitleCase(text: string): string {
  // implementation
}
```

**When to use:**
- All exported/public functions
- Complex utility functions
- Functions with non-obvious behavior
- Include examples for data transformation functions

#### 2. Design Comments
Explain high-level architecture and design decisions.

**Purpose:**
- Provide a high-level overview of the implementation
- Explain algorithms, techniques, and architectural choices
- Justify why certain approaches were chosen
- Document trade-offs and alternatives considered

**Placement:** Usually at the beginning of files or major sections

**Example from this codebase:**
```typescript
// Default categories to create for new users
export const DEFAULT_CATEGORIES = [
  { name: 'Primi piatti', icon: '🍝', color: '#FF6B6B', order: 1 },
  // ...
];
```

**When to use:**
- Top of service files explaining the module's purpose
- Before complex algorithms or data structures
- When documenting Firebase-specific patterns

#### 3. Why Comments
Explain the reasoning behind non-obvious code.

**Purpose:**
- Explain WHY the code does something, not WHAT it does
- Prevent future modifications that could introduce bugs
- Document business logic or domain-specific requirements
- Clarify decisions that might seem strange or counterintuitive

**Example from this codebase:**
```typescript
// Return null if the recipe doesn't exist or the user is not the owner
if (!recipeSnap.exists() || recipeSnap.data().userId !== userId) {
  return null;
}

// User document created automatically by onAuthStateChanged
const signUp = async (email: string, password: string, displayName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName });
};
```

**When to use:**
- Explaining ownership checks in Firebase queries
- Documenting Firebase-specific behaviors (serverTimestamp, null vs undefined)
- Clarifying Italian culinary domain logic (seasonal ingredients, section naming)

#### 4. Teacher Comments
Educate readers about domain concepts.

**Purpose:**
- Teach domain-specific concepts (math, algorithms, protocols)
- Make the code accessible to more developers
- Explain specialized terminology or techniques
- Provide references to external resources

**Example (could be added to this codebase):**
```typescript
// Simple hash function to get consistent color for same name
// Uses character codes to generate a deterministic hash, ensuring
// the same category name always gets the same color
let hash = 0;
for (let i = 0; i < name.length; i++) {
  hash = name.charCodeAt(i) + ((hash << 5) - hash);
}
```

**When to use:**
- Explaining Italian culinary terminology
- Documenting seasonal ingredient classification logic
- Clarifying PDF parsing patterns

#### 5. Guide Comments
Help readers navigate and understand code structure.

**Purpose:**
- Assist readers in processing the code
- Provide clear division and rhythm
- Introduce major sections or logical blocks
- Act as "chapter headings" for code

**Example from this codebase:**
```typescript
// Create a new recipe
export async function createRecipe(...) { }

// Get single recipe, ensuring ownership
export async function getRecipe(...) { }

// Get all recipes for a user
export async function getUserRecipes(...) { }

// Update recipe
export async function updateRecipe(...) { }

// Delete recipe
export async function deleteRecipe(...) { }
```

**When to use:**
- Separating CRUD operations in service files
- Dividing sections in complex parsing logic
- Organizing related functions (e.g., "Subcategories" section)

#### 6. Checklist Comments
Remind developers of necessary updates.

**Purpose:**
- Highlight dependencies between different parts of the code
- Warn about changes that require updates elsewhere
- Prevent incomplete modifications

**Example:**
```typescript
// Warning: if you add a season type here, update SeasonSelector component
export type Season = 'primavera' | 'estate' | 'autunno' | 'inverno' | 'tutte_stagioni';
```

**When to use:**
- Type definitions that affect multiple components
- Constants that require UI updates (e.g., adding new categories)
- Firebase schema changes that affect security rules

---

### Comments to Avoid

#### Trivial Comments
Comments that require more cognitive effort than the code itself.

**Bad Example:**
```typescript
// Increment order
stepOrder++;
```

**Why to avoid:** The code is already self-explanatory. The comment adds no value and creates maintenance burden.

#### Debt Comments
TODO, FIXME, XXX comments should be minimized.

**Why to avoid:**
- They accumulate over time
- They're often ignored
- They should be tracked in an issue tracker instead

**If you must use them:**
- Include a ticket number or issue reference
- Add a date and author
- Be specific about what needs to be done

**✅ Good news**: This codebase has ZERO TODO/FIXME comments - keep it that way!

#### Backup Comments
Never leave old versions of code commented out.

**Bad Example:**
```typescript
// Old implementation
// return calculateTotal(items, tax);

// New implementation
return calculateTotalWithDiscount(items, tax, discount);
```

**Why to avoid:**
- Use version control instead
- Commented code creates confusion
- It clutters the codebase

**✅ Good news**: This codebase has no commented-out code - excellent!

---

## Additional Principles

### The Golden Rule of Comments
**Comments should explain WHY, not WHAT.**

The code itself shows what is happening. Comments should provide context, reasoning, and information that cannot be expressed in code.

### Keep Comments Updated
- When you modify code, update the relevant comments
- Outdated comments are worse than no comments
- Make comment maintenance part of the code review process

### Reduce Cognitive Load
- Write comments that help readers understand the code faster
- Consider the context and background knowledge of your audience
- Provide the right level of detail for the situation

### Write for the Future
- Write comments thinking about the future reader (who might be you)
- Assume the reader is intelligent but unfamiliar with the specific context
- Make it easy for others to understand and modify the code

---

## Language-Specific Notes

When working with specific programming languages, also follow:
- Language-specific style guides (PEP 8 for Python, Google Style Guide for Java, etc.)
- Framework-specific conventions and best practices
- Project-specific coding standards documented elsewhere in the repository

---

## Conclusion

These guidelines aim to maintain high code quality and readability. When in doubt:
1. Prioritize clarity over cleverness
2. Write code for humans, not just machines
3. Consider the maintainability impact of every change
4. Ask yourself: "Will I understand this in 6 months?"

Remember: Good code is not just about functionality—it's about creating a maintainable and understandable system that evolves gracefully over time.
