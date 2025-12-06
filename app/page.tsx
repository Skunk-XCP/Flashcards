'use client';

import { useEffect, useState } from 'react';
import { getCards, getDecks, saveCard, updateCardStats } from '../lib/storage';
import { Deck, Flashcard } from '../lib/types';
import { shuffle } from '../lib/utils';
import DeckSelector from './_components/DeckSelector';
import StatsSummary from './_components/StatsSummary';
import ToggleSwitch from './_components/ToggleSwitch';

export default function RevisionPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [wrongCards, setWrongCards] = useState<Set<string>>(new Set());
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });

  // Charger les données au montage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedDecks = getDecks();
    const loadedCards = getCards();
    setDecks(loadedDecks);
    setAllCards(loadedCards);
    
    // Sélectionner le premier deck par défaut
    if (loadedDecks.length > 0 && !selectedDeckId) {
      setSelectedDeckId(loadedDecks[0].id);
    }
  };

  // Filtrer et mélanger les cartes quand le deck ou les filtres changent
  useEffect(() => {
    if (!selectedDeckId) return;

    let filtered = allCards.filter(card => card.deckId === selectedDeckId);
    
    if (onlyFavorites) {
      filtered = filtered.filter(card => card.isFavorite);
    }
    
    if (onlyWrong) {
      filtered = filtered.filter(card => wrongCards.has(card.id));
    }

    const shuffled = shuffle(filtered);
    setCurrentCards(shuffled);
    setCurrentIndex(0);
    setShowTranslation(false);
  }, [selectedDeckId, allCards, onlyFavorites, onlyWrong, wrongCards]);

  const currentCard = currentCards[currentIndex];

  const handleNext = () => {
    setShowTranslation(false);
    if (currentIndex < currentCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Remélanger à la fin
      const shuffled = shuffle(currentCards);
      setCurrentCards(shuffled);
      setCurrentIndex(0);
    }
  };

  const handleCorrect = () => {
    if (!currentCard) return;
    
    updateCardStats(currentCard.id, true);
    setSessionStats(prev => ({ ...prev, correct: prev.correct + 1 }));
    
    // Retirer des cartes difficiles si présent
    if (wrongCards.has(currentCard.id)) {
      const newWrongCards = new Set(wrongCards);
      newWrongCards.delete(currentCard.id);
      setWrongCards(newWrongCards);
    }
    
    handleNext();
  };

  const handleIncorrect = () => {
    if (!currentCard) return;
    
    updateCardStats(currentCard.id, false);
    setSessionStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    
    // Ajouter aux cartes difficiles
    setWrongCards(prev => new Set(prev).add(currentCard.id));
    
    handleNext();
  };

  const handleToggleFavorite = () => {
    if (!currentCard) return;
    
    const updatedCard = { ...currentCard, isFavorite: !currentCard.isFavorite };
    saveCard(updatedCard);
    
    // Mettre à jour localement
    setAllCards(prev => prev.map(c => c.id === updatedCard.id ? updatedCard : c));
  };

  const handleDrawCard = () => {
    // Tirer une nouvelle carte aléatoire
    const shuffled = shuffle(currentCards);
    setCurrentCards(shuffled);
    setCurrentIndex(0);
    setShowTranslation(false);
  };

  const totalReviewed = sessionStats.correct + sessionStats.incorrect;
  const successRate = totalReviewed > 0 
    ? (sessionStats.correct / totalReviewed) * 100 
    : 0;

  if (decks.length === 0) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Aucun deck disponible</h2>
          <p className="text-black mb-6">Créez votre premier deck pour commencer</p>
          <a
            href="/create"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition inline-block"
          >
            Créer des cartes
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">🎴 Révision</h1>
          <p className="text-black">Améliorez votre vocabulaire carte par carte</p>
        </div>

        {/* Stats de session */}
        <StatsSummary
          totalCards={totalReviewed}
          correctCards={sessionStats.correct}
          incorrectCards={sessionStats.incorrect}
          successRate={successRate}
        />

        {/* Sélection de deck */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <DeckSelector
            decks={decks.map(d => ({
              id: d.id,
              name: d.name,
              count: allCards.filter(c => c.deckId === d.id).length
            }))}
            selectedDeckId={selectedDeckId}
            onSelectDeck={setSelectedDeckId}
          />
        </div>

        {/* Options de révision */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 space-y-3">
          <h3 className="font-semibold mb-4 text-black">Options de révision</h3>
          <ToggleSwitch
            label="Mode révision inversée"
            description="Langue natale → Langue cible"
            checked={isReversed}
            onChange={setIsReversed}
          />
          <ToggleSwitch
            label="Uniquement les cartes ratées"
            description="Réviser seulement les cartes difficiles"
            checked={onlyWrong}
            onChange={setOnlyWrong}
          />
          <ToggleSwitch
            label="Uniquement les favoris"
            description="Réviser les cartes favorites"
            checked={onlyFavorites}
            onChange={setOnlyFavorites}
          />
        </div>

        {/* Zone de carte */}
        {currentCard ? (
          <div className="mt-8">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-6">
                <span className="text-sm text-black">
                  Carte {currentIndex + 1} / {currentCards.length}
                </span>
                {wrongCards.has(currentCard.id) && (
                  <span className="ml-3 text-red-500 text-sm">⚠️ Difficile</span>
                )}
              </div>

              {/* Carte avec flip */}
              <div className="flex justify-center mb-8">
                <div 
                  onClick={() => setShowTranslation(!showTranslation)}
                  className="w-full max-w-md h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl shadow-xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 flex items-center justify-center p-8"
                >
                  <p className="text-3xl font-bold text-white text-center">
                    {showTranslation 
                      ? (isReversed ? currentCard.front : currentCard.back)
                      : (isReversed ? currentCard.back : currentCard.front)
                    }
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col gap-4">
                {!showTranslation ? (
                  <button
                    onClick={() => setShowTranslation(true)}
                    className="w-full px-6 py-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-lg font-semibold"
                  >
                    👁️ Voir la traduction
                  </button>
                ) : (
                  <div className="flex gap-4">
                    <button
                      onClick={handleIncorrect}
                      className="flex-1 px-6 py-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-lg font-semibold shadow-md hover:shadow-lg"
                    >
                      ✖️ Je ne connaissais pas
                    </button>
                    <button
                      onClick={handleCorrect}
                      className="flex-1 px-6 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-lg font-semibold shadow-md hover:shadow-lg"
                    >
                      ✔️ Je connaissais
                    </button>
                  </div>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={handleDrawCard}
                    className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                  >
                    🎲 Tirer une carte
                  </button>
                  <button
                    onClick={handleToggleFavorite}
                    className={`flex-1 px-4 py-2 rounded-lg transition ${
                      currentCard.isFavorite
                        ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                        : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                  >
                    {currentCard.isFavorite ? '⭐ Favori' : '☆ Ajouter aux favoris'}
                  </button>
                  <button
                    onClick={handleNext}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-xl text-black mb-4">
              {onlyWrong && wrongCards.size === 0 
                ? "🎉 Aucune carte difficile ! Vous maîtrisez tout !"
                : "Aucune carte disponible avec ces filtres"}
            </p>
            <button
              onClick={() => {
                setOnlyWrong(false);
                setOnlyFavorites(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
