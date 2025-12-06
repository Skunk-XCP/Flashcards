'use client';

interface DeckSelectorProps {
  decks: { id: string; name: string; count: number }[];
  selectedDeckId: string | null;
  onSelectDeck: (deckId: string) => void;
}

export default function DeckSelector({
  decks,
  selectedDeckId,
  onSelectDeck,
}: DeckSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        Sélectionnez un deck
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {decks.map((deck) => (
          <button
            key={deck.id}
            onClick={() => onSelectDeck(deck.id)}
            className={`p-4 border-2 rounded-lg transition text-left ${
              selectedDeckId === deck.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">{deck.name}</div>
            <div className="text-sm text-gray-600 mt-1">
              {deck.count} carte{deck.count > 1 ? 's' : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
