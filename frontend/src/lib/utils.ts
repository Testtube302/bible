import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatVerseRef(book: string, chapter: number, verse?: number): string {
  if (verse !== undefined) {
    return `${book} ${chapter}:${verse}`;
  }
  return `${book} ${chapter}`;
}

export function getBookSlug(bookName: string): string {
  return encodeURIComponent(bookName);
}

export function decodeBookSlug(slug: string): string {
  return decodeURIComponent(slug);
}
