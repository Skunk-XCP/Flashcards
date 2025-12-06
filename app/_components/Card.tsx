'use client';

import { useState } from 'react';

interface CardProps {
  front: string;
  back: string;
  onFlip?: () => void;
}

export default function Card({ front, back, onFlip }: CardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onFlip?.();
  };

  return (
    <div
      className="relative w-full max-w-md h-64 cursor-pointer"
      onClick={handleFlip}
    >
      <div
        className={`absolute inset-0 transition-transform duration-500 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Face avant */}
        <div className="absolute inset-0 backface-hidden bg-white border-2 border-gray-300 rounded-lg shadow-lg flex items-center justify-center p-6">
          <p className="text-2xl font-semibold text-center">{front}</p>
        </div>
        
        {/* Face arrière */}
        <div className="absolute inset-0 backface-hidden bg-blue-50 border-2 border-blue-300 rounded-lg shadow-lg flex items-center justify-center p-6 rotate-y-180">
          <p className="text-xl text-center">{back}</p>
        </div>
      </div>
    </div>
  );
}
