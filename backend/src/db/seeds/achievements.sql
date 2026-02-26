-- Achievement seed data: ~15 achievements
-- Run after 002_phase2_schema.sql migration

INSERT INTO achievements (slug, title, description, icon, category, criteria, xp_reward, sort_order) VALUES

-- Getting Started
('first-steps', 'First Steps', 'Read your first chapter', 'footprints', 'getting_started',
 '{"type": "chapters_read", "count": 1}'::jsonb, 10, 1),

('bookworm', 'Bookworm', 'Read 10 chapters', 'book', 'reading',
 '{"type": "chapters_read", "count": 10}'::jsonb, 25, 2),

('devoted-reader', 'Devoted Reader', 'Read 50 chapters', 'scroll', 'reading',
 '{"type": "chapters_read", "count": 50}'::jsonb, 100, 3),

('bible-scholar', 'Bible Scholar', 'Read 100 chapters', 'graduation', 'reading',
 '{"type": "chapters_read", "count": 100}'::jsonb, 250, 4),

-- Book Completions
('genesis-complete', 'In the Beginning', 'Complete the book of Genesis', 'star', 'books',
 '{"type": "book_completed", "book": "Genesis"}'::jsonb, 50, 10),

('psalms-complete', 'Psalmist', 'Complete the book of Psalms', 'music', 'books',
 '{"type": "book_completed", "book": "Psalms"}'::jsonb, 75, 11),

('matthew-complete', 'Gospel Reader', 'Complete the Gospel of Matthew', 'cross', 'books',
 '{"type": "book_completed", "book": "Matthew"}'::jsonb, 50, 12),

('romans-complete', 'Theologian', 'Complete Paul''s letter to the Romans', 'scroll', 'books',
 '{"type": "book_completed", "book": "Romans"}'::jsonb, 50, 13),

-- Streaks
('faithful-week', 'Faithful Week', 'Read for 7 consecutive days', 'flame', 'streaks',
 '{"type": "streak_days", "days": 7}'::jsonb, 30, 20),

('wilderness-wanderer', '40 Days in the Wilderness', 'Read for 40 consecutive days', 'compass', 'streaks',
 '{"type": "streak_days", "days": 40}'::jsonb, 200, 21),

-- Questions
('curious-mind', 'Curious Mind', 'Answer your first question correctly', 'lightbulb', 'questions',
 '{"type": "correct_answers", "count": 1}'::jsonb, 10, 30),

('sharp-student', 'Sharp Student', 'Answer 25 questions correctly', 'brain', 'questions',
 '{"type": "correct_answers", "count": 25}'::jsonb, 50, 31),

('master-scholar', 'Master Scholar', 'Answer 100 questions correctly', 'trophy', 'questions',
 '{"type": "correct_answers", "count": 100}'::jsonb, 150, 32),

-- Journeys
('first-journey', 'Pilgrim', 'Complete your first story journey', 'map', 'journeys',
 '{"type": "journeys_completed", "count": 1}'::jsonb, 30, 40),

('seasoned-traveler', 'Seasoned Traveler', 'Complete 5 story journeys', 'globe', 'journeys',
 '{"type": "journeys_completed", "count": 5}'::jsonb, 100, 41)

ON CONFLICT (slug) DO NOTHING;
