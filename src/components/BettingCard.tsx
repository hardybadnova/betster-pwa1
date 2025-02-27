
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { calculatePotentialWinnings, formatCurrency } from '@/lib/betUtils';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface BettingCardProps {
  gameId: string;
  selectedNumber: number | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

const BettingCard: React.FC<BettingCardProps> = ({ 
  gameId, 
  selectedNumber,
  onSuccess,
  onError
}) => {
  const { placeBet, games, currentUser } = useGameContext();
  const [betAmount, setBetAmount] = useState<number>(100);
  
  // Find the current game
  const game = games.find(g => g.id === gameId);
  
  if (!game) {
    return <div>Game not found</div>;
  }
  
  // Calculate min, max bet from game settings
  const { minBet, maxBet } = game;
  
  // Calculate potential winnings
  const winnings = calculatePotentialWinnings(betAmount);
  
  // Handle bet amount change
  const handleIncrease = () => {
    if (betAmount + 100 <= maxBet) {
      setBetAmount(betAmount + 100);
    }
  };
  
  const handleDecrease = () => {
    if (betAmount - 100 >= minBet) {
      setBetAmount(betAmount - 100);
    }
  };
  
  // Handle placing bet
  const handlePlaceBet = () => {
    if (selectedNumber === null) {
      onError?.('Please select a number to bet on');
      return;
    }
    
    if (betAmount > currentUser.balance) {
      onError?.('Insufficient balance');
      return;
    }
    
    const success = placeBet(gameId, selectedNumber, betAmount);
    
    if (success) {
      onSuccess?.();
    } else {
      onError?.('Failed to place bet. Check game status and your balance.');
    }
  };

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto animate-slide-up">
      <h3 className="text-lg font-semibold mb-4">Place Your Bet</h3>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Selected Number:</span>
          {selectedNumber === null ? (
            <span className="font-medium text-amber-500">Select a number</span>
          ) : (
            <span className="font-bold text-xl">{selectedNumber}</span>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">Bet Amount:</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleDecrease}
              disabled={betAmount <= minBet}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <span className="font-bold text-lg">{formatCurrency(betAmount)}</span>
            
            <button 
              onClick={handleIncrease}
              disabled={betAmount >= maxBet || betAmount >= currentUser.balance}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-secondary hover:bg-secondary/80 disabled:opacity-50"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Potential Win:</span>
          <span className="font-bold text-emerald-500">{formatCurrency(winnings)}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-6">
          <span>Min: {formatCurrency(minBet)}</span>
          <span>Max: {formatCurrency(maxBet)}</span>
        </div>
      </div>
      
      <button
        onClick={handlePlaceBet}
        disabled={selectedNumber === null || betAmount > currentUser.balance || game.status !== 'active'}
        className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {selectedNumber === null 
          ? 'Select a Number' 
          : betAmount > currentUser.balance 
            ? 'Insufficient Balance' 
            : game.status !== 'active'
              ? 'Game Not Active'
              : 'Place Bet'}
      </button>
      
      <p className="text-xs text-muted-foreground text-center mt-2">
        10x payout if your number is drawn
      </p>
    </div>
  );
};

export default BettingCard;
