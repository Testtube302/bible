-- Plan categories seed data
-- Run after 003_plans_schema.sql migration

INSERT INTO plan_categories (slug, name, description, icon, sort_order) VALUES
('emotions', 'Emotions & Mental Health', 'Find Scripture for life''s emotional challenges', 'heart', 1),
('relationships', 'Life & Relationships', 'Build stronger, godly relationships', 'users', 2),
('faith-foundations', 'Faith Foundations', 'Grow your understanding of core beliefs', 'book', 3),
('seasonal', 'Seasonal', 'Celebrate the seasons of faith', 'calendar', 4),
('book-studies', 'Book Studies', 'Deep dives into individual books of the Bible', 'bookmark', 5),
('topical', 'Topical Themes', 'Explore key themes throughout Scripture', 'compass', 6)
ON CONFLICT (slug) DO NOTHING;
