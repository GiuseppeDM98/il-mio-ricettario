# ✅ Fine Sessione di Sviluppo

Sessione completata! È tempo di consolidare tutto il lavoro fatto aggiornando la documentazione per i futuri AI agents.

---

## STEP 1 - ANALISI COMPLETA

Leggi attentamente **`SESSION_NOTES.md`** per avere il quadro completo della sessione:

- ✅ Cosa è stato implementato
- 🎯 Decisioni tecniche prese
- 🐛 Bug risolti e come
- 📦 Dipendenze aggiunte
- 💡 Pattern e best practices applicate
- ⚠️ Problemi incontrati e workaround
- 📋 TODO e refactoring identificati

**Questo è il materiale grezzo che userai per aggiornare la documentazione permanente.**

---

## STEP 2 - AGGIORNA `CLAUDE.md`

Questo file contiene lo **stato corrente del progetto** e deve riflettere la situazione **DOPO** questa sessione.

### Sezioni da aggiornare:

#### 📊 Stato Corrente del Progetto
- Versione/milestone attuale
- Funzionalità completate oggi
- Stato di completamento generale (%)
- Ultime modifiche significative

#### 🏗️ Architettura
- Modifiche alla struttura del progetto
- Nuovi moduli/componenti aggiunti
- Relazioni e dipendenze tra componenti
- Diagrammi o schemi (se rilevanti)

#### ✨ Funzionalità Implementate
- Lista delle feature completate oggi
- Endpoint/API aggiunti o modificati
- Interfacce utente nuove o modificate
- Integrazioni con servizi esterni

#### 🎯 Decisioni Tecniche
- Scelte architetturali importanti
- **Rationale**: Perché questa soluzione invece di alternative
- Trade-off considerati
- Riferimenti a discussioni o issue (se esistono)

#### 🛠️ Stack Tecnologico
- Tecnologie e framework utilizzati (con versioni)
- Nuove dipendenze aggiunte e loro scopo
- Strumenti di sviluppo e build
- Servizi esterni integrati

#### ⚠️ Known Issues
- **CRITICI**: Problemi che bloccano funzionalità importanti
- **NON CRITICI**: Bug minori o limitation note
- Workaround temporanei attivi
- Link a issue tracker (se disponibile)

#### 📋 Prossimi Step
- Task prioritari per la prossima sessione
- Refactoring necessari
- Miglioramenti identificati
- Feature in backlog

---

## STEP 3 - AGGIORNA `AGENTS.md`

Questo file contiene **come lavorare** su questo progetto. È la guida operativa per gli AI agents.

### Sezioni da aggiornare:

#### 📏 Pattern e Convenzioni di Codice
- Naming conventions (file, variabili, funzioni)
- Struttura delle cartelle e organizzazione
- Comment style e documentazione inline
- Code style specifico del progetto
```python
# Esempio:
# ✅ CORRETTO: user_service.py
# ❌ SBAGLIATO: UserService.py, userservice.py
```

#### 🔧 Setup e Configurazioni
- Prerequisiti di sistema (OS, runtime, tools)
- Procedure di installazione step-by-step
- Variabili d'ambiente necessarie
- File di configurazione da creare/modificare
```bash
# Esempio comando setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 🚫 Errori Comuni da Evitare
**Questa sezione è CRITICA** - ogni errore risolto oggi va documentato qui!

```markdown
### [Nome Errore/Problema]
**Sintomo**: Come si manifesta
**Causa**: Perché succede
**Soluzione**: Come risolverlo
**Prevenzione**: Come evitarlo in futuro

Esempio:
### Circular Import Error in Services
**Sintomo**: ImportError quando si avvia l'app
**Causa**: user_service importa order_service e viceversa
**Soluzione**: Usare import locali dentro le funzioni o dependency injection
**Prevenzione**: Mantenere dipendenze unidirezionali: models ← services ← controllers
```

#### 💼 Contesto Business/Dominio
- Logica di business specifica
- Termini del dominio e loro significato
- Regole e vincoli applicativi
- User stories o casi d'uso principali

#### ⚡ Comandi e Workflow
- Comandi comuni (build, test, run, deploy)
- Pipeline CI/CD (se configurata)
- Procedure di release
- Script utility disponibili

```bash
# Development
npm run dev          # Avvia dev server con hot reload
npm run test         # Esegue test suite
npm run lint         # Controlla code style

# Production
npm run build        # Crea build di produzione
npm run start        # Avvia in modalità produzione
```

#### 🧪 Testing
- Framework di test utilizzati
- Come eseguire i test
- Come scrivere nuovi test
- Coverage attuale e obiettivi

---

## STEP 4 - VERIFICA E CLEANUP

### Verifica Completezza
Assicurati che CLAUDE.md e AGENTS.md:
- [ ] Siano aggiornati con TUTTE le info rilevanti da SESSION_NOTES.md
- [ ] Non contengano informazioni obsolete
- [ ] Siano chiari e concisi (usa bullet points)
- [ ] Contengano esempi pratici dove utile
- [ ] Siano pronti per essere letti da un nuovo AI agent

### Cleanup
- [ ] Rivedi SESSION_NOTES.md per verificare di non aver dimenticato nulla
- [ ] **ELIMINA** SESSION_NOTES.md (non serve più, tutto è stato trasferito)
- [ ] Fai commit delle modifiche a CLAUDE.md e AGENTS.md con messaggio descrittivo

```bash
# Esempio commit
git add CLAUDE.md AGENTS.md
git commit -m "docs: update AI documentation after [feature/bugfix] session"
```

---

## ⚡ LINEE GUIDA DI SCRITTURA

### ✅ BEST PRACTICES
- **Concisione**: Vai al punto, evita verbosità
- **Bullet points**: Meglio di paragrafi lunghi
- **Esempi pratici**: Code snippets > descrizioni astratte
- **Specificità**: "Usa FastAPI 0.104+" > "Usa framework moderno"
- **Azionabilità**: Ogni info deve essere utile per prossimi agent

### ❌ DA EVITARE
- Informazioni ridondanti tra CLAUDE.md e AGENTS.md
- Dettagli implementativi troppo granulari (quelli stanno nel codice)
- Opinioni personali senza motivazione tecnica
- Informazioni che diventano rapidamente obsolete
- Copiare/incollare tutto SESSION_NOTES.md senza filtrare

---

## 📊 TEMPLATE MESSAGGIO FINALE

Dopo aver completato tutti gli step, comunica all'utente:

```markdown
✅ **Sessione Completata e Documentata**

📝 **Modifiche alla documentazione:**
- CLAUDE.md: [lista modifiche principali]
- AGENTS.md: [lista modifiche principali]

🎯 **Principali risultati:**
- [Funzionalità 1 implementata]
- [Bug X risolto]
- [Configurazione Y aggiunta]

📋 **Prossimi step suggeriti:**
1. [Task prioritario 1]
2. [Task prioritario 2]

⚠️ **Known issues aperti:**
- [Issue 1 - workaround attivo]

🗑️ SESSION_NOTES.md è stato eliminato (info trasferite in CLAUDE.md e AGENTS.md)
```

---

**✨ Documentazione completata! Il progetto è pronto per la prossima sessione.**
