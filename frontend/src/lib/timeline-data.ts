export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  era: string;
  yearLabel: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd: number;
}

export interface TimelineEra {
  name: string;
  color: string;
  events: TimelineEvent[];
}

export const TIMELINE_ERAS: TimelineEra[] = [
  {
    name: 'Creation',
    color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    events: [
      { id: 'creation', title: 'Creation of the World', description: 'God creates the heavens, earth, and humanity in six days', era: 'Creation', yearLabel: 'Beginning', book: 'Genesis', chapter: 1, verseStart: 1, verseEnd: 31 },
      { id: 'fall', title: 'The Fall of Man', description: 'Adam and Eve disobey God in the Garden of Eden', era: 'Creation', yearLabel: 'Beginning', book: 'Genesis', chapter: 3, verseStart: 1, verseEnd: 24 },
      { id: 'flood', title: 'The Great Flood', description: 'God cleanses the earth; Noah builds an ark', era: 'Creation', yearLabel: 'c. 2400 BC', book: 'Genesis', chapter: 7, verseStart: 1, verseEnd: 24 },
      { id: 'babel', title: 'Tower of Babel', description: 'Humanity tries to reach heaven; God scatters the nations', era: 'Creation', yearLabel: 'c. 2200 BC', book: 'Genesis', chapter: 11, verseStart: 1, verseEnd: 9 },
    ],
  },
  {
    name: 'Patriarchs',
    color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    events: [
      { id: 'abraham-call', title: 'Call of Abraham', description: 'God calls Abram to leave his home and promises to make him a great nation', era: 'Patriarchs', yearLabel: 'c. 2000 BC', book: 'Genesis', chapter: 12, verseStart: 1, verseEnd: 9 },
      { id: 'isaac-binding', title: 'Binding of Isaac', description: 'Abraham\'s ultimate test of faith on Mount Moriah', era: 'Patriarchs', yearLabel: 'c. 1900 BC', book: 'Genesis', chapter: 22, verseStart: 1, verseEnd: 19 },
      { id: 'jacob-ladder', title: 'Jacob\'s Ladder', description: 'Jacob dreams of a stairway to heaven with angels ascending', era: 'Patriarchs', yearLabel: 'c. 1800 BC', book: 'Genesis', chapter: 28, verseStart: 10, verseEnd: 22 },
      { id: 'joseph-egypt', title: 'Joseph in Egypt', description: 'Sold by his brothers, Joseph rises to become ruler of Egypt', era: 'Patriarchs', yearLabel: 'c. 1700 BC', book: 'Genesis', chapter: 41, verseStart: 38, verseEnd: 57 },
    ],
  },
  {
    name: 'Exodus',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    events: [
      { id: 'burning-bush', title: 'The Burning Bush', description: 'God calls Moses to free His people from Egyptian slavery', era: 'Exodus', yearLabel: 'c. 1446 BC', book: 'Exodus', chapter: 3, verseStart: 1, verseEnd: 15 },
      { id: 'passover', title: 'The Passover', description: 'The final plague — God passes over the homes marked with lamb\'s blood', era: 'Exodus', yearLabel: 'c. 1446 BC', book: 'Exodus', chapter: 12, verseStart: 1, verseEnd: 14 },
      { id: 'red-sea', title: 'Crossing the Red Sea', description: 'God parts the waters and Israel walks through on dry ground', era: 'Exodus', yearLabel: 'c. 1446 BC', book: 'Exodus', chapter: 14, verseStart: 21, verseEnd: 31 },
      { id: 'ten-commandments', title: 'The Ten Commandments', description: 'God gives His law to Moses on Mount Sinai', era: 'Exodus', yearLabel: 'c. 1446 BC', book: 'Exodus', chapter: 20, verseStart: 1, verseEnd: 17 },
    ],
  },
  {
    name: 'Kingdom',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    events: [
      { id: 'david-goliath', title: 'David & Goliath', description: 'A shepherd boy defeats the giant champion with a sling and a stone', era: 'Kingdom', yearLabel: 'c. 1025 BC', book: '1 Samuel', chapter: 17, verseStart: 40, verseEnd: 51 },
      { id: 'david-king', title: 'David Becomes King', description: 'The shepherd becomes the greatest king of Israel', era: 'Kingdom', yearLabel: 'c. 1010 BC', book: '2 Samuel', chapter: 5, verseStart: 1, verseEnd: 5 },
      { id: 'solomon-temple', title: 'Solomon\'s Temple', description: 'Solomon builds a magnificent temple for God in Jerusalem', era: 'Kingdom', yearLabel: 'c. 960 BC', book: '1 Kings', chapter: 6, verseStart: 1, verseEnd: 14 },
      { id: 'elijah-carmel', title: 'Elijah on Mount Carmel', description: 'The prophet challenges 450 prophets of Baal — and God answers with fire', era: 'Kingdom', yearLabel: 'c. 860 BC', book: '1 Kings', chapter: 18, verseStart: 30, verseEnd: 39 },
    ],
  },
  {
    name: 'Exile',
    color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    events: [
      { id: 'babylon-fall', title: 'Fall of Jerusalem', description: 'Babylon conquers Jerusalem and destroys Solomon\'s temple', era: 'Exile', yearLabel: '586 BC', book: '2 Kings', chapter: 25, verseStart: 1, verseEnd: 12 },
      { id: 'daniel-lions', title: 'Daniel in the Lions\' Den', description: 'Daniel refuses to stop praying and survives a night with lions', era: 'Exile', yearLabel: 'c. 539 BC', book: 'Daniel', chapter: 6, verseStart: 16, verseEnd: 28 },
      { id: 'dry-bones', title: 'Valley of Dry Bones', description: 'Ezekiel\'s vision: God promises to restore Israel from death to life', era: 'Exile', yearLabel: 'c. 570 BC', book: 'Ezekiel', chapter: 37, verseStart: 1, verseEnd: 14 },
    ],
  },
  {
    name: 'Jesus',
    color: 'bg-gold/20 text-gold border-gold/30',
    events: [
      { id: 'birth-jesus', title: 'Birth of Jesus', description: 'The promised Messiah is born in a manger in Bethlehem', era: 'Jesus', yearLabel: 'c. 4 BC', book: 'Luke', chapter: 2, verseStart: 1, verseEnd: 20 },
      { id: 'sermon-mount', title: 'Sermon on the Mount', description: 'Jesus delivers His most famous teaching: the Beatitudes', era: 'Jesus', yearLabel: 'c. 28 AD', book: 'Matthew', chapter: 5, verseStart: 1, verseEnd: 16 },
      { id: 'crucifixion', title: 'The Crucifixion', description: 'Jesus is crucified at Golgotha, giving His life for the world', era: 'Jesus', yearLabel: 'c. 30 AD', book: 'Luke', chapter: 23, verseStart: 33, verseEnd: 46 },
      { id: 'resurrection', title: 'The Resurrection', description: 'On the third day, Jesus rises from the dead', era: 'Jesus', yearLabel: 'c. 30 AD', book: 'Matthew', chapter: 28, verseStart: 1, verseEnd: 10 },
    ],
  },
  {
    name: 'Early Church',
    color: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
    events: [
      { id: 'pentecost', title: 'Pentecost', description: 'The Holy Spirit descends on the disciples; the Church is born', era: 'Early Church', yearLabel: 'c. 30 AD', book: 'Acts', chapter: 2, verseStart: 1, verseEnd: 13 },
      { id: 'paul-conversion', title: 'Paul\'s Conversion', description: 'Saul the persecutor encounters Christ on the road to Damascus', era: 'Early Church', yearLabel: 'c. 34 AD', book: 'Acts', chapter: 9, verseStart: 1, verseEnd: 22 },
      { id: 'revelation', title: 'The Revelation', description: 'John receives a vision of the end times and the new heaven and earth', era: 'Early Church', yearLabel: 'c. 95 AD', book: 'Revelation', chapter: 21, verseStart: 1, verseEnd: 7 },
    ],
  },
];
