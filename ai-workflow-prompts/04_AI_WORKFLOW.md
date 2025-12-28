# 🤖 AI Workflow - Guida Completa per AI Agents

Questo file è l'**indice di orchestrazione** per tutti gli AI coding agents che lavoreranno su questo progetto.

---

## 📚 Documentazione del Progetto

Questo progetto utilizza un sistema di documentazione strutturato per AI agents:

| File | Scopo | Quando Leggerlo | Quando Aggiornarlo |
|------|-------|-----------------|-------------------|
| **README.md** | Documentazione pubblica del progetto | Primo accesso | Ad ogni release/feature importante |
| **CLAUDE.md** | Stato corrente e architettura | Inizio ogni sessione | Fine ogni sessione |
| **AGENTS.md** | Best practices e workflow operativi | Inizio ogni sessione | Quando si scoprono pattern/errori |
| **SESSION_NOTES.md** | Diario della sessione corrente | Durante sviluppo | In tempo reale durante la sessione |
| **AI_WORKFLOW.md** | Questo file - orchestrazione generale | Primo accesso | Quando il workflow cambia |

---

## 🚀 WORKFLOW COMPLETO

### 🆕 Primo Accesso al Progetto (One-Time Setup)

Se è la tua **prima volta** su questo progetto, segui questo percorso di onboarding:

#### 1️⃣ Leggi `README.md` (5-10 minuti)
**Obiettivo**: Capire cosa fa il progetto

Cerca di rispondere a queste domande:
- [ ] Qual è lo scopo principale del progetto?
- [ ] Quali tecnologie/framework utilizza?
- [ ] Come si installa e si avvia?
- [ ] Quali sono le funzionalità principali?
- [ ] Chi è il target audience?

**Se README non esiste o è molto scarno:**
- Usa il prompt `03_ISTRUZIONI_README_AI.md` per crearlo/migliorarlo
- Questo ti darà anche una comprensione profonda del codebase

#### 2️⃣ Leggi `CLAUDE.md` (3-5 minuti)
**Obiettivo**: Capire lo stato attuale del progetto

Cerca di capire:
- [ ] A che punto è lo sviluppo? (milestone, versione)
- [ ] Quali funzionalità sono già implementate?
- [ ] Quali decisioni tecniche importanti sono state prese?
- [ ] Ci sono known issues o workaround attivi?
- [ ] Quali sono i prossimi step pianificati?

**Se CLAUDE.md non esiste:**
- Crealo con questa struttura base:
```markdown
# Documentazione Progetto - Stato Corrente

## Versione/Milestone
[Da determinare]

## Architettura
[Analizza il codice e descrivi l'architettura]

## Stack Tecnologico
[Lista tecnologie utilizzate]

## Funzionalità Implementate
[Lista feature completate]

## Known Issues
[Lista problemi noti]

## Prossimi Step
[Lista priorità]
```

#### 3️⃣ Leggi `AGENTS.md` (3-5 minuti)
**Obiettivo**: Capire come lavorare su questo progetto

Cerca di capire:
- [ ] Quali sono le convenzioni di codice?
- [ ] Come si esegue il setup dell'ambiente?
- [ ] Quali sono gli errori comuni da evitare?
- [ ] Quali comandi/script utilizzare?
- [ ] Ci sono best practices specifiche?

**Se AGENTS.md non esiste:**
- Crealo analizzando il codice esistente:
```markdown
# Guida Operativa per AI Agents

## Pattern e Convenzioni
[Analizza il codice esistente e documentale]

## Setup Ambiente
[Comandi per setup]

## Comandi Comuni
[Lista comandi utili]

## Errori da Evitare
[Inizialmente vuoto - si popola nel tempo]

## Best Practices
[Pattern osservati nel codice]
```

#### 4️⃣ Esplora il Codebase (10-15 minuti)
Ora che hai il contesto, esplora fisicamente il progetto:

```bash
# Struttura generale
tree -L 2 -I 'node_modules|venv|__pycache__|.git'

# File di configurazione
ls -la | grep -E '\.(json|yaml|yml|toml|ini|env)$'

# Entry points
find . -name "main.*" -o -name "index.*" -o -name "app.*" | head -10
```

Identifica:
- [ ] File di entry point principale
- [ ] Struttura delle cartelle (src/, tests/, config/)
- [ ] File di configurazione (package.json, requirements.txt, etc.)
- [ ] Presenza di tests
- [ ] Scripts utility (Makefile, package.json scripts, etc.)

---

### 🎬 Inizio Nuova Sessione di Sviluppo

Ogni volta che inizi una **nuova sessione di lavoro**, segui questi step:

#### 1️⃣ Usa il Prompt di Inizio Sessione
Utilizza il file `01_PROMPT_INIZIO_SESSIONE.md` che ti guiderà attraverso:

1. **Contestualizzazione**: Lettura CLAUDE.md e AGENTS.md
2. **Setup documentazione**: Creazione SESSION_NOTES.md
3. **Definizione obiettivo**: Cosa vuoi implementare oggi

#### 2️⃣ Verifica Prerequisiti
Prima di codificare:

```markdown
**Checklist pre-sviluppo:**
- [ ] Ho letto CLAUDE.md aggiornato
- [ ] Ho letto AGENTS.md aggiornato  
- [ ] Ho creato SESSION_NOTES.md
- [ ] Ho chiaro l'obiettivo della sessione
- [ ] Ho verificato di avere tutte le dipendenze necessarie
```

#### 3️⃣ Sviluppa con Documentazione Continua
Durante la sessione:

- ✅ Aggiorna SESSION_NOTES.md progressivamente (ogni ~30min)
- 💡 Documenta decisioni tecniche appena prese
- 🐛 Annota bug risolti con causa e soluzione
- ⚠️ Segnala problemi e workaround temporanei
- 📦 Documenta nuove dipendenze aggiunte

**Formato consigliato per SESSION_NOTES.md:**
```markdown
## [HH:MM] - [Area/Funzionalità]
**Cosa**: Breve descrizione della modifica
**Perché**: Motivazione (requisito, bug, refactoring)
**Come**: Approccio tecnico utilizzato
**Note**: Considerazioni, alternative scartate, todo
```

---

### ✅ Fine Sessione di Sviluppo

Quando completi la sessione di lavoro:

#### 1️⃣ Usa il Prompt di Fine Sessione
Utilizza il file `02_PROMPT_FINE_SESSIONE.md` che ti guiderà attraverso:

1. **Analisi**: Lettura completa SESSION_NOTES.md
2. **Aggiornamento CLAUDE.md**: Stato corrente, feature, decisioni
3. **Aggiornamento AGENTS.md**: Pattern, errori, best practices
4. **Cleanup**: Eliminazione SESSION_NOTES.md

#### 2️⃣ Verifica Completezza
Assicurati che:

- [ ] CLAUDE.md riflette lo stato ATTUALE del progetto
- [ ] AGENTS.md contiene tutti i pattern/errori scoperti oggi
- [ ] Non ci sono informazioni critiche perse
- [ ] SESSION_NOTES.md è stato eliminato
- [ ] Hai fatto commit delle modifiche alla documentazione

#### 3️⃣ Commit della Documentazione
```bash
git add CLAUDE.md AGENTS.md [altri file modificati]
git commit -m "docs: update AI documentation - [breve descrizione sessione]"
```

---

## 🔄 Workflow Riassunto Visivo

```
┌─────────────────────────────────────────────────────────┐
│                  PRIMO ACCESSO                           │
│                                                          │
│  README.md → CLAUDE.md → AGENTS.md → Esplora Codebase  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              INIZIO NUOVA SESSIONE                       │
│                                                          │
│  01_PROMPT_INIZIO_SESSIONE.md                           │
│    ├─ Leggi CLAUDE.md                                   │
│    ├─ Leggi AGENTS.md                                   │
│    └─ Crea SESSION_NOTES.md                             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                  SVILUPPO                                │
│                                                          │
│  Codifica + Aggiorna SESSION_NOTES.md in tempo reale    │
│                                                          │
│  Durante: consulta CLAUDE.md e AGENTS.md se necessario  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               FINE SESSIONE                              │
│                                                          │
│  02_PROMPT_FINE_SESSIONE.md                             │
│    ├─ Leggi SESSION_NOTES.md                            │
│    ├─ Aggiorna CLAUDE.md                                │
│    ├─ Aggiorna AGENTS.md                                │
│    ├─ Elimina SESSION_NOTES.md                          │
│    └─ Commit documentazione                             │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    [Nuova Sessione]
```

---

## 🎯 PRINCIPI GUIDA

### 1. Documentazione ≠ Lavoro Aggiuntivo
La documentazione **È PARTE** dello sviluppo, non qualcosa da fare dopo.
- Documenta mentre lavori, non a fine giornata
- SESSION_NOTES.md è il tuo scratch pad in tempo reale

### 2. Privilegia la Chiarezza
- Meglio essere concisi e chiari che verbosi e confusi
- Bullet points > Paragrafi lunghi
- Esempi pratici > Descrizioni astratte

### 3. Pensa al "Te del Futuro"
Documenta come se tra 6 mesi dovessi riprendere questo progetto senza ricordare nulla:
- Cosa avresti voluto sapere?
- Quali errori avresti voluto evitare?
- Quali decisioni avresti voluto capire?

### 4. Il Contesto è Fondamentale
Non documentare solo **cosa** hai fatto, ma:
- **Perché** l'hai fatto (motivazioni)
- **Come** l'hai fatto (approccio tecnico)
- **Cosa** hai considerato e scartato (alternative)

### 5. Mantieni la Documentazione Viva
- README.md: Aggiorna ad ogni release importante
- CLAUDE.md: Aggiorna ad ogni sessione
- AGENTS.md: Aggiorna quando scopri pattern/errori
- I documenti obsoleti sono peggio di nessun documento

---

## 🛠️ File di Supporto

Questo progetto include prompt standardizzati per facilitare il lavoro degli AI agents:

| File | Quando Usarlo | Scopo |
|------|---------------|-------|
| `01_PROMPT_INIZIO_SESSIONE.md` | All'inizio di ogni sessione di sviluppo | Guida setup e contestualizzazione |
| `02_PROMPT_FINE_SESSIONE.md` | Alla fine di ogni sessione di sviluppo | Guida consolidamento documentazione |
| `03_ISTRUZIONI_README_AI.md` | Quando README non esiste o è obsoleto | Guida creazione/aggiornamento README |
| `04_AI_WORKFLOW.md` | Questo file - riferimento generale | Orchestrazione workflow completo |

---

## ❓ FAQ per AI Agents

### Q: Cosa faccio se CLAUDE.md o AGENTS.md non esistono?
**A**: Creali! Usa la struttura base indicata nella sezione "Primo Accesso". È meglio avere una documentazione parziale che nessuna documentazione.

### Q: Devo sempre aggiornare SESSION_NOTES.md?
**A**: Sì, durante lo sviluppo. È il tuo diario di bordo e serve per non perdere informazioni importanti. Alla fine della sessione lo userai per aggiornare CLAUDE.md e AGENTS.md, poi lo eliminerai.

### Q: Cosa succede se trovo informazioni obsolete in CLAUDE.md?
**A**: Segnalalo in SESSION_NOTES.md e aggiorna CLAUDE.md a fine sessione. Durante la sessione, se l'informazione obsoleta blocca il lavoro, chiedi chiarimenti all'utente.

### Q: Quante informazioni devo mettere in AGENTS.md?
**A**: Solo quelle **azionabili** e **riutilizzabili**. Se un errore è capitato una volta sola e non si ripeterà, non documentarlo. Se invece è un pattern ricorrente o un errore facile da commettere, documentalo.

### Q: Posso modificare questo workflow?
**A**: Sì! Se trovi un modo migliore di organizzare la documentazione, proponilo all'utente e aggiorna questo file. Il workflow deve adattarsi al progetto, non viceversa.

### Q: Devo leggere TUTTI i file ogni volta?
**A**: 
- **Primo accesso**: Sì, leggi tutto (README → CLAUDE → AGENTS)
- **Sessioni successive**: Leggi CLAUDE.md e AGENTS.md (rapido, 2-3 min)
- **Durante sviluppo**: Consulta al bisogno
- **README.md**: Solo se cambia o ne hai bisogno per capire qualcosa

---

## ✅ Checklist Rapida

### Prima di Iniziare a Codificare
- [ ] Ho letto/aggiornato CLAUDE.md
- [ ] Ho letto/aggiornato AGENTS.md
- [ ] Ho creato SESSION_NOTES.md
- [ ] Ho chiaro l'obiettivo della sessione

### Durante lo Sviluppo
- [ ] Aggiorno SESSION_NOTES.md progressivamente
- [ ] Documento decisioni tecniche importanti
- [ ] Annoto pattern o errori scoperti

### Alla Fine della Sessione
- [ ] Ho letto completamente SESSION_NOTES.md
- [ ] Ho aggiornato CLAUDE.md con lo stato corrente
- [ ] Ho aggiornato AGENTS.md con pattern/errori
- [ ] Ho eliminato SESSION_NOTES.md
- [ ] Ho fatto commit della documentazione

---

## 🚀 Iniziare Subito

**Se sei un nuovo AI agent su questo progetto:**

1. Leggi questo file (✅ fatto!)
2. Vai alla sezione "Primo Accesso al Progetto"
3. Segui i 4 step di onboarding
4. Sei pronto per iniziare la tua prima sessione!

**Se stai per iniziare una nuova sessione:**

1. Usa `01_PROMPT_INIZIO_SESSIONE.md`
2. Sviluppa documentando in SESSION_NOTES.md
3. Usa `02_PROMPT_FINE_SESSIONE.md` alla fine

---

**✨ Buon lavoro! La documentazione è il tuo alleato, non un ostacolo.**
