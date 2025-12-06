'use client';

import { useEffect, useState } from 'react';
import { deleteCard, getCards, getDecks, saveCard, saveDeck } from '../../lib/storage';
import { Deck, Flashcard } from '../../lib/types';
import { generateId } from '../../lib/utils';
import DeckSelector from '../_components/DeckSelector';

export default function CreatePage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [allCards, setAllCards] = useState<Flashcard[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [newDeckName, setNewDeckName] = useState('');
  const [showNewDeckForm, setShowNewDeckForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedDecks = getDecks();
    const loadedCards = getCards();
    setDecks(loadedDecks);
    setAllCards(loadedCards);
    
    if (loadedDecks.length > 0 && !selectedDeckId) {
      setSelectedDeckId(loadedDecks[0].id);
    }
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim() || !selectedDeckId) return;

    const card: Flashcard = editingCardId
      ? {
          ...allCards.find(c => c.id === editingCardId)!,
          front: front.trim(),
          back: back.trim(),
          updatedAt: new Date(),
        }
      : {
          id: generateId(),
          front: front.trim(),
          back: back.trim(),
          deckId: selectedDeckId,
          isFavorite: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    saveCard(card);
    loadData();
    
    setFront('');
    setBack('');
    setEditingCardId(null);
  };

  const handleEditCard = (card: Flashcard) => {
    setFront(card.front);
    setBack(card.back);
    setEditingCardId(card.id);
    setSelectedDeckId(card.deckId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette carte ?')) {
      deleteCard(cardId);
      loadData();
    }
  };

  const handleCreateDeck = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDeckName.trim()) return;

    const newDeck: Deck = {
      id: generateId(),
      name: newDeckName.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    saveDeck(newDeck);
    setNewDeckName('');
    setShowNewDeckForm(false);
    loadData();
    setSelectedDeckId(newDeck.id);
  };

  const filteredCards = allCards
    .filter(card => selectedDeckId ? card.deckId === selectedDeckId : true)
    .filter(card => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return card.front.toLowerCase().includes(query) || 
             card.back.toLowerCase().includes(query);
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-black">✨ Création de cartes</h1>
          <p className="text-black">Créez et gérez vos flashcards</p>
        </div>

        {/* Gestion des decks */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">Sélectionner un deck</h2>
            <button
              onClick={() => setShowNewDeckForm(!showNewDeckForm)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              {showNewDeckForm ? 'Annuler' : '+ Nouveau deck'}
            </button>
          </div>

          {showNewDeckForm && (
            <form onSubmit={handleCreateDeck} className="mb-4 p-4 bg-green-50 rounded-lg">
              <input
                type="text"
                value={newDeckName}
                onChange={(e) => setNewDeckName(e.target.value)}
                placeholder="Nom du nouveau deck..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none mb-3"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                Créer le deck
              </button>
            </form>
          )}

          {decks.length > 0 ? (
            <DeckSelector
              decks={decks.map(d => ({
                id: d.id,
                name: d.name,
                count: allCards.filter(c => c.deckId === d.id).length
              }))}
              selectedDeckId={selectedDeckId}
              onSelectDeck={setSelectedDeckId}
            />
          ) : (
            <p className="text-black text-center py-4">
              Aucun deck disponible. Créez-en un pour commencer !
            </p>
          )}
        </div>

        {/* Formulaire de création */}
        {selectedDeckId && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-black">
              {editingCardId ? '✏️ Modifier la carte' : '➕ Nouvelle carte'}
            </h2>
            
            <form onSubmit={handleSaveCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Langue cible / Question
                </label>
                <textarea
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  placeholder="Ex: Hello, Bonjour, Qu'est-ce qu'une variable ?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Traduction / Réponse
                </label>
                <textarea
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  placeholder="Ex: Bonjour, Hello, Un conteneur pour stocker des valeurs"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                >
                  {editingCardId ? '💾 Enregistrer' : '➕ Ajouter la carte'}
                </button>
                
                {editingCardId && (
                  <button
                    type="button"
                    onClick={() => {
                      setFront('');
                      setBack('');
                      setEditingCardId(null);
                    }}
                    className="px-6 py-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* Liste des cartes */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-black">
              Cartes du deck ({filteredCards.length})
            </h2>
            
            {/* Barre de recherche */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Rechercher..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-64"
            />
          </div>

          {filteredCards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCards.map(card => (
                <div
                  key={card.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-300 transition"
                >
                  <div className="mb-3">
                    <div className="text-sm text-black mb-1">Question</div>
                    <div className="font-semibold text-lg text-black">{card.front}</div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-black mb-1">Réponse</div>
                    <div className="text-black">{card.back}</div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEditCard(card)}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>

                  {card.isFavorite && (
                    <div className="mt-2 text-center text-yellow-500 text-sm">
                      ⭐ Favori
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-black">
              {searchQuery ? (
                <>
                  <p className="text-lg mb-2">Aucun résultat pour "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-500 hover:underline"
                  >
                    Effacer la recherche
                  </button>
                </>
              ) : (
                <>
                  <p className="text-lg mb-2">Aucune carte dans ce deck</p>
                  <p className="text-sm">Créez votre première carte ci-dessus !</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
