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

*(To be completed in Phase 2)*

### High-Level Architecture

- **Rendering Strategy**: Server-side rendering (SSR) + Static generation where possible
- **State Management**: React Context (AuthProvider) + local component state
- **Data Fetching**: Firebase SDK (real-time listeners)
- **Authentication**: Firebase Auth with session management
- **Authorization**: Firestore security rules (server-side)

### Key Architectural Decisions

1. **App Router over Pages Router**: Leveraging Next.js 14 App Router for better performance
2. **Firebase over custom backend**: Faster development, built-in security, real-time capabilities
3. **AI on server-side**: Anthropic API calls from Next.js API routes to protect API keys
4. **Mobile-first responsive**: Tailwind breakpoints starting from mobile
5. **Text-only focus**: No image uploads in Phase 1 to simplify storage and focus on content

---

## Data Flow

*(To be completed in Phase 2)*

### Authentication Flow
### Recipe CRUD Flow
### AI Extraction Flow
### Cooking Session Flow

---

## Key Features & Components

*(To be completed in Phase 3)*

### 1. Recipe Management
### 2. AI Recipe Extractor
### 3. Cooking Mode
### 4. Category System
### 5. Seasonal Classification

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
