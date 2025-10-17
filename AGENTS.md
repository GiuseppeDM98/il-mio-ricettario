# AI Agent Guidelines for Il Mio Ricettario

This document provides instructions for AI agents working on this codebase. Follow these principles when proposing new code or modifying existing code.

## Project Overview

**Il Mio Ricettario** is a Next.js 14 recipe management app using Firebase backend, designed as a mobile-first, text-focused digital cookbook.

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
- This applies to all optional fields in `Ingredient`, `Step`, and other domain models
- Example:
  ```typescript
  // ❌ WRONG - Will cause Firebase error
  { section: section || undefined }

  // ✅ CORRECT - Firebase compatible
  { section: section || null }
  ```
- When parsing recipes from PDF, the parser automatically uses `null` for empty optional fields

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

### 7. Styling System
- Design tokens via CSS variables in HSL format (see [tailwind.config.ts](tailwind.config.ts:11-54))
- Primary color: Red theme (#ef4444 variants)
- Use semantic colors: `bg-primary`, `text-muted-foreground`, `border`
- Avoid hardcoded colors; extend theme if needed

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
- ✅ Mobile-responsive UI
- ✅ Cooking mode (screen wake lock via nosleep.js)
- ✅ PDF extraction with Claude AI
- ✅ AI-powered auto-categorization with automatic category creation
- ✅ Seasonal classification based on Italian ingredients
- ✅ Season filters in recipe list

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
- **Open/Closed Principle**: Code should be open for extension but closed for modification
- **Liskov Substitution Principle**: Subtypes must be substitutable for their base types
- **Interface Segregation Principle**: Keep interfaces focused and minimal
- **Dependency Inversion Principle**: Depend on abstractions, not concretions

### DRY (Don't Repeat Yourself)
- Avoid code duplication
- Extract common logic into reusable functions or modules
- Use abstraction to eliminate redundancy

### Compact Functions
- Keep functions short and focused on a single task
- A function should do one thing and do it well
- If a function becomes too long, consider breaking it into smaller functions

### Error Handling
- Implement robust and informative error handling
- Provide meaningful error messages
- Handle edge cases and unexpected inputs gracefully
- Use appropriate error handling mechanisms for the language

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

### Recommended Comment Types

#### 1. Function Comments
Document the interface of functions, classes, and modules.

**Purpose:**
- Allow readers to treat code as a black box
- Describe what the function does, its parameters, and return values
- Document preconditions, postconditions, and side effects

**Placement:** At the beginning of functions, classes, or macros

**Example:**
```c
/* 
 * Seek the greatest key in the subtree.
 * Return 0 on out of memory, otherwise 1.
 */
int findMaxKey(Node* root) {
    // implementation
}
```

#### 2. Design Comments
Explain high-level architecture and design decisions.

**Purpose:**
- Provide a high-level overview of the implementation
- Explain algorithms, techniques, and architectural choices
- Justify why certain approaches were chosen
- Document trade-offs and alternatives considered

**Placement:** Usually at the beginning of files or major sections

**Example:**
```python
"""
This module implements a B-tree index for fast lookups.

We chose a B-tree over a hash table because:
1. We need ordered iteration
2. Range queries are common in our use case
3. Memory usage is more predictable

The implementation uses a branching factor of 64 to optimize
for cache line size on modern CPUs.
"""
```

#### 3. Why Comments
Explain the reasoning behind non-obvious code.

**Purpose:**
- Explain WHY the code does something, not WHAT it does
- Prevent future modifications that could introduce bugs
- Document business logic or domain-specific requirements
- Clarify decisions that might seem strange or counterintuitive

**Example:**
```javascript
// We must flush the buffer before closing the connection
// because the remote server has a 2-second timeout and
// large payloads can take longer to transmit
flushBuffer();
closeConnection();
```

#### 4. Teacher Comments
Educate readers about domain concepts.

**Purpose:**
- Teach domain-specific concepts (math, algorithms, protocols)
- Make the code accessible to more developers
- Explain specialized terminology or techniques
- Provide references to external resources

**Example:**
```java
/*
 * This implements the Luhn algorithm (modulo 10) for credit card validation.
 * The algorithm works by:
 * 1. Starting from the rightmost digit, double every second digit
 * 2. If doubling results in a number > 9, subtract 9
 * 3. Sum all the digits
 * 4. If the sum is divisible by 10, the number is valid
 * 
 * Reference: https://en.wikipedia.org/wiki/Luhn_algorithm
 */
```

#### 5. Guide Comments
Help readers navigate and understand code structure.

**Purpose:**
- Assist readers in processing the code
- Provide clear division and rhythm
- Introduce major sections or logical blocks
- Act as "chapter headings" for code

**Example:**
```c
/* Initialize connection pool */
connectionPool = createPool(config);

/* Register event handlers */
registerOnConnect(handleConnect);
registerOnError(handleError);

/* Free the query buffer */
freeBuffer(queryBuffer);
```

#### 6. Checklist Comments
Remind developers of necessary updates.

**Purpose:**
- Highlight dependencies between different parts of the code
- Warn about changes that require updates elsewhere
- Prevent incomplete modifications

**Example:**
```typescript
// Warning: if you add a type here, update getTypeNameByID() in utils.ts
enum DataType {
    STRING,
    NUMBER,
    BOOLEAN
}
```

---

### Comments to Avoid

#### Trivial Comments
Comments that require more cognitive effort than the code itself.

**Bad Example:**
```python
# Increment i
i += 1
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

#### Backup Comments
Never leave old versions of code commented out.

**Bad Example:**
```java
// Old implementation
// return calculateTotal(items, tax);

// New implementation
return calculateTotalWithDiscount(items, tax, discount);
```

**Why to avoid:**
- Use version control instead
- Commented code creates confusion
- It clutters the codebase

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