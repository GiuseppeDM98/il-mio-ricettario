# Session Notes - 2025-12-29

## Obiettivo Sessione
Ottimizzazione navigazione mobile con bottom navigation (portrait) e hamburger menu (landscape). Desktop mantiene sidebar laterale.

## Contesto Iniziale
- Stato progetto: Phase 1 MVP - Production Ready (v0.1.0)
- Navigazione attuale: Sidebar desktop (≥768px md), Hamburger menu mobile (<768px)
- Riferimento: Implementazione altra app con pattern max-lg:portrait: e max-lg:landscape:

---

## Requisiti Utente

### Logica Responsive
1. **Mobile Portrait (<1024px + portrait)**: Bottom navigation (4 tab fissi)
2. **Mobile Landscape (<1024px + landscape)**: Hamburger menu (sidebar a scomparsa)
3. **Desktop (≥1024px)**: Sidebar laterale sempre visibile

### Breakpoint Decisione
- **Soglia desktop vs mobile**: `lg` (1024px) invece di `md` (768px)
- Tablet landscape (768-1024px) sarà trattato come mobile

### Bottom Navigation (Mobile Portrait)
- **4 Tab fissi**:
  1. "Le mie ricette" (Book icon) → `/ricette`
  2. "Cotture in corso" (Flame icon) → `/cotture-in-corso`
  3. "Nuova Ricetta" (PlusCircle icon) → `/ricette/new`
  4. "Altro" (MoreHorizontal icon) → Apre Sheet dal basso

### Menu "Altro" (Sheet dal basso)
- **Contenuto**:
  - Categorie → `/categorie`
  - ✨ Estrattore AI → `/estrattore-ricette`
- **UI**: Sheet slide-in-from-bottom (stile iOS/Android moderno)

### Icone Scelte (lucide-react)
- Book (Ricette)
- Flame (Cotture)
- PlusCircle (Nuova)
- MoreHorizontal (Altro - 3 dots orizzontali)

---

## Timeline Sviluppo

### [Exploration Phase] - Navigazione Attuale
**Cosa**: Esplorato struttura navigazione esistente
**Risultati**:
- Header.tsx: Hamburger + Logo + Logout
- Sidebar.tsx: 5 voci, w-64 fixed, nascosta su mobile (hidden md:block)
- MobileNav.tsx: Sheet slide-left, solo mobile (md:hidden)
- Footer.tsx: Copyright centered
- Dashboard layout: flex col/row con sidebar nascosta su mobile

**Pattern attuali**:
- Breakpoint principale: md (768px)
- Sheet Radix UI per mobile nav
- usePathname() per active route detection
- Nessuno state globale per nav (tutto local)

---

## Decisioni Tecniche

### Breakpoint Change: md → lg
**Decisione**: Cambiare breakpoint principale da `md` (768px) a `lg` (1024px)
**Motivazione**:
- Tablet landscape (768-1024px) beneficia di bottom nav invece che sidebar desktop
- Consistente con riferimento altra app
- Più spazio per contenuto principale su tablet

**Impatto**:
- Sidebar: `hidden md:block` → `hidden lg:block`
- MobileNav: `md:hidden` → `lg:hidden` (ma sarà sostituito con bottom nav + hamburger)
- Main content padding: Rivedere breakpoint `sm:` `lg:` invece di `sm:` `md:`

### Pattern max-lg:portrait: e max-lg:landscape:
**Decisione**: Usare varianti di orientamento limitate solo a mobile
**Pattern**:
```tsx
// Bottom Nav - SOLO Mobile Portrait
className="lg:hidden max-lg:portrait:flex max-lg:landscape:hidden"

// Hamburger + Sidebar - SOLO Mobile Landscape
className="lg:hidden max-lg:landscape:block max-lg:portrait:hidden"

// Sidebar Desktop - Sempre visibile ≥1024px
className="lg:relative lg:translate-x-0"
```

**Motivazione**:
- Previene conflitti con desktop (monitor landscape non trigger landscape variant)
- Separation of concerns per device type
- Pattern provato nell'altra app

### Nuovo Componente: BottomNavigation.tsx
**Decisione**: Creare nuovo componente `src/components/layout/bottom-navigation.tsx`
**Responsabilità**:
- Render 4 tab fissi in barra bottom
- Fixed position: `fixed bottom-0 inset-x-0`
- Active state detection con usePathname()
- Gestione click su "Altro" → apre MoreSheet

**Struttura**:
```tsx
<nav className="lg:hidden max-lg:portrait:flex max-lg:landscape:hidden">
  <button>Ricette</button>
  <button>Cotture</button>
  <button>Nuova</button>
  <button onClick={openMoreSheet}>Altro</button>
</nav>
```

### Nuovo Componente: MoreSheet.tsx
**Decisione**: Creare componente per menu "Altro"
**Location**: `src/components/layout/more-sheet.tsx`
**Responsabilità**:
- Sheet Radix UI con side="bottom"
- Contenuto: Lista voci (Categorie, Estrattore AI)
- Chiusura automatica al click su voce

**Struttura**:
```tsx
<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="bottom">
    <Link href="/categorie">Categorie</Link>
    <Link href="/estrattore-ricette">✨ Estrattore AI</Link>
  </SheetContent>
</Sheet>
```

### Modifica MobileNav per Landscape Only
**Decisione**: MobileNav diventa attivo SOLO su landscape
**Pattern**:
```tsx
// MobileNav trigger in Header
<div className="lg:hidden max-lg:landscape:block max-lg:portrait:hidden">
  <MobileNav />
</div>
```

### Padding Main Content per Bottom Nav
**Decisione**: Aggiungere padding-bottom su portrait mobile per evitare sovrapposizione
**Pattern**:
```tsx
<main className="flex-1 p-4 sm:p-6 lg:p-8 max-lg:portrait:pb-20">
  {children}
</main>
```
**Motivazione**: Bottom nav è fixed, quindi serve spazio per evitare che copra contenuto

---

## Componenti da Modificare

### 1. src/components/layout/header.tsx
- Hamburger menu: Visibile solo su `max-lg:landscape:` (non su portrait)
- Pattern: `lg:hidden max-lg:landscape:block max-lg:portrait:hidden`

### 2. src/components/layout/sidebar.tsx
- Desktop: Sempre visibile `lg:block`
- Mobile landscape: Fixed con toggle state
- Mobile portrait: Nascosta completamente
- Pattern: `lg:relative lg:translate-x-0 max-lg:landscape:fixed max-lg:portrait:hidden`

### 3. src/components/layout/mobile-nav.tsx (Rename → LandscapeNav?)
- Attivo SOLO su landscape mobile
- Mantiene Sheet side="left"
- Rimosso `md:hidden` → Uso pattern orientation-based

### 4. src/app/(dashboard)/layout.tsx
- Aggiornare wrapper sidebar
- Aggiungere BottomNavigation component
- Aggiornare padding main content per bottom nav

### 5. NUOVO: src/components/layout/bottom-navigation.tsx
- 4 tab fissi con icone
- Fixed bottom position
- Active state styling
- Handler per "Altro"

### 6. NUOVO: src/components/layout/more-sheet.tsx
- Sheet dal basso
- 2 voci: Categorie + Estrattore AI
- Slide-in-from-bottom animation

---

## Pattern & Convenzioni

### Pattern Orientation-Based
- **Critical**: Usare `max-lg:` prefix per limitare orientation variants solo a mobile
- **Portrait**: `max-lg:portrait:flex` (bottom nav)
- **Landscape**: `max-lg:landscape:block` (hamburger + sidebar)
- **Desktop**: `lg:block` (sidebar sempre visibile)

### Active Route Detection
- Continuare a usare `usePathname()` hook
- Active state styling: `bg-primary-100 text-primary-700`
- Applicare sia a bottom nav che sidebar/landscape nav

### Icone Lucide React
- Book, Flame, PlusCircle, MoreHorizontal
- Size: `size={20}` per bottom nav (mobile friendly)
- Size: `size={18}` per sidebar (come attuale)

### Accessibility
- aria-label su tutti i button nav
- SheetTitle + SheetDescription (sr-only) su MoreSheet
- Keyboard navigation (Radix UI built-in)

---

## TODO & Refactoring

### Implementation Order
1. Creare BottomNavigation component
2. Creare MoreSheet component
3. Aggiornare Header (hamburger only landscape)
4. Aggiornare Sidebar (pattern orientation)
5. Aggiornare Dashboard layout (integrare bottom nav + padding)
6. Aggiornare MobileNav (rename? o solo pattern change)
7. Testing su device fisici (iOS/Android/Tablet)

### Refactoring Considerations
- **MobileNav naming**: Confuso se ora è solo per landscape. Rename a `LandscapeNav`?
- **Sidebar state management**: Desktop no state, landscape con toggle state (già presente)
- **Route active detection**: Funzione helper shared tra components?

### Future Enhancements (Post-implementation)
- Animazioni transizione orientation change
- Swipe gestures su MoreSheet
- Badge notifications su tab bottom nav (es. numero cotture attive)
- Dark mode compatibility (già presente nel theme)

---

## Blocchi & Workaround

### Potenziali Issues
1. **Orientation change flash**: Breve flash quando device ruota. Mitigato con CSS transitions.
2. **Tablet edge cases**: Device 1024px esatti potrebbero comportarsi ambiguamente. Testare iPad Pro.
3. **Bottom nav z-index**: Assicurarsi che non copra modal/dialog. Z-index layer: `z-50`.

### Testing Strategy
- Test responsive su Chrome DevTools (device toolbar)
- Test fisico su iPhone (portrait/landscape)
- Test fisico su iPad (landscape dovrebbe avere bottom nav fino a 1024px)
- Test desktop (sidebar sempre visibile)

---

## Note Implementation

### Critical Files
- `/src/components/layout/bottom-navigation.tsx` (NEW)
- `/src/components/layout/more-sheet.tsx` (NEW)
- `/src/components/layout/header.tsx` (MODIFY)
- `/src/components/layout/sidebar.tsx` (MODIFY)
- `/src/components/layout/mobile-nav.tsx` (MODIFY - pattern change)
- `/src/app/(dashboard)/layout.tsx` (MODIFY)

### Dependencies
- Nessuna nuova dipendenza richiesta
- Lucide-react già presente (Book, Flame, PlusCircle, MoreHorizontal icons)
- Radix UI Sheet già in uso (MobileNav)
- Tailwind CSS già configurato con orientamento variants

---

*Session in progress - Updated: 2025-12-29*
