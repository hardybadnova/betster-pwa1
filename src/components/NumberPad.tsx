
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
        <h3 className="text-lg font-semibold premium-text-gradient">Select a Number</h3>
        
        <div className="flex space-x-1">
          {(['all', 'even', 'odd', 'high', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                filter === f
                  ? 'bg-[#9b87f5] text-white'
                  : 'bg-[#1A1F2C] border border-[#9b87f5]/20 text-white hover:bg-[#9b87f5]/20'
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
            className={`number-chip aspect-square flex items-center justify-center rounded-md text-sm font-medium ${
              selectedNumber === number
                ? 'bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] text-white ring-2 ring-[#9b87f5]/50'
                : 'bg-[#1A1F2C] hover:bg-[#9b87f5]/20 border border-[#9b87f5]/20 text-white'
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
