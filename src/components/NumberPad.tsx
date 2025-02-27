
import React, { useState } from 'react';
import { getNumbersByPattern } from '@/lib/betUtils';

interface NumberPadProps {
  onSelectNumber: (number: number) => void;
  selectedNumber: number | null;
}

type FilterType = 'all' | 'even' | 'odd' | 'high' | 'low';

const NumberPad: React.FC<NumberPadProps> = ({ 
  onSelectNumber, 
  selectedNumber 
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  
  // Get filtered numbers
  const numbers = getNumbersByPattern(filter);
  
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
      
      <div className="grid grid-cols-10 gap-1 sm:gap-2">
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
