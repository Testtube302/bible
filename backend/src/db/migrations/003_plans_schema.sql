-- Phase 3: Reading Plans
-- Run manually on existing database:
-- docker compose exec postgres psql -U bible_user -d bible -f /docker-entrypoint-initdb.d/003_plans_schema.sql

-- ============================================================
-- Reading Plans
-- ============================================================

CREATE TABLE IF NOT EXISTS plan_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  category_id UUID NOT NULL REFERENCES plan_categories(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cover_image VARCHAR(255),
  duration_days INTEGER NOT NULL,
  readings JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- readings JSONB format:
-- [
--   { "day": 1, "title": "Day Title", "passages": [
--       { "book": "John", "chapter": 3, "verseStart": 16, "verseEnd": 21, "label": "John 3:16-21" }
--     ]
--   }
-- ]

CREATE TABLE IF NOT EXISTS plan_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'devotional', 'prayer'
  content TEXT NOT NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(plan_id, day, content_type)
);

CREATE TABLE IF NOT EXISTS plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days JSONB NOT NULL DEFAULT '[]',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(plan_id)
);

CREATE INDEX IF NOT EXISTS idx_plans_category ON plans(category_id);
CREATE INDEX IF NOT EXISTS idx_plan_content_plan ON plan_content(plan_id);
