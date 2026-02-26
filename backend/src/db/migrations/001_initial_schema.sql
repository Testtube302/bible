-- Scripture Bible PWA - Initial Schema
-- Run automatically by PostgreSQL docker-entrypoint-initdb.d

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- BIBLE METADATA
-- ============================================

CREATE TABLE IF NOT EXISTS bible_books (
    id              SERIAL PRIMARY KEY,
    name            VARCHAR(50) NOT NULL,
    abbreviation    VARCHAR(10) NOT NULL,
    testament       VARCHAR(5) NOT NULL CHECK (testament IN ('OT', 'NT')),
    book_order      INTEGER NOT NULL UNIQUE,
    chapter_count   INTEGER NOT NULL,
    verse_count     INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bible_books_name ON bible_books(name);
CREATE INDEX IF NOT EXISTS idx_bible_books_abbreviation ON bible_books(abbreviation);

-- ============================================
-- BOOKMARKS
-- ============================================

CREATE TABLE IF NOT EXISTS bookmarks (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_name       VARCHAR(50) NOT NULL,
    chapter         INTEGER NOT NULL,
    verse           INTEGER NOT NULL,
    translation     VARCHAR(10) NOT NULL DEFAULT 'KJV',
    note            TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_name, chapter, verse, translation)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_location ON bookmarks(book_name, chapter);

-- ============================================
-- HIGHLIGHTS
-- ============================================

CREATE TABLE IF NOT EXISTS highlights (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_name       VARCHAR(50) NOT NULL,
    chapter         INTEGER NOT NULL,
    verse_start     INTEGER NOT NULL,
    verse_end       INTEGER NOT NULL,
    translation     VARCHAR(10) NOT NULL DEFAULT 'KJV',
    color           VARCHAR(20) NOT NULL DEFAULT 'gold',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_highlights_location ON highlights(book_name, chapter);

-- ============================================
-- READING PROGRESS
-- ============================================

CREATE TABLE IF NOT EXISTS reading_progress (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    book_name       VARCHAR(50) NOT NULL,
    chapter         INTEGER NOT NULL,
    completed       BOOLEAN DEFAULT FALSE,
    last_verse_read INTEGER DEFAULT 0,
    read_at         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_name, chapter)
);

CREATE INDEX IF NOT EXISTS idx_progress_book ON reading_progress(book_name);

CREATE TABLE IF NOT EXISTS reading_streaks (
    id              SERIAL PRIMARY KEY,
    date            DATE NOT NULL UNIQUE,
    chapters_read   INTEGER DEFAULT 0,
    minutes_spent   INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_streaks_date ON reading_streaks(date);

-- ============================================
-- CHAT
-- ============================================

CREATE TABLE IF NOT EXISTS chat_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(255),
    mode            VARCHAR(20) NOT NULL CHECK (mode IN ('scripture_only', 'explain', 'debate')),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id      UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content         TEXT NOT NULL,
    verses_cited    TEXT[],
    metadata        JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON chat_messages(created_at);

-- ============================================
-- ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS analytics_events (
    id              BIGSERIAL PRIMARY KEY,
    event_type      VARCHAR(50) NOT NULL,
    event_data      JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);

-- ============================================
-- ADMIN SESSIONS
-- ============================================

CREATE TABLE IF NOT EXISTS admin_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token           VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);

-- ============================================
-- PHASE 2 PREPARATION
-- ============================================

CREATE TABLE IF NOT EXISTS reading_plans (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    cover_image     VARCHAR(500),
    passages        JSONB NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);
