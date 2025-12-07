export interface Flashcard {
  id: string;
  front: string;
  back: string;
  context?: string;
  deckId: string;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardStats {
  cardId: string;
  correct: number;
  incorrect: number;
  lastReviewed: Date | null;
}

export interface RevisionSession {
  id: string;
  deckId: string;
  startedAt: Date;
  completedAt: Date | null;
  cards: {
    cardId: string;
    wasCorrect: boolean;
  }[];
}

export enum RevisionMode {
  NORMAL = 'normal',
  REVERSE = 'reverse',
  WRONG_ONLY = 'wrong_only',
  FAVORITES = 'favorites',
}

export interface AppSettings {
  autoplayDelay: number; // en millisecondes
  defaultRevisionMode: RevisionMode;
  showTranslationByDefault: boolean;
}
