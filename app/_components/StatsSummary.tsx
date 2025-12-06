'use client';

interface StatsSummaryProps {
  totalCards: number;
  correctCards: number;
  incorrectCards: number;
  successRate: number;
}

export default function StatsSummary({
  totalCards,
  correctCards,
  incorrectCards,
  successRate,
}: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600">{totalCards}</div>
        <div className="text-sm text-gray-600">Total</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">{correctCards}</div>
        <div className="text-sm text-gray-600">Correctes</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-red-600">{incorrectCards}</div>
        <div className="text-sm text-gray-600">Incorrectes</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">
          {successRate.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-600">Taux de réussite</div>
      </div>
    </div>
  );
}
