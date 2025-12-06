import { AppSettings, CardStats, Deck, Flashcard, RevisionMode } from './types';

// Clés localStorage
const STORAGE_KEYS = {
  DECKS: 'flashcards_decks',
  CARDS: 'flashcards_cards',
  STATS: 'flashcards_stats',
  SETTINGS: 'flashcards_settings',
  SESSION_STATS: 'flashcards_session_stats',
  WRONG_CARDS: 'flashcards_wrong_cards',
};

// Vérifier si on est côté client
const isClient = typeof window !== 'undefined';

// ===== DECKS =====

export function getDecks(): Deck[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.DECKS);
  return data ? JSON.parse(data) : [];
}

export function getDeckById(id: string): Deck | null {
  const decks = getDecks();
  return decks.find((d) => d.id === id) || null;
}

export function saveDeck(deck: Deck): void {
  if (!isClient) return;
  const decks = getDecks();
  const index = decks.findIndex((d) => d.id === deck.id);
  
  if (index >= 0) {
    decks[index] = { ...deck, updatedAt: new Date() };
  } else {
    decks.push(deck);
  }
  
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
}

export function deleteDeck(id: string): void {
  if (!isClient) return;
  const decks = getDecks().filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(decks));
  
  // Supprimer aussi les cartes associées
  const cards = getCards().filter((c) => c.deckId !== id);
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

// ===== CARDS =====

export function getCards(): Flashcard[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.CARDS);
  return data ? JSON.parse(data) : [];
}

export function getCardsByDeck(deckId: string): Flashcard[] {
  return getCards().filter((c) => c.deckId === deckId);
}

export function getCardById(id: string): Flashcard | null {
  const cards = getCards();
  return cards.find((c) => c.id === id) || null;
}

export function saveCard(card: Flashcard): void {
  if (!isClient) return;
  const cards = getCards();
  const index = cards.findIndex((c) => c.id === card.id);
  
  if (index >= 0) {
    cards[index] = { ...card, updatedAt: new Date() };
  } else {
    cards.push(card);
  }
  
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

export function deleteCard(id: string): void {
  if (!isClient) return;
  const cards = getCards().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
}

// ===== STATS =====

export function getStats(): CardStats[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  return data ? JSON.parse(data) : [];
}

export function getStatsByCard(cardId: string): CardStats | null {
  const stats = getStats();
  return stats.find((s) => s.cardId === cardId) || null;
}

export function updateCardStats(
  cardId: string,
  wasCorrect: boolean
): void {
  if (!isClient) return;
  const stats = getStats();
  const index = stats.findIndex((s) => s.cardId === cardId);
  
  if (index >= 0) {
    if (wasCorrect) {
      stats[index].correct += 1;
    } else {
      stats[index].incorrect += 1;
    }
    stats[index].lastReviewed = new Date();
  } else {
    stats.push({
      cardId,
      correct: wasCorrect ? 1 : 0,
      incorrect: wasCorrect ? 0 : 1,
      lastReviewed: new Date(),
    });
  }
  
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

// ===== SETTINGS =====

const DEFAULT_SETTINGS: AppSettings = {
  autoplayDelay: 3000,
  defaultRevisionMode: RevisionMode.NORMAL,
  showTranslationByDefault: false,
};

export function getSettings(): AppSettings {
  if (!isClient) return DEFAULT_SETTINGS;
  const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return data ? JSON.parse(data) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ===== SESSION STATS =====

export interface SessionStats {
  correct: number;
  incorrect: number;
}

export function getSessionStats(): SessionStats {
  if (!isClient) return { correct: 0, incorrect: 0 };
  const data = localStorage.getItem(STORAGE_KEYS.SESSION_STATS);
  return data ? JSON.parse(data) : { correct: 0, incorrect: 0 };
}

export function saveSessionStats(stats: SessionStats): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify(stats));
}

export function resetSessionStats(): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.SESSION_STATS, JSON.stringify({ correct: 0, incorrect: 0 }));
}

export function getWrongCards(): string[] {
  if (!isClient) return [];
  const data = localStorage.getItem(STORAGE_KEYS.WRONG_CARDS);
  return data ? JSON.parse(data) : [];
}

export function saveWrongCards(cardIds: string[]): void {
  if (!isClient) return;
  localStorage.setItem(STORAGE_KEYS.WRONG_CARDS, JSON.stringify(cardIds));
}

// ===== IMPORT / EXPORT =====

export function exportData(): string {
  if (!isClient) return '{}';
  return JSON.stringify({
    decks: getDecks(),
    cards: getCards(),
    stats: getStats(),
    settings: getSettings(),
  }, null, 2);
}

export function importData(jsonData: string): boolean {
  if (!isClient) return false;
  try {
    const data = JSON.parse(jsonData);
    
    if (data.decks) {
      localStorage.setItem(STORAGE_KEYS.DECKS, JSON.stringify(data.decks));
    }
    if (data.cards) {
      localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(data.cards));
    }
    if (data.stats) {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(data.stats));
    }
    if (data.settings) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'import:', error);
    return false;
  }
}
