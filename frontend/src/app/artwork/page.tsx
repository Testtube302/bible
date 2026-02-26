'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

const ARTWORK = [
  {
    src: '/bible/artwork/hero-creation-of-adam.webp',
    title: 'The Creation of Adam',
    artist: 'Michelangelo',
    year: 'c. 1512',
    description: 'A section of the Sistine Chapel ceiling depicting God giving life to Adam.',
  },
  {
    src: '/bible/artwork/dore/creation-of-light.webp',
    title: 'The Creation of Light',
    artist: 'Gustave Dore',
    year: '1866',
    description: 'God creates light on the first day of creation.',
  },
  {
    src: '/bible/artwork/dore/moses-tablets.webp',
    title: 'Moses Breaking the Tablets of the Law',
    artist: 'Gustave Dore',
    year: '1866',
    description: 'Moses shatters the stone tablets upon seeing the golden calf.',
  },
  {
    src: '/bible/artwork/dore/david-harp.webp',
    title: 'David Playing the Harp',
    artist: 'Gustave Dore',
    year: '1866',
    description: 'King David plays his harp in praise and worship.',
  },
  {
    src: '/bible/artwork/dore/daniel-lions.webp',
    title: "Daniel in the Lions' Den",
    artist: 'Gustave Dore',
    year: '1866',
    description: 'Daniel stands unharmed among the lions through faith in God.',
  },
  {
    src: '/bible/artwork/dore/sermon-on-mount.webp',
    title: 'The Sermon on the Mount',
    artist: 'Gustave Dore',
    year: '1866',
    description: 'Jesus delivers the Beatitudes to the multitude.',
  },
  {
    src: '/bible/artwork/last-supper.webp',
    title: 'The Last Supper',
    artist: 'Leonardo da Vinci',
    year: 'c. 1495-1498',
    description: 'Jesus shares his final meal with the twelve apostles.',
  },
  {
    src: '/bible/artwork/prodigal-son.webp',
    title: 'Return of the Prodigal Son',
    artist: 'Rembrandt',
    year: 'c. 1668',
    description: 'A father embraces his wayward son who has returned home.',
  },
  {
    src: '/bible/artwork/transfiguration.webp',
    title: 'The Transfiguration',
    artist: 'Raphael',
    year: '1516-1520',
    description: 'Christ is transfigured in glory on the mountaintop.',
  },
];

export default function ArtworkPage() {
  return (
    <div className="min-h-screen bg-dark-bg pb-20 sm:pb-4">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6">
        <h1 className="text-gold font-serif text-2xl font-bold mb-2">Sacred Art Gallery</h1>
        <p className="text-dark-muted text-sm mb-8">
          Public domain masterworks depicting scenes from Scripture
        </p>

        <div className="space-y-10">
          {ARTWORK.map((art) => (
            <article key={art.src} className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  src={art.src}
                  alt={art.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 960px"
                />
              </div>
              <div className="p-5">
                <h2 className="text-cream font-serif text-lg font-semibold">{art.title}</h2>
                <p className="text-gold/80 text-sm mt-1">
                  {art.artist} &middot; {art.year}
                </p>
                <p className="text-dark-muted text-sm mt-2">{art.description}</p>
              </div>
            </article>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
