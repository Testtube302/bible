# 📖 MASTER BUILD PROMPT

## Project: Scripture-First Interactive Bible Platform (Gen-Z Focused)

---

## 🎯 OVERVIEW

Build a mobile-first Progressive Web App (PWA) Bible platform designed for users under 20 years old.

The system must:

- Present the Bible in an engaging, interactive, story-driven way
- Include a Scripture-grounded AI chat interface
- Provide strong theological guardrails
- Require citation of book/chapter/verse in every AI response
- Deploy with a single Docker command
- Run behind Apache reverse proxy at `/bible`

**This is not a church website.**
**This is not a social media app.**
**This is a focused, clean, immersive Scripture platform.**

---

## 🔒 NON-NEGOTIABLE REQUIREMENTS

### 1️⃣ Scriptural Accuracy Enforcement

The AI must:

**Only retrieve from:**

- Canonical Bible text (public domain translations)
- Cross-references (Treasury of Scripture Knowledge — public domain)
- Concordances (Strong's Concordance — public domain)
- Bible dictionaries (optional but clearly labeled)

**Cite book, chapter, and verse in every response.**

**Clearly distinguish:**

- Direct Scripture quotation
- Explanation
- Interpretive commentary

**Refuse to speculate.**

If Scripture does not directly address a question, respond with:

> "The Bible does not directly address this."

- No hallucinated theology
- No cultural speculation without textual support

---

## 🧠 AI SYSTEM ARCHITECTURE

Implement Retrieval-Augmented Generation (RAG).

### LLM Provider

- **Primary:** Kimi 2.5 by Moonshot AI (OpenAI-compatible API format)
- **Secondary (future toggle):** Anthropic Claude API
- Implement an **LLM abstraction layer** so the provider is swapped via a single environment variable (`LLM_PROVIDER=kimi` or `LLM_PROVIDER=anthropic`)
- All provider-specific logic must be isolated behind this abstraction

### Required Components

**Vector database (self-hosted):**

- **ChromaDB** (runs in Docker, no external dependencies)
- Contains:
  - Full Bible text (structured by book/chapter/verse)
  - Cross-reference mapping (source: Treasury of Scripture Knowledge)
  - Topic tagging (peace, anxiety, forgiveness, love, justice, faith, etc.)
  - Embeddings for semantic search

**Strict system prompt enforcing:**

- Scripture-first answers
- Citation requirement
- Refusal on unsupported topics
- System prompt is enforced **server-side only** (never exposed to client)

### AI Modes

**🟢 Mode 1: "Scripture Only"**

- Returns only quoted verses
- No commentary

**🔵 Mode 2: "Explain with Scripture"**

- May explain meaning
- Must cite supporting verses

**🟣 Mode 3: "Debate / Compare"**

- Presents verses supporting different interpretations
- Explains theological tension
- Does not take sides unless Scripture explicitly resolves it

### AI Streaming

- Use **WebSocket** connection for AI chat responses
- Stream tokens in real-time for responsive UX
- Handle connection drops gracefully with reconnection logic

---

## 📱 MOBILE-FIRST UX REQUIREMENTS

### Design Principles

- Dark mode default
- Large readable typography
- Minimal UI clutter
- Swipe gestures supported
- Optimized for iOS + Android browsers
- PWA installable to home screen
- Offline support for cached Bible text

---

## 🎨 VISUAL DESIGN DIRECTION

### Art & Imagery

The application must feel **majestic, reverent, and visually stunning**.

**Integrate classic religious artwork throughout the interface:**

- **Sistine Chapel ceiling** (Michelangelo) — Creation of Adam, The Last Judgment, etc.
- **Raphael** — The Transfiguration, School of Athens, Sistine Madonna
- **Caravaggio** — The Calling of Saint Matthew, Supper at Emmaus
- **Rembrandt** — Return of the Prodigal Son, Storm on the Sea of Galilee
- **Gustave Doré** — Bible illustrations (extensive public domain set)
- **William Blake** — Biblical illustrations

All artwork is **public domain**. Source high-resolution versions from:

- Wikimedia Commons
- Metropolitan Museum Open Access
- Google Art Project

**How to use the artwork:**

- **Home screen:** Full-bleed background with subtle parallax, overlaid with daily verse
- **Book/chapter headers:** Each book of the Bible paired with a relevant artwork piece
- **Story Mode journeys:** Each journey has a curated hero image and chapter illustrations
- **Timeline:** Artwork placed at key historical events
- **Loading states:** Art reveals with elegant fade-in
- **AI chat background:** Subtle, muted artwork texture (not distracting)

**Design treatment:**

- Apply subtle dark overlays for text readability
- Use warm, muted color grading (gold, deep blue, burgundy, cream)
- Images should feel like illuminated manuscripts meets modern mobile design
- Smooth transitions and parallax scrolling where appropriate
- No garish colors, no neon, no cartoon-style anything

---

## 🏠 HOME SCREEN

### "Daily Spark" Card

**Display:**

- Verse of the Day (with relevant artwork background)
- Swipe left → Context
- Swipe right → Real-world application
- Tap → Open Chat about this verse

---

## 📖 BIBLE NAVIGATION SYSTEM

Provide 3 navigation methods:

### 1️⃣ Traditional Navigation

- Book → Chapter → Verse
- Smooth scrolling
- Tap verse to:
  - Highlight
  - Bookmark
  - Ask AI about it

### 2️⃣ Story Mode Navigation (AI-Generated Content)

Instead of listing books only, offer **curated journeys** with rich artwork and narrative framing.

**Examples:**

- The Life of Jesus
- The Rise & Fall of Kings
- The Exodus Story
- Women of the Bible
- Letters of Paul
- Betrayal & Redemption
- Creation to Covenant
- The Prophets Speak

**Each journey includes:**

- A hero image (curated religious artwork)
- AI-generated narrative introduction setting the historical/theological context
- Structured reading path linking canonical passages in order
- AI-generated transition text between passages explaining narrative flow
- Contextual AI-generated questions for reflection at key points

**Content generation requirements:**

- All narrative text must be clearly labeled as commentary, not Scripture
- Every AI-generated section must reference the specific verses it draws from
- Tone: reverent, accessible, engaging — not preachy or condescending
- Reading level: accessible to a 14-year-old
- Generated at build time or on first access, then cached

### 3️⃣ Interactive Timeline

Scrollable timeline with artwork at key events:

- Creation
- Patriarchs
- Exodus
- Kingdom Era
- Exile
- Jesus
- Early Church

Tapping events jumps to relevant passages.

---

## 🎮 GAMIFIED LEARNING SYSTEM

### Bible Quest Mode

**Features:**

- XP for reading chapters
- XP for answering contextual questions
- Streak tracking
- Achievements (examples):
  - "Finished Genesis"
  - "Walked with Paul"
  - "Beat Goliath"
  - "40 Days in the Wilderness" (40-day streak)

### AI-Generated Questions

**Questions are generated dynamically by the AI based on the chapter just read.**

Requirements:

- Questions must test comprehension of themes, context, and cross-references
- No disconnected trivia (no "how many cubits was the ark?")
- Question types:
  - "What theme connects this passage to [cross-reference]?"
  - "How does this event foreshadow [later event]?"
  - "What does this teach about [topic]?"
- AI must cite the verse(s) the question draws from
- Difficulty scales with reading progress
- Questions are generated on completion of a chapter, then cached
- 3–5 questions per chapter

---

## 🔍 STUDY TOOLS

### ✏ Highlight + Ask

User highlights verse → tap "Explain this" → AI responds in the selected mode.

### 📖 Compare Translations

Side-by-side comparison of available public domain translations:

- **KJV** (King James Version) — formal, traditional
- **WEB** (World English Bible) — modern, readable
- **ASV** (American Standard Version) — literal, scholarly

### 🔎 Topic Explorer

Search by topic:

- Fear, Anxiety, Love, Justice, Faith, Forgiveness, Hope, Wisdom, Suffering, Redemption

Returns verse clusters with AI-generated topic summaries.

---

## 👤 USER SYSTEM

**Single-user application.** No registration, no OAuth, no multi-user support.

- The app is used by one person
- All highlights, bookmarks, streak data, reading progress, and chat history are stored locally in the database
- No login required for the main app

---

## 🔧 ADMIN SECTION

Simple admin panel protected by username/password authentication.

- **Credentials stored in environment variables** (not hardcoded in source)
- Default: configured via `.env` file
- Session-based auth (simple cookie/token)

**Admin capabilities:**

- Analytics dashboard:
  - Most searched topics
  - Most asked questions
  - Popular books/chapters
  - Reading streak stats
- Manage curated reading paths (add/edit/reorder Story Mode journeys)
- Manage AI mode defaults
- Regenerate AI content (story introductions, questions)
- View/clear AI chat history
- Toggle features on/off

---

## 🧠 SPIRITUAL COMPANION MODE (Phase 2)

Persistent assistant that:

- Remembers reading habits
- Suggests reading plans
- Tracks growth topics
- Summarizes past conversations

Must always:

- Defer to Scripture
- Never replace text with opinion

*Marked as Phase 2 — build the data model for it now, implement later.*

---

## ⚙️ TECHNICAL STACK

### Backend

- **Node.js** (Express or Fastify)
- **RAG pipeline** with LLM abstraction layer
- **ChromaDB** (vector database, self-hosted in Docker)
- **PostgreSQL** (user data, bookmarks, progress, analytics)
- **Redis** (optional caching layer)
- **WebSocket** server for AI chat streaming

### Frontend

- **Next.js** (React framework)
- **Tailwind CSS**
- **PWA** support (service worker, manifest, offline caching)
- Mobile optimized
- Image optimization for religious artwork (lazy loading, responsive sizes, WebP)

### Deployment

- **Dockerized** — all services in one `docker-compose.yml`
- Single command launch: `docker compose up -d`
- **Apache reverse proxy** configuration provided:
  - Route `/bible` → internal Next.js service
  - Handle **WebSocket upgrades** for AI chat streaming
  - SSL termination handled by Apache (assumed already configured)
- Target: Ubuntu server with Apache already installed

---

## 🔐 SECURITY & GUARDRAILS

- Rate limiting on AI endpoints
- AI output length control
- Input sanitization
- Citation verification step (AI responses validated against verse database)
- Strict prompt template enforced **server-side** (never exposed to client)
- Admin panel behind authentication
- `.env` file for all secrets (API keys, admin credentials, DB passwords)
- `.env` excluded from git via `.gitignore`

---

## 📊 PHASE BREAKDOWN

### Phase 1: Core Platform

- Bible text ingestion (KJV, WEB, ASV)
- Traditional navigation (Book → Chapter → Verse)
- AI chat with 3 modes (Scripture Only, Explain, Debate)
- WebSocket streaming
- RAG pipeline with ChromaDB
- Highlight, bookmark, basic study tools
- Dark mode UI with religious artwork integration
- Docker deployment
- Apache reverse proxy config
- Admin panel (basic)

### Phase 2: Engagement Features

- Story Mode with AI-generated journeys
- Interactive Timeline
- Bible Quest (gamification + AI-generated questions)
- Topic Explorer with AI summaries
- Compare Translations view
- Daily Spark home screen
- Spiritual Companion Mode
- Advanced analytics in admin panel

---

## 📦 PROJECT STRUCTURE

```
/bible
├── /frontend          # Next.js application
├── /backend           # Node.js API server
├── /docker            # Dockerfiles for each service
├── /apache            # Apache reverse proxy config example
├── /vector_data       # ChromaDB persistent storage
├── /scripts           # Bible text ingestion & processing scripts
├── /artwork           # Curated religious artwork assets (or manifest)
├── docker-compose.yml # Single-command deployment
├── .env.example       # Environment variable template
└── README.md          # Setup documentation
```

---

## 🧾 FINAL DELIVERABLES

The system must output:

1. Fully functional mobile PWA
2. `docker-compose.yml` file
3. Apache reverse proxy configuration
4. Database schema (PostgreSQL)
5. RAG ingestion script (Bible text → ChromaDB)
6. AI system prompt template
7. `.env.example` with all required variables documented
8. Setup documentation

---

## 🛑 EXPLICITLY EXCLUDED FEATURES

- No short-form TikTok-style content
- No public question wall
- No social commenting system
- No open community posting
- No popularity ranking of opinions
- No voice input/output
- No multi-user registration system

---

## 🧭 DESIGN PHILOSOPHY

The application should feel:

- **Calm**
- **Focused**
- **Honest**
- **Thoughtful**
- **Visually majestic**
- **Scripture-centered**

Not:

- Flashy
- Argumentative
- Political
- Trend-chasing
- Cluttered
- Childish
