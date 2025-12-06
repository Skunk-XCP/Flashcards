'use client';

interface CardActionsProps {
  onShowTranslation: () => void;
  onCorrect: () => void;
  onIncorrect: () => void;
  onToggleFavorite: () => void;
  onNext: () => void;
  isFavorite?: boolean;
}

export default function CardActions({
  onShowTranslation,
  onCorrect,
  onIncorrect,
  onToggleFavorite,
  onNext,
  isFavorite = false,
}: CardActionsProps) {
  return (
    <div className="flex flex-col gap-4 mt-6">
      <div className="flex gap-4 justify-center">
        <button
          onClick={onShowTranslation}
          className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Voir traduction
        </button>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={onIncorrect}
          className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xl"
        >
          ✖️ Incorrect
        </button>
        
        <button
          onClick={onCorrect}
          className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-xl"
        >
          ✔️ Correct
        </button>
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={onToggleFavorite}
          className={`px-6 py-2 rounded transition ${
            isFavorite
              ? 'bg-yellow-500 text-white hover:bg-yellow-600'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          {isFavorite ? '⭐ Favori' : '☆ Ajouter aux favoris'}
        </button>
        
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
