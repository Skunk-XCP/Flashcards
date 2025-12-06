import { Flashcard } from './types';

/**
 * Mélange un tableau de manière aléatoire (Fisher-Yates shuffle)
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Choisit un élément aléatoire dans un tableau
 */
export function randomPick<T>(array: T[]): T | null {
  if (array.length === 0) return null;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Génère un ID unique simple
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Formatte une date en français
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Filtre les cartes selon différents critères
 */
export function filterCards(
  cards: Flashcard[],
  options: {
    onlyFavorites?: boolean;
    deckId?: string;
  }
): Flashcard[] {
  let filtered = [...cards];
  
  if (options.deckId) {
    filtered = filtered.filter((c) => c.deckId === options.deckId);
  }
  
  if (options.onlyFavorites) {
    filtered = filtered.filter((c) => c.isFavorite);
  }
  
  return filtered;
}

/**
 * Tronque un texte à une longueur donnée
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Attend un nombre de millisecondes (utile pour autoplay)
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
