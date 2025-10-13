# 🍝 Il Mio Ricettario

**Il ricettario digitale intelligente che cresce con te - dalla ricetta alle tecniche, dal privato alla community**

Un'app web moderna per organizzare, catalogare e condividere le tue ricette preferite, con funzionalità AI per importare ricette da PDF e migliorare la tua esperienza culinaria.

> 💡 **Design Philosophy**: Un ricettario pulito e text-based, senza immagini. Il focus è sul contenuto - ingredienti, procedimenti e tecniche - per un'esperienza veloce e funzionale in cucina.

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)

---

## ✨ Features

### Phase 1 - MVP (In Sviluppo)
- ✅ **Autenticazione sicura** - Email/Password + Google OAuth
- ✅ **Gestione ricette completa** - CRUD con ingredienti e passaggi dettagliati
- ✅ **Mobile-first** - Design responsive ottimizzato per smartphone
- ✅ **Modalità cooking** - Schermo sempre acceso durante la preparazione
- ✅ **Ricettario pulito** - Focus sul contenuto, senza distrazioni visive

### Phase 2 - Advanced Features (Roadmap)
- 🎯 **Categorie personalizzabili** - Crea le tue categorie e sottocategorie
- 🎯 **Note tecniche** - Salva tecniche di cucina (dry brining, cottura ibrida, ecc.)
- 🎯 **Collegamenti intelligenti** - Collega tecniche alle ricette che le utilizzano
- 🎯 **Ricerca avanzata** - Cerca per titolo, ingredienti, categoria, difficoltà
- 🎯 **Filtri multipli** - Combina filtri per trovare la ricetta perfetta
- 🎯 **Import da URL** - Importa ricette da siti come GialloZafferano

### Phase 3 - AI Magic (Roadmap)
- 🚀 **Import PDF con AI** - Estrai automaticamente ricette da PDF usando Claude AI
- 🚀 **Auto-categorizzazione** - L'AI suggerisce la categoria giusta
- 🚀 **Miglioramento ricette** - Aggiungi tempi e difficoltà automaticamente
- 🚀 **Batch import** - Importa multiple ricette da un singolo PDF

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework con App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS

### Backend & Services
- **[Firebase Authentication](https://firebase.google.com/docs/auth)** - Gestione utenti
- **[Cloud Firestore](https://firebase.google.com/docs/firestore)** - Database NoSQL
- **[Firebase Hosting](https://firebase.google.com/docs/hosting)** - Hosting web app

### AI & ML (Phase 3)
- **[Anthropic Claude API](https://www.anthropic.com/)** - Estrazione intelligente da PDF

---

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+ installato
- Account Firebase (gratuito)
- Git

### 1. Clone del Repository

```bash
git clone https://github.com/tuousername/il-mio-ricettario.git
cd il-mio-ricettario
```

### 2. Installazione Dipendenze

```bash
npm install
```

### 3. Setup Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuovo progetto
3. Abilita **Authentication** (Email/Password + Google)
4. Abilita **Firestore Database**
5. Copia le credenziali del progetto

### 4. Configurazione Ambiente

Crea un file `.env.local` nella root del progetto:

```bash
cp .env.example .env.local
```

Modifica `.env.local` con le tue credenziali Firebase:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Security Rules

```bash
# Installa Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inizializza Firebase nel progetto
firebase init

# Deploy delle security rules
firebase deploy --only firestore:rules
```

### 6. Avvia in Locale

```bash
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000) nel browser.

### 7. Build & Deploy

```bash
# Build per produzione
npm run build

# Deploy su Firebase Hosting
firebase deploy --only hosting
```

---

## 📁 Struttura del Progetto

```
il-mio-ricettario/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Pagine autenticazione
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # App principale
│   │   │   ├── ricette/       # Gestione ricette
│   │   │   ├── tecniche/      # Note tecniche (Phase 2)
│   │   │   └── categorie/     # Gestione categorie (Phase 2)
│   │   └── api/               # API routes (Phase 3)
│   ├── components/
│   │   ├── ui/                # Componenti base
│   │   ├── auth/              # Componenti autenticazione
│   │   ├── recipe/            # Componenti ricette
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── firebase/          # Firebase SDK
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   └── context/           # React Context
│   └── types/
│       └── index.ts           # TypeScript types
├── firebase/
│   ├── firestore.rules        # Security rules Firestore
│   ├── storage.rules          # Security rules Storage
│   └── firestore.indexes.json # Firestore indexes
├── public/                    # Static assets
├── docs/                      # Design documents
│   ├── DD1-foundation-mvp.md
│   ├── DD2-advanced-features.md
│   └── DD3-ai-magic.md
└── package.json
```

---

## 🎯 Roadmap

### Q1 2025 - Phase 1: MVP
- [x] Project setup
- [x] Firebase configuration
- [x] Authentication (Email + Google)
- [ ] Recipe CRUD
- [ ] Mobile-responsive UI
- [ ] Deploy on Firebase Hosting

### Q2 2025 - Phase 2: Advanced Features
- [ ] Custom categories & subcategories
- [ ] Cooking techniques notes
- [ ] Recipe-technique linking
- [ ] Advanced search & filters
- [ ] URL import
- [ ] Tags system

### Q3 2025 - Phase 3: AI Magic
- [ ] PDF recipe extraction with Claude AI
- [ ] Auto-categorization
- [ ] Recipe enhancement
- [ ] Batch import
- [ ] OCR for images (optional)

### Future
- [ ] Social features (sharing, following)
- [ ] Meal planning
- [ ] Shopping lists
- [ ] Native mobile app
- [ ] Recipe collections
- [ ] Nutrition information

---

## 📚 Documentation

I design documents completi si trovano nella cartella `/docs`:

- **[DD1 - Foundation & MVP Core](./docs/DD1-foundation-mvp.md)** - Setup base e funzionalità core
- **[DD2 - Advanced Features](./docs/DD2-advanced-features.md)** - Categorie, ricerca, tecniche
- **[DD3 - AI Magic](./docs/DD3-ai-magic.md)** - Import PDF e funzionalità AI

---

## 🧪 Testing

```bash
# Linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Manual Testing Checklist

Vedi [Testing Strategy](./docs/DD1-foundation-mvp.md#testing-strategy) nel DD1.

---

## 🔒 Security

- **Firestore Security Rules** - Solo gli utenti possono accedere ai propri dati
- **Environment Variables** - Credenziali mai committate nel repo
- **Firebase Authentication** - Gestione sicura delle sessioni

⚠️ **Non committare mai il file `.env.local`**

---

## 🤝 Contributing

Questo è un progetto personale, ma feedback e suggerimenti sono benvenuti!