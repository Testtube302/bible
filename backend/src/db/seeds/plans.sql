-- Reading plans seed data: 44 curated plans
-- Run after plan_categories.sql

-- ============================================================
-- Emotions & Mental Health (17 plans)
-- ============================================================

INSERT INTO plans (slug, category_id, title, description, duration_days, readings, sort_order) VALUES

('gods-love-language', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'God''s Love Language',
 'Discover the depth, width, and height of God''s love through Scripture — a love that never fails and never ends.',
 5, '[
  {"day": 1, "title": "Love Defined", "passages": [{"book": "1 Corinthians", "chapter": 13, "verseStart": 1, "verseEnd": 13, "label": "1 Corinthians 13:1-13"}]},
  {"day": 2, "title": "God So Loved", "passages": [{"book": "John", "chapter": 3, "verseStart": 16, "verseEnd": 21, "label": "John 3:16-21"}]},
  {"day": 3, "title": "Love One Another", "passages": [{"book": "1 John", "chapter": 4, "verseStart": 7, "verseEnd": 21, "label": "1 John 4:7-21"}]},
  {"day": 4, "title": "Nothing Can Separate Us", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 31, "verseEnd": 39, "label": "Romans 8:31-39"}]},
  {"day": 5, "title": "The Beloved", "passages": [{"book": "Song of Solomon", "chapter": 2, "verseStart": 1, "verseEnd": 17, "label": "Song of Solomon 2:1-17"}]}
]'::jsonb, 1),

('learning-to-love-others', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Learning to Love Others',
 'Love your neighbor as yourself — but how? Walk through Jesus'' teachings on what real, sacrificial love looks like in action.',
 5, '[
  {"day": 1, "title": "The Greatest Commandment", "passages": [{"book": "Matthew", "chapter": 22, "verseStart": 34, "verseEnd": 40, "label": "Matthew 22:34-40"}]},
  {"day": 2, "title": "The Good Samaritan", "passages": [{"book": "Luke", "chapter": 10, "verseStart": 25, "verseEnd": 37, "label": "Luke 10:25-37"}]},
  {"day": 3, "title": "A Servant''s Heart", "passages": [{"book": "John", "chapter": 13, "verseStart": 1, "verseEnd": 17, "label": "John 13:1-17"}]},
  {"day": 4, "title": "The Mind of Christ", "passages": [{"book": "Philippians", "chapter": 2, "verseStart": 1, "verseEnd": 11, "label": "Philippians 2:1-11"}]},
  {"day": 5, "title": "Love in Action", "passages": [{"book": "1 John", "chapter": 3, "verseStart": 11, "verseEnd": 24, "label": "1 John 3:11-24"}]}
]'::jsonb, 2),

('finding-peace-in-anxious-times', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Finding Peace in Anxious Times',
 'When worry overwhelms, Scripture offers an anchor. Seven days of passages that speak directly to anxious hearts.',
 7, '[
  {"day": 1, "title": "Rejoice and Pray", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 4, "verseEnd": 9, "label": "Philippians 4:4-9"}]},
  {"day": 2, "title": "Do Not Worry", "passages": [{"book": "Matthew", "chapter": 6, "verseStart": 25, "verseEnd": 34, "label": "Matthew 6:25-34"}]},
  {"day": 3, "title": "The Lord Is My Shepherd", "passages": [{"book": "Psalms", "chapter": 23, "verseStart": 1, "verseEnd": 6, "label": "Psalm 23"}]},
  {"day": 4, "title": "Cast Your Cares", "passages": [{"book": "1 Peter", "chapter": 5, "verseStart": 6, "verseEnd": 11, "label": "1 Peter 5:6-11"}]},
  {"day": 5, "title": "Fear Not, I Am With You", "passages": [{"book": "Isaiah", "chapter": 41, "verseStart": 10, "verseEnd": 13, "label": "Isaiah 41:10-13"}]},
  {"day": 6, "title": "A Refuge in Distress", "passages": [{"book": "Psalms", "chapter": 94, "verseStart": 17, "verseEnd": 19, "label": "Psalm 94:17-19"}]},
  {"day": 7, "title": "A Spirit of Power", "passages": [{"book": "2 Timothy", "chapter": 1, "verseStart": 7, "verseEnd": 12, "label": "2 Timothy 1:7-12"}]}
]'::jsonb, 3),

('restoration-and-healing', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Restoration & Healing',
 'Whether physical, emotional, or spiritual — God is the great healer. Discover his promises of restoration.',
 5, '[
  {"day": 1, "title": "He Heals the Brokenhearted", "passages": [{"book": "Psalms", "chapter": 147, "verseStart": 1, "verseEnd": 6, "label": "Psalm 147:1-6"}]},
  {"day": 2, "title": "Heal Me, O Lord", "passages": [{"book": "Jeremiah", "chapter": 17, "verseStart": 14, "verseEnd": 18, "label": "Jeremiah 17:14-18"}]},
  {"day": 3, "title": "The Prayer of Faith", "passages": [{"book": "James", "chapter": 5, "verseStart": 13, "verseEnd": 18, "label": "James 5:13-18"}]},
  {"day": 4, "title": "By His Wounds", "passages": [{"book": "Isaiah", "chapter": 53, "verseStart": 1, "verseEnd": 12, "label": "Isaiah 53:1-12"}]},
  {"day": 5, "title": "He Redeems Your Life", "passages": [{"book": "Psalms", "chapter": 103, "verseStart": 1, "verseEnd": 14, "label": "Psalm 103:1-14"}]}
]'::jsonb, 4),

('taming-the-fire-within', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Taming the Fire Within',
 'Anger is human, but unchecked it destroys. Learn what Scripture teaches about righteous anger and self-control.',
 5, '[
  {"day": 1, "title": "Quick to Listen, Slow to Anger", "passages": [{"book": "James", "chapter": 1, "verseStart": 19, "verseEnd": 27, "label": "James 1:19-27"}]},
  {"day": 2, "title": "A Gentle Answer", "passages": [{"book": "Proverbs", "chapter": 15, "verseStart": 1, "verseEnd": 7, "label": "Proverbs 15:1-7"}]},
  {"day": 3, "title": "Put Away Bitterness", "passages": [{"book": "Ephesians", "chapter": 4, "verseStart": 25, "verseEnd": 32, "label": "Ephesians 4:25-32"}]},
  {"day": 4, "title": "Do Not Fret", "passages": [{"book": "Psalms", "chapter": 37, "verseStart": 1, "verseEnd": 11, "label": "Psalm 37:1-11"}]},
  {"day": 5, "title": "Put On the New Self", "passages": [{"book": "Colossians", "chapter": 3, "verseStart": 1, "verseEnd": 17, "label": "Colossians 3:1-17"}]}
]'::jsonb, 5),

('anchored-in-hope', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Anchored in Hope',
 'When the future feels uncertain, these passages remind us that hope in God is never misplaced.',
 5, '[
  {"day": 1, "title": "The God of Hope", "passages": [{"book": "Romans", "chapter": 15, "verseStart": 1, "verseEnd": 13, "label": "Romans 15:1-13"}]},
  {"day": 2, "title": "Plans to Prosper You", "passages": [{"book": "Jeremiah", "chapter": 29, "verseStart": 10, "verseEnd": 14, "label": "Jeremiah 29:10-14"}]},
  {"day": 3, "title": "An Anchor for the Soul", "passages": [{"book": "Hebrews", "chapter": 6, "verseStart": 13, "verseEnd": 20, "label": "Hebrews 6:13-20"}]},
  {"day": 4, "title": "His Mercies Are New", "passages": [{"book": "Lamentations", "chapter": 3, "verseStart": 19, "verseEnd": 33, "label": "Lamentations 3:19-33"}]},
  {"day": 5, "title": "Why Are You Downcast?", "passages": [{"book": "Psalms", "chapter": 42, "verseStart": 1, "verseEnd": 11, "label": "Psalm 42:1-11"}]}
]'::jsonb, 6),

('light-in-the-darkness', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Light in the Darkness',
 'For those walking through dark seasons — seven days of Scripture that speak to the soul in its deepest valleys.',
 7, '[
  {"day": 1, "title": "He Lifted Me Up", "passages": [{"book": "Psalms", "chapter": 40, "verseStart": 1, "verseEnd": 5, "label": "Psalm 40:1-5"}]},
  {"day": 2, "title": "Elijah''s Despair", "passages": [{"book": "1 Kings", "chapter": 19, "verseStart": 1, "verseEnd": 18, "label": "1 Kings 19:1-18"}]},
  {"day": 3, "title": "Fearfully and Wonderfully Made", "passages": [{"book": "Psalms", "chapter": 139, "verseStart": 1, "verseEnd": 18, "label": "Psalm 139:1-18"}]},
  {"day": 4, "title": "Beauty for Ashes", "passages": [{"book": "Isaiah", "chapter": 61, "verseStart": 1, "verseEnd": 7, "label": "Isaiah 61:1-7"}]},
  {"day": 5, "title": "The Lord Is Near", "passages": [{"book": "Psalms", "chapter": 34, "verseStart": 1, "verseEnd": 22, "label": "Psalm 34:1-22"}]},
  {"day": 6, "title": "All Things Work Together", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 18, "verseEnd": 28, "label": "Romans 8:18-28"}]},
  {"day": 7, "title": "I Will Remember", "passages": [{"book": "Psalms", "chapter": 77, "verseStart": 1, "verseEnd": 20, "label": "Psalm 77:1-20"}]}
]'::jsonb, 7),

('courage-over-fear', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Courage Over Fear',
 'Fear is real, but God is bigger. Five days of Scripture that replace fear with unshakable courage.',
 5, '[
  {"day": 1, "title": "Do Not Fear", "passages": [{"book": "Isaiah", "chapter": 41, "verseStart": 10, "verseEnd": 13, "label": "Isaiah 41:10-13"}]},
  {"day": 2, "title": "The Lord Is My Light", "passages": [{"book": "Psalms", "chapter": 27, "verseStart": 1, "verseEnd": 14, "label": "Psalm 27:1-14"}]},
  {"day": 3, "title": "A Spirit of Power", "passages": [{"book": "2 Timothy", "chapter": 1, "verseStart": 7, "verseEnd": 12, "label": "2 Timothy 1:7-12"}]},
  {"day": 4, "title": "Be Strong and Courageous", "passages": [{"book": "Joshua", "chapter": 1, "verseStart": 1, "verseEnd": 9, "label": "Joshua 1:1-9"}]},
  {"day": 5, "title": "Under His Wings", "passages": [{"book": "Psalms", "chapter": 91, "verseStart": 1, "verseEnd": 16, "label": "Psalm 91:1-16"}]}
]'::jsonb, 8),

('the-peace-of-god', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'The Peace of God',
 'A peace that surpasses understanding — discover the deep, abiding peace that only God can give.',
 5, '[
  {"day": 1, "title": "My Peace I Give You", "passages": [{"book": "John", "chapter": 14, "verseStart": 25, "verseEnd": 31, "label": "John 14:25-31"}]},
  {"day": 2, "title": "The Peace That Guards", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 4, "verseEnd": 9, "label": "Philippians 4:4-9"}]},
  {"day": 3, "title": "Perfect Peace", "passages": [{"book": "Isaiah", "chapter": 26, "verseStart": 1, "verseEnd": 9, "label": "Isaiah 26:1-9"}]},
  {"day": 4, "title": "Let Peace Rule", "passages": [{"book": "Colossians", "chapter": 3, "verseStart": 12, "verseEnd": 17, "label": "Colossians 3:12-17"}]},
  {"day": 5, "title": "God Is Our Refuge", "passages": [{"book": "Psalms", "chapter": 46, "verseStart": 1, "verseEnd": 11, "label": "Psalm 46:1-11"}]}
]'::jsonb, 9),

('rest-for-the-weary', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Rest for the Weary',
 'Overwhelmed and exhausted? Jesus invites the weary to find rest. Five days to rediscover Sabbath for your soul.',
 5, '[
  {"day": 1, "title": "Come to Me", "passages": [{"book": "Matthew", "chapter": 11, "verseStart": 25, "verseEnd": 30, "label": "Matthew 11:25-30"}]},
  {"day": 2, "title": "Cast Your Burden", "passages": [{"book": "Psalms", "chapter": 55, "verseStart": 1, "verseEnd": 23, "label": "Psalm 55:1-23"}]},
  {"day": 3, "title": "Show Me Your Glory", "passages": [{"book": "Exodus", "chapter": 33, "verseStart": 12, "verseEnd": 23, "label": "Exodus 33:12-23"}]},
  {"day": 4, "title": "Humble Yourselves", "passages": [{"book": "1 Peter", "chapter": 5, "verseStart": 6, "verseEnd": 11, "label": "1 Peter 5:6-11"}]},
  {"day": 5, "title": "Renewed Strength", "passages": [{"book": "Isaiah", "chapter": 40, "verseStart": 28, "verseEnd": 31, "label": "Isaiah 40:28-31"}]}
]'::jsonb, 10),

('the-art-of-waiting', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'The Art of Waiting',
 'Patience is not passive — it''s an active trust in God''s timing. Learn to wait well.',
 5, '[
  {"day": 1, "title": "Be Patient, Beloved", "passages": [{"book": "James", "chapter": 5, "verseStart": 7, "verseEnd": 11, "label": "James 5:7-11"}]},
  {"day": 2, "title": "Wait for the Lord", "passages": [{"book": "Psalms", "chapter": 27, "verseStart": 1, "verseEnd": 14, "label": "Psalm 27:1-14"}]},
  {"day": 3, "title": "The Groaning of Creation", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 18, "verseEnd": 28, "label": "Romans 8:18-28"}]},
  {"day": 4, "title": "They Shall Mount Up", "passages": [{"book": "Isaiah", "chapter": 40, "verseStart": 28, "verseEnd": 31, "label": "Isaiah 40:28-31"}]},
  {"day": 5, "title": "The Vision Awaits", "passages": [{"book": "Habakkuk", "chapter": 2, "verseStart": 1, "verseEnd": 4, "label": "Habakkuk 2:1-4"}]}
]'::jsonb, 11),

('comfort-in-sorrow', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Comfort in Sorrow',
 'For seasons of grief and loss — Scripture that meets you in the valley and walks with you through.',
 5, '[
  {"day": 1, "title": "Near to the Brokenhearted", "passages": [{"book": "Psalms", "chapter": 34, "verseStart": 15, "verseEnd": 22, "label": "Psalm 34:15-22"}]},
  {"day": 2, "title": "The God of All Comfort", "passages": [{"book": "2 Corinthians", "chapter": 1, "verseStart": 3, "verseEnd": 11, "label": "2 Corinthians 1:3-11"}]},
  {"day": 3, "title": "Jesus Wept", "passages": [{"book": "John", "chapter": 11, "verseStart": 17, "verseEnd": 44, "label": "John 11:17-44"}]},
  {"day": 4, "title": "No More Tears", "passages": [{"book": "Revelation", "chapter": 21, "verseStart": 1, "verseEnd": 7, "label": "Revelation 21:1-7"}]},
  {"day": 5, "title": "Through the Valley", "passages": [{"book": "Psalms", "chapter": 23, "verseStart": 1, "verseEnd": 6, "label": "Psalm 23"}]}
]'::jsonb, 12),

('from-envy-to-contentment', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'From Envy to Contentment',
 'Jealousy poisons from within. Discover how Scripture transforms comparison into contentment.',
 5, '[
  {"day": 1, "title": "Wisdom from Above", "passages": [{"book": "James", "chapter": 3, "verseStart": 13, "verseEnd": 18, "label": "James 3:13-18"}]},
  {"day": 2, "title": "The Secret of Contentment", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 10, "verseEnd": 20, "label": "Philippians 4:10-20"}]},
  {"day": 3, "title": "A Tranquil Heart", "passages": [{"book": "Proverbs", "chapter": 14, "verseStart": 30, "verseEnd": 30, "label": "Proverbs 14:30"}]},
  {"day": 4, "title": "Love Does Not Envy", "passages": [{"book": "1 Corinthians", "chapter": 13, "verseStart": 1, "verseEnd": 13, "label": "1 Corinthians 13:1-13"}]},
  {"day": 5, "title": "Fruit of the Spirit", "passages": [{"book": "Galatians", "chapter": 5, "verseStart": 16, "verseEnd": 26, "label": "Galatians 5:16-26"}]}
]'::jsonb, 13),

('choosing-joy', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Choosing Joy',
 'Joy is not the absence of suffering — it''s the presence of God. Five days to discover joy that circumstances can''t steal.',
 5, '[
  {"day": 1, "title": "Rejoice Always", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 4, "verseEnd": 9, "label": "Philippians 4:4-9"}]},
  {"day": 2, "title": "The Joy of the Lord", "passages": [{"book": "Nehemiah", "chapter": 8, "verseStart": 1, "verseEnd": 12, "label": "Nehemiah 8:1-12"}]},
  {"day": 3, "title": "Fullness of Joy", "passages": [{"book": "Psalms", "chapter": 16, "verseStart": 1, "verseEnd": 11, "label": "Psalm 16:1-11"}]},
  {"day": 4, "title": "Abide and Bear Fruit", "passages": [{"book": "John", "chapter": 15, "verseStart": 1, "verseEnd": 17, "label": "John 15:1-17"}]},
  {"day": 5, "title": "Count It All Joy", "passages": [{"book": "James", "chapter": 1, "verseStart": 1, "verseEnd": 12, "label": "James 1:1-12"}]}
]'::jsonb, 14),

('standing-firm', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Standing Firm',
 'Temptation is universal, but you are not defenseless. Arm yourself with Scripture and stand your ground.',
 5, '[
  {"day": 1, "title": "A Way of Escape", "passages": [{"book": "1 Corinthians", "chapter": 10, "verseStart": 1, "verseEnd": 13, "label": "1 Corinthians 10:1-13"}]},
  {"day": 2, "title": "Blessed Is the One Who Endures", "passages": [{"book": "James", "chapter": 1, "verseStart": 12, "verseEnd": 18, "label": "James 1:12-18"}]},
  {"day": 3, "title": "Jesus Was Tempted", "passages": [{"book": "Matthew", "chapter": 4, "verseStart": 1, "verseEnd": 11, "label": "Matthew 4:1-11"}]},
  {"day": 4, "title": "He Understands", "passages": [{"book": "Hebrews", "chapter": 2, "verseStart": 14, "verseEnd": 18, "label": "Hebrews 2:14-18"}]},
  {"day": 5, "title": "The Full Armor of God", "passages": [{"book": "Ephesians", "chapter": 6, "verseStart": 10, "verseEnd": 20, "label": "Ephesians 6:10-20"}]}
]'::jsonb, 15),

('the-humble-path', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'The Humble Path',
 'Pride blinds, but humility opens eyes. Walk the path that Jesus modeled and Scripture commends.',
 5, '[
  {"day": 1, "title": "He Humbled Himself", "passages": [{"book": "Philippians", "chapter": 2, "verseStart": 1, "verseEnd": 11, "label": "Philippians 2:1-11"}]},
  {"day": 2, "title": "Pride Goes Before a Fall", "passages": [{"book": "Proverbs", "chapter": 16, "verseStart": 1, "verseEnd": 9, "label": "Proverbs 16:1-9"}]},
  {"day": 3, "title": "Humble Yourselves", "passages": [{"book": "James", "chapter": 4, "verseStart": 1, "verseEnd": 10, "label": "James 4:1-10"}]},
  {"day": 4, "title": "The Pharisee and the Tax Collector", "passages": [{"book": "Luke", "chapter": 18, "verseStart": 9, "verseEnd": 14, "label": "Luke 18:9-14"}]},
  {"day": 5, "title": "What Does the Lord Require?", "passages": [{"book": "Micah", "chapter": 6, "verseStart": 6, "verseEnd": 8, "label": "Micah 6:6-8"}]}
]'::jsonb, 16),

('faith-through-questions', (SELECT id FROM plan_categories WHERE slug = 'emotions'),
 'Faith Through Questions',
 'Doubt is not the opposite of faith — it can be the doorway to deeper belief. Five days for the honest seeker.',
 5, '[
  {"day": 1, "title": "Help My Unbelief", "passages": [{"book": "Mark", "chapter": 9, "verseStart": 14, "verseEnd": 29, "label": "Mark 9:14-29"}]},
  {"day": 2, "title": "Unless I See", "passages": [{"book": "John", "chapter": 20, "verseStart": 24, "verseEnd": 31, "label": "John 20:24-31"}]},
  {"day": 3, "title": "Nearly Stumbled", "passages": [{"book": "Psalms", "chapter": 73, "verseStart": 1, "verseEnd": 28, "label": "Psalm 73:1-28"}]},
  {"day": 4, "title": "How Long, O Lord?", "passages": [{"book": "Habakkuk", "chapter": 1, "verseStart": 1, "verseEnd": 11, "label": "Habakkuk 1:1-11"}]},
  {"day": 5, "title": "The Substance of Things Hoped For", "passages": [{"book": "Hebrews", "chapter": 11, "verseStart": 1, "verseEnd": 16, "label": "Hebrews 11:1-16"}]}
]'::jsonb, 17),

-- ============================================================
-- Life & Relationships (3 plans)
-- ============================================================

('building-godly-relationships', (SELECT id FROM plan_categories WHERE slug = 'relationships'),
 'Building Godly Relationships',
 'From friendship to community, learn what Scripture teaches about relationships that honor God and strengthen each other.',
 5, '[
  {"day": 1, "title": "A Friend at All Times", "passages": [{"book": "Proverbs", "chapter": 17, "verseStart": 17, "verseEnd": 17, "label": "Proverbs 17:17"}, {"book": "Proverbs", "chapter": 18, "verseStart": 24, "verseEnd": 24, "label": "Proverbs 18:24"}]},
  {"day": 2, "title": "Love and Submission", "passages": [{"book": "Ephesians", "chapter": 5, "verseStart": 21, "verseEnd": 33, "label": "Ephesians 5:21-33"}]},
  {"day": 3, "title": "Where You Go, I Will Go", "passages": [{"book": "Ruth", "chapter": 1, "verseStart": 1, "verseEnd": 22, "label": "Ruth 1:1-22"}]},
  {"day": 4, "title": "Two Are Better Than One", "passages": [{"book": "Ecclesiastes", "chapter": 4, "verseStart": 9, "verseEnd": 12, "label": "Ecclesiastes 4:9-12"}]},
  {"day": 5, "title": "Encourage One Another", "passages": [{"book": "1 Thessalonians", "chapter": 5, "verseStart": 11, "verseEnd": 15, "label": "1 Thessalonians 5:11-15"}]}
]'::jsonb, 18),

('forgiveness-and-reconciliation', (SELECT id FROM plan_categories WHERE slug = 'relationships'),
 'Forgiveness & Reconciliation',
 'The hardest command and the most freeing gift — learn what it means to truly forgive as you have been forgiven.',
 5, '[
  {"day": 1, "title": "Seventy Times Seven", "passages": [{"book": "Matthew", "chapter": 18, "verseStart": 21, "verseEnd": 35, "label": "Matthew 18:21-35"}]},
  {"day": 2, "title": "Bearing with One Another", "passages": [{"book": "Colossians", "chapter": 3, "verseStart": 12, "verseEnd": 17, "label": "Colossians 3:12-17"}]},
  {"day": 3, "title": "Jacob and Esau Reconciled", "passages": [{"book": "Genesis", "chapter": 33, "verseStart": 1, "verseEnd": 17, "label": "Genesis 33:1-17"}]},
  {"day": 4, "title": "The Prodigal Son", "passages": [{"book": "Luke", "chapter": 15, "verseStart": 11, "verseEnd": 32, "label": "Luke 15:11-32"}]},
  {"day": 5, "title": "The Ministry of Reconciliation", "passages": [{"book": "2 Corinthians", "chapter": 5, "verseStart": 16, "verseEnd": 21, "label": "2 Corinthians 5:16-21"}]}
]'::jsonb, 19),

('covenant-love', (SELECT id FROM plan_categories WHERE slug = 'relationships'),
 'Covenant Love',
 'Marriage as God designed it — a covenant of sacrificial love, mutual respect, and lifelong commitment.',
 5, '[
  {"day": 1, "title": "It Is Not Good to Be Alone", "passages": [{"book": "Genesis", "chapter": 2, "verseStart": 18, "verseEnd": 25, "label": "Genesis 2:18-25"}]},
  {"day": 2, "title": "Love and Respect", "passages": [{"book": "Ephesians", "chapter": 5, "verseStart": 21, "verseEnd": 33, "label": "Ephesians 5:21-33"}]},
  {"day": 3, "title": "Love Never Fails", "passages": [{"book": "1 Corinthians", "chapter": 13, "verseStart": 1, "verseEnd": 13, "label": "1 Corinthians 13:1-13"}]},
  {"day": 4, "title": "Set Me as a Seal", "passages": [{"book": "Song of Solomon", "chapter": 8, "verseStart": 5, "verseEnd": 14, "label": "Song of Solomon 8:5-14"}]},
  {"day": 5, "title": "Heirs Together", "passages": [{"book": "1 Peter", "chapter": 3, "verseStart": 1, "verseEnd": 12, "label": "1 Peter 3:1-12"}]}
]'::jsonb, 20),

-- ============================================================
-- Faith Foundations (3 plans)
-- ============================================================

('first-steps', (SELECT id FROM plan_categories WHERE slug = 'faith-foundations'),
 'First Steps',
 'New to faith? Start here. Seven days that cover the essentials of what it means to follow Jesus.',
 7, '[
  {"day": 1, "title": "Born Again", "passages": [{"book": "John", "chapter": 3, "verseStart": 1, "verseEnd": 21, "label": "John 3:1-21"}]},
  {"day": 2, "title": "Justified by Faith", "passages": [{"book": "Romans", "chapter": 3, "verseStart": 21, "verseEnd": 31, "label": "Romans 3:21-31"}]},
  {"day": 3, "title": "Saved by Grace", "passages": [{"book": "Ephesians", "chapter": 2, "verseStart": 1, "verseEnd": 10, "label": "Ephesians 2:1-10"}]},
  {"day": 4, "title": "Life in the Spirit", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 1, "verseEnd": 17, "label": "Romans 8:1-17"}]},
  {"day": 5, "title": "New Creation", "passages": [{"book": "2 Corinthians", "chapter": 5, "verseStart": 16, "verseEnd": 21, "label": "2 Corinthians 5:16-21"}]},
  {"day": 6, "title": "The Good Shepherd", "passages": [{"book": "John", "chapter": 10, "verseStart": 1, "verseEnd": 18, "label": "John 10:1-18"}]},
  {"day": 7, "title": "He Who Began a Good Work", "passages": [{"book": "Philippians", "chapter": 1, "verseStart": 3, "verseEnd": 11, "label": "Philippians 1:3-11"}]}
]'::jsonb, 21),

('learning-to-pray', (SELECT id FROM plan_categories WHERE slug = 'faith-foundations'),
 'Learning to Pray',
 'Prayer isn''t complicated — it''s a conversation with your Creator. Five days to build a prayer life that transforms you.',
 5, '[
  {"day": 1, "title": "The Lord''s Prayer", "passages": [{"book": "Matthew", "chapter": 6, "verseStart": 5, "verseEnd": 15, "label": "Matthew 6:5-15"}]},
  {"day": 2, "title": "Ask, Seek, Knock", "passages": [{"book": "Luke", "chapter": 11, "verseStart": 1, "verseEnd": 13, "label": "Luke 11:1-13"}]},
  {"day": 3, "title": "Pray Without Ceasing", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 4, "verseEnd": 9, "label": "Philippians 4:4-9"}]},
  {"day": 4, "title": "The Prayer of Faith", "passages": [{"book": "James", "chapter": 5, "verseStart": 13, "verseEnd": 18, "label": "James 5:13-18"}]},
  {"day": 5, "title": "My Soul Waits", "passages": [{"book": "Psalms", "chapter": 62, "verseStart": 1, "verseEnd": 12, "label": "Psalm 62:1-12"}]}
]'::jsonb, 22),

('learning-to-trust-god', (SELECT id FROM plan_categories WHERE slug = 'faith-foundations'),
 'Learning to Trust God',
 'Trust is the foundation of faith. Five passages that teach us to lean not on our own understanding.',
 5, '[
  {"day": 1, "title": "Trust with All Your Heart", "passages": [{"book": "Proverbs", "chapter": 3, "verseStart": 1, "verseEnd": 12, "label": "Proverbs 3:1-12"}]},
  {"day": 2, "title": "Delight in the Lord", "passages": [{"book": "Psalms", "chapter": 37, "verseStart": 1, "verseEnd": 11, "label": "Psalm 37:1-11"}]},
  {"day": 3, "title": "Perfect Peace", "passages": [{"book": "Isaiah", "chapter": 26, "verseStart": 1, "verseEnd": 9, "label": "Isaiah 26:1-9"}]},
  {"day": 4, "title": "Trusting Through Trials", "passages": [{"book": "2 Corinthians", "chapter": 1, "verseStart": 8, "verseEnd": 11, "label": "2 Corinthians 1:8-11"}]},
  {"day": 5, "title": "In God I Trust", "passages": [{"book": "Psalms", "chapter": 56, "verseStart": 1, "verseEnd": 13, "label": "Psalm 56:1-13"}]}
]'::jsonb, 23),

-- ============================================================
-- Seasonal (4 plans)
-- ============================================================

('40-days-to-the-cross', (SELECT id FROM plan_categories WHERE slug = 'seasonal'),
 '40 Days to the Cross',
 'Journey with Jesus from the wilderness to the empty tomb — the most important week in human history.',
 7, '[
  {"day": 1, "title": "The Wilderness", "passages": [{"book": "Matthew", "chapter": 4, "verseStart": 1, "verseEnd": 11, "label": "Matthew 4:1-11"}]},
  {"day": 2, "title": "The Suffering Servant", "passages": [{"book": "Isaiah", "chapter": 53, "verseStart": 1, "verseEnd": 12, "label": "Isaiah 53:1-12"}]},
  {"day": 3, "title": "The Last Supper", "passages": [{"book": "John", "chapter": 13, "verseStart": 1, "verseEnd": 17, "label": "John 13:1-17"}]},
  {"day": 4, "title": "Gethsemane", "passages": [{"book": "Luke", "chapter": 22, "verseStart": 39, "verseEnd": 53, "label": "Luke 22:39-53"}]},
  {"day": 5, "title": "The Crucifixion", "passages": [{"book": "Mark", "chapter": 15, "verseStart": 21, "verseEnd": 41, "label": "Mark 15:21-41"}]},
  {"day": 6, "title": "The Burial", "passages": [{"book": "Matthew", "chapter": 27, "verseStart": 57, "verseEnd": 66, "label": "Matthew 27:57-66"}]},
  {"day": 7, "title": "He Is Risen", "passages": [{"book": "John", "chapter": 20, "verseStart": 1, "verseEnd": 18, "label": "John 20:1-18"}]}
]'::jsonb, 24),

('the-resurrection-hope', (SELECT id FROM plan_categories WHERE slug = 'seasonal'),
 'The Resurrection Hope',
 'Death is not the end. Five days exploring the power of Christ''s resurrection and what it means for you.',
 5, '[
  {"day": 1, "title": "Christ Is Risen", "passages": [{"book": "1 Corinthians", "chapter": 15, "verseStart": 1, "verseEnd": 22, "label": "1 Corinthians 15:1-22"}]},
  {"day": 2, "title": "Dead to Sin, Alive in Christ", "passages": [{"book": "Romans", "chapter": 6, "verseStart": 1, "verseEnd": 14, "label": "Romans 6:1-14"}]},
  {"day": 3, "title": "Raised with Christ", "passages": [{"book": "Colossians", "chapter": 3, "verseStart": 1, "verseEnd": 17, "label": "Colossians 3:1-17"}]},
  {"day": 4, "title": "I Am the Resurrection", "passages": [{"book": "John", "chapter": 11, "verseStart": 17, "verseEnd": 44, "label": "John 11:17-44"}]},
  {"day": 5, "title": "The Living One", "passages": [{"book": "Revelation", "chapter": 1, "verseStart": 9, "verseEnd": 20, "label": "Revelation 1:9-20"}]}
]'::jsonb, 25),

('waiting-for-the-messiah', (SELECT id FROM plan_categories WHERE slug = 'seasonal'),
 'Waiting for the Messiah',
 'Advent is a season of anticipation. Walk through the prophecies and promises that led to a manger in Bethlehem.',
 5, '[
  {"day": 1, "title": "A Light Has Dawned", "passages": [{"book": "Isaiah", "chapter": 9, "verseStart": 1, "verseEnd": 7, "label": "Isaiah 9:1-7"}]},
  {"day": 2, "title": "Out of Bethlehem", "passages": [{"book": "Micah", "chapter": 5, "verseStart": 1, "verseEnd": 5, "label": "Micah 5:1-5"}]},
  {"day": 3, "title": "The Magnificat", "passages": [{"book": "Luke", "chapter": 1, "verseStart": 26, "verseEnd": 56, "label": "Luke 1:26-56"}]},
  {"day": 4, "title": "Joseph''s Dream", "passages": [{"book": "Matthew", "chapter": 1, "verseStart": 18, "verseEnd": 25, "label": "Matthew 1:18-25"}]},
  {"day": 5, "title": "Born in Bethlehem", "passages": [{"book": "Luke", "chapter": 2, "verseStart": 1, "verseEnd": 20, "label": "Luke 2:1-20"}]}
]'::jsonb, 26),

('a-grateful-heart', (SELECT id FROM plan_categories WHERE slug = 'seasonal'),
 'A Grateful Heart',
 'Gratitude transforms everything. Five days of Scripture that cultivate a thankful spirit in every season.',
 5, '[
  {"day": 1, "title": "Make a Joyful Noise", "passages": [{"book": "Psalms", "chapter": 100, "verseStart": 1, "verseEnd": 5, "label": "Psalm 100"}]},
  {"day": 2, "title": "Give Thanks in Everything", "passages": [{"book": "1 Thessalonians", "chapter": 5, "verseStart": 16, "verseEnd": 24, "label": "1 Thessalonians 5:16-24"}]},
  {"day": 3, "title": "With Thanksgiving", "passages": [{"book": "Colossians", "chapter": 3, "verseStart": 12, "verseEnd": 17, "label": "Colossians 3:12-17"}]},
  {"day": 4, "title": "His Love Endures Forever", "passages": [{"book": "Psalms", "chapter": 136, "verseStart": 1, "verseEnd": 26, "label": "Psalm 136:1-26"}]},
  {"day": 5, "title": "I Have Learned to Be Content", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 10, "verseEnd": 20, "label": "Philippians 4:10-20"}]}
]'::jsonb, 27),

-- ============================================================
-- Book Studies (7 plans)
-- ============================================================

('the-prophets-vision', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'The Prophet''s Vision',
 'Isaiah saw the throne of God and spoke of a coming Messiah. Seven key passages from the greatest of the prophets.',
 7, '[
  {"day": 1, "title": "A Sinful Nation", "passages": [{"book": "Isaiah", "chapter": 1, "verseStart": 1, "verseEnd": 20, "label": "Isaiah 1:1-20"}]},
  {"day": 2, "title": "Holy, Holy, Holy", "passages": [{"book": "Isaiah", "chapter": 6, "verseStart": 1, "verseEnd": 13, "label": "Isaiah 6:1-13"}]},
  {"day": 3, "title": "A Child Is Born", "passages": [{"book": "Isaiah", "chapter": 9, "verseStart": 1, "verseEnd": 7, "label": "Isaiah 9:1-7"}]},
  {"day": 4, "title": "Comfort My People", "passages": [{"book": "Isaiah", "chapter": 40, "verseStart": 1, "verseEnd": 11, "label": "Isaiah 40:1-11"}]},
  {"day": 5, "title": "The Suffering Servant", "passages": [{"book": "Isaiah", "chapter": 53, "verseStart": 1, "verseEnd": 12, "label": "Isaiah 53:1-12"}]},
  {"day": 6, "title": "Come, Everyone Who Thirsts", "passages": [{"book": "Isaiah", "chapter": 55, "verseStart": 1, "verseEnd": 13, "label": "Isaiah 55:1-13"}]},
  {"day": 7, "title": "The Spirit of the Lord", "passages": [{"book": "Isaiah", "chapter": 61, "verseStart": 1, "verseEnd": 11, "label": "Isaiah 61:1-11"}]}
]'::jsonb, 28),

('the-kingdom-of-heaven', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'The Kingdom of Heaven',
 'Matthew presents Jesus as the promised King. Seven passages that reveal what his Kingdom looks like.',
 7, '[
  {"day": 1, "title": "Salt and Light", "passages": [{"book": "Matthew", "chapter": 5, "verseStart": 1, "verseEnd": 16, "label": "Matthew 5:1-16"}]},
  {"day": 2, "title": "Do Not Worry", "passages": [{"book": "Matthew", "chapter": 6, "verseStart": 25, "verseEnd": 34, "label": "Matthew 6:25-34"}]},
  {"day": 3, "title": "The Sower and the Seed", "passages": [{"book": "Matthew", "chapter": 13, "verseStart": 1, "verseEnd": 23, "label": "Matthew 13:1-23"}]},
  {"day": 4, "title": "Walking on Water", "passages": [{"book": "Matthew", "chapter": 14, "verseStart": 22, "verseEnd": 36, "label": "Matthew 14:22-36"}]},
  {"day": 5, "title": "Who Do You Say I Am?", "passages": [{"book": "Matthew", "chapter": 16, "verseStart": 13, "verseEnd": 28, "label": "Matthew 16:13-28"}]},
  {"day": 6, "title": "The Sheep and the Goats", "passages": [{"book": "Matthew", "chapter": 25, "verseStart": 31, "verseEnd": 46, "label": "Matthew 25:31-46"}]},
  {"day": 7, "title": "The Great Commission", "passages": [{"book": "Matthew", "chapter": 28, "verseStart": 1, "verseEnd": 20, "label": "Matthew 28:1-20"}]}
]'::jsonb, 29),

('songs-for-every-season', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'Songs for Every Season',
 'The Psalms give voice to every human emotion — praise, lament, gratitude, and hope. Seven psalms that cover them all.',
 7, '[
  {"day": 1, "title": "The Blessed Life", "passages": [{"book": "Psalms", "chapter": 1, "verseStart": 1, "verseEnd": 6, "label": "Psalm 1"}]},
  {"day": 2, "title": "The Good Shepherd", "passages": [{"book": "Psalms", "chapter": 23, "verseStart": 1, "verseEnd": 6, "label": "Psalm 23"}]},
  {"day": 3, "title": "A Broken Spirit", "passages": [{"book": "Psalms", "chapter": 51, "verseStart": 1, "verseEnd": 19, "label": "Psalm 51"}]},
  {"day": 4, "title": "Our Dwelling Place", "passages": [{"book": "Psalms", "chapter": 90, "verseStart": 1, "verseEnd": 17, "label": "Psalm 90"}]},
  {"day": 5, "title": "Bless the Lord, O My Soul", "passages": [{"book": "Psalms", "chapter": 103, "verseStart": 1, "verseEnd": 22, "label": "Psalm 103"}]},
  {"day": 6, "title": "Your Word Is a Lamp", "passages": [{"book": "Psalms", "chapter": 119, "verseStart": 1, "verseEnd": 32, "label": "Psalm 119:1-32"}]},
  {"day": 7, "title": "You Know Me", "passages": [{"book": "Psalms", "chapter": 139, "verseStart": 1, "verseEnd": 24, "label": "Psalm 139"}]}
]'::jsonb, 30),

('the-gospel-explained', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'The Gospel Explained',
 'Paul''s letter to Rome is the most systematic explanation of the gospel ever written. Seven passages that changed the world.',
 7, '[
  {"day": 1, "title": "The Power of the Gospel", "passages": [{"book": "Romans", "chapter": 1, "verseStart": 16, "verseEnd": 32, "label": "Romans 1:16-32"}]},
  {"day": 2, "title": "Righteousness Through Faith", "passages": [{"book": "Romans", "chapter": 3, "verseStart": 21, "verseEnd": 31, "label": "Romans 3:21-31"}]},
  {"day": 3, "title": "Peace with God", "passages": [{"book": "Romans", "chapter": 5, "verseStart": 1, "verseEnd": 11, "label": "Romans 5:1-11"}]},
  {"day": 4, "title": "Dead to Sin", "passages": [{"book": "Romans", "chapter": 6, "verseStart": 1, "verseEnd": 14, "label": "Romans 6:1-14"}]},
  {"day": 5, "title": "No Condemnation", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 1, "verseEnd": 17, "label": "Romans 8:1-17"}]},
  {"day": 6, "title": "More Than Conquerors", "passages": [{"book": "Romans", "chapter": 8, "verseStart": 28, "verseEnd": 39, "label": "Romans 8:28-39"}]},
  {"day": 7, "title": "Living Sacrifice", "passages": [{"book": "Romans", "chapter": 12, "verseStart": 1, "verseEnd": 21, "label": "Romans 12:1-21"}]}
]'::jsonb, 31),

('in-the-beginning', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'In the Beginning',
 'Genesis is where it all starts — creation, fall, flood, and covenant. Seven days through the book of origins.',
 7, '[
  {"day": 1, "title": "Creation", "passages": [{"book": "Genesis", "chapter": 1, "verseStart": 1, "verseEnd": 31, "label": "Genesis 1:1-31"}]},
  {"day": 2, "title": "The Garden", "passages": [{"book": "Genesis", "chapter": 2, "verseStart": 4, "verseEnd": 25, "label": "Genesis 2:4-25"}]},
  {"day": 3, "title": "The Fall", "passages": [{"book": "Genesis", "chapter": 3, "verseStart": 1, "verseEnd": 24, "label": "Genesis 3:1-24"}]},
  {"day": 4, "title": "The Flood", "passages": [{"book": "Genesis", "chapter": 6, "verseStart": 5, "verseEnd": 22, "label": "Genesis 6:5-22"}]},
  {"day": 5, "title": "The Call of Abraham", "passages": [{"book": "Genesis", "chapter": 12, "verseStart": 1, "verseEnd": 9, "label": "Genesis 12:1-9"}]},
  {"day": 6, "title": "The Binding of Isaac", "passages": [{"book": "Genesis", "chapter": 22, "verseStart": 1, "verseEnd": 19, "label": "Genesis 22:1-19"}]},
  {"day": 7, "title": "Jacob''s Ladder", "passages": [{"book": "Genesis", "chapter": 28, "verseStart": 10, "verseEnd": 22, "label": "Genesis 28:10-22"}]}
]'::jsonb, 32),

('the-word-made-flesh', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'The Word Made Flesh',
 'John''s Gospel reveals Jesus as the eternal Word become flesh. Seven encounters that will change how you see him.',
 7, '[
  {"day": 1, "title": "In the Beginning Was the Word", "passages": [{"book": "John", "chapter": 1, "verseStart": 1, "verseEnd": 18, "label": "John 1:1-18"}]},
  {"day": 2, "title": "You Must Be Born Again", "passages": [{"book": "John", "chapter": 3, "verseStart": 1, "verseEnd": 21, "label": "John 3:1-21"}]},
  {"day": 3, "title": "The Woman at the Well", "passages": [{"book": "John", "chapter": 4, "verseStart": 1, "verseEnd": 42, "label": "John 4:1-42"}]},
  {"day": 4, "title": "The Bread of Life", "passages": [{"book": "John", "chapter": 6, "verseStart": 25, "verseEnd": 59, "label": "John 6:25-59"}]},
  {"day": 5, "title": "The Good Shepherd", "passages": [{"book": "John", "chapter": 10, "verseStart": 1, "verseEnd": 18, "label": "John 10:1-18"}]},
  {"day": 6, "title": "The Way, the Truth, the Life", "passages": [{"book": "John", "chapter": 14, "verseStart": 1, "verseEnd": 21, "label": "John 14:1-21"}]},
  {"day": 7, "title": "The True Vine", "passages": [{"book": "John", "chapter": 15, "verseStart": 1, "verseEnd": 17, "label": "John 15:1-17"}]}
]'::jsonb, 33),

('wisdom-for-living', (SELECT id FROM plan_categories WHERE slug = 'book-studies'),
 'Wisdom for Living',
 'Proverbs is the Bible''s practical guide to daily life. Five days of ancient wisdom that''s still sharp today.',
 5, '[
  {"day": 1, "title": "The Beginning of Wisdom", "passages": [{"book": "Proverbs", "chapter": 1, "verseStart": 1, "verseEnd": 7, "label": "Proverbs 1:1-7"}, {"book": "Proverbs", "chapter": 2, "verseStart": 1, "verseEnd": 15, "label": "Proverbs 2:1-15"}]},
  {"day": 2, "title": "Trust in the Lord", "passages": [{"book": "Proverbs", "chapter": 3, "verseStart": 1, "verseEnd": 26, "label": "Proverbs 3:1-26"}]},
  {"day": 3, "title": "Wisdom Calls Out", "passages": [{"book": "Proverbs", "chapter": 8, "verseStart": 1, "verseEnd": 21, "label": "Proverbs 8:1-21"}]},
  {"day": 4, "title": "Words That Heal", "passages": [{"book": "Proverbs", "chapter": 15, "verseStart": 1, "verseEnd": 23, "label": "Proverbs 15:1-23"}]},
  {"day": 5, "title": "The Excellent Woman", "passages": [{"book": "Proverbs", "chapter": 31, "verseStart": 10, "verseEnd": 31, "label": "Proverbs 31:10-31"}]}
]'::jsonb, 34),

-- ============================================================
-- Topical Themes (10 plans)
-- ============================================================

('conversations-with-god', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Conversations with God',
 'Prayer warriors of the Bible show us how to talk with God — boldly, honestly, and persistently.',
 5, '[
  {"day": 1, "title": "The Lord''s Prayer", "passages": [{"book": "Matthew", "chapter": 6, "verseStart": 5, "verseEnd": 15, "label": "Matthew 6:5-15"}]},
  {"day": 2, "title": "Daniel''s Faithfulness", "passages": [{"book": "Daniel", "chapter": 6, "verseStart": 1, "verseEnd": 23, "label": "Daniel 6:1-23"}]},
  {"day": 3, "title": "Elijah on Carmel", "passages": [{"book": "1 Kings", "chapter": 18, "verseStart": 20, "verseEnd": 40, "label": "1 Kings 18:20-40"}]},
  {"day": 4, "title": "The Early Church Prays", "passages": [{"book": "Acts", "chapter": 4, "verseStart": 23, "verseEnd": 37, "label": "Acts 4:23-37"}]},
  {"day": 5, "title": "Pour Out Your Heart", "passages": [{"book": "Psalms", "chapter": 62, "verseStart": 1, "verseEnd": 12, "label": "Psalm 62:1-12"}]}
]'::jsonb, 35),

('seeking-wisdom', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Seeking Wisdom',
 'In a world full of noise, true wisdom is a gift from God. Five days learning to seek it above all else.',
 5, '[
  {"day": 1, "title": "Seek and You Will Find", "passages": [{"book": "Proverbs", "chapter": 2, "verseStart": 1, "verseEnd": 15, "label": "Proverbs 2:1-15"}]},
  {"day": 2, "title": "Ask God for Wisdom", "passages": [{"book": "James", "chapter": 1, "verseStart": 1, "verseEnd": 12, "label": "James 1:1-12"}]},
  {"day": 3, "title": "Solomon''s Request", "passages": [{"book": "1 Kings", "chapter": 3, "verseStart": 5, "verseEnd": 15, "label": "1 Kings 3:5-15"}]},
  {"day": 4, "title": "A Time for Everything", "passages": [{"book": "Ecclesiastes", "chapter": 3, "verseStart": 1, "verseEnd": 15, "label": "Ecclesiastes 3:1-15"}]},
  {"day": 5, "title": "Wisdom from Above", "passages": [{"book": "James", "chapter": 3, "verseStart": 13, "verseEnd": 18, "label": "James 3:13-18"}]}
]'::jsonb, 36),

('finding-your-calling', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Finding Your Calling',
 'What is God''s purpose for your life? Five passages about people who discovered their calling — and answered it.',
 5, '[
  {"day": 1, "title": "Plans to Give You a Future", "passages": [{"book": "Jeremiah", "chapter": 29, "verseStart": 10, "verseEnd": 14, "label": "Jeremiah 29:10-14"}]},
  {"day": 2, "title": "Created for Good Works", "passages": [{"book": "Ephesians", "chapter": 2, "verseStart": 1, "verseEnd": 10, "label": "Ephesians 2:1-10"}]},
  {"day": 3, "title": "Present Your Bodies", "passages": [{"book": "Romans", "chapter": 12, "verseStart": 1, "verseEnd": 21, "label": "Romans 12:1-21"}]},
  {"day": 4, "title": "For Such a Time as This", "passages": [{"book": "Esther", "chapter": 4, "verseStart": 1, "verseEnd": 17, "label": "Esther 4:1-17"}]},
  {"day": 5, "title": "Here Am I, Send Me", "passages": [{"book": "Isaiah", "chapter": 6, "verseStart": 1, "verseEnd": 13, "label": "Isaiah 6:1-13"}]}
]'::jsonb, 37),

('counting-blessings', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Counting Blessings',
 'A grateful heart sees God''s hand in everything. Five days of learning to count your blessings, one by one.',
 5, '[
  {"day": 1, "title": "His Love Endures Forever", "passages": [{"book": "Psalms", "chapter": 136, "verseStart": 1, "verseEnd": 26, "label": "Psalm 136:1-26"}]},
  {"day": 2, "title": "Rejoice Always", "passages": [{"book": "1 Thessalonians", "chapter": 5, "verseStart": 16, "verseEnd": 24, "label": "1 Thessalonians 5:16-24"}]},
  {"day": 3, "title": "The Ten Lepers", "passages": [{"book": "Luke", "chapter": 17, "verseStart": 11, "verseEnd": 19, "label": "Luke 17:11-19"}]},
  {"day": 4, "title": "Content in All Circumstances", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 10, "verseEnd": 20, "label": "Philippians 4:10-20"}]},
  {"day": 5, "title": "Forget Not His Benefits", "passages": [{"book": "Psalms", "chapter": 103, "verseStart": 1, "verseEnd": 14, "label": "Psalm 103:1-14"}]}
]'::jsonb, 38),

('leading-like-jesus', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Leading Like Jesus',
 'True leadership is service. Learn from Jesus and the Bible''s greatest leaders what it means to lead with humility.',
 5, '[
  {"day": 1, "title": "The Servant Leader", "passages": [{"book": "Mark", "chapter": 10, "verseStart": 35, "verseEnd": 45, "label": "Mark 10:35-45"}]},
  {"day": 2, "title": "Nehemiah''s Vision", "passages": [{"book": "Nehemiah", "chapter": 2, "verseStart": 1, "verseEnd": 20, "label": "Nehemiah 2:1-20"}]},
  {"day": 3, "title": "Qualifications of a Leader", "passages": [{"book": "1 Timothy", "chapter": 3, "verseStart": 1, "verseEnd": 13, "label": "1 Timothy 3:1-13"}]},
  {"day": 4, "title": "Washing Feet", "passages": [{"book": "John", "chapter": 13, "verseStart": 1, "verseEnd": 17, "label": "John 13:1-17"}]},
  {"day": 5, "title": "Be Strong and Courageous", "passages": [{"book": "Joshua", "chapter": 1, "verseStart": 1, "verseEnd": 9, "label": "Joshua 1:1-9"}]}
]'::jsonb, 39),

('who-god-says-you-are', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Who God Says You Are',
 'The world tells you who to be, but God already declared who you are. Five days discovering your true identity in Christ.',
 5, '[
  {"day": 1, "title": "Wonderfully Made", "passages": [{"book": "Psalms", "chapter": 139, "verseStart": 1, "verseEnd": 18, "label": "Psalm 139:1-18"}]},
  {"day": 2, "title": "Blessed in Christ", "passages": [{"book": "Ephesians", "chapter": 1, "verseStart": 3, "verseEnd": 14, "label": "Ephesians 1:3-14"}]},
  {"day": 3, "title": "A Royal Priesthood", "passages": [{"book": "1 Peter", "chapter": 2, "verseStart": 1, "verseEnd": 12, "label": "1 Peter 2:1-12"}]},
  {"day": 4, "title": "A New Creation", "passages": [{"book": "2 Corinthians", "chapter": 5, "verseStart": 16, "verseEnd": 21, "label": "2 Corinthians 5:16-21"}]},
  {"day": 5, "title": "Crucified with Christ", "passages": [{"book": "Galatians", "chapter": 2, "verseStart": 15, "verseEnd": 21, "label": "Galatians 2:15-21"}]}
]'::jsonb, 40),

('heroes-of-faith', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Heroes of Faith',
 'From Abraham to Daniel, ordinary people who trusted God in extraordinary circumstances. Their stories will inspire yours.',
 7, '[
  {"day": 1, "title": "The Faith Hall of Fame", "passages": [{"book": "Hebrews", "chapter": 11, "verseStart": 1, "verseEnd": 16, "label": "Hebrews 11:1-16"}]},
  {"day": 2, "title": "Abraham''s Sacrifice", "passages": [{"book": "Genesis", "chapter": 22, "verseStart": 1, "verseEnd": 19, "label": "Genesis 22:1-19"}]},
  {"day": 3, "title": "Crossing the Red Sea", "passages": [{"book": "Exodus", "chapter": 14, "verseStart": 10, "verseEnd": 31, "label": "Exodus 14:10-31"}]},
  {"day": 4, "title": "The Walls of Jericho", "passages": [{"book": "Joshua", "chapter": 6, "verseStart": 1, "verseEnd": 21, "label": "Joshua 6:1-21"}]},
  {"day": 5, "title": "The Fiery Furnace", "passages": [{"book": "Daniel", "chapter": 3, "verseStart": 1, "verseEnd": 30, "label": "Daniel 3:1-30"}]},
  {"day": 6, "title": "By Faith They Conquered", "passages": [{"book": "Hebrews", "chapter": 11, "verseStart": 17, "verseEnd": 40, "label": "Hebrews 11:17-40"}]},
  {"day": 7, "title": "The Father of Faith", "passages": [{"book": "Romans", "chapter": 4, "verseStart": 1, "verseEnd": 25, "label": "Romans 4:1-25"}]}
]'::jsonb, 41),

('strength-in-weakness', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'Strength in Weakness',
 'God''s power is made perfect in weakness. Five stories of people who found supernatural strength in their frailty.',
 5, '[
  {"day": 1, "title": "My Grace Is Sufficient", "passages": [{"book": "2 Corinthians", "chapter": 12, "verseStart": 1, "verseEnd": 10, "label": "2 Corinthians 12:1-10"}]},
  {"day": 2, "title": "Wings Like Eagles", "passages": [{"book": "Isaiah", "chapter": 40, "verseStart": 28, "verseEnd": 31, "label": "Isaiah 40:28-31"}]},
  {"day": 3, "title": "I Can Do All Things", "passages": [{"book": "Philippians", "chapter": 4, "verseStart": 10, "verseEnd": 20, "label": "Philippians 4:10-20"}]},
  {"day": 4, "title": "Gideon''s 300", "passages": [{"book": "Judges", "chapter": 7, "verseStart": 1, "verseEnd": 22, "label": "Judges 7:1-22"}]},
  {"day": 5, "title": "The Lord Is My Strength", "passages": [{"book": "Psalms", "chapter": 18, "verseStart": 1, "verseEnd": 19, "label": "Psalm 18:1-19"}]}
]'::jsonb, 42),

('the-obedient-heart', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'The Obedient Heart',
 'Obedience isn''t about rules — it''s about relationship. Five passages on what it means to say "yes" to God.',
 5, '[
  {"day": 1, "title": "Love the Lord Your God", "passages": [{"book": "Deuteronomy", "chapter": 6, "verseStart": 1, "verseEnd": 12, "label": "Deuteronomy 6:1-12"}]},
  {"day": 2, "title": "To Obey Is Better Than Sacrifice", "passages": [{"book": "1 Samuel", "chapter": 15, "verseStart": 1, "verseEnd": 23, "label": "1 Samuel 15:1-23"}]},
  {"day": 3, "title": "Put Out into Deep Water", "passages": [{"book": "Luke", "chapter": 5, "verseStart": 1, "verseEnd": 11, "label": "Luke 5:1-11"}]},
  {"day": 4, "title": "If You Love Me, Keep My Commands", "passages": [{"book": "John", "chapter": 14, "verseStart": 15, "verseEnd": 27, "label": "John 14:15-27"}]},
  {"day": 5, "title": "Be Doers of the Word", "passages": [{"book": "James", "chapter": 1, "verseStart": 19, "verseEnd": 27, "label": "James 1:19-27"}]}
]'::jsonb, 43),

('god-in-the-storm', (SELECT id FROM plan_categories WHERE slug = 'topical'),
 'God in the Storm',
 'Suffering is not the absence of God — sometimes it''s where we find him most. Five days for those enduring trials.',
 5, '[
  {"day": 1, "title": "The Lord Gave, the Lord Took", "passages": [{"book": "Job", "chapter": 1, "verseStart": 1, "verseEnd": 22, "label": "Job 1:1-22"}]},
  {"day": 2, "title": "Treasures in Jars of Clay", "passages": [{"book": "2 Corinthians", "chapter": 4, "verseStart": 7, "verseEnd": 18, "label": "2 Corinthians 4:7-18"}]},
  {"day": 3, "title": "Sharing in His Sufferings", "passages": [{"book": "1 Peter", "chapter": 4, "verseStart": 12, "verseEnd": 19, "label": "1 Peter 4:12-19"}]},
  {"day": 4, "title": "Suffering Produces Character", "passages": [{"book": "Romans", "chapter": 5, "verseStart": 1, "verseEnd": 11, "label": "Romans 5:1-11"}]},
  {"day": 5, "title": "Those Who Sow in Tears", "passages": [{"book": "Psalms", "chapter": 126, "verseStart": 1, "verseEnd": 6, "label": "Psalm 126"}]}
]'::jsonb, 44)

ON CONFLICT (slug) DO NOTHING;
