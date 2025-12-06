import defaultData from '../data/defaultCards.json';
import { getCards, getDecks, saveCard, saveDeck } from './storage';

/**
 * Initialise les données par défaut si le localStorage est vide
 */
export function initializeDefaultData(): void {
  const existingDecks = getDecks();
  const existingCards = getCards();

  // Si des données existent déjà, ne rien faire
  if (existingDecks.length > 0 || existingCards.length > 0) {
    return;
  }

  // Charger les decks par défaut
  if (defaultData.decks) {
    defaultData.decks.forEach((deck: any) => {
      saveDeck({
        ...deck,
        createdAt: new Date(deck.createdAt),
        updatedAt: new Date(deck.updatedAt),
      });
    });
  }

  // Charger les cartes par défaut
  if (defaultData.cards) {
    defaultData.cards.forEach((card: any) => {
      saveCard({
        ...card,
        createdAt: new Date(card.createdAt),
        updatedAt: new Date(card.updatedAt),
      });
    });
  }

  console.log('✅ Données par défaut chargées avec succès');
}
