# 🚀 Inizio Nuova Sessione di Sviluppo

## STEP 0 - CONTESTUALIZZAZIONE DEL PROGETTO

Prima di scrivere anche solo una riga di codice, **DEVI LEGGERE** i seguenti file per comprendere il contesto:

### 1. Leggi `CLAUDE.md` per:
- ✅ **Stato corrente**: A che punto è il progetto
- 🏗️ **Architettura**: Struttura e organizzazione del codice
- 🛠️ **Stack tecnologico**: Tecnologie, framework, librerie utilizzate
- ⚙️ **Configurazioni**: Setup e dipendenze necessarie
- ⚠️ **Known issues**: Problemi noti e workaround attivi
- 🎯 **Decisioni tecniche**: Scelte architetturali e loro motivazioni
- 📋 **Next steps**: Priorità e sviluppi pianificati

### 2. Leggi `AGENTS.md` per:
- 📏 **Pattern e convenzioni**: Standard di codice da seguire
- 🔧 **Setup e configurazioni**: Procedure di installazione e ambiente
- 🚫 **Errori comuni**: Problemi già risolti e da non ripetere
- 💡 **Best practices**: Approcci consolidati per questo progetto
- 🎯 **Contesto business**: Dominio applicativo e requisiti funzionali
- ⚡ **Workflow**: Comandi specifici e procedure operative

### ⚠️ IMPORTANTE
**Se uno o entrambi questi file non esistono o sono vuoti:**
- Segnalalo immediatamente all'utente
- Chiedi se crearli o se procedere senza
- Se procedi, documenta TUTTO in SESSION_NOTES.md per crearli a fine sessione

---

## STEP 1 - AVVIA DOCUMENTAZIONE IN TEMPO REALE

Crea (o aggiorna se esiste) il file **`SESSION_NOTES.md`** nella root del progetto.

Questo file è il tuo **diario di bordo** della sessione corrente e deve contenere:

### 📝 Template Iniziale
```markdown
# Session Notes - [DATA]

## Obiettivo Sessione
[Descrizione sintetica del task principale]

## Contesto Iniziale
- Stato progetto: [brief da CLAUDE.md]
- Riferimenti: [issue, ticket, richiesta utente]

---

## Timeline Sviluppo
<!-- Aggiorna progressivamente durante la sessione -->

### [HH:MM] - [Area/Funzionalità]
**Cosa**: 
**Perché**: 
**Come**: 
**Note**: 

---

## Decisioni Tecniche
<!-- Scelte importanti con motivazioni -->

---

## Bug Risolti
<!-- Problema → Causa → Soluzione -->

---

## Dipendenze Aggiunte
<!-- Libreria | Versione | Scopo -->

---

## TODO & Refactoring
<!-- Task posticipati o miglioramenti identificati -->

---

## Pattern & Convenzioni
<!-- Nuovi pattern seguiti o modifiche agli esistenti -->

---

## Blocchi & Workaround
<!-- Problemi temporanei e soluzioni provvisorie -->
```

### 🔄 Aggiornamento Continuo

Aggiorna `SESSION_NOTES.md` dopo ogni:
- ✅ Implementazione significativa (~30min di lavoro)
- 🎯 Milestone raggiunta
- 🐛 Bug risolto
- 🔧 Configurazione modificata
- 💡 Pattern o best practice scoperta

**Scrivi in modo conciso ma chiaro** - queste note saranno usate per aggiornare CLAUDE.md e AGENTS.md a fine sessione.

---

## STEP 2 - COMUNICAZIONE E VALIDAZIONE

Durante lo sviluppo:

### ❓ Quando hai dubbi:
- Consulta CLAUDE.md/AGENTS.md per verificare se ci sono già informazioni
- Se le informazioni mancano o sono ambigue, **chiedi conferma all'utente**
- Non fare assunzioni su architettura o convenzioni se non documentate

### 📢 Segnala immediatamente:
- **Informazioni obsolete** in CLAUDE.md o AGENTS.md
- **Conflitti** tra documentazione e codice reale
- **Missing dependencies** non documentate
- **Breaking changes** che impattano l'architettura

### 💡 Documenta subito:
- **Nuove best practices** scoperte durante lo sviluppo
- **Pattern efficaci** che potrebbero essere riutilizzati
- **Errori evitati** che potrebbero essere commessi in futuro

---

## STEP 3 - SVILUPPO ITERATIVO

Ora sei pronto per iniziare lo sviluppo! Ricorda:

1. ✅ Segui i pattern e le convenzioni in AGENTS.md
2. 🔍 Consulta CLAUDE.md per decisioni tecniche pregresse
3. 📝 Documenta progressivamente in SESSION_NOTES.md
4. 💬 Comunica blocchi e dubbi invece di fare assunzioni
5. 🎯 Mantieni focus sull'obiettivo della sessione

---

## 🎯 OBIETTIVO DELLA SESSIONE

**[INSERISCI QUI IL TASK SPECIFICO]**

Esempio:
```
Implementare sistema di autenticazione JWT con:
- Login/logout endpoints
- Middleware di validazione token
- Gestione refresh token
- Test di integrazione
```

---

## 📋 CHECKLIST PRE-SVILUPPO

Prima di iniziare a codificare, verifica:

- [ ] Ho letto CLAUDE.md
- [ ] Ho letto AGENTS.md
- [ ] Ho creato/aggiornato SESSION_NOTES.md
- [ ] Ho compreso l'obiettivo della sessione
- [ ] Ho identificato i file/moduli da modificare
- [ ] Ho verificato eventuali dipendenze necessarie
- [ ] Sono pronto a documentare in tempo reale

---

**✨ Buona sessione di sviluppo!**
