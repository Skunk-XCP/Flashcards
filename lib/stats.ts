import { CardStats } from './types';

/**
 * Calcule le taux de réussite pour une carte
 */
export function calculateSuccessRate(stats: CardStats): number {
  const total = stats.correct + stats.incorrect;
  if (total === 0) return 0;
  return (stats.correct / total) * 100;
}

/**
 * Calcule les statistiques globales
 */
export function calculateGlobalStats(allStats: CardStats[]) {
  const totalCorrect = allStats.reduce((sum, s) => sum + s.correct, 0);
  const totalIncorrect = allStats.reduce((sum, s) => sum + s.incorrect, 0);
  const total = totalCorrect + totalIncorrect;
  
  return {
    totalReviews: total,
    totalCorrect,
    totalIncorrect,
    successRate: total > 0 ? (totalCorrect / total) * 100 : 0,
  };
}

/**
 * Calcule les statistiques pour un deck spécifique
 */
export function calculateDeckStats(
  allStats: CardStats[],
  cardIdsInDeck: string[]
) {
  const deckStats = allStats.filter((s) => cardIdsInDeck.includes(s.cardId));
  return calculateGlobalStats(deckStats);
}

/**
 * Trouve les cartes les plus difficiles
 */
export function getMostDifficultCards(
  allStats: CardStats[],
  limit: number = 10
): CardStats[] {
  return [...allStats]
    .filter((s) => s.correct + s.incorrect > 0)
    .sort((a, b) => {
      const rateA = calculateSuccessRate(a);
      const rateB = calculateSuccessRate(b);
      return rateA - rateB; // Taux de réussite croissant
    })
    .slice(0, limit);
}

/**
 * Trouve les cartes jamais révisées
 */
export function getNeverReviewedCards(
  allCardIds: string[],
  allStats: CardStats[]
): string[] {
  const reviewedCardIds = new Set(allStats.map((s) => s.cardId));
  return allCardIds.filter((id) => !reviewedCardIds.has(id));
}

/**
 * Calcule le nombre de révisions par jour
 */
export function getReviewsPerDay(allStats: CardStats[]): Map<string, number> {
  const reviewsByDay = new Map<string, number>();
  
  allStats.forEach((stats) => {
    if (stats.lastReviewed) {
      const date = new Date(stats.lastReviewed);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD
      
      const total = stats.correct + stats.incorrect;
      reviewsByDay.set(dateKey, (reviewsByDay.get(dateKey) || 0) + total);
    }
  });
  
  return reviewsByDay;
}
