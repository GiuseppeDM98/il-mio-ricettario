# 🍝 Il Mio Ricettario - Claude Code Documentation

> **Last Updated:** 2025-12-28
> **Version:** 0.1.0
> **Status:** Phase 1 MVP - Production Ready

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture & Design Patterns](#architecture--design-patterns) *(Phase 2)*
5. [Data Flow](#data-flow) *(Phase 2)*
6. [Key Features & Components](#key-features--components) *(Phase 3)*

---

## Project Overview

**Il Mio Ricettario** is a modern, intelligent digital recipe book web application built with Next.js 14 and Firebase. It provides users with a private, organized space to manage their cooking recipes with advanced AI-powered features.

### Purpose

Create a text-focused, fast, and functional recipe management system optimized for actual cooking use, with AI assistance for recipe extraction and categorization.

### Key Value Propositions

1. **Privacy-First**: Each user's recipes are completely private and isolated
2. **AI-Powered**: Automatic recipe extraction from PDFs using Claude AI 4.5
3. **Cooking-Optimized**: Advanced cooking mode with screen wake lock and progress tracking
4. **Smart Organization**: AI-suggested categories and seasonal classification based on Italian ingredients
5. **Mobile-First**: Fully responsive design optimized for use in the kitchen

### Design Philosophy

> "Clean, text-based recipe book without images. Focus on content - ingredients, procedures, and techniques - for a fast and functional cooking experience."

No image uploads, no social features (Phase 1). Just pure recipe management with intelligent organization.

### Target Users

- Home cooks who want to digitize their recipe collections
- Users with PDFs from cookbooks who want structured, searchable recipes
- Italian cuisine enthusiasts (seasonal ingredient database focused on Italian cooking)
- Anyone needing a private, organized recipe vault

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.0 | React framework with App Router |
| **React** | 18.2.0 | UI library |
| **TypeScript** | 5.3.0 | Type safety and developer experience |
| **Tailwind CSS** | 3.4.0 | Utility-first styling with HSL design tokens |

### UI Components

| Technology | Purpose |
|------------|---------|
| **Radix UI** | Accessible primitives (Dialog, Toast, Sheet) |
| **Lucide React** | Icon library (lucide-react ^0.545.0) |
| **class-variance-authority** | Component variant styling |
| **react-hot-toast** | Toast notifications |

### Backend & Services

| Technology | Purpose |
|------------|---------|
| **Firebase Authentication** | User management (Email + Google OAuth) |
| **Cloud Firestore** | NoSQL real-time database |
| **Firebase Hosting** | Static hosting with CDN |
| **Anthropic Claude API** | AI recipe extraction (claude-sonnet-4-5) |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Jest** | Testing framework |
| **Testing Library** | React component testing |
| **ESLint** | Code linting |
| **Zod** | Schema validation |

### Key Utilities

| Package | Purpose |
|---------|---------|
| `uuid` | ID generation for ingredients/steps |
| `nosleep.js` | Screen wake lock for cooking mode |
| `@anthropic-ai/sdk` | Claude API integration |

### Configuration Files

```
next.config.js       - Next.js config (standalone output, redirects)
tsconfig.json        - TypeScript strict mode, path aliases (@/*)
tailwind.config.ts   - Design system (HSL tokens, semantic colors)
firebase.json        - Firebase hosting & Firestore config
jest.config.js       - Jest testing configuration
postcss.config.js    - PostCSS with Tailwind
vercel.json          - Vercel deployment config
```

### Environment Variables

| Variable | Visibility | Purpose |
|----------|------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Client + Server | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Client + Server | Auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Client + Server | Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Client + Server | Storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Client + Server | Messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Client + Server | App ID |
| `ANTHROPIC_API_KEY` | Server Only | Claude AI API key (NO NEXT_PUBLIC_ prefix) |

---

## Project Structure

### Root Directory Layout

```
il-mio-ricettario/
├── src/                      # Source code
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   ├── lib/                  # Business logic & utilities
│   └── types/                # TypeScript type definitions
├── firebase/                 # Firebase configuration
│   ├── firestore.rules       # Security rules
│   └── firestore.indexes.json
├── public/                   # Static assets
├── docs/                     # Design documents
├── .env.local                # Environment variables (git-ignored)
├── .env.example              # Template for env vars
├── package.json              # Dependencies
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
├── jest.config.js            # Jest test configuration
├── AGENTS.md                 # AI coding guidelines
├── README.md                 # User documentation
└── CLAUDE.md                 # This file (AI developer docs)
```

### `/src/app` - Next.js App Router

```
src/app/
├── layout.tsx                # Root layout (AuthProvider)
├── page.tsx                  # Homepage (redirects to /ricette)
│
├── (auth)/                   # Route group: Authentication
│   ├── login/page.tsx
│   └── register/page.tsx
│
├── (dashboard)/              # Route group: Main app
│   ├── layout.tsx            # Shared layout (Header, Sidebar, Footer)
│   ├── ricette/
│   │   ├── page.tsx          # Recipe list
│   │   ├── new/page.tsx      # Create recipe
│   │   └── [id]/
│   │       ├── page.tsx      # Recipe detail
│   │       ├── edit/page.tsx
│   │       └── cooking/page.tsx  # Cooking mode
│   ├── categorie/page.tsx
│   ├── cotture-in-corso/page.tsx # Active cooking sessions
│   └── estrattore-ricette/page.tsx # AI extractor UI
│
└── api/                      # API Routes (Server-side)
    ├── extract-recipes/route.ts   # POST /api/extract-recipes
    └── suggest-category/route.ts  # POST /api/suggest-category
```

### `/src/components` - React Components

```
src/components/
├── ui/                       # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   ├── toast.tsx
│   └── ...
│
├── auth/                     # Authentication components
│   ├── auth-form.tsx
│   └── protected-route.tsx
│
├── recipe/                   # Recipe-specific components
│   ├── recipe-form.tsx
│   ├── recipe-card.tsx
│   ├── recipe-detail.tsx
│   ├── category-selector.tsx
│   ├── season-selector.tsx
│   ├── ingredient-list-collapsible.tsx
│   ├── steps-list-collapsible.tsx
│   ├── recipe-extractor-upload.tsx
│   └── extracted-recipe-preview.tsx
│
└── layout/                   # Layout components
    ├── header.tsx
    ├── sidebar.tsx
    ├── footer.tsx
    └── mobile-nav.tsx
```

### `/src/lib` - Business Logic Layer

```
src/lib/
├── firebase/                 # Firebase service layer
│   ├── config.ts             # Firebase initialization
│   ├── auth.ts               # Auth helpers
│   ├── firestore.ts          # Recipe CRUD operations
│   ├── categories.ts         # Categories CRUD + defaults
│   ├── cooking-sessions.ts   # Cooking sessions CRUD
│   └── storage.ts            # File upload (future)
│
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Re-export from auth-context
│   ├── useRecipes.ts         # Fetch user recipes
│   └── useToast.ts           # Toast notifications
│
├── context/
│   └── auth-context.tsx      # Global AuthProvider
│
└── utils/
    ├── cn.ts                 # classnames utility
    ├── validation.ts         # Zod schemas
    ├── formatting.ts         # Time/date formatting
    ├── constants.ts          # App constants
    └── recipe-parser.ts      # Markdown → structured recipes
```

### `/src/types` - TypeScript Definitions

```
src/types/
└── index.ts                  # All type definitions
    ├── Recipe
    ├── Ingredient
    ├── Step
    ├── Category
    ├── Subcategory
    ├── CookingSession
    ├── ParsedRecipe
    └── ...
```

### `/firebase` - Firebase Configuration

```
firebase/
├── firestore.rules           # Firestore security rules (userId-based)
└── firestore.indexes.json    # Query indexes configuration
```

### `/docs` - Design Documents

```
docs/
├── DD1-foundation-mvp.md     # Foundation & MVP features
├── DD2-advanced-features.md  # Advanced features planning
└── DD3-ai-magic.md           # AI features specifications
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase | `RecipeForm.tsx` |
| Hooks/Utilities | camelCase | `useRecipes.ts`, `validation.ts` |
| Route Folders | kebab-case | `ricette/`, `[id]/` |
| API Routes | kebab-case | `extract-recipes/` |
| Types/Interfaces | PascalCase | `Recipe`, `Ingredient` |

### Import Aliases

All imports use the `@/` alias for absolute paths:

```typescript
import { Recipe } from '@/types'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
```

Configured in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## Architecture & Design Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Next.js 14 App Router                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐ │
│  │   (auth)     │  │ (dashboard)  │  │    api/                │ │
│  │  Route Group │  │ Route Group  │  │    Server Routes       │ │
│  │              │  │              │  │                        │ │
│  │ - login      │  │ - ricette    │  │ - extract-recipes      │ │
│  │ - register   │  │ - categorie  │  │ - suggest-category     │ │
│  └──────────────┘  └──────────────┘  └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
           │                    │                      │
           ▼                    ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌───────────────────┐
│  AuthProvider    │  │  Firebase SDK    │  │  Anthropic API    │
│  (Context)       │  │  (Firestore)     │  │  (Claude 4.5)     │
│                  │  │                  │  │                   │
│ - User state     │  │ - Real-time DB   │  │ - PDF extraction  │
│ - Auth methods   │  │ - Collections    │  │ - Categorization  │
│ - Session mgmt   │  │ - Security rules │  │ - Seasonality     │
└──────────────────┘  └──────────────────┘  └───────────────────┘
```

### Rendering Strategy

**Next.js 14 App Router with Hybrid Rendering**

- **Server Components (default)**: All page.tsx files are Server Components by default
- **Client Components**: Components with `'use client'` directive for interactivity
  - `src/lib/context/auth-context.tsx` (uses React hooks and state)
  - `src/components/recipe/*` (interactive forms, checkboxes)
  - `src/components/layout/*` (navigation, mobile menu)

**Benefits:**
- Reduced JavaScript bundle size
- Better SEO (server-rendered content)
- Faster initial page loads
- Client-side interactivity where needed

### State Management

**1. Global State: React Context**

Located in `src/lib/context/auth-context.tsx`:

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
```

**Key Features:**
- Wraps entire app in `app/layout.tsx`
- Listens to Firebase `onAuthStateChanged` for session persistence
- Automatically creates/updates user document in Firestore on auth state change
- Initializes default categories for new users
- Shows loading spinner during initial auth check

**2. Local Component State**

Components manage their own state using React hooks:
- `useState` for form inputs, UI toggles, filters
- `useEffect` for data fetching and subscriptions
- Custom hooks in `src/lib/hooks/` for reusable logic

### Data Persistence

**Firebase Firestore Architecture**

```
Firestore Collections:
├── users/               (User profiles)
├── recipes/             (User recipes - private)
├── categories/          (User categories - private)
├── subcategories/       (User subcategories - private)
└── cooking_sessions/    (Active cooking sessions - private)
```

**Service Layer Pattern** (`src/lib/firebase/`)

Each collection has a dedicated service module:

| Service | Responsibilities | Key Functions |
|---------|-----------------|---------------|
| `firestore.ts` | Recipe CRUD | `createRecipe()`, `getRecipe()`, `getUserRecipes()`, `updateRecipe()`, `deleteRecipe()` |
| `categories.ts` | Categories management | `getUserCategories()`, `createCategory()`, `initializeDefaultCategories()`, `createCategoryIfNotExists()` |
| `cooking-sessions.ts` | Cooking progress tracking | `getCookingSession()`, `updateCookingSession()`, `toggleIngredientChecked()`, `toggleStepChecked()` |
| `auth.ts` | Auth helpers | `getCurrentUser()` |

**Data Ownership Enforcement:**

All Firestore queries include `where('userId', '==', userId)` filter to ensure users only access their own data. Server-side security rules provide additional protection.

### Authentication & Authorization

**Two-Layer Security Model**

**Layer 1: Client-Side (Firebase Auth)**

`src/lib/context/auth-context.tsx`:
- Firebase Authentication SDK manages sessions
- Supports Email/Password and Google OAuth
- Automatic token refresh
- Protected routes via `ProtectedRoute` component

**Layer 2: Server-Side (Firestore Security Rules)**

`firebase/firestore.rules`:

```javascript
function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}

match /recipes/{recipeId} {
  allow read: if isOwner(resource.data.userId);
  allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
  allow update, delete: if isOwner(resource.data.userId);
}
```

**Key Security Features:**
- Every document has a `userId` field
- Rules enforce ownership at database level (cannot be bypassed from client)
- `serverTimestamp()` prevents client-side timestamp manipulation
- API routes verify authentication before processing requests

### Design Patterns

**1. Repository Pattern**

Firebase service modules (`src/lib/firebase/`) act as repositories, abstracting Firestore operations:

```typescript
// Example: src/lib/firebase/firestore.ts
export async function createRecipe(
  userId: string,
  recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const recipesRef = collection(db, 'recipes');
  const docRef = await addDoc(recipesRef, {
    ...recipeData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}
```

**Benefits:**
- Single source of truth for database operations
- Easy to test and mock
- Consistent error handling
- Type-safe with TypeScript

**2. Provider Pattern**

`AuthProvider` wraps the app to provide global authentication state:

```typescript
// src/lib/context/auth-context.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // Update user state, create user doc if needed, init categories
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

**3. Component Composition**

UI components are highly composable:

```
RecipeForm (Container)
  ├─ CategorySelector (Smart component)
  ├─ SeasonSelector (Smart component)
  ├─ IngredientListCollapsible (Presentation + interaction)
  └─ StepsListCollapsible (Presentation + interaction)
```

**4. Server Actions via API Routes**

AI operations are handled server-side to protect API keys:

```typescript
// Client calls API route
const response = await fetch('/api/extract-recipes', {
  method: 'POST',
  body: formData, // PDF file
});

// Server (src/app/api/extract-recipes/route.ts) calls Anthropic
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const message = await anthropic.messages.create({ /*...*/ });
```

### Key Architectural Decisions

**Decision 1: Next.js App Router over Pages Router**

**Rationale:**
- Better performance with Server Components
- Native support for React Server Components
- Simplified data fetching (async/await in components)
- Route groups for better organization (`(auth)`, `(dashboard)`)

**Trade-offs:**
- Learning curve (newer paradigm)
- Some libraries require `'use client'` directive

**Decision 2: Firebase over Custom Backend**

**Rationale:**
- Faster development (no backend code needed)
- Built-in authentication and security rules
- Real-time capabilities out of the box
- Free tier sufficient for personal use
- Auto-scaling for production

**Trade-offs:**
- Vendor lock-in to Firebase
- Limited query capabilities (no full-text search)
- NoSQL limitations (no joins)

**Decision 3: AI Processing on Server-Side (API Routes)**

**Rationale:**
- Protects Anthropic API key (never exposed to client)
- Handles large file uploads (PDF processing)
- Centralized error handling
- Can add rate limiting/caching later

**Implementation:**
- `POST /api/extract-recipes`: PDF → Claude → Markdown
- `POST /api/suggest-category`: Recipe data → Claude → Category + Season suggestions

**Decision 4: Text-Only Recipe Format (No Images in Phase 1)**

**Rationale:**
- Simplifies storage (no Firebase Storage setup)
- Faster load times (text-based is lightweight)
- Focus on content over visuals
- Optimized for actual cooking (text is easier to read from distance)

**Trade-offs:**
- Less visually appealing
- Harder to identify recipes at a glance
- May add images in Phase 2 if needed

**Decision 5: Section-Based Ingredient/Step Organization**

**Rationale:**
- Preserves structure from PDF extraction
- Natural grouping for complex recipes (e.g., "Per la pasta", "Per il sugo")
- Collapsible sections improve mobile UX

**Implementation:**
```typescript
interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  section?: string | null; // e.g., "Per la pasta"
}

interface Step {
  id: string;
  order: number;
  description: string;
  section?: string | null; // e.g., "Preparazione"
  sectionOrder?: number;   // Preserves PDF order
}
```

**Decision 6: AI-Suggested Categories with Auto-Creation**

**Rationale:**
- Reduces manual work for users
- Consistent categorization across recipes
- Smart defaults while allowing manual override
- Seamless UX (categories created on-the-fly)

**Implementation:**
- `createCategoryIfNotExists()` checks for existing category (case-insensitive)
- If not found, creates with auto-generated icon and color
- Pattern matching for icons: "primi" → 🍝, "dolci" → 🍰
- Color hash based on category name for consistency

**Decision 7: Seasonal Classification Based on Italian Ingredients**

**Rationale:**
- Helps users cook seasonally
- Built-in database of Italian seasonal ingredients
- AI analyzes ingredients to suggest season
- Supports Italian culinary traditions

**Database:**
```typescript
const ITALIAN_SEASONAL_INGREDIENTS = {
  primavera: ['asparagi', 'carciofi', 'fave', 'piselli', 'fragole', ...],
  estate: ['pomodori', 'melanzane', 'zucchine', 'peperoni', 'basilico', ...],
  autunno: ['zucca', 'funghi', 'castagne', 'radicchio', ...],
  inverno: ['cavolo nero', 'cavolfiore', 'finocchi', 'agrumi', ...],
};
```

### Critical Code Paths

**Path 1: User Registration Flow**

```
User fills registration form
  → createUserWithEmailAndPassword(auth, email, password)
  → onAuthStateChanged listener fires
  → Create user doc in Firestore (src/lib/context/auth-context.tsx:49-57)
  → initializeDefaultCategories(userId) (src/lib/firebase/categories.ts:26-39)
  → Creates 5 default categories: Primi, Secondi, Contorni, Dolci, Antipasti
  → AuthContext updates user state
  → User redirected to /ricette
```

**Path 2: AI Recipe Extraction Flow**

```
User uploads PDF
  → POST /api/extract-recipes with FormData
  → Validate file (type, size <4.4MB) (src/app/api/extract-recipes/route.ts:228-242)
  → Convert PDF to base64
  → Call Claude API with extraction prompt (route.ts:255-278)
  → Claude returns markdown text
  → parseExtractedRecipes(markdownText) (src/lib/utils/recipe-parser.ts:18-36)
    → Split by recipe separator (---\s*---)
    → For each recipe: parse title, ingredients, steps, metadata
    → Extract equipment from steps → move to notes
    → Normalize section names ("per la pasta" → "Per la pasta")
    → Convert times to minutes
  → For each parsed recipe: getAISuggestionForRecipe() (recipe-parser.ts:365-396)
    → POST /api/suggest-category with title + ingredients
    → Claude suggests category (existing or new) + season
  → Return array of ParsedRecipe with AI suggestions to client
  → User reviews, edits, and saves selected recipes
```

**Path 3: Recipe CRUD Flow**

```
Create:
  User fills RecipeForm → createRecipe(userId, data) → Firestore addDoc() → Recipe list updated

Read:
  Page load → getUserRecipes(userId) → Firestore query(where('userId', '==', userId))

Update:
  Edit form → updateRecipe(id, updates) → Firestore updateDoc() with serverTimestamp()

Delete:
  Confirm dialog → deleteRecipe(id) → Firestore deleteDoc()
```

**Path 4: Cooking Session Flow**

```
User clicks "👨‍🍳 Inizia a Cucinare"
  → Check if session exists: getCookingSession(recipeId, userId)
  → If not, create: createCookingSession(recipeId, userId)
    → Initial state: checkedIngredients: [], checkedSteps: []
  → Render cooking mode UI with checkboxes
  → User checks ingredient → toggleIngredientChecked(sessionId, ingredientId, current[])
    → Update Firestore: checkedIngredients += ingredientId
  → Progress bar recalculates: (checked / total) * 100
  → Screen stays awake (nosleep.js)
  → Session persists in Firestore (resume anytime from "Cotture in Corso")
```

### Error Handling Strategy

**Client-Side:**
- Try/catch blocks in async operations
- User-friendly error messages via `react-hot-toast`
- Form validation with Zod schemas (future)

**Server-Side (API Routes):**
- Explicit error responses with status codes
- Detailed error logging to console
- Graceful degradation (e.g., AI suggestions fail → user can still manually categorize)

**Example:**
```typescript
// src/app/api/extract-recipes/route.ts
try {
  // ... PDF processing
} catch (error: any) {
  console.error('Error extracting recipes:', error);
  return NextResponse.json(
    { error: 'Errore durante l\'estrazione delle ricette', details: error.message },
    { status: 500 }
  );
}
```

### Performance Optimizations

**1. Firestore Indexes**

Defined in `firebase/firestore.indexes.json`:
- Compound index on `userId` + `createdAt` (desc) for recipe queries
- Compound index on `userId` + `order` for category queries

**2. Next.js Output Mode**

`next.config.js`:
```javascript
output: 'standalone'  // Optimized production builds
```

**3. Image Optimization Disabled**

```javascript
images: { unoptimized: true }  // No images in Phase 1
```

**4. Component Code Splitting**

Next.js automatically code-splits by route, reducing initial bundle size.

**5. Server Components Default**

Most components are Server Components, reducing client-side JavaScript.

### Testing Strategy

**Current Setup:**
- Jest + Testing Library configured
- Example test: `src/components/layout/header.test.tsx`

**Approach:**
- Unit tests for utility functions (`recipe-parser.ts`, `validation.ts`)
- Integration tests for Firebase services (mocked)
- Component tests for UI components
- E2E tests planned for Phase 2 (Playwright)

---

## Data Flow

### Authentication Flow

#### Registration Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     User Registration                                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User fills form (email, password, name) │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Client: createUserWithEmailAndPassword  │
         │  (src/lib/context/auth-context.tsx:80)   │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Firebase Auth creates user account      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  onAuthStateChanged listener triggers    │
         │  (auth-context.tsx:40)                   │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Create user document in Firestore       │
         │  Collection: users/{uid}                 │
         │  Fields: email, displayName, timestamps  │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  initializeDefaultCategories(userId)     │
         │  (src/lib/firebase/categories.ts:26)     │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Create 5 default categories:            │
         │  - 🍝 Primi piatti                       │
         │  - 🥩 Secondi piatti                     │
         │  - 🥗 Contorni                           │
         │  - 🍰 Dolci                              │
         │  - 🧀 Antipasti                          │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  AuthContext.setUser(userDoc)            │
         │  loading = false                         │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Redirect to /ricette                    │
         └──────────────────────────────────────────┘
```

#### Login Flow

```
User enters credentials
  → signIn(email, password)
  → Firebase signInWithEmailAndPassword()
  → onAuthStateChanged fires
  → Fetch user doc from Firestore
  → setUser(userDoc)
  → Redirect to /ricette
```

#### Google OAuth Flow

```
User clicks "Sign in with Google"
  → signInWithGoogle()
  → Firebase signInWithPopup(GoogleAuthProvider)
  → onAuthStateChanged fires
  → Check if user doc exists
    → If NO: Create user doc + initialize categories
    → If YES: Fetch existing user doc
  → setUser(userDoc)
  → Redirect to /ricette
```

#### Session Persistence

```
App loads
  → AuthProvider useEffect runs
  → onAuthStateChanged listener attached
  → Firebase checks for existing session
    → If session exists: Fetch user doc → setUser()
    → If no session: setUser(null)
  → loading = false
  → Render app content
```

---

### Recipe CRUD Flow

#### Create Recipe Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Create New Recipe                                │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User navigates to /ricette/new          │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  RecipeForm component renders            │
         │  (src/components/recipe/recipe-form.tsx) │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User fills form:                        │
         │  - Title (required)                      │
         │  - Description                           │
         │  - Category/Subcategory                  │
         │  - Season (optional)                     │
         │  - Ingredients (with sections)           │
         │  - Steps (with sections)                 │
         │  - Servings, prep/cook time              │
         │  - Notes                                 │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Form submission                         │
         │  - Generate UUIDs for ingredients/steps  │
         │  - Validate required fields              │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Call createRecipe(userId, recipeData)   │
         │  (src/lib/firebase/firestore.ts:19)      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Firestore addDoc():                     │
         │  Collection: recipes                     │
         │  Data: {                                 │
         │    ...recipeData,                        │
         │    userId,                               │
         │    createdAt: serverTimestamp(),         │
         │    updatedAt: serverTimestamp()          │
         │  }                                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Return recipe ID                        │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Show success toast                      │
         │  Redirect to /ricette/{id}               │
         └──────────────────────────────────────────┘
```

#### Read Recipes Flow

```
User navigates to /ricette
  ▼
Page component loads (Server Component)
  ▼
Call getUserRecipes(userId)
  → Firestore query:
    collection('recipes')
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
  ▼
Return Recipe[] array
  ▼
Render RecipeCard for each recipe
  - Display title, category, season badge
  - Show servings, prep time, cook time
  - Action buttons: View, Edit, Delete
```

#### Update Recipe Flow

```
User clicks Edit on recipe
  → Navigate to /ricette/{id}/edit
  → Fetch recipe: getRecipe(id, userId)
  → Pre-fill RecipeForm with existing data
  → User modifies fields
  → Submit form
  → Call updateRecipe(id, updates)
    → Firestore updateDoc() with serverTimestamp()
  → Show success toast
  → Redirect to /ricette/{id}
```

#### Delete Recipe Flow

```
User clicks Delete button
  → Show confirmation dialog
  → User confirms
  → Call deleteRecipe(id)
    → Firestore deleteDoc(doc(db, 'recipes', id))
  → Show success toast
  → Redirect to /ricette
```

---

### AI Recipe Extraction Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│              AI Recipe Extraction (Complete Flow)                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User navigates to /estrattore-ricette   │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  RecipeExtractorUpload component         │
         │  (drag & drop or file picker)            │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User selects PDF file                   │
         │  Client-side validation:                 │
         │  - Type: application/pdf                 │
         │  - Size: max 4.4MB                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Fetch user categories                   │
         │  getUserCategories(userId)               │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  POST /api/extract-recipes               │
         │  FormData:                               │
         │  - file: PDF blob                        │
         │  - userCategories: JSON string           │
         └──────────────────────────────────────────┘
                                │
                                ▼
    ┌────────────────────────────────────────────────────────┐
    │              Server-Side Processing                     │
    │  (src/app/api/extract-recipes/route.ts)                │
    └────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Validate file:                          │
         │  - Check type === 'application/pdf'      │
         │  - Check size <= 4.4MB                   │
         │  (route.ts:228-242)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Convert PDF to base64:                  │
         │  - arrayBuffer = await file.arrayBuffer()│
         │  - buffer = Buffer.from(arrayBuffer)     │
         │  - base64 = buffer.toString('base64')    │
         │  (route.ts:244-247)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Initialize Anthropic client             │
         │  (API key from env: ANTHROPIC_API_KEY)   │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Call Claude API:                        │
         │  Model: claude-sonnet-4-5                │
         │  Max tokens: 16000                       │
         │  Content:                                │
         │  - PDF document (base64)                 │
         │  - Extraction prompt (structured)        │
         │  (route.ts:255-278)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Claude analyzes PDF:                    │
         │  - Identifies all recipes                │
         │  - Extracts ingredients by section       │
         │  - Extracts steps by section             │
         │  - Extracts metadata (servings, times)   │
         │  - Preserves section names exactly       │
         │  - Returns structured markdown           │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Extract text from Claude response       │
         │  (route.ts:281-284)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Return JSON response:                   │
         │  {                                       │
         │    success: true,                        │
         │    extractedRecipes: markdownText,       │
         │    userCategories: [...],                │
         │    metadata: { model, fileSize }         │
         │  }                                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
    ┌────────────────────────────────────────────────────────┐
    │              Client-Side Processing                     │
    └────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  parseExtractedRecipes(markdownText)     │
         │  (src/lib/utils/recipe-parser.ts:18)     │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  For each recipe:                        │
         │  1. Parse title (# heading)              │
         │  2. Parse ingredient sections            │
         │     → "## Ingredienti per X"             │
         │     → Create Ingredient objects          │
         │  3. Parse step sections                  │
         │     → "## Procedimento per X"            │
         │     → Create Step objects                │
         │     → Track sectionOrder                 │
         │  4. Extract metadata                     │
         │     → Porzioni, Tempo prep, Tempo cottura│
         │  5. Extract notes                        │
         │  6. Extract equipment → move to notes    │
         │  7. Normalize:                           │
         │     → Title: Title Case                  │
         │     → Sections: Capitalize "Per"         │
         │     → Times: Convert to minutes          │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  For each parsed recipe:                 │
         │  getAISuggestionForRecipe()              │
         │  (recipe-parser.ts:365)                  │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  POST /api/suggest-category              │
         │  Body: {                                 │
         │    recipeTitle,                          │
         │    ingredients: [names],                 │
         │    userCategories                        │
         │  }                                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
    ┌────────────────────────────────────────────────────────┐
    │         AI Category & Season Suggestion                 │
    │  (src/app/api/suggest-category/route.ts)               │
    └────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Create categorization prompt:           │
         │  - Recipe title                          │
         │  - Ingredients list                      │
         │  - User's existing categories            │
         │  - Italian seasonal ingredient database  │
         │  (route.ts:11-48)                        │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Call Claude API:                        │
         │  Model: claude-sonnet-4-5                │
         │  Max tokens: 500                         │
         │  (route.ts:78-87)                        │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Claude analyzes:                        │
         │  - Matches to existing category OR       │
         │  - Suggests new category name            │
         │  - Determines season based on:           │
         │    • Seasonal ingredient database        │
         │    • Italian culinary traditions         │
         │  Returns JSON:                           │
         │  {                                       │
         │    category: "Primi piatti",             │
         │    season: "estate",                     │
         │    isNewCategory: false                  │
         │  }                                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Return suggestion to client             │
         │  (route.ts:103-110)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Attach AI suggestion to ParsedRecipe:   │
         │  recipe.aiSuggestion = {                 │
         │    categoryName,                         │
         │    season,                               │
         │    isNewCategory                         │
         │  }                                       │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Render ExtractedRecipePreview cards     │
         │  For each recipe:                        │
         │  - Show title, ingredients, steps        │
         │  - Show AI suggestions with badge        │
         │  - Allow editing category/season         │
         │  - Checkbox to select for saving         │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User reviews and optionally edits       │
         │  - Can modify category name              │
         │  - Can change season                     │
         │  - Can select which recipes to save      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User clicks "Salva Ricette Selezionate" │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  For each selected recipe:               │
         │  1. If category is new:                  │
         │     → createCategoryIfNotExists(name)    │
         │       → Auto-generate icon & color       │
         │  2. Get categoryId                       │
         │  3. createRecipe(userId, {               │
         │       ...recipeData,                     │
         │       categoryId,                        │
         │       season,                            │
         │       aiSuggested: true,                 │
         │       source: { type: 'pdf' }            │
         │     })                                   │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Show success toast                      │
         │  Navigate to /ricette                    │
         │  (Recipes now visible in list)           │
         └──────────────────────────────────────────┘
```

**Key Data Transformations:**

1. **PDF → Markdown** (Claude API)
2. **Markdown → ParsedRecipe[]** (recipe-parser.ts)
3. **ParsedRecipe → AISuggestion** (suggest-category API)
4. **ParsedRecipe + AISuggestion → Recipe** (Firestore document)

---

### Cooking Session Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Cooking Mode Flow                                  │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  User viewing recipe detail              │
         │  (/ricette/{id})                         │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Click "👨‍🍳 Inizia a Cucinare" button    │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Navigate to /ricette/{id}/cooking       │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  CookingMode page component loads        │
         │  (src/app/(dashboard)/ricette/[id]/      │
         │   cooking/page.tsx)                      │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Fetch recipe: getRecipe(id, userId)     │
         └──────────────────────────────────────────┘
                                │
                                ▼
         ┌──────────────────────────────────────────┐
         │  Check for existing session:             │
         │  getCookingSession(recipeId, userId)     │
         │  (src/lib/firebase/cooking-sessions.ts)  │
         └──────────────────────────────────────────┘
                   │                    │
                   │                    │
        If exists  │                    │  If not exists
                   ▼                    ▼
         ┌─────────────────┐  ┌──────────────────────┐
         │ Load session    │  │ createCookingSession │
         │ data:           │  │ (recipeId, userId)   │
         │ - checkedIng[]  │  │ Initial state:       │
         │ - checkedSteps[]│  │ - checkedIng: []     │
         │                 │  │ - checkedSteps: []   │
         └─────────────────┘  └──────────────────────┘
                   │                    │
                   └──────────┬─────────┘
                              ▼
         ┌──────────────────────────────────────────┐
         │  Enable screen wake lock (nosleep.js)    │
         │  → Screen stays on during cooking        │
         └──────────────────────────────────────────┘
                              ▼
         ┌──────────────────────────────────────────┐
         │  Render cooking UI:                      │
         │  - Recipe title                          │
         │  - Servings, prep/cook time              │
         │  - Progress bar (% completion)           │
         │  - Ingredients (collapsible sections)    │
         │    → Checkbox for each ingredient        │
         │  - Steps (collapsible sections)          │
         │    → Checkbox for each step              │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  User checks/unchecks ingredient         │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  toggleIngredientChecked(                │
         │    sessionId,                            │
         │    ingredientId,                         │
         │    currentCheckedIngredients             │
         │  )                                       │
         │  (cooking-sessions.ts:100)               │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  Update Firestore:                       │
         │  - If checked: add to checkedIngredients │
         │  - If unchecked: remove from array       │
         │  - Update lastUpdatedAt timestamp        │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  Re-render UI:                           │
         │  - Update checkboxes                     │
         │  - Recalculate progress bar:             │
         │    (checkedIng + checkedSteps) /         │
         │    (totalIng + totalSteps) * 100         │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  Same flow for step checkboxes:          │
         │  toggleStepChecked(...)                  │
         │  (cooking-sessions.ts:116)               │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  Session persists in Firestore           │
         │  → User can leave and resume anytime     │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  View all active sessions:               │
         │  /cotture-in-corso page                  │
         │  - Shows all recipes with active sessions│
         │  - Displays progress % for each          │
         │  - Click to resume cooking               │
         └──────────────────────────────────────────┘
                              │
                              ▼
         ┌──────────────────────────────────────────┐
         │  Optional: Delete session                │
         │  (when recipe is finished or abandoned)  │
         │  deleteCookingSession(sessionId)         │
         └──────────────────────────────────────────┘
```

**State Synchronization:**

- Real-time updates via Firestore (not using listeners in current implementation)
- Manual refetch on component mount
- Optimistic UI updates (checkbox state changes immediately, then syncs to Firestore)

---

### Category Management Flow

```
Create Category:
  User clicks "➕ Nuova Categoria"
    → Fill form (name, icon, color)
    → createCategory(userId, data)
    → Firestore addDoc() with order = max(existing orders) + 1
    → Category appears in list

AI-Suggested Category (during recipe extraction):
  AI suggests new category name
    → createCategoryIfNotExists(userId, name)
    → Check if category exists (case-insensitive)
      → If exists: Return existing ID
      → If not:
        → Auto-generate icon (pattern matching)
        → Auto-generate color (hash-based)
        → createCategory(userId, { name, icon, color, order })
        → Return new ID
    → Use categoryId in recipe document

Delete Category:
  User clicks delete (🗑️)
    → Check if category has recipes (count query)
      → If has recipes: Show error (cannot delete)
      → If no recipes:
        → deleteCategory(categoryId, userId)
        → Delete all subcategories
        → Delete category document
```

---

## Key Features & Components

### 1. Recipe Management System

**Overview**: Complete CRUD operations for managing personal recipes with rich metadata and structured ingredients/steps.

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `RecipeForm` | `src/components/recipe/recipe-form.tsx` | Create/edit recipe form with section management |
| `RecipeCard` | `src/components/recipe/recipe-card.tsx` | Recipe preview card in list view |
| `RecipeDetail` | `src/components/recipe/recipe-detail.tsx` | Full recipe display |
| `CategorySelector` | `src/components/recipe/category-selector.tsx` | Category/subcategory picker |
| `SeasonSelector` | `src/components/recipe/season-selector.tsx` | Season selection with icons |
| `IngredientListCollapsible` | `src/components/recipe/ingredient-list-collapsible.tsx` | Grouped ingredient display |
| `StepsListCollapsible` | `src/components/recipe/steps-list-collapsible.tsx` | Numbered steps with sections |

**Features:**

1. **Sectioned Ingredients & Steps**
   - Ingredients organized by section (e.g., "Per la pasta", "Per il sugo")
   - Steps grouped by preparation phase
   - Collapsible sections for better mobile UX
   - Section order preserved from PDF extraction

2. **Rich Metadata**
   ```typescript
   {
     title: string;
     description?: string;
     servings?: number;
     prepTime?: number;        // minutes
     cookTime?: number;        // minutes
     difficulty?: 'facile' | 'media' | 'difficile';
     categoryId?: string;
     subcategoryId?: string;
     season?: Season;
     tags: string[];
     notes?: string;
   }
   ```

3. **Source Tracking**
   ```typescript
   source?: {
     type: 'manual' | 'url' | 'pdf';
     url?: string;
     name?: string;
   }
   ```

4. **Filtering & Search** (Phase 1)
   - Filter by category dropdown (with count)
   - Filter by subcategory dropdown (cascading)
   - Filter by season buttons (🌸 ☀️ 🍂 ❄️ 🌍)
   - Combined filters (category + subcategory + season)
   - Real-time count updates

**Pages:**

- `/ricette` - Recipe list with filters
- `/ricette/new` - Create new recipe
- `/ricette/[id]` - View recipe details
- `/ricette/[id]/edit` - Edit existing recipe
- `/ricette/[id]/cooking` - Cooking mode (see below)

**Service Layer:**

`src/lib/firebase/firestore.ts`:
- `createRecipe(userId, recipeData)`
- `getRecipe(recipeId, userId)`
- `getUserRecipes(userId)`
- `updateRecipe(recipeId, updates)`
- `deleteRecipe(recipeId)`

---

### 2. AI Recipe Extractor

**Overview**: Automated recipe extraction from PDF files using Claude AI 4.5 with intelligent categorization and seasonal classification.

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `RecipeExtractorUpload` | `src/components/recipe/recipe-extractor-upload.tsx` | PDF upload UI (drag & drop) |
| `ExtractedRecipePreview` | `src/components/recipe/extracted-recipe-preview.tsx` | Preview card with AI suggestions |
| `parseExtractedRecipes()` | `src/lib/utils/recipe-parser.ts` | Markdown → ParsedRecipe[] |
| `getAISuggestionForRecipe()` | `src/lib/utils/recipe-parser.ts` | Fetch AI category/season suggestions |

**API Endpoints:**

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/extract-recipes` | POST | PDF → Claude → Markdown text |
| `/api/suggest-category` | POST | Recipe data → Claude → Category + Season |

**Features:**

1. **PDF Processing**
   - Max file size: 4.4MB (Vercel limit)
   - Format: application/pdf with selectable text
   - Native PDF support via Claude API (no OCR needed)
   - Comprehensive extraction prompt (107 lines, highly detailed)

2. **Multi-Recipe Extraction**
   - Extracts **all** recipes from a single PDF
   - Handles recipe collections and cookbooks
   - Preserves original structure and section names
   - Equipment extraction → moved to notes

3. **Intelligent Parsing**

   `src/lib/utils/recipe-parser.ts` features:

   | Function | Purpose |
   |----------|---------|
   | `parseExtractedRecipes()` | Main parser entry point |
   | `parseRecipeSection()` | Parse single recipe from markdown |
   | `parseIngredientLine()` | Extract name + quantity |
   | `parseTimeToMinutes()` | Convert "2 ore 30 min" → 150 |
   | `capitalizeSectionName()` | Normalize "per la pasta" → "Per la pasta" |
   | `toTitleCase()` | Convert "PATATE AL FORNO" → "Patate al forno" |
   | `extractEquipmentFromSteps()` | Move equipment info to notes |

4. **AI Category Suggestion**

   Claude analyzes:
   - Recipe title
   - Ingredient list
   - User's existing categories

   Returns:
   ```typescript
   {
     categoryName: string;     // Existing or new category
     season: Season;           // Based on seasonal ingredients
     isNewCategory: boolean;   // true if category doesn't exist
   }
   ```

5. **Seasonal Classification**

   Built-in Italian seasonal ingredient database:

   ```typescript
   const ITALIAN_SEASONAL_INGREDIENTS = {
     primavera: ['asparagi', 'carciofi', 'fave', 'piselli', ...],
     estate: ['pomodori', 'melanzane', 'zucchine', 'peperoni', ...],
     autunno: ['zucca', 'funghi', 'castagne', 'radicchio', ...],
     inverno: ['cavolo nero', 'cavolfiore', 'finocchi', 'agrumi', ...]
   };
   ```

   AI considers:
   - Ingredient seasonality
   - Italian culinary traditions
   - Recipe characteristics

6. **User Review & Override**
   - Preview all extracted recipes
   - Edit category name (✏️ inline editing)
   - Change season (5 buttons with icons)
   - Select which recipes to save (checkboxes)
   - Batch save or save individually
   - AI suggestions marked with "✨ Suggerito da AI" badge

**User Flow:**

```
Upload PDF → Claude extracts recipes → Parse markdown → AI suggests category/season
  → User reviews → (Optional) Edit suggestions → Select recipes → Save to Firestore
```

**Error Handling:**

- File too large (>4.4MB): Suggest compression tools (iLovePDF)
- Invalid PDF: Clear error message
- AI failure: Graceful degradation (user can manually categorize)
- Parsing error: Skip problematic recipe, continue with others

---

### 3. Advanced Cooking Mode

**Overview**: Interactive cooking experience with progress tracking, screen wake lock, and session persistence.

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `CookingModePage` | `src/app/(dashboard)/ricette/[id]/cooking/page.tsx` | Main cooking interface |
| `IngredientListCollapsible` | (with checkboxes) | Interactive ingredient checklist |
| `StepsListCollapsible` | (with checkboxes) | Interactive step checklist |

**Service Layer:**

`src/lib/firebase/cooking-sessions.ts`:
- `getCookingSession(recipeId, userId)`
- `createCookingSession(recipeId, userId)`
- `updateCookingSession(sessionId, updates)`
- `toggleIngredientChecked(sessionId, ingredientId, current[])`
- `toggleStepChecked(sessionId, stepId, current[])`
- `getUserCookingSessions(userId)` - for "Cotture in Corso" page

**Features:**

1. **Screen Wake Lock**
   - Uses `nosleep.js` library
   - Prevents screen from sleeping during cooking
   - Auto-disabled when leaving cooking mode
   - Critical for hands-free cooking

2. **Progress Tracking**

   Session data structure:
   ```typescript
   {
     id: string;
     recipeId: string;
     userId: string;
     checkedIngredients: string[];  // Array of ingredient IDs
     checkedSteps: string[];        // Array of step IDs
     startedAt: Timestamp;
     lastUpdatedAt: Timestamp;
   }
   ```

   Progress calculation:
   ```typescript
   const progress =
     (checkedIngredients.length + checkedSteps.length) /
     (totalIngredients + totalSteps) * 100;
   ```

3. **Real-Time State Sync**
   - Every checkbox change updates Firestore
   - `lastUpdatedAt` timestamp auto-updated
   - Optimistic UI (immediate checkbox state change)
   - Session persists across page reloads

4. **Resumable Sessions**
   - Sessions stored in Firestore `cooking_sessions` collection
   - View all active cooking sessions: `/cotture-in-corso`
   - Resume from any device
   - Progress percentage displayed (e.g., "45% completato")

5. **Cooking-Optimized UI**
   - Large touch targets (mobile-friendly)
   - Clear visual hierarchy
   - Collapsible sections to reduce scrolling
   - Read-from-distance typography
   - Minimal distractions

**Pages:**

- `/ricette/[id]/cooking` - Cooking mode interface
- `/cotture-in-corso` - Dashboard of active cooking sessions

---

### 4. Category System

**Overview**: Flexible, user-customizable category and subcategory system with auto-creation and smart defaults.

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `CategoriesPage` | `src/app/(dashboard)/categorie/page.tsx` | Category management UI |
| `CategorySelector` | `src/components/recipe/category-selector.tsx` | Category/subcategory picker for forms |

**Service Layer:**

`src/lib/firebase/categories.ts`:

| Function | Purpose |
|----------|---------|
| `initializeDefaultCategories(userId)` | Create 5 default categories for new users |
| `getUserCategories(userId)` | Fetch all user categories (ordered) |
| `createCategory(userId, data)` | Create new category |
| `createCategoryIfNotExists(userId, name)` | Smart category creation (AI feature) |
| `updateCategory(categoryId, updates)` | Update category name/icon/color |
| `deleteCategory(categoryId, userId)` | Delete category + subcategories |
| `createSubcategory(userId, categoryId, name, order)` | Add subcategory |
| `getCategorySubcategories(categoryId, userId)` | Fetch subcategories |

**Features:**

1. **Default Categories** (created on user registration)

   ```typescript
   const DEFAULT_CATEGORIES = [
     { name: 'Primi piatti', icon: '🍝', color: '#FF6B6B', order: 1 },
     { name: 'Secondi piatti', icon: '🥩', color: '#4ECDC4', order: 2 },
     { name: 'Contorni', icon: '🥗', color: '#95E1D3', order: 3 },
     { name: 'Dolci', icon: '🍰', color: '#F38181', order: 4 },
     { name: 'Antipasti', icon: '🧀', color: '#FFA07A', order: 5 },
   ];
   ```

2. **Auto-Generation for AI-Suggested Categories**

   `createCategoryIfNotExists()` logic:
   - Check if category exists (case-insensitive match)
   - If exists: Return existing category ID
   - If not exists:
     - Generate icon via pattern matching:
       ```typescript
       const iconMap = {
         'primi': '🍝', 'secondi': '🥩', 'dolci': '🍰',
         'zupp': '🍲', 'pizza': '🍕', 'insalat': '🥗',
         'pane': '🥖', 'pesce': '🐟', 'carne': '🥩',
         // ... default: '🍽️'
       };
       ```
     - Generate color via hash function:
       ```typescript
       const colors = [
         '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#FFA07A',
         '#45B7D1', '#F7DC6F', '#BB8FCE', '#F8B739', '#52C41A'
       ];
       // Hash category name → consistent color
       ```
     - Create category with auto order

3. **Subcategories**
   - Nested under parent categories
   - Own ordering system
   - Cascading delete (deleting category deletes subcategories)
   - Used for granular classification

4. **Category Management UI**
   - Create/edit/delete categories
   - Emoji picker for icons
   - Color picker for visual organization
   - Reorder categories (drag & drop - future)
   - Cannot delete categories with associated recipes

**Data Structure:**

```typescript
interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;           // Emoji
  color?: string;          // Hex color
  order: number;           // Display order
  isDefault: boolean;      // true for initial 5 categories
  createdAt: Timestamp;
}

interface Subcategory {
  id: string;
  categoryId: string;      // Parent category
  userId: string;
  name: string;
  order: number;
  createdAt: Timestamp;
}
```

---

### 5. Seasonal Classification System

**Overview**: AI-powered seasonal classification based on Italian culinary traditions and ingredient seasonality.

**Key Components:**

| Component | Location | Responsibility |
|-----------|----------|----------------|
| `SeasonSelector` | `src/components/recipe/season-selector.tsx` | 5-button season picker with icons |
| Season Filters | `src/app/(dashboard)/ricette/page.tsx` | Filter recipes by season |
| `ITALIAN_SEASONAL_INGREDIENTS` | `src/app/api/extract-recipes/route.ts` | Seasonal ingredient database |

**Features:**

1. **Seasonal Types**

   ```typescript
   type Season =
     | 'primavera'        // 🌸 Spring
     | 'estate'           // ☀️ Summer
     | 'autunno'          // 🍂 Autumn
     | 'inverno'          // ❄️ Winter
     | 'tutte_stagioni';  // 🌍 All seasons
   ```

2. **Italian Seasonal Ingredient Database**

   Curated lists of traditional Italian seasonal ingredients:

   | Season | Example Ingredients |
   |--------|-------------------|
   | Primavera | asparagi, carciofi, fave, piselli, fragole, agretti, rucola |
   | Estate | pomodori, melanzane, zucchine, peperoni, basilico, pesche, melone |
   | Autunno | zucca, funghi, castagne, radicchio, cavolo, uva, pere, mele |
   | Inverno | cavolo nero, cavolfiore, finocchi, agrumi, cime di rapa, porri |

3. **AI Seasonal Suggestion**

   When extracting recipes from PDF, Claude analyzes:
   - Primary ingredients in the recipe
   - Matches against seasonal database
   - Considers Italian culinary traditions
     - Example: "pasta al forno" tends to be winter
     - Example: "insalata di pomodori" is summer

   Logic:
   ```
   If recipe has season-specific ingredients → use that season
   If ingredients are from multiple seasons → "tutte_stagioni"
   If ingredients available year-round → "tutte_stagioni"
   ```

4. **Season Selector UI**

   5 large buttons with:
   - Season icon (🌸 ☀️ 🍂 ❄️ 🌍)
   - Season name (localized Italian)
   - Active state styling
   - Optional "✨ Suggerito da AI" badge

5. **Season Filtering**

   Recipe list page (`/ricette`):
   - Horizontal button row with counts
   - Example: "☀️ Estate (12)"
   - Click to filter recipes
   - Combined with category/subcategory filters
   - Real-time count updates

6. **Benefits for Users**
   - Cook seasonally (better taste, lower cost)
   - Plan meals based on season
   - Discover seasonal recipes
   - Align with Italian culinary calendar
   - Filter out inappropriate recipes (e.g., skip winter soups in summer)

**Data Model:**

```typescript
interface Recipe {
  // ... other fields
  season?: Season;         // Optional season classification
  aiSuggested?: boolean;   // true if AI suggested category/season
}
```

**Integration Points:**

- Recipe creation form (manual selection)
- Recipe edit form (can change season)
- AI extractor (auto-suggestion)
- Recipe list (filtering)
- Recipe card (season badge display)
- Recipe detail (season metadata)

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run export` | Build and export static site |

---

## Git Workflow

- **Main Branch**: `main` (production-ready code)
- **Feature Branches**: `feature/*` or `claude/*` for AI-assisted development
- **Commit Convention**: Descriptive messages focusing on "why" over "what"

---

## Additional Resources

- **README.md**: User-facing documentation with installation and usage guides
- **AGENTS.md**: AI coding guidelines and conventions for AI-assisted development
- **docs/**: Design documents (DD1, DD2, DD3) with detailed feature specifications
- **Firebase Console**: [https://console.firebase.google.com/](https://console.firebase.google.com/)
- **Anthropic Console**: [https://console.anthropic.com/](https://console.anthropic.com/)

---

*This is a living document. It will be updated as the project evolves.*
