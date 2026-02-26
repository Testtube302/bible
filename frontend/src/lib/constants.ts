export const TRANSLATIONS = ['KJV', 'WEB', 'ASV'] as const;
export type Translation = (typeof TRANSLATIONS)[number];

export const HIGHLIGHT_COLORS = [
  { name: 'gold', label: 'Gold', class: 'highlight-gold' },
  { name: 'blue', label: 'Blue', class: 'highlight-blue' },
  { name: 'green', label: 'Green', class: 'highlight-green' },
  { name: 'purple', label: 'Purple', class: 'highlight-purple' },
] as const;

export const CHAT_MODES = [
  { value: 'scripture_only', label: 'Scripture Only', description: 'Returns only quoted verses' },
  { value: 'explain', label: 'Explain', description: 'Explains with Scripture citations' },
  { value: 'debate', label: 'Compare', description: 'Presents different interpretations' },
] as const;

export type ChatMode = (typeof CHAT_MODES)[number]['value'];

export const OT_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
  'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah',
  'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
  'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
  'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
];

export const NT_BOOKS = [
  'Matthew', 'Mark', 'Luke', 'John', 'Acts',
  'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation',
];
