
import React, { useState } from 'react';
import { getNumbersByPattern } from '@/lib/betUtils';

interface NumberPadProps {
  onSelectNumber: (number: number) => void;
  selectedNumber: number | null;
  maxNumber?: number; // New prop to limit the maximum number
}

type FilterType = 'all' | 'even' | 'odd' | 'high' | 'low';

const NumberPad: React.FC<NumberPadProps> = ({ 
  onSelectNumber, 
  selectedNumber,
  maxNumber = 100 // Default to 100 if not specified
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Get filtered numbers, limited by maxNumber
  const getFilteredNumbers = () => {
    const allNumbers = getNumbersByPattern(filter);
    return allNumbers.filter(num => num <= maxNumber);
  };
  
  const numbers = getFilteredNumbers();
  
  // Calculate grid columns based on maxNumber
  const getGridCols = () => {
    if (maxNumber <= 15) return 'grid-cols-4'; // 4 columns for 0-15
    if (maxNumber <= 36) return 'grid-cols-6'; // 6 columns for larger ranges
    return 'grid-cols-10'; // 10 columns for full range
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Select a Number</h3>
        
        <div className="flex space-x-1">
          {(['all', 'even', 'odd', 'high', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className={`grid ${getGridCols()} gap-2`}>
        {numbers.map((number) => (
          <button
            key={number}
            onClick={() => onSelectNumber(number)}
            className={`number-chip aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all ${
              selectedNumber === number
                ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                : 'bg-secondary hover:bg-secondary/80'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NumberPad;
