# 📚 Prompt per Analisi Repository e Gestione README.md

## 🎯 Contesto Operativo

**IMPORTANTE**: Prima di procedere, verifica se esiste già un README.md nel repository:

- **Se il README NON esiste**: Creane uno nuovo seguendo tutte le sezioni indicate
- **Se il README ESISTE**: Mantieni la struttura esistente e aggiorna/integra le informazioni, preservando lo stile e il tono originale. Aggiungi sezioni mancanti solo se necessarie e coerenti con il documento esistente.

---

## STEP 0 - PREREQUISITI

Prima di analizzare il repository, verifica se esistono file di documentazione AI:

### Leggi `CLAUDE.md` (se esiste) per:
- Architettura e decisioni tecniche del progetto
- Stack tecnologico utilizzato
- Known issues e workaround
- Stato corrente delle funzionalità

### Leggi `AGENTS.md` (se esiste) per:
- Pattern e convenzioni di codice
- Setup e configurazioni specifiche
- Best practices consolidate
- Workflow e comandi del progetto

**Usa queste informazioni** per arricchire il README con dettagli tecnici accurati e aggiornati.

---

## STEP 1 - ANALISI PRELIMINARE

Esamina il repository in questo ordine:

1. **Struttura base**:
   - Tree delle cartelle e organizzazione file
   - Presenza di documentazione esistente (README, docs/, wiki)

2. **Identificazione tecnologie**:
   - Linguaggio/framework principale (da file sorgente)
   - File di configurazione chiave:
     - Node.js: `package.json`, `tsconfig.json`
     - Python: `requirements.txt`, `pyproject.toml`, `setup.py`
     - Rust: `Cargo.toml`
     - Go: `go.mod`
     - Java: `pom.xml`, `build.gradle`
     - Altri: `Makefile`, `docker-compose.yml`, etc.

3. **Documentazione esistente**:
   - **Se README esiste**: Leggilo attentamente per capire stile, tono e struttura
   - Analizza commenti nel codice
   - Controlla eventuali file docs/ o wiki/

4. **Entry points**:
   - File principale (`main.py`, `index.js`, `main.go`, etc.)
   - Script di avvio
   - Configurazioni di deployment

---

## STEP 2 - COMPRENSIONE FUNZIONALE

Analizza il codice sorgente per identificare:

### Scopo e Funzionalità
- **Scopo principale**: Cosa fa l'applicazione/libreria
- **Target audience**: Chi la usa (developer, end-user, entrambi)
- **Problema risolto**: Quale need affronta
- **Caratteristiche distintive**: Cosa la differenzia da alternative

### Architettura
- **Pattern architetturale**: MVC, microservices, monolith, serverless, etc.
- **Componenti principali**: Moduli, servizi, layer
- **Flussi principali**: Request/response, data pipeline, event flow
- **Integrazioni**: Database, API esterne, code, storage

### Casi d'Uso
- **Scenari principali**: Come viene tipicamente utilizzata
- **User stories**: Chi fa cosa e perché
- **Limitazioni note**: Cosa NON fa o non supporta

---

## STEP 3 - ANALISI TECNICA

### Dipendenze
Analizza e categorizza le dipendenze:

```markdown
**Runtime Dependencies** (cosa serve per eseguire):
- [libreria]: [scopo specifico]

**Development Dependencies** (cosa serve per sviluppare):
- [tool]: [scopo]

**Optional Dependencies** (feature opzionali):
- [libreria]: [abilita quale feature]
```

### Requisiti di Sistema
- **Versioni minime**: Linguaggio, runtime, framework
- **OS supportati**: Linux, macOS, Windows, etc.
- **Hardware**: RAM, CPU, storage (se rilevante)
- **Prerequisiti**: Database, servizi esterni, tools

### Build & Development
- **Build system**: Make, npm scripts, cargo, gradle, etc.
- **Compilazione**: Se necessaria, comandi e output
- **Linting/Formatting**: Tool utilizzati (eslint, black, rustfmt)
- **Pre-commit hooks**: Se configurati

### Testing
- **Framework**: Jest, pytest, JUnit, etc.
- **Tipologie**: Unit, integration, e2e
- **Coverage**: Tool e soglie (se configurate)
- **Comandi**: Come eseguire test

### Deployment
- **Modalità**: Docker, bare metal, cloud, serverless
- **Configurazioni**: Env vars, config files
- **CI/CD**: Pipeline configurate (GitHub Actions, GitLab CI, etc.)

---

## STEP 4 - STRUTTURA README

### 🆕 Se README NON esiste - Crea con queste sezioni:

```markdown
# [Nome Progetto]

[Badge appropriati: build status, version, license, coverage, downloads]

## 📖 Descrizione

[Descrizione concisa (2-3 paragrafi) che spiega:
- Cosa fa il progetto
- Problema che risolve
- Caso d'uso principale
- Cosa lo rende utile/unico]

## ✨ Caratteristiche Principali

- 🎯 [Feature chiave 1]
- ⚡ [Feature chiave 2]
- 🔒 [Feature chiave 3]
- 📊 [Feature chiave 4]

## 🚀 Quick Start

```bash
# Installazione rapida
[comandi essenziali per iniziare]

# Primo utilizzo
[esempio pratico funzionante]
```

## 📋 Prerequisiti

- [Requisito 1] - versione minima
- [Requisito 2] - scopo
- [Tool 3] - quando serve

## 🔧 Installazione

### Via [Package Manager]
```bash
[comandi step-by-step]
```

### Da Sorgente
```bash
git clone [repo-url]
cd [project-name]
[comandi build/setup]
```

### Con Docker (se applicabile)
```bash
docker pull [image]
docker run [opzioni]
```

## 💻 Utilizzo

### Esempio Base
```[linguaggio]
[Codice completo e funzionante del caso d'uso più comune]
```

### Esempio Avanzato
```[linguaggio]
[Codice che mostra feature più complesse]
```

### Configurazione

**Variabili d'ambiente:**
```bash
VARIABLE_NAME=value  # Descrizione
```

**File di configurazione:**
```[formato]
[Esempio config con commenti]
```

## 🏗️ Architettura

[Diagramma ASCII o descrizione del design]
```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
┌──────▼──────┐
│   Service   │
└──────┬──────┘
       │
┌──────▼──────┐
│  Database   │
└─────────────┘
```

## 🧪 Sviluppo

### Setup Ambiente Locale
```bash
[Passo 1: Clone e install]
[Passo 2: Configurazione]
[Passo 3: Avvio dev server]
```

### Comandi Utili
```bash
[comando]  # Descrizione cosa fa
[comando]  # Descrizione
```

### Eseguire i Test
```bash
# Tutti i test
[comando]

# Test specifici
[comando] [pattern]

# Con coverage
[comando --coverage]
```

## 📁 Struttura del Progetto

```
project-root/
├── src/              # Codice sorgente
│   ├── core/         # Logica principale
│   ├── utils/        # Utility functions
│   └── config/       # Configurazioni
├── tests/            # Test suite
├── docs/             # Documentazione aggiuntiva
└── scripts/          # Script utility
```

## 🤝 Contribuire

[Linee guida per contribuire:
- Come segnalare bug
- Come proporre feature
- Code style da seguire
- Processo di PR]

## 📄 Licenza

Questo progetto è distribuito sotto licenza [LICENSE_TYPE].
Vedi il file [LICENSE](LICENSE) per dettagli.

## 📞 Supporto

- 📧 Email: [contatto]
- 🐛 Issues: [link]
- 💬 Discussioni: [link forum/chat]
- 📚 Documentazione completa: [link docs]

## 🙏 Credits

[Ringraziamenti, sponsor, contributor principali]
```

### 🔄 Se README ESISTE - Aggiorna seguendo questa logica:

#### 1. Mantieni Struttura e Stile
- Non riorganizzare sezioni a meno che non sia strettamente necessario
- Preserva il tono: tecnico/informale, dettagliato/conciso
- Mantieni lo stesso livello di formattazione

#### 2. Aggiorna Contenuti Obsoleti
- ✅ Verifica che versioni e comandi siano attuali
- ✅ Controlla che dipendenze siano aggiornate
- ✅ Valida che esempi di codice funzionino ancora
- ✅ Rimuovi riferimenti a feature deprecate

#### 3. Integra Informazioni Mancanti
- Aggiungi dettagli scoperti da CLAUDE.md/AGENTS.md
- Completa sezioni incomplete
- Arricchisci esempi troppo semplici
- Documenta feature non menzionate

#### 4. Segnala Incongruenze
Se trovi problemi evidenti:
```markdown
<!-- ⚠️ NOTA: Questa sezione potrebbe essere obsoleta.
     Il codice attuale usa [nuova-libreria] invece di [vecchia-libreria].
     Da verificare con il maintainer. -->
```

#### 5. Non Stravolgere
- Se il README è lungo 1 pagina, non farlo diventare 10
- Se è minimalista, non renderlo verboso
- Se ha uno stile informale, non renderlo accademico

---

## STEP 5 - SEZIONI CRITICHE PER AI AGENTS

Il README deve facilitare la comprensione rapida da parte di AI agents che lavoreranno sul progetto.

### 🎯 Priorità Massima

#### 1. Setup Rapido (Quick Start)
```bash
# Comandi copy-paste per far partire il progetto in < 5 minuti
git clone [repo]
cd [project]
[install command]
[run command]
# → Output atteso: "Server running on http://localhost:3000"
```

#### 2. Architettura di Alto Livello
```markdown
Il progetto segue pattern [MVC/Microservices/etc]:
- `src/models/`: Definizioni dati e business logic
- `src/controllers/`: Gestione richieste HTTP
- `src/views/`: Template e UI components
```

#### 3. Entry Points
```markdown
**File principali da cui iniziare l'analisi:**
- `src/main.py`: Application entrypoint
- `src/app.py`: Core application logic
- `src/routes/`: API endpoint definitions
```

#### 4. Convenzioni di Codice
```python
# Naming conventions:
# ✅ Classes: PascalCase
# ✅ Functions: snake_case
# ✅ Constants: UPPER_SNAKE_CASE
# ✅ Files: lowercase_with_underscores.py
```

#### 5. Comandi Comuni
```bash
# Development workflow
make install     # Setup ambiente
make dev         # Avvia dev server con hot-reload
make test        # Esegui test suite
make lint        # Controlla code style
make format      # Formatta codice automaticamente
make build       # Crea build di produzione
make deploy      # Deploy (staging/production)
```

### 💡 Perché Questo Aiuta gli AI Agents

- **Orientamento immediato**: Capiscono subito cosa fa il progetto
- **Zero ambiguità**: Comandi testati e funzionanti
- **Context switching rapido**: Sanno dove cercare cosa
- **Coerenza**: Seguono le convenzioni senza inventare
- **Efficienza**: Meno domande, più codice funzionante

---

## STEP 6 - SEZIONI OPZIONALI

Includi solo se rilevanti e supportate da evidenze nel codice:

### 📊 Performance
- Benchmark reali
- Metriche di scalabilità
- Ottimizzazioni implementate

### 🔒 Sicurezza
- Pratiche di sicurezza applicate
- Audit e vulnerability scanning
- Best practices specifiche

### 🐳 Docker & Containerization
- Dockerfile presente e funzionante
- Docker Compose per stack completo
- Immagini pre-built disponibili

### 🔄 CI/CD
- Pipeline configurate (.github/workflows, .gitlab-ci.yml)
- Processi di release automatizzati
- Deployment strategies

### 🐛 Troubleshooting
- Problemi comuni con soluzioni
- Error messages più frequenti
- FAQ tecniche

### 🗺️ Roadmap
- Feature pianificate (da project board o issues)
- Timeline di rilascio
- Deprecation notices

### 📖 Documentazione Estesa
- Link a docs/ dettagliate
- API reference
- Tutorial e guide

---

## OUTPUT RICHIESTO

### 1. Contesto (2-3 righe)
```markdown
**Tipo progetto**: [Web app / CLI tool / Library / etc.]
**Tecnologie**: [Stack principale]
**Approccio**: [Creazione nuovo README / Aggiornamento README esistente]
```

### 2. README.md Completo
Fornisci il contenuto pronto per essere copiato nel file README.md

### 3. Note Finali
```markdown
**Sezioni aggiunte:**
- [Lista sezioni create]

**Sezioni modificate:**
- [Lista sezioni aggiornate]

**Placeholder che richiedono input manuale:**
- [NOME_PROGETTO] - Line 1
- [REPO_URL] - Line 45
- [DA CONFIGURARE: EMAIL_SUPPORTO] - Line 230

**Suggerimenti per miglioramenti futuri:**
- [Possibili aggiunte quando ci sarà più materiale]
```

---

## ✅ PRINCIPI FONDAMENTALI

### DO ✅
- Basati **esclusivamente** sul codice e file presenti nel repository
- Usa informazioni da CLAUDE.md e AGENTS.md se disponibili
- Fornisci esempi di codice **funzionanti e testabili**
- Mantieni README conciso ma completo
- Usa placeholder espliciti per info non deducibili: `[DA SPECIFICARE]`
- Preserva lo stile del README esistente

### DON'T ❌
- Non inventare feature non presenti nel codice
- Non copiare/incollare documentazione generica
- Non creare README enciclopedici (meglio conciso e accurato)
- Non assumere configurazioni non documentate
- Non sovrascrivere README esistenti senza preservarne lo stile
- Non aggiungere badge a caso (solo quelli verificabili)

---

## 🎓 DIFFERENZA TRA README, CLAUDE.md, AGENTS.md

| Aspetto | README.md | CLAUDE.md | AGENTS.md |
|---------|-----------|-----------|-----------|
| **Audience** | Umani + AI generici | AI agents del progetto | AI agents del progetto |
| **Scope** | Documentazione pubblica | Stato corrente | Best practices operative |
| **Contenuto** | Setup, utilizzo, architettura generale | Implementazione attuale, known issues | Pattern, errori da evitare, workflow |
| **Frequenza update** | Ad ogni release/feature importante | Ogni sessione di sviluppo | Ogni volta che si scoprono pattern/errori |
| **Stile** | User-friendly, marketing-friendly | Tecnico, stato-oriented | Pratico, howto-oriented |

**In pratica:**
1. Un nuovo AI agent legge **README** → capisce cos'è il progetto
2. Poi legge **CLAUDE.md** → capisce dove siamo arrivati
3. Poi legge **AGENTS.md** → capisce come lavorare qui

---

**✨ Procedi con l'analisi e la generazione/aggiornamento del README!**
