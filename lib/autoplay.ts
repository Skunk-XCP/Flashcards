import { useCallback, useEffect, useRef, useState } from 'react';
import { sleep } from './utils';

export interface AutoplayOptions {
  delay: number; // en millisecondes
  onNext: () => void;
  isEnabled: boolean;
}

/**
 * Hook pour gérer le mode autoplay
 */
export function useAutoplay({ delay, onNext, isEnabled }: AutoplayOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stopAutoplay = useCallback(() => {
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const toggleAutoplay = useCallback(() => {
    if (isPlaying) {
      stopAutoplay();
    } else {
      startAutoplay();
    }
  }, [isPlaying, startAutoplay, stopAutoplay]);

  useEffect(() => {
    if (!isEnabled || !isPlaying) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    timeoutRef.current = setTimeout(() => {
      onNext();
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isEnabled, isPlaying, delay, onNext]);

  return {
    isPlaying,
    startAutoplay,
    stopAutoplay,
    toggleAutoplay,
  };
}

/**
 * Fonction pour auto-réviser une liste de cartes
 */
export async function autoReviewCards(
  cardIds: string[],
  delay: number,
  onCardReview: (cardId: string) => void | Promise<void>,
  shouldStop: () => boolean
): Promise<void> {
  for (const cardId of cardIds) {
    if (shouldStop()) break;
    
    await onCardReview(cardId);
    await sleep(delay);
  }
}
