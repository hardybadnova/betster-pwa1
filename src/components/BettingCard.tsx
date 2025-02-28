
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { calculatePotentialWinnings, formatCurrency } from '@/lib/betUtils';
import { ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';

interface BettingCardProps {
  gameId: string;
  selectedNumber: number | null;
  onSuccess?: () => void;
  onError?: (message: string) => void;
  gameType?: 'bluff' | 'top-spot' | 'jackpot';
}

const BettingCard: React.FC<BettingCardProps> = ({ 
  gameId, 
  selectedNumber,
  onSuccess,
  onError,
  gameType = 'bluff'
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
  
  // Calculate potential winnings based on game type
  const calculateWinnings = (): number => {
    const totalPool = game.bets.reduce((sum, bet) => sum + bet.amount, 0) + betAmount;
    const afterTaxAndFee = totalPool * 0.72 * 0.9; // Deduct 28% GST and 10% house fee
    
    if (gameType === 'bluff') {
      return afterTaxAndFee * 0.5; // 50% of pool for first place
    } else {
      return afterTaxAndFee; // 90% of pool for first place in top-spot and jackpot
    }
  };
  
  // Calculate potential winnings
  const winnings = game.bets.length > 0 ? calculateWinnings() : calculatePotentialWinnings(betAmount);
  
  // Handle bet amount change
  const handleIncrease = () => {
    const incrementAmount = gameType === 'jackpot' ? 500 : 100;
    if (betAmount + incrementAmount <= maxBet) {
      setBetAmount(betAmount + incrementAmount);
    }
  };
  
  const handleDecrease = () => {
    const decrementAmount = gameType === 'jackpot' ? 500 : 100;
    if (betAmount - decrementAmount >= minBet) {
      setBetAmount(betAmount - decrementAmount);
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

  // Prize distribution details based on game type
  const getPrizeDistribution = () => {
    if (gameType === 'bluff') {
      return (
        <div className="text-xs text-gray-400 mt-2 bg-[#1A1F2C] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <AlertCircle className="h-3 w-3 mr-1 text-[#9b87f5]" />
            <span className="font-medium text-white">Prize Distribution</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>1st place (least chosen number): 50% of pool</li>
            <li>2nd place: 25% of pool</li>
            <li>3rd place: 15% of pool</li>
            <li>28% GST tax deducted</li>
            <li>10% house fee</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="text-xs text-gray-400 mt-2 bg-[#1A1F2C] rounded-lg p-3">
          <div className="flex items-center mb-1">
            <AlertCircle className="h-3 w-3 mr-1 text-amber-500" />
            <span className="font-medium text-white">Prize Distribution</span>
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>Winner (least chosen number): 90% of pool</li>
            <li>28% GST tax deducted</li>
            <li>10% house fee</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="premium-glass-card p-6 w-full max-w-md mx-auto animate-slide-up">
      <h3 className="text-lg font-semibold mb-4 premium-text-gradient">Place Your Bet</h3>
      
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
              className="h-8 w-8 rounded-full flex items-center justify-center bg-[#1A1F2C] border border-[#9b87f5]/20 hover:bg-[#9b87f5]/10 disabled:opacity-50 transition-colors"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            
            <span className="font-bold text-lg">{formatCurrency(betAmount)}</span>
            
            <button 
              onClick={handleIncrease}
              disabled={betAmount >= maxBet || betAmount >= currentUser.balance}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-[#1A1F2C] border border-[#9b87f5]/20 hover:bg-[#9b87f5]/10 disabled:opacity-50 transition-colors"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">Potential Win:</span>
          <span className="font-bold text-emerald-500">{formatCurrency(winnings)}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Min: {formatCurrency(minBet)}</span>
          <span>Max: {formatCurrency(maxBet)}</span>
        </div>
        
        {getPrizeDistribution()}
      </div>
      
      <button
        onClick={handlePlaceBet}
        disabled={selectedNumber === null || betAmount > currentUser.balance || game.status !== 'active'}
        className="w-full py-3 px-4 premium-button-gradient text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
        Choose the least selected number to win!
      </p>
    </div>
  );
};

export default BettingCard;
