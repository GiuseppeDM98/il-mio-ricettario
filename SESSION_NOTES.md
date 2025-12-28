# Session Notes - 2025-12-28

## Obiettivo Sessione
Implementare 3 miglioramenti alla modalità cottura e aggiungere favicon:
1. Creare favicon adatta alla web app
2. Aggiungere selezione porzioni in modalità cottura con ricalcolo quantità
3. Auto-eliminare cotture completate al 100%

## Contesto Iniziale
- **Stato progetto**: Phase 1 MVP - Production Ready
- **Branch**: `claude/review-project-context-g1vwj`
- **Riferimenti**: Richiesta utente per miglioramenti modalità cottura
- **Stack**: Next.js 14, Firebase, TypeScript, Tailwind CSS
- **Modalità cottura attuale**:
  - Located in `src/app/(dashboard)/ricette/[id]/cooking/page.tsx`
  - Uses `cooking-sessions.ts` service layer
  - Has progress tracking, screen wake lock (nosleep.js)
  - Shows recipe ingredients/steps with checkboxes

---

## Timeline Sviluppo

### [09:00] - Analisi e Pianificazione
**Cosa**: Lettura documentazione e pianificazione task
**Perché**: Comprendere architettura esistente prima di modificare
**Come**: Lettura di CLAUDE.md e AGENTS.md
**Note**:
- Modalità cottura usa CookingSession model in Firestore
- Service layer ben strutturato in `src/lib/firebase/cooking-sessions.ts`
- Componenti collapsible per ingredienti/steps
- Favicon non presente (default Next.js)

### [09:15] - Task 1: Favicon
**Cosa**: Creata favicon SVG per la web app
**Perché**: Migliorare branding e user experience
**Come**:
- Creato `src/app/icon.svg` con design libro + forchetta (tema ricettario)
- Colori: rosso (#ef4444) come primary del brand
- Next.js 14 App Router gestisce automaticamente file icon.svg
- Aggiunto metadata in layout.tsx (title, description, viewport)

### [09:30] - Task 2-3: Modello e Service Layer
**Cosa**: Aggiunto supporto porzioni a CookingSession
**Perché**: Permettere scaling delle quantità in modalità cottura
**Come**:
- Modificato `CookingSession` interface: aggiunto campo `servings?: number`
- Aggiornato `createCookingSession()` per accettare parametro servings
- Usa `null` invece di `undefined` (requisito Firebase)

### [09:45] - Task 4: Utility Scaling
**Cosa**: Creata funzione per scalare quantità ingredienti
**Perché**: Ricalcolare automaticamente quantità in base alle porzioni
**Come**:
- Nuovo file `src/lib/utils/ingredient-scaler.ts`
- Funzione `scaleQuantity()` che gestisce:
  - Numeri semplici: "200g" → "100g" (per 2 porzioni invece di 4)
  - Frazioni: "1/2 tazza" → "1 tazza" (scaling con conversione)
  - Range: "2-3 cucchiai" → "4-6 cucchiai"
  - Quantità non numeriche: "q.b." → invariato
- Supporto per frazioni comuni (1/2, 1/3, 1/4, 2/3, 3/4)
- Formattazione intelligente (decimali → frazioni quando appropriato)

### [10:15] - Task 5: UI Selezione Porzioni
**Cosa**: Implementata UI per selezione porzioni in cooking mode
**Perché**: Permettere all'utente di scegliere quante persone cucina
**Come**:
- Aggiunto state `servings` e `scaledIngredients`
- UI con:
  - Display porzioni originali ricetta
  - Input number con bottoni +/- per selezione
  - Messaggio "quantità adattate automaticamente"
  - Mobile-friendly (flex-col → sm:flex-row)
- useEffect per calcolare ingredienti scalati in real-time
- Handler `handleServingsChange()` per aggiornare session in Firestore
- Ingredienti scalati passati a `IngredientListCollapsible`

### [10:45] - Task 6: Auto-eliminazione Cotture Completate
**Cosa**: Auto-eliminazione sessioni al 100% progress
**Perché**: Pulire automaticamente cotture finite
**Come**:
- Modificato `handleToggleIngredient()` e `handleToggleStep()`
- Calcolo progress: (checkedItems / totalItems)
- Se progress >= 1.0:
  - Chiama `deleteCookingSession(sessionId)`
  - Redirect a `/cotture-in-corso`
- Implementato in entrambi gli handler (ingrediente O step può essere l'ultimo)

---

## Decisioni Tecniche

### 1. Favicon SVG vs PNG
**Decisione**: Usato SVG per favicon
**Motivazione**:
- Scalabile a qualsiasi risoluzione
- File size minimo
- Next.js 14 supporta nativamente icon.svg in app/
- Più facile da modificare/aggiornare

### 2. Scaling Logic in Client vs Server
**Decisione**: Logica di scaling completamente client-side
**Motivazione**:
- Nessuna necessità di API call aggiuntiva
- Instant feedback per l'utente
- Calcoli semplici (solo moltiplicazioni)
- Riduce carico server e latenza

### 3. Auto-eliminazione al 100%
**Decisione**: Eliminare session immediatamente al completamento
**Motivazione**:
- Mantiene database pulito
- Migliora performance (meno query)
- UX migliore (cottura completata = eliminata)
- Redirect automatico impedisce confusione

### 4. Redirect Target dopo Completamento
**Decisione**: Redirect a `/cotture-in-corso` invece di `/ricette`
**Motivazione**:
- Più logico per utente (stava cucinando, torna alle cotture)
- Mostra lista vuota se era l'unica cottura (feedback chiaro)
- Evita confusion ritornando alla ricetta (che non è più in cottura)

---

## Bug Risolti

### Bug 1: Sessioni di cottura duplicate
**Problema**: Quando l'utente entrava in modalità cottura, venivano create DUE sessioni in Firestore:
- Una con 4 porzioni (default originale)
- Una con le porzioni selezionate dall'utente

**Root Cause**: La sessione veniva creata automaticamente nel `useEffect` al caricamento della pagina, e poi veniva aggiornata quando l'utente modificava le porzioni. Questo causava la creazione di una seconda sessione.

**Soluzione**: Implementato setup screen flow
- Quando l'utente entra in modalità cottura, vede prima uno "setup screen"
- User seleziona le porzioni desiderate
- User clicca "Avvia modalità cottura"
- SOLO a quel punto viene creata la sessione con le porzioni corrette
- Se una sessione già esiste (riprendi cottura), salta setup mode

**Risultato**: Una sola sessione creata con le porzioni corrette fin dall'inizio.

---

## Dipendenze Aggiunte

Nessuna nuova dipendenza. Usate solo librerie esistenti:
- `lucide-react` (già presente) - icone Plus, Minus per UI porzioni
- Firebase, Next.js, React - già configurati

---

## TODO & Refactoring

### Completati ✅
- [x] Creare favicon
- [x] Aggiungere campo servings a CookingSession
- [x] Implementare UI selezione porzioni
- [x] Implementare ricalcolo quantità ingredienti
- [x] Auto-eliminazione cotture al 100%
- [x] Fix bug sessioni duplicate (setup screen implementato)

### [11:00] - Bug Fix: Duplicate Sessions
**Cosa**: Risolto bug di sessioni duplicate in modalità cottura
**Perché**: Due sessioni create - una con 4 porzioni, una con porzioni selezionate
**Come**:
- Aggiunto setup screen PRIMA di avviare la cottura
- Setup mode state: `isSetupMode` (boolean)
- Flow modificato:
  1. User entra in modalità cottura → vede setup screen
  2. User seleziona porzioni
  3. User clicca "Avvia modalità cottura"
  4. SOLO ORA viene creata la sessione con le porzioni corrette
- Se sessione già esistente (riprendi cottura) → skip setup, vai diretto a cooking
- Modificato `handleServingsChange()` per NON aggiornare Firestore se in setup mode
- Setup screen UI:
  - Card centered con shadow
  - Titolo + subtitle
  - Servings selector (stile identico a cooking mode)
  - Grande pulsante "👨‍🍳 Avvia modalità cottura"
  - Pulsante "Indietro" per tornare alla ricetta
- Handler `handleStartCooking()`:
  - Crea session con servings selezionate
  - Carica session data
  - Switch da setup mode a cooking mode

### Potenziali Miglioramenti Futuri
- [ ] Testing: Unit tests per `ingredient-scaler.ts` (frazioni, range, edge cases)
- [ ] UX: Toast notification quando cottura completata ("🎉 Ricetta completata!")
- [ ] UX: Animazione smooth quando progress raggiunge 100%
- [ ] Feature: Opzione per salvare sessione invece di auto-eliminare (checkbox?)
- [ ] Feature: Storico cotture completate (con timestamps)
- [ ] Performance: Debounce su handleServingsChange se input cambia rapidamente

---

## Pattern & Convenzioni

### Seguiti dalla codebase esistente:
- ✅ Mobile-first design pattern (flex-col → sm:flex-row)
- ✅ Tutti i commenti in inglese
- ✅ Usare `null` invece di `undefined` per campi opzionali Firebase
- ✅ Service layer pattern per operazioni Firestore
- ✅ TypeScript strict mode con type safety
- ✅ Naming conventions: camelCase per functions, PascalCase per components

### Nuovi pattern introdotti:
- **Scaling utility pattern**: Funzione pura per trasformazioni quantità
- **Real-time calculation**: useEffect per ricalcolare automaticamente dati derivati
- **Auto-cleanup pattern**: Eliminazione automatica risorse completate

---

## Blocchi & Workaround

Nessun blocco riscontrato durante lo sviluppo.

---

## File Modificati

1. **src/app/icon.svg** (nuovo)
   - Favicon SVG dell'applicazione

2. **src/app/layout.tsx**
   - Aggiunto metadata (title, description, viewport)

3. **src/types/index.ts**
   - Aggiunto campo `servings?: number` a `CookingSession`

4. **src/lib/firebase/cooking-sessions.ts**
   - Modificato `createCookingSession()` per accettare servings

5. **src/lib/utils/ingredient-scaler.ts** (nuovo)
   - Utility per scaling quantità ingredienti

6. **src/app/(dashboard)/ricette/[id]/cooking/page.tsx** (MAJOR)
   - Aggiunto UI selezione porzioni
   - Implementato scaling ingredienti in real-time
   - Implementato auto-eliminazione al 100%
   - Aggiunto setup screen prima di avviare cottura
   - Fix bug sessioni duplicate (setup mode flow)
   - Handler `handleStartCooking()` per creare sessione
   - Modificato `handleServingsChange()` per non aggiornare in setup mode

---

## Firestore Schema Changes

### Collection: `cooking_sessions`
**Campo aggiunto**: `servings` (number, optional)

**Esempio documento**:
```json
{
  "id": "abc123",
  "recipeId": "xyz789",
  "userId": "user123",
  "servings": 6,              // ← NUOVO CAMPO
  "checkedIngredients": ["ing1", "ing2"],
  "checkedSteps": ["step1"],
  "startedAt": Timestamp,
  "lastUpdatedAt": Timestamp
}
```

**Backward compatibility**: ✅ Sì
- Campo opzionale (`servings?: number`)
- Sessioni esistenti continuano a funzionare
- Se `servings` non presente, usa default da ricetta (o 4)

