'use client';

import { useState } from 'react';

interface CardFormProps {
  initialFront?: string;
  initialBack?: string;
  onSave: (front: string, back: string) => void;
  onCancel?: () => void;
}

export default function CardForm({
  initialFront = '',
  initialBack = '',
  onSave,
  onCancel,
}: CardFormProps) {
  const [front, setFront] = useState(initialFront);
  const [back, setBack] = useState(initialBack);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (front.trim() && back.trim()) {
      onSave(front, back);
      setFront('');
      setBack('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label htmlFor="front" className="block text-sm font-medium mb-2">
          Recto (Question)
        </label>
        <textarea
          id="front"
          value={front}
          onChange={(e) => setFront(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
          placeholder="Entrez la question..."
          required
        />
      </div>
      
      <div>
        <label htmlFor="back" className="block text-sm font-medium mb-2">
          Verso (Réponse)
        </label>
        <textarea
          id="back"
          value={back}
          onChange={(e) => setBack(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows={3}
          placeholder="Entrez la réponse..."
          required
        />
      </div>
      
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Enregistrer
        </button>
        
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
