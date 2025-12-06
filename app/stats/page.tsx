'use client';

import { useEffect, useState } from 'react';
import { calculateGlobalStats, calculateSuccessRate, getMostDifficultCards } from '../../lib/stats';
import { getCards, getDecks, getStats } from '../../lib/storage';
import { CardStats, Deck, Flashcard } from '../../lib/types';

export default function StatsPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [allStats, setAllStats] = useState<CardStats[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setDecks(getDecks());
    setAllCards(getCards());
    setAllStats(getStats());
  };

  const globalStats = calculateGlobalStats(allStats);
  
  const deckStats = selectedDeckId
    ? (() => {
        const deckCards = allCards.filter(c => c.deckId === selectedDeckId);
        const deckCardIds = deckCards.map(c => c.id);
        const deckStatsData = allStats.filter(s => deckCardIds.includes(s.cardId));
        return calculateGlobalStats(deckStatsData);
      })()
    : globalStats;

  const difficultCards = getMostDifficultCards(
    selectedDeckId 
      ? allStats.filter(s => allCards.find(c => c.id === s.cardId && c.deckId === selectedDeckId))
      : allStats,
    5
  );

  const cardsNeverReviewed = allCards.filter(
    card => !allStats.some(s => s.cardId === card.id)
  ).filter(card => !selectedDeckId || card.deckId === selectedDeckId);

  const favoriteCards = allCards.filter(c => c.isFavorite)
    .filter(card => !selectedDeckId || card.deckId === selectedDeckId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">📊 Statistiques</h1>
          <p className="text-black">Suivez votre progression</p>
        </div>

        {/* Sélection de deck */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <label className="block text-sm font-medium mb-3 text-black">
            Filtrer par deck (optionnel)
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDeckId(null)}
              className={`px-4 py-2 rounded-lg transition ${
                !selectedDeckId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              Tous les decks
            </button>
            {decks.map(deck => (
              <button
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className={`px-4 py-2 rounded-lg transition ${
                  selectedDeckId === deck.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
              >
                {deck.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {deckStats.totalReviews}
            </div>
            <div className="text-sm text-black">Révisions totales</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">
              {deckStats.totalCorrect}
            </div>
            <div className="text-sm text-black">Réponses correctes</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-red-600 mb-2">
              {deckStats.totalIncorrect}
            </div>
            <div className="text-sm text-black">Réponses incorrectes</div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {deckStats.successRate.toFixed(1)}%
            </div>
            <div className="text-sm text-black">Taux de réussite</div>
          </div>
        </div>

        {/* Vue d'ensemble */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              📚 Cartes totales
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Nombre total de cartes</span>
                <span className="text-2xl font-bold text-blue-600">
                  {selectedDeckId 
                    ? allCards.filter(c => c.deckId === selectedDeckId).length
                    : allCards.length
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Cartes favorites</span>
                <span className="text-xl font-semibold text-yellow-600">
                  {favoriteCards.length} ⭐
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-black">Jamais révisées</span>
                <span className="text-xl font-semibold text-black">
                  {cardsNeverReviewed.length}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              📦 Decks
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-black">Nombre de decks</span>
                <span className="text-2xl font-bold text-green-600">
                  {decks.length}
                </span>
              </div>
              {selectedDeckId && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold text-blue-900">
                    {decks.find(d => d.id === selectedDeckId)?.name}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    {allCards.filter(c => c.deckId === selectedDeckId).length} cartes
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cartes difficiles */}
        {difficultCards.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-black">
              ⚠️ Cartes les plus difficiles
            </h2>
            <div className="space-y-3">
              {difficultCards.map(stat => {
                const card = allCards.find(c => c.id === stat.cardId);
                if (!card) return null;
                
                const successRate = calculateSuccessRate(stat);
                
                return (
                  <div
                    key={stat.cardId}
                    className="flex justify-between items-center p-3 bg-red-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-black">{card.front}</div>
                      <div className="text-sm text-black">{card.back}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-red-600">
                        {successRate.toFixed(0)}%
                      </div>
                      <div className="text-xs text-black">
                        {stat.correct}✓ / {stat.incorrect}✗
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Liste des decks avec stats */}
        {!selectedDeckId && decks.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-black">Détail par deck</h2>
            <div className="space-y-3">
              {decks.map(deck => {
                const deckCards = allCards.filter(c => c.deckId === deck.id);
                const deckCardIds = deckCards.map(c => c.id);
                const deckStatsData = allStats.filter(s => deckCardIds.includes(s.cardId));
                const stats = calculateGlobalStats(deckStatsData);
                
                return (
                  <div
                    key={deck.id}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-300 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-lg text-black">{deck.name}</div>
                        <div className="text-sm text-black">
                          {deckCards.length} cartes
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600">
                          {stats.successRate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-black">
                          {stats.totalReviews} révisions
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message si pas de stats */}
        {globalStats.totalReviews === 0 && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-black mb-4">
              📊 Aucune statistique disponible
            </p>
            <p className="text-black mb-6">
              Commencez à réviser vos cartes pour voir vos progrès !
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-block"
            >
              Commencer une révision
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
