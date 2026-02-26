-- Journey seed data: 8 curated story journeys
-- Run after 002_phase2_schema.sql migration

INSERT INTO journeys (slug, title, description, cover_image, era, passages, sort_order) VALUES

('life-of-jesus', 'The Life of Jesus',
 'Walk through the most transformative life ever lived — from a humble birth in Bethlehem to the empty tomb that changed everything.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Jesus',
 '[
   {"book": "Luke", "chapter": 2, "verseStart": 1, "verseEnd": 20, "label": "Born in Bethlehem"},
   {"book": "Matthew", "chapter": 3, "verseStart": 13, "verseEnd": 17, "label": "Baptism by John"},
   {"book": "Matthew", "chapter": 4, "verseStart": 1, "verseEnd": 11, "label": "Temptation in the Wilderness"},
   {"book": "Matthew", "chapter": 5, "verseStart": 1, "verseEnd": 16, "label": "The Sermon on the Mount"},
   {"book": "John", "chapter": 6, "verseStart": 1, "verseEnd": 14, "label": "Feeding the Five Thousand"},
   {"book": "John", "chapter": 11, "verseStart": 1, "verseEnd": 44, "label": "Raising Lazarus"},
   {"book": "Matthew", "chapter": 26, "verseStart": 36, "verseEnd": 46, "label": "Gethsemane"},
   {"book": "Luke", "chapter": 23, "verseStart": 33, "verseEnd": 46, "label": "The Crucifixion"},
   {"book": "Matthew", "chapter": 28, "verseStart": 1, "verseEnd": 10, "label": "The Resurrection"}
 ]'::jsonb, 1),

('creation-to-covenant', 'Creation to Covenant',
 'From the first words God ever spoke to the ultimate test of faith on Mount Moriah — discover how it all began.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Creation',
 '[
   {"book": "Genesis", "chapter": 1, "verseStart": 1, "verseEnd": 31, "label": "Creation of the World"},
   {"book": "Genesis", "chapter": 2, "verseStart": 7, "verseEnd": 25, "label": "Adam and Eve in Eden"},
   {"book": "Genesis", "chapter": 3, "verseStart": 1, "verseEnd": 24, "label": "The Fall"},
   {"book": "Genesis", "chapter": 6, "verseStart": 9, "verseEnd": 22, "label": "Noah and the Ark"},
   {"book": "Genesis", "chapter": 9, "verseStart": 8, "verseEnd": 17, "label": "The Rainbow Covenant"},
   {"book": "Genesis", "chapter": 12, "verseStart": 1, "verseEnd": 9, "label": "The Call of Abraham"},
   {"book": "Genesis", "chapter": 15, "verseStart": 1, "verseEnd": 21, "label": "God''s Promise to Abraham"},
   {"book": "Genesis", "chapter": 22, "verseStart": 1, "verseEnd": 19, "label": "The Binding of Isaac"}
 ]'::jsonb, 2),

('the-exodus-story', 'The Exodus Story',
 'Slavery, plagues, a parted sea, and a pillar of fire — the most dramatic rescue operation in history.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Exodus',
 '[
   {"book": "Exodus", "chapter": 1, "verseStart": 8, "verseEnd": 22, "label": "Israel Enslaved in Egypt"},
   {"book": "Exodus", "chapter": 2, "verseStart": 1, "verseEnd": 10, "label": "The Birth of Moses"},
   {"book": "Exodus", "chapter": 3, "verseStart": 1, "verseEnd": 15, "label": "The Burning Bush"},
   {"book": "Exodus", "chapter": 7, "verseStart": 14, "verseEnd": 25, "label": "The Plagues Begin"},
   {"book": "Exodus", "chapter": 12, "verseStart": 1, "verseEnd": 14, "label": "The Passover"},
   {"book": "Exodus", "chapter": 14, "verseStart": 10, "verseEnd": 31, "label": "Crossing the Red Sea"},
   {"book": "Exodus", "chapter": 20, "verseStart": 1, "verseEnd": 17, "label": "The Ten Commandments"}
 ]'::jsonb, 3),

('women-of-the-bible', 'Women of the Bible',
 'Meet the women whose courage, faith, and wisdom shaped the story of God''s people across the centuries.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Various',
 '[
   {"book": "Genesis", "chapter": 21, "verseStart": 1, "verseEnd": 7, "label": "Sarah — Mother of Nations"},
   {"book": "Ruth", "chapter": 1, "verseStart": 1, "verseEnd": 22, "label": "Ruth — Loyalty and Love"},
   {"book": "Ruth", "chapter": 4, "verseStart": 13, "verseEnd": 17, "label": "Ruth — Redeemed"},
   {"book": "Esther", "chapter": 4, "verseStart": 1, "verseEnd": 17, "label": "Esther — For Such a Time"},
   {"book": "Esther", "chapter": 7, "verseStart": 1, "verseEnd": 10, "label": "Esther — The King''s Banquet"},
   {"book": "Luke", "chapter": 1, "verseStart": 26, "verseEnd": 56, "label": "Mary — The Magnificat"},
   {"book": "John", "chapter": 4, "verseStart": 1, "verseEnd": 30, "label": "The Woman at the Well"},
   {"book": "John", "chapter": 20, "verseStart": 1, "verseEnd": 18, "label": "Mary Magdalene — First Witness"}
 ]'::jsonb, 4),

('rise-and-fall-of-kings', 'The Rise & Fall of Kings',
 'Power, glory, downfall, and repentance — trace the monarchy of Israel from its promising start to its tragic end.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Kingdom',
 '[
   {"book": "1 Samuel", "chapter": 16, "verseStart": 1, "verseEnd": 13, "label": "David Anointed King"},
   {"book": "1 Samuel", "chapter": 17, "verseStart": 40, "verseEnd": 51, "label": "David and Goliath"},
   {"book": "2 Samuel", "chapter": 7, "verseStart": 1, "verseEnd": 17, "label": "God''s Covenant with David"},
   {"book": "2 Samuel", "chapter": 11, "verseStart": 1, "verseEnd": 27, "label": "David''s Great Sin"},
   {"book": "1 Kings", "chapter": 3, "verseStart": 5, "verseEnd": 15, "label": "Solomon''s Wisdom"},
   {"book": "1 Kings", "chapter": 11, "verseStart": 1, "verseEnd": 13, "label": "Solomon''s Downfall"},
   {"book": "1 Kings", "chapter": 18, "verseStart": 20, "verseEnd": 40, "label": "Elijah on Mount Carmel"}
 ]'::jsonb, 5),

('letters-of-paul', 'Letters of Paul',
 'From persecutor to apostle — read Paul''s most powerful letters that defined Christian theology for two thousand years.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Early Church',
 '[
   {"book": "Acts", "chapter": 9, "verseStart": 1, "verseEnd": 22, "label": "Paul''s Conversion"},
   {"book": "Romans", "chapter": 8, "verseStart": 1, "verseEnd": 39, "label": "Nothing Can Separate Us"},
   {"book": "1 Corinthians", "chapter": 13, "verseStart": 1, "verseEnd": 13, "label": "The Love Chapter"},
   {"book": "Galatians", "chapter": 5, "verseStart": 1, "verseEnd": 26, "label": "Freedom in Christ"},
   {"book": "Philippians", "chapter": 2, "verseStart": 1, "verseEnd": 18, "label": "The Mind of Christ"},
   {"book": "Philippians", "chapter": 4, "verseStart": 4, "verseEnd": 13, "label": "Rejoice Always"},
   {"book": "2 Timothy", "chapter": 4, "verseStart": 6, "verseEnd": 18, "label": "Paul''s Final Words"}
 ]'::jsonb, 6),

('the-prophets-speak', 'The Prophets Speak',
 'Visions of fire, valleys of bones, and promises of a coming Messiah — hear the thundering voices of God''s prophets.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Prophets',
 '[
   {"book": "Isaiah", "chapter": 6, "verseStart": 1, "verseEnd": 13, "label": "Isaiah''s Vision of God"},
   {"book": "Isaiah", "chapter": 53, "verseStart": 1, "verseEnd": 12, "label": "The Suffering Servant"},
   {"book": "Jeremiah", "chapter": 1, "verseStart": 4, "verseEnd": 19, "label": "Jeremiah''s Calling"},
   {"book": "Jeremiah", "chapter": 31, "verseStart": 31, "verseEnd": 34, "label": "The New Covenant"},
   {"book": "Ezekiel", "chapter": 37, "verseStart": 1, "verseEnd": 14, "label": "Valley of Dry Bones"},
   {"book": "Daniel", "chapter": 3, "verseStart": 1, "verseEnd": 30, "label": "The Fiery Furnace"},
   {"book": "Daniel", "chapter": 6, "verseStart": 1, "verseEnd": 28, "label": "Daniel in the Lions'' Den"}
 ]'::jsonb, 7),

('betrayal-and-redemption', 'Betrayal & Redemption',
 'Broken trust, devastating consequences, and the surprising grace that follows — the Bible''s most powerful stories of betrayal and redemption.',
 '/bible/artwork/hero-creation-of-adam.webp', 'Various',
 '[
   {"book": "Genesis", "chapter": 37, "verseStart": 12, "verseEnd": 36, "label": "Joseph Sold by His Brothers"},
   {"book": "Genesis", "chapter": 45, "verseStart": 1, "verseEnd": 15, "label": "Joseph Forgives"},
   {"book": "Matthew", "chapter": 26, "verseStart": 14, "verseEnd": 25, "label": "Judas Betrays Jesus"},
   {"book": "Matthew", "chapter": 26, "verseStart": 69, "verseEnd": 75, "label": "Peter''s Denial"},
   {"book": "John", "chapter": 21, "verseStart": 15, "verseEnd": 19, "label": "Peter Restored"},
   {"book": "Luke", "chapter": 15, "verseStart": 11, "verseEnd": 32, "label": "The Prodigal Son"},
   {"book": "2 Samuel", "chapter": 12, "verseStart": 1, "verseEnd": 14, "label": "Nathan Confronts David"},
   {"book": "Psalms", "chapter": 51, "verseStart": 1, "verseEnd": 19, "label": "David''s Psalm of Repentance"}
 ]'::jsonb, 8)

ON CONFLICT (slug) DO NOTHING;
