# 🍝 Il Mio Ricettario

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Il ricettario digitale intelligente che cresce con te - dalla ricetta alle tecniche, dal privato alla community**

Un'applicazione web moderna per organizzare, catalogare e condividere le tue ricette preferite, con **funzionalità AI integrate** per estrarre automaticamente ricette da PDF e una modalità cooking avanzata con tracciamento del progresso.

> 💡 **Design Philosophy**: Un ricettario pulito e text-based, senza immagini. Il focus è sul contenuto - ingredienti, procedimenti e tecniche - per un'esperienza veloce e funzionale in cucina.

---

## ✨ Caratteristiche Principali

### 🔐 Autenticazione Sicura
- Login con Email/Password
- Google OAuth integration
- Gestione sessioni con Firebase Auth
- Dati privati isolati per utente

### 📖 Gestione Ricette Completa
- **CRUD completo**: Crea, visualizza, modifica, elimina ricette
- **Ingredienti sezionati**: Organizza ingredienti in sezioni (es. "Per la pasta", "Per il condimento")
- **Step di preparazione**: Passaggi numerati con sezioni opzionali
- **Metadati ricchi**: Porzioni, tempo di preparazione, tempo di cottura, difficoltà
- **Categorie personalizzabili**: Sistema di categorie e sottocategorie con emoji e colori

### 📱 Mobile-First Design
- Design responsive ottimizzato per smartphone
- Layout adattivo per desktop con sidebar
- Navigazione mobile con floating button
- Touch-friendly UI per uso in cucina

### 👨‍🍳 Modalità Cooking Avanzata
- **Schermo sempre acceso** durante la preparazione (via nosleep.js)
- **Tracciamento progresso in tempo reale**: checkbox per ingredienti e step completati
- **Sessioni salvate in Firestore**: riprendi la preparazione da dove ti sei fermato
- **Progress bar visuale** con statistiche ingredienti/step completati
- Vista ottimizzata per seguire la ricetta step-by-step
- Layout pulito e leggibile anche da lontano

### 🤖 Estrattore AI di Ricette ✨ (IMPLEMENTATO)
- **Import automatico da PDF** con Claude AI 4.5 (Anthropic)
- **Supporto PDF multipagina**: estrae automaticamente TUTTE le ricette presenti nel documento
- **Parser intelligente** con preservazione struttura originale (sezioni ingredienti/procedimento)
- **Anteprima editabile**: controlla e modifica ogni ricetta prima di salvare
- **Normalizzazione automatica**: tempi convertiti in minuti, sezioni capitalizzate
- **Salvataggio selettivo**: scegli quali ricette salvare o salva tutto in batch
- **API endpoint dedicato**: `/api/extract-recipes` con validazione file (max 4.4MB, limite Vercel)
- **Gestione PDF grandi**: suggerimenti automatici per compressione con servizi esterni (iLovePDF, Adobe Online)

### 📋 Cotture in Corso (IMPLEMENTATO)
- **Dashboard dedicata** per visualizzare tutte le preparazioni attive
- **Progress tracking dettagliato**: vedi a che punto sei con ogni ricetta
- **Checkbox interattive**: spunta ingredienti e step man mano che li completi
- **Ripresa sessioni**: continua le preparazioni interrotte in qualsiasi momento
- **Statistiche live**: ingredienti/step completati vs totali con percentuale progresso

### 🎯 Roadmap Features

**Phase 2 - Advanced Features** (Pianificato)
- Ricerca avanzata per titolo, ingredienti, categoria
- Filtri multipli combinabili
- Import ricette da URL (GialloZafferano, etc.)
- Note tecniche di cucina (dry brining, cottura ibrida, etc.)
- Collegamenti intelligenti tra tecniche e ricette
- Auto-categorizzazione AI delle ricette estratte

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework con App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS con design system HSL

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives (Dialog, Toast, Sheet)
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[class-variance-authority](https://cva.style/)** - Component variant styling

### Backend & Services
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Gestione utenti (Email + Google OAuth)
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - Database NoSQL real-time
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Hosting statico con CDN
- **[Anthropic Claude API](https://docs.anthropic.com/)** - AI per estrazione ricette da PDF (Claude 4.5 Sonnet)

### Development Tools
- **[Jest](https://jestjs.io/)** - Testing framework
- **[Testing Library](https://testing-library.com/)** - React component testing
- **[ESLint](https://eslint.org/)** - Linting
- **[Zod](https://zod.dev/)** - Schema validation

### Utilities
- **[uuid](https://www.npmjs.com/package/uuid)** - ID generation per ingredienti/steps
- **[nosleep.js](https://github.com/richtr/NoSleep.js)** - Screen wake lock per cooking mode
- **[react-hot-toast](https://react-hot-toast.com/)** - Toast notifications

---

## 📋 Prerequisiti

- **Node.js** 18.0.0 o superiore
- **npm** o **yarn**
- **Git**
- **Account Firebase** (piano gratuito disponibile)
- **Anthropic API Key** (per funzionalità estrattore AI) - [Ottieni qui](https://console.anthropic.com/)
- (Opzionale) **Firebase CLI** per deployment

---

## 🚀 Installazione

### 1. Clone del Repository

```bash
git clone https://github.com/GiuseppeDM98/il-mio-ricettario.git
cd il-mio-ricettario
```

### 2. Installazione Dipendenze

```bash
npm install
```

Se da visual studio code si riceve un errore per l'esecuzione di alcuni comandi, eseguire questo
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### 3. Setup Firebase

#### a) Crea un progetto Firebase
1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca "Add project" e segui la procedura guidata
3. Nome progetto: `il-mio-ricettario` (o altro nome)

#### b) Abilita servizi necessari

**Authentication:**
1. Vai su Authentication → Get started
2. Abilita "Email/Password" sign-in method
3. Abilita "Google" sign-in method (configura OAuth consent screen se richiesto)

**Firestore Database:**
1. Vai su Firestore Database → Create database
2. Scegli modalità "Production" (le security rules sono già preparate)
3. Seleziona location (es. `europe-west3` per EU)

#### c) Ottieni credenziali Firebase
1. Vai su Project Settings (⚙️) → General
2. Scorri fino a "Your apps" → Seleziona Web (</> icon)
3. Registra l'app con un nickname
4. Copia le credenziali Firebase config

### 4. Configurazione Ambiente

Crea un file `.env.local` nella root del progetto:

```bash
cp .env.example .env.local
```

Modifica `.env.local` con le tue credenziali Firebase e Anthropic:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=il-mio-ricettario.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=il-mio-ricettario
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=il-mio-ricettario.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Anthropic AI Configuration (per estrattore ricette)
ANTHROPIC_API_KEY=sk-ant-api03-...
```

⚠️ **IMPORTANTE**:
- Non committare mai il file `.env.local`. È già incluso in `.gitignore`.
- La chiave `ANTHROPIC_API_KEY` è usata solo lato server (API route) e NON deve avere il prefisso `NEXT_PUBLIC_`.

### 5. Deploy Firebase Security Rules

Installa Firebase CLI se non l'hai già:

```bash
npm install -g firebase-tools
```

Autenticati:

```bash
firebase login
```

Inizializza Firebase nel progetto:

```bash
firebase init
```

Seleziona:
- ☑️ Firestore (Rules e Indexes)
- ☑️ Hosting (se vuoi fare deploy)

Quando richiesto:
- Firestore rules file: `firebase/firestore.rules` (già presente)
- Firestore indexes file: `firebase/firestore.indexes.json` (già presente)
- Public directory: `out` (per Next.js export) o `build`

Deploy delle security rules:

```bash
# Deploy Firestore rules
firebase deploy --only firestore:rules
```

Verifica che l'output mostri successo:
```
✔  firestore: deployed rules firestore.rules successfully
```

### 6. Avvia il Server di Sviluppo

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

Dovresti vedere la pagina di login. Crea un account per iniziare!

---

## 💻 Utilizzo

### Registrazione e Login

1. **Primo accesso**: Vai su `/register` e crea un account
   - Email/Password oppure
   - Login rapido con Google
2. Alla registrazione, vengono create automaticamente 5 categorie default:
   - 🍝 Primi piatti
   - 🥩 Secondi piatti
   - 🥗 Contorni
   - 🍰 Dolci
   - 🧀 Antipasti

### Creare una Ricetta

```typescript
// Esempio struttura dati ricetta
{
  title: "Pasta alla Carbonara",
  description: "Il classico romano autentico",
  servings: 4,
  prepTime: 10,  // minuti
  cookTime: 15,  // minuti
  categoryId: "primi-piatti-id",
  difficulty: "media",
  ingredients: [
    { id: "1", name: "Guanciale", quantity: "150g", section: "Ingredienti base" },
    { id: "2", name: "Pecorino Romano", quantity: "80g", section: "Ingredienti base" },
    { id: "3", name: "Uova", quantity: "4 tuorli + 1 intero", section: "Per la crema" },
  ],
  steps: [
    {
      id: "1",
      order: 1,
      description: "Taglia il guanciale a listarelle e rosolalo in padella",
      section: "Preparazione"
    },
    {
      id: "2",
      order: 2,
      description: "Mescola uova e pecorino in una ciotola",
      section: "Crema"
    },
  ]
}
```

#### Step-by-step UI:

1. Clicca su "➕ Nuova Ricetta" nella homepage
2. Compila i campi:
   - **Titolo** (obbligatorio)
   - **Descrizione** (opzionale)
   - **Categoria/Sottocategoria** (selettori a cascata)
   - **Porzioni, Tempo prep, Tempo cottura**
3. **Ingredienti**:
   - Aggiungi sezioni con "➕ Aggiungi Sezione" (es. "Per la pasta", "Per il sugo")
   - Ogni sezione può contenere N ingredienti
   - Ogni ingrediente ha nome + quantità
4. **Preparazione**:
   - Aggiungi step numerati
   - Ogni step può avere un titolo di sezione (opzionale)
5. Clicca "Crea Ricetta"

### Modalità Cooking

1. Apri una ricetta
2. Clicca su "👨‍🍳 Inizia a Cucinare"
3. Lo schermo rimane acceso automaticamente
4. Vista ottimizzata:
   - Ingredienti raggruppati per sezione (collapsible) con checkbox
   - Step numerati e sezionati con checkbox
   - Tempi e porzioni in evidenza
   - Progress bar con percentuale completamento
5. La sessione viene salvata automaticamente in Firestore
6. Riprendi da "📋 Cotture in Corso" in qualsiasi momento

### Estrattore AI di Ricette

1. Vai su "✨ Estrattore AI" dal menu
2. Carica un file PDF contenente ricette (max 4.4MB)
3. L'AI di Claude analizza il PDF ed estrae automaticamente le ricette
4. Controlla le ricette estratte:
   - Ogni ricetta viene presentata in anteprima
   - Ingredienti organizzati per sezioni
   - Step di preparazione numerati
   - Metadati (porzioni, tempi) già parsati
5. Modifica se necessario (opzionale)
6. Salva singolarmente o tutte in batch
7. Le ricette vengono aggiunte al tuo ricettario con source type "pdf"

💡 **Tips per migliori risultati**:
- PDF ben strutturati con sezioni chiare
- Testo selezionabile (non solo immagini scansionate)
- Ricette con format tradizionale (ingredienti → procedimento)
- PDF fino a 4.4MB supportati (limite Vercel)

⚠️ **Limite dimensione file**:
- Se il PDF supera 4.4MB, usa un servizio di compressione gratuito:
  - [iLovePDF](https://www.ilovepdf.com/it/comprimere_pdf) (consigliato)
  - Adobe Acrobat Online
  - Smallpdf

### Gestire Categorie

1. Vai su "🏷️ Categorie" dalla sidebar
2. **Creare categoria**:
   - Clicca "➕ Nuova Categoria"
   - Scegli emoji, nome, colore
3. **Creare sottocategoria**:
   - Espandi una categoria
   - Clicca "➕ Aggiungi Sottocategoria"
4. **Modificare/Eliminare**:
   - Usa i button di edit (✏️) o delete (🗑️)
   - ⚠️ Non puoi eliminare categorie default con ricette associate

---

## ⚙️ Configurazione

### File di Configurazione

#### `next.config.js`
```javascript
{
  output: 'standalone',        // Per deployment ottimizzato
  images: { unoptimized: true }, // No Next.js image optimization
  redirects: [
    { source: '/', destination: '/ricette', permanent: true }
  ]
}
```

#### `tailwind.config.ts`
Design system con HSL color tokens:
```typescript
{
  primary: '#ef4444',    // Red theme
  secondary: '#6b7280',  // Gray theme
  // ... altri token semantici
}
```

#### `firebase/firestore.rules`
Security rules basate su ownership:
```
// Regola base per tutte le collection
allow read, write: if request.auth != null
                   && resource.data.userId == request.auth.uid
```

### Variabili d'Ambiente

| Variabile | Descrizione | Esempio | Visibilità |
|-----------|-------------|---------|------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` | Client + Server |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth domain | `app.firebaseapp.com` | Client + Server |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `il-mio-ricettario` | Client + Server |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket | `app.appspot.com` | Client + Server |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Sender ID | `123456789` | Client + Server |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | `1:123:web:abc` | Client + Server |
| `ANTHROPIC_API_KEY` | Anthropic API key per Claude | `sk-ant-api03-...` | Solo Server |

⚠️ **NOTE**:
- Tutte le variabili Firebase devono avere prefisso `NEXT_PUBLIC_` per essere accessibili nel client
- `ANTHROPIC_API_KEY` NON deve avere il prefisso `NEXT_PUBLIC_` (usata solo nelle API routes server-side)

---

## 🔧 Sviluppo

### Setup Ambiente di Sviluppo

```bash
# Clona e installa
git clone https://github.com/GiuseppeDM98/il-mio-ricettario.git
cd il-mio-ricettario
npm install

# Crea .env.local con credenziali Firebase
cp .env.example .env.local

# Avvia dev server con hot reload
npm run dev
```

### Struttura del Progetto

```
il-mio-ricettario/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── api/                      # API Routes (Server-side)
│   │   │   └── extract-recipes/     # Endpoint AI per estrazione ricette
│   │   │       └── route.ts         # POST /api/extract-recipes
│   │   ├── (auth)/                   # Route group: autenticazione
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/              # Route group: app principale
│   │   │   ├── layout.tsx           # Layout con Header/Sidebar/Footer
│   │   │   ├── ricette/
│   │   │   │   ├── page.tsx         # Lista ricette
│   │   │   │   ├── new/page.tsx     # Crea ricetta
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx     # Dettaglio ricetta
│   │   │   │       ├── edit/page.tsx
│   │   │   │       └── cooking/page.tsx  # Modalità cooking
│   │   │   ├── categorie/page.tsx
│   │   │   ├── cotture-in-corso/page.tsx  # Dashboard cotture attive
│   │   │   └── estrattore-ricette/page.tsx # UI estrattore AI
│   │   ├── layout.tsx               # Root layout (AuthProvider)
│   │   └── page.tsx                 # Home (redirect)
│   │
│   ├── components/
│   │   ├── ui/                      # Componenti base (Button, Input, Card, etc.)
│   │   ├── auth/                    # Auth-related components
│   │   │   ├── auth-form.tsx
│   │   │   └── protected-route.tsx
│   │   ├── recipe/                  # Recipe-specific components
│   │   │   ├── recipe-form.tsx      # Form con gestione sezioni
│   │   │   ├── recipe-card.tsx
│   │   │   ├── recipe-detail.tsx
│   │   │   ├── ingredient-list-collapsible.tsx
│   │   │   ├── steps-list-collapsible.tsx
│   │   │   ├── category-selector.tsx
│   │   │   ├── recipe-extractor-upload.tsx  # UI upload PDF
│   │   │   └── extracted-recipe-preview.tsx # Anteprima ricetta estratta
│   │   └── layout/                  # Layout components
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       ├── footer.tsx
│   │       └── mobile-nav.tsx
│   │
│   ├── lib/
│   │   ├── firebase/                # Firebase services layer
│   │   │   ├── config.ts           # Firebase init
│   │   │   ├── auth.ts             # Auth helpers
│   │   │   ├── firestore.ts        # Recipe CRUD
│   │   │   ├── categories.ts       # Categories CRUD + defaults
│   │   │   ├── cooking-sessions.ts # Sessioni cottura CRUD
│   │   │   └── storage.ts          # File upload (futuro)
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.ts          # Re-export da auth-context
│   │   │   ├── useRecipes.ts       # Fetch ricette user
│   │   │   └── useToast.ts         # Toast notifications
│   │   ├── context/
│   │   │   └── auth-context.tsx    # AuthProvider globale
│   │   └── utils/
│   │       ├── cn.ts               # classnames utility
│   │       ├── validation.ts       # Zod schemas
│   │       ├── formatting.ts       # Time/date formatting
│   │       ├── constants.ts        # App constants
│   │       └── recipe-parser.ts    # Parser markdown → ricette strutturate
│   │
│   └── types/
│       └── index.ts                 # TypeScript types globali
│
├── firebase/
│   ├── firestore.rules              # Security rules (userId-based)
│   └── firestore.indexes.json       # Query indexes
│
├── public/                          # Static assets
├── docs/                            # Design documents
│   ├── DD1-foundation-mvp.md
│   ├── DD2-advanced-features.md
│   └── DD3-ai-magic.md
│
├── .env.local                       # Environment variables (git-ignored)
├── .env.example                     # Template env vars
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── jest.config.js
├── AGENTS.md                        # AI coding guidelines
└── package.json
```

### Convenzioni di Codice

#### Naming
- **React components**: PascalCase (`RecipeForm.tsx`)
- **Hooks/utilities**: camelCase (`useRecipes.ts`, `validation.ts`)
- **Route folders**: kebab-case (`ricette/`, `[id]/`)

#### Import Aliases
```typescript
// Usa sempre alias @/
import { Recipe } from '@/types'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
```

#### TypeScript
- Tutti i types in `src/types/index.ts`
- Usa `interface` per domain models, `type` per utilities
- Evita `any`, usa `unknown` se necessario

#### Styling
- Usa Tailwind utility classes
- Semantic colors: `bg-primary`, `text-muted-foreground`
- Mobile-first: aggiungi breakpoints `sm:`, `md:`, `lg:`
- Usa `cn()` utility per conditional classes:
  ```tsx
  <div className={cn("base-class", isActive && "active-class")} />
  ```

### Build del Progetto

```bash
# Build per produzione (standalone)
npm run build

# Analizza output
ls -lah .next/

# Test build locally
npm run start
```

Output in `.next/standalone/` pronto per deployment.

### Esecuzione dei Test

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- src/components/layout/header.test.tsx
```

#### Scrivere Test

Esempio test component:
```typescript
// src/components/recipe/recipe-card.test.tsx
import { render, screen } from '@testing-library/react'
import { RecipeCard } from './recipe-card'

jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ user: { uid: 'test-user' } })
}))

describe('RecipeCard', () => {
  it('renders recipe title', () => {
    const recipe = {
      id: '1',
      title: 'Test Recipe',
      // ... altri campi
    }

    render(<RecipeCard recipe={recipe} />)
    expect(screen.getByText('Test Recipe')).toBeInTheDocument()
  })
})
```

### Linting e Type Checking

```bash
# ESLint check
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# TypeScript check (no output)
npx tsc --noEmit
```

---

## 🚀 Deployment

### Deploy su Firebase Hosting

#### 1. Build statico (Next.js export)

Modifica `next.config.js`:
```javascript
module.exports = {
  output: 'export',  // Cambia da 'standalone' a 'export'
  // ... resto config
}
```

```bash
# Build e export
npm run build
# Output in /out
```

#### 2. Deploy con Firebase CLI

```bash
# Prima volta: inizializza hosting
firebase init hosting

# Configura:
# - Public directory: out
# - Single-page app: Yes
# - Overwrite index.html: No

# Deploy
firebase deploy --only hosting
```

#### 3. Verifica deployment

```bash
# Output mostrerà:
# ✔  Deploy complete!
# Hosting URL: https://il-mio-ricettario.web.app
```

### Deploy su Vercel (Alternativa)

```bash
# Installa Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deploy
vercel --prod
```

Vercel rileva automaticamente Next.js e configura:
- Environment variables (aggiungi nel dashboard)
- Automatic HTTPS
- Edge functions
- Build cache

### Variabili d'Ambiente in Produzione

**Firebase Hosting**: Crea `firebase.json`:
```json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [{
      "source": "**",
      "headers": [{
        "key": "Cache-Control",
        "value": "public, max-age=3600"
      }]
    }]
  }
}
```

**Vercel**: Aggiungi env vars nel dashboard:
1. Project Settings → Environment Variables
2. Aggiungi tutte le variabili:
   - `NEXT_PUBLIC_FIREBASE_*` (tutte le 6 variabili Firebase)
   - `ANTHROPIC_API_KEY` (per estrattore AI)
3. Select environments: Production, Preview, Development

---

## 🤖 Architettura Estrattore AI

### Flusso di Estrazione (Vercel API Route)

```
1. Selezione PDF (Frontend)
   ↓
2. Validazione client-side (size max 4.4MB, type PDF)
   ↓
3. Upload tramite FormData (Frontend → Vercel API Route)
   │  - POST /api/extract-recipes
   │  - Content-Type: multipart/form-data
   ↓
4. API Route (Server-side Next.js)
   │  a) Validazione (max 4.4MB, tipo PDF)
   │  b) Conversione PDF → Base64
   │  c) Chiamata Claude API (Anthropic)
   │     - Model: claude-sonnet-4-5
   │     - Max tokens: 16000
   │     - Native PDF support
   │     - Prompt strutturato con istruzioni dettagliate
   ↓
5. Risposta Claude (Markdown formattato)
   ↓
6. Return a Frontend con ricette estratte
   ↓
7. Parsing Markdown → ParsedRecipe[] (recipe-parser.ts)
   │  - Estrazione titoli (# headings)
   │  - Parsing sezioni ingredienti (## Ingredienti per...)
   │  - Parsing sezioni procedimento (## Procedimento per...)
   │  - Estrazione metadati (porzioni, tempi)
   │  - Normalizzazione nomi sezioni
   │  - Conversione tempi in minuti
   ↓
8. Anteprima ricette estratte (Frontend)
   ↓
9. Salvataggio selettivo in Firestore
```

**Caratteristiche architettura**:
- ✅ API key Anthropic protetta server-side in API route
- ✅ Nessun setup aggiuntivo richiesto (oltre a Vercel)
- ✅ Architettura semplice e diretta
- ⚠️ Limite body size Vercel: 4.4MB
- 💡 Per PDF più grandi: usare servizi di compressione esterni (iLovePDF)

### Componenti Chiave

#### API Route ([src/app/api/extract-recipes/route.ts](src/app/api/extract-recipes/route.ts))
- **Endpoint**: `POST /api/extract-recipes`
- **Tipo**: Next.js API Route (Server-side)
- **Input**: FormData con PDF file
- **Output**: `{ success: boolean, extractedRecipes: string }`
- **Validazioni**:
  - Autenticazione (richiesta da client autenticato)
  - File type: `application/pdf`
  - Max size: 4.4MB (limite Vercel body size)
- **Security**:
  - API key Anthropic in variabile d'ambiente `ANTHROPIC_API_KEY`
  - Non esposta nel client (solo server-side)
  - Validazione lato server

#### Parser (`src/lib/utils/recipe-parser.ts`)
- **Funzione principale**: `parseExtractedRecipes(markdownText: string): ParsedRecipe[]`
- **Pattern matching**:
  - Separatore ricette: `---\s*---`
  - Titolo ricetta: `# [Nome]`
  - Sezioni ingredienti: `## Ingredienti (per ...)?`
  - Sezioni procedimento: `## Procedimento (per ...)?`
  - Metadati: `**Porzioni:**`, `**Tempo di preparazione:**`
- **Normalizzazioni**:
  - Capitalizzazione sezioni ("per la pasta" → "Per la pasta")
  - Parsing tempi ("2 ore 30 min" → 150 minuti)
  - Generazione UUID per ingredienti/step

#### UI Components
- **RecipeExtractorUpload**: Drag & drop / file picker per PDF
- **ExtractedRecipePreview**: Card anteprima ricetta con edit inline
- **Page**: `/estrattore-ricette` - Orchestrazione completa del flusso

### Prompt Engineering

Il prompt Claude è ottimizzato per:
- **Completezza**: Estrarre TUTTE le ricette (non solo la prima)
- **Struttura**: Preservare sezioni originali
- **Precisione**: Nomi sezioni esatti dal documento
- **Flessibilità**: Gestire formati diversi
- **Robustezza**: Gestire indici, note, suggerimenti

Vedi codice completo in [`src/app/api/extract-recipes/route.ts`](src/app/api/extract-recipes/route.ts).

### Costi e Limiti

**Claude API**:
- Model: `claude-sonnet-4-5`
- Costo ~$3 per 1M input tokens, $15 per 1M output tokens
- 1 PDF tipico (10-20 ricette): ~$0.05-0.15
- Max tokens output: 16000 (configurabile)
- **Limite file**: 4.4MB (limite Vercel)

**Firebase** (Piano gratuito):
- **Firestore**:
  - 20k scritture/giorno gratis
  - 50k letture/giorno gratis
  - Stima: gratis per uso personale

**Vercel**:
- Hosting frontend: Gratis
- API routes: Incluse nel piano gratuito

**Totale stimato per uso moderato**: <$1/mese (principalmente Claude API)

---

## 🧪 Testing Strategy

### Coverage Attuale
- ✅ Component testing configurato (Jest + Testing Library)
- ✅ Esempio test: `src/components/layout/header.test.tsx`
- ⚠️ Coverage limitato (work in progress)

### Testing Roadmap
- [ ] Unit tests per Firebase services (`lib/firebase/`)
- [ ] Integration tests per auth flow
- [ ] E2E tests per recipe CRUD (Playwright/Cypress)
- [ ] Visual regression tests (Chromatic/Percy)

### Mock Firebase in Tests

```typescript
// __mocks__/firebase/config.ts
export const db = {} as any
export const auth = {} as any

// In test file
jest.mock('@/lib/firebase/config')
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  // ... altri mock
}))
```

---

## 🤝 Contribuire

### Workflow

1. **Fork** il repository
2. **Crea un branch** per la tua feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** le modifiche:
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push** al branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Apri una Pull Request**

### Linee Guida

- Segui le convenzioni in [AGENTS.md](AGENTS.md)
- Scrivi test per nuove feature
- Aggiorna la documentazione se necessario
- Usa commit messages descrittivi
- Mantieni il codice TypeScript strict-compliant

### Code Review Checklist

- [ ] TypeScript errors: `npx tsc --noEmit` passa
- [ ] Linting: `npm run lint` passa
- [ ] Tests: `npm test` passa
- [ ] Build: `npm run build` success
- [ ] Firestore rules aggiornate se nuove collections
- [ ] README aggiornato se nuove feature
- [ ] Commenti in inglese (come da AGENTS.md)

---

## 📊 Database Schema

### Firestore Collections

#### `users`
```typescript
{
  uid: string                    // Firebase Auth UID
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### `recipes`
```typescript
{
  id: string                     // Auto-generated
  userId: string                 // Owner UID
  title: string
  description?: string
  categoryId?: string
  subcategoryId?: string
  difficulty?: 'facile' | 'media' | 'difficile'
  tags: string[]
  techniqueIds: string[]         // Phase 2
  source?: {
    type: 'manual' | 'url' | 'pdf'
    url?: string
    name?: string
  }
  ingredients: Ingredient[]      // Array flat con section opzionale
  steps: Step[]
  images: string[]               // URLs (Phase 2)
  servings?: number
  prepTime?: number              // minuti
  cookTime?: number              // minuti
  totalTime?: number             // auto-calcolato
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### `categories`
```typescript
{
  id: string
  userId: string
  name: string
  icon?: string                  // Emoji
  color?: string                 // Hex color
  order: number
  isDefault: boolean             // true per categorie iniziali
  createdAt: Timestamp
}
```

#### `subcategories`
```typescript
{
  id: string
  categoryId: string             // Parent category
  userId: string
  name: string
  order: number
  createdAt: Timestamp
}
```

#### `cooking_sessions`
```typescript
{
  id: string
  recipeId: string               // ID della ricetta in cottura
  userId: string
  checkedIngredients: string[]   // Array di ID ingredienti completati
  checkedSteps: string[]         // Array di ID step completati
  startedAt: Timestamp
  lastUpdatedAt: Timestamp
}
```

#### `techniques` (Phase 2 - Pianificato)
```typescript
{
  id: string
  userId: string
  title: string
  description: string
  content: string                // Markdown/rich text
  type?: 'cottura' | 'preparazione' | 'conservazione' | 'altro'
  tags: string[]
  relatedRecipeIds: string[]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Indexes Necessari

Definiti in `firebase/firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "recipes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "categories",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "order", "order": "ASCENDING" }
      ]
    }
  ]
}
```

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

---

## 🔒 Sicurezza

### Firebase Security Rules

Principio: **Ogni utente vede solo i propri dati**

```javascript
// firebase/firestore.rules
function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}

match /recipes/{recipeId} {
  allow read: if isOwner(resource.data.userId);
  allow create: if isAuthenticated()
                && request.resource.data.userId == request.auth.uid;
  allow update, delete: if isOwner(resource.data.userId);
}
```

### Best Practices

1. **Environment Variables**:
   - Mai committare `.env.local`
   - Usa secrets manager in produzione (Vercel/Firebase)

2. **Firebase API Key**:
   - ✅ Sicuro esporlo in client (è rate-limited)
   - ⚠️ Configura Firebase restrictions nel console:
     - HTTP referrers (per web)
     - IP restrictions (opzionale)

3. **Authentication**:
   - Session cookie gestiti da Firebase Auth
   - Automatic token refresh
   - Protected routes via `ProtectedRoute` component

4. **Firestore**:
   - Sempre validare `userId` nelle queries
   - Rules applicano ownership a livello server
   - Timestamps via `serverTimestamp()` (non modificabili da client)

---

## 🐛 Troubleshooting

### Problemi Comuni

#### 1. "Firebase Auth not initialized"
```bash
# Verifica .env.local
cat .env.local

# Deve contenere tutte le variabili NEXT_PUBLIC_FIREBASE_*
# Riavvia dev server dopo modifica .env
npm run dev
```

#### 2. "Permission denied" in Firestore
```bash
# Verifica che security rules siano deployate
firebase deploy --only firestore:rules

# Verifica che userId sia corretto nelle queries
# Tutte le queries devono filtrare per userId
```

#### 3. "Module not found: @/..."
```bash
# Verifica tsconfig.json paths
cat tsconfig.json | grep "@"

# Dovrebbe mostrare:
# "@/*": ["./src/*"]

# Riavvia TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

#### 4. Build fallisce con TypeScript errors
```bash
# Check errors
npx tsc --noEmit

# Common fix: update types
npm install --save-dev @types/node@latest @types/react@latest

# Verifica strict mode in tsconfig.json
```

#### 5. Tailwind classes non applicate
```bash
# Verifica tailwind.config.ts content paths
# Deve includere tutti i file .tsx

# Force rebuild
rm -rf .next
npm run dev
```

#### 6. "Invalid hook call" in test
```typescript
// Mock sempre i context/hooks usati nel component
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({ user: mockUser, loading: false })
}))

// Oppure wrappa component con provider
render(
  <AuthProvider>
    <ComponentUnderTest />
  </AuthProvider>
)
```

#### 7. Estrattore AI non funziona / "API key not configured"
```bash
# Verifica che ANTHROPIC_API_KEY sia in .env.local
cat .env.local | grep ANTHROPIC

# Deve mostrare:
# ANTHROPIC_API_KEY=sk-ant-api03-...

# Verifica che NON abbia il prefisso NEXT_PUBLIC_
# ❌ WRONG: NEXT_PUBLIC_ANTHROPIC_API_KEY
# ✅ CORRECT: ANTHROPIC_API_KEY

# Riavvia il server dopo aver aggiunto la chiave
npm run dev
```

#### 8. PDF troppo grande o estrazione fallita
```bash
# Limiti attuali:
# - Max dimensione file: 4.4MB (limite Vercel body size)
# - Formato supportato: PDF con testo selezionabile
# - PDF scansionati (solo immagini) potrebbero non funzionare bene

# Se il PDF supera 4.4MB:
# 1. Usa servizi di compressione gratuiti:
#    - iLovePDF: https://www.ilovepdf.com/it/comprimere_pdf (consigliato)
#    - Adobe Acrobat Online
#    - Smallpdf
# 2. La compressione solitamente riduce del 30-60% senza perdita qualità
# 3. Riprova il caricamento dopo la compressione

# Per PDF scansionati, considera di:
# 1. Usare OCR esterno prima
# 2. Convertire in PDF con testo
# 3. Estrarre manualmente
```

### Log e Debug

```typescript
// Enable Firebase debug logs
import { setLogLevel } from 'firebase/firestore'
setLogLevel('debug')

// React dev tools
// Installa extension: React Developer Tools

// Network tab
// Ispeziona chiamate Firestore in browser DevTools → Network
// Filtra per "firestore.googleapis.com"
```

---

## 📚 Risorse

### Documentazione
- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Design Documents (cartella `/docs`)
- **[DD1 - Foundation & MVP](docs/DD1-foundation-mvp.md)** - Setup base e funzionalità core
- **[DD2 - Advanced Features](docs/DD2-advanced-features.md)** - Categorie, ricerca, tecniche
- **[DD3 - AI Magic](docs/DD3-ai-magic.md)** - Import PDF e funzionalità AI

### AI Coding Guidelines
- **[AGENTS.md](AGENTS.md)** - Linee guida per AI agents, convenzioni, pattern

---

## 📝 Licenza

Questo progetto è rilasciato sotto licenza MIT.

```
Copyright (c) 2025 Giuseppe Di Maio

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🗺️ Roadmap

### Q1 2025 - Phase 1: MVP ✅
- [x] Project setup & Firebase config
- [x] Authentication (Email + Google OAuth)
- [x] Recipe CRUD completo
- [x] Categories system con sottocategorie
- [x] Mobile-responsive UI
- [x] Cooking mode avanzato con tracking progresso
- [x] Sistema cotture in corso (sessioni salvate)
- [x] **Estrattore AI ricette da PDF** (Claude 4.5)
- [x] Parser intelligente markdown → ricette strutturate
- [ ] Deploy su Firebase Hosting/Vercel

### Q2 2025 - Phase 2: Advanced Features
- [ ] Advanced search & filters
  - [ ] Full-text search (Algolia o Firestore search)
  - [ ] Multi-filter UI (categoria, difficoltà, tempo)
- [ ] URL import
  - [ ] Parser per GialloZafferano
  - [ ] Parser generico con OpenGraph/schema.org
- [ ] Technique notes system
  - [ ] CRUD tecniche
  - [ ] Rich text editor (TipTap/Slate)
  - [ ] Link tecniche → ricette
- [ ] Tags system
  - [ ] Tag autocomplete
  - [ ] Tag cloud visualization

### Q3 2025 - Phase 3: AI Magic Avanzato
- [ ] Miglioramenti estrattore AI
  - [ ] Auto-categorizzazione intelligente ricette
  - [ ] Suggerimenti difficoltà basati su analisi AI
  - [ ] Estrazione da immagini ricette (OCR)
- [ ] Recipe enhancement AI
  - [ ] Suggerimenti tempi ottimali
  - [ ] Correzione/normalizzazione ingredienti
  - [ ] Traduzione ricette
- [ ] Smart features
  - [ ] Suggerimenti ricette simili
  - [ ] Meal planning AI
  - [ ] Generazione varianti ricette

### Future Ideas
- [ ] Social features
  - [ ] Condivisione ricette pubbliche
  - [ ] Following/followers
  - [ ] Community recipe feed
- [ ] Meal planning & shopping lists
- [ ] Nutrition information (API integration)
- [ ] Recipe collections/boards
- [ ] Native mobile app (React Native/Flutter)
- [ ] Voice commands per cooking mode
- [ ] Print-friendly recipe format
- [ ] Recipe scaling (porzioni dinamiche)

---

## 💬 Supporto

### Hai trovato un bug?
Apri una [Issue su GitHub](https://github.com/GiuseppeDM98/il-mio-ricettario/issues) con:
- Descrizione del problema
- Steps per riprodurlo
- Expected vs actual behavior
- Screenshot se applicabile
- Environment (browser, OS, versione app)

### Hai domande?
- Consulta la [Documentazione](docs/)
- Leggi [AGENTS.md](AGENTS.md) per convenzioni di codice
- Controlla [Troubleshooting](#-troubleshooting)

### Vuoi contribuire?
Leggi la sezione [Contribuire](#-contribuire)

---

## 🙏 Acknowledgments

- Design inspirato da app moderne per recipe management
- UI components basati su [shadcn/ui](https://ui.shadcn.com/)
- Firebase team per l'ottimo backend-as-a-service
- Next.js team per il fantastico framework

---

<div align="center">

**Fatto con ❤️ e TypeScript**

[⬆ Torna su](#-il-mio-ricettario)

</div>
