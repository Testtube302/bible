-- Phase 2: Story Mode, Gamification, Topics, Timeline, Enhanced Daily Spark
-- Run manually on existing database:
-- docker compose exec postgres psql -U bible_user -d bible -f /docker-entrypoint-initdb.d/002_phase2_schema.sql

-- ============================================================
-- Sprint 1: Story Mode Journeys
-- ============================================================

CREATE TABLE IF NOT EXISTS journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cover_image VARCHAR(255),
  era VARCHAR(50),
  passages JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS journey_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  content_type VARCHAR(50) NOT NULL, -- 'introduction', 'transition', 'reflection'
  position INTEGER NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(journey_id, content_type, position)
);

CREATE TABLE IF NOT EXISTS journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
  current_passage INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(journey_id)
);

-- ============================================================
-- Sprint 2: Bible Quest Gamification
-- ============================================================

CREATE TABLE IF NOT EXISTS quest_xp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50) NOT NULL, -- 'chapter_read', 'question_answered', 'journey_completed', 'streak_bonus'
  source_id VARCHAR(255),
  xp_amount INTEGER NOT NULL DEFAULT 0,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quest_xp_source ON quest_xp(source_type, source_id);

CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT 'star',
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  criteria JSONB NOT NULL DEFAULT '{}',
  xp_reward INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS achievement_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  UNIQUE(achievement_id)
);

CREATE TABLE IF NOT EXISTS chapter_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_name VARCHAR(100) NOT NULL,
  chapter INTEGER NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(book_name, chapter)
);

CREATE TABLE IF NOT EXISTS question_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_name VARCHAR(100) NOT NULL,
  chapter INTEGER NOT NULL,
  question_index INTEGER NOT NULL,
  user_answer INTEGER NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Sprint 3: Topic Explorer
-- ============================================================

CREATE TABLE IF NOT EXISTS topic_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic VARCHAR(100) UNIQUE NOT NULL,
  summary TEXT NOT NULL,
  verses_cited TEXT[] DEFAULT '{}',
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Sprint 4: Enhanced Daily Spark
-- ============================================================

CREATE TABLE IF NOT EXISTS daily_spark_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  book VARCHAR(100) NOT NULL,
  chapter INTEGER NOT NULL,
  verse INTEGER NOT NULL,
  text TEXT NOT NULL,
  translation VARCHAR(10) NOT NULL DEFAULT 'KJV',
  context_text TEXT,
  application_text TEXT,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
