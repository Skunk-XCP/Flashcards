'use client';

import { useEffect, useState } from 'react';
import { getCards, getDecks, saveCard, updateCardStats } from '../lib/storage';
import { Deck, Flashcard } from '../lib/types';
import { shuffle } from '../lib/utils';
import StatsSummary from './_components/StatsSummary';
import ToggleSwitch from './_components/ToggleSwitch';

export default function RevisionPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  const [currentCards, setCurrentCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [onlyWrong, setOnlyWrong] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [wrongCards, setWrongCards] = useState<Set<string>>(new Set());
  const [sessionStats, setSessionStats] = useState({ correct: 0, incorrect: 0 });
  const [multiSelection, setMultiSelection] = useState(false);
  const [showDeckSelection, setShowDeckSelection] = useState(true);
  const [showOptions, setShowOptions] = useState(true);

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
    if (loadedDecks.length > 0 && selectedDeckIds.length === 0) {
      setSelectedDeckIds([loadedDecks[0].id]);
    }
  };

  // Filtrer et mélanger les cartes quand les decks ou les filtres changent
  useEffect(() => {
    if (selectedDeckIds.length === 0) return;

    let filtered = allCards.filter(card => selectedDeckIds.includes(card.deckId));
    
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
  }, [selectedDeckIds, allCards, onlyFavorites, onlyWrong, wrongCards]);

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

        {/* Sélection de deck(s) */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowDeckSelection(!showDeckSelection)}
              className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition"
            >
              <span>{showDeckSelection ? '▼' : '▶'}</span>
              <span>{multiSelection ? 'Sélectionnez un ou plusieurs decks' : 'Sélectionnez un deck'}</span>
            </button>
            {multiSelection && showDeckSelection && (
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedDeckIds(decks.map(d => d.id))}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Tout sélectionner
                </button>
                <button
                  onClick={() => setSelectedDeckIds([])}
                  className="px-3 py-1 text-sm bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                >
                  Tout désélectionner
                </button>
              </div>
            )}
          </div>
          
          {showDeckSelection && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {decks.map((deck) => {
              const cardCount = allCards.filter(c => c.deckId === deck.id).length;
              const isSelected = selectedDeckIds.includes(deck.id);
              
              return (
                <button
                  key={deck.id}
                  onClick={() => {
                    if (multiSelection) {
                      // Mode multi-sélection
                      if (isSelected) {
                        setSelectedDeckIds(selectedDeckIds.filter(id => id !== deck.id));
                      } else {
                        setSelectedDeckIds([...selectedDeckIds, deck.id]);
                      }
                    } else {
                      // Mode sélection simple
                      setSelectedDeckIds([deck.id]);
                    }
                  }}
                  className={`p-4 border-2 rounded-lg transition text-left ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {multiSelection && (
                      <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-black">{deck.name}</div>
                      <div className="text-sm text-black mt-1">
                        {cardCount} carte{cardCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          )}
          
          {selectedDeckIds.length > 0 && showDeckSelection && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                {multiSelection ? (
                  <><strong>{selectedDeckIds.length}</strong> deck(s) sélectionné(s) • </>
                ) : null}
                <strong className={multiSelection ? 'ml-0' : ''}>{currentCards.length}</strong> carte(s) disponible(s)
              </p>
            </div>
          )}
        </div>

        {/* Options de révision */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex items-center gap-2 text-lg font-semibold text-black hover:text-blue-600 transition mb-4"
          >
            <span>{showOptions ? '▼' : '▶'}</span>
            <span>Options de révision</span>
          </button>
          
          {showOptions && (
          <div className="space-y-3">
          <ToggleSwitch
            label="Multi-sélection de decks"
            description="Sélectionnez plusieurs decks pour réviser leurs cartes ensemble"
            checked={multiSelection}
            onChange={(value) => {
              setMultiSelection(value);
              // Si on désactive la multi-sélection et qu'on a plusieurs decks sélectionnés,
              // garder seulement le premier
              if (!value && selectedDeckIds.length > 1) {
                setSelectedDeckIds([selectedDeckIds[0]]);
              }
            }}
          />
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
          )}
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
